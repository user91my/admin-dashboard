import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mode: "dark",
  userId: "d0cff77ba83cf55a2ccc8f28", // mock userId utilized (because app has no login/user authentication feature)
  isSidebarOpen: true,
};

// `createSlice` returns an object with two keys:-
// -- 'actions' : action creators used to dispatch actions
// -- 'reducer' : represents the store's reducer function
export const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setMode: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
    },
    setIsSidebarOpen: (state, action) => {
      state.isSidebarOpen = action.payload;
    },
  },
});

// Exports action creators (whose names are determined by the keys provided
// in the 'reducers' object within 'globalSlice').
export const { setMode, setIsSidebarOpen } = globalSlice.actions;

// Exports reducer functions.
// To be imported by 'client\src\index.js' as 'globalReducer'.
// (Note: it can be imported as any custom variable name, in this case 'globalReducer').
export default globalSlice.reducer;
