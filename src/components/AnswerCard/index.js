import React from 'react';
import { Link } from 'react-router';

import { Answer, CommentList, ShareBar, PokeButton } from '#/components';
import DataSources from '../DataSources';
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
    dataSets(page: 1, count: 5) {
      ...fragDataSets
    }
    dataReports(page: 1, count: 5) {
      ...fragDataReports
    }
    upVotesCount
    comments(page: 1, count: 5) {
      meta {
        current_page
        total_pages
        total_count
      }
    }
  } ${DataSources.fragments}`;

  constructor(props) {
    super(props);
    this.state = {
      showShare: false,
      showComment: false,
      upVotesCount: props.answer.upVotesCount,
      commentsCount: props.answer.comments.meta.total_count,
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

  onSetCount = (total) => {
    this.setState({
      commentsCount: total,
    });
  }

  renderOptionArea() {
    const { id, question } = this.props.answer;
    const { upVotesCount } = this.state;
    return (
      <div className={styles.cardOption}>
        <div className="other">
          <PokeButton count={upVotesCount} onClick={this.handleUpVote} />
          <div className="comment" onClick={::this.handleShowComment}>
            <span>评论</span>
            <span className="count">{ this.state.commentsCount }</span>
          </div>
          <div className="share">
            <span onClick={::this.handleShowShare}>分享</span>
            { this.state.showShare && <ShareBar className="bar" url={`/question/${question.id}`} title={question.title} /> }
          </div>
        </div>
        { this.state.showComment &&
          <CommentList answerId={id} onSetCount={this.onSetCount} />
        }
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
        <DataSources dataSets={answer.dataSets} dataReports={answer.dataReports} />
        { this.renderOptionArea() }
      </div>
    );
  }
}
