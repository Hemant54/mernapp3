const instituteReducer = function(state = { institutes: [] }, action) {
  switch (action.type) {
    case "GET_INSTITUTES":
      return { ...state, institutes: action.payload  };
    default:
      return state;
  }
};
export default instituteReducer;
