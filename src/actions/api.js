import {
  GET_MESSAGES,
  GET_MESSAGES_SUCCESS,
  GET_MESSAGE_FAIL,
  RECEIVE_NORMAL_MESSAGE,
} from './types';

/**
 * 根据当前动作主动请求消息
 */
export const getMessages = (query) => {
  return (dispatch, getState) => {
    const { talk: { stat_id } } = getState();
    const p = dispatch({
      types: [GET_MESSAGES, GET_MESSAGES_SUCCESS, GET_MESSAGE_FAIL],
      api: action => action({
        api: 'api66601',
        query: {
          stat_id,
          ...query,
        },
      }),
    });
    p.then((res) => {
      const data = (res && res.data) || {};
      dispatch({
        type: RECEIVE_NORMAL_MESSAGE,
        payload: {
          ...data,
        },
      });
    });
    return p;
  };
};