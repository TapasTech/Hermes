import React from 'react';

import { Comment } from '#/components';

import styles from './style.less';

export default class CommentList extends React.Component {
  static propTypes = {
    comments: React.PropTypes.object,
    onClose: React.PropTypes.func,
    onComment: React.PropTypes.func,
    onCommentsMore: React.PropTypes.func
  };

  constructor(props) {
    super(props);
    this.state = {
      currentPage: 1,
      comment: undefined
    }
  }

  handleShowMore() {
    this.setState({
      currentPage: this.state.currentPage + 1
    }, () => this.props.onCommentsMore(this.state.currentPage));
  }

  handleInput(e) {
    this.setState({
      comment: e.target.value
    });
  }

  handleInputSubmit() {
    const { comment } = this.state;
    if (comment) {
      this.props.onComment(comment)
      .then(() => {
        this.setState({
          comment: ''
        });
      })
    }
  }

  render() {
    const { data, meta } = this.props.comments;
    const { current_page, total_pages, total_count } = meta;
    const { currentPage, comment } = this.state;
    const commentList = [].concat(data);

    const clx = comment ? "btn primary" : "btn disabled";

    return (
      <div className={styles.commentList}>
        {
          commentList.map((item, index) => <Comment key={index} content={item} onComment={this.props.onComment} />)
        }
        {
          (current_page < total_pages)
            ? <div className="option" onClick={::this.handleShowMore}>显示更多</div>
            : <div className="option" onClick={::this.props.onClose}>收起评论</div>
        }
        <div className="reply-area">
          <textarea className="reply-input" value={comment} onChange={::this.handleInput} />
          <div className={clx} onClick={::this.handleInputSubmit}>回复</div>
        </div>
      </div>
    );
  }
}
