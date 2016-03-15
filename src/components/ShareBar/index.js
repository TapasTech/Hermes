import React from 'react';
import QRCode from 'qrcode-react';

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
    let clx = 'shareBar';
    className && (clx = `${clx} ${className}`);

    return (
      <div className={clx}>
        <a
          className="shareBar-item weibo"
          target="_blank"
          href={`http://v.t.sina.com.cn/share/share.php?${this.objectToParams({url: url, title: title})}`}>
          <div className="shareBar-content">
            <span className="icon icon-weibo"></span>
            <span className="text-gray">分享到微博</span>
          </div>
        </a>
        <div className="shareBar-item">
          <div className="shareBar-content">
            <span className="icon icon-weixin"></span>
            <span className="text-gray">微信扫一扫</span>
          </div>
          <div className="shareBar-qrcode">
            <QRCode value={url} size={100} />
          </div>
        </div>
      </div>
    );
  }
}
