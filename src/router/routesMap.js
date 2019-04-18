import { lazy } from 'react';
import withSuspense from '../utils/withSuspense';

const Home = withSuspense(lazy(() => import('../pages/Home')));
const Talk = withSuspense(lazy(() => import('../pages/Talk')));


export default [
  {
    path: '/',
    exact: true,
    component: Home,
  },
  {
    path: '/talk',
    component: Talk,
  },
];