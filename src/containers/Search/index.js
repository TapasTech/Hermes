import React from 'react';
import { Link } from 'react-router';
import { GraphqlRest } from '#/utils';

import { AnswerCard, NewestDataSets } from '#/components';

import styles from './style.less';

export default class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      questionList: [],
      questionMeta: {}
    };
  }

  handleShowMore() {
    const { q } = this.props.location.query;
    const { page } = this.state;
    this.setState({
      page: page + 1
    }, () => {
      if (q) {
        this.prepareData(q, page);
      }
    });
  }

  prepareData(keyword, page) {
    const query = `
      query {
        searchQuestions(query: "${keyword}", page: ${page}, count: 10) {
          data {
            id
            title
            answers(page: 1, count: 1) {
              data {
                ...fragAnswer
              }
            }
          }
          meta {
            current_page
            total_pages
            total_count
          }
        }
      }
    ${AnswerCard.fragments}`;
    GraphqlRest.post(query).then(res => {
      const { data, meta }  = res.searchQuestions;
      this.setState({
        questionList: data,
        questionMeta: meta
      });
    });
  }

  componentDidMount() {
    const { q } = this.props.location.query;
    const { page } = this.state;
    if (q) {
      this.prepareData(q, page);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { q } = this.props.location.query;
    const { page } = this.state;
    if (q && (q !== prevProps.location.query.q)) {
      this.prepareData(q, page);
    }
  }

  renderAnswerCard(item, index) {
    return (
      <div className={styles.topic} key={index}>
        {
          item.answers.data[0]
            ? <AnswerCard answer={item.answers.data[0]} />
            : <Link className="title" to={`/question/${item.id}`}>{item.title}</Link>
        }
      </div>
    );
  }

  renderQuestionList() {
    const { q } = this.props.location.query;
    const { page, questionList, questionMeta } = this.state;

    return (
      <div className={styles.main}>
        <div className={styles.title}>关于"{q}"的问题，共 {questionList.length} 条</div>
        {
          questionList.length
            ? questionList.map((item, index) => this.renderAnswerCard(item, index))
            : <div>没有匹配的结果</div>
        }
        {
          (questionMeta.current_page) && (questionMeta.current_page < questionMeta.total_pages)
          ? <div className="more" onClick={::this.handleShowMore}>点击加载更多</div>
          : <div className="end">已到结尾</div>
        }
      </div>
    );
  }

  render() {
    return (
      <div className="container">
        <div className="main">
          { this.renderQuestionList() }
        </div>
        <div className="sidebar">
          <NewestDataSets />
        </div>
      </div>
    );
  }
}
