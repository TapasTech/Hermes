import React from 'react';

export default class Icon extends React.Component {
  static propTypes = {
    glyph: React.PropTypes.string.isRequired,
  }

  render() {
    const {className, glyph, ...props} = this.props;
    return (
      <svg class={className} {...props}>
        <use xlinkHref={glyph} />
      </svg>
    );
  }
}
