import React from 'react';

import styles from './style.less';

export default class LoadMore extends React.Component {
  static propTypes = {
    condition: React.PropTypes.bool.isRequired,
    onLoadMore: React.PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        {
          this.props.condition
            ? <div className={styles.more} onClick={this.props.onLoadMore}>点击加载更多</div>
            : <div className={styles.end}>已到结尾</div>
        }
      </div>
    );
  }
}
