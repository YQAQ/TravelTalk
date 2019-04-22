import _ from 'lodash';
import { scrollYTo } from '@/utils/dom';

const listContainerClassName = 'talk__list';
const listItemClassName = `${listContainerClassName}-item`;
const bottomPlaceholderClassName = 'talk__list-placeholer';
let scrollToBottomTimer = null;

/**
 * 获取消息列表容器dom
 */
export const getListContainer = () => {
  return document.querySelector(`.${listContainerClassName}`);
};

/**
 * 获取消息列表一些高度位置上的参数
 */
export const getListContainerInfo = () => {
  const listContainer = getListContainer();
  const {
    scrollTop,
    clientHeight,
    scrollHeight,
  } = listContainer || {};
  return {
    scrollTop,
    clientHeight,
    scrollHeight,
  };
};

/**
 * 滚动到聊天消息底部
 * 在聊天消息最底部增加一个不渲染任何东西的占位内容, 直接滚动到该内容即可
 */
export const scrollToBottom = (behavior) => {
  const listContainer = getListContainer();
  const bottomPlaceholderElement = listContainer && listContainer.querySelector(`.${bottomPlaceholderClassName}`);
  scrollYTo(listContainer, bottomPlaceholderElement, {
    behavior: behavior || 'smooth',
  });
};

/**
 * 异步滚动到聊天消息底部
 */
export const asyncSrcollToBottom = (time = 300, behavior) => {
  clearTimeout(scrollToBottomTimer);
  return new Promise((resolve) => {
    scrollToBottomTimer = setTimeout(() => {
      scrollToBottom(behavior);
      resolve();
    }, time);
  });
};

/**
 * 收到新消息后判断当前可视区域离底部的滚动距离, 不超过10px时自动滚动到新消息处
 * 判断的时候要考虑新消息的高度对滚动位置的影响
 */
export const autoScrollToBottom = () => {
  const listContainer = getListContainer();
  const listItems = listContainer.querySelectorAll(`.${listItemClassName}`);
  const lastListItem = _.last(listItems);
  const lastItemHeight = lastListItem.clientHeight;
  const { clientHeight, scrollTop, scrollHeight } = getListContainerInfo();
  if (scrollHeight - clientHeight - scrollTop - lastItemHeight <= 10) {
    asyncSrcollToBottom();
  }
};

/**
 * 获取滚动区域底部据页面可视区域底部的高度
 */
export const getScrollRestHeight = () => {
  const { scrollHeight, clientHeight, scrollTop } = getListContainerInfo();
  return scrollHeight - scrollTop - clientHeight;
};