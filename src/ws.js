import moment from 'moment'
import {
  getLastView,
  receiveWebsocketMessage
} from './actions'

export function initWebsockets(store) {
  console.log("initWebsockets");
  var uri= window.location.host + window.location.pathname + 'ws';
  var new_uri;
  if (window.location.protocol === 'http:') {
      new_uri = "ws:"+uri;
   } else {
      new_uri = "wss:"+uri;
  }

  var ws;
  if ('WebSocket' in window) {
   ws = new WebSocket(new_uri);
  }
  else if ('MozWebSocket' in window) {
    ws = new MozWebSocket(new_uri);
  }
  else {
    alert("<tr><td> your browser doesn't support web socket </td></tr>");
    return;
  }

  ws.onopen = function(evt) {
    console.log("Connection open ...\n")
    // firstViewMessageId = getLastView()
    store.dispatch(getLastView());
  };

  ws.onmessage = function(evt){
    try {
      const message = JSON.parse(evt.data);
      store.dispatch(receiveWebsocketMessage(message));
    } catch(error) {
      console.error(error);
    }
  };

  function closeConnect(){
      ws.close();
  }

  window.ws = ws;
}
