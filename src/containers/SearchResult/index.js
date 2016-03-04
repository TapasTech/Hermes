import React from 'react';

import { TopicCard, NewestDataSets } from '#/components';

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
        <TopicCard content={content} />
      </div>
    );
  }

  renderQuestionList() {
    const { q } = this.props.location.query;

    const { currentPage } = this.state;
    const list = [].concat(topicList);
    const endIndex = currentPage * 10;
    let onePage = list.slice(0, endIndex);

    return (
      <div className={styles.main}>
        <div className={styles.title}>关于"{q}"的问题，共 {topicList.length} 条</div>
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
      <div className="container">
        <div className="main">
          { this.renderQuestionList() }
        </div>
        <div className="sidebar">
          <NewestDataSets />
        </div>
      </div>
    );
  }
}
