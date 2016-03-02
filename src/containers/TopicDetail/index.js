import React from 'react';

import { Avatar, Answer, CommentList, ShareBar, PokeButton } from '#/components';

import styles from './style.less';

import { topicDetail } from '#/__mock__';

export default class TopicDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showShare: false,
      showComment: false,
      currentPage: 1
    }
  }

  handlePoke() {
    console.log('点赞');
  }

  handleShowShare() {
    this.setState({
      showShare: !this.state.showShare
    });
  }

  handleShowComment() {
    this.setState({
      showComment: !this.state.showComment
    });
  }

  handleHideComment() {
    this.setState({
      showComment: false
    });
  }

  handleShowMore() {
    this.setState({
      currentPage: this.state.currentPage + 1
    });
  }

  renderTopic() {
    const { topic } = topicDetail;
    return (
      <div className={styles.topic}>
        <div className={styles.header}>
          <div className={styles.title}>{topic.title}</div>
          <div className={styles.tip}>修改</div>
        </div>
        <div className={styles.content}>{topic.content}</div>
        <div className={styles.tip}>相关数据</div>
        <div className={styles.links}>
          {
            topic.references.map((item, index) => <a key={index} className={styles.link} href={item.url}>{item.name}</a>)
          }
        </div>
        <div className={styles.tip}>{topic.time} · {topic.likes} 阅读</div>
      </div>
    );
  }

  renderOptionArea(like, comments) {
    return (
      <div className={styles.cardOption}>
        <div className="other">
          <div className="comment" onClick={::this.handleShowComment}>
            <span>评论</span>
            <span className="count">{ comments ? comments.length : 0 }</span>
          </div>
          <div className="share">
            <span onClick={::this.handleShowShare}>分享</span>
            { this.state.showShare && <ShareBar className="bar" /> }
          </div>
        </div>
        {
          this.state.showComment
            && comments
            && comments.length
            && <CommentList comments={comments} onClose={::this.handleHideComment} />
        }
      </div>
    );
  }

  renderAnswers() {
    const { answers } = topicDetail;
    const { currentPage } = this.state;
    const list = [].concat(answers);
    const endIndex = currentPage * 10;
    let onePage = list.slice(0, endIndex);
    return (
      <div className={styles.answers}>
        {
          onePage.map((item, index) => {
            return (
              <div key={index} className={styles.answer}>
                <div className={styles.header}>
                  <div className={styles.author}>
                    <Avatar url={item.author.avatar} />
                    <div className={styles.subTitle}>{item.author.name}</div>
                    <div className={styles.tip}>{item.author.intro}</div>
                  </div>
                  <PokeButton count={item.like} onClick={::this.handlePoke} />
                </div>
                <div className={styles.answerContent}>
                  <Answer
                    pic={item.picUrl}
                    answerShort={item.answerString}
                    answerFull={item.answerHTML} />
                  { this.renderOptionArea(item.like, item.comments) }
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
        <a className="link" href={item.url}>
          <span>{item.name}</span>
          &nbsp;
          <span className="tip">{item.reply}个回答</span>
        </a>
      </div>
    )
  }

  render() {
    const { related, watcher } = topicDetail;
    return (
      <div className="container">
        <div className="main">
          { this.renderTopic() }
          { this.renderAnswers() }
        </div>
        <div className="sidebar">
          <div className="watch">
            <div className="operate">
              <div className="btn primary">关注问题</div>
              <div className="btn ghost">回答</div>
            </div>
            <div className="watcher">
              <span className="count">4087</span>
              <span>人关注该问题</span>
            </div>
            <div className="watcher-list">
              {
                watcher.map((item, index) => <Avatar key={index} className="avatar" url={item.avatar} />)
              }
            </div>
          </div>
          <div className="related">
            <div className="title">
              <span>相关问题</span>
              <a className="more" href="/topic/hot">更多</a>
            </div>
            {
              related.map((item, index) => this.renderRelated(item, index))
            }
          </div>
        </div>
      </div>
    );
  }
}
