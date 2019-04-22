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
    const textMsg = {
      type: 'text',
      sleep: 0,
      text: '你好啊，今天天气不错，不如出去看看啊.',
    };
    const controlMsg = {
      type: 'control',
      control_id: shortid.generate(),
      show: {
        name: 'XXX酒店',
      },
      callback: [],
    };
    messages.push(type <= 5 ? controlMsg : textMsg);
  }
  return messages;
};

const handleMsg = (messages) => {
  return messages.map((message) => {
    return {
      ...message,
      key: shortid.generate(),
      from: message.from || 'service',
    };
  });
};

const mockMessages = handleMsg(getMockMessages(1000));

const initState = {
  // 选项卡的可见性
  optionsCardVisible: false,
  // 消息列表
  messages: mockMessages,
  showMessages: _.takeRight(mockMessages, 10),
  // 当前session所在的最新状态id
  stat_id: '0000_0',
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
      const { stat_id, feedback } = payload || {};
      const messages = handleMsg(feedback || []);
      const optionsCardVisible = messages.find((message) => {
        return message.control_id === 1;
      });
      return {
        ...state,
        stat_id,
        messages: prevMessages.concat(messages),
        showMessages: prevShowMessages.concat(messages),
        optionsCardVisible: optionsCardVisible || prevOptionsCardVisible,
      };
    }
    case SEND_NORMAL_MESSAGE: {
      const {
        messages: prevMessages,
        showMessages: prevShowMessages,
      } = state;
      const { payload } = action;
      const { messages } = payload || {};
      return {
        ...state,
        messages: prevMessages.concat(messages),
        showMessages: prevShowMessages.concat(messages),
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