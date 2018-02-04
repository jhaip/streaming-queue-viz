import moment from 'moment'

var STORE = {
  start: null,
  end: null,
  data: {},
  loading: {
    status: false,
    messageId: null
  }
};
var callback = null;

export function initWebsockets(_callback) {
  // document.addEventListener('DOMContentLoaded', function(){
    console.log("initWebsockets");
    var uri= window.location.host + window.location.pathname + 'ws';
    var new_uri;
    var firstViewMessageId = null;
    callback = _callback;
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
      firstViewMessageId = getLastView()
    };

    ws.onmessage = function(evt){
      // $("#idlogs").append(" New message..." + evt.data + '\n')
      try {
        const message = JSON.parse(evt.data);
        if (message.name === 'DATA_UPDATE') {
          const data = message.params;
          STORE.data[data.source] = (STORE.data[data.source] || []).concat(data);
          callback(Object.assign({}, STORE));
        } else if (message.name === 'GET_DATA_RESULT') {
          console.log("GET_DATA_RESULT");
          console.log(message);
          STORE.data = message.params.reduce((acc, v) => {
            acc[v.source] = (acc[v.source] || []).concat(v);
            return acc;
          }, {});
          if (message.messageId === STORE.loading.messageId) {
            STORE.loading = {status: false, messageId: null};
          }
          callback(Object.assign({}, STORE));
          if (message.messageId === firstViewMessageId) {
            console.log("RECIEVED THE FIRST VIEW!!!")
            console.log("fetching new data now...")
            const data = message.params;
            if (data && data.length > 0) {
              const view = JSON.parse(data[0].value);
              console.log("LAST VIEW DESCRIPTION:");
              console.log(view);
              const sources = view.subviews.reduce((acc, v) => {
                return acc.concat(v.sources)
              }, []).filter((v, i, a) => a.indexOf(v) === i);
              STORE.start = view.start ? moment.utc(view.start).toDate() : null;
              STORE.end = view.end ? moment.utc(view.end).toDate() : null;
              STORE.sources = sources;
              getData({
                start: STORE.start,
                end: STORE.end,
                sources: STORE.sources
              });
              callback(Object.assign({}, STORE));
            } else {
              // no previous view, default to getting everything
              getData();
            }
          }
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
  getData({
    start: view.start ? moment.utc(view.start).toDate() : null,
    end: view.end ? moment.utc(view.end).toDate() : null,
    sources: STORE.sources
  });
}

export function getLastView() {
  const firstViewMessageId = guid()
  ws.send(JSON.stringify({
    name: "GET_DATA",
    messageId: firstViewMessageId,
    params: {
      "source": "view",
      "limit": 1
    }
  }));
  return firstViewMessageId;
}

export function getData(params) {
  if (!window.ws) {
    console.error("websockets is not defined!");
    return;
  }
  const newGuid = guid();
  STORE = Object.assign({}, STORE, {
    loading: {
      status: true,
      messageId: newGuid
    }
  });
  if (callback) callback(STORE);
  ws.send(JSON.stringify({
    name: "GET_DATA",
    messageId: newGuid,
    params: params || {}
  }));
}
window.getData = getData;
