import React from 'react';
import { Link } from 'react-router';

import Store from '#/store';
import { AnswerCard, Avatar, Answer, CommentList, ShareBar, PokeButton } from '#/components';
import { GraphqlRest } from '#/utils';

import styles from './style.less';

export default class TopicDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showShare: new Set(),
      showComment: new Set(),
      page: 1,
      commentPage: {},
      question: {},
      user: Store.user.index().data
    }
  }

  prepareTopicDetail(id, page) {
    const query = `
      query {
        question(id: "${id}") {
          id
          createdAt
          updatedAt
          user {
            id
            displayName
          }
          title
          content
          followers(page: 1, count: 10) {
            data {
              id
              displayName
            }
          }
          followersCount
          answers(page: ${page}, count: 10) {
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
          topics {
            id
            name
            questions(page: 1, count: 1) {
              data {
                id
                title
                answersCount
              }
            }
          }
          dataSets(page: 1, count: 5) {
            data {
              id
              title
              url
            }
            meta {
              current_page
              total_pages
              total_count
            }
          }
          dataReports(page: 1, count: 5) {
            data {
              id
              title
              url
            }
            meta {
              current_page
              total_pages
              total_count
            }
          }
          upVotesCount
          downVotesCount
          totalVotesCount
          followed
        }
      }
    `;

    GraphqlRest.post(query).then(res => {
      const newCommentPage = Object.assign({}, this.state.commentPage);
      res.question.answers.data.map(item => newCommentPage[item.id] = 1);
      this.setState({
        question: res.question,
        commentPage: newCommentPage
      });
    });
  }

  handleShowShare(answerId) {
    const { showShare } = this.state;
    const newShowShare = new Set(showShare);
    if (showShare.has(answerId)) {
      newShowShare.delete(answerId);
    } else {
      newShowShare.add(answerId);
    }
    this.setState({
      showShare: newShowShare
    });
  }

  handleShowComment(answerId) {
    const { showComment } = this.state;
    const newShowComment = new Set(showComment);
    if (!showComment.has(answerId)) {
      newShowComment.add(answerId);
    }
    this.setState({
      showComment: newShowComment
    });
  }

  handleHideComment(answerId) {
    const { showComment } = this.state;
    const newShowComment = new Set(showComment);
    if (showComment.has(answerId)) {
      newShowComment.delete(answerId);
    }
    this.setState({
      showComment: newShowComment
    });
  }

  handleShowMore() {
    const { id } = this.props.params;
    this.setState({
      page: this.state.page + 1
    }, () => this.prepareTopicDetail(id, this.state.page));
  }

  prepareMoreComments(answerId, commentPage) {
    const query = `
      query {
        answer(id: ${answerId}) {
          id
          comments(page: ${commentPage}, count: 5) {
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

    GraphqlRest.post(query).then(res => {
      const { id, comments } = res.answer;
      const { question } = this.state;
      const newQuestion = Object.assign({}, question);
      const tmp = newQuestion.answers.data.find(item => item.id === id).comments;
      tmp.data = tmp.data.concat(comments.data);
      tmp.meta = comments.meta;
      this.setState({
        question: newQuestion
      });
    });
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
      const { question } = this.state;
      const newQuestion = Object.assign({}, question);
      const tmp = newQuestion.answers.data.find(item => item.id === id);
      tmp.upVotesCount = upVotesCount;
      this.setState({
        question: newQuestion
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

        const { question } = this.state;
        const newQuestion = Object.assign({}, question);
        const tmp = newQuestion.answers.data.find(item => item.id === answerId);
        // 未做分页
        tmp.comments.data.push(comment);
        tmp.comments.meta.total_count += 1;
        this.setState({
          question: newQuestion
        });
      });
    }
  }

  handleMoreComments(answerId) {
    const { commentPage } = this.state;
    const newCommentPage = Object.assign({}, commentPage);
    newCommentPage[answerId] += 1;
    this.setState({
      commentPage: newCommentPage
    }, () => this.prepareMoreComments(answerId, newCommentPage[answerId]));
  }

  componentDidMount() {
    const { id } = this.props.params;
    this.prepareTopicDetail(id, 1);
  }

  renderTopic() {
    const { id, title, content, dataReports, dataSets, createdAt, upVotesCount, user } = this.state.question;
    const isMine = user && (user.id === this.state.user.id);
    return (
      <div className={styles.topic}>
        <div className={styles.header}>
          <div className={styles.title}>{title}</div>
          {
            isMine
              && <Link className={styles.tip} to={`/question/${id}/edit`}>修改</Link>
          }
        </div>
        <div className={styles.content}>{content}</div>
        <div className={styles.tip}>相关数据</div>
        <div className={styles.links}>
          {
            dataSets
              && dataSets.data.map((item, index) => {
                return <a key={index} target="_blank" className={styles.link} href={item.url}>{item.title}</a>;
              })
          }
          {
            dataReports
              && dataReports.data.map((item, index) => {
                return <a key={index} target="_blank" className={styles.link} href={item.url}>{item.title}</a>;
              })
          }
        </div>
        <div className={styles.tip}>{createdAt} · {upVotesCount} 阅读</div>
      </div>
    );
  }

  renderOptionArea(comments, answerId) {
    const { data, meta } = comments;
    return (
      <div className={styles.cardOption}>
        <div className="other">
          <div className="comment" onClick={this.handleShowComment.bind(this, answerId)}>
            <span>评论</span>
            <span className="count">{ meta && meta.total_count }</span>
          </div>
          <div className="share">
            <span onClick={this.handleShowShare.bind(this, answerId)}>分享</span>
            { this.state.showShare.has(answerId) && <ShareBar key={answerId} className="bar" /> }
          </div>
        </div>
        {
          this.state.showComment.has(answerId)
            && data
            && data.length
            && <CommentList
              comments={comments}
              onComment={this.handleComment(answerId)}
              onCommentsMore={this.handleMoreComments.bind(this, answerId)}
              onClose={this.handleHideComment.bind(this, answerId)} />
        }
      </div>
    );
  }

  renderAnswers() {
    const { answers } = this.state.question;
    const { data, meta } = answers;
    const list = [].concat(data);
    return (
      <div className={styles.answers}>
        {
          list
            && list.map((item, index) => {
            const { id, content, comments, user, upVotesCount } = item;
            return (
              <div key={index} className={styles.answer}>
                <div className={styles.header}>
                  <div className={styles.author}>
                    <Avatar name={user.displayName} />
                    <div className={styles.subTitle}>{user.displayName}</div>
                    <div className={styles.tip}>"用户简介"</div>
                  </div>
                  <PokeButton count={upVotesCount} onClick={this.handlePoke.bind(this, item.id)} />
                </div>
                <div className={styles.answerContent}>
                  <Answer
                    answerShort={content}
                    answerFull={content} />
                  { this.renderOptionArea(comments, id) }
                </div>
              </div>
            );
        })
        }
        {
          ((answers.length > 10) && (endIndex < answers.length))
          ? <div className="more" onClick={::this.handleShowMore}>点击加载更多</div>
          : <div className="end">已到结尾</div>
        }
      </div>
    );
  }

  renderRelated(item, key) {
    return (
      <div className={styles.relatedTopics} key={key}>
        <Link className="link" to={`/detail/${item.id}`}>
          <span>{item.title}</span>
          &nbsp;
          <span className="tip">{item.answersCount}个回答</span>
        </Link>
      </div>
    )
  }

  render() {
    const { followed, topics, answers, followersCount, followers } = this.state.question;
    return (
      <div className="container">
        <div className="main">
          { this.renderTopic() }
          { answers ? this.renderAnswers() : <div>loading...</div> }
        </div>
        <div className="sidebar">
          <div className="watch">
            <div className="operate">
              {
                followed
                  ? <div className="btn primary">取消关注</div>
                  : <div className="btn primary">关注问题</div>
              }
              <div className="btn ghost">回答</div>
            </div>
            <div className="watcher">
              <span className="count">{followersCount}</span>
              <span>人关注该问题</span>
            </div>
            <div className="watcher-list">
              {
                followers
                  && followers.data.map((item, index) =>
                    <Avatar key={index} className="avatar" name={item.displayName} />)
              }
            </div>
          </div>
          <div className="related">
            <div className="title">
              <span>相关问题</span>
              <Link className="more" to="/discovery">更多</Link>
            </div>
            {
              topics
                && topics.map((item, index) => this.renderRelated(item.questions.data[0], index))
            }
          </div>
        </div>
      </div>
    );
  }
}
