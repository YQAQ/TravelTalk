import {
  LOAD_MORE_MESSAGE,
  SET_SHOW_MESSAGES,
} from './types';

/**
 * 上滑加载更多消息
 */
export const loadMoreMessages = (num = 20) => {
  return {
    type: LOAD_MORE_MESSAGE,
    payload: {
      num,
    },
  };
};

/**
 * 重置用于显示的消息
 */
export const resetShowMessages = (num = 20) => {
  return {
    type: SET_SHOW_MESSAGES,
    payload: {
      num,
    },
  };
};