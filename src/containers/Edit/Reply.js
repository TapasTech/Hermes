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
  answer: '2. 总和生育率已经连续二十余年低于更替水平总和生育率的变化<br>更能反映人口增长问题的严重性。总和生育率是指育龄妇女在育龄期间（一般认为是15到49岁愿意并且能够生育的婴儿数量）世界平均更替生育率水平（即保持人口长期稳定需要每对夫妻生育孩子的数量）为2.1，一般认为我国略高于这一水平为2.2左右。我国自1993年开始已经持续20余年总和生育率低于2.2的更替水平，目前为1.7左右（世界银行的数据，六普显示我国人口总和生育率为1.181，考虑到漏报瞒报因素，我国人口学专家普遍认为我国人口总和生育率为1.4-1.5'
};

export default class Reply extends React.Component {
  static propTypes = {
    name: React.PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = {
      content: undefined,
      title: undefined,
      anonymous: false
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

  handlePost() {
    const { title, content, anonymous } = this.state;
    console.log(title, content, anonymous, 'action')
  }

  render() {
    const events = {
      change: ::this.handleContentChange,
      TUploadImage: this.handleUpload,
    };

    const { title, content, anonymous, domainsSelected, selectedState } = this.state;

    return (
      <div className="container reply">
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
          </div>
        </div>
        <div className="sidebar">
          <div className={styles.submit}>
            <div className={styles.author}>
              <Avatar url={author.avatar} />
              <div className={styles.subTitle}>{author.name}</div>
            </div>
            <div className="submit-options">
              <div className="btn ghost postIt" onClick={::this.handlePost}>发布</div>
              <label className="anonymous">
                <input type="checkbox" value={anonymous} onChange={::this.hanldeAnonymousChange} />
                <span className="tip">匿名发布</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
