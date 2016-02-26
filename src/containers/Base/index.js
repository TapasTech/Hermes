import React from 'react';
import { Header } from '#/components';

export default class Base extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidUpdate() {
    document.body.style.overflow = 'auto';
  }

  render() {
    return (
      <div>
        <Header />
        {this.props.children || 'Welcome to Hermes'}
      </div>
    )
  }
}
