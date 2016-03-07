import React from 'react';
import { browserHistory } from 'react-router';

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
      formData: {
        displayName: undefined,
        email: undefined,
        password: undefined
      },
      login: false,
    };
  }

  handleSwitch(item = 'signup') {
    const result = item === 'login' ? true : false;
    this.setState({
      login: result
    });
  }
  // handle form value changes
  handleFormChange(name, e) {
    let newFormData = Object.assign({}, this.state.formData);
    newFormData[name] = e.target.value;
    this.setState({
      formData: newFormData
    });
  }

  handleLogin() {
    const { email, password } = this.state.formData;
    auth.logIn(email, password).then(() => {
      browserHistory.push('/');
    });
  }

  handleSignup() {
    const { displayName, email, password } = this.state.formData;
    auth.signUp(displayName, email, password).then(() => {
      browserHistory.push('/');
    });
  }

  handleSubmit = e => {
    e && e.preventDefault && e.preventDefault();
    this.state.login ? this.handleLogin() : this.handleSignup();
  }

  render() {
    const { formData, login } = this.state;
    return (
      <div className={styles.account}>
        <div className={styles.content}>
          <div className={styles.switch}>
            <div
              className={login ? "tab" : "tab active"}
              onClick={::this.handleSwitch}>注册</div>
            <div
              className={login ? "tab active" : "tab"}
              onClick={this.handleSwitch.bind(this, 'login')}>登录</div>
          </div>
          <form className={styles.form} onSubmit={this.handleSubmit}>
            {
              !login
                && <input
                className="field"
                type="texts"
                value={formData.displayName}
                onChange={this.handleFormChange.bind(this, 'displayName')}
                placeholder="用户名" />
            }
            <input
              className="field"
              type="text"
              value={formData.email}
              onChange={this.handleFormChange.bind(this, 'email')}
              placeholder="邮箱" />
            <input
              className="field"
              type="password"
              value={formData.password}
              onChange={this.handleFormChange.bind(this, 'password')}
              placeholder="密码" />
            <button type="submit" className="btn primary">{login ? '登录' : '注册'}</button>
          </form>
        </div>
      </div>
    );
  }
}
