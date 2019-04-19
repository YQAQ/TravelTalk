import {
  RECEIVE_NORMAL_MESSAGE,
  SEND_NORMAL_MESSAGE,
} from '../actions/types';

const getMockMessages = (number = 100) => {
  const messages = [];
  for (let i = 0; i < number; i++) {
    const type = Math.ceil(Math.random() * 10);
    const height = Math.ceil(Math.random() * 10) * 10;
    const data = {
      msg: '你好啊，今天天气不错，不如出去看看啊.',
      type,
      height,
    };
    messages.push(data);
  }
  return messages;
};

const mockMessages = getMockMessages(0);

const initState = {
  // 选项卡的可见性
  optionsCardVisible: false,
  // 消息列表
  messages: mockMessages,
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