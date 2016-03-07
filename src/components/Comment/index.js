import React from 'react';
import { Link } from 'react-router';

import { Avatar } from '#/components';
import styles from './style.less';

export default class Comment extends React.Component {

  static propTypes = {
    content: React.PropTypes.object,
    onComment: React.PropTypes.func,
    onCommentPoke: React.PropTypes.func
  };

  constructor(props) {
    super(props);
    this.state = {
      showReply: false,
      comment: undefined
    };
  }

  handleShowInput() {
    this.setState({
      showReply: !this.state.showReply
    });
  }

  handleInput(e) {
    this.setState({
      comment: e.target.value
    });
  }

  handleInputSubmit() {
    const { id } = this.props.content.user;
    const { comment } = this.state;
    if (comment) {
      this.props.onComment(comment, id)
      .then(() => {
        this.setState({
          comment: '',
          showReply: false
        });
      })
    }
  }

  handleCommentPoke(id) {
    this.props.onCommentPoke(id);
  }

  renderOptionArea() {
    const { id, createdAt, upVotesCount } = this.props.content;
    const { comment } = this.state;
    const clx = comment ? "btn primary" : "btn disabled";

    return (
      <div className={styles.optionArea}>
        <div className={styles.options}>
          <div className="info-area">
            <div>{createdAt}</div>
            <div className="option-btns">
              <div className="reply options" onClick={::this.handleShowInput}>回复</div>
              <div className="like options" onClick={this.handleCommentPoke.bind(this, id)}>赞</div>
              <div className="report options">举报</div>
            </div>
          </div>
          <div className="count">{upVotesCount} 赞</div>
        </div>
        {
          this.state.showReply
            && <div className="reply-area">
              <textarea className="reply-input" value={comment} onChange={::this.handleInput} />
              <div className={clx} onClick={::this.handleInputSubmit}>回复</div>
            </div>
        }
      </div>
    );
  }

  render() {
    const { content, createdAt, replyTo, user } = this.props.content;
    return (
      <div className={styles.detail}>
        <div className="avatar">
          <Avatar name={user.displayName} />
        </div>
        <div className={styles.main}>
          <div className={styles.title}>
            <Link className="from" to={`/person/${user.id}`}>{user.displayName}</Link>
            { replyTo && <div className="to"><span className="tip">回复</span>{replyTo.displayName}</div>}
          </div>
          <div className={styles.content}>{content}</div>
          { content ? this.renderOptionArea() : <div>loading...</div> }
        </div>
      </div>
    );
  }
}
