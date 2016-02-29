import React from 'react';

import styles from './style.less';

export default class Answer extends React.Component {
  static propTypes = {
    answerShort: React.PropTypes.string,
    answerFull: React.PropTypes.string,
    pic: React.PropTypes.string
  };

  constructor(props) {
    super(props);
    this.state = {
      full: false
    }
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

  render() {
    const { answerFull, answerShort, pic } = this.props;
    const _answerHTML = { __html: answerFull };
    return (
      <div className={styles.answer}>
        <div className={styles.content}>
          {
            this.state.full
              ?  <div className="long">
                <div className="text" dangerouslySetInnerHTML={_answerHTML}></div>
                <div className="hide" onClick={::this.handleHideFull}>收起回答</div>
              </div>
              : <div className="short" onClick={::this.handleShowFull}>
                { answerShort.substr(0, 140) }<span className="show">...显示全部</span>
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
