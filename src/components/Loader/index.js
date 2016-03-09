import React from 'react';
import './style.less';

export default class Loader extends React.Component {
  static propTypes = {
    full: React.PropTypes.bool,
  }

  render() {
    const className = `loader ${this.props.full ? 'loader-full' : ''}`;
    return (
      <div className={className}>
        <div className="loader-backdrop"></div>
        <div className="loader-content">
          Loading...
        </div>
      </div>
    );
  }
}
