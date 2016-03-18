import React from 'react';
import { Link, browserHistory } from 'react-router';

import {Icon} from '#/components';
import Store from '#/store';
import AppDispatcher from '#/dispatcher';
import {GraphqlRest} from '#/utils';
import {getUserInfo} from '#/services/auth';
import styles from './style.less';
import Logo from '#/assets/logo.png';
import IconSearch from '#/assets/search.svg';

export default class Header extends React.Component {
  static PropTypes = {
    query: React.PropTypes.string
  };

  constructor(props) {
    super(props);
    this.state = {
      query: this.props.query,
      user: {},
      searching: false,
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

  handleSearchInput = (e) => {
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

  handleSearch = e => {
    e && e.preventDefault && e.preventDefault();
    const { query } = this.state;
    if (query) {
      browserHistory.push(`/search?q=${this.state.query}`);
    } else {
      browserHistory.push('/');
    }
  }

  toggleSearch = () => {
    this.setState({
      searching: !this.state.searching,
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
    Store.off('EVT_USER', this._onChange);
  }

  render() {
    const { query, user, searching } = this.state;
    return (
      <nav className="navtop">
        <div className="navtop-wrap">
          <div className="navtop-logo">
            <Link to="/"></Link>
          </div>
          <ul className="navtop-menu pull-left">
            <li>
              <Link to="/race">竞赛</Link>
            </li>
            <li>
              <a>问答</a>
              <ul>
                <li>
                  <Link to="/">精彩问答</Link>
                </li>
                <li>
                  <Link to="/discovery">话题广场</Link>
                </li>
              </ul>
            </li>
          </ul>
          {user.id &&
            <div className="navtop-user pull-right">
              <Link className="navtop-item" to={`/user/${user.id}`}>{user.displayName}</Link>
              <div className="navtop-dropdown">
                <Link className="navtop-dropdown-item" to="/settings">设置</Link>
                <Link className="navtop-dropdown-item" to={`/user/${user.id}`}>个人主页</Link>
                <a className="navtop-dropdown-item" onClick={this.handleLogout}>退出登录</a>
              </div>
            </div>
          }{!user.id &&
            <div className="navtop-user pull-right">
              <Link className="navtop-item" to="/account?sign_up=1">注册</Link>
              <span className="divider"></span>
              <Link className="navtop-item" to="/account">登录</Link>
            </div>
          }
          <form className="navtop-search pull-right" onSubmit={this.handleSearch}>
            {searching &&
              <input
                type="text"
                className="form-control mr"
                value={query || ''}
                onChange={this.handleSearchInput}
                placeholder="搜索问题"
              />
            }
            <Icon className="icon" glyph={IconSearch} width="24" height="24" onClick={this.toggleSearch} />
          </form>
        </div>
      </nav>
    );
  }
}
