import React from 'react';
import { Link, browserHistory } from 'react-router';

import Store from '#/store';
import AppDispatcher from '#/dispatcher';
import styles from './style.less';

export default class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      content: undefined,
      user: Store.user.index().data,
      logined: false
    };
  }

  handleSearchInput(e) {
    this.setState({
      content: e.target.value
    });
  }

  handleLogout() {
    localStorage.setItem('__AUTH', '');
    browserHistory.push('/account');
    AppDispatcher.dispatch({
      type: 'USER_LOGOUT'
    });
  }

  _onChange() {
    this.setState({
      user: Store.user.index().data
    });
  }

  componentDidMount() {
    Store.on('change', ::this._onChange);
  }

  componentWillUnmount() {
    Store.removeListener('change', ::this._onChange);
  }

  render() {
    const { content, user, logined } = this.state;
    return (
      <div className={styles.header}>
        <div className="main">
          <div className="logo">
            <Link className="link" to="/">Hermes</Link>
          </div>
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
        <div className="side">
          {
            user
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
      </div>
    );
  }
}
