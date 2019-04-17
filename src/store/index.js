import { createStore, applyMiddleware, compose } from 'redux';
import { routerMiddleware } from 'connected-react-router';
import thunk from 'redux-thunk';
import history from '../history';
import createRootReducer from '../reducers';

const reducer = createRootReducer(history);
const middlewares = [
  thunk,
  routerMiddleware(history),
];

const composeEnhancers = 
  (typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ? 
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
      maxAge: 15,
    }) : compose;

export default (initState = {}) => {
  return createStore(reducer, initState, composeEnhancers(
    applyMiddleware(...middlewares),
  ));
};