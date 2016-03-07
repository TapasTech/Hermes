import React from 'react';
import {Link, browserHistory} from 'react-router';

import Store from '#/store';
import { AnswerCard, Avatar, TopicCard } from '#/components';
import {GraphqlRest, encodeField} from '#/utils';
import styles from './style.less';

export default class PersonalCenter extends React.Component {
  static propTypes = {
    name: React.PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = {
      ... this.tabState(props),
      user: {},
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState(this.tabState(nextProps));
  }

  componentDidUpdate(prevProps, prevState) {
    prevState.tab.index !== this.state.tab.index &&
    GraphqlRest.handleQueries(
      this.prepareTabData(this.state.tab.index)
    );
  }

  tabState(props) {
    props = props || this.props;
    const tabIndex = [
      '',
      'answers',
      'questions',
    ].indexOf(props.params.tab || '');
    if (tabIndex < 0) {
      browserHistory.push(`/user/${props.params.id}`);
    }
    return {
      tab: {
        index: tabIndex,
        data: [],
      },
    };
  }

  componentDidMount() {
    GraphqlRest.handleQueries(
      this.prepareUser(),
      this.prepareTabData(this.state.tab.index)
    );
  }

  prepareUser() {
    const query = `
    user(id: ${encodeField(this.props.params.id)}) {
      id
      displayName
      gender
      description
      followersCount
      followeesCount
      questionsCount
      answersCount
      location { name }
      employment { employment position }
      education { organization direction }
      activities {
        data {
          id
          verb
          payload
        }
        meta { current_page total_pages total_count }
      }
    }
    `;
    const callback = data => {
      console.log(data.user);
      this.setState({
        user: data.user,
      });
    };
    return {
      query,
      callback,
    }
  }

  prepareActivities = (page = 0) => {
  }

  prepareAnswers = (page = 0) => {
    const query = `
    userAnswers: user(id: ${encodeField(this.props.params.id)}) {
      answers(page: ${page}) {
        data {
          id
          content
          question {
            id
            title
          }
        }
        meta { current_page total_pages total_count }
      }
    }
    `;
    const callback = data => {
      const answers = data.userAnswers.answers;
      this.setState({
        tab: {
          index: this.state.tab.index,
          data: answers.data,
          meta: answers.meta,
        },
      });
    };
    return {
      query,
      callback,
    };
  }

  prepareQuestions = (page = 0) => {
    // TODO merge queries
    const query = `
    userQuestions: user(id: ${encodeField(this.props.params.id)}) {
      questions(page: ${page}) {
        data {
          id
          title
          content
          upVotesCount
          answersCount
          createdAt
        }
        meta { current_page total_pages total_count }
      }
    }
    `;
    const callback = data => {
      const questions = data.userQuestions.questions;
      this.setState({
        tab: {
          index: this.state.tab.index,
          data: questions.data,
          meta: questions.meta,
        },
      });
    };
    return {
      query,
      callback,
    };
  }

  prepareTabData(index, ...args) {
    const prepare = [
      this.prepareActivities,
      this.prepareAnswers,
      this.prepareQuestions,
    ][index];
    return prepare && prepare(...args);
  }

  renderInfo() {
    const {user} = this.state;
    return (
      <div className={styles.info}>
        <div className={styles.base}>
          <Avatar url={user.avatar || 'http://ww2.sinaimg.cn/mw690/a56031a1jw1esek4jvzmtj206606674f.jpg'} large={true} />
          <div className="name">{user.displayName}</div>
        </div>
        <div className={styles.data}>
          <div className="item">
            <div className="num">{user.followeesCount}</div>
            <div className="tip">关注</div>
          </div>
          <div className="item">
            <div className="num">{user.followersCount}</div>
            <div className="tip">粉丝</div>
          </div>
          <div className="item">
            <div className="num">92432</div>
            <div className="tip">赞同</div>
          </div>
        </div>
        <div className="btn primary">关注</div>
      </div>
    );
  }

  renderIntro() {
    return (
      <div className={styles.intro}>
        <div>上海 | 咨询</div>
        <div>CBNData | 数据分析师</div>
        <div>加州大学伯克利分校 (UC Berkeley)</div>
      </div>
    );
  }

  renderActivities = tab => {
  }

  renderAnswers = tab => {
    return tab.data.map((item, index) => (
      <AnswerCard key={index}
        content={item.content}
        question={item.question}
        user={this.state.user}
      />
    ));
  }

  renderQuestions = tab => {
    return tab.data.map((item, index) => (
      <div className={styles.card} key={index}>
        <div className="header">
          <div>{item.createdAt}</div>
        </div>
        <div className="title">{item.title}</div>
        <div className="info">
          {item.answersCount}个回答 · {item.upVotesCount}个赞同
        </div>
      </div>
    ));
  }

  renderTabData() {
    const {tab} = this.state;
    const render = [
      this.renderActivities,
      this.renderAnswers,
      this.renderQuestions,
    ][tab.index];
    return render && render(tab) || [];
  }

  renderStream() {
    const { tab } = this.state;
    const userId = this.props.params.id;

    return (
      <div className={styles.pipe}>
        <div className={styles.tabs}>
          <Link
            className={`tab ${tab.index === 0 ? 'active' : ''}`}
            to={`/user/${userId}`}>
            最新动态
          </Link>
          <Link
            className={`tab ${tab.index === 1 ? 'active' : ''}`}
            to={`/user/${userId}/answers`}>
            回答 · {this.state.user.answersCount}
          </Link>
          <Link
            className={`tab ${tab.index === 2 ? 'active' : ''}`}
            to={`/user/${userId}/questions`}>
            提问 · {this.state.user.questionsCount}
          </Link>
        </div>
        <div className={styles.stream}>{this.renderTabData()}</div>
      </div>
    );
  }

  render() {
    return (
      <div className="container">
        <div className="sidebar">
          { this.renderInfo() }
          { this.renderIntro() }
        </div>
        <div className="main">
          { this.renderStream() }
        </div>
      </div>
    );
  }
}
