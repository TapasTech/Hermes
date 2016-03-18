import React from 'react';
import {browserHistory} from 'react-router';

import { Avatar, Loader } from '#/components';
import {GQL, encodeField} from '#/utils';
import Store from '#/store';
import Reference from './Reference';
import Editor from './Editor';
import {diffList} from './utils';

import styles from './style.less';

export default class Question extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: Store.user.index().data,
      loading: true,
      content: '',
      anonymous: false,
      original: {},
      topics: [],
      dataSets: [],
      dataReports: [],
    };
  }

  componentDidMount() {
    GQL.handleQueries(
      this.prepareTopics(),
      this.prepareData()
    ).then(() => {
      this.setState({
        loading: false,
      });
    });
    Store.on('EVT_USER', this.updateUserInfo);
  }

  componentWillUnmount() {
    Store.off('EVT_USER', this.updateUserInfo);
  }

  updateUserInfo = () => {
    this.setState({
      user: Store.user.index().data,
    });
  }

  prepareTopics() {
    const query = GQL.template`
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
    const query = GQL.template`
    question(id: ${encodeField(qid)}) {
      title
      content
      topics {
        id
      }
      dataSets {
        id
        title
        url
      }
      dataReports {
        id
        title
        url
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
        dataSets: question.dataSets,
        dataReports: question.dataReports,
        original: {
          topics: question.topics.map(item => item.id),
          dataSets: question.dataSets.map(item => item.id),
          dataReports: question.dataReports.map(item => item.id),
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

  handleRefChange = (ref) => {
    this.setState(ref);
  }

  handlePost = () => {
    const { qid, title, content, anonymous, topics, dataSets, dataReports } = this.state;
    const topicsDiff = diffList(
      this.state.original.topics,
      topics.filter(topic => topic.selected).map(topic => topic.id)
    );
    const dataSetsDiff = diffList(
      this.state.original.dataSets,
      dataSets.map(dataSet => dataSet.id)
    );
    const dataReportsDiff = diffList(
      this.state.original.dataReports,
      dataReports.map(dataReport => dataReport.id)
    );
    const mutations = [
      ... topicsDiff.add.map((id, i) => GQL.template`topic_add_${i}: addTopic(id: ${encodeField(id)}) {id}`),
      ... topicsDiff.remove.map((id, i) => GQL.template`topic_remove_${i}: removeTopic(id: ${encodeField(id)}) {id}`),
      ... dataSetsDiff.add.map((id, i) => GQL.template`dataset_add_${i}: addDataSet(id: ${encodeField(id)}) {id}`),
      ... dataSetsDiff.remove.map((id, i) => GQL.template`dataset_remove_${i}: removeDataSet(id: ${encodeField(id)}) {id}`),
      ... dataReportsDiff.add.map((id, i) => GQL.template`datareport_add_${i}: addDataReport(id: ${encodeField(id)}) {id}`),
      ... dataReportsDiff.remove.map((id, i) => GQL.template`datareport_remove_${i}: removeDataReport(id: ${encodeField(id)}) {id}`),
    ];
    qid && mutations.push(GQL.template`update(title: ${encodeField(title)}, content: ${encodeField(content)}) {id}`);
    const mutation = mutations.length ? GQL.template`mutation { ${mutations.join(' ')} }` : '';
    const query = qid ? GQL.template`
    question(id: ${encodeField(qid)}) {
      id
      ${mutation}
    }
    ` : GQL.template`
    question: createQuestion(title: ${encodeField(title)}, content: ${encodeField(content)}) {
      id
      ${mutation}
    }
    `;
    const callback = data => {
      const qid = data.question.id;
      browserHistory.push(`/question/${qid}`);
    };
    (qid ? GQL.handleQueries : GQL.handleMutations)({
      query,
      callback,
    });
  };

  render() {
    const { user, title, content, anonymous, topics, dataSets, dataReports, loading } = this.state;
    return (
      <div className="container">
        {loading && <Loader full={true} />}
        <div className="main main-left">
          <div className={`panel ${styles.panelEdit}`}>
            <input
              type="text"
              className={styles.inputTitle}
              value={title || ''}
              onChange={this.handleTitleChange}
              placeholder="请输入标题" />
            <Editor content={content} onChange={this.handleContentChange} />
            <Reference
              dataSets={dataSets}
              dataReports={dataReports}
              onChange={this.handleRefChange}
            />
            <div className={`clearfix ${styles.submitQuestion}`}>
              <div className={`pull-left ${styles.author}`}>
                <Avatar className="mr-sm" name={user.displayName} url={user.avatar} />
                <span className="mr-sm">{user.displayName}</span>
                <span className="text-gray">{user.description}</span>
              </div>
              <div className="pull-right">
                {/*
                <label className="anonymous">
                  <input type="checkbox" value={anonymous || ''} onChange={this.handleAnonymousChange} />
                  <span className="tip">匿名发布</span>
                </label>
                */}
                <div className="btn btn-info" onClick={this.handlePost}>发布</div>
              </div>
            </div>
          </div>
        </div>
        <div className="side-right">
          <div className="panel">
            <div>选择问题领域</div>
            <div className={`clearfix ${styles.topicList}`}>
              {topics.map((item, i) => (
                <div key={i} className={`${item.selected ? 'selected' : ''}`} onClick={this.handleSelectTopic.bind(this, item)}>
                  <span>{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
