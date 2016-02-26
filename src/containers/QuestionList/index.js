import React from 'react';

import { QuestionCard } from '#/components';

import styles from './style.less';

export default class QuestionList extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={styles.qlist}>
        QuestionList Page
        <QuestionCard />
      </div>
    );
  }
}
