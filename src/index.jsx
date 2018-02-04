import 'babel-polyfill';
import { Promise } from 'es6-promise';
window.Promise = Promise;

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { initWebsockets } from './ws';


function mainRender(store) {
  store = store || {};
  ReactDOM.render(
    <App list={store.data} start={store.start} end={store.end} />,
    document.getElementById('root')
  );
}
mainRender();
initWebsockets(mainRender);
registerServiceWorker();
