import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";

import authReducer from "../features/authentication-module/authSlice";

// Combine reducers
const rootReducer = combineReducers({
  auth: authReducer,
});

// Create and export the store
export const store = configureStore({
  reducer: rootReducer,
});