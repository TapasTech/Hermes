import React from 'react';
import {Link, browserHistory} from 'react-router';

import Store from '#/store';
import UserInfo from './UserInfo';
import Avatar from './Avatar';
import Password from './Password';

import style from './style.less';

export default class Settings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: Store.user.index().data,
    };
  }

  componentDidMount() {
    Store.on('EVT_USER', this.updateUser);
  }

  componentWillUnmount() {
    Store.off('EVT_USER', this.updateUser);
  }

  updateUser = () => {
    this.setState({
      user: Store.user.index().data,
    });
  }

  render() {
    const tab = this.props.params.tab || '';
    const index = ['', 'avatar', 'password'].indexOf(tab);
    if (!~index) browserHistory.push('/settings');
    const Tab = [UserInfo, Avatar, Password][index];
    return (
      <div className="container">
        <div className="full">
          <div className="panel">
            <ul className={`${style.tabs} clearfix`}>
              <li className={index === 0 ? 'active' : ''}>
                <Link to="/settings">个人信息</Link>
              </li>
              <li className={index === 1 ? 'active' : ''}>
                <Link to="/settings/avatar">设置头像</Link>
              </li>
              <li className={index === 2 ? 'active' : ''}>
                <Link to="/settings/password">修改密码</Link>
              </li>
              <span className={style.activeMark} style={{left: index * 120}}></span>
            </ul>
            {Tab && <Tab user={this.state.user} />}
          </div>
        </div>
      </div>
    );
  }
}
