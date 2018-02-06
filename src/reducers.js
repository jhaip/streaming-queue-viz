import moment from 'moment'
import {
  GET_LAST_VIEW,
  SAVE_DATA,
  GET_DATA,
  SAVE_VIEW,
  RECEIVE_DATA,
  RECEIVE_LAST_VIEW,
  DATA_UPDATE
} from './actions'

const initialState = {
  start: null,
  end: null,
  data: {},
  loading: {
    status: false,
    messageId: null
  },
  firstViewMessageId: null
};

function rootReducer(state = initialState, action) {
  switch (action.type) {
    case GET_LAST_VIEW:
      return Object.assign({}, state, {
        firstViewMessageId: action.firstViewMessageId
      })
    case SAVE_DATA:
      return state
    case GET_DATA:
      return state
    case SAVE_VIEW:
      return state
    case RECEIVE_DATA:
      const params = action.message.params;
      return Object.assign({}, state, {
        data: Object.assign({}, state.data, {
          [params.requestParams.source]: params.results.reduce((acc, v) => {
            return acc.concat(v)
          }, [])
        }),
        loading: (action.message.messageId === state.loading.messageId)
          ? {status: false, messageId: null}
          : state.loading
      });
    case RECEIVE_LAST_VIEW:
      const sources = action.view.subviews.reduce((acc, v) => {
        return acc.concat(v.sources)
      }, []).filter((v, i, a) => a.indexOf(v) === i);
      return Object.assign({}, state, {
        start: action.view.start ? moment.utc(action.view.start).toDate() : null,
        end: action.view.end ? moment.utc(action.view.end).toDate() : null,
        sources
      })
    case DATA_UPDATE:
      const data = action.message.params;
      const stateCopy = Object.assign({}, state);
      stateCopy.data[data.source] = (stateCopy.data[data.source] || []).concat(data);
      return stateCopy;
    default:
      return state
  }
}

export default rootReducer
