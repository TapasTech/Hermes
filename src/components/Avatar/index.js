import React from 'react';

import styles from './style.less';

export default class Avatar extends React.Component {

  static propTypes = {
    url: React.PropTypes.string,
    large: React.PropTypes.bool,
    className: React.PropTypes.string
  };

  constructor(props) {
    super(props);
  }

  render() {
    const { url, large, className } = this.props;

    let clx = styles.avatar;
    className && (clx = `${clx} ${className}`);
    large && (clx = `${clx} large`);
    return (
      <div className={clx} style={{backgroundImage: `url(${url})`}}></div>
    );
  }
}
