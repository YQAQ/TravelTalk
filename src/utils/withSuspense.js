import React, { Suspense } from 'react';

const Loading = () => {
  return (
    <div>loading...</div>
  );
};

const withSuspense = (Component) => {
  return (props) => {
    return (
      <Suspense fallback={<Loading />}>
        <Component {...props} />
      </Suspense>
    );
  };
};

export default withSuspense;