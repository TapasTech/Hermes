import React from 'react';

import './style.less';

export default class OuterLayer extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="outer-layer">
        <div className="mask"></div>
        <div>{ this.props.children }</div>
      </div>
    );
  }
}
