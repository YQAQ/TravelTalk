import React, { Component } from 'react';
import cx from 'classnames';
import { connect } from 'react-redux';
import { Drawer, NavBar, Button, Badge, Icon as AntIcon } from 'antd-mobile';
import _ from 'lodash';
import shortid from 'shortid';
import { Icon, Message } from '@/components';
import {
  RECEIVE_NORMAL_MESSAGE,
  SEND_NORMAL_MESSAGE,
  LOAD_MORE_MESSAGE,
  SET_SHOW_MESSAGES,
} from '@/actions/types';
import { scrollYTo } from '@/utils/dom';
import { FEATURES } from './constants';
import './index.scss';

class Talk extends Component {
  state = {
    open: false, // Drawer的open属性
    list: [],
    newMessageTipVisible: false,
    loadingMoreLoading: false,
    tempOptiosCardVisible: true,
  };

  scrollTop = 0;
  scrollY = 0;
  restHeight = null;
  isLoadingMore = false;
  isReseting = false;
  tempOptiosCardVisibleChanging = false;
  startY = null;
  offsetY = null;

  componentDidMount = () => {
    // const { dispatch } = this.props;
    // setInterval(() => {
    //   const type = Math.ceil(Math.random() * 10);
    //   const data = {
    //     msg: '你好啊，今天天气不错，不如出去看看啊.',
    //     type,
    //     key: shortid.generate(),
    //   };
    //   dispatch({
    //     type: RECEIVE_NORMAL_MESSAGE,
    //     payload: {
    //       msg: data,
    //     },
    //   });
    // }, 3000);
    // this.bindEvent();
  }

  componentDidUpdate = (prevProps) => {
    const { messages: prevMessages } = prevProps;
    const { messages } = this.props;
    if (prevMessages.length !== messages.length) {
      this.autoScroll();
      // this.setNewMessageTip();
    }
    // 上拉加载更多时保持页面位置没有视觉上的变化
    this.restorePosition();
  }

  bindEvent = () => {
    document.addEventListener('touchstart', this.handleTouchStart);
    document.addEventListener('touchmove', this.handleTouchMove);
    document.addEventListener('touchend', this.handleTouchEnd);
  }

  getListContainer = () => {
    return document.querySelector('.talk__list');
  };

  getListContainerScrollTop = () => {
    const listContainer = this.getListContainer();
    if (!listContainer) {
      return 0;
    } 
    return listContainer.scrollTop;
  }

  /**
   * 当前可视区域离底部的滚动距离不超过10px时会自动滚到新消息处
   */
  autoScroll = () => {
    const listContainer = this.getListContainer();
    const listItems = listContainer.querySelectorAll('.talk__list-item');
    const lastListItem = _.last(listItems);
    const lastItemHeight = lastListItem.clientHeight;
    const { clientHeight, scrollTop, scrollHeight } = listContainer;
    if (scrollHeight - clientHeight - scrollTop - lastItemHeight <= 10) {
      this.scrollToBottom();
    }
  }

  setNewMessageTip = () => {
    const listContainer = this.getListContainer();
    const { clientHeight, scrollTop, scrollHeight } = listContainer;
    if (scrollHeight - clientHeight - scrollTop > 30) {
      this.setState({
        newMessageTipVisible: true,
      });
    }
  }

  handleOpenChange = () => {
    this.setState({
      open: !this.state.open,
    });
  }

  /**
   * 动态改变列表容器的高度与scrollTop, 模拟向上推的感觉
   */
  updateListContainerStyles = () => {
    const options = document.querySelector('.talk .talk__options');
    const listContainer = this.getListContainer();
    if (!options || !listContainer) {
      return;
    }
    try {
      const styles = getComputedStyle(options);
      const transform = styles.transform;
      const height = styles.height.replace('px', '') - 0;
      const transformY = _.last(transform.split(' ')).replace(')', '') - 0 || 0;
      const offset = height - transformY;
      // listContainer.style.height = `calc(100% - ${offset}px)`;
      listContainer.style.marginBottom = `${offset}px`;
      listContainer.scrollTop = this.scrollTop + offset;
    } catch (error) {
      console.log(error);
    }
  }

  startUpdateListContainerStyles = () => {
    this.stopUpdateListContainerStyles();
    this.timer = setInterval(() => {
      this.updateListContainerStyles();
    }, 0);
  }

  stopUpdateListContainerStyles = () => {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  scrollToBottom = () => {
    setTimeout(() => {
      const listContainer = this.getListContainer();
      const bottomElement = listContainer && listContainer.querySelector('.talk__list-placeholer');
      scrollYTo(listContainer, bottomElement, { behavior: 'smooth' });
    }, 300);
  }

  scrollToNewMessage = () => {
    this.scrollToBottom();
    this.setState({
      newMessageTipVisible: false,
    });
  }

  handleAnimationStart = () => {
    const scrollTop = this.getListContainerScrollTop();
    this.scrollTop = scrollTop;
    this.animating = true;
    this.startUpdateListContainerStyles();
  }

  handleAnimationEnd = () => {
    this.animating = false;
    this.stopUpdateListContainerStyles();
    this.tempOptiosCardVisibleChanging = false;
  }

  handleListSrcoll = (e) => {
    if (this.animating) {
      return;
    }
    const { scrollTop, clientHeight, scrollHeight } = e.target || {};
    if (scrollTop === 0) {
      // 滚动到顶部加载更多
      this.handleLoadMore();
    } else if (scrollHeight === scrollTop + clientHeight) {
      // 滚动到底部重置用于显示的消息
      this.handleResetShowMessages();
    }
    const offset = scrollTop - this.scrollY;
    this.scrollY = scrollTop;
    // 滚动方向
    const direction = offset > 0 ? 1 : -1;
  }

  handleTempOptionsCardVisible = (direction) => {
    const { optionsCardVisible } = this.props;
    if (!optionsCardVisible || this.isLoadingMore || this.isReseting) {
      return false;
    }
    const tempOptiosCardVisible = direction > 0;
    if (tempOptiosCardVisible !== this.state.tempOptiosCardVisible) {
      this.tempOptiosCardVisibleChanging = true;
      this.setState({
        tempOptiosCardVisible,
      });
    }
  };

  handleResetShowMessages = () => {
    const { messages } = this.props;
    if (this.isReseting || messages.length <= 20) {
      return false;
    }
    clearTimeout(this.resetTimer);
    this.isReseting = true;
    this.resetTimer = setTimeout(() => {
      this.props.dispatch({
        type: SET_SHOW_MESSAGES,
      });
      this.isReseting = false;
    }, 500);
  }

  /**
   * 加载更多
   */
  handleLoadMore = () => {
    if (this.isLoadingMore) {
      return false;
    }
    this.isLoadingMore = true;
    this.setState({
      loadingMoreLoading: true,
    });
    clearTimeout(this.loadTimer);
    this.loadTimer = setTimeout(() => {
      this.restHeight = this.getRestHeight();
      const { dispatch } = this.props;
      dispatch({
        type: LOAD_MORE_MESSAGE,
      });
      this.setState({
        loadingMoreLoading: false,
      });
      this.isLoadingMore = false;
    }, 300);
  }

  /**
   * 获取可滚动区域底部据页面可视区域底部的高度
   */
  getRestHeight = () => {
    const listContainer = this.getListContainer();
    const { scrollHeight, clientHeight, scrollTop } = listContainer || {};
    return scrollHeight - scrollTop - clientHeight;
  }

  /**
   * 根据上拉加载更多时记录的高度还原页面位置
   */
  restorePosition = () => {
    if (!this.restHeight) {
      return false;
    }
    const listContainer = this.getListContainer();
    const { clientHeight, scrollHeight } = listContainer || {};
    const scrollTop = scrollHeight - this.restHeight - clientHeight;
    this.restHeight = null;
    listContainer.scrollTop = scrollTop;
  }

  handleTouchStart = (e) => {
    const target = e.touches[0];
    this.startY = target.pageY;
  }

  handleTouchMove = (e) => {
    const target = e.touches[0];
    this.offsetY = target.pageY - this.startY;
  }

  handleTouchEnd = () => {
    const direction = this.offsetY < 0 ? 1 : -1;
    this.handleTempOptionsCardVisible(direction);
  }

  sendMessage = () => {
    const { dispatch } = this.props;
    dispatch({
      type: SEND_NORMAL_MESSAGE,
      payload: {
        msg: {
          type: 9,
          msg: '好的 好的 我收到了 已确认',
          key: shortid.generate(),
        },
      },
    });
    this.scrollToBottom();
  }

  renderSideBar = () => {
    return (
      <div className="talk__sidebar">
        side bar
      </div>
    );
  };

  render() {
    const { optionsCardVisible, messages, allMessages } = this.props;
    const { open, newMessageTipVisible, loadingMoreLoading, tempOptiosCardVisible } = this.state;
    const sidebar = this.renderSideBar();
    return (
      <div className="talk">
        <NavBar
          mode="light"
          icon={(
            <Icon
              type="icon_sequence"
              size={20}
              color="#272c33"
              onClick={this.handleOpenChange}
            />
          )}
        >
          展示/总消息 : {messages.length}/{allMessages.length}
        </NavBar>
        <Drawer
          className="talk__drawer"
          sidebar={sidebar}
          open={open}
          onOpenChange={this.handleOpenChange}
        >
          <div className="talk__content">
            <div
              className="talk__list"
              onScroll={this.handleListSrcoll}
              // onTouchStart={this.handleTouchStart}
              // onTouchMove={this.handleTouchMove}
              // onTouchEnd={this.handleTouchEnd}
            >
              <div className="talk__list-load-more-loading">
                {loadingMoreLoading ? (
                  <React.Fragment>
                    <AntIcon type="loading" color="red" size="xs" />
                    <span>加载中...</span>
                  </React.Fragment>
                ) : null}
              </div>
              <div className="talk__list-inner">
                {messages.map((message) => {
                  return (
                    <Message
                      className="talk__list-item"
                      key={message.key}
                      data={message}
                    />
                  );
                })}
                {/* 占位元素, 方便滚动到底部 */}
                <div className="talk__list-placeholer" />
              </div>
            </div>
            <div
              className={cx('talk__options', {
                'talk__options--show': optionsCardVisible && tempOptiosCardVisible,
              })}
              onAnimationStart={this.handleAnimationStart}
              onAnimationEnd={this.handleAnimationEnd}
            >
              <div className="talk__options-content">
                <div className="dynamic-options">
                  {FEATURES.map((feature) => {
                    return (
                      <Button
                        className="dynamic-options__item"
                        key={feature}
                        onClick={this.sendMessage}
                      >
                        {feature}
                      </Button>
                    );
                  })}
                </div>
                <div className="fixed-options">
                  <Button>购物车</Button>
                  <Button>更多功能</Button>
                </div>
              </div>
              {newMessageTipVisible ? (
                <Badge
                  className="talk__new-message-tip"
                  text="新消息"
                  onClick={this.scrollToNewMessage}
                />
              ) : null}
            </div>
          </div>
        </Drawer>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { talk } = state;
  const {
    showMessages = [],
    optionsCardVisible,
    messages: allMessages,
  } = talk || {};
  return {
    allMessages,
    messages: showMessages,
    optionsCardVisible,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Talk);