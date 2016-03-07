import React from 'react';

import styles from './style.less';

export default class Answer extends React.Component {
  static propTypes = {
    answerContent: React.PropTypes.string,
    pic: React.PropTypes.string
  };

  constructor(props) {
    super(props);
    this.state = {
      full: false
    };
  }

  handleHideFull() {
    this.setState({
      full: false
    });
  }

  handleShowFull() {
    this.setState({
      full: true
    });
  }

  getShortAnswer(content) {
    const div = document.createElement('div');
    div.innerHTML = content;
    return div.textContent.slice(0, 140);
  }

  render() {
    const { answerContent, pic } = this.props;
    const _answerHTML = { __html: answerContent };
    return (
      <div className={styles.answer}>
        <div className={styles.content}>
          {
            this.state.full
              ?  <div>
                <div className="long" dangerouslySetInnerHTML={_answerHTML}></div>
                <div className="hide" onClick={::this.handleHideFull}>收起回答</div>
              </div>
              : <div className="short" onClick={::this.handleShowFull}>
                { this.getShortAnswer(answerContent) }<span className="show">...显示全部</span>
              </div>
          }
        </div>
        {
          pic && !this.state.full && <div className="pic" style={{backgroundImage: `url(${pic})`}}></div>
        }
      </div>
    );
  }
}
