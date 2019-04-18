import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Drawer, NavBar } from 'antd-mobile';
import { Icon } from '@/components';
import './index.scss';

class Talk extends Component {
  state = {
    open: false,
  };

  handleOpenChange = () => {
    this.setState({
      open: !this.state.open,
    });
  }

  renderSideBar = () => {
    return (
      <div className="talk__sidebar">
        side bar
      </div>
    );
  };

  render() {
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
          内容
        </Drawer>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {};
};

export default connect(mapStateToProps)(Talk);