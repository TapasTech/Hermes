import React from 'react';
import { Link } from 'react-router';

import styles from './style.less';

export default class QuestionCard  extends React.Component {

  static propTypes = {
    content: React.PropTypes.object
  };

  constructor(props) {
    super(props);
    this.state = {
      shortAnswer: true
    }
  }

  handleShowShort() {
    this.setState({
      shortAnswer: true
    }, () => console.log(this.state));
  }

  handleShowFull() {
    this.setState({
      shortAnswer: false
    });
  }

  render() {
    const { tag, topic, question, author, answerString, answerHTML, authorId, like, picUrl } = this.props.content;
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
          <div className="like">
            <div className="text">赞同</div>
            <div className="poke-area">
              <div className="poke">
                <div>{like}</div>
                <div>+1</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
