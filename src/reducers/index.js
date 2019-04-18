import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import counter from './counter';
import talk from './talk';

export default (history) => {
  return combineReducers({
    router: connectRouter(history),
    counter,
    talk,
  });
};