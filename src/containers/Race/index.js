import React from 'react';
import { Link } from 'react-router';

import { GQL, formatter, encodeField } from '#/utils';
import { RaceList, Loader, LoadMore } from '#/components';
import styles from './style.less';

export default class Race extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      currentPage: 1,
      loading: true
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

  renderAll() {
    const { data, currentPage, totalPages, totalCount } = this.state;
    return (
      <div className={styles.raceAll}>
        <table className="table table-bordered table-hover">
          <thead>
            <tr>
              <th className="race-recent" colSpan={2}>比赛名称</th>
              <th>奖励</th>
              <th>参与</th>
              <th>剩余时间</th>
            </tr>
          </thead>
          <tbody>
            {
              data.map((item, key) => {
                const { id, title, summary, award, expireAt, thumbLogoURL, competitionType } = item;
                const detail = {
                  'competition': `￥${award}`,
                  'recruitment': '工作招聘',
                  'report': '知识分享'
                }[competitionType];
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
                    <td className="fixed-cell">{detail}</td>
                    <td className="fixed-cell">23 参与者</td>
                    <td className="fixed-cell">{this.formatTime(expireAt)} 天</td>
                  </tr>
                );
              })
            }
          </tbody>
        </table>
        <ul className="pagination">
          <li><a href="#" aria-label="Previous">&laquo;</a></li>
          <li><a href="#">1</a></li>
          <li><a href="#">2</a></li>
          <li><a href="#">3</a></li>
          <li><a href="#">4</a></li>
          <li><a href="#">5</a></li>
          <li><a href="#" aria-label="Next">&raquo;</a></li>
        </ul>
      </div>
    );
  }

  render() {
    const tab = this.props.route.name === 'all' ? 'all' : '';
    const index = ['', 'all'].indexOf(tab || '');
    if (index < 0) {
      browserHistory.push(`/race`);
    }
    return (
      <div>
        { this.renderGuide() }
        <div className="hermes-container">
          { this.state.loading && <Loader full={true} />}
          <div className="main main-right">
            { (index === 0) ? <RaceList /> : this.renderAll() }
          </div>
          <div className="side-left">
            <nav className="panel">
              <div className={styles.navTitle}>导航</div>
              <ul className={styles.navMenu}>
                <li className={index === 0 ? 'active' : ''}>
                  <Link to={`/race`}>竞赛详情</Link>
                </li>
                <li className={index === 1 ? 'active' : ''}>
                  <Link to={`/race/all`}>相关数据</Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    );
  }

  handleMoreRaces(page) {
    GQL.handleQueries(
      this.prepareData(page)
    );
  }

  prepareData(page = 1) {
    const query = GQL.template`
    competitions(page: ${encodeField(page)}) {
      data {
        id
        title
        summary
        competitionType
        award
        expireAt
        thumbLogoURL
      }
      meta {
        current_page total_count total_pages
      }
    }
    `;
    const callback = res => {
      const { data, meta } = res.competitions;
      this.setState({
        data: [
          ... this.state.data,
          ... data,
        ],
        currentPage: meta.current_page,
        totalPages: meta.total_pages,
        totalCount: meta.total_count,
        loading: false
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
