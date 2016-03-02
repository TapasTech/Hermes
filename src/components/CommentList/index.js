import React from 'react';

import { Comment } from '#/components';

import styles from './style.less';

export default class CommentList extends React.Component {
  static propTypes = {
    comments: React.PropTypes.array,
    onClose: React.PropTypes.func
  };

  constructor(props) {
    super(props);
    this.state = {
      currentPage: 1
    }
  }

  handleShowMore() {
    this.setState({
      currentPage: this.state.currentPage + 1
    });
  }

  render() {
    const { comments } = this.props;
    const { currentPage } = this.state;
    const commentList = [].concat(comments);
    const endIndex = currentPage * 5;
    let onePageComments = commentList.slice(0, endIndex);
    return (
      <div className={styles.commentList}>
        {
          onePageComments.map((item, index) => <Comment content={item} key={index} />)
        }
        {
          ((comments.length > 5) && (endIndex < comments.length))
          ? <div className="option" onClick={::this.handleShowMore}>显示更多</div>
          : <div className="option" onClick={::this.props.onClose}>收起评论</div>
        }
        <div className="reply-area">
          <textarea className="reply-input" />
          <div className="btn primary">回复</div>
        </div>
      </div>
    );
  }
}
