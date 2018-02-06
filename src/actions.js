import moment from 'moment'

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}

export const GET_LAST_VIEW = 'GET_DATA';
export function getLastView() {
  const firstViewMessageId = guid();
  window.ws.send(JSON.stringify({
    name: "GET_DATA",
    messageId: firstViewMessageId,
    params: {
      "source": "view",
      "limit": 1
    }
  }));
  return {
    type: GET_LAST_VIEW,
    firstViewMessageId
  }
}

export const SAVE_DATA = 'SAVE_DATA';
export function saveData(data) {
  window.ws.send(JSON.stringify({
    name: "SAVE_DATA",
    messageId: guid(),
    params: data
  }));
  return {
    type: SAVE_DATA,
    data
  }
}

export const GET_DATA = 'GET_DATA';
export function getData(params) {
  const newGuid = guid();
  window.ws.send(JSON.stringify({
    name: "GET_DATA",
    messageId: newGuid,
    params: params || {}
  }));
  return {
    type: GET_DATA,
    params
  }
}

export const SAVE_VIEW = 'SAVE_VIEW';
export function saveView(view) {
  return (dispatch, getState) => {
    dispatch(saveData(view));
    if (
      getState().start !== view.start ||
      getState().end !== view.end
    ) {
      getState().sources.filter(s => s !== "code").forEach(source => {
        dispatch(getData({
          start: view.start ? moment.utc(view.start).toDate() : null,
          end: view.end ? moment.utc(view.end).toDate() : null,
          source: source
        }));
      });
    }
  }
}

export const RECEIVE_DATA = 'RECEIVE_DATA';
function receiveData(message) {
  return {
    type: RECEIVE_DATA,
    message
  }
}

export const RECEIVE_LAST_VIEW = 'RECEIVE_LAST_VIEW';
function receiveLastView(view) {
  return {
    type: RECEIVE_LAST_VIEW,
    view
  }
}

export const DATA_UPDATE = 'DATA_UPDATE';
function dataUpdate(message) {
  return {
    type: DATA_UPDATE,
    message
  }
}

export function receiveWebsocketMessage(message) {
  return (dispatch, getState) => {
    if (message.name === 'DATA_UPDATE') {
      dispatch(dataUpdate(message));
    } else if (message.name === 'GET_DATA_RESULT') {
      dispatch(receiveData(message));
      if (message.messageId === getState().firstViewMessageId) {
        console.log("RECIEVED THE FIRST VIEW!!!")
        console.log("fetching new data now...")
        const data = message.params.results;
        if (data && data.length > 0) {
          const view = JSON.parse(data[0].value);
          console.log("LAST VIEW DESCRIPTION:");
          console.log(view);
          dispatch(receiveLastView(view));
          dispatch(getData({"source": "code"}));
          getState().sources.filter(s => s !== "code").forEach(source => {
            dispatch(getData({
              start: getState().start,
              end: getState().end,
              source: source
            }));
          });
        } else {
          // no previous view, default to getting everything
          dispatch(getData());
        }
      }
    }
  }
}
