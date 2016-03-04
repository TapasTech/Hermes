import React from 'react';
import { Link } from 'react-router';

import { GraphqlRest } from '#/utils';
import styles from './style.less';

export default class NewestDataSets extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSets: []
    };
  }

  componentDidMount() {
    const query = `
      query {
        data_sets(page: 1, count: 10) {
          data {
            id
            title
            url
          }
        }
      }
    `;

    GraphqlRest.post(query).then(res => {
      const { data } = res.data_sets
      this.setState({
        dataSets: data
      })
    })
  }

  render() {
    return (
      <div className={styles.newest}>
        <div className="title">
          <span>最新数据</span>
          <Link className="more" to="/discovery">更多</Link>
        </div>
        {
          this.state.dataSets.map((item, index) => {
            return (
              <a key={index} className="link" href={item.url}>· {item.title}</a>
            );
          })
        }
      </div>
    );
  }
}
