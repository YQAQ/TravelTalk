/**
 * 消息渲染组件, 根据消息的类型渲染不同消息类型
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import mioji_avatar from '@/assets/images/avatar/mioji_avatar.png';
import user_avatar from '@/assets/images/avatar/user_avatar.png';
import './index.scss';

export default class Message extends Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
  };

  static defaultProps = {
    prefix: 'mui-message',
  };

  render() {
    const { prefix, className, data } = this.props;
    const { msg, type } = data;
    const isServiceMessage = type < 8;
    const avatar = isServiceMessage ? mioji_avatar : user_avatar;
    const classes = cx(prefix, className, {
      [`${prefix}-service`]: isServiceMessage,
      [`${prefix}-user`]: !isServiceMessage,
    });
    return (
      <div className={classes}>
        <div
          className={`${prefix}__avatar`}
          style={{ backgroundColor: isServiceMessage ? '#5581fa' : '#ff94b4' }}
        >
          <img src={avatar} alt=""/>
        </div>
        <div className={`${prefix}__container`}>
          <div className={`${prefix}__name`}>
            {isServiceMessage ? '妙小喵' : '高级用户'}{type}
          </div>
          <div className={`${prefix}__content`}>{msg}</div>
        </div>
      </div>
    );
  }
}