import React, { Suspense } from 'react';
import { Loading } from '@/components';

const { FullPageLoading } = Loading;

const withSuspense = (Component, fallback) => {
  return (props) => {
    return (
      <Suspense fallback={fallback || <FullPageLoading />}>
        <Component {...props} />
      </Suspense>
    );
  };
};

export default withSuspense;