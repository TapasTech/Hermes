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

  renderGuide() {
    return (
      <div className={styles.guide}>
        <div className="container">
          <div className="row">
            <div className="col-md-4">
              <div className="title">欢迎来到sayInData竞赛</div>
              <div className="guide-tip">
                <div>New?</div>
                <Link className={styles.link} to="/me">引导项目 »</Link>
              </div>
              <div className="guide-tip">
                <div>Learn?</div>
                <Link className={styles.link} to="/me">问答排行 »</Link>
              </div>
            </div>
            <div className="col-md-8">
              <div className="row">
                <div className="col-md-4">
                  <div className="icon-set">
                    <i className="glyphicon glyphicon-search"></i>
                    <i className="glyphicon glyphicon-book"></i>
                    <i className="glyphicon glyphicon-save"></i>
                  </div>
                  <div className="header">下载</div>
                  <p>Choose a competition & download the training data.</p>
                </div>
                <div className="col-md-4">
                  <div className="icon-set">
                    <i className="glyphicon glyphicon-fire"></i>
                    <i className="glyphicon glyphicon-cog"></i>
                    <i className="glyphicon glyphicon-stats"></i>
                  </div>
                  <div className="header">构建</div>
                  <p>Build a model using whatever methods and tools you prefer.</p>
                </div>
                <div className="col-md-4">
                  <div className="icon-set">
                    <i className="glyphicon glyphicon-open"></i>
                    <i className="glyphicon glyphicon-asterisk"></i>
                    <i className="glyphicon glyphicon-star"></i>
                  </div>
                  <div className="header">提交</div>
                  <p>Upload your predictions. Kaggle scores your solution and shows your score on the leaderboard.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
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
                    <td className="gray-cell">
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
      <div>
        { this.renderGuide() }
        <div className={styles.race}>
          <div className="race-recent">近期比赛</div>
          { this.renderContent({competition}) }
          { this.renderContent({recruitment}) }
          { this.renderContent({report}) }
        </div>
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
