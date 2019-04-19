import React from 'react';
import ReactDOM from 'react-dom';
import { Switch, BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import smoothscroll from 'smoothscroll-polyfill';
import { renderRouter, routesMap } from './router';
import configureStore from './store';
import history from './history';
import * as serviceWorker from './serviceWorker';
import './iconfont/iconfont.css';
import './style/antd.scss';

// 移动端scrollTo方法中behavior属性的值为smoothscroll兼容性不好, 需使用此polyfill
smoothscroll.polyfill();

const store = configureStore({});

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <BrowserRouter>
        <Switch>
          {renderRouter(routesMap)}
        </Switch>
      </BrowserRouter>
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
