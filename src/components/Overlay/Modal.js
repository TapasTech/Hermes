import React from 'react';

import './modal.less';

export default class Modal extends React.Component {

  static propTypes = {
    show: React.PropTypes.bool
  };

  constructor(props) {
    super(props);
  }

  render() {
    const { show, children } = this.props;
    if (show) {
      return (
        <div className="modal">
          <div className="mask-layer">
            <div className="mask"></div>
            <div className="mask-transition"></div>
          </div>
          <div className="content-layer">{ children }</div>
        </div>
      );
    } else {
      return null;
    }
  }
}
