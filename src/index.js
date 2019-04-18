import React from 'react';
import ReactDOM from 'react-dom';
import { Switch, BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { renderRouter, routesMap } from './router';
import configureStore from './store';
import history from './history';
import * as serviceWorker from './serviceWorker';
import './iconfont/iconfont.css';
import './style/antd.scss';

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
