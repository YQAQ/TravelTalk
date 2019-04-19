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
  };

  scrollTop = 0;
  scrollY = 0;
  restHeight = null;

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
    // }, 5000);
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
      listContainer.style.height = `calc(100% - ${offset}px)`;
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
  }

  handleListSrcoll = (e) => {
    if (this.animating) {
      return;
    }
    const scrollTop = e.target.scrollTop;
    if (scrollTop === 0) {
      this.handleLoadMore();
    }
    const offset = scrollTop - this.scrollY;
    this.scrollY = scrollTop;
    // 滚动方向
    const direction = offset > 0 ? 1 : -1;
  }

  /**
   * 加载更多
   */
  handleLoadMore = () => {
    if (this.state.loadingMoreLoading) {
      return false;
    }
    this.setState({
      loadingMoreLoading: true,
    });
    setTimeout(() => {
      this.restHeight = this.getRestHeight();
      const { dispatch } = this.props;
      dispatch({
        type: LOAD_MORE_MESSAGE,
      });
      this.setState({
        loadingMoreLoading: false,
      });
    }, 500);
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
    const { optionsCardVisible, messages } = this.props;
    const { open, newMessageTipVisible, loadingMoreLoading } = this.state;
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
          列表消息数{messages.length}
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
                'talk__options--show': optionsCardVisible,
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