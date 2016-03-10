import React from 'react';

import {GraphqlRest, encodeField} from '#/utils';

import styles from './style.less';

export default class Reference extends React.Component {
  static propTypes = {
    dataSets: React.PropTypes.array,
    dataReports: React.PropTypes.array,
    onChange: React.PropTypes.func,
  };

  render() {
    const {dataSets, dataReports} = this.props;
    return (
      <div className={styles.reference}>
        <div className="source">
          <div className="btn btn-info" onClick={this.handleAddDataSet}>+ 数据来源</div>
          <div className="list">
            {dataSets.map(this.renderDataSet)}
          </div>
        </div>
        <div className="report">
          <div className="btn btn-info" onClick={this.handleAddDataReport}>+ 数据报告</div>
          <div className="list">
            {dataReports.map(this.renderDataSet)}
          </div>
        </div>
      </div>
    );
  }

  handleAddDataSet = () => {
    // TODO popup component
    const title = prompt('Input title:');
    if (!title) return;
    const url = prompt('Input URL:');
    if (!url) return;
    this.createDataSet(title, url).then(item => {
      this.fireChange({
        dataSets: [
          ...this.props.dataSets,
          item,
        ],
      });
    });
  }

  handleAddDataReport = () => {
    // TODO popup component
    const title = prompt('Input title:');
    if (!title) return;
    const url = prompt('Input URL:');
    if (!url) return;
    this.createDataSet(title, url).then(item => {
      this.fireChange({
        dataReports: [
          ...this.props.dataReports,
          item,
        ],
      });
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
}
