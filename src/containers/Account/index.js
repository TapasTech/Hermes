import React from 'react';
import { Link, browserHistory } from 'react-router';

import { GraphqlRest } from '#/utils';
import * as auth from '#/services/auth';
import AppDispatcher from '#/dispatcher';

import styles from './style.less';

export default class Account extends React.Component {
  static propTypes = {
    name: React.PropTypes.string,
  };

  static contextTypes = {
    router: React.PropTypes.object
  };

  constructor(props) {
    super(props);
    this.state = {
      displayName: '',
      email: '',
      password: '',
      ... this.statePatch(props),
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState(this.statePatch(nextProps));
  }

  statePatch(props) {
    return {
      login: !props.location.query.sign_up,
    };
  }

  // handle form value changes
  handleFormChange(name, e) {
    this.setState({
      [name]: e.target.value,
    });
  }

  handleLogin() {
    const { email, password } = this.state;
    auth.logIn(email, password).then(() => {
      browserHistory.push('/');
    });
  }

  handleSignup() {
    const { displayName, email, password } = this.state;
    auth.signUp(displayName, email, password).then(() => {
      browserHistory.push('/');
    });
  }

  handleSubmit = e => {
    e && e.preventDefault && e.preventDefault();
    this.state.login ? this.handleLogin() : this.handleSignup();
  }

  render() {
    const { displayName, email, password, login } = this.state;
    return (
      <div className={styles.account}>
        <div className={styles.content}>
          <div className={styles.switch}>
            <Link className={login ? "tab" : "tab active"} to="/account?sign_up=1">注册</Link>
            <Link className={login ? "tab active" : "tab"} to="/account">登录</Link>
          </div>
          <form className={styles.form} onSubmit={this.handleSubmit}>
            {
              !login
                && <input
                className="form-group form-control"
                type="texts"
                value={displayName || ''}
                onChange={this.handleFormChange.bind(this, 'displayName')}
                placeholder="用户名" />
            }
            <input
              className="form-group form-control"
              type="text"
              value={email}
              onChange={this.handleFormChange.bind(this, 'email')}
              placeholder="邮箱" />
            <input
              className="form-group form-control"
              type="password"
              value={password || ''}
              onChange={this.handleFormChange.bind(this, 'password')}
              placeholder="密码" />
            <button type="submit" className="btn btn-primary">{login ? '登录' : '注册'}</button>
          </form>
        </div>
      </div>
    );
  }
}
