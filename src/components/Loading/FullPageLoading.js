import React from 'react';
import cx from 'classnames';
import ListLoading from './ListLoading';

export default (props) => {
  const { prefix = 'mui-loading', className } = props;
  const wrapperClassName = `${prefix}-full-page`;
  return (
    <div className={cx(wrapperClassName, className)}>
      <ListLoading />
    </div>
  );
};