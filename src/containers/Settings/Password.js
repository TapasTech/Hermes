import React from 'react';
import {browserHistory} from 'react-router';

import {GQL, encodeField} from '#/utils';
import Store from '#/store';
import AppDispatcher from '#/dispatcher';

import style from './style.less';

export default class TabPassword extends React.Component {
  state = {}

  prepareUpdate() {
    const {oldPwd, newPwd, confirmPwd} = this.state;
    const query = GQL.template`
    me {
      mutation {
        updatePassword(oldPassword: ${encodeField(oldPwd)}, password: ${encodeField(newPwd)}) {id}
      }
    }
    `;
    const callback = data => {
      Store.emit('EVT_MSG', {
        content: '密码已修改，请重新登录！',
      });
      browserHistory.push('/account');
      AppDispatcher.dispatch({
        type: 'USER_LOGOUT',
        data: {},
      });
    };
    return {
      query,
      callback,
    };
  }

  handleUpdate = () => {
    const {oldPwd, newPwd, confirmPwd} = this.state;
    const invalid = !oldPwd || !newPwd || !confirmPwd || newPwd !== confirmPwd;
    if (invalid) return;
    GQL.handleQueries(
      this.prepareUpdate()
    );
  }

  handleValueChange(key, e) {
    this.setState({
      [key]: e.target.value,
    });
  }

  render() {
    const {oldPwd, newPwd, confirmPwd} = this.state;
    const invalid = !oldPwd || !newPwd || !confirmPwd || newPwd !== confirmPwd;
    return (
      <div className={style.content}>
        <div className="form-group">
          <label>旧密码：</label>
          <input type="password" className="form-control" onChange={this.handleValueChange.bind(this, 'oldPwd')} />
        </div>
        <div className="form-group">
          <label>新密码：</label>
          <input type="password" className="form-control" onChange={this.handleValueChange.bind(this, 'newPwd')} />
        </div>
        <div className="form-group">
          <label>确认密码：</label>
          <input type="password" className="form-control" onChange={this.handleValueChange.bind(this, 'confirmPwd')} />
          {newPwd !== confirmPwd && <span className="text-danger ml">两次输入密码不一致</span>}
        </div>
        <div className={style.buttons}>
          <button className={`btn btn-primary mr ${invalid ? 'disabled' : ''}`} onClick={this.handleUpdate}>保存</button>
          <button className="btn btn-default" onClick={this.props.onCancel}>取消</button>
        </div>
      </div>
    );
  }
}
