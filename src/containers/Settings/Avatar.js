import React from 'react';

import {Avatar} from '#/components';

import style from './style.less';

export default class TabAvatar extends React.Component {
  static fragments = `
  fragment fragUserAvatar on User {
    displayName
    avatar
  }
  `;

  constructor(props) {
    super(props);
    const {me} = props;
    this.state = {
      avatar: me.avatar,
      displayName: me.displayName,
    };
  }

  handleUpload = () => {
    const url = prompt('请输入URL：');
  }

  render() {
    const {avatar, displayName} = this.state;
    return (
      <div className={`${style.content} clearfix`}>
        <div className="pull-left">
          <Avatar url={avatar} name={displayName} size="large" />
        </div>
        <div className={style.avatarLarge}>
          <img src={avatar} />
          <div className={style.hint}>
            请上传小于2M的图片
          </div>
          <div className={style.buttons}>
            <button className="btn btn-default mr" onClick={this.handleUpload}>上传图片</button>
            <button className="btn btn-primary mr">保存</button>
            <button className="btn btn-primary" onClick={this.props.onCancel}>取消</button>
          </div>
        </div>
      </div>
    );
  }
}
