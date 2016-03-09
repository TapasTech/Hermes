import React from 'react';
import {Link} from 'react-router';
import { formatter } from '#/utils';

import styles from './style.less';

export default class Questions extends React.Component {
  static fragments = `
  fragment fragTopicMeta on PaginatedQuestion {
    data {
      id
      title
      answersCount
      readCount
      createdAt
    }
    meta {
      current_page
      total_pages
      total_count
    }
  }
  `;

  renderQuestion(item, index) {
    return (
      <div className={styles.topicList} key={index}>
        <div className="reply item">
          <div className="num">{item.answersCount}</div>
          <div className="tip">回答</div>
        </div>
        <div className="read item">
          <div className="num">{item.readCount || 0}</div>
          <div className="tip">阅读</div>
        </div>
        <div className="topic item">
          <Link className="num" to={`/question/${item.id}`}>{item.title}</Link>
          {
            <div className="tip">{formatter.time(item.createdAt)}</div>
          }
        </div>
      </div>
    );
  }

  render() {
    const questions = this.props.data || [];
    return <div>{questions.map(this.renderQuestion)}</div>;
  }
}
