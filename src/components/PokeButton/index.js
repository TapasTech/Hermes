import React from 'react';

import styles from './style.less';

export default class PokeButton extends React.Component {
  static propTypes = {
    count: React.PropTypes.number,
    onClick: React.PropTypes.func
  };

  constructor(props) {
    super(props);
  }

  render() {
    const { count, onClick } = this.props;
    return (
      <div className={styles.poke}>
        <div className="text">赞同</div>
        <div className="poke-area">
          <div className="poke" onClick={onClick}>
            <div>{count}</div>
            <div>+1</div>
          </div>
        </div>
      </div>
    );
  }
}
