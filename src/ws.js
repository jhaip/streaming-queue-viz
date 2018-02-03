export function initWebsockets(callback) {
  // document.addEventListener('DOMContentLoaded', function(){
    console.log("initWebsockets");
    var uri= window.location.host + window.location.pathname + 'ws';
    var new_uri;
    var STORE = {};
    if (window.location.protocol === 'http:') {
        new_uri = "ws:"+uri;
     } else {
        new_uri = "wss:"+uri;
    }

    var ws;
    if ('WebSocket' in window) {
     ws = new WebSocket(new_uri);
    }
    // else if ('MozWebSocket' in window) {
    //   ws = new MozWebSocket(new_uri);
    // }
    else {
      alert("<tr><td> your browser doesn't support web socket </td></tr>");
      return;
    }

    ws.onopen = function(evt) {
      console.log("Connection open ...\n")
    };

    ws.onmessage = function(evt){
      // $("#idlogs").append(" New message..." + evt.data + '\n')
      try {
        const message = JSON.parse(evt.data);
        if (message.name === 'DATA_UPDATE') {
          const data = message.params;
          STORE[data.source] = (STORE[data.source] || []).concat(data);
          callback(Object.assign({}, STORE));
        } else if (message.name === 'GET_DATA_RESULT') {
          console.log("GET_DATA_RESULT");
          console.log(message);
          STORE = message.params.reduce((acc, v) => {
            acc[v.source] = (acc[v.source] || []).concat(v);
            return acc;
          }, {});
          callback(STORE);
        }
      } catch(error) {
        console.error(error);
      }
    };

    function closeConnect(){
        ws.close();
    }

    window.ws = ws;
  // }, false);
}

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}

export function saveView(view) {
  ws.send(JSON.stringify({
    name: "SAVE_DATA",
    messageId: guid(),
    params: view
  }));
}

export function websocketFunctionCall() {
  if (!window.ws) {
    console.error("websockets is not defined!");
    return;
  }
  ws.send(JSON.stringify({
    name: "GET_DATA",
    messageId: guid(),
    params: {}
  }));
}
window.websocketFunctionCall = websocketFunctionCall;
