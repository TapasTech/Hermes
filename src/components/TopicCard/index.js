import React from 'react';
import { Link } from 'react-router';

import { Answer, CommentList, ShareBar, PokeButton } from '#/components';

import styles from './style.less';

export default class TopicCard extends React.Component {

  static propTypes = {
    content: React.PropTypes.string,
    comments: React.PropTypes.object,
    question: React.PropTypes.object,
    user: React.PropTypes.object,
    upVotesCount: React.PropTypes.number,
    onPokeClick: React.PropTypes.func,
    onCommentClick: React.PropTypes.func,
    onMoreComments: React.PropTypes.func
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

  renderOptionArea() {
    const { upVotesCount, comments, question, onPokeClick } = this.props;
    return (
      <div className={styles.cardOption}>
        <div className="other">
          <PokeButton count={upVotesCount} onClick={onPokeClick} />
          <div className="comment" onClick={::this.handleShowComment}>
            <span>评论</span>
            <span className="count">{ comments.meta.total_count  }</span>
          </div>
          <div className="share">
            <span onClick={::this.handleShowShare}>分享</span>
            { this.state.showShare && <ShareBar className="bar" url={`/detail/${question.id}`} title={question.title} /> }
          </div>
        </div>
        {
          this.state.showComment
            && comments.data
            && <CommentList
              comments={comments}
              onComment={this.props.onCommentClick}
              onCommentsMore={this.props.onMoreComments}
              onClose={::this.handleHideComment} />
        }
      </div>
    );
  }

  render() {
    const { content, question, user, comments } = this.props;
    return (
      <div className={styles.topicCard}>
        <Link className="title" to={`/detail/${question.id}`}>{question.title}</Link>
        <div className="author">
          <Link className="link" to={`/person/${user.id}`}>{user.displayName}</Link>
          <span>的答案：</span>
        </div>
        <Answer answerShort={content} answerFull={content} />
        { this.renderOptionArea() }
      </div>
    );
  }
}
