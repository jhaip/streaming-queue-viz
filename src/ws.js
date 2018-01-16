export default function initWebsockets(callback) {
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
        const data = JSON.parse(evt.data);
        STORE[data.source] = (STORE[data.source] || []).concat(data);
        callback(Object.assign({}, STORE));
      } catch(error) {
        console.error(error);
      }
    };

    function closeConnect(){
        ws.close();
    }
  // }, false);
}
