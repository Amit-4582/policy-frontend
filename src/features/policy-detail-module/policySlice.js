import { createSlice } from "@reduxjs/toolkit";
import { createPolicy, getAllPolicyDetails } from "./policyActions";

const initialState = {
  policies: [],
  currentPolicy: null,
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  },
};

const policySlice = createSlice({
  name: "policy",
  initialState,
  reducers: {
    clearPolicyError(state) {
      state.error = null;
    },
    resetPolicyState(state) {
      Object.assign(state, initialState);
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Policy
      .addCase(createPolicy.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPolicy.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPolicy = action.payload.policy;
        state.error = null;
      })
      .addCase(createPolicy.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get All Policies
      .addCase(getAllPolicyDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllPolicyDetails.fulfilled, (state, action) => {
        state.loading = false;
        // Check if payload and pagination exist
        if (action.payload && action.payload.policies) {
          state.policies = action.payload.policies;
          // Safely handle pagination
          state.pagination = {
            currentPage: action.payload.pagination?.currentPage ?? 1,
            totalPages: action.payload.pagination?.totalPages ?? 1,
            totalItems: action.payload.pagination?.totalItems ?? 0,
            itemsPerPage: action.payload.pagination?.itemsPerPage ?? 10,
          };
        } else {
          // Fallback if payload is malformed
          state.policies = [];
          state.pagination = initialState.pagination;
          state.error = "Invalid response data";
        }
        state.error = null;
      })
      .addCase(getAllPolicyDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch policies";
        state.policies = [];
        state.pagination = initialState.pagination;
      });
  },
});

export const { clearPolicyError, resetPolicyState } = policySlice.actions;
export default policySlice.reducer;
