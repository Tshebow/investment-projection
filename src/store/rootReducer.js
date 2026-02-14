import {combineReducers} from "@reduxjs/toolkit";
import notificationReducer from "../components/notification/notificationSlicer.js";
import investmentReducer from "../components/investment-projection/investmentSlice.js";


const rootReducer = combineReducers({
  notification: notificationReducer,
  investment: investmentReducer,
});

export default rootReducer;