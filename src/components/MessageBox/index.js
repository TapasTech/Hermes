import React from 'react';
import style from './style.less';

export default class MessageBox extends React.Component {
  static propTypes = {
    backdrop: React.PropTypes.bool,
    content: React.PropTypes.string,
    type: React.PropTypes.string,
    lifetime: React.PropTypes.number,
    onDestroy: React.PropTypes.func,
  }

  state = {
    out: true,
  }

  delay(task, time) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        task();
        resolve();
      }, time);
    });
  }

  componentDidMount() {
    this.delay(() => this.setState({
      out: false,
    }))
    .then(() => this.delay(() => this.setState({
      out: true,
    }), this.props.lifetime || 2000))
    .then(() => this.delay(() => {
      const onDestroy = this.props.onDestroy;
      onDestroy && onDestroy();
    }, 500));
  }

  render() {
    return (
      <div className={`${style.msgbox} ${this.state.out ? 'msg-out' : ''}`}>
        { this.props.backdrop &&
          <div className="backdrop" />
        }
        <div className={`msg ${this.props.type || ''}`}>
          {this.props.content}
        </div>
      </div>
    );
  }
}
