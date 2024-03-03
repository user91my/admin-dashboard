import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { configureStore } from "@reduxjs/toolkit";
import globalReducer from "state";
import { Provider } from "react-redux";
import { setupListeners } from "@reduxjs/toolkit/query";
import { api } from "state/api";

// Redux store set up to handle actions dispatched by the slices
// in reducer (i.e. global, api.reducerPath, ...).
const store = configureStore({
  reducer: {
    // 'global' reducer's property name derived from 'globalSlice' in "client\src\state\index.js".
    global: globalReducer,
    // 'api.reducerPath' is actually 'adminApi' (see 'client\src\state\api.js').
    // Enables the access to API endpoints in 'client\src\state\api.js'.
    [api.reducerPath]: api.reducer,
  },
  // Combines the default Redux toolkit middleware with additional middleware
  // specifically designed to handle API-related actions. These additional
  // middleware are automatically generated from the 'api' object defined in
  // 'client\src\state\api.js' (triggered by RTK's 'createApi' function).
  middleware: (getDefault) => getDefault().concat(api.middleware),
});
// Ensures that actions dispatched by the API endpoints (i.e. in 'client\src\state\api.js')
// are correctly handled and update the store's state.
setupListeners(store.dispatch);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
