import React from 'react';
import { Link } from 'react-router';

import { GraphqlRest, hashColor } from '#/utils';

import styles from './style.less';

export default class HotTopics extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hotTopics: []
    };
  }

  //topics
  componentDidMount() {
    const query = `
      query {
        topics(page: 1, count: 5) {
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
      }
    `;

    GraphqlRest.post(query).then(res => {
      const { data } = res.topics;
      this.setState({
        hotTopics: data
      });
    });
  }

  renderHotTopic(topic, key) {
    const { id, name, questions } = topic;
    const question = questions.data[0];

    const imgStyle = {
      backgroundColor: hashColor(name),
    };

    return (
      <div className={styles.topic} key={key}>
        <div className="topic">
          <div className="img" style={imgStyle}>{name.substr(0,1)}</div>
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
      <div className={styles.hotTopic}>
        <div className="title">
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
