import React from 'react'
import styles from './style.less';

import { Avatar, OptionArea } from '#/components';

export default class CommentList extends React.Component {

  static propTypes = {
    content: React.PropTypes.object
  };

  constructor(props) {
    super(props);
    this.state = {
      showReply: false
    };
  }

  handleShowReply() {
    this.setState({
      showReply: !this.state.showReply
    });
  }

  renderOptionArea() {
    const { content } = this.props;
    return (
      <div className={styles.optionArea}>
        <div className={styles.options}>
          <div className="info-area">
            <div>{content.time || '1天前'}</div>
            <div className="option-btns">
              <div className="reply options" onClick={::this.handleShowReply}>回复</div>
              <div className="like options">赞</div>
              <div className="report options">举报</div>
            </div>
          </div>
          <div className="count">{content.like || 0} 赞</div>
        </div>
        {
          this.state.showReply
            && <div className="reply-area">
              <textarea className="reply-input" />
              <div className="btn">回复</div>
            </div>
        }
      </div>
    );
  }

  render() {
    const { content } = this.props;
    return (
      <div className={styles.detail}>
        <div className="avatar">
          <Avatar url={content.author.avatar} />
        </div>
        <div className={styles.main}>
          <div className={styles.title}>
            <div className="from">{content.author.name}</div>
            { content.to && <div className="to"><span className="tip">回复</span>{content.to}</div>}
          </div>
          <div className={styles.content}>{content.content}</div>
          { this.renderOptionArea() }
        </div>
      </div>
    );
  }
}
