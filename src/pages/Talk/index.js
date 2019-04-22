import React, { Component } from 'react';
import cx from 'classnames';
import { connect } from 'react-redux';
import { Drawer, NavBar, Button, Badge, Icon as AntIcon } from 'antd-mobile';
import _ from 'lodash';
import { Icon, Message, Loading } from '@/components';
import * as apis from '@/actions/api';
import * as talkActions from '@/actions/talk';
import { FEATURES } from './constants';
import {
  getListContainer,
  getListContainerInfo,
  asyncSrcollToBottom,
  autoScrollToBottom,
  getScrollRestHeight,
} from './utils';
import './index.scss';

const { FullPageLoading } = Loading;

class Talk extends Component {
  state = {
    open: false, // Drawer的open属性
    list: [],
    newMessageTipVisible: false,
    loadingMoreLoading: false,
    tempOptiosCardVisible: true,
    loading: true,
  };

  scrollTop = 0;
  scrollRestHeight = null;
  isLoadingMore = false;
  isReseting = false;
  tempOptiosCardVisibleChanging = false;
  startY = null;
  offsetY = null;

  componentDidMount = () => {
    this.initTalkList();
  }

  componentDidUpdate = (prevProps) => {
    const { messages: prevMessages } = prevProps;
    const { messages } = this.props;
    if (this.checkHasNewMessage(prevMessages, messages)) {
      autoScrollToBottom();
    }
    // 上拉加载更多时保持页面位置没有视觉上的变化
    this.restorePosition();
  }

  /**
   * 初始化聊天消息
   */
  initTalkList = () => {
    const { getMessages } = this.props;
    getMessages({
      stat_id: '0000_0',
      store: {},
    })
      .then(() => {
        asyncSrcollToBottom(1000, 'instant')
          .then(() => {
            this.setState({
              loading: false,
            });
          });
      })
      .catch(() => {
        this.setState({
          loading: false,
        });
      });
  }

  /**
   * 判断是否有新消息
   */
  checkHasNewMessage = (prevMessages, currentMessages) => {
    const { loading } = this.state;
    // 列表初始化的时候不考虑
    if (loading || !currentMessages || !currentMessages.length) {
      return false;
    }
    const lastPrevMessage = _.last(prevMessages) || {};
    const lastCurrentMessage = _.last(currentMessages) || {};
    // 当前最后一条消息的key不等于上次最后一条消息的key
    if (lastPrevMessage.key !== lastCurrentMessage.key) {
      return true;
    }
    return false;
  }

  setNewMessageTip = () => {
    const listContainer = getListContainer();
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
    const listContainer = getListContainer();
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

  scrollToNewMessage = () => {
    asyncSrcollToBottom();
    this.setState({
      newMessageTipVisible: false,
    });
  }

  handleAnimationStart = () => {
    const { scrollTop } = getListContainerInfo();
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
    // 由底部操作区域引起的滚动不考虑
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
    const { messages, resetShowMessages } = this.props;
    if (this.isReseting || messages.length <= 20) {
      return false;
    }
    clearTimeout(this.resetTimer);
    this.isReseting = true;
    this.resetTimer = setTimeout(() => {
      resetShowMessages();
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
      this.scrollRestHeight = getScrollRestHeight();
      const { loadMoreMessages } = this.props;
      loadMoreMessages();
      this.setState({
        loadingMoreLoading: false,
      });
      this.isLoadingMore = false;
    }, 300);
  }

  /**
   * 根据上拉加载更多时记录的高度还原页面位置
   */
  restorePosition = () => {
    if (!this.scrollRestHeight) {
      return false;
    }
    const listContainer = getListContainer();
    const { clientHeight, scrollHeight } = listContainer || {};
    const scrollTop = scrollHeight - this.scrollRestHeight - clientHeight;
    this.scrollRestHeight = null;
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
    const {
      open,
      newMessageTipVisible,
      loadingMoreLoading,
      tempOptiosCardVisible,
      loading,
    } = this.state;
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
        {loading ? (
          <FullPageLoading />
        ) : null}
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

export default connect(mapStateToProps, {
  ...apis,
  ...talkActions,
})(Talk);