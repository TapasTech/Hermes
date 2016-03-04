import React from 'react';
import TapasEditor from 'tapas-editor';

import { Avatar } from '#/components';
import {GraphqlRest, encodeField} from '#/utils';

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

/*
const topicList = [
  '经济', '时政', '社会',
  '旅行', '科技', '消费',
  '健康', '书影音'
];
*/

export default class Ask extends React.Component {
  static propTypes = {
    name: React.PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = {
      content: '',
      anonymous: false,
      original: {},
      topics: [],
      dataSets: [],
      dataReports: [],
    };
  }

  componentDidMount() {
    const queries = [];
    const callbacks = [];
    [
      this.prepareTopics(),
      this.prepareData(),
    ].forEach(item => {
      item && item.query && queries.push(item.query);
      item && item.callback && callbacks.push(item.callback);
    });
    GraphqlRest.post('query {' + queries.join('\n') + '}').then(data => {
      callbacks.forEach(callback => callback(data));
    });
  }

  prepareTopics() {
    const query = `
    topics {
      data {
        id
        name
      }
      meta {
        current_page
        total_pages
        total_count
      }
    }
    `;
    const callback = data => {
      this.setState({
        topics: data.topics.data.map(item => ({
          ...item,
        })),
      });
    };
    return {
      query,
      callback,
    };
  }

  prepareData() {
    const id = this.props.params.id;
    if (!id || id === '_new') return;
    const query = `
    question(id: ${encodeField(id)}) {
      title
      content
      topics {
        id
      }
      dataSets {
        data {
          id
          title
          url
        }
      }
      dataReports {
        data {
          id
          title
          url
        }
      }
    }
    `;
    const callback = data => {
      const topics = this.state.topics.reduce((res, topic) => {
        res[topic.id] = topic;
        return res;
      }, {});
      const {question} = data;
      question.topics.forEach(_topic => {
        const topic = topics[_topic.id];
        if (topic) topic.selected = true;
      });
      this.setState({
        title: question.title,
        content: question.content,
        dataSets: question.dataSets.data,
        dataReports: question.dataReports.data,
        original: {
          topics: question.topics.map(item => item.id),
          dataSets: question.dataSets.data.map(item => item.id),
          dataReports: question.dataReports.data.map(item => item.id),
        },
      });
    };
    return {
      query,
      callback,
    };
  }

  handleTitleChange = e => {
    this.setState({
      title: e.target.value
    });
  }

  handleContentChange = (content) => {
    this.setState({
      content,
    });
  }

  handleUpload(e, editor) {
    const file = e.data;
    const url = URL.createObjectURL(file);
    setTimeout(() => URL.revokeObjectURL(url));
    e.callback(url);
  }

  handleAnonymousChange = e => {
    this.setState({
      anonymous: e.target.checked
    });
  }

  handleSelectTopic(item) {
    item.selected = !item.selected;
    this.setState({});
  }

  createDataSet(title, url) {
    const data = `
    mutation createDataSet {
      dataset: createDataSet(title: ${encodeField(title)}, url: ${encodeField(url)}) {
        id
        title
        url
      }
    }
    `;
    return GraphqlRest.post(data).then(data => data.dataset);
  }

  handleAddDataSet = () => {
    // TODO popup component
    const title = prompt('Input title:');
    if (!title) return;
    const url = prompt('Input URL:');
    if (!url) return;
    this.createDataSet(title, url).then(item => {
      this.setState({
        dataSets: [
          ...this.state.dataSets,
          item,
        ],
      });
    });
  }

  handleAddDataReport = () => {
  }

  diffList(oldList, newList) {
    const oldSet = new Set(oldList);
    const newSet = new Set(newList);
    const remove = [];
    oldSet.forEach(item => newSet.delete(item) || remove.push(item));
    add = [... newSet];
    return {
      add,
      remove,
    };
  }

  handlePost = () => {
    const isNew = this.props.params.id === '_new';
    const { title, content, anonymous, topics, dataSets, dataReports } = this.state;
    const topicsMutations = topics
    .filter(topic => topic.selected)
    .map((topic, i) => `topic_${i}: addTopic(id: ${encodeField(topic.id)}) {id}`)
    .join(' ');
    const dataSetsMutations = dataSets
    .map((dataSet, i) => `dataset_${i}: addDataSet(id: ${encodeField(dataSet.id)}) {id}`)
    .join(' ');
    const dataReportsMutations = dataReports
    .map((dataReport, i) => `datareport_${i}: addDataReport(id: ${encodeField(dataReport.id)}) {id}`)
    .join(' ');
    const data = `
    mutation createQuestion {
      question: createQuestion(title: ${encodeField(title)}, content: ${encodeField(content)}) {
        id
        title
        content
        mutation {
          ${topicsMutations}
          ${dataSetsMutations}
          ${dataReportsMutations}
        }
      }
    }
    `;
    GraphqlRest.post(data).then(data => {
      console.log(data);
    });
  };

  renderDataSet(dataset, key) {
    return (
      <div className="item" key={key}>
        <a href={dataset.url} target="_blank">{dataset.title}</a>
      </div>
    );
  }

  render() {
    const events = {
      TUploadImage: this.handleUpload,
    };

    const { title, content, anonymous, topics, dataSets, dataReports } = this.state;

    return (
      <div className="container ask">
        <div className="main">
          <div className={styles.edit}>
            <input
              type="text"
              className={styles.inputTitle}
              value={title}
              onChange={this.handleTitleChange}
              placeholder="请输入标题" />
            <div>
              <TapasEditor
                config={config}
                events={events}
                content={content}
                onChange={this.handleContentChange}
              />
            </div>
            <div className={styles.reference}>
              <div className="source">
                <div className="btn ghost" onClick={this.handleAddDataSet}>+ 数据来源</div>
                <div className="list">
                  {dataSets.map(this.renderDataSet)}
                </div>
              </div>
              <div className="report">
                <div className="btn ghost" onClick={this.handleAddDataReport}>+ 数据报告</div>
                <div className="list">
                  {dataReports.map(this.renderDataSet)}
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
                  <input type="checkbox" value={anonymous} onChange={this.handleAnonymousChange} />
                  <span className="tip">匿名发布</span>
                </label>
                <div className="btn ghost postIt" onClick={this.handlePost}>发布</div>
              </div>
            </div>
          </div>
        </div>
        <div className="sidebar">
          <div className={styles.domain}>
            <div>选择问题领域</div>
            <div className="domain-list">
              {topics.map((item, i) => (
                <div key={i} className={`item ${item.selected ? 'selected' : ''}`} onClick={this.handleSelectTopic.bind(this, item)}>
                  <span className="name">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
