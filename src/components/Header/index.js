import React from 'react';
import { Link } from 'react-router';

import styles from './style.less';

export default class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      content: undefined,
      logined: true
    };
  }

  handleSearchInput(e) {
    this.setState({
      content: e.target.value
    });
  }

  render() {
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
              value={this.state.content}
              onChange={::this.handleSearchInput}
              placeholder="搜索问题"/>
            <Link className="link search-btn" to={`/search?q=${this.state.content}`}>搜索</Link>
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
            this.state.logined
              ? <div>
                <Link className="user" to="/me">我是测试用户</Link>
                <div className="menu">
                  <div className="item">设置</div>
                  <div className="item">退出登录</div>
                </div>
              </div>
              : <Link className="user" to="/me">登录/注册</Link>
          }
        </div>
      </div>
    );
  }
}
