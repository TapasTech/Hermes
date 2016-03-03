import React from 'react';

import { TopicCard, HotTopics, NewestReports } from '#/components';
import { GraphqlRest } from '#/utils';
import Store from '#/store';
import AppDispatcher from '#/dispatcher';

import styles from './style.less';

import { topicList } from '#/__mock__';

export default class TopicList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: 1,
      hotAnswers: Store.hotAnswers.index().data
    };
  }

  hotAnswersRequset() {
    const query = GraphqlRest.query(
      `hotAnswers(page: 1, count: 10)`,
      `data {
        id
        user {
          id
          displayName
        }
        question {
          id
          title
        }
        content
        upVotesCount
        comments(page: 1, count: 10) {
          data {
            id
            user {
              id
              displayName
            }
            replyTo {
              id
              displayName
            }
            content
            createdAt
            updatedAt
          }
        }
      }`
    );

    GraphqlRest.post(query).then(res => {
      const { data } = res.data;
      AppDispatcher.dispatch({
        type: 'HOTANSWER_INDEX',
        text: { data }
      });
    });
  }

  _onChange() {
    this.setState({
      hotAnswers: Store.hotAnswers.index().data
    });
  }

  componentDidMount() {
    Store.on('change', ::this._onChange);
    this.hotAnswersRequset();
  }

  componentWillUnmount() {
    Store.removeListener('change', ::this._onChange);
  }

  handleShowMore() {
    this.setState({
      currentPage: this.state.currentPage + 1
    });
  }

  renderTopicCard(item, index) {
    console.log(item)
    return (
      <div className={styles.topic} key={index}>
        <div className="tag">{/*tag*/}</div>
        <div className={styles.content}>
          <div className="tip">热门回答，来自 {/*topic*/} 话题</div>
          { item ? <TopicCard {...item} /> : <div>loading...</div> }
        </div>
      </div>
    );
  }

  renderQuestionList() {
    const list = [].concat(this.state.hotAnswers.data);

    return (
      <div className={styles.main}>
        <div className={styles.title}>最新动态</div>
        {
          list.map((item, index) => this.renderTopicCard(item, index))
        }
        {
          ((topicList.length > 10) && (endIndex < topicList.length))
          ? <div className="more" onClick={::this.handleShowMore}>点击加载更多</div>
          : <div className="end">已到结尾</div>
        }
      </div>
    );
  }

  render() {
    return (
      <div className="container">
        <div className="main">
          { this.state.hotAnswers ? this.renderQuestionList() : <div>loading...</div> }
        </div>
        <div className="sidebar">
          <HotTopics />
          <NewestReports />
        </div>
      </div>
    );
  }
}
