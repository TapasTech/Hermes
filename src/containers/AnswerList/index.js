import React from 'react';
import { Link } from 'react-router';

import { AnswerCard, HotTopics, NewestDataSets, Loader, LoadMore } from '#/components';
import { GraphqlRest } from '#/utils';
import Store from '#/store';
import AppDispatcher from '#/dispatcher';

import trophy from '#/assets/fonts/trophy-o.svg';
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

  loadData() {
    GraphqlRest.handleQueries(
      this.prepareHotAnswers()
    );
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

  renderBestAnalysts() {
    return (
      <Link className={`panel clearfix ${styles.bestAnalysts}`} to="/rank">
        <div className="pull-left">
          <div className={styles.bestAnalystsTop}>全球数据分析师</div>
          <div className={styles.bestAnalystsBottom}>排行榜</div>
        </div>
        <div className="pull-right">
          <img src={trophy} />
        </div>
      </Link>
    );
  }

  renderAnswerCard(item, index) {
    const { question } = item;
    return (
      <div className={styles.topic} key={index}>
        <div className="tag">{question && question.topics[0] && question.topics[0].name}</div>
        <div className={styles.content}>
          <div className="tip">热门回答，来自 {question && question.topics[0] && question.topics[0].name} 话题</div>
          <AnswerCard answer={item} />
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
}
