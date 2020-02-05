const randomReducer = function(state = { random: 0 },action) {
  switch (action.type) {
    case "SET_RANDOM_TEST":
      return { ...state, random: action.payload };
    default:
      return state;
  }
};
export default randomReducer;
