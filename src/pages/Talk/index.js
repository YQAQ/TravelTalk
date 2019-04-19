import React, { Component } from 'react';
import cx from 'classnames';
import { connect } from 'react-redux';
import { Drawer, NavBar, Button, Badge } from 'antd-mobile';
import _ from 'lodash';
import List from 'react-virtualized/dist/commonjs/List';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
import { CellMeasurer, CellMeasurerCache } from 'react-virtualized/dist/commonjs/CellMeasurer';
import { Icon, Message } from '@/components';
import { RECEIVE_NORMAL_MESSAGE, SEND_NORMAL_MESSAGE } from '@/actions/types';
import { scrollYTo } from '@/utils/dom';
import { FEATURES } from './constants';
import './index.scss';

const cache = new CellMeasurerCache({
  fixedWidth: true,
});

class Talk extends Component {
  state = {
    open: false, // Drawer的open属性
    list: [],
    newMessageTipVisible: false,
    scrollToIndex: undefined,
  };

  scrollTop = 0;
  scrollY = 0;

  componentDidMount = () => {
    const { dispatch } = this.props;
    setInterval(() => {
      const type = Math.ceil(Math.random() * 10);
      const data = {
        msg: '你好啊，今天天气不错，不如出去看看啊.',
        type,
      };
      dispatch({
        type: RECEIVE_NORMAL_MESSAGE,
        payload: {
          msg: data,
        },
      });
    }, 3000);
  }

  componentDidUpdate = (prevProps) => {
    const { messages: prevMessages } = prevProps;
    const { messages } = this.props;
    if (prevMessages.length !== messages.length) {
      this.autoScroll();
      // this.setNewMessageTip();
    }
  }

  getListContainer = () => {
    return document.querySelector('.talk__list');
  };

  getListContainerScrollTop = () => {
    const list = this.getListContainer();
    if (!list) {
      return 0;
    } 
    return list.scrollTop;
  }

  getRowHeight = () => {
    return 140;
  }

  /**
   * 当前可视区域离底部的滚动距离不超过一屏时会自动滚到新消息处
   */
  autoScroll = () => {
    setTimeout(() => {
      const listContainer = this.getListContainer();
      const { clientHeight } = listContainer || {};
      const container = document.querySelector('.ReactVirtualized__Grid__innerScrollContainer');
      const height = parseInt(container.style.height, 10);
      const lists = document.querySelectorAll('.talk__list-item');
      const lastList = _.last(lists);
      const lastListTop = parseInt(lastList.style.top, 10);
      if (height - lastListTop < clientHeight) {
        this.scrollToBottom();
      }
    }, 100);
  }

  setNewMessageTip = () => {
    const listContainer = this.getListContainer();
    const { clientHeight, scrollTop, scrollHeight } = listContainer || {};
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
    this.scrollToBottom();
  }

  /**
   * 动态改变列表容器的高度与scrollTop, 模拟向上推的感觉
   */
  updateListContainerStyles = () => {
    const options = document.querySelector('.talk .talk__options');
    const list = document.querySelector('.talk__list');
    if (!options || !list) {
      return;
    }
    try {
      const styles = getComputedStyle(options);
      const transform = styles.transform;
      const height = styles.height.replace('px', '') - 0;
      const transformY = _.last(transform.split(' ')).replace(')', '') - 0 || 0;
      const offset = height - transformY;
      list.style.height = `calc(100% - ${offset}px)`;
      list.scrollTop = this.scrollTop + offset;
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
    // setTimeout(() => {
    //   const listContainer = this.getListContainer();
    //   const bottomElement = listContainer && listContainer.querySelector('.talk__list-placeholer');
    //   scrollYTo(listContainer, bottomElement, { behavior: 'smooth' });
    // }, 300);
    setTimeout(() => {
      const { messages } = this.props;
      const length = messages.length;
      this.setState({
        scrollToIndex: length - 1,
      });
    }, 200);
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
    // const currentScrollTop = e.target.scrollTop;
    // const offset = currentScrollTop - this.scrollY;
    // this.scrollY = currentScrollTop;
    // const direction = offset > 0 ? 1 : -1;
  }

  sendMessage = () => {
    const { dispatch } = this.props;
    dispatch({
      type: SEND_NORMAL_MESSAGE,
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

  renderMessageRow = ({ index, key, parent, style }) => {
    const { messages } = this.props;
    const message = messages[index];
    return (
      <CellMeasurer
        cache={cache}
        columnIndex={0}
        key={key}
        parent={parent}
        rowIndex={index}
      >
        <Message
          className="talk__list-item"
          style={style}
          data={message}
        />
      </CellMeasurer>
    );
  }

  render() {
    const { optionsCardVisible, messages } = this.props;
    const { open, newMessageTipVisible, scrollToIndex } = this.state;
    const rowCount = messages.length;
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
              <AutoSizer>
                {({ width, height }) => {
                  return (
                    <List
                      height={height}
                      rowCount={rowCount}
                      rowHeight={cache.rowHeight}
                      deferredMeasurementCache={cache}
                      rowRenderer={this.renderMessageRow}
                      width={width}
                      scrollToIndex={scrollToIndex}
                    />
                  );
                }}
              </AutoSizer>
              {/* <div className="talk__list-inner">
                <List
                  height={300}
                  rowCount={rowCount}
                  rowHeight={this.getRowHeight}
                  rowRenderer={this.renderMessageRow}
                  width={window.innerWidth}
                />
              </div> */}
              {/* 占位元素, 方便滚动到底部 */}
              <div className="talk__list-placeholer" />
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
  const { messages = [], optionsCardVisible } = talk || {};
  return {
    messages,
    optionsCardVisible,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Talk);