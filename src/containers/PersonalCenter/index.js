import React from 'react';

import Store from '#/store';
import { Avatar, TopicCard } from '#/components';
import styles from './style.less';

export default class PersonalCenter extends React.Component {
  static propTypes = {
    name: React.PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = {
      tab: 1,
      user: {},
    };
  }

  componentDidMount() {
    Store.on('EVT_USER', () => {
      this.setState({user: Store.user.index().data});
    });
  }

  handleTabSwitch(tabIndex) {
    this.setState({
      tab: tabIndex
    });
  }

  mapStatusToZh(key) {
    const map = {
      'reply': '回复',
      'follow': '关注',
      'poke': '赞同',
      'ask': '提出'
    }

    return map[key]
  }

  renderInfo() {
    const {user} = this.state;
    console.log(user);
    return (
      <div className={styles.info}>
        <div className={styles.base}>
          <Avatar url={user.avatar} large={true} />
          <div className="name">{user.name}</div>
        </div>
        <div className={styles.data}>
          <div className="item">
            <div className="num">132</div>
            <div className="tip">关注</div>
          </div>
          <div className="item">
            <div className="num">3432</div>
            <div className="tip">粉丝</div>
          </div>
          <div className="item">
            <div className="num">92432</div>
            <div className="tip">赞同</div>
          </div>
        </div>
        <div className="btn primary">关注</div>
      </div>
    );
  }

  renderIntro() {
    return (
      <div className={styles.intro}>
        <div>上海 | 咨询</div>
        <div>CBNData | 数据分析师</div>
        <div>加州大学伯克利分校 (UC Berkeley)</div>
      </div>
    );
  }

  renderStreamCard(item, index) {
    return (
      <div className={styles.card} key={index}>
        <div className="header">
          <div>
            {item.author.name}
            {this.mapStatusToZh(item.status)}了
            { item.status === 'ask' ? '问题' : '回答'}
          </div>
          <div>{item.time}</div>
        </div>
        {
          item.status === 'poke'
            ? <TopicCard content={item} />
            : <div className="title">{item.question}</div>
        }
      </div>
    );
  }

  renderStream() {
    const { tab } = this.state;
    const replyList = topicList.filter(item => item.status === 'reply');
    const askList = topicList.filter(item => item.status === 'ask');

    let dataSource;
    if (tab === 2) {
      dataSource = replyList;
    } else if (tab === 3) {
      dataSource = askList;
    } else {
      dataSource = topicList;
    }

    return (
      <div className={styles.pipe}>
        <div className={styles.tabs}>
          <div
            className={tab === 1 ? "tab active" : "tab"}
            onClick={this.handleTabSwitch.bind(this, 1)}>
            最新动态
          </div>
          <div
            className={tab === 2 ? "tab active" : "tab"}
            onClick={this.handleTabSwitch.bind(this, 2)}>
            回答·{replyList.length}
          </div>
          <div
            className={tab === 3 ? "tab active" : "tab"}
            onClick={this.handleTabSwitch.bind(this, 3)}>
            提问·{askList.length}
          </div>
        </div>
        <div className={styles.stream}>
          { dataSource.map((item, index) => this.renderStreamCard(item, index)) }
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className="container">
        <div className="sidebar">
          { this.renderInfo() }
          { this.renderIntro() }
        </div>
        <div className="main">
          { this.renderStream() }
        </div>
      </div>
    );
  }
}
