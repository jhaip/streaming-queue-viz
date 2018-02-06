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
function getLastView() {
  const firstViewMessageId = guid();
  ws.send(JSON.stringify({
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
function saveData(data) {
  ws.send(JSON.stringify({
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
function getData(params) {
  ws.send(JSON.stringify({
    name: "GET_DATA",
    messageId: newGuid,
    params: params || {}
  }));
  return {
    type: REQUEST_DATA,
    params
  }
}

export const SAVE_VIEW = 'SAVE_VIEW';
function saveView(view) {
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
function receiveData(params) {
  return {
    type: RECEIVE_DATA,
    message
  }
}

export const RECEIVE_LAST_VIEW = 'RECEIVE_LAST_VIEW';
function receiveLastView(params) {
  return {
    type: RECEIVE_LAST_VIEW,
    message
  }
}

export const DATA_UPDATE = 'DATA_UPDATE';
function dataUpdate(params) {
  return {
    type: DATA_UPDATE,
    message
  }
}
