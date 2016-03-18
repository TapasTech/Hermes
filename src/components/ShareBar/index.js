import React from 'react';
import QRCode from 'qrcode-react';

import {Icon} from '#/components';
import IconWeibo from '#/assets/weibo.svg';
import IconWeixin from '#/assets/weixin.svg';

import styles from './style.less';

export default class ShareBar extends React.Component {

  static propTypes = {
    url: React.PropTypes.string,
    title: React.PropTypes.string,
    className: React.PropTypes.string
  };

  constructor(props) {
    super(props);
  }

  objectToParams(object) {
    const string = Object.keys(object).map(key => `${key}=${encodeURIComponent(object[key])}`).join('&');
    return string;
  };

  render() {
    const { url, title, className } = this.props;

    return (
      <div className={`sharebar ${className || ''}`}>
        <a
          className="sharebar-item"
          target="_blank"
          href={`http://v.t.sina.com.cn/share/share.php?${this.objectToParams({url: url, title: title})}`}>
          <Icon className="icon mr-sm" glyph={IconWeibo} width="24" height="24" style={{fill: 'red'}} />
          <span className="text-gray">分享到微博</span>
        </a>
        <a className="sharebar-item">
          <Icon className="icon mr-sm" glyph={IconWeixin} width="24" height="24" style={{fill: 'green'}} />
          <span className="text-gray">微信扫一扫</span>
          <div className="sharebar-qrcode">
            <QRCode value={url} size={100} />
          </div>
        </a>
      </div>
    );
  }
}
