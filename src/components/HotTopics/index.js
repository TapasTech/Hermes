import React from 'react';
import { Link } from 'react-router';

import styles from './style.less';

import { hotTopics } from '#/__mock__';

import Store from '#/store';
import AppDispatcher from '#/dispatcher';
import { GraphqlRest } from '#/utils';

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
      console.log(res)
      const { data } = res.topics;
      this.setState({
        hotTopics: data
      });
    });
  }

  renderHotTopic(topic, key) {
    const { id, name, questions } = topic;
    const question = questions.data[0];

    const color = {
      red: Math.floor(Math.random() * 255),
      green: Math.floor(Math.random() * 255),
      blue: Math.floor(Math.random() * 255),
      opacity: Math.random()
    };
    const { red, green, blue, opacity } = color;
    const imgStyle = {
      backgroundColor: `rgba(${red}, ${green}, ${blue}, ${opacity})`
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
