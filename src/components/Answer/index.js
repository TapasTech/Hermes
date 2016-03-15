import React from 'react';

import styles from './style.less';

export default class Answer extends React.Component {
  static propTypes = {
    answerContent: React.PropTypes.string.isRequired,
    showFull: React.PropTypes.bool
  };

  constructor(props) {
    super(props);
    const { answerContent, showFull } = this.props;
    const divEl = document.createElement('div');
    divEl.innerHTML = this.props.answerContent;
    const imgEl = divEl.getElementsByTagName('img')[0];
    this.state = {
      full: showFull ? true : false,
      shortAnswer: divEl.textContent.slice(0, 140),
      pic: imgEl ? imgEl.src : undefined
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

  render() {
    const { shortAnswer, pic }  = this.state;
    return (
      <div className="answer clearfix">
        <div className="answer-content">
            {
              this.state.full
                ?  <div>
                  <div className="answer-long" dangerouslySetInnerHTML={{__html: this.props.answerContent}}></div>
                  <div className="answer-hide mr" onClick={::this.handleHideFull}>收起回答</div>
                </div>
                : <div className="answer-short" onClick={::this.handleShowFull}>
                  { shortAnswer }<span className="answer-show">...显示全部</span>
                </div>
            }
        </div>
        {
          pic && !this.state.full && <div className="answer-pic" style={{backgroundImage: `url(${pic})`}}></div>
        }
      </div>
    );
  }
}
