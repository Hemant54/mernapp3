import { combineReducers } from "redux";
import authReducer from "./authReducers";
import instituteReducer from './instituteReducer';
import questionReducer from "./questionReducers";
import randomReducer from './randomReducer';
import brainMirrorReducer from './brainMirrorReducer';
export default combineReducers({
  auth: authReducer,
  institutes: instituteReducer,
  questions: questionReducer,
  random: randomReducer,
  brainmirror: brainMirrorReducer
});
