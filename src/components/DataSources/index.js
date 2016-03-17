import React from 'react';

import styles from './style.less';

export default class DataSources extends React.Component {
  static propTypes = {
    dataSets: React.PropTypes.array,
    dataReports: React.PropTypes.array,
  }

  static fragments = `
  fragment fragDataSets on DataSet {
    id
    title
    url
  }
  fragment fragDataReports on DataReport {
    id
    title
    url
  }
  `;

  renderSet(set) {
    const data = set || [];
    return data.map((item, index) => (
      <li key={index}><a target="_blank" href={item.url}>{item.title}</a></li>
    ));
  }

  render() {
    const {dataSets, dataReports} = this.props;
    const hasData = dataSets && dataSets.length || dataReports && dataReports.length;
    return (
      hasData
        ? <div className={styles.data}>
          <div className="text-warning">相关数据</div>
          <ul className={styles.list}>
            {this.renderSet(dataSets)}
            {this.renderSet(dataReports)}
          </ul>
        </div>
        : null
    );
  }
}
