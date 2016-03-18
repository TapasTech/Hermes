import React from 'react';

import styles from './style.less';
import { GQL, formatter } from '#/utils';

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

  renderRaceType(type, data) {
    return (
      <tr>
        <td className="race-type" rowSpan={data.length + 1}>
          <div className={`race-type-logo ${type}`}></div>
          <div>{this.mapEn2Zh(type)}</div>
        </td>
      </tr>
    );
  }

  renderRaceContent(type, item, key) {
    const { id, title, description, award, expireAt, logoURL } = item;
    return (
      <tr key={key}>
        <td className="race-logo">
          <div className="race-logo-content" style={{backgroundImage: `url(${logoURL})`}}></div>
        </td>
        <td>
          <div className="race-from">
            <div className="race-from-name text-big">{title}</div>
            <div className="text-gray">{description}</div>
          </div>
        </td>
        <td>
          { (type === 'competition')  && `￥ ${award} 元` }
          { (type === 'recruitment')  && '工作招聘' }
          { (type === 'report')  && '知识分享' }
        </td>
        {/* <td>23 参与者</td> */}
        <td>{this.formatTime(expireAt)} 天</td>
      </tr>
    );
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
              <th colSpan="3" className="race-recent">近期比赛</th>
              <th>奖励</th>
              {/* <th>参与</th> */}
              <th>剩余时间</th>
            </tr>
          </thead>
          <tbody>
            { this.renderRaceType('competition', competition) }
            { competition && competition.map((item, key) => this.renderRaceContent('competition', item, key)) }
            { this.renderRaceType('recruitment', recruitment) }
            { recruitment && recruitment.map((item, key) => this.renderRaceContent('recruitment', item, key)) }
            { this.renderRaceType('report', report) }
            { report && report.map((item, key) => this.renderRaceContent('report', item, key)) }
          </tbody>
        </table>
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

  mapEn2Zh(val) {
    const map = {
      'competition': '竞赛',
      'recruitment': '招聘',
      'report': '报告'
    };

    return map[val];
  }
}
