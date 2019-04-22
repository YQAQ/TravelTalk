import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

export default class Control extends PureComponent {
  static propTypes = {
    show: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.array,
    ]),
  };

  render() {
    const { className, show } = this.props;
    return (
      <div className={className}>
        {JSON.stringify(show)}
      </div>
    );
  }
}