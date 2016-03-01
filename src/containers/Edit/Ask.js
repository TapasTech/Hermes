import React from 'react';
import TapasEditor from 'tapas-editor';

import { Avatar } from '#/components';

import config from './config';
import styles from './style.less';

// mock data
const author = {
  name: 'Amano',
  avatar: 'http://i11.tietuku.com/60857f76cd893c0d.png',
  authorId: 12345,
  intro: '金融鄙视链末端的银行狗',
  question: '全面放开二孩会出现哪些社会现象？',
  questionDetail: '同事聚会时谈到这个话题，一些四十多岁的同事和领导都表示在这个节骨眼上，不生二胎又心动，生二胎又有很多问题要想。例如避孕套大量减产，幼儿园父母开始老龄化，大部分家庭需要换房子，从三房换成四房等等，还会有哪些意料不及的呢？大家放开想想～<br>更新：全面放开二孩政策已经确立'
};

const domainList = [
  '经济', '时政', '社会',
  '旅行', '科技', '消费',
  '健康', '书影音'
];

export default class Ask extends React.Component {
  static propTypes = {
    name: React.PropTypes.string,
  };

  constructor(props) {
    super(props);
    let selectedState = {};
    domainList.map(item => selectedState[item] = false);
    this.state = {
      content: undefined,
      title: undefined,
      anonymous: false,
      domainsSelected: new Set(),
      selectedState: selectedState
    };
  }

  handleTitleChange(e) {
    this.setState({
      title: e.target.value
    });
  }

  handleContentChange(e, editor) {
    this.setState({
      content: editor.getContent()
    });
  }

  handleUpload(e, editor) {
    const file = e.data;
    const cb = e.callback;
    const url = URL.createObjectURL(file);
    setTimeout(() => URL.revokeObjectURL(url));
    cb(url);
  }

  hanldeAnonymousChange(e) {
    this.setState({
      anonymous: e.target.checked
    });
  }

  handleDomainSelected(item) {
    const { domainsSelected, selectedState } = this.state;
    let newDomainSelected = new Set(domainsSelected);
    let  newSelectedState = Object.assign({}, selectedState)
    if (newDomainSelected.has(item)) {
      newDomainSelected.delete(item);
      newSelectedState[item] = false;
    } else {
      newDomainSelected.add(item);
      newSelectedState[item] = true;
    }
    this.setState({
      domainsSelected: newDomainSelected,
      selectedState: newSelectedState
    });
  }

  handlePost() {
    const { title, content, anonymous, domainsSelected } = this.state;
    let domains = [];
    for (let domain of domainsSelected) {
      domains.push(domain);
    }
    console.log(title, content, anonymous, domains, 'action')
  }

  render() {
    const events = {
      change: ::this.handleContentChange,
      TUploadImage: this.handleUpload,
    };

    const { title, content, anonymous, domainsSelected, selectedState } = this.state;

    return (
      <div className="container ask">
        <div className="main">
          <div className={styles.edit}>
            <input
              type="text"
              className={styles.inputTitle}
              value={title}
              onChange={::this.handleTitleChange}
              placeholder="请输入标题" />
            <div>
              <TapasEditor
                config={config}
                events={events}
                content={content} />
            </div>
            <div className={styles.reference}>
              <div className="source">
                <div className="btn ghost">数据来源</div>
                <div className="list">
                  <div className="item">人口出生率、死亡率和自然增长率</div>
                  <div className="item">1960年以来中国和印度0-14岁和65岁及以上人口比例变化比较</div>
                </div>
              </div>
              <div className="report">
                <div className="btn ghost">数据报告</div>
                <div className="list">
                  <div className="item">1960-2014年人口分析报告</div>
                </div>
              </div>
            </div>
            <div className={styles.submit}>
              <div className={styles.author}>
                <Avatar url={author.avatar} />
                <div className={styles.subTitle}>{author.name}</div>
                <div className={styles.tip}>{author.intro}</div>
              </div>
              <div className="submit-options">
                <label className="anonymous">
                  <input type="checkbox" value={anonymous} onChange={::this.hanldeAnonymousChange} />
                  <span className="tip">匿名发布</span>
                </label>
                <div className="btn ghost postIt" onClick={::this.handlePost}>发布</div>
              </div>
            </div>
          </div>
        </div>
        <div className="sidebar">
          <div className={styles.domain}>
            <div>选择问题领域</div>
            <div className="domain-list">
              {
                domainList.map((item, index) => {
                  let clx = selectedState[item] ? 'item selected' : 'item'
                  return (
                    <div key={index} className={clx} onClick={this.handleDomainSelected.bind(this, item)}>
                      <span className="name">{item}</span>
                    </div>
                  );
                })
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}
