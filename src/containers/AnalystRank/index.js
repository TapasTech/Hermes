import React from 'react';
import { Link } from 'react-router';

import Store from '#/store';
import { Avatar, LoadMore } from '#/components';
import { GraphqlRest, encodeField } from '#/utils';

import styles from './style.less';

export default class AnalystRank extends React.Component {
  static propTypes = {
    name: React.PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = {
      data: [],
      currentPage: 1,
      totalPages: 0,
      user: Store.user.index().data
    };
  }

  prepareAnalysts(page = 1) {
    const query = `
      bestAnalysts(page: ${page}) {
        data {
          id
          displayName
          answersCount
          upVotesCount
          followed
          goodAtTopics {
            id
            name
          }
        }
        meta { current_page total_pages total_count }
      }
    `;

    const callback = data => {
      const { bestAnalysts } = data;
      this.setState({
        data: [
          ...this.state.data,
          ...bestAnalysts.data
        ],
        currentPage: bestAnalysts.meta.current_page,
        totalPages: bestAnalysts.meta.total_pages
      });
    }
    return {
      query,
      callback
    }
  }

  handleLoadMore() {
    GraphqlRest.handleQueries(
      this.prepareAnalysts(this.state.currentPage + 1)
    );
  }

  followMutation(status, id) {
    const query = `
      user(id: ${id}) {
        mutation {
          status: ${status} {
            id
            followed
          }
        }
      }
    `;

    const callback = data => {
      const { id, followed }  = data.user.mutation.status;
      const newData = [].concat(this.state.data);
      let tmp = newData.find(item => item.id === id);
      tmp.followed = followed;
      this.setState({
        data: newData
      });
    };

    return {
      query,
      callback
    }
  }

  handleFollow(follow, userId) {
    const status = follow ? `follow` : 'unfollow';

    GraphqlRest.handleQueries(
      this.followMutation(status, userId)
    );
  }

  componentDidMount() {
    GraphqlRest.handleQueries(
      this.prepareAnalysts()
    );
  }


  renderAnalyst(item, index) {
    const { id, displayName, answersCount, upVotesCount, followed, goodAtTopics } = item;
    return (
      <div className={styles.analyst} key={index}>
        <div className="left-part">
          <div className="num">#{index + 1}</div>
          <Avatar name={item.displayName} size="medium" />
          <div className="detail">
            <Link className="username title" to={`/user/${id}`}>{displayName}</Link>
            <div>
              <span>{upVotesCount} 赞同</span>
              <span className="divider"></span>
              <span>{answersCount} 回答</span>
            </div>
            <div className="tag-list">
              {
                goodAtTopics && goodAtTopics.map((item, index) =>
                  <span key={index} className="tag">{item.name}</span>
                )
              }
            </div>
          </div>
        </div>
        <div className="right-part">
          {
            id === this.state.user.id
            ? <div className="btn btn-disabled">Me</div>
            : followed
              ? <div className="btn btn-default" onClick={this.handleFollow.bind(this, false, id)}>取消关注</div>
              : <div className="btn btn-primary" onClick={this.handleFollow.bind(this, true, id)}>关注</div>
          }
        </div>
      </div>
    );
  }


  render() {
    const { data, currentPage, totalPages } = this.state;
    return (
      <div className={styles.rank}>
        <div className={styles.title}>全球数据分析师排行榜</div>
        { data && data.map((item, index) => this.renderAnalyst(item, index)) }
        <LoadMore condition={currentPage < totalPages} onLoadMore={::this.handleLoadMore}/>
      </div>
    );
  }
}
