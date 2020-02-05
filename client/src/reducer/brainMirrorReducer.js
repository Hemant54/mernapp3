const brainMirrorReducer = function(state = { leftResult: {}, rightResult: {}, mode: "English" },action) {
  switch (action.type) {
    case "BRAIN_MIRROR_LEFT_RESULT":
      	return { ...state, leftResult: action.payload };
    case "BRAIN_MIRROR_RIGHT_RESULT":
    	return { ...state, rightResult: action.payload };
    case "BRAIN_MIRROR_MODE":
    	return { ...state, mode: action.payload }
    default:
      	return state;
  }
};
export default brainMirrorReducer;
