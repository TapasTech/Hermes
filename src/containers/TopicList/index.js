import React from 'react';

import { TopicCard, HotTopics, NewestReports } from '#/components';

import styles from './style.less';

import { topicList } from '#/__mock__';

export default class TopicList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: 1
    };
  }

  handleShowMore() {
    this.setState({
      currentPage: this.state.currentPage + 1
    });
  }

  renderTopicCard(content, index) {
    const { tag, topic } = content;
    return (
      <div className={styles.topic} key={index}>
        <div className="tag">{tag}</div>
        <div className={styles.content}>
          <div className="tip">热门回答，来自 {topic} 话题</div>
          <TopicCard content={content} />
        </div>
      </div>
    );
  }

  renderQuestionList() {
    const { currentPage } = this.state;
    const list = [].concat(topicList);
    const endIndex = currentPage * 10;
    let onePage = list.slice(0, endIndex);

    return (
      <div className={styles.main}>
        <div className={styles.title}>最新动态</div>
        {
          onePage.map((item, index) => this.renderTopicCard(item, index))
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
      <div className={styles.topicList}>
        { this.renderQuestionList() }
        <div className={styles.sidebar}>
          <HotTopics />
          <NewestReports />
        </div>
      </div>
    );
  }
}
