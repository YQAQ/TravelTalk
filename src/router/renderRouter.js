import React from 'react';
import { Route } from 'react-router-dom';

export default (routes) => {
  return routes.map((route) => (
    <Route
      {...route}
      key={route.path}
    />
  ));
};