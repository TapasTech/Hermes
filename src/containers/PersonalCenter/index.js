import React from 'react';

import { Avatar, TopicCard } from '#/components';
import styles from './style.less';

const author = {
  name: 'Amano',
  avatar: 'http://i12.tietuku.com/29043ce4dff12032.png',
  authorId: 12345,
  intro: '金融鄙视链末端的银行狗'
}

const data = [
  {
    status: 'reply',
    time: '45分钟前',
    id: '1',
    tag: '热门',
    topic: '社会',
    question: '春节回家，如何避免高速拥堵？',
    answerString: '1月30日到2月6日（除夕前一天）高速车流以返乡为主。据大数据预测，全国最拥堵的高速路段TOP3为：成都的S2成巴高速（福洪大桥-沱江特大桥）成都的S2成巴高速（福洪大桥-沱江特大桥）昆明的G56杭瑞高速（严家山服务区-兔耳关收费站）,高速拥堵绕行省道，随机应变。据了解，今年春节期间，将全面启动高速公路与普通公路联运机制，实施全市公路的统一指挥调度。当某条高速公路发生拥堵时，配备视频的路政巡查车辆会及时将拥堵路段信息上传路网管理中心，路网管理中心经分析后，将在距拥堵路段最近收费站通过国省干线公路进行分流，并通过行驶上最近的国省干线公路后重上高速公路行驶。例如：G1（京哈高速）可以通过102国道、津围公路、唐通公路、宝平公路等绕行；G2（京沪高速）可以通过104国道、高王公路、静霸公路等进行绕行；G18（荣乌高速）可以通过104国道、205国道、112国道、津王公路、港中公路等进行绕行；G25（长深高速）可以通过103国道、205国道、津港公路、滨唐公路等进行绕行；G2501（滨保高速）可以通过津芦公路、杨北公路、九园公路、津永公路等进行绕行。路程中可以随时关注高速部门通过微信、微博发布的信息，调整自己的出行路线。',
    answerHTML: '1月30日到2月6日（除夕前一天）高速车流以返乡为主。<br>据大数据预测，全国最拥堵的高速路段TOP3为：<br>成都的S2成巴高速（福洪大桥-沱江特大桥）<br>成都的S2成巴高速（福洪大桥-沱江特大桥）<br>昆明的G56杭瑞高速（严家山服务区-兔耳关收费站）,高速拥堵绕行省道，随机应变。<img src="http://i11.tietuku.com/f01cdb2e505f49e4.png" /><br>据了解，今年春节期间，将全面启动高速公路与普通公路联运机制，实施全市公路的统一指挥调度。当某条高速公路发生拥堵时，配备视频的路政巡查车辆会及时将拥堵路段信息上传路网管理中心，路网管理中心经分析后，将在距拥堵路段最近收费站通过国省干线公路进行分流，并通过行驶上最近的国省干线公路后重上高速公路行驶。例如：G1（京哈高速）可以通过102国道、津围公路、唐通公路、宝平公路等绕行；G2（京沪高速）可以通过104国道、高王公路、静霸公路等进行绕行；G18（荣乌高速）可以通过104国道、205国道、112国道、津王公路、港中公路等进行绕行；G25（长深高速）可以通过103国道、205国道、津港公路、滨唐公路等进行绕行；G2501（滨保高速）可以通过津芦公路、杨北公路、九园公路、津永公路等进行绕行。路程中可以随时关注高速部门通过微信、微博发布的信息，调整自己的出行路线。',
    author: {
      name: 'Amano',
      avatar: 'http://i11.tietuku.com/60857f76cd893c0d.png',
      authorId: 12345,
      intro: '金融鄙视链末端的银行狗'
    },
    like: 1322,
    picUrl: 'http://i11.tietuku.com/f01cdb2e505f49e4.png',
    comments: [
      {
        author: {
          name: '张三',
          avatar: 'http://i11.tietuku.com/60857f76cd893c0d.png'
        },
        content: '答主研究的领域是人口方面么？题目是问社会影响，答主偏向预测数量增长，建议可以谈一谈影响。',
        date: '2天前',
        like: 23
      },
      {
        author: {
          name: '李四',
          avatar: 'http://i13.tietuku.com/02eca4d180332df3.png'
        },
        to: '张三',
        content: '答主研究的领域是人口方面么？题目是问社会影响，答主偏向预测数量增长，建议可以谈一谈影响。',
        date: '2天前',
        like: 0
      },
      {
        author: {
          name: '李四',
          avatar: 'http://i13.tietuku.com/02eca4d180332df3.png'
        },
        content: '答主研究的领域是人口方面么？题目是问社会影响，答主偏向预测数量增长，建议可以谈一谈影响。',
        date: '2天前',
        like: 0
      },
      {
        author: {
          name: '张三',
          avatar: 'http://i11.tietuku.com/60857f76cd893c0d.png'
        },
        to: '李四',
        content: '答主研究的领域是人口方面么？题目是问社会影响，答主偏向预测数量增长，建议可以谈一谈影响。'
      },
      {
        author: {
          name: '李四',
          avatar: 'http://i13.tietuku.com/02eca4d180332df3.png'
        },
        to: '张三',
        content: '答主研究的领域是人口方面么？题目是问社会影响，答主偏向预测数量增长，建议可以谈一谈影响。'
      },
      {
        author: {
          name: '张三',
          avatar: 'http://i11.tietuku.com/60857f76cd893c0d.png'
        },
        to: '李四',
        content: '答主研究的领域是人口方面么？题目是问社会影响，答主偏向预测数量增长，建议可以谈一谈影响。'
      },
      {
        author: {
          name: '李四',
          avatar: 'http://i13.tietuku.com/02eca4d180332df3.png'
        },
        to: '张三',
        content: '答主研究的领域是人口方面么？题目是问社会影响，答主偏向预测数量增长，建议可以谈一谈影响。'
      }
    ]
  },
  {
    status: 'follow',
    time: '40分钟前',
    id: '2',
    tag: '热门',
    topic: '社会',
    question: '春节回家，如何避免高速拥堵？',
    answerString: '1月30日到2月6日（除夕前一天）高速车流以返乡为主。据大数据预测，全国最拥堵的高速路段TOP3为：成都的S2成巴高速（福洪大桥-沱江特大桥）成都的S2成巴高速（福洪大桥-沱江特大桥）昆明的G56杭瑞高速（严家山服务区-兔耳关收费站）,高速拥堵绕行省道，随机应变。据了解，今年春节期间，将全面启动高速公路与普通公路联运机制，实施全市公路的统一指挥调度。当某条高速公路发生拥堵时，配备视频的路政巡查车辆会及时将拥堵路段信息上传路网管理中心，路网管理中心经分析后，将在距拥堵路段最近收费站通过国省干线公路进行分流，并通过行驶上最近的国省干线公路后重上高速公路行驶。例如：G1（京哈高速）可以通过102国道、津围公路、唐通公路、宝平公路等绕行；G2（京沪高速）可以通过104国道、高王公路、静霸公路等进行绕行；G18（荣乌高速）可以通过104国道、205国道、112国道、津王公路、港中公路等进行绕行；G25（长深高速）可以通过103国道、205国道、津港公路、滨唐公路等进行绕行；G2501（滨保高速）可以通过津芦公路、杨北公路、九园公路、津永公路等进行绕行。路程中可以随时关注高速部门通过微信、微博发布的信息，调整自己的出行路线。',
    answerHTML: '1月30日到2月6日（除夕前一天）高速车流以返乡为主。<br>据大数据预测，全国最拥堵的高速路段TOP3为：<br>成都的S2成巴高速（福洪大桥-沱江特大桥）<br>成都的S2成巴高速（福洪大桥-沱江特大桥）<br>昆明的G56杭瑞高速（严家山服务区-兔耳关收费站）,高速拥堵绕行省道，随机应变。<img src="http://i11.tietuku.com/f01cdb2e505f49e4.png" /><br>据了解，今年春节期间，将全面启动高速公路与普通公路联运机制，实施全市公路的统一指挥调度。当某条高速公路发生拥堵时，配备视频的路政巡查车辆会及时将拥堵路段信息上传路网管理中心，路网管理中心经分析后，将在距拥堵路段最近收费站通过国省干线公路进行分流，并通过行驶上最近的国省干线公路后重上高速公路行驶。例如：G1（京哈高速）可以通过102国道、津围公路、唐通公路、宝平公路等绕行；G2（京沪高速）可以通过104国道、高王公路、静霸公路等进行绕行；G18（荣乌高速）可以通过104国道、205国道、112国道、津王公路、港中公路等进行绕行；G25（长深高速）可以通过103国道、205国道、津港公路、滨唐公路等进行绕行；G2501（滨保高速）可以通过津芦公路、杨北公路、九园公路、津永公路等进行绕行。路程中可以随时关注高速部门通过微信、微博发布的信息，调整自己的出行路线。',
    author: {
      name: 'Amano',
      avatar: 'http://i11.tietuku.com/60857f76cd893c0d.png',
      authorId: 12345,
      intro: '金融鄙视链末端的银行狗'
    },
    like: 1322,
    picUrl: 'http://i11.tietuku.com/f01cdb2e505f49e4.png'
  },
  {
    status: 'poke',
    time: '35分钟前',
    id: '3',
    tag: '热门',
    topic: '社会',
    question: '春节回家，如何避免高速拥堵？',
    answerString: '1月30日到2月6日（除夕前一天）高速车流以返乡为主。据大数据预测，全国最拥堵的高速路段TOP3为：成都的S2成巴高速（福洪大桥-沱江特大桥）成都的S2成巴高速（福洪大桥-沱江特大桥）昆明的G56杭瑞高速（严家山服务区-兔耳关收费站）,高速拥堵绕行省道，随机应变。据了解，今年春节期间，将全面启动高速公路与普通公路联运机制，实施全市公路的统一指挥调度。当某条高速公路发生拥堵时，配备视频的路政巡查车辆会及时将拥堵路段信息上传路网管理中心，路网管理中心经分析后，将在距拥堵路段最近收费站通过国省干线公路进行分流，并通过行驶上最近的国省干线公路后重上高速公路行驶。例如：G1（京哈高速）可以通过102国道、津围公路、唐通公路、宝平公路等绕行；G2（京沪高速）可以通过104国道、高王公路、静霸公路等进行绕行；G18（荣乌高速）可以通过104国道、205国道、112国道、津王公路、港中公路等进行绕行；G25（长深高速）可以通过103国道、205国道、津港公路、滨唐公路等进行绕行；G2501（滨保高速）可以通过津芦公路、杨北公路、九园公路、津永公路等进行绕行。路程中可以随时关注高速部门通过微信、微博发布的信息，调整自己的出行路线。',
    answerHTML: '1月30日到2月6日（除夕前一天）高速车流以返乡为主。<br>据大数据预测，全国最拥堵的高速路段TOP3为：<br>成都的S2成巴高速（福洪大桥-沱江特大桥）<br>成都的S2成巴高速（福洪大桥-沱江特大桥）<br>昆明的G56杭瑞高速（严家山服务区-兔耳关收费站）,高速拥堵绕行省道，随机应变。<img src="http://i11.tietuku.com/f01cdb2e505f49e4.png" /><br>据了解，今年春节期间，将全面启动高速公路与普通公路联运机制，实施全市公路的统一指挥调度。当某条高速公路发生拥堵时，配备视频的路政巡查车辆会及时将拥堵路段信息上传路网管理中心，路网管理中心经分析后，将在距拥堵路段最近收费站通过国省干线公路进行分流，并通过行驶上最近的国省干线公路后重上高速公路行驶。例如：G1（京哈高速）可以通过102国道、津围公路、唐通公路、宝平公路等绕行；G2（京沪高速）可以通过104国道、高王公路、静霸公路等进行绕行；G18（荣乌高速）可以通过104国道、205国道、112国道、津王公路、港中公路等进行绕行；G25（长深高速）可以通过103国道、205国道、津港公路、滨唐公路等进行绕行；G2501（滨保高速）可以通过津芦公路、杨北公路、九园公路、津永公路等进行绕行。路程中可以随时关注高速部门通过微信、微博发布的信息，调整自己的出行路线。',
    author: {
      name: 'Amano',
      avatar: 'http://i11.tietuku.com/60857f76cd893c0d.png',
      authorId: 12345,
      intro: '金融鄙视链末端的银行狗'
    },
    like: 1322,
    picUrl: 'http://i11.tietuku.com/f01cdb2e505f49e4.png'
  },
  {
    status: 'ask',
    time: '35分钟前',
    id: '3',
    tag: '热门',
    topic: '社会',
    question: '春节回家，如何避免高速拥堵？',
    answerString: '1月30日到2月6日（除夕前一天）高速车流以返乡为主。据大数据预测，全国最拥堵的高速路段TOP3为：成都的S2成巴高速（福洪大桥-沱江特大桥）成都的S2成巴高速（福洪大桥-沱江特大桥）昆明的G56杭瑞高速（严家山服务区-兔耳关收费站）,高速拥堵绕行省道，随机应变。据了解，今年春节期间，将全面启动高速公路与普通公路联运机制，实施全市公路的统一指挥调度。当某条高速公路发生拥堵时，配备视频的路政巡查车辆会及时将拥堵路段信息上传路网管理中心，路网管理中心经分析后，将在距拥堵路段最近收费站通过国省干线公路进行分流，并通过行驶上最近的国省干线公路后重上高速公路行驶。例如：G1（京哈高速）可以通过102国道、津围公路、唐通公路、宝平公路等绕行；G2（京沪高速）可以通过104国道、高王公路、静霸公路等进行绕行；G18（荣乌高速）可以通过104国道、205国道、112国道、津王公路、港中公路等进行绕行；G25（长深高速）可以通过103国道、205国道、津港公路、滨唐公路等进行绕行；G2501（滨保高速）可以通过津芦公路、杨北公路、九园公路、津永公路等进行绕行。路程中可以随时关注高速部门通过微信、微博发布的信息，调整自己的出行路线。',
    answerHTML: '1月30日到2月6日（除夕前一天）高速车流以返乡为主。<br>据大数据预测，全国最拥堵的高速路段TOP3为：<br>成都的S2成巴高速（福洪大桥-沱江特大桥）<br>成都的S2成巴高速（福洪大桥-沱江特大桥）<br>昆明的G56杭瑞高速（严家山服务区-兔耳关收费站）,高速拥堵绕行省道，随机应变。<img src="http://i11.tietuku.com/f01cdb2e505f49e4.png" /><br>据了解，今年春节期间，将全面启动高速公路与普通公路联运机制，实施全市公路的统一指挥调度。当某条高速公路发生拥堵时，配备视频的路政巡查车辆会及时将拥堵路段信息上传路网管理中心，路网管理中心经分析后，将在距拥堵路段最近收费站通过国省干线公路进行分流，并通过行驶上最近的国省干线公路后重上高速公路行驶。例如：G1（京哈高速）可以通过102国道、津围公路、唐通公路、宝平公路等绕行；G2（京沪高速）可以通过104国道、高王公路、静霸公路等进行绕行；G18（荣乌高速）可以通过104国道、205国道、112国道、津王公路、港中公路等进行绕行；G25（长深高速）可以通过103国道、205国道、津港公路、滨唐公路等进行绕行；G2501（滨保高速）可以通过津芦公路、杨北公路、九园公路、津永公路等进行绕行。路程中可以随时关注高速部门通过微信、微博发布的信息，调整自己的出行路线。',
    author: {
      name: 'Amano',
      avatar: 'http://i11.tietuku.com/60857f76cd893c0d.png',
      authorId: 12345,
      intro: '金融鄙视链末端的银行狗'
    },
    like: 1322,
    picUrl: 'http://i11.tietuku.com/f01cdb2e505f49e4.png'
  }
];


export default class PersonalCenter extends React.Component {
  static propTypes = {
    name: React.PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = {
      tab: 1
    };
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
    return (
      <div className={styles.info}>
        <div className={styles.base}>
          <Avatar url={author.avatar} large={true} />
          <div className="name">{author.name}</div>
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
    const replyData = data.filter(item => item.status === 'reply');
    const askData = data.filter(item => item.status === 'ask');

    let dataSource;
    if (tab === 2) {
      dataSource = replyData;
    } else if (tab === 3) {
      dataSource = askData;
    } else {
      dataSource = data;
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
            回答·{replyData.length}
          </div>
          <div
            className={tab === 3 ? "tab active" : "tab"}
            onClick={this.handleTabSwitch.bind(this, 3)}>
            提问·{askData.length}
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
