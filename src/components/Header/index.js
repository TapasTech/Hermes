import React from 'react';
import { Link, browserHistory } from 'react-router';

import Store from '#/store';
import AppDispatcher from '#/dispatcher';
import {GraphqlRest} from '#/utils';
import {getUserInfo} from '#/services/auth';
import styles from './style.less';

export default class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      content: undefined,
      user: Store.user.index().data,
    };
  }

  componentWillMount() {
    getUserInfo();
  }

  handleSearchInput(e) {
    this.setState({
      content: e.target.value
    });
  }

  handleLogout() {
    browserHistory.push('/account');
    AppDispatcher.dispatch({
      type: 'USER_LOGOUT',
      data: {},
    });
  }

  _onChange = () => {
    this.setState({
      user: Store.user.index().data
    });
  }

  componentDidMount() {
    Store.on('EVT_USER', this._onChange);
  }

  componentWillUnmount() {
    Store.removeListener('EVT_USER', this._onChange);
  }

  render() {
    const { content, user } = this.state;
    return (
      <nav className={styles.header}>
        <div className="wrap">
          <div className="logo">
            <Link className="link" to="/">Hermes</Link>
          </div>
          <div className="side">
            {user.id
              ? <div>
                <Link className="user" to={`/person/${user.id}`}>{user.displayName}</Link>
                <div className="menu">
                  <div className="item">设置</div>
                  <div className="item" onClick={::this.handleLogout}>退出登录</div>
                </div>
              </div>
              : <Link className="user" to="/account">登录/注册</Link>
            }
          </div>
          <div className="main">
            <div className="search">
              <input
                type="text"
                className="input"
                value={content}
                onChange={::this.handleSearchInput}
                placeholder="搜索问题"/>
              <Link className="link search-btn" to={`/search?q=${content}`}>搜索</Link>
            </div>
            <div className="nav">
              <Link className="link" to="/">首页</Link>
              <Link className="link" to="/discovery">发现</Link>
              <span className="divider"></span>
              <Link className="link" to="/ask/_new">提问</Link>
            </div>
          </div>
        </div>
      </nav>
    );
  }
}
