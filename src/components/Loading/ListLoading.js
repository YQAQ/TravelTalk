import React, { PureComponent } from 'react';
import classNames from 'classnames';
import Loading from './Loading';
import omit from '../utils/omit';

class ListLoading extends PureComponent {
  static defaultProps = {
    prefixCls: 'mui-loading',
    text: '正在加载...',
  }

  getWrapperClassName = () => {
    const { size, prefixCls } = this.props;
    const wrapperClassName = `${prefixCls}-list`;
    return classNames(wrapperClassName, {
      [`${wrapperClassName}-sm`]: size === 'small',
      [`${wrapperClassName}-lg`]: size === 'large',
    });
  }

  render() {
    const { className, text, prefixCls } = this.props;
    const otherProps = omit(this.props, [
      'text',
      'type',
    ]);
    return (
      <div
        className={classNames(this.getWrapperClassName(), className)}
      >
        <Loading
          {...otherProps}
        />
        <p className={`${prefixCls}-text`}>{text}</p>
      </div>
    );
  }
}

export default ListLoading;
