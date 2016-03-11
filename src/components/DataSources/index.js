import React from 'react';

import styles from './style.less';

export default class DataSources extends React.Component {
  static propTypes = {
    dataSets: React.PropTypes.object,
    dataReports: React.PropTypes.object,
  }

  static fragments = `
  fragment fragDataSets on PaginatedDataSet {
    data {
      id
      title
      url
    }
    meta {
      current_page
      total_pages
      total_count
    }
  }
  fragment fragDataReports on PaginatedDataReport {
    data {
      id
      title
      url
    }
    meta {
      current_page
      total_pages
      total_count
    }
  }
  `;

  renderSet(set) {
    const data = set && set.data || [];
    return data.map((item, index) => (
      <li key={index}><a target="_blank" href={item.url}>{item.title}</a></li>
    ));
  }

  render() {
    const {dataSets, dataReports} = this.props;
    const hasData = dataSets && dataSets.data && dataSets.data.length || dataReports && dataReports.data && dataReports.data.length;
    return (
      hasData ? <div className={styles.data}>
        <div className="text-warning">相关数据</div>
        <ul className={styles.list}>
          {this.renderSet(dataSets)}
          {this.renderSet(dataReports)}
        </ul>
      </div> : <div />
    );
  }
}
