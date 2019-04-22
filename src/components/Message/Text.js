import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

export default class Text extends PureComponent {
  static propTypes = {
    text: PropTypes.string.isRequired,
  };

  render() {
    const { className, text } = this.props;
    return (
      <p className={className}>
        {text}
      </p>
    );
  }
}