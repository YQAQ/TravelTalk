import React, { PureComponent } from 'react';
import { Ring, Line, Rolling } from './shape';
import omit from '../utils/omit';

const getShapeComponent = (type) => {
  const typeMap = {
    ring: Ring,
    line: Line,
    rolling: Rolling,
  };
  return typeMap[type];
};

class Loading extends PureComponent {
  static defaultProps = {
    prefixCls: 'mui-loading',
    size: 'large',
    type: 'ring',
    color: '#ccc',
  };

  renderDotLoading = () => {
    const { prefixCls } = this.props;
    return (
      <div className={`${prefixCls}-dot`}>
        <div className={`${prefixCls}-dot-item`} />
        <div className={`${prefixCls}-dot-item`} />
        <div className={`${prefixCls}-dot-item`} />
      </div>
    );
  }

  renderRectLoading = () => {
    const { prefixCls, loadingText } = this.props;
    return (
      <div className={`${prefixCls}-rect`}>
        <div
          className="breeding-rhombus-spinner"
        >
          <div className="rhombus child-1" />
          <div className="rhombus child-2" />
          <div className="rhombus child-3" />
          <div className="rhombus child-4" />
          <div className="rhombus child-5" />
          <div className="rhombus child-6" />
          <div className="rhombus child-7" />
          <div className="rhombus child-8" />
          <div className="rhombus big" />
        </div>
        {loadingText ? (
          <div className={`${prefixCls}-react-text`}>{loadingText}</div>
        ) : null}
      </div>
    );
  }

  renderLoading = () => {
    const { type } = this.props;
    const ShapeComponent = getShapeComponent(type);
    const otherProps = omit(this.props, [
      'type',
      'prefixCls',
    ]);
    return React.createElement(ShapeComponent, {
      ...otherProps,
    });
  }

  render() {
    const { type } = this.props;
    if (type === 'dot') {
      return this.renderDotLoading();
    } else if (type === 'rect') {
      return this.renderRectLoading();
    }
    return (
      this.renderLoading()
    );
  }
}

export default Loading;
