import React from 'react';

import { Overlay, Icon } from '#/components';

import Remove from '#/assets/remove.svg';

import './style.less';

export default class Modal extends React.Component {
  static propTypes = {
    show: React.PropTypes.bool,
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
            <div className="remove" onClick={onCancel}>
              <Icon glyph={Remove} width="20" height="20" />
            </div>
          </div>
          <div className="modal-body">
            {children}
          </div>
        </div>
      </Overlay>
    );
  }
}
