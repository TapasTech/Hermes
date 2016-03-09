import React from 'react';

import { Comment } from '#/components';
import {GraphqlRest, encodeField} from '#/utils';

import styles from './style.less';

export default class CommentList extends React.Component {
  static propTypes = {
    answerId: React.PropTypes.string,
    onSetCount: React.PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      currentPage: 1,
      totalPages: 1,
      comment: '',
      data: [],
    }
    this.totalCount = 0;
  }

  componentDidMount() {
    GraphqlRest.handleQueries(
      this.prepareData()
    );
  }

  prepareData(page = 0) {
    const query = `
    answer(id: ${encodeField(this.props.answerId)}) {
      comments(page: ${page}, count: 5) {
        data {
          ...fragComment
        }
        meta { current_page total_pages total_count }
      }
    }`;
    const callback = data => {
      const comments = data.answer.comments;
      this.setState({
        currentPage: comments.meta.current_page,
        totalPages: comments.meta.total_pages,
        data: [
          ... this.state.data,
          ... comments.data,
        ],
      });
      this.setTotal(comments.meta.total_count);
    };
    return {
      query,
      callback,
      fragments: Comment.fragments,
    };
  }

  setTotal(total) {
    const onSetCount = this.props.onSetCount;
    onSetCount && onSetCount(this.totalCount = total);
  }

  handleShowMore = () => {
    GraphqlRest.handleQueries(
      this.prepareData(this.state.currentPage + 1)
    );
  }

  handleInput = (e) => {
    this.setState({
      comment: e.target.value
    });
  }

  handleInputSubmit = () => {
    this.handleComment('', this.state.comment)
    .then(() => {
      this.setState({
        comment: ''
      });
      this.setTotal(this.totalCount + 1);
    });
  }

  prepareComment(replyToId, content) {
    const query = `
    answer(id: ${this.props.answerId}) {
      mutation {
        comment: createComment(content: "${content}", reply_to_id: "${replyToId}") {
          ...fragComment
        }
      }
    }
    `;
    const callback = data => {
      const comment = data.answer.mutation.comment;
      const _data = this.state.data;
      _data.unshift(comment);
      this.setState({});
    };
    return {
      query,
      callback,
      fragments: Comment.fragments,
    };
  }

  handleComment = (replyToId, content) => {
    return GraphqlRest.handleQueries(
      this.prepareComment(replyToId, content)
    );
  }

  render() {
    const { currentPage, totalPages, comment, data } = this.state;
    const clx = comment ? "btn primary" : "btn disabled";
    return (
      <div className={styles.commentList}>
        {data.map((item, index) => (
          <Comment key={index} data={item} onComment={this.handleComment} />
        ))}
        {currentPage < totalPages &&
          <div className="option" onClick={this.handleShowMore}>显示更多</div>
        }
        <div className="reply-area">
          <textarea className="reply-input" value={comment} onChange={this.handleInput} />
          <div className={clx} onClick={this.handleInputSubmit}>回复</div>
        </div>
      </div>
    );
  }
}
