import { createAsyncThunk } from "@reduxjs/toolkit";

import { createApiClient } from "../../utils/createApiClient";
import { tokenExpiration } from "../../utils/tokenExpired";

import { toast } from "react-hot-toast";

import { loginSuccess } from "./authSlice";

function isAxiosError(error) {
  return error.isAxiosError !== undefined;
}

// LOGIN USER ACTION
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (userData, { rejectWithValue, dispatch }) => {
    if (!userData.emailId) {
      toast.error("Email Id is required.");
      return rejectWithValue("Email Id is required.");
    }

    try {
      const response = await createApiClient.post(
        "/auth/login-user",
        userData
      );

      if (response.data.success) {
        // Store user data and tokens in localStorage
        localStorage.setItem(
          "userData",
          JSON.stringify(response.data.data.user)
        );
        localStorage.setItem("accessToken", response.data.data.accessToken);
        localStorage.setItem("refreshToken", response.data.data.refreshToken);

        // Update Redux state
        dispatch(loginSuccess({ user: response?.data?.data?.user }));

        return response.data;
      } else {
        toast.error(response.data.message || "Login failed");
        return rejectWithValue(response.data.message);
      }
    } catch (error) {
      let errorMessage = "An unknown error occurred";

      if (isAxiosError(error) && error.response) {
        errorMessage = error.response.data.message || "Unknown error";
        if (error.response.status === 401) {
          tokenExpiration();
          errorMessage = "Session expired";
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

// REGISTER USER ACTION
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData, { rejectWithValue, dispatch }) => {
    if (!userData.emailId || !userData.name || !userData.dob || !userData.contactNo || !userData.password) {
      toast.error("All fields are required.");
      return rejectWithValue("All fields are required.");
    }

    try {
      const response = await createApiClient.post(
        "/auth/register-user",
        userData
      );

      if (response.data.success) {
        return response.data;
      } else {
        toast.error(response.data.message || "Registration failed");
        return rejectWithValue(response.data.message);
      }
    } catch (error) {
      let errorMessage = "An unknown error occurred";

      if (isAxiosError(error) && error.response) {
        errorMessage = error.response.data.message || "Unknown error";
        if (error.response.status === 401) {
          tokenExpiration();
          errorMessage = "Session expired";
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);