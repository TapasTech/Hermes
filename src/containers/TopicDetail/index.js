import React from 'react';

import { Avatar, Answer, CommentList, ShareBar, PokeButton } from '#/components';

import styles from './style.less';

const data = {
  topic: {
    time: '17小时前',
    likes: 1888,
    title: '全面放开二孩会出现哪些社会现象？',
    content: '同事聚会时谈到这个话题，一些四十多岁的同事和领导都表示在这个节骨眼上，不生二胎又心动，生二胎又有很多问题要想。例如避孕套大量减产，幼儿园父母开始老龄化，大部分家庭需要换房子，从三房换成四房等等，还会有哪些意料不及的呢？大家放开想想～',
    references: [
      { id: 1, url: 'https://www.sample.com/121', name: '第六次人口普查数据' },
      { id: 2, url: 'https://www.sample.com/122', name: '中华人民共和国居民消费价格指数(CPI)' },
      { id: 3, url: 'https://www.sample.com/123', name: '中国孕妇人口健康状况调查数据库' },
      { id: 4, url: 'https://www.sample.com/124', name: '中国家庭追踪调查(CFPS)' }
    ]
  },
  answers: [
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
        avatar: 'http://i13.tietuku.com/02eca4d180332df3.png',
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
  ],
  related: [
    { id: 1, url: 'https://www.sample.com/121', name: '为什么 2015 年初，上海有卫计委官员呼吁大家生二胎？', reply: 230 },
    { id: 2, url: 'https://www.sample.com/122', name: '中国人口激增是由于毛泽东时期鼓励生育造成的么？', reply: 20 },
    { id: 3, url: 'https://www.sample.com/123', name: '生育鼓励（补贴）长期来看是没有用的吗，为什么?', reply: 201 },
    { id: 4, url: 'https://www.sample.com/124', name: '天生残疾的孩子，政府和社会以及父母应该努力尽可能阻碍其出生?', reply: 30 }
  ],
  watcher: [
    {
      name: '张三',
      avatar: 'http://i11.tietuku.com/60857f76cd893c0d.png'
    },
    {
      name: '李四',
      avatar: 'http://i13.tietuku.com/02eca4d180332df3.png'
    },
    {
      name: '张三',
      avatar: 'http://i11.tietuku.com/60857f76cd893c0d.png'
    },
    {
      name: '张三',
      avatar: 'http://i11.tietuku.com/60857f76cd893c0d.png'
    },
    {
      name: '张三',
      avatar: 'http://i11.tietuku.com/60857f76cd893c0d.png'
    },
    {
      name: '张三',
      avatar: 'http://i11.tietuku.com/60857f76cd893c0d.png'
    },
    {
      name: '李四',
      avatar: 'http://i13.tietuku.com/02eca4d180332df3.png'
    },
    {
      name: '张三',
      avatar: 'http://i11.tietuku.com/60857f76cd893c0d.png'
    },
    {
      name: '张三',
      avatar: 'http://i11.tietuku.com/60857f76cd893c0d.png'
    },
    {
      name: '张三',
      avatar: 'http://i11.tietuku.com/60857f76cd893c0d.png'
    }
  ]
};

export default class TopicDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showShare: false,
      showComment: false,
      currentPage: 1
    }
  }

  handlePoke() {
    console.log('点赞');
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

  handleShowMore() {
    this.setState({
      currentPage: this.state.currentPage + 1
    });
  }

  renderTopic() {
    const { topic } = data;
    return (
      <div className={styles.topic}>
        <div className={styles.header}>
          <div className={styles.title}>{topic.title}</div>
          <div className={styles.tip}>修改</div>
        </div>
        <div className={styles.content}>{topic.content}</div>
        <div className={styles.tip}>相关数据</div>
        <div className={styles.links}>
          {
            topic.references.map((item, index) => <a key={index} className={styles.link} href={item.url}>{item.name}</a>)
          }
        </div>
        <div className={styles.tip}>{topic.time} · {topic.likes} 阅读</div>
      </div>
    );
  }

  renderOptionArea(like, comments) {
    return (
      <div className={styles.cardOption}>
        <div className="other">
          <div className="comment" onClick={::this.handleShowComment}>
            <span>评论</span>
            <span className="count">{ comments ? comments.length : 0 }</span>
          </div>
          <div className="share">
            <span onClick={::this.handleShowShare}>分享</span>
            { this.state.showShare && <ShareBar className="bar" /> }
          </div>
        </div>
        {
          this.state.showComment
            && comments
            && comments.length
            && <CommentList comments={comments} onClose={::this.handleHideComment} />
        }
      </div>
    );
  }

  renderAnswers() {
    const { answers } = data;
    const { currentPage } = this.state;
    const list = [].concat(answers);
    const endIndex = currentPage * 10;
    let onePage = list.slice(0, endIndex);
    return (
      <div className={styles.answers}>
        {
          onePage.map((item, index) => {
            return (
              <div key={index} className={styles.answer}>
                <div className={styles.header}>
                  <div className={styles.author}>
                    <Avatar url={item.author.avatar} />
                    <div className={styles.subTitle}>{item.author.name}</div>
                    <div className={styles.tip}>{item.author.intro}</div>
                  </div>
                  <PokeButton count={item.like} onClick={::this.handlePoke} />
                </div>
                <div className={styles.answerContent}>
                  <Answer
                    pic={item.picUrl}
                    answerShort={item.answerString}
                    answerFull={item.answerHTML} />
                  { this.renderOptionArea(item.like, item.comments) }
                </div>
              </div>
            );
          })
        }
        {
          ((answers.length > 10) && (endIndex < answers.length))
          ? <div className="more" onClick={::this.handleShowMore}>点击加载更多</div>
          : <div className="end">已到结尾</div>
        }
      </div>
    );
  }

  renderRelated(item, key) {
    return (
      <div className={styles.relatedTopics} key={key}>
        <a className="link" href={item.url}>
          <span>{item.name}</span>
          &nbsp;
          <span className="tip">{item.reply}个回答</span>
        </a>
      </div>
    )
  }

  render() {
    const { related, watcher } = data;
    return (
      <div className={styles.topicDetail}>
        <div className={styles.main}>
          { this.renderTopic() }
          { this.renderAnswers() }
        </div>
        <div className={styles.sidebar}>
          <div className="watch">
            <div className="operate">
              <div className="btn primary">关注问题</div>
              <div className="btn ghost">回答</div>
            </div>
            <div className="watcher">
              <span className="count">4087</span>
              <span>人关注该问题</span>
            </div>
            <div className="watcher-list">
              {
                watcher.map((item, index) => <Avatar key={index} className="avatar" url={item.avatar} />)
              }
            </div>
          </div>
          <div className="related">
            <div className="title">
              <span>相关问题</span>
              <a className="more" href="/topic/hot">更多</a>
            </div>
            {
              related.map((item, index) => this.renderRelated(item, index))
            }
          </div>
        </div>
      </div>
    );
  }
}
