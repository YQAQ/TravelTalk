import React from 'react';
import classNames from 'classnames';
import Loading from './Loading';
import omit from '../utils/omit';

const LoadMoreLoading = (props) => {
  const {
    prefixCls = 'mui-loading',
    className,
  } = props;
  const wrapperClassName = `${prefixCls}-load-more`;
  const cls = classNames(wrapperClassName, {
    className,
  });
  const otherProps = omit(props, [
    'type',
  ]);
  return (
    <div className={cls}>
      <Loading
        {...otherProps}
        type="line"
      />
    </div>
  );
};

export default LoadMoreLoading;
