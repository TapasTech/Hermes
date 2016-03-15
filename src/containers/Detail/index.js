import React from 'react';
import { Link } from 'react-router';

import Store from '#/store';
import { Avatar, Answer, CommentList, ShareBar, PokeButton, Loader, DataSources } from '#/components';
import { GraphqlRest, formatter } from '#/utils';

import styles from './style.less';

export default class Detail extends React.Component {
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

  prepareMoreAnswers(page) {
    const { id } = this.props.params;
    const query = `
      query {
        question(id: "${id}") {
          id
          answers(page: ${page}, count: 10) {
            data {
              id
              user {
                id
                displayName
                description
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
      }
    `;

    GraphqlRest.post(query).then(res => {
      const { id, answers } = res.question;
      const { question } = this.state;
      const newQuestion = Object.assign({}, question);
      if (newQuestion.id === id) {
        const { data, meta } = answers;
        newQuestion.answers.data = newQuestion.answers.data.concat(data);
        newQuestion.answers.meta = meta;
        this.setState({
          question: newQuestion
        });
      }
    })
  }

  prepareDetail() {
    const { id } = this.props.params;
    const query = `
      question(id: "${id}") {
        mutation {
          read {
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
            readCount
            followersCount
            answers(page: 1, count: 10) {
              data {
                id
                user {
                  id
                  displayName
                  description
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
                dataSets(page: 1, count: 5) {
                  ...fragDataSets
                }
                dataReports(page: 1, count: 5) {
                  ...fragDataReports
                }
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
              ...fragDataSets
            }
            dataReports(page: 1, count: 5) {
              ...fragDataReports
            }
            upVotesCount
            downVotesCount
            totalVotesCount
            followed
          }
        }
      }`;
    const callback = data => {
      const question = data.question.mutation.read;
      this.setState({
        question: question,
        commentPage: question.answers.data.reduce((res, item) => {
          res[item.id] = 1;
          return res;
        }, {}),
      });
    };
    return {
      query,
      callback,
      fragments: DataSources.fragments,
    };
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
    this.setState({
      page: this.state.page + 1
    }, () => this.prepareMoreAnswers(this.state.page));
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

  handleCommentPoke(answerId) {
    return (id) => {
      const mutation = `
        query {
          comment(id: ${id}) {
            mutation {
              voteUp {
                id
                upVotesCount
              }
            }
          }
        }
      `;

      GraphqlRest.post(mutation).then(res => {
        const { id, upVotesCount } = res.comment.mutation.voteUp;
        const { question } = this.state;
        const newQuestion = Object.assign({}, question);
        const tmp = newQuestion.answers.data.find(item => item.id === answerId);
        const tmpComment = tmp.comments.data.find(item => item.id === id);
        tmpComment.upVotesCount = upVotesCount;
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

  prepareFollow(follow) {
    const { id } = this.props.params;
    const verb = follow ? 'follow' : 'unfollow';
    const query = `
    question(id: ${id}) {
      mutation {
        status: ${verb} {
          id
          followed
          followers(page: 1, count: 10) {
            data {
              id
              displayName
            }
          }
          followersCount
        }
      }
    }`;
    const callback = data => {
      const { followed, followers, followersCount } = data.question.mutation.status;
      this.setState({
        question : {
          ... this.state.question,
          followed,
          followers,
          followersCount,
        },
      });
    };
    return {
      query,
      callback,
    };
  }

  toggleFollowStatus = () => {
    GraphqlRest.handleQueries(
      this.prepareFollow(!this.state.question.followed)
    );
  }

  componentDidMount() {
    GraphqlRest.handleQueries(
      this.prepareDetail()
    );
  }

  renderTopic() {
    const { id, title, content, dataReports, dataSets, createdAt, upVotesCount, readCount, user } = this.state.question;
    const isMine = user && (user.id === this.state.user.id);
    const _questionHTML = { __html: content };
    return (
      <div className={styles.topic}>
        <div className={styles.header}>
          <div className="title">{title}</div>
          {
            isMine
              && <Link className={styles.tip} to={`/question/${id}/edit`}>修改</Link>
          }
        </div>
        <div className={styles.content} dangerouslySetInnerHTML={_questionHTML}></div>
        <DataSources dataSets={dataSets} dataReports={dataReports} />
        <div className={styles.tip}>{formatter.time(createdAt)} · {readCount || 0 } 阅读</div>
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
            && <CommentList answerId={answerId} />
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
            const { id, content, comments, user, upVotesCount, dataSets, dataReports } = item;
            return (
              <div key={index} className={styles.answer}>
                <div className={styles.header}>
                  <div className={styles.author}>
                    <Avatar name={user.displayName} />
                    <div className={styles.subTitle}>{user.displayName}</div>
                    <div className={styles.tip}>{user.description || '该用户尚未留下任何描述'}</div>
                  </div>
                  <PokeButton count={upVotesCount} onClick={this.handlePoke.bind(this, item.id)} />
                </div>
                <div className={styles.answerContent}>
                  <Answer answerContent={content} showFull={true} />
                  <DataSources dataSets={dataSets} dataReports={dataReports} />
                  { this.renderOptionArea(comments, id) }
                </div>
              </div>
            );
          })
        }
        {
          (meta.current_page) && (meta.current_page < meta.total_pages)
          ? <div className="more" onClick={::this.handleShowMore}>点击加载更多</div>
          : <div className="end">已到结尾</div>
        }
      </div>
    );
  }

  renderRelated(item, key) {
    return (
      <div className={styles.relatedTopics} key={key}>
        <Link className="link" to={`/question/${item.id}`}>
          <span>{item.title}</span>
          &nbsp;
          <span className="tip">{item.answersCount}个回答</span>
        </Link>
      </div>
    )
  }

  render() {
    const { id, followed, topics, answers, followersCount, followers } = this.state.question;
    return (
      <div className="container">
        <div className="main main-left">
          { this.renderTopic() }
          { (answers && answers.data.length) ? this.renderAnswers() : <div>尚未有人回答过这个问题</div> }
        </div>
        <div className="side-right">
          <div className="watch">
            <div className="operate">
              <div className={`btn mr-sm ${followed ? 'btn-info' : 'btn-primary'}`} onClick={this.toggleFollowStatus}>
                {followed ? '取消关注' : '关注问题'}
              </div>
              <Link className="btn btn-info" to={`/question/${id}/answer`}>回答</Link>
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
            <div className="header">
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
