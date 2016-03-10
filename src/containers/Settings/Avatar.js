import React from 'react';
import {Avatar} from '#/components';

import style from './style.less';

export default class TabAvatar extends React.Component {
  state = {}

  render() {
    const {user} = this.props;
    const {avatar} = this.state;
    return (
      <div className={`${style.content} clearfix`}>
        <div className="pull-left">
          <Avatar url={avatar} name={user && user.displayName} size="large" />
        </div>
        <div className={style.avatarLarge}>
          <img src={avatar} />
          <div className={style.hint}>
            请上传小于2M的图片
          </div>
          <div className={style.buttons}>
            <button className="btn btn-default mr">上传图片</button>
            <button className="btn btn-primary">保存</button>
          </div>
        </div>
      </div>
    );
  }
}
