/**
 * 简化reducer的写法
 * @param {object} initState 初始state
 * @param {*} handlers reducer
 * Example:
 *  import { INCREMENT } from 'actions/types';
 *  const counterReducer = createReducer({}, {
 *    [INCREMENT]: (state, action) => {
 *      return {
 *        ...state,
 *         count: state.count + 1,
 *      };
 *    },
 *  });
 *  export default counterReducer;
 */
export const createReducer = (initState, handlers) => {
  return (state = initState, action) => {
    if (handlers.hasOwnProperty(action.type)) {
      return handlers[action.type](state, action);
    } else {
      return state;
    }
  };
};