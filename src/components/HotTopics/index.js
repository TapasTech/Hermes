import React from 'react';

import styles from './style.less';

import { hotTopics } from '#/__mock__';

export default class HotTopics extends React.Component {
  constructor(props) {
    super(props);
  }

  renderHotTopic(topic, key) {
    return (
      <div className={styles.topic} key={key}>
        <div className="topic">
          <div className="img" style={{backgroundImage: `url(${topic.picUrl})`}}></div>
          <div className="name">{topic.name}</div>
        </div>
        <a className="link" href={topic.link.href}>{topic.link.name}</a>
      </div>
    )
  }

  render() {
    return (
      <div className={styles.hotTopic}>
        <div className="title">
          <span>热门领域</span>
          <a className="more" href="/topic/hot">更多</a>
        </div>
        {
          hotTopics.map((item, index) => this.renderHotTopic(item, index))
        }
      </div>
    );
  }
}
