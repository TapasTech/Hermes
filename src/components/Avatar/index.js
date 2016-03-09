import React from 'react';

import {hashColor} from '#/utils';
import styles from './style.less';

export default class Avatar extends React.Component {

  static propTypes = {
    name: React.PropTypes.string,
    url: React.PropTypes.string,
    large: React.PropTypes.bool,
    className: React.PropTypes.string
  };

  constructor(props) {
    super(props);
  }

  render() {
    const { name, url, large, medium, className } = this.props;

    let clx = styles.avatar;
    className && (clx = `${clx} ${className}`);
    large && (clx = `${clx} large`);
    medium && (clx = `${clx} medium`);
    if (url) {
      return (
        <div className={clx} style={{backgroundImage: `url(${url})`}}></div>
      );
    } else {
      return (
        <div className={clx} style={{backgroundColor: hashColor(name)}}>{name && name.slice(0, 4)}</div>
      );
    }
  }
}
