import React from 'react';
import ReactDOM from 'react-dom';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import OuterLayer from './OuterLayer';

export default class Overlay extends React.Component {
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
    const { show, children } = props;
    return (
      <ReactCSSTransitionGroup transitionName="fade" transitionEnterTimeout={300} transitionLeaveTimeout={300}>
        { show && <OuterLayer>{children}</OuterLayer> }
      </ReactCSSTransitionGroup>
    );
  }

  render() {
    return null;
  }

  renderIntoContainer(props) {
    ReactDOM.render(this.renderModal(props), this.container);
  }

  getContainer() {
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.className = 'overlay';
      document.body.appendChild(this.container);
    }
    return this.container;
  }

  removeContainer() {
    ReactDOM.unmountComponentAtNode(this.getContainer());
    document.body.removeChild(this.container);
    this.container = null;
  }
}
