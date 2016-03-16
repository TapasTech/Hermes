import React from 'react';

import {hashColor} from '#/utils';
import styles from './style.less';

export default class Avatar extends React.Component {

  static propTypes = {
    name: React.PropTypes.string,
    url: React.PropTypes.string,
    size: React.PropTypes.string,
    className: React.PropTypes.string
  };

  render() {
    const { name, url, size, className } = this.props;

    let cls = 'avatar';
    if (className) cls += ' ' + className;
    if (['large', 'medium'].includes(size)) cls += ' ' + size;
    if (url) {
      return (
        <div className={cls} style={{backgroundImage: `url(${url})`}}></div>
      );
    } else if (name) {
      return (
        <div className={cls} style={{backgroundColor: hashColor(name)}}>{name && name.slice(0, 3)}</div>
      );
    } else {
      return null;
    }
  }
}
