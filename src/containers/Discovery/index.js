import React from 'react';
import { Link } from 'react-router';

import { HotTopics } from '#/components';

import { GraphqlRest } from '#/utils';

import styles from './style.less';

import { domainList, topicList } from '#/__mock__';

export default class Discovery extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      topics: [],
      domainSelected: undefined,
      pageCount: {}
    };
  }

  prepareTopics(page) {
    const query = `
      query {
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
      }
    `;

    return GraphqlRest.post(query).then(res => {
      const { data, meta } = res.topics;
      const { topics } = this.state;
      let newTopics = [].concat(topics);
      newTopics = newTopics.concat(data);

      let pageCount = {};
      newTopics.map(item => pageCount[item.id]  = 1);
      this.setState({
        topics: newTopics,
        domainSelected: newTopics[0].id,
        pageCount: pageCount
      });
    });
  }

  prepareQuestions(topicId) {
    const { pageCount } = this.state;
    const page = pageCount[topicId];
    const query = `
      query {
        topic(id: "${topicId}") {
          id
          questions(page: ${page}, count: 10) {
            data {
              id
              title
              answersCount
              readCount
              createdAt
              user {
                id
                displayName
              }
            }
            meta {
              current_page
              total_pages
              total_count
            }
          }
        }
      }
    `;

    return GraphqlRest.post(query).then(res => {
      const { questions, id } = res.topic;
      const { topics } = this.state;
      let newTopics = [].concat(topics);
      const tmp = newTopics.find(item => item.id === id);
      if (Array.isArray(tmp.questions)) {
        tmp.questions = tmp.questions.concat(questions);
      } else {
        tmp.questions = questions;
      }
      this.setState({
        topics: newTopics
      });
    });
  }

  handleDomainSelected(topicId) {
    this.setState({
      domainSelected: topicId
    });
    this.prepareQuestions(topicId);
  }

  handleMoreQuestions() {
    const { domainSelected } = this.state;
    this.prepareQuestions(domainSelected, 1);
  }

  componentDidMount() {
    this.prepareTopics(1).then(() => {
      const { domainSelected } = this.state;
      this.prepareQuestions(domainSelected);
    });
  }

  renderTopicList(item, index) {
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
          <Link className="num" to={`/detail/${item.id}`}>{item.title}</Link>
          {
            <div className="tip">{item.user.displayName} 提出了该问题 {item.createdAt}</div>
          }
        </div>
      </div>
    );
  }

  render() {
    const { domainSelected, topics } = this.state;
    const selectedTopics = topics.find(item => item.id === domainSelected);
    return (
      <div className="container">
        <div className="main">
          <div className={styles.listArea}>
            <div className={styles.header}>最新问题</div>
            <div className={styles.domains}>
              {
                topics.map((item, index) => {
                  const clx = item.id === domainSelected ? "item selected" : "item"
                  return (
                    <div key={index} className={clx} onClick={this.handleDomainSelected.bind(this, item.id)}>
                      <span className="name">{item.name}</span>
                    </div>
                  );
                })
              }
            </div>
            { selectedTopics
                && selectedTopics.questions
                && selectedTopics.questions.data.map((item, index) => this.renderTopicList(item, index)) }
            {
              selectedTopics
                && selectedTopics.questions
                && selectedTopics.questions.meta.current_page
                && (selectedTopics.questions.meta.current_page < selectedTopics.questions.meta.total_pages)
              ? <div className="more" onClick={::this.handleMoreQuestions}>点击加载更多</div>
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
