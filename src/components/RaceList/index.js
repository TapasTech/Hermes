import React from 'react';
import { Link } from 'react-router';

import { Icon } from '#/components';
import { GQL, formatter } from '#/utils';

import Chart from '#/assets/icon/chart.svg';
import Doc from '#/assets/icon/doc.svg';
import Trophy from '#/assets/icon/trophy.svg';

import styles from './style.less';

export default class RaceList extends React.Component {
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

  renderTab() {
    return (
      <div>
        <div>近期比赛</div>
        <div>全部</div>
      </div>
    );
  }

  renderContent(obj) {
    const type = Object.keys(obj).join('');
    const data = obj[type];
    if (data) {
      return (
        <table className="table">
          <tbody>
            <tr>
              <td className={`race-type ${type}`} rowSpan={data.length + 1}>
                <Icon glyph={this.mapWIW(type, 'icon')} width="40" height="40" />
                <div>{this.mapWIW(type, 'zh')}</div>
              </td>
            </tr>
            {
              data.map((item, key) => {
                const { id, title, summary, award, expireAt, thumbLogoURL } = item;
                const detail = {
                  'competition': `￥${award}`,
                  'recruitment': '工作招聘',
                  'report': '知识分享'
                }[type];
                return (
                  <tr key={key}>
                    <td className="race-logo">
                      <div className="race-logo-content" style={{backgroundImage: `url(${thumbLogoURL})`}}></div>
                    </td>
                    <td className="race-desc">
                      <div className="race-from">
                        <Link className="race-from-name text-big" to={`/race/${id}`}>{title}</Link>
                        <div className="text-gray">{summary}</div>
                      </div>
                    </td>
                    <td className="race-detail">
                      <div className="text-gray">
                        <div>{this.formatTime(expireAt)} 天</div>
                        <div>参与者</div>
                        <div>已经提交</div>
                        <div>{detail}</div>
                      </div>
                    </td>
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
      <div className={styles.raceList}>
        <div className="race-recent">近期比赛</div>
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
      summary
      competitionType
      award
      expireAt
      thumbLogoURL
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
}
