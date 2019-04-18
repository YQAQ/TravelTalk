import {
  RECEIVE_NORMAL_MESSAGE,
  SEND_NORMAL_MESSAGE,
} from '../actions/types';

const initState = {
  // 选项卡的可见性
  optionsCardVisible: false,
  // 消息列表
  messages: [],
};

export default (state = initState, action) => {
  switch (action.type) {
    case RECEIVE_NORMAL_MESSAGE: {
      const {
        messages: prevMessages,
        optionsCardVisible: prevOptionsCardVisible,
      } = state;
      const { payload } = action;
      const { msg } = payload || {};
      const { type } = msg || {};
      return {
        ...state,
        messages: prevMessages.concat(msg),
        optionsCardVisible: type <= 5 || prevOptionsCardVisible,
      };
    }
    case SEND_NORMAL_MESSAGE: {
      return {
        ...state,
        optionsCardVisible: false,
      };
    }
    default:
      return state;
  }
};