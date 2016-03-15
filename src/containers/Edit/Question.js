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
    const query = qid ? GQL.template`query updateQuestion {
      question(id: ${encodeField(qid)}) {
        id
        ${mutation}
      }
    }` : GQL.template`mutation createQuestion {
      question: createQuestion(title: ${encodeField(title)}, content: ${encodeField(content)}) {
        id
        ${mutation}
      }
    }`;
    GQL.post(query).then(data => {
      const qid = data.question.id;
      browserHistory.push(`/question/${qid}`);
    });
  };

  render() {
    const { user, title, content, anonymous, topics, dataSets, dataReports, loading } = this.state;

    return (
      <div className="container ask">
        {loading && <Loader full={true} />}
        <div className="main main-left">
          <div className={styles.edit}>
            <input
              type="text"
              className={styles.title}
              value={title || ''}
              onChange={this.handleTitleChange}
              placeholder="请输入标题" />
            <Editor content={content} onChange={this.handleContentChange} />
            <Reference
              dataSets={dataSets}
              dataReports={dataReports}
              onChange={this.handleRefChange}
            />
            <div className={styles.submit}>
              <div className={styles.author}>
                <Avatar name={user.displayName} url={user.avatar} />
                <div className={styles.subTitle}>{user.displayName}</div>
                <div className={styles.tip}>{user.description}</div>
              </div>
              <div className="submit-options">
                {/*
                <label className="anonymous">
                  <input type="checkbox" value={anonymous || ''} onChange={this.handleAnonymousChange} />
                  <span className="tip">匿名发布</span>
                </label>
                */}
                <div className="btn btn-info postIt" onClick={this.handlePost}>发布</div>
              </div>
            </div>
          </div>
        </div>
        <div className="side-right">
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
