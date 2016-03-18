import React from 'react';

import { Modal } from '#/components';
import {GQL, encodeField, valueLink, formatter} from '#/utils';

import styles from './style.less';

export default class Reference extends React.Component {
  static propTypes = {
    dataSets: React.PropTypes.array,
    dataReports: React.PropTypes.array,
    onChange: React.PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      showModal: {
        dataSets: false,
        dataReports: false
      },
      formData: {
        dataSets: {},
        dataReports: {}
      }
    };
  }

  renderForm() {
    const { title, url } = this.state;
    return (
      <div>
        <input placeholder="请输入标题" value={title || ''} onChange={this.handleChange.bind(this, 'title')} />
        <input placeholder="请输入URL" value={url || ''} onChange={this.handleChange.bind(this,'url')} />
      </div>
    );
  }

  render() {
    const {dataSets, dataReports} = this.props;
    return (
      <div className={styles.reference}>
        { this.renderAdd('dataSets') }
        { this.renderAdd('dataReports') }
      </div>
    );
  }

  renderAdd(key) {
    const { title, url } = this.state.formData[key];
    const text = key === 'dataSets' ? '来源' : '报告';
    return (
      <div key={key}>
        <div className="btn btn-default" onClick={this.handleShowModal.bind(this, key)}>
          + 数据{text}
        </div>
        <Modal show={this.state.showModal[key]} title={`添加数据${text}标题:`} onCancel={this.handleCancel.bind(this, key)}>
          <div className="modal-form">
            <label>标题:</label>
            <input className="form-control" placeholder="请输入标题" value={title || ''} onChange={this.handleChange.bind(this, key, 'title')} />
            <label>URL:</label>
            <input className="form-control" placeholder="请输入URL" value={url || ''} onChange={this.handleChange.bind(this, key, 'url')} />
          </div>
          <div className="modal-options">
            <button className="btn btn-primary mr" onClick={this.handleConfirm.bind(this, key)}>确认</button>
            <button className="btn btn-default" onClick={this.handleCancel.bind(this, key)}>取消</button>
          </div>
        </Modal>
        <div className={styles.refList}>
          { this.props[key][0] && this.props[key].map(this.renderDataSet) }
        </div>
      </div>
    );
  }

  handleChange(key, field, e) {
    const newFormData = Object.assign({}, this.state.formData);
    newFormData[key][field] = e.target.value;
    this.setState({
      formData: newFormData
    });
  }

  handleShowModal(key) {
    const newShowModal = this.state.showModal;
    newShowModal[key] = true;
    this.setState({
      showModal: newShowModal
    });
  }

  handleConfirm(key) {
    const { title, url } = this.state.formData[key];
    const prepare = key === 'dataSets' ? this.dataSetMutation : this.dataReportMutation;
    GQL.handleMutations(prepare(title, url)).then(res => {
      this.fireChange({
        [key]: [
          ... this.props[key],
          res[0],
        ],
      })
    }).then(() => {
      this.closeModal(key);
    });
  }

  handleCancel(key) {
    this.closeModal(key);
  }

  closeModal(key) {
    const newShowModal = Object.assign({}, this.state.showModal);
    newShowModal[key] = false;
    this.setState({
      formData: {
        dataSets: {},
        dataReports: {}
      },
      showModal: newShowModal
    });
  }

  renderDataSet(dataset, key) {
    return (
      <div className={styles.refItem} key={key}>
        <a href={dataset.url} target="_blank">{dataset.title}</a>
      </div>
    );
  }

  fireChange(changedData) {
    const onChange = this.props.onChange;
    onChange && onChange({
      dataSets: this.props.dataSets,
      dataReports: this.props.dataReports,
      ... changedData,
    });
    return
  }

  dataSetMutation(title, url) {
    const query = GQL.template`
    dataset: createDataSet(title: ${encodeField(title)}, url: ${encodeField(formatter.url(url))}) {
      id
      title
      url
    }
    `;
    const callback = data => data.dataset;
    return {
      query,
      callback,
    };
  }

  dataReportMutation(title, url) {
    const data = GQL.template`
    dataset: createDataReport(title: ${encodeField(title)}, url: ${encodeField(formatter.url(url))}) {
      id
      title
      url
    }
    `;
    const callback = data => data.dataset;
    return {
      query,
      callback,
    };
  }
}
