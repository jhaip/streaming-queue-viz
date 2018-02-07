import moment from 'moment'
import {
  GET_LAST_VIEW,
  SAVE_DATA,
  GET_DATA,
  RECEIVE_VIEW_UPDATE,
  RECEIVE_DATA,
  RECEIVE_LAST_VIEW,
  DATA_UPDATE
} from './actions'

const initialState = {
  view: {
    start: null,
    end: null,
    subviews: null
  },
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
    case RECEIVE_VIEW_UPDATE:
      return Object.assign({}, state, {
        view: action.view
      })
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
        view: {
          start: action.view.start ? moment.utc(action.view.start).toDate() : null,
          end: action.view.end ? moment.utc(action.view.end).toDate() : null,
          subviews: action.view.subviews
        },
        sources
      });
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
