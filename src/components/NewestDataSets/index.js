import React from 'react';
import { Link } from 'react-router';

import { GQL, formatter } from '#/utils';
import './style.less';

export default class NewestDataSets extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSets: []
    };
  }

  componentDidMount() {
    GQL.handleQueries(
      this.prepareData()
    );
  }

  prepareData() {
    const query = GQL.template`
    latestDataSets: dataSets(page: 1, count: 10) {
      data {
        id
        title
        url
      }
    }
    `;
    const callback = data => {
      this.setState({
        dataSets: data.latestDataSets.data,
      });
    };
    return {
      query,
      callback,
    };
  }

  render() {
    return (
      <div className="newest-dataset panel">
        <div className="header">
          <span>最新数据</span>
          <Link className="more" to="/discovery">更多</Link>
        </div>
        {
          this.state.dataSets.map((item, index) => {
            return (
              <a key={index} className="link" target="_blank" href={formatter.url(item.url)}>· {item.title}</a>
            );
          })
        }
      </div>
    );
  }
}
