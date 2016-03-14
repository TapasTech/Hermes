import React from 'react';

import { Overlay } from '#/components';

import './style.less';

export default class Modal extends React.Component {
  static propTypes = {
    title: React.PropTypes.string,
    onCancel: React.PropTypes.func
  };

  constructor(props) {
    super(props);
  }

  render() {
    const { show, title, onCancel, children } = this.props;
    return (
      <Overlay show={show}>
        <div className="modal">
          <div className="modal-head">
            {title}
            <i className="remove" onClick={onCancel}></i>
          </div>
          <div className="modal-body">
            {children}
          </div>
        </div>
      </Overlay>
    );
  }
}
