import React from 'react';

import { Modal } from '#/components';

import {GraphqlRest, encodeField, valueLink} from '#/utils';

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
        <Modal show={this.state.showModal[key]} title={`添加数据${text}标题:`}>
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
        <div className="list">
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
    const send = key === 'dataSets' ? this.createDataSet : this.createDataReport;
    send(title, url).then(item => {
      let data = {};
      data[key] = [
        ...this.props[key],
        item,
      ];
      this.fireChange(data);
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
      <div className="item" key={key}>
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

  createDataReport(title, url) {
    const data = `
    mutation createDataReport {
      dataset: createDataReport(title: ${encodeField(title)}, url: ${encodeField(url)}) {
        id
        title
        url
      }
    }
    `;
    return GraphqlRest.post(data).then(data => data.dataset);
  }
}
