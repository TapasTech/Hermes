import React from 'react';

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
        {this.props.children || 'Welcome to Hermes'}
      </div>
    )
  }
}
