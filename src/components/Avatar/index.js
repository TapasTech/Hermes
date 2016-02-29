import React from 'react';

import styles from './style.less';

export default class Avatar extends React.Component {

  static propTypes = {
    url: React.PropTypes.string,
    large: React.PropTypes.bool
  };

  constructor(props) {
    super(props);
  }

  render() {
    const { url, large } = this.props;
    let className = 'name';
    large && (className = className.concat(' ', 'large'));
    return (
      <div className={styles.avatar}>
        <div className='pic' style={{backgroundImage: `url(${url})`}}></div>
      </div>
    );
  }
}
