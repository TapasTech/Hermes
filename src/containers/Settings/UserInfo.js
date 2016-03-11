import React from 'react';

import {Loader} from '#/components';
import {GraphqlRest, encodeField} from '#/utils';
import Store from '#/store';
import style from './style.less';

export default class TabUserInfo extends React.Component {
  static fragments = `
  fragment fragUserInfo on User {
    email
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
    GraphqlRest.handleQueries(
      this.prepareUpdate()
    );
  }

  render() {
    const {loading, displayName, gender, description, location, employment, position, education} = this.state;
    return (
      <div className={style.content}>
        {loading && <Loader />}
        <div className="form-group">
          <label className={style.required}>昵称：</label>
          <input type="text" className="form-control" value={displayName} onChange={this.handleValueChange.bind(this, 'displayName')} />
        </div>
        <div className="form-group">
          <label className={style.required}>性别：</label>
          <input type="text" className="form-control" value={gender} onChange={this.handleValueChange.bind(this, 'gender')} />
        </div>
        <div className="form-group">
          <label>签名：</label>
          <textarea className="form-control" placeholder="请输入签名" onChange={this.handleValueChange.bind(this, 'description')} value={description} />
        </div>
        <hr />
        <div className="form-group">
          <label>城市：</label>
          <input type="text" className="form-control" placeholder="请输入城市" value={location} onChange={this.handleValueChange.bind(this, 'location')} />
        </div>
        <div className="form-group">
          <label>行业：</label>
          <input type="text" className="form-control" placeholder="请选择行业" disabled />
        </div>
        <div className="form-group">
          <label>公司：</label>
          <input type="text" className="form-control" placeholder="请输入公司" value={employment} onChange={this.handleValueChange.bind(this, 'employment')} />
        </div>
        <div className="form-group">
          <label>职位：</label>
          <input type="text" className="form-control" placeholder="请输入职位" value={position} onChange={this.handleValueChange.bind(this, 'position')} />
        </div>
        <div className="form-group">
          <label>教育：</label>
          <input type="text" className="form-control" placeholder="请输入教育经历" value={education} onChange={this.handleValueChange.bind(this, 'education')} />
        </div>
        <div className={style.buttons}>
          <button className="btn btn-primary mr" onClick={this.handleUpdate}>保存</button>
          <button className="btn btn-default" onClick={this.props.onCancel}>取消</button>
        </div>
      </div>
    );
  }

  prepareUpdate() {
    const {displayName, gender, description, location, employment, position, education, email} = this.state;
    const query = `
    me {
      mutation {
        update(displayName: ${encodeField(displayName)}, description: ${encodeField(description || '')}, gender: ${gender}, email: ${encodeField(email)}) {id}
      }
      location {
        mutation {
          update(name: ${encodeField(location || '')}) {name}
        }
      }
      employment {
        mutation {
          update(employment: ${encodeField(employment || '')}, position: ${encodeField(position || '')}) {employment}
        }
      }
      education {
        mutation {
          update(organization: ${encodeField(education || '')}) {organization}
        }
      }
    }
    `;
    const callback = data => {
      this.setState({loading: false});
      const onUpdate = this.props.onUpdate;
      onUpdate && onUpdate({
        displayName,
        gender,
        description,
        location: {
          name: location,
        },
        employment: {
          employment,
          position,
        },
        education: {
          organization: education,
        },
      });
      Store.emit('EVT_MSG', {
        content: '设置已保存！',
      });
    };
    return {
      query,
      callback,
    };
  }
}
