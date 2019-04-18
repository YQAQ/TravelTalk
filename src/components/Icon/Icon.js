import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import omit from '../utils/omit';

const noop = () => {};
class Icon extends PureComponent {
  static propTypes = {
    type: PropTypes.string,
    prefixCls: PropTypes.string,
    onClick: PropTypes.func,
  };

  static defaultProps = {
    prefixCls: 'mui-icon',
    onClick: noop,
  };

  getIconClassName = () => {
    const { type, pointer, className, darken, disabled } = this.props;
    let { prefixCls } = this.props;
    return classNames(prefixCls, className, {
      iconfont: true,
      [`icon-${type}`]: type,
      [`${prefixCls}-darken`]: darken,
      [`${prefixCls}-pointer`]: pointer,
      [`${prefixCls}-disabled`]: disabled,
    });
  }

  handleClick = (e) => {
    const { onClick, disabled } = this.props;
    if (disabled) {
      return false;
    }
    onClick(e);
  }

  render() {
    const { type, color, size, scale } = this.props;
    if (!type) {
      return null;
    }
    const otherProps = omit(this.props, [
      'type',
      'size',
      'prefixCls',
      'color',
      'classname',
      'pointer',
      'darken',
      'scale',
    ]);
    const fontStyle = {
      fontSize: size,
      color,
    };
    if (scale > 0) {
      Object.assign(fontStyle, {
        display: 'inline-block',
        transform: `scale(${scale})`,
      });
    }
    return (
      <i
        {...otherProps}
        onClick={this.handleClick}
        style={fontStyle}
        className={this.getIconClassName()}
      />
    );
  }
}

export default Icon;
