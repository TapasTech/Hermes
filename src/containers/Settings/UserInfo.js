import React from 'react';

import {Loader} from '#/components';
import Store from '#/store';
import style from './style.less';

export default class TabUserInfo extends React.Component {
  static fragments = `
  fragment fragUserInfo on User {
    email
    avatar
    displayName
    gender
    description
    location {name}
    employment {employment position}
    education {organization direction}
  }
  `;

  constructor(props) {
    super(props);
    this.state = this.statePatch(props.me);
  }

  statePatch(me) {
    return {
      email: me.email,
      displayName: me.displayName,
      gender: me.gender,
      description: me.description,
      location: me.location.name,
      employment: me.employment.employment,
      position: me.employment.position,
      education: me.education.organization,
    };
  }

  handleValueChange(field, e) {
    this.setState({
      [field]: e.target.value,
    });
  }

  handleUpdate = () => {
    this.props.onUpdate(this.state).then(() => {
      Store.emit('EVT_MSG', {
        content: '设置已保存！',
      });
    });
  }

  render() {
    const {loading, displayName, gender, description, location, employment, position, education} = this.state;
    return (
      <div className={style.content}>
        {loading && <Loader />}
        <div className="form-group">
          <label className={style.required}>昵称：</label>
          <input type="text" className="form-control" value={displayName || ''} onChange={this.handleValueChange.bind(this, 'displayName')} />
        </div>
        <div className="form-group">
          <label className={style.required}>性别：</label>
          <input type="text" className="form-control" value={gender || ''} onChange={this.handleValueChange.bind(this, 'gender')} />
        </div>
        <div className="form-group">
          <label>签名：</label>
          <textarea className="form-control" placeholder="请输入签名" value={description || ''} onChange={this.handleValueChange.bind(this, 'description')} />
        </div>
        <hr />
        <div className="form-group">
          <label>城市：</label>
          <input type="text" className="form-control" placeholder="请输入城市" value={location || ''} onChange={this.handleValueChange.bind(this, 'location')} />
        </div>
        <div className="form-group">
          <label>行业：</label>
          <input type="text" className="form-control" placeholder="请选择行业" disabled />
        </div>
        <div className="form-group">
          <label>公司：</label>
          <input type="text" className="form-control" placeholder="请输入公司" value={employment || ''} onChange={this.handleValueChange.bind(this, 'employment')} />
        </div>
        <div className="form-group">
          <label>职位：</label>
          <input type="text" className="form-control" placeholder="请输入职位" value={position || ''} onChange={this.handleValueChange.bind(this, 'position')} />
        </div>
        <div className="form-group">
          <label>教育：</label>
          <input type="text" className="form-control" placeholder="请输入教育经历" value={education || ''} onChange={this.handleValueChange.bind(this, 'education')} />
        </div>
        <div className={style.buttons}>
          <button className="btn btn-primary mr" onClick={this.handleUpdate}>保存</button>
          <button className="btn btn-default" onClick={this.props.onCancel}>取消</button>
        </div>
      </div>
    );
  }
}
