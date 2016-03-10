import React from 'react';
import {Link, browserHistory} from 'react-router';

import { AnswerCard, Avatar, TopicCard, Loader } from '#/components';
import {GraphqlRest, encodeField, formatter} from '#/utils';
import styles from './style.less';

const fragQuestion = `
fragment fragQuestion on Question {
id
title
content
upVotesCount
answersCount
createdAt
}
`;

export default class PersonalCenter extends React.Component {
  static propTypes = {
    name: React.PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = {
      ... this.tabState(props),
      user: {},
      currentPage: 1,
      totalPages: 0,
      loading: true,
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState(this.tabState(nextProps), () => {
      GraphqlRest.handleQueries(
        this.prepareTabData(this.state.currentPage)
      );
    });
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
      currentPage: 1,
      totalPages: 0,
    };
  }

  componentDidMount() {
    GraphqlRest.handleQueries(
      this.prepareUser(),
      this.prepareTabData()
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
      upVotesCount
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
      this.setState({
        user: data.user,
        loading: false,
      });
    };
    return {
      query,
      callback,
    }
  }

  prepareActivities = (page = 1) => {
    const query = `
    userActivities: user(id: ${encodeField(this.props.params.id)}) {
      activities(page: ${page}) {
        data {
          id
          verb
          createdAt
          question {
            ...fragQuestion
          }
          answer {
            ...fragAnswer
          }
        }
        meta { current_page total_pages total_count }
      }
    }
    `;
    const callback = data => {
      const activities = data.userActivities.activities;
      this.setState({
        tab: {
          index: this.state.tab.index,
          data: [
            ... this.state.tab.data,
            ... activities.data,
          ],
        },
        currentPage: activities.meta.current_page,
        totalPages: activities.meta.total_pages,
      });
    };
    return {
      query,
      callback,
      fragments: [
        fragQuestion,
        AnswerCard.fragments,
      ],
    };
  }

  prepareAnswers = (page = 1) => {
    const query = `
    userAnswers: user(id: ${encodeField(this.props.params.id)}) {
      answers(page: ${page}) {
        data {
          createdAt
          ...fragAnswer
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
          data: [
            ... this.state.tab.data,
            ... answers.data,
          ],
        },
        currentPage: answers.meta.current_page,
        totalPages: answers.meta.total_pages,
      });
    };
    return {
      query,
      callback,
      fragments: AnswerCard.fragments,
    };
  }

  prepareQuestions = (page = 1) => {
    const query = `
    userQuestions: user(id: ${encodeField(this.props.params.id)}) {
      questions(page: ${page}) {
        data {
          ...fragQuestion
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
          data: [
            ... this.state.tab.data,
            ... questions.data,
          ],
        },
        currentPage: questions.meta.current_page,
        totalPages: questions.meta.total_pages,
      });
    };
    return {
      query,
      callback,
      fragments: fragQuestion,
    };
  }

  prepareTabData(...args) {
    const prepare = [
      this.prepareActivities,
      this.prepareAnswers,
      this.prepareQuestions,
    ][this.state.tab.index];
    return prepare && prepare(...args);
  }

  loadMore = () => {
    GraphqlRest.handleQueries(
      this.prepareTabData(this.state.currentPage + 1)
    );
  }

  renderInfo() {
    const {user} = this.state;
    return (
      <div className={`panel ${styles.info}`}>
        <div className={styles.base}>
          <Avatar name={user.displayName} url={user.avatar} size="large" />
          <div className="name">{user.displayName}</div>
        </div>
        <div className={styles.data}>
          <div className="item">
            <div className="num">{user.followeesCount || 0}</div>
            <div className="tip">关注</div>
          </div>
          <div className="item">
            <div className="num">{user.followersCount || 0}</div>
            <div className="tip">粉丝</div>
          </div>
          <div className="item">
            <div className="num">{user.upVotesCount || 0}</div>
            <div className="tip">赞同</div>
          </div>
        </div>
        <div className="btn primary">关注</div>
        <div className={styles.intro}>
          <div>上海 | 咨询</div>
          <div>CBNData | 数据分析师</div>
          <div>加州大学伯克利分校 (UC Berkeley)</div>
        </div>
      </div>
    );
  }

  renderActivities = tab => {
    const user = this.state.user;
    return tab.data.map((item, index) => {
      let data;
      switch (item.verb) {
        case 'QUESTION_CREATE':
          data = (
            <div className={styles.card} key={index}>
              <div className="header">
                <div>{formatter.time(item.createdAt)}</div>
              </div>
              <div className="action">
                <Link to={`/user/${user.id}`}>{user.displayName}</Link>
                创建了问题
              </div>
              {this.renderQuestion(item.question)}
            </div>
          );
          break;
        case 'ANSWER_CREATE':
        case 'ANSWER_VOTE_UP':
          const action = item.verb === 'ANSWER_CREATE' ? '回答了问题' : '赞同了回答';
          data = (
            <div className={styles.card} key={index}>
              <div className="header">
                <div>{formatter.time(item.createdAt)}</div>
              </div>
              <div className="action">
                <Link to={`/user/${user.id}`}>{user.displayName}</Link>
                {action}
              </div>
              {this.renderAnswer(item.answer)}
            </div>
          );
          break;
      }
      return data;
    });
  }

  renderAnswer = (item) => <AnswerCard answer={item} />;

  renderAnswers = tab => tab.data.map((item, index) => (
    <div className={styles.card} key={index}>
      <div className="header">
        <div>{formatter.time(item.createdAt)}</div>
      </div>
      {this.renderAnswer(item)}
    </div>
  ));

  renderQuestion = (item) => (
    <div>
      <div className="title">
        <Link to={`/question/${item.id}`}>{item.title}</Link>
      </div>
      <div className="info">
        {item.answersCount}个回答 · {item.upVotesCount}个赞同
      </div>
    </div>
  );

  renderQuestions = tab => tab.data.map((item, index) => (
    <div className={styles.card} key={index}>
      {this.renderQuestion(item)}
    </div>
  ));

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
    const { tab, currentPage, totalPages } = this.state;
    const userId = this.props.params.id;

    return (
      <div className="panel">
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
        <div className={styles.stream}>
          {this.renderTabData()}
          {currentPage < totalPages &&
            <div className={styles.more} onClick={this.loadMore}>点击加载更多</div>
          }
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className={`container ${styles.container}`}>
        {this.state.loading && <Loader full={true} />}
        <div className="sidebar">
          { this.renderInfo() }
        </div>
        <div className="main">
          { this.renderStream() }
        </div>
      </div>
    );
  }
}
