import { createReducer } from './utils';
import { INCREMENT, DECREMENT } from '../actions/types';

const initState = {
  count: 0,
};

const actionHandlers = {
  [INCREMENT]: (state, action) => {
    return {
      ...state,
      count: state.count + 1,
    };
  },
  [DECREMENT]: (state, action) => {
    return {
      ...state,
      count: state.count - 1,
    };
  },
};

export default createReducer(initState, actionHandlers);