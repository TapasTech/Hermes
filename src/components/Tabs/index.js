import React from 'react';

import './style.less';

export default class Tabs extends React.Component {
  renderItem = (item, index) => {
    const active = this.props.active === index ? 'active' : '';
    return (
      <li key={index} className={`tabs-item ${active}`} onClick={item.onClick}>
        {item.title}
      </li>
    );
  }

  render() {
    const {tabs, children, active} = this.props;
    return (
      <div className="tabs">
        <ul className="tabs-header clearfix">
          {tabs.map(this.renderItem)}
          <span className="tabs-active-mark" style={{left: active * 120}} />
        </ul>
        {children}
      </div>
    );
  }
}
