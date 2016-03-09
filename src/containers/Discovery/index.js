import React from 'react';
import { Link } from 'react-router';

import { HotTopics } from '#/components';
import { GraphqlRest, formatter } from '#/utils';
import Questions from './Questions';

import styles from './style.less';

export default class Discovery extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      topics: {
        data: [{
          id: '',
          name: '全部',
        }],
        currentPage: 1,
        totalPages: 1,
      },
      questions: {
        data: [],
        currentPage: 1,
        totalPages: 1,
      },
    };
  }

  prepareTopics(page) {
    const query = `
    topics(page: ${page}, count: 10) {
      data {
        id
        name
      }
      meta {
        current_page
        total_pages
        total_count
      }
    }
    `;
    const callback = res => {
      const {data, meta} = res.topics;
      const topics = {
        data: [
          ... this.state.topics.data,
          ... data,
        ],
        currentPage: meta.current_page,
        totalPages: meta.total_pages,
      };
      this.setState({
        topics,
        index: 0,
      });
    };
    return {
      query,
      callback,
    };
  }

  prepareQuestions(page) {
    const topicId = this.props.params.id || '';
    const questions = `
    questions(page: ${page}, count: 10) {
      ...fragTopicMeta
    }
    `;
    const query = topicId ? `topic(id: "${topicId}") { ${questions} }` : questions;
    const callback = res => {
      const {meta, data} = topicId ? res.topic.questions : res.questions;
      const questions = {
        data: [
          ... this.state.questions.data,
          ... data,
        ],
        currentPage: meta.current_page,
        totalPages: meta.total_pages,
      };
      this.setState({
        questions,
      });
    };
    return {
      query,
      callback,
      fragments: Questions.fragments,
    };
  }

  componentDidMount() {
    GraphqlRest.handleQueries(
      this.prepareTopics(1),
      this.prepareQuestions(1)
    );
  }

  componentDidUpdate(prevProps) {
    if (prevProps.params.id != this.props.params.id) {
      this.setState({
        questions: {
          data: [],
          currentPage: 1,
          totalPages: 1,
        },
      });
      GraphqlRest.handleQueries(
        this.prepareQuestions(1)
      );
    }
  }

  renderTopic = (item, index) => {
    const topicId = this.props.params.id || '';
    const className = topicId === item.id ? 'item selected' : 'item';
    const url = '/discovery' + (item.id ? '/' + item.id : '');
    return (
      <Link key={index} className={className} to={url}>
        <span className="name">{item.name}</span>
      </Link>
    );
  }

  render() {
    const { topics, questions } = this.state;
    return (
      <div className="container">
        <div className="main">
          <div className={styles.listArea}>
            <div className={styles.header}>最新问题</div>
            <div className={styles.domains}>
              { topics.data.map(this.renderTopic) }
            </div>
            <Questions data={questions.data} />
            { questions.currentPage < questions.totalPages
              ? <div className="more" onClick={this.handleMoreQuestions}>点击加载更多</div>
              : <div className="end">已到结尾</div>
            }
          </div>
        </div>
        <div className="sidebar">
          <HotTopics />
        </div>
      </div>
    );
  }
}
