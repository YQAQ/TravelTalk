import React, { Component } from 'react';
import cx from 'classnames';
import { connect } from 'react-redux';
import { Drawer, NavBar } from 'antd-mobile';
import _ from 'lodash';
import { Icon } from '@/components';
import { RECEIVE_NORMAL_MESSAGE, SEND_NORMAL_MESSAGE } from '@/actions/types';
import { scrollYTo } from '@/utils/dom';
import './index.scss';

class Talk extends Component {
  state = {
    open: false, // Drawer的open属性
    list: [],
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
    }, 1000);
  }

  componentDidUpdate = (prevProps) => {
    const { messages: prevMessages } = prevProps;
    const { messages } = this.props;
    if (prevMessages.length !== messages.length) {
      console.log('有新消息');
    }
  }

  getListContainer = () => {
    return document.querySelector('.talk__list');
  };

  getListContainerScrollTop = () => {
    const list = document.querySelector('.talk__list');
    if (!list) {
      return 0;
    } 
    return list.scrollTop;
  }

  handleOpenChange = () => {
    this.setState({
      open: !this.state.open,
    });
  }

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

  scrollToNewMessage = () => {
    const listContainer = this.getListContainer();
    listContainer.scrollTop = 10000000;
    const list = document.querySelectorAll('.talk__list-item');
    const newMessage = _.last(list);
    setTimeout(() => {
      scrollYTo(listContainer, newMessage, { behavior: 'smooth' });
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

  renderSideBar = () => {
    return (
      <div className="talk__sidebar">
        side bar
      </div>
    );
  };

  render() {
    const { optionsCardVisible, messages } = this.props;
    const { open } = this.state;
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
          正在输入...
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
              <div className="talk__list-inner">
                {messages.map(({ msg, type }, index) => {
                  return (
                    <div className="talk__list-item" key={index}>
                      <span>{type}{msg}</span>
                    </div>
                  );
                })}
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
                <p>选项1</p>
                <p>选项1</p>
                <p>选项1</p>
                <p>选项1</p>
                <p>选项1</p>
                <p>选项1</p>
                <p>选项1</p>
              </div>
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