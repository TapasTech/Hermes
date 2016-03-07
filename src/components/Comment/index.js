import React from 'react';
import { Link } from 'react-router';

import { Avatar } from '#/components';
import {GraphqlRest, encodeField, timeFormatter} from '#/utils';
import styles from './style.less';

export default class Comment extends React.Component {

  static propTypes = {
    data: React.PropTypes.object,
    onComment: React.PropTypes.func,
  };

  static fragments = `
  fragment fragComment on Comment {
    id
    createdAt
    updatedAt
    content
    upVotesCount
    user { id displayName }
    replyTo { id displayName }
  }
  `;

  constructor(props) {
    super(props);
    this.state = {
      showReply: false,
      upVotesCount: props.data.upVotesCount,
      comment: '',
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

  handleInputSubmit = () => {
    this.props.onComment(this.props.data.user.id, this.state.comment)
    .then(() => {
      this.setState({
        comment: '',
        showReply: false,
      });
    });
  }

  prepareUpVote() {
    const query = `
    comment(id: ${encodeField(this.props.data.id)}) {
      mutation {
        voteUp {
          id
          upVotesCount
        }
      }
    }
    `;
    const callback = data => {
      const {upVotesCount} = data.comment.mutation.voteUp;
      this.setState({
        upVotesCount,
      });
    };
    return {
      query,
      callback,
    };
  }

  handleUpVote = () => {
    GraphqlRest.handleQueries(
      this.prepareUpVote()
    );
  }

  renderOptionArea() {
    const { id, createdAt } = this.props.data;
    const { comment, upVotesCount } = this.state;
    const clx = comment ? "btn primary" : "btn disabled";

    return (
      <div className={styles.optionArea}>
        <div className={styles.options}>
          <div className="info-area">
            <div>{timeFormatter(createdAt)}</div>
            <div className="option-btns">
              <div className="reply options" onClick={::this.handleShowInput}>回复</div>
              <div className="like options" onClick={this.handleUpVote}>赞</div>
              <div className="report options">举报</div>
            </div>
          </div>
          <div className="count">{upVotesCount} 赞</div>
        </div>
        {
          this.state.showReply
            && <div className="reply-area">
              <textarea className="reply-input" value={comment} onChange={::this.handleInput} />
              <div className={clx} onClick={this.handleInputSubmit}>回复</div>
            </div>
        }
      </div>
    );
  }

  render() {
    const { content, createdAt, replyTo, user } = this.props.data;
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
