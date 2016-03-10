import React from 'react';

import style from './style.less';

export default class TabPassword extends React.Component {
  state = {}

  render() {
    return (
      <div className={style.content}>
        <div className="form-group">
          <label>旧密码：</label>
          <input type="password" className="form-control" />
        </div>
        <div className="form-group">
          <label>新密码：</label>
          <input type="password" className="form-control" />
        </div>
        <div className="form-group">
          <label>确认密码：</label>
          <input type="password" className="form-control" />
        </div>
        <div className={style.buttons}>
          <button className="btn btn-primary mr">保存</button>
          <button className="btn btn-default">取消</button>
        </div>
      </div>
    );
  }
}
