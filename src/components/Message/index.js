/**
 * 消息渲染组件, 根据消息的类型渲染不同消息类型
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import cx from 'classnames';
import mioji_avatar from '@/assets/images/avatar/mioji_avatar.png';
import user_avatar from '@/assets/images/avatar/user_avatar.png';
import Text from './Text';
import Control from './Control';
import './index.scss';

const componentMaps = {
  text: Text,
  control: Control,
};

export default class Message extends Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
  };

  static defaultProps = {
    prefix: 'mui-message',
  };

  sholdComponentUpdate = (nextProps) => {
    return !_.isEqual(this.props, nextProps);
  }

  render() {
    const { prefix, className, data } = this.props;
    const { type, from } = data;
    const isServiceMessage = from === 'service';
    const avatar = isServiceMessage ? mioji_avatar : user_avatar;
    const classes = cx(prefix, className, {
      [`${prefix}-service`]: isServiceMessage,
      [`${prefix}-user`]: !isServiceMessage,
    });
    const messageShowComponent = componentMaps[type];
    if (!messageShowComponent) {
      return null;
    }
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
            {isServiceMessage ? '妙小喵' : '高级用户'}
          </div>
          <div className={`${prefix}__content`}>
            {React.createElement(messageShowComponent, {
              className: `${prefix}__${type}`,
              ...data,
            })}
          </div>
        </div>
      </div>
    );
  }
}