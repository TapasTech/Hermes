import React from 'react';
import { Link } from 'react-router';

import { AnswerCard, HotTopics, NewestDataSets, Loader, LoadMore, Icon } from '#/components';
import { GQL } from '#/utils';

import trophy from '#/assets/trophy-o.svg';
import './style.less';

export default class AnswerList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: 1,
      loading: true,
      data: [],
    };
  }

  componentDidMount() {
    this.loadData();
  }

  componentWillReceiveProps(nextProps) {
    this.setState({loading: true});
    this.loadData();
  }

  render() {
    return (
      <div className="container">
        {this.state.loading && <Loader full={true} />}
        <div className="main main-left">
          { this.state.data ? this.renderQuestionList() : <div>loading...</div> }
        </div>
        <div className="side-right">
          { this.renderBestAnalysts() }
          <HotTopics />
          <NewestDataSets />
        </div>
      </div>
    );
  }

  loadData() {
    GQL.handleQueries(
      this.prepareHotAnswers()
    );
  }

  prepareHotAnswers(page = 1) {
    const query = GQL.template`
    hotAnswers(page: ${page}, count: 5) {
      data {
        ...fragAnswer
      }
      meta {
        current_page
        total_pages
        total_count
      }
    }
    `;
    const callback = res => {
      const { data, meta } = res.hotAnswers;
      this.setState({
        data: [
          ... this.state.data,
          ... data,
        ],
        currentPage: meta.current_page,
        totalPages: meta.total_pages,
        totalCount: meta.total_count,
        loading: false,
      });
    };
    return {
      query,
      callback,
      fragments: AnswerCard.fragments,
    };
  }

  handleMoreAnwers = () => {
    GQL.handleQueries(
      this.prepareHotAnswers(this.state.currentPage + 1)
    );
  }

  renderBestAnalysts() {
    return (
      <Link className="panel qlist-analysts clearfix" to="/rank">
        <div className="pull-left">
          <div className="qlist-analysts-top">全球数据分析师</div>
          <div className="qlist-analysts-bottom">排行榜</div>
        </div>
        <div className="pull-right">
          <Icon glyph={trophy} width="80" height="80" />
        </div>
      </Link>
    );
  }

  renderAnswerCard(item, index) {
    const { question } = item;
    return (
      <div className="qlist-item clearfix" key={index}>
        <div className="qlist-content">
          <div>
            <div>热门回答，来自 {question && question.topics[0] && question.topics[0].name} 话题</div>
            <AnswerCard answer={item} />
          </div>
        </div>
        <div className="qlist-tag">
          <div>
            {question && question.topics[0] && question.topics[0].name}
          </div>
        </div>
      </div>
    );
  }

  renderQuestionList() {
    const { data, currentPage, totalPages } = this.state;

    return (
      <div className="qlist panel">
        <div className="qlist-header">最新动态</div>
        {
          data.map((item, index) => {
            return item
              ? this.renderAnswerCard(item, index)
              : <div key={index}>loading...</div>
          })
        }
        <LoadMore condition={currentPage < totalPages} onLoadMore={this.handleMoreAnwers} />
      </div>
    );
  }
}
