import {combineReducers} from "@reduxjs/toolkit";
import notificationReducer from "../components/notification/notificationSlicer.js";


const rootReducer = combineReducers({
  notification: notificationReducer
});

export default rootReducer;