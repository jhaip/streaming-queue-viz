import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import initWebsockets from './ws';

function mainRender(list) {
  ReactDOM.render(<App list={list} />, document.getElementById('root'));
}
mainRender();
initWebsockets(mainRender);
registerServiceWorker();
