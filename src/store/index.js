import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";

import authReducer from "../features/authentication-module/authSlice";
import policyReducer from "../features/policy-detail-module/policySlice";

// Combine reducers
const rootReducer = combineReducers({
  auth: authReducer,
  policy: policyReducer,
});

// Create and export the store
export const store = configureStore({
  reducer: rootReducer,
});
