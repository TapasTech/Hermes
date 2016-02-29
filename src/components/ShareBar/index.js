import React from 'react';
import QRCode from 'qrcode-react';

import styles from './style.less';

export default class ShareBar extends React.Component {
  static defaultProps = {
    url: 'http://tapastech.github.io/Hermes/',
    title: 'Hello, Hermes!'
  }

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
    let clx = styles.shareTip;
    className && (clx = `${clx} ${className}`);

    return (
      <div className={clx}>
        <a
          className="weibo"
          target="_blank"
          href={`http://v.t.sina.com.cn/share/share.php?${this.objectToParams({url: url, title: title})}`}>
          <span className="icon icon-weibo"></span>
          分享到微博
        </a>
        <div className="weixin">
          <div className="tip">
            <span className="icon icon-weixin"></span>
            微信扫一扫
          </div>
          <div className="qrcode">
            <QRCode value={url} size={100} />
          </div>
        </div>
      </div>
    );
  }
}
