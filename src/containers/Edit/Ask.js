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
      ready: false,
      content: '',
      anonymous: false,
      original: {},
      topics: [],
      dataSets: [],
      dataReports: [],
    };
  }

  componentDidMount() {
    GraphqlRest.handleQueries(
      this.prepareTopics(),
      this.prepareData()
    ).then(() => {
      this.setState({
        ready: true,
      });
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
    const qid = this.props.params.id;
    if (!qid || qid === '_new') {
      this.setState({
        title: '',
        content: '',
        dataSets: [],
        dataReports: [],
        original: {},
      });
      return;
    }
    const query = `
    question(id: ${encodeField(qid)}) {
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
      user {
        id
      }
    }
    `;
    const callback = data => {
      // TODO check authorization with `user.id`
      const topicMap = this.state.topics.reduce((res, topic) => {
        res[topic.id] = topic;
        return res;
      }, {});
      const {question} = data;
      question.topics.forEach(_topic => {
        const topic = topicMap[_topic.id];
        if (topic) topic.selected = true;
      });
      this.setState({
        qid,
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
    const add = [... newSet];
    return {
      add,
      remove,
    };
  }

  handlePost = () => {
    const { qid, title, content, anonymous, topics, dataSets, dataReports } = this.state;
    const topicsDiff = this.diffList(
      this.state.original.topics,
      topics.filter(topic => topic.selected).map(topic => topic.id)
    );
    const dataSetsDiff = this.diffList(
      this.state.original.dataSets,
      dataSets.map(dataSet => dataSet.id)
    );
    const dataReportsDiff = this.diffList(
      this.state.original.dataReports,
      dataReports.map(dataReport => dataReport.id)
    );
    const mutations = [
      ... topicsDiff.add.map((id, i) => `topic_add_${i}: addTopic(id: ${encodeField(id)}) {id}`),
      ... topicsDiff.remove.map((id, i) => `topic_remove_${i}: removeTopic(id: ${encodeField(id)}) {id}`),
      ... dataSetsDiff.add.map((id, i) => `dataset_add_${i}: addDataSet(id: ${encodeField(id)}) {id}`),
      ... dataSetsDiff.remove.map((id, i) => `dataset_remove_${i}: removeDataSet(id: ${encodeField(id)}) {id}`),
      ... dataReportsDiff.add.map((id, i) => `datareport_add_${i}: addDataReport(id: ${encodeField(id)}) {id}`),
      ... dataReportsDiff.remove.map((id, i) => `datareport_remove_${i}: removeDataReport(id: ${encodeField(id)}) {id}`),
    ];
    qid && mutations.push(`update(title: ${encodeField(title)}, content: ${encodeField(content)}) {id}`);
    const mutation = mutations.length ? `mutation { ${mutations.join(' ')} }` : 'id';
    const query = qid ? `query updateQuestion {
      question(id: ${encodeField(qid)}) {
        ${mutation}
      }
    }` : `mutation createQuestion {
      question: createQuestion(title: ${encodeField(title)}, content: ${encodeField(content)}) {
        ${mutation}
      }
    }`;
    GraphqlRest.post(query).then(data => {
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
