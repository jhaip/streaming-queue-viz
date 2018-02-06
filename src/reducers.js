const initialState = {
  start: null,
  end: null,
  data: {},
  loading: {
    status: false,
    messageId: null
  }
};

function rootReducer(state = initialState, action) {
  switch (action.type) {
    // case SET_VISIBILITY_FILTER:
    //   return Object.assign({}, state, {
    //     visibilityFilter: action.filter
    //   })
    default:
      return state
  }
}

export default rootReducer
