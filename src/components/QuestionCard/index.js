import React from 'react';
import { Link } from 'react-router';

import styles from './style.less';

export default class QuestionCard  extends React.Component {

  static defaultProps = {
    content: {
      tag: '热门',
      topic: '社会',
      question: '春节回家，如何避免高速拥堵？',
      answerString: '1月30日到2月6日（除夕前一天）高速车流以返乡为主。据大数据预测，全国最拥堵的高速路段TOP3为：成都的S2成巴高速（福洪大桥-沱江特大桥）成都的S2成巴高速（福洪大桥-沱江特大桥）昆明的G56杭瑞高速（严家山服务区-兔耳关收费站）,高速拥堵绕行省道，随机应变。据了解，今年春节期间，将全面启动高速公路与普通公路联运机制，实施全市公路的统一指挥调度。当某条高速公路发生拥堵时，配备视频的路政巡查车辆会及时将拥堵路段信息上传路网管理中心，路网管理中心经分析后，将在距拥堵路段最近收费站通过国省干线公路进行分流，并通过行驶上最近的国省干线公路后重上高速公路行驶。例如：G1（京哈高速）可以通过102国道、津围公路、唐通公路、宝平公路等绕行；G2（京沪高速）可以通过104国道、高王公路、静霸公路等进行绕行；G18（荣乌高速）可以通过104国道、205国道、112国道、津王公路、港中公路等进行绕行；G25（长深高速）可以通过103国道、205国道、津港公路、滨唐公路等进行绕行；G2501（滨保高速）可以通过津芦公路、杨北公路、九园公路、津永公路等进行绕行。路程中可以随时关注高速部门通过微信、微博发布的信息，调整自己的出行路线。',
      answerHTML: '1月30日到2月6日（除夕前一天）高速车流以返乡为主。<br>据大数据预测，全国最拥堵的高速路段TOP3为：<br>成都的S2成巴高速（福洪大桥-沱江特大桥）<br>成都的S2成巴高速（福洪大桥-沱江特大桥）<br>昆明的G56杭瑞高速（严家山服务区-兔耳关收费站）,高速拥堵绕行省道，随机应变。<img src="http://i11.tietuku.com/f01cdb2e505f49e4.png" /><br>据了解，今年春节期间，将全面启动高速公路与普通公路联运机制，实施全市公路的统一指挥调度。当某条高速公路发生拥堵时，配备视频的路政巡查车辆会及时将拥堵路段信息上传路网管理中心，路网管理中心经分析后，将在距拥堵路段最近收费站通过国省干线公路进行分流，并通过行驶上最近的国省干线公路后重上高速公路行驶。例如：G1（京哈高速）可以通过102国道、津围公路、唐通公路、宝平公路等绕行；G2（京沪高速）可以通过104国道、高王公路、静霸公路等进行绕行；G18（荣乌高速）可以通过104国道、205国道、112国道、津王公路、港中公路等进行绕行；G25（长深高速）可以通过103国道、205国道、津港公路、滨唐公路等进行绕行；G2501（滨保高速）可以通过津芦公路、杨北公路、九园公路、津永公路等进行绕行。路程中可以随时关注高速部门通过微信、微博发布的信息，调整自己的出行路线。',
      author: 'Amano',
      authorId: 12345,
      like: 1322,
      picUrl: 'http://i11.tietuku.com/f01cdb2e505f49e4.png'
    }
  };

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
    });
  }

  handleShowFull() {
    this.setState({
      shortAnswer: false
    });
  }

  displayAnswer() {
    const { answerString, answerHTML } = this.props.content;
    let _answer
    if (this.state.shortAnswer) {
      _answer = answerString.substr(0, 140)
    } else {
      _answer = answerHTML
    }
    return {
      __html: _answer
    };
  }

  render() {
    const { tag, topic, question, author, authorId, like, picUrl } = this.props.content;
    return (
      <div className={styles.qcard}>
        <div className="tag">{tag}</div>
        <div className="main">
          <div className="tip">热门回答，来自 {topic} 话题</div>
          <div className="title">{question}</div>
          <div className="author">
            <Link className="link" to={`/user/${authorId}`}>{author}</Link>
            <span>的答案：</span>
          </div>
          <div className="content">
            <div className="answer">
              <div className="text" dangerouslySetInnerHTML={this.displayAnswer()}></div>
              {
                this.state.shortAnswer
                  ? <div className="show" onClick={::this.handleShowFull}>...显示全部</div>
                  : <div className="hide" onClick={::this.handleShowShort}>收起回答</div>
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
