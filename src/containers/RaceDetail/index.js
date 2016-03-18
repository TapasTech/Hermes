import React from 'react';
import {Link, browserHistory} from 'react-router';

import {Loader} from '#/components';
import {GQL, encodeField, formatter} from '#/utils';

import style from './style.less';

export default class RaceDetail extends React.Component {
  static propTypes = {
    name: React.PropTypes.string,
  }

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      data: {},
    };
  }

  componentDidMount() {
    GQL.handleQueries(
      this.prepareData()
    );
  }

  renderDetail = () => {
    const {data} = this.state;
    return (
      <div>
        <div className={style.tabTitle}>竞赛描述</div>
        <div className={style.tabContent} dangerouslySetInnerHTML={{__html: data.description}} />
        <hr />
        <center className="text-gray">
          <p><strong>开始时间：</strong>{formatter.date(data.startAt)}</p>
          <p><strong>结束时间：</strong>{formatter.date(data.expireAt)}</p>
          <p><strong>比赛方式：</strong>{data.competitionType}</p>
        </center>
      </div>
    );
  }

  renderData = () => {
    const {data} = this.state;
    return (
      <div>
        <div className={style.tabTitle}>数据文件</div>
        <div className={style.tabContent}>
          无
        </div>
        <div className={style.tabTitle}>数据描述</div>
        <div className={style.tabContent}>
          你先猜猜看？
        </div>
      </div>
    );
  }

  renderSolute = () => {
    const {data} = this.state;
    return (
      <div>
        <div className={style.tabTitle}>提交答案</div>
        <div className={style.tabContent}>
          不样提交
        </div>
      </div>
    );
  }

  render() {
    const {id, tab} = this.props.params;
    const {loading, data} = this.state;
    const index = ['', 'data', 'submit'].indexOf(tab || '');
    if (index < 0) {
      browserHistory.push(`/race/${id}`);
    }
    const renderTab = [
      this.renderDetail,
      this.renderData,
      this.renderSolute,
    ][index];
    console.log(data);
    const startAt = new Date(data.startAt).getTime();
    const expireAt = new Date(data.expireAt).getTime();
    const now = Date.now();
    const progress = now >= expireAt ? '100%' : (now - startAt) / (expireAt - startAt) * 100 + '%';
    return (
      <div className={`container ${style.raceDetail}`}>
        {loading && <Loader full={true} />}
        <div className="main main-right">
          <div className="panel">
            <div className="text-feature">{`￥${data.award}元`}</div>
            <div className={style.infoTitle}>{data.title}</div>
            <div className={style.infoProgress}>
              <div style={{width: progress}}></div>
            </div>
            <div className="clearfix text-feature">
              <div className="pull-left">{formatter.date(data.startAt)}</div>
              <div className="pull-right">{formatter.date(data.expireAt)}</div>
            </div>
            <hr />
            <div className={style.content}>
              {renderTab && renderTab()}
            </div>
          </div>
        </div>
        <div className="side-left">
          <div className="panel">
            <img src={data.logoURL} width="100%" />
          </div>
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

  prepareData() {
    const {id} = this.props.params;
    const query = GQL.template`
    competition(id: ${encodeField(id)}) {
      id
      award
      logoURL
      title
      startAt
      expireAt
      description
      competitionType
      fileUploadeds {
        name
        description
        size
        format
        updatedAt
        url
      }
    }
    `;
    const callback = data => {
      this.setState({
        data: data.competition,
        loading: false,
      });
    };
    return {
      query,
      callback,
    };
  }
}
