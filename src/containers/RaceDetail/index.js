import React from 'react';
import {Link, browserHistory} from 'react-router';

import style from './style.less';

export default class RaceDetail extends React.Component {
  static propTypes = {
    name: React.PropTypes.string,
  };

  constructor(props) {
    super(props);
  }

  renderDetail() {
    const html = '<p><em>字太多了</em>懒得敲。。。</p>';
    return (
      <div>
        <div className={style.detailTitle}>竞赛描述</div>
        <div className={style.detailContent} dangerouslySetInnerHTML={{__html: html}} />
        <hr />
        <center className="text-gray">
          <p><strong>开始时间：</strong>昨天</p>
          <p><strong>结束时间：</strong>明天</p>
          <p><strong>比赛方式：</strong>本大赛奖标准排名积分</p>
        </center>
      </div>
    );
  }

  render() {
    const {id, tab} = this.props.params;
    const index = ['', 'data', 'submit'].indexOf(tab || '');
    if (index < 0) {
      browserHistory.push(`/race/${id}`);
    }
    return (
      <div className={`container ${style.raceDetail}`}>
        <div className="main main-right">
          <div className="panel">
            <div className="text-feature">￥20000元</div>
            <div className={style.infoTitle}>中国工商银行顾客满意度调查</div>
            <div className={style.infoProgress}>
              <div style={{width: '60%'}}></div>
            </div>
            <div className="clearfix text-feature">
              <div className="pull-left">2016年3月21日</div>
              <div className="pull-right">2016年5月21日</div>
            </div>
            <hr />
            <div className={style.content}>
              {this.renderDetail()}
            </div>
          </div>
        </div>
        <div className="side-left">
          <div className="panel">Logo</div>
          <nav className="panel">
            <div className={style.navTitle}>导航</div>
            <ul className={style.navMenu}>
              <li className={index === 0 ? 'active' : ''}>
                <Link to={`/race/${id}`}>竞赛详情</Link>
              </li>
              <li className={index === 1 ? 'active' : ''}>
                <Link to={`/race/${id}/data`}>相关数据</Link>
              </li>
              <li className={index === 2 ? 'active' : ''}>
                <Link to={`/race/${id}/submit`}>提交答案</Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    );
  }
}
