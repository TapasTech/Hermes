import React from 'react';
import { Link } from 'react-router';

import { AnswerCard, NewestDataSets, Loader, LoadMore } from '#/components';
import { GQL, encodeField } from '#/utils';

import styles from './style.less';

export default class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      meta: {},
      loading: true,
    };
  }

  prepareData(q, page) {
    const query = GQL.template`
    searchQuestions(query: ${encodeField(q)}, page: ${encodeField(page)}, count: 10) {
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
    `;
    const callback = res => {
      const {data, meta} = res.searchQuestions;
      this.setState({
        data,
        meta,
        loading: false,
      });
    };
    return {
      query,
      callback,
      fragments: AnswerCard.fragments,
    };
  }

  loadData(page = 1) {
    // Make sure `q` is truthy in router
    const { q } = this.props.location.query;
    this.setState({
      loading: true,
    });
    GQL.handleQueries(
      this.prepareData(q, page)
    );
  }

  onLoadMore() {
    this.loadData(this.state.meta.current_page + 1);
  }

  componentDidMount() {
    this.loadData();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps !== this.props) this.loadData();
  }

  renderAnswerCard = (item, index) => {
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
    const { data, meta, loading } = this.state;

    return (
      <div className={styles.main}>
        {loading && <Loader full={true} />}
        <div className={styles.title}>关于"{q}"的问题，共 {meta.total_count} 条</div>
        {data.length ? data.map(this.renderAnswerCard) : <div>没有匹配的结果</div>}
        <LoadMore condition={meta.current_page < meta.total_pages} onLoadMore={this.onLoadMore} />
      </div>
    );
  }

  render() {
    return (
      <div className="container">
        <div className="main main-left">
          { this.renderQuestionList() }
        </div>
        <div className="side-right">
          <NewestDataSets />
        </div>
      </div>
    );
  }
}
