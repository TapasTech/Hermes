import React from 'react';

import { TopicCard } from '#/components';

import styles from './style.less';

const data = [
  {
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

const hotTopics = [
  {
    name: '社会',
    picUrl: 'http://i4.tietuku.com/7b3c6fc017b69a60.jpg',
    link: {
      name: '4月-5月出境旅行去哪里比较好？',
      href: 'https://ctrip.com'
    }
  },
  {
    name: '社会',
    picUrl: 'http://i4.tietuku.com/7b3c6fc017b69a60.jpg',
    link: {
      name: '4月-5月出境旅行去哪里比较好？',
      href: 'https://ctrip.com'
    }
  },
  {
    name: '社会',
    picUrl: 'http://i4.tietuku.com/7b3c6fc017b69a60.jpg',
    link: {
      name: '4月-5月出境旅行去哪里比较好？',
      href: 'https://ctrip.com'
    }
  }
];

const newestTopics = [
  {
    name: '2016年1月份居民消费价格',
    href: 'https://ctrip.com'
  },
  {
    name: '2016年1月全国社会消费品零售总额',
    href: 'https://ctrip.com'
  },
  {
    name: '2016年1月各省月度数据',
    href: 'https://ctrip.com'
  },
  {
    name: '滴滴出行智能分析报告',
    href: 'https://ctrip.com'
  },
  {
    name: '滴滴出行智能分析报告',
    href: 'https://ctrip.com'
  },
  {
    name: '百度移动互联网发展趋势报告 2015版',
    href: 'https://ctrip.com'
  },
  {
    name: '2016年1月各省月度数据',
    href: 'https://ctrip.com'
  },
  {
    name: '滴滴出行智能分析报告',
    href: 'https://ctrip.com'
  },
  {
    name: '2016年 高德地图大数据分析报告',
    href: 'https://ctrip.com'
  },
  {
    name: '百度移动互联网发展趋势报告 2015版',
    href: 'https://ctrip.com'
  }
]

export default class TopicList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: 1
    };
  }

  handleShowMore() {
    this.setState({
      currentPage: this.state.currentPage + 1
    });
  }

  renderHotTopic(topic, key) {
    return (
      <div className={styles.hotTopic} key={key}>
        <div className="topic">
          <div className="img" style={{backgroundImage: `url(${topic.picUrl})`}}></div>
          <div className="name">社会</div>
        </div>
        <a className="link" href={topic.link.href}>{topic.link.name}</a>
      </div>
    )
  }

  renderNewestTopic(topic, key) {
    return (
      <a key={key} className="link" href={topic.href}>· {topic.name}</a>
    )
  }

  renderQuestionList() {
    const { currentPage } = this.state;
    const list = [].concat(data);
    const endIndex = currentPage * 10;
    let onePage = list.slice(0, endIndex);

    return (
      <div className={styles.main}>
        <div className={styles.title}>最新动态</div>
        {
          onePage.map((item, index) => <TopicCard key={index} content={item} />)
        }
        {
          ((data.length > 10) && (endIndex < data.length))
          ? <div className="more" onClick={::this.handleShowMore}>点击加载更多</div>
          : <div className="end">已到结尾</div>
        }
      </div>
    );
  }

  render() {
    return (
      <div className={styles.topicList}>
        { this.renderQuestionList() }
        <div className={styles.sidebar}>
          <div className="hot">
            <div className="title">
              <span>热门领域</span>
              <a className="more" href="/topic/hot">更多</a>
            </div>
            {
              hotTopics.map((item, index) => this.renderHotTopic(item, index))
            }
          </div>
          <div className="newest">
            <div className="title">
              <span>最新数据</span>
              <a className="more" href="/topic/newest">更多</a>
            </div>
            {
              newestTopics.map((item, index) => this.renderNewestTopic(item, index))
            }
          </div>
        </div>
      </div>
    );
  }
}
