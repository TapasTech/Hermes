import React from 'react';

import style from './style.less';

export default class TabUserInfo extends React.Component {
  render() {
    return (
      <div className={style.content}>
        <div className="form-group">
          <label className={style.required}>昵称：</label>
          <input type="text" className="form-control" />
        </div>
        <div className="form-group">
          <label className={style.required}>性别：</label>
          <input type="text" className="form-control" />
        </div>
        <div className="form-group">
          <label>签名：</label>
          <textarea className="form-control" placeholder="请输入签名" />
        </div>
        <hr />
        <div className="form-group">
          <label>城市：</label>
          <input type="text" className="form-control" placeholder="请输入城市" />
        </div>
        <div className="form-group">
          <label>行业：</label>
          <input type="text" className="form-control" placeholder="请选择行业" />
        </div>
        <div className="form-group">
          <label>公司：</label>
          <input type="text" className="form-control" placeholder="请输入公司" />
        </div>
        <div className="form-group">
          <label>职位：</label>
          <input type="text" className="form-control" placeholder="请输入职位" />
        </div>
        <div className="form-group">
          <label>教育：</label>
          <input type="text" className="form-control" placeholder="请输入教育经历" />
        </div>
        <div className={style.buttons}>
          <button className="btn">保存</button>
          <button className="btn">取消</button>
        </div>
      </div>
    );
  }
}
