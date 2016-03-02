import React from 'react';

import styles from './style.less';

import { newestTopics } from '#/__mock__';

export default class NewestReports extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={styles.newest}>
        <div className="title">
          <span>最新数据</span>
          <a className="more" href="/topic/newest">更多</a>
        </div>
        {
          newestTopics.map((item, index) => {
            return (
              <a key={index} className="link" href={item.href}>· {item.name}</a>
            );
          })
        }
      </div>
    );
  }
}
