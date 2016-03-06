import React from 'react';

import { TopicCard, HotTopics, NewestDataSets } from '#/components';
import { GraphqlRest } from '#/utils';
import Store from '#/store';
import AppDispatcher from '#/dispatcher';

import styles from './style.less';

export default class AnswerList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      answerList: [],
      answerMeta: {}
    };
  }

  prepareHotAnswers(page) {
    const query = `
      query {
        hotAnswers(page: ${page}, count: 10) {
          data {
            id
            user {
              id
              displayName
            }
            question {
              id
              title
              topics {
                id
                name
              }
            }
            content
            upVotesCount
            comments(page: 1, count: 5) {
              data {
                id
                user {
                  id
                  displayName
                }
                replyTo {
                  id
                  displayName
                }
                content
                upVotesCount
                createdAt
                updatedAt
              }
              meta {
                current_page
                total_pages
                total_count
              }
            }
          }
          meta {
            current_page
            total_pages
            total_count
          }
        }
      }
    `;

    GraphqlRest.post(query).then(res => {
      const { data, meta } = res.hotAnswers;
      this.setState({
        answerList: data,
        totalCount: meta.total_count
      });
    });
  }

  prepareMoreComments(answerId) {
    return (page) => {
      const query = `
        query {
          answer(id: ${answerId}) {
            id
            comments(page: ${page}, count: 5) {
              data {
                id
                user {
                  id
                  displayName
                }
                replyTo {
                  id
                  displayName
                }
                content
                upVotesCount
                createdAt
                updatedAt
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
        const { id, comments } = res.answer;
        const { answerList } = this.state;
        const newAnwerList = [].concat(answerList);
        const tmp = newAnwerList.find(item => item.id === id).comments;
        tmp.data = tmp.data.concat(comments.data);
        tmp.meta = comments.meta;
        this.setState({
          answerList: newAnwerList
        });
      });
    }
  }

  // mutations
  answerMutationRoot(mutation) {
    return (answerId) => {
      const query = `
        query {
          answer(id: ${answerId}) {
            ${mutation}
          }
        }
      `;

      return query;
    }
  }

  handlePoke(answerId) {
    const mutation = `
      mutation {
        voteUp {
          id
          upVotesCount
        }
      }
    `;
    const query = this.answerMutationRoot(mutation);

    GraphqlRest.post(query(answerId)).then(data => {
      const { id, upVotesCount } = data.answer.mutation.voteUp;
      const { answerList } = this.state;
      const newAnwerList = [].concat(answerList);
      const tmp = newAnwerList.find(item => item.id === id);
      tmp.upVotesCount = upVotesCount;
      this.setState({
        answerList: newAnwerList
      });
    })
  }

  handleComment(answerId) {
    return (content, replyToId = '') => {
      const mutation = `
        mutation {
          comment: createComment(content: "${content}", reply_to_id: "${replyToId}") {
            id
            user {
              id
              displayName
            }
            replyTo {
              id
              displayName
            }
            content
            upVotesCount
            createdAt
            updatedAt
          }
        }
      `;
      const query = this.answerMutationRoot(mutation);

      return GraphqlRest.post(query(answerId)).then(res => {
        const { comment } = res.answer.mutation;

        const { answerList } = this.state;
        const newAnwerList = [].concat(answerList);
        const tmp = newAnwerList.find(item => item.id === answerId);
        // 未做分页
        tmp.comments.data.push(comment);
        tmp.comments.meta.total_count += 1;
        this.setState({
          answerList: newAnwerList
        });
      });
    }
  }

  handleMoreAnwers() {
    const { current_page } = this.state.answerMeta;
    this.handleMoreAnwers(current_page + 1);
  }

  componentDidMount() {
    this.prepareHotAnswers(1);
  }

  renderTopicCard(item, index) {
    const { question } = item;
    return (
      <div className={styles.topic} key={index}>
        <div className="tag">{question.topics[0].name}</div>
        <div className={styles.content}>
          <div className="tip">热门回答，来自 {question && question.topics[0].name} 话题</div>
          { item
            ? <TopicCard
              onPokeClick={this.handlePoke.bind(this, item.id)}
              onCommentClick={this.handleComment(item.id)}
              onMoreComments={this.prepareMoreComments(item.id)}
              {...item} />
            : <div>loading...</div> }
        </div>
      </div>
    );
  }

  renderQuestionList() {
    const { answerList, answerMeta } = this.state;
    const list = [].concat(answerList);
    const { current_page, total_pages, total_count } = answerMeta;

    return (
      <div className={styles.main}>
        <div className={styles.title}>最新动态</div>
        {
          list.map((item, index) => {
            return item
              ? this.renderTopicCard(item, index)
              : <div key={index}>loading...</div>
          })
        }
        {
          (current_page && (current_page < total_pages))
          ? <div className="more" onClick={::this.handleMoreAnwers}>点击加载更多</div>
          : <div className="end">已到结尾</div>
        }
      </div>
    );
  }

  render() {
    return (
      <div className="container">
        <div className="main">
          { this.state.answerList ? this.renderQuestionList() : <div>loading...</div> }
        </div>
        <div className="sidebar">
          <HotTopics />
          <NewestDataSets />
        </div>
      </div>
    );
  }
}
