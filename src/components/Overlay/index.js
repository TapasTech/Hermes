import React from 'react';
import ReactDOM from 'react-dom';

import Modal from './Modal';

export default class ModalContainer extends React.Component {
  static propTypes = {
    show: React.PropTypes.bool
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.getContainer();
    this.renderIntoContainer(this.props);
  }

  componentWillReceiveProps(newProps) {
    this.renderIntoContainer(newProps);
  }

  componentWillUnmount() {
    this.removeContainer();
  }

  renderModal(props) {
    const { show, children} = props;
    return (
      <Modal show={show}>{children}</Modal>
    );
  }

  render() {
    return null;
  }

  renderIntoContainer(props) {
    ReactDOM.render(this.renderModal(props), this.container);
    // ReactDOM.unstable_renderSubtreeIntoContainer(this, this.renderModal(), this.container, () => console.log(1))
  }

  getContainer() {
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.className = 'modal-container';
      document.body.appendChild(this.container);
    }
    return this.container;
  }

  removeContainer() {
    ReactDOM.unmountComponentAtNode(this.container);
    document.body.removeChild(this.container);
    this.container = null;
  }
}
