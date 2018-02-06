import 'babel-polyfill';
import { Promise } from 'es6-promise';
window.Promise = Promise;

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import configureStore from './configureStore'
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { initWebsockets } from './ws';

const store = configureStore();

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)

// function mainRender(store) {
//   store = store || {};
//   console.log(store);
//   ReactDOM.render(
//     <App list={store.data} start={store.start} end={store.end} loading={store.loading} />,
//     document.getElementById('root')
//   );
// }
// mainRender();
initWebsockets(store);
registerServiceWorker();
