import React from 'react';
import { Link } from 'react-router';

import { HotTopics, Loader, LoadMore } from '#/components';
import { GQL, formatter } from '#/utils';
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
      loading: true,
    };
  }

  prepareTopics(page) {
    const query = `
    topics(page: ${page}, count: 50) {
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
        loading: false,
      });
    };
    return {
      query,
      callback,
      fragments: Questions.fragments,
    };
  }

  componentDidMount() {
    GQL.handleQueries(
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
        loading: true,
      });
      GQL.handleQueries(
        this.prepareQuestions(1)
      );
    }
  }

  handleMoreQuestions = () => {
    GQL.handleQueries(
      this.prepareQuestions(this.state.questions.currentPage + 1)
    );
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
    const { topics, questions, loading } = this.state;
    return (
      <div className="hermes-container">
        {loading && <Loader full={true} />}
        <div className="main main-left">
          <div className={styles.listArea}>
            <div className={styles.header}>最新问题</div>
            <div className={styles.domains}>
              { topics.data.map(this.renderTopic) }
            </div>
            <Questions data={questions.data} />
            {!loading &&
              <LoadMore condition={questions.currentPage < questions.totalPages} onLoadMore={this.handleMoreQuestions} />
            }
          </div>
        </div>
        <div className="side-right">
          <HotTopics />
        </div>
      </div>
    );
  }
}
