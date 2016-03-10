import React from 'react';
import { Link } from 'react-router';

import { AnswerCard, HotTopics, NewestDataSets, Loader, LoadMore } from '#/components';
import { GraphqlRest } from '#/utils';
import Store from '#/store';
import AppDispatcher from '#/dispatcher';

import styles from './style.less';

export default class AnswerList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: 1,
      loading: true,
      data: [],
    };
  }

  prepareHotAnswers(page = 1) {
    const query = `
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
    GraphqlRest.handleQueries(
      this.prepareHotAnswers(this.state.currentPage + 1)
    );
  }

  componentDidMount() {
    GraphqlRest.handleQueries(
      this.prepareHotAnswers()
    );
  }

  renderBestAnalysts() {
    return (
      <Link className={styles.bestAnalysts} to="/rank">
        <div className="top">全球分析师</div>
        <div className="bottom">排行榜</div>
      </Link>
    );
  }

  renderAnswerCard(item, index) {
    const { question } = item;
    return (
      <div className={styles.topic} key={index}>
        <div className="tag">{question && question.topics[0].name}</div>
        <div className={styles.content}>
          <div className="tip">热门回答，来自 {question && question.topics[0].name} 话题</div>
          { item
            ? <AnswerCard answer={item} />
            : <div>loading...</div> }
        </div>
      </div>
    );
  }

  renderQuestionList() {
    const { data, currentPage, totalPages } = this.state;

    return (
      <div className={styles.main}>
        <div className={styles.title}>最新动态</div>
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

  render() {
    return (
      <div className="container">
        {this.state.loading && <Loader full={true} />}
        <div className="main">
          { this.state.data ? this.renderQuestionList() : <div>loading...</div> }
        </div>
        <div className="sidebar">
          { this.renderBestAnalysts() }
          <HotTopics />
          <NewestDataSets />
        </div>
      </div>
    );
  }
}
