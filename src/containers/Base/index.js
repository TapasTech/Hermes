import React from 'react';
import { Header } from '#/components';

export default class Base extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      query: undefined
    }
  }

  componentDidMount() {
    this.setState({
      query: this.getQuery()
    });
  }

  componentDidUpdate() {
    document.body.style.overflow = 'auto';
  }

  getQuery() {
    let query = this.props.location.search.substring(1);
    let vars = query.split('&');
    const pair = vars[0].split('=');
    if (decodeURIComponent(pair[0]) == 'q') {
      return decodeURIComponent(pair[1]);
    } else {
      return undefined;
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.location.search !== this.props.location.search) {
      this.setState({
        query: this.getQuery()
      });
    }
  }

  render() {
    return (
      <div>
        <Header query={this.state.query} />
        {this.props.children || 'Welcome to Hermes'}
      </div>
    )
  }
}
