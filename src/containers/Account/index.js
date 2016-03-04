import React from 'react';
import { browserHistory } from 'react-router';

import { GraphqlRest } from '#/utils';
import auth from '#/services/auth';
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
    this.loginRequset(email, password)
  }

  handleSignup() {
    const { email, password } = this.state.formData;
    this.signupRequset(::this.loginRequset);
  }

  loginRequset() {
    const { email, password } = this.state.formData;
    auth.logIn(email, password).then(() => {
      browserHistory.push('/');
    });
  }

  signupRequset(cb) {
    const { email, password } = this.state.formData;
    auth.signUp(email, password).then(() => {
      browserHistory.push('/');
    });
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
          <div className={styles.form}>
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
          </div>
          <div className={styles.submit}>
            {
              login
              ? <div className="btn primary" onClick={::this.handleLogin}>登录</div>
              : <div className="btn primary" onClick={::this.handleSignup}>注册</div>
            }
          </div>
        </div>
      </div>
    );
  }
}
