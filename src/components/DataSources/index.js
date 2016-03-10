import React from 'react';

import styles from './style.less';

export default class DataSources extends React.Component {
  static propTypes = {
    dataSets: React.PropTypes.object,
    dataReports: React.PropTypes.object,
  }

  renderSet(set) {
    const data = set && set.data || [];
    return data.map((item, index) => (
      <a key={index} target="_blank" href={item.url}>{item.title}</a>
    ));
  }

  render() {
    const {dataSets, dataReports} = this.props;
    const hasData = dataSets && dataSets.data && dataSets.data.length || dataReports && dataReports.data && dataReports.data.length;
    return (
      hasData ? <div>
        <div className={styles.tip}>相关数据</div>
        <div className={styles.links}>
          {this.renderSet(dataSets)}
          {this.renderSet(dataReports)}
        </div>
      </div> : <div />
    );
  }
}
