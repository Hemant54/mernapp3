const questionReducer = function(
  state = { tests: [], stopRecording: false },
  action
) {
  switch (action.type) {
    case "GET_TESTS":
      return { ...state, tests: [...action.payload] };
    case "STOP_RECORDING":
      return { ...state, stopRecording: true };
    default:
      return state;
  }
};
export default questionReducer;
