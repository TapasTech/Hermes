import React from 'react';
import { Header, MessageBox } from '#/components';
import Store from '#/store';

export default class Base extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      query: '',
      messages: [],
    }
  }

  componentDidMount() {
    this.setState({
      query: this.props.location.query.q,
    });
    Store.on('EVT_MSG', (msg) => {
      this.state.messages.push(msg);
      this.setState({});
    });
  }

  componentDidUpdate() {
    document.body.style.overflow = 'auto';
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.location.query !== this.props.location.query) {
      this.setState({
        query: this.props.location.query.q,
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
