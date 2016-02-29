import React from 'react';
import { Link } from 'react-router';
import QRCode from 'qrcode-react';

import { CommentList } from '#/components';

import styles from './style.less';

export default class QuestionCard  extends React.Component {

  static propTypes = {
    content: React.PropTypes.object
  };

  constructor(props) {
    super(props);
    this.state = {
      shortAnswer: true,
      showShare: false,
      showComment: false
    };
  }

  handleShowShort() {
    this.setState({
      shortAnswer: true,
      showShare: false
    });
  }

  handleShowFull() {
    this.setState({
      shortAnswer: false,
      showShare: false
    });
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

  renderShare() {
    const objectToParams = (object) => {
      const string = Object.keys(object).map(key => `${key}=${encodeURIComponent(object[key])}`).join('&')
      return `?${string}`
    };

    const url = '1';
    const title = '2';

    return(
      <div className={styles.shareTip}>
        <a
          className="weibo"
          target="_blank"
          href={`http://v.t.sina.com.cn/share/share.php${objectToParams({url: url, title: title})}`}>
          <span className="icon icon-weibo"></span>
          分享到微博
        </a>
        <div className="weixin">
          <div className="tip">
            <span className="icon icon-weixin"></span>
            微信扫一扫
          </div>
          <div className="qrcode">
            <QRCode value={url} size={100} />
          </div>
        </div>
      </div>
    );
  }

  render() {
    const { tag, topic, question, author, answerString, answerHTML, authorId, like, picUrl, comments } = this.props.content;
    const _answerHTML = {__html: answerHTML};
    return (
      <div className={styles.qcard}>
        <div className="tag">{tag}</div>
        <div className={styles.main}>
          <div className="tip">热门回答，来自 {topic} 话题</div>
          <div className="title">{question}</div>
          <div className="author">
            <Link className="link" to={`/user/${authorId}`}>{author}</Link>
            <span>的答案：</span>
          </div>
          <div className="content">
            <div className="answer">
              {
                this.state.shortAnswer
                  ? <div className="short" onClick={::this.handleShowFull}>{answerString.substr(0, 140)}<span className="show">...显示全部</span></div>
                  :  <div className="long">
                    <div className="text" dangerouslySetInnerHTML={_answerHTML}></div>
                    <div className="hide" onClick={::this.handleShowShort}>收起回答</div>
                  </div>
              }
            </div>
            {
              picUrl && this.state.shortAnswer &&  <div className="pic" style={{backgroundImage: `url(${picUrl})`}}></div>
            }
          </div>
          <div className="other">
            <div className="like">
              <div className="text">赞同</div>
              <div className="poke-area">
                <div className="poke">
                  <div>{like}</div>
                  <div>+1</div>
                </div>
              </div>
            </div>
            <div className="comment" onClick={::this.handleShowComment}>
              <span>评论</span>
              <span className="count">{comments ? comments.length : 0}</span>
            </div>
            <div className="share">
              <span onClick={::this.handleShowShare}>分享</span>
              { this.state.showShare && this.renderShare() }
            </div>
          </div>
          {
            this.state.showComment
              && comments
              && comments.length
              && <CommentList comments={comments} onClose={::this.handleHideComment} />
          }
        </div>
      </div>
    );
  }
}
