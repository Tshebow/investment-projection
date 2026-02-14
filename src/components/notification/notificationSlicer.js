import {createSlice} from "@reduxjs/toolkit";
import {NOTIFICATION_TYPES} from "./notificationTypes.js";


const notificationSlice = createSlice({
  name: "notification",
  initialState: {
    type: "",
    message: ""
  },
  reducers: {
    addError: (state, action) => {
      state.type = NOTIFICATION_TYPES.ERROR
      state.message = "Error: " + action.payload
    },
    addSuccess: (state, action) => {
      state.type = NOTIFICATION_TYPES.SUCCESS
      state.message = "Success: " + action.payload
    },
    addWarning: (state, action) => {
      state.type = NOTIFICATION_TYPES.WARNING
      state.message = "Warning: " + action.payload
    },
    addInfo: (state, action) => {
      state.type = NOTIFICATION_TYPES.INFO
      state.message = "Info: " + action.payload
    },
    clearNotification: state => {
      state.type = ""
      state.message = ""
    }
  }
});

export const {
  addError,
  addSuccess,
  addWarning,
  addInfo,
  clearNotification
} = notificationSlice.actions;

export default notificationSlice.reducer;