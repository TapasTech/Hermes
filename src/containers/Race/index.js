import React from 'react';

export default class Race extends React.Component {
  static propTypes = {
    name: React.PropTypes.string,
  };

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>hello race</div>
    );
  }
}
