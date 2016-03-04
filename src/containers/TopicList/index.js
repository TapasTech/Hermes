import React from 'react';

import { TopicCard, HotTopics, NewestDataSets } from '#/components';
import { GraphqlRest } from '#/utils';
import Store from '#/store';
import AppDispatcher from '#/dispatcher';

import styles from './style.less';

import { topicList } from '#/__mock__';

export default class TopicList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: 1,
      hotAnswers: Store.hotAnswers.index().data
    };
  }

  hotAnswersRequset() {
    const query = GraphqlRest.query(
      `hotAnswers(page: 1, count: 10)`,
      `data {
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
        comments(page: 1, count: 10) {
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
            createdAt
            updatedAt
          }
        }
      }`
    );

    GraphqlRest.post(query).then(res => {
      const { data } = res.data;
      AppDispatcher.dispatch({
        type: 'HOTANSWER_INDEX',
        text: data
      });
    });
  }

  handlePoke(id) {
    const query =`
      query {
        answer(id: ${id}) {
          mutation {
            res: voteUp {
              id
              upVotesCount
            }
          }
        }
      }
    `;

    GraphqlRest.post(query).then(data => {
      AppDispatcher.dispatch({
        type: 'HOTANSWER_POKE',
        text: data.answer.mutation.res
      });
    })
  }

  handleReply(answerId) {
    return (content, replyToId = '') => {
      const mutation = `
        query {
          answer(id: "${answerId}") {
            mutation {
              res: createComment(content: "${content}", reply_to_id: "${replyToId}") {
                id
                replyTo {
                  id
                }
                content
                upVotesCount
                answer {
                  id
                }
              }
            }
          }
        }
      `;

      GraphqlRest.post(mutation).then(res => console.log(res))
    }
  }

  handleShowMore() {
    this.setState({
      currentPage: this.state.currentPage + 1
    });
  }

  _onChange() {
    this.setState({
      hotAnswers: Store.hotAnswers.index().data
    });
  }

  componentDidMount() {
    Store.on('change', ::this._onChange);
    this.hotAnswersRequset();
  }

  componentWillUnmount() {
    Store.removeListener('change', ::this._onChange);
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
              onCommentClick={this.handleReply(item.id)}
              {...item} />
            : <div>loading...</div> }
        </div>
      </div>
    );
  }

  renderQuestionList() {
    const list = [].concat(this.state.hotAnswers);

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
          { this.state.hotAnswers ? this.renderQuestionList() : <div>loading...</div> }
        </div>
        <div className="sidebar">
          <HotTopics />
          <NewestDataSets />
        </div>
      </div>
    );
  }
}
