import {configureStore} from "@reduxjs/toolkit";
import rootReducer from "./rootReducer";

const store = configureStore({
  reducer: rootReducer
});

store.subscribe(() => {
  const investment = store.getState().investment;
  localStorage.setItem("investment-profiles", JSON.stringify(investment));
});

export default store;
