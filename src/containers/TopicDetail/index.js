import React from 'react';

import styles from './style.less';

export default class TopicDetail extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={styles.topicDetail}>
      <div className={styles.main}>TopicDetail Page</div>
        <div className={styles.sidebar}></div>
      </div>
    );
  }
}
