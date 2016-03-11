import React from 'react';
import {Link, browserHistory} from 'react-router';

import {Tabs} from '#/components';
import {GraphqlRest} from '#/utils';
import UserInfo from './UserInfo';
import Avatar from './Avatar';
import Password from './Password';

import style from './style.less';

export default class Settings extends React.Component {
  state = {}

  componentDidMount() {
    GraphqlRest.handleQueries(
      this.prepareData()
    );
  }

  onUpdate = me => {
    this.setState({
      ... this.state.me,
      ... me,
    });
  }

  onCancel = () => {
    browserHistory.push(`/user/${this.state.me.id}`);
  }

  render() {
    const tab = this.props.params.tab || '';
    const {me} = this.state;
    const index = ['', 'avatar', 'password'].indexOf(tab);
    if (!~index) browserHistory.push('/settings');
    const tabs = [{
      title: <Link to="/settings">个人信息</Link>,
    }, {
      title: <Link to="/settings/avatar">设置头像</Link>,
    }, {
      title: <Link to="/settings/password">修改密码</Link>,
    }];
    const Tab = [UserInfo, Avatar, Password][index];
    return (
      <div className="container">
        <div className="full">
          <div className="panel">
            <Tabs tabs={tabs} active={index}>
              {Tab && me && <Tab me={me} onUpdate={this.onUpdate} onCancel={this.onCancel} />}
            </Tabs>
          </div>
        </div>
      </div>
    );
  }

  prepareData() {
    const query = `
    me {
      id
      ...fragUserInfo
      ...fragUserAvatar
    }`;
    const callback = data => {
      const {me} = data;
      this.setState({
        me,
      });
    };
    return {
      query,
      callback,
      fragments: [
        UserInfo.fragments,
        Avatar.fragments,
      ],
    };
  }
}
