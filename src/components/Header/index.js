import React from 'react';
import { Link, browserHistory } from 'react-router';

import Store from '#/store';
import AppDispatcher from '#/dispatcher';
import {GraphqlRest} from '#/utils';
import {getUserInfo} from '#/services/auth';
import styles from './style.less';

export default class Header extends React.Component {
  static PropTypes = {
    query: React.PropTypes.string
  };

  constructor(props) {
    super(props);
    this.state = {
      query: this.props.query,
      user: {}
    };
  }

  componentWillMount() {
    getUserInfo();
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      query: nextProps.query
    });
  }

  handleSearchInput(e) {
    this.setState({
      query: e.target.value
    });
  }

  handleLogout() {
    browserHistory.push('/account');
    AppDispatcher.dispatch({
      type: 'USER_LOGOUT',
      data: {},
    });
  }

  handleSearch() {
    const { query } = this.state;
    if (query) {
      browserHistory.push(`/search?q=${this.state.query}`);
    } else {
      browserHistory.push('/search');
    }
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
    const { query, user } = this.state;
    return (
      <nav className={styles.header}>
        <div className="wrap">
          <div className="logo">
            <Link className="link" to="/">Hermes</Link>
          </div>
          <div className="side">
            {user.id
              ? <div>
                <Link className="user" to={`/user/${user.id}`}>{user.displayName}</Link>
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
                value={query}
                onChange={::this.handleSearchInput}
                placeholder="搜索问题"/>
              <div className="link search-btn" onClick={::this.handleSearch}>搜索</div>
            </div>
            <div className="nav">
              <Link className="link" to="/">首页</Link>
              <Link className="link" to="/discovery">发现</Link>
              <span className="divider"></span>
              <Link className="link" to="/question/_new">提问</Link>
            </div>
          </div>
        </div>
      </nav>
    );
  }
}
