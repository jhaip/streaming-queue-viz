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

export const RECEIVE_VIEW_UPDATE = 'RECEIVE_VIEW_UPDATE';
function receiveViewUpdate(view) {
  console.log("receiveViewUpdate");
  return {
    type: RECEIVE_VIEW_UPDATE,
    view
  }
}

export function updateViewTime(start, end) {
  return (dispatch, getState) => {
    const state = getState();
    if (
      state.view.start !== start ||
      state.view.end !== end
    ) {
      const view = {
        start: start ? moment.utc(start).toDate() : null,
        end: end ? moment.utc(end).toDate() : null,
        subviews: state.view.subviews
      }
      console.log("updateViewTime");
      console.log(start);
      console.log(end);
      console.log(view);
      dispatch(receiveViewUpdate(view));
      dispatch(saveData({
        start: start ? moment.utc(start).toISOString() : null,
        end: end ? moment.utc(end).toISOString() : null,
        subviews: state.view.subviews
      }));
      state.sources.filter(s => s !== "code").forEach(source => {
        dispatch(getData({
          start: start ? moment.utc(start).toDate() : null,
          end: end ? moment.utc(end).toDate() : null,
          source: source
        }));
      });
    }
  }
}

export function dataViewDerivativeFuncChange(viewNumber, derivativeFunc) {
  return (dispatch, getState) => {
    const state = getState();
    const subviewsCopy = state.view.subviews.slice(0);
    subviewsCopy[viewNumber].func = derivativeFunc;
    const view = {
      start: state.view.start,
      end: state.view.end,
      subviews: subviewsCopy
    }
    console.log("dataViewDerivativeFuncChange");
    dispatch(receiveViewUpdate(view));
    dispatch(saveData({
      start: state.view.start ? state.view.start.toISOString() : null,
      end: state.view.end ? state.view.end.toISOString() : null,
      subviews: subviewsCopy
    }));
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
