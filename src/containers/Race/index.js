import React from 'react';
import { Link } from 'react-router';

import { Icon } from '#/components';
import { GQL, formatter } from '#/utils';
import styles from './style.less';

import Chart from '#/assets/icon/chart.svg';
import Doc from '#/assets/icon/doc.svg';
import Trophy from '#/assets/icon/trophy.svg';

export default class Race extends React.Component {
  static propTypes = {
    name: React.PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = {
      data: []
    }
  }

  componentDidMount() {
    GQL.handleQueries(
      this.prepareData()
    );
  }

  renderContent(obj) {
    const type = Object.keys(obj).join('');
    const data = obj[type];
    if (data) {
      return (
        <table>
          <tbody>
            <tr>
              <td className={`race-type ${type}`} rowSpan={data.length + 1}>
                <Icon glyph={this.mapWIW(type, 'icon')} width="40" height="40" />
                <div>{this.mapWIW(type, 'zh')}</div>
              </td>
            </tr>
            {
              data.map((item, key) => {
                const { id, title, description, award, expireAt, logoURL } = item;
                return (
                  <tr key={key}>
                    <td className="race-logo">
                      <div className="race-logo-content" style={{backgroundImage: `url(${logoURL})`}}></div>
                    </td>
                    <td>
                      <div className="race-from">
                        <Link className="race-from-name text-big" to={`/race/${id}`}>{title}</Link>
                        <div className="text-gray">{description}</div>
                      </div>
                    </td>
                    <td className="fixed-cell">{ this.computedAward(type, award)}</td>
                    {/* <td className="fixed-cell">23 参与者</td> */}
                    <td className="fixed-cell">{this.formatTime(expireAt)} 天</td>
                  </tr>
                );
              })
            }
          </tbody>
        </table>
      );
    } else {
      return null;
    }
  }

  render() {
    const { data } = this.state;
    const competition = data.filter(item => item.competitionType === 'competition');
    const recruitment = data.filter(item => item.competitionType === 'recruitment');
    const report = data.filter(item => item.competitionType === 'report');
    return (
      <div className={styles.race}>
        <table>
          <thead>
            <tr>
              <th className="race-recent">近期比赛</th>
              <th>奖励</th>
              {/* <th>参与</th> */}
              <th>剩余时间</th>
            </tr>
          </thead>
        </table>
        { this.renderContent({competition}) }
        { this.renderContent({recruitment}) }
        { this.renderContent({report}) }
      </div>
    );
  }

  prepareData() {
    const query = GQL.template`
    data: ongoingCompetitions {
      id
      title
      description
      competitionType
      award
      expireAt
      logoURL
    }
    `;
    const callback = res => {
      const { data } = res;
      this.setState({
        data: [
          ... this.state.data,
          ... data,
        ],
      });
    };
    return {
      query,
      callback,
    };
  }

  formatTime(val) {
    const date = new Date(val).getTime();
    const timeDiff = date - Date.now();
    return Math.floor(timeDiff/(24*60*60*1000))
  }

  mapWIW(val, type) {
    const map = {
      'competition': {
        zh: '竞赛',
        icon: Trophy
      },
      'recruitment': {
        zh: '招聘',
        icon: Doc
      },
      'report': {
        zh: '报告',
        icon: Chart
      }
    };

    return map[val][type];
  }

  computedAward(type, award) {
    switch(type) {
      case 'competition':
        return `￥ ${award} 元`;
        break;
      case 'recruitment':
        return '工作招聘';
        break;
      case 'report':
        return '知识分享';
        break;
    }
  }
}
