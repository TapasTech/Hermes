import React from 'react';
import { Link } from 'react-router';

import { GQL, hashColor } from '#/utils';

import './style.less';

export default class HotTopics extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hotTopics: []
    };
  }

  componentDidMount() {
    GQL.handleQueries(
      this.prepareTopics()
    );
  }

  prepareTopics() {
    const query = `
    hotTopics: topics(page: 1, count: 5) {
      data {
        id
        name
        questions(page: 1, count: 1) {
          data {
            id
            title
          }
        }
      }
    }
    `;
    const callback = data => {
      this.setState({
        hotTopics: data.hotTopics.data,
      });
    }
    return {
      query,
      callback,
    };
  }

  renderHotTopic(topic, key) {
    const { id, name, questions } = topic;
    const question = questions.data[0];

    const imgStyle = {
      backgroundColor: hashColor(name),
    };

    return (
      <div className="topic-item" key={key}>
        <div className="topic clearfix">
          <div className="img title" style={imgStyle}>{name.substr(0,1)}</div>
          <div className="name">{name}</div>
        </div>
        {
          question
            && <Link className="link" to={`/question/${question.id}`}>{question.title}</Link>
        }
      </div>
    )
  }

  render() {
    const { hotTopics } = this.state;
    return (
      <div className="hot-topics panel">
        <div className="header">
          <span>热门领域</span>
          <Link className="more" to="/discovery">更多</Link>
        </div>
        {
          hotTopics[0]
            && hotTopics.map((item, index) => {
            return item
              ? this.renderHotTopic(item, index)
              : <div>loading...</div>
          })
        }
      </div>
    );
  }
}
