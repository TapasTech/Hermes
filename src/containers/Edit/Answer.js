import React from 'react';
import {browserHistory} from 'react-router';

import { Avatar, Loader } from '#/components';
import {GraphqlRest, encodeField} from '#/utils';
import Store from '#/store';
import Reference from './Reference';
import Editor from './Editor';
import {diffList} from './utils';

import styles from './style.less';

export default class Answer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: Store.user.index().data,
      loading: true,
      question: {},
      content: '',
      anonymous: false,
      original: {},
      dataSets: [],
      dataReports: [],
    };
  }

  componentDidMount() {
    GraphqlRest.handleQueries(
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

  prepareData() {
    const ansId = this.props.params.ansId;
    return ansId ? this.prepareAnswer() : this.prepareQuestion();
  }

  prepareQuestion() {
    const qid = this.props.params.id;
    const query = `
    question(id: ${encodeField(qid)}) {
      title
    }
    `;
    const callback = data => {
      this.setState({
        question: data.question,
      });
    };
    return {
      query,
      callback,
    };
  }

  prepareAnswer() {
    const ansId = this.props.params.ansId;
    const query = `
    answer(id: ${encodeField(ansId)}) {
      content
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
      question {
        id
        title
      }
      user {
        id
      }
    }
    `;
    const callback = data => {
      const {answer} = data;
      // TODO check question.id and user.id
      this.setState({
        question: answer.question,
        content: answer.content,
        dataSets: answer.dataSets.data,
        dataReports: answer.dataReports.data,
        original: {
          dataSets: answer.dataSets.data.map(item => item.id),
          dataReports: answer.dataReports.data.map(item => item.id),
        },
      });
    };
    return {
      query,
      callback,
    };
  }

  handleTitleChange(e) {
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

  handleRefChange = (ref) => {
    this.setState(ref);
  }

  handleAnonymousChange = (e) => {
    this.setState({
      anonymous: e.target.checked
    });
  }

  handlePost = () => {
    const qid = this.props.params.id;
    const ansId = this.props.params.ansId;
    const {content, dataSets, dataReports} = this.state;
    const dataSetsDiff = diffList(
      this.state.original.dataSets,
      dataSets.map(dataSet => dataSet.id)
    );
    const dataReportsDiff = diffList(
      this.state.original.dataReports,
      dataReports.map(dataReport => dataReport.id)
    );
    const mutations = [
      ... dataSetsDiff.add.map((id, i) => `dataset_add_${i}: addDataSet(id: ${encodeField(id)}) {id}`),
      ... dataSetsDiff.remove.map((id, i) => `dataset_remove_${i}: removeDataSet(id: ${encodeField(id)}) {id}`),
      ... dataReportsDiff.add.map((id, i) => `datareport_add_${i}: addDataReport(id: ${encodeField(id)}) {id}`),
      ... dataReportsDiff.remove.map((id, i) => `datareport_remove_${i}: removeDataReport(id: ${encodeField(id)}) {id}`),
    ];
    ansId && mutations.push(`update(content: ${encodeField(content)}) {id}`);
    const mutation = mutations.length ? `mutation { ${mutations.join(' ')} }` : 'id';
    const query = ansId ? `query updateAnswer {
      answer(id: ${encodeField(ansId)}) {
        ${mutation}
      }
    }` : `query createAnswer {
      question(id: ${encodeField(qid)}) {
        mutation {
          createAnswer(content: ${encodeField(content)}) {
            ${mutation}
          }
        }
      }
    }`;
    GraphqlRest.post(query).then(data => {
      browserHistory.push(`/question/${qid}`);
    });
  }

  render() {
    const {user, question, content, anonymous, dataSets, dataReports, loading} = this.state;

    return (
      <div className="container reply">
        {loading && <Loader full={true} />}
        <div className="main main-left">
          <div className={styles.edit}>
            <div className={styles.title}>{question.title}</div>
            <Editor content={content} onChange={this.handleContentChange} />
            <Reference
              dataSets={dataSets}
              dataReports={dataReports}
              onChange={this.handleRefChange}
            />
          </div>
        </div>
        <div className="side-right">
          <div className={styles.submit}>
            <div className={styles.author}>
              <Avatar name={user.displayName} url={user.avatar} />
              <div className={styles.subTitle}>{user.displayName}</div>
            </div>
            <div className="submit-options">
              <div className="btn btn-info postIt" onClick={this.handlePost}>发布</div>
              {/*
              <label className="anonymous">
                <input type="checkbox" value={anonymous || ''} onChange={this.handleAnonymousChange} />
                <span className="tip">匿名发布</span>
              </label>
              */}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
