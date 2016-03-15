import React from 'react';
import { Link } from 'react-router';

import { Avatar } from '#/components';
import {GraphqlRest, encodeField, formatter} from '#/utils';

import './style.less';

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

  componentWillReceiveProps(nextProps) {
    this.setState({
      showReply: false,
      upVotesCount: nextProps.data.upVotesCount,
      comment: '',
    });
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
    const clx = comment ? "btn btn-primary" : "btn btn-disabled";

    return (
      <div>
        <div className="text-gray clearfix">
          <div className="pull-left">{formatter.time(createdAt)}</div>
          <div className="comment-options pull-left">
            <div className="comment-option pull-left reply" onClick={::this.handleShowInput}>回复</div>
            <div className="comment-option pull-left like" onClick={this.handleUpVote}>赞</div>
            <div className="comment-option pull-left report">举报</div>
          </div>
          <div className="pull-right">{upVotesCount} 赞</div>
        </div>
        {
          this.state.showReply
            && <div className="comment-reply">
              <textarea className="comment-reply-input" value={comment} onChange={::this.handleInput} />
              <div className={clx} onClick={this.handleInputSubmit}>回复</div>
            </div>
        }
      </div>
    );
  }

  render() {
    const { content, createdAt, replyTo, user } = this.props.data;
    return (
      <div className="comment clearfix">
        <div className="comment-main pull-left">
          <div>
            <div className="comment-header clearfix">
              <Link className="comment-from pull-left mr-sm" to={`/user/${user.id}`}>{user.displayName}</Link>
              { replyTo && <div className="comment-to pull-left"><span className="text-gray mr-sm">回复</span>{replyTo.displayName}</div>}
            </div>
            <div className="comment-content">{content}</div>
            { content ? this.renderOptionArea() : <div>loading...</div> }
          </div>
        </div>
        <div className="comment-avatar pull-left">
          <Avatar name={user.displayName} />
        </div>
      </div>
    );
  }
}
