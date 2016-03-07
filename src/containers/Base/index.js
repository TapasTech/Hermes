import React from 'react';
import { Header, MessageBox } from '#/components';
import Store from '#/store';

export default class Base extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      query: undefined,
      messages: [],
    }
  }

  componentDidMount() {
    this.setState({
      query: this.getQuery()
    });
    Store.on('EVT_MSG', (msg) => {
      this.state.messages.push(msg);
      this.setState({});
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

  destroyMessage(msg) {
    const i = this.state.messages.indexOf(msg);
    if (~i) {
      this.state.messages.splice(i, 1);
      this.setState({});
    }
  }

  renderMessages() {
    return this.state.messages.map((msg, index) => (
      <MessageBox
        key={index}
        backdrop={msg.backdrop}
        content={msg.content}
        type={msg.type}
        lifetime={msg.lifetime}
        onDestroy={this.destroyMessage.bind(this, msg)}
      />
    ));
  }

  render() {
    return (
      <div>
        {this.renderMessages()}
        <Header query={this.state.query} />
        {this.props.children || 'Welcome to Hermes'}
      </div>
    )
  }
}
