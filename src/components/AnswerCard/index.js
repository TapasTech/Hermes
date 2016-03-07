import React from 'react';
import { Link } from 'react-router';

import { Answer, CommentList, ShareBar, PokeButton } from '#/components';
import {GraphqlRest, encodeField} from '#/utils';

import styles from './style.less';

export default class AnswerCard extends React.Component {

  static propTypes = {
    answer: React.PropTypes.object,
  };

  static fragments = `
  fragment fragAnswer on Answer {
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
      meta {
        current_page
        total_pages
        total_count
      }
    }
  }
  `;

  constructor(props) {
    super(props);
    this.state = {
      showShare: false,
      showComment: false,
      upVotesCount: props.answer.upVotesCount,
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

  prepareUpVote() {
    const query = `
    answer(id: ${encodeField(this.props.answer.id)}) {
      mutation {
        voteUp {
          id
          upVotesCount
        }
      }
    }
    `;
    const callback = data => {
      const {upVotesCount} = data.answer.mutation.voteUp;
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
    const { answer } = this.props;
    const {upVotesCount} = this.state;
    return (
      <div className={styles.cardOption}>
        <div className="other">
          <PokeButton count={upVotesCount} onClick={this.handleUpVote} />
          <div className="comment" onClick={::this.handleShowComment}>
            <span>评论</span>
            <span className="count">{ answer.comments.meta.total_count  }</span>
          </div>
          <div className="share">
            <span onClick={::this.handleShowShare}>分享</span>
            { this.state.showShare && <ShareBar className="bar" url={`/question/${question.id}`} title={answer.question.title} /> }
          </div>
        </div>
        { this.state.showComment && <CommentList answerId={answer.id} /> }
      </div>
    );
  }

  render() {
    const { answer } = this.props;
    return (
      <div className={styles.topicCard}>
        <Link className="title" to={`/question/${answer.question.id}`}>{answer.question.title}</Link>
        <div className="author">
          <Link className="link" to={`/user/${answer.user.id}`}>{answer.user.displayName}</Link>
          <span>的答案：</span>
        </div>
        <Answer answerContent={answer.content} />
        { this.renderOptionArea() }
      </div>
    );
  }
}
