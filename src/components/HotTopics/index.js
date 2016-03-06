import React from 'react';
import { Link } from 'react-router';

import { GraphqlRest } from '#/utils';

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
        topics(page: 1) {
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

    let hash = 0;
    for (let i in name) {
      hash = hash * 6147 + name.charCodeAt(0);
      hash &= 0xffffff;
    }
    let color = hash.toString(16);
    while (color.length < 6) color = '0' + color;
    color = '#' + color;

    const imgStyle = {
      backgroundColor: color,
    };

    return (
      <div className={styles.topic} key={key}>
        <div className="topic">
          <div className="img" style={imgStyle}>{name.substr(0,1)}</div>
          <div className="name">{name}</div>
        </div>
        <Link className="link" to={`/detail/${question.id}`}>{question.title}</Link>
      </div>
    )
  }

  render() {
    return (
      <div className={styles.hotTopic}>
        <div className="title">
          <span>热门领域</span>
          <Link className="more" to="/discovery">更多</Link>
        </div>
        {
          this.state.hotTopics.map((item, index) => {
            return item
              ? this.renderHotTopic(item, index)
              : <div>loading...</div>
          })
        }
      </div>
    );
  }
}
