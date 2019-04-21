import _ from 'lodash';
import shortid from 'shortid';
import {
  RECEIVE_NORMAL_MESSAGE,
  SEND_NORMAL_MESSAGE,
  LOAD_MORE_MESSAGE,
  SET_SHOW_MESSAGES,
} from '../actions/types';

const getMockMessages = (number = 100) => {
  const messages = [];
  for (let i = 0; i < number; i++) {
    const type = Math.ceil(Math.random() * 10);
    const data = {
      msg: '你好啊，今天天气不错，不如出去看看啊.',
      type,
      key: shortid.generate(),
    };
    messages.push(data);
  }
  return messages;
};

const mockMessages = getMockMessages(1000);

const initState = {
  // 选项卡的可见性
  optionsCardVisible: false,
  // 消息列表
  messages: mockMessages,
  showMessages: _.takeRight(mockMessages, 10),
};

export default (state = initState, action) => {
  switch (action.type) {
    case RECEIVE_NORMAL_MESSAGE: {
      const {
        messages: prevMessages,
        showMessages: prevShowMessages,
        optionsCardVisible: prevOptionsCardVisible,
      } = state;
      const { payload } = action;
      const { msg } = payload || {};
      const { type } = msg || {};
      return {
        ...state,
        messages: prevMessages.concat(msg),
        showMessages: prevShowMessages.concat(msg),
        optionsCardVisible: type <= 5 || prevOptionsCardVisible,
      };
    }
    case SEND_NORMAL_MESSAGE: {
      const {
        messages: prevMessages,
        showMessages: prevShowMessages,
      } = state;
      const { payload } = action;
      const { msg } = payload || {};
      return {
        ...state,
        messages: prevMessages.concat(msg),
        showMessages: prevShowMessages.concat(msg),
        optionsCardVisible: false,
      };
    }
    case SET_SHOW_MESSAGES: {
      const { payload } = action;
      const { num = 20 } = payload || {};
      const { messages } = state;
      const takeNum = _.min([messages.length, num]);
      const showMessages = _.takeRight(messages, takeNum);
      return {
        ...state,
        showMessages,
      };
    }
    case LOAD_MORE_MESSAGE: {
      const { payload } = action;
      const { num = 20 } = payload || {};
      const { messages, showMessages } = state;
      const allMessagesLength = messages.length;
      const currentLength = showMessages.length;
      const takeNum = currentLength + num <= allMessagesLength ? currentLength + num : allMessagesLength;
      const nextShowMessages = _.takeRight(messages, takeNum);
      return {
        ...state,
        showMessages: nextShowMessages,
      };
    }
    default:
      return state;
  }
};