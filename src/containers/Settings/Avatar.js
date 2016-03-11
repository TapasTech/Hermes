import React from 'react';

import {Avatar} from '#/components';
import {upload, getUrl} from '#/services/uploader';
import {GraphqlRest, encodeField} from '#/utils';
import Store from '#/store';
import AppDispatcher from '#/dispatcher';

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
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = () => {
      const files = input.files;
      if (files && files[0])
        upload(files[0]).then(data => {
          const avatar = getUrl(data);
          this.setState({
            avatar,
          });
        });
    };
    input.click();
  }

  handleSave = () => {
    this.props.onUpdate(this.state).then(() => {
      Store.emit('EVT_MSG', {
        content: '头像已更新！',
      });
      AppDispatcher.dispatch({
        type: 'USER_INFO',
        data: {
          ... Store.user.index().data,
          avatar: this.state.avatar,
        },
      });
    });
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
            <button className="btn btn-primary mr" onClick={this.handleSave}>保存</button>
            <button className="btn btn-primary" onClick={this.props.onCancel}>取消</button>
          </div>
        </div>
      </div>
    );
  }
}
