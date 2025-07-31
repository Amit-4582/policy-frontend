import { createSlice } from "@reduxjs/toolkit";
import { signUpUser } from "./authActions";

// Initialize state from localStorage
const getInitialAuthState = () => {
  const userData = localStorage.getItem("userData");
  return {
    isAuthenticated: localStorage.getItem("accessToken") !== null,
    user: userData ? JSON.parse(userData) : null,
    loading: false,
    error: null,
  };
};

const authSlice = createSlice({
  name: "auth",
  initialState: getInitialAuthState(),
  reducers: {
    loginSuccess(state, action) {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.error = null;
    },
    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
      state.error = null;
    },
    clearAuthMessages(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signUpUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signUpUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.data.user;
        state.error = null;
      })
      .addCase(signUpUser.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.error = action.payload || "Sign up failed";
      });
  },
});


export const { loginSuccess, logout, clearAuthMessages } = authSlice.actions;
export default authSlice.reducer;
