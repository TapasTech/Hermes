import React from 'react';

import styles from './style.less';
import icbc from '#/assets/icbc.svg';

export default class Race extends React.Component {
  static propTypes = {
    name: React.PropTypes.string,
  };

  constructor(props) {
    super(props);
  }

  renderItem(item, key) {
    return (
      <div className="race-col clearfix" key={key}>
        <div className="race-intro pull-left">
          <div className="wrapper">
            <div className="race-logo pull-left" style={{backgroundImage: `url(${icbc})`}}></div>
            <div className="pull-left">
              <div className="race-name">中国工商银行满意度调查</div>
              <div className="text-gray">分析什么样的客户是满意度最高的客户</div>
            </div>
          </div>
        </div>
        <div className="race-row pull-left">
          <div className="race-row-item pull-left">￥70000 元</div>
          <div className="race-row-item pull-left">23 参与者</div>
          <div className="race-row-item pull-left">20 天</div>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className={styles.race}>
        <table>
          <thead>
            <tr>
              <th colSpan="3" className="race-recent">近期比赛</th>
              <th>奖励</th>
              <th>参与</th>
              <th>剩余时间</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="race-type" rowSpan={[1,2,3,4,5].length + 1}>
                <div className="race-type-logo"></div>
                <div>竞赛</div>
              </td>
            </tr>
            {
              [1,2,3,4,5].map((item, key) => {
                return (
                  <tr key={key}>
                    <td className="race-logo">
                      <div className="race-logo-content" style={{backgroundImage: `url(${icbc})`}}></div>
                    </td>
                    <td>
                      <div className="race-from">
                        <div className="race-from-name text-big">中国工商银行满意度调查</div>
                        <div className="text-gray">分析什么样的客户是满意度最高的客户</div>
                      </div>
                    </td>
                    <td>￥70000 元</td>
                    <td>23 参与者</td>
                    <td>20 天</td>
                  </tr>
                );
              })
            }
          </tbody>
        </table>
      </div>
    );
  }
}
