import React from 'react';
import { Link } from 'react-router';

import { Answer, CommentList, ShareBar, PokeButton } from '#/components';

import styles from './style.less';

export default class TopicCard extends React.Component {

  static propTypes = {
    content: React.PropTypes.object
  };

  constructor(props) {
    super(props);
    this.state = {
      showShare: false,
      showComment: false
    };
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

  handlePoke() {
    console.log('点赞');
  }

  renderOptionArea() {
    const { like, comments } = this.props.content;
    return (
      <div className={styles.cardOption}>
        <div className="other">
          <PokeButton count={like} onClick={::this.handlePoke} />
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

  render() {
    const { id, question, author, answerString, answerHTML, authorId, picUrl } = this.props.content;
    return (
      <div className={styles.topicCard}>
        <Link className="title" to={`/detail/${id}`}>{question}</Link>
        <div className="author">
          <Link className="link" to={`/user/${author.authorId}`}>{author.name}</Link>
          <span>的答案：</span>
        </div>
        <Answer pic={picUrl} answerShort={answerString} answerFull={answerHTML} />
        { this.renderOptionArea() }
      </div>
    );
  }
}
