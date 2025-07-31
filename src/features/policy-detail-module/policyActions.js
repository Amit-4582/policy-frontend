import { createAsyncThunk } from "@reduxjs/toolkit";
import { createApiClient } from "../../utils/createApiClient";
import { tokenExpiration } from "../../utils/tokenExpired";
import { toast } from "react-hot-toast";

function isAxiosError(error) {
  return error.isAxiosError !== undefined;
}

// CREATE POLICY ACTION
export const createPolicy = createAsyncThunk(
  "policy/createPolicy",
  async (policyData, { rejectWithValue }) => {
    // Basic validation
    if (!policyData.dob || !policyData.gender || !policyData.sumAssured) {
      toast.error("Please fill all required fields");
      return rejectWithValue("Required fields are missing");
    }

    try {
      const response = await createApiClient.post(
        "/policy/create-policy",
        policyData
      );

      if (response.data.success) {
        toast.success("Policy created successfully");
        return response.data;
      } else {
        toast.error(response.data.message || "Policy creation failed");
        return rejectWithValue(response.data.message);
      }
    } catch (error) {
      let errorMessage = "Failed to create policy";

      if (isAxiosError(error) && error.response) {
        errorMessage = error.response.data.message || errorMessage;
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

// GET ALL POLICIES ACTION
export const getAllPolicyDetails = createAsyncThunk(
  "policy/getAllPolicyDetails",
  async ({ page, limit }, { rejectWithValue }) => {
    try {
      const response = await createApiClient.get("/policy/get-all-policies", {
        params: { page, limit },
      });

      console.log("AAa ", response)

      if (response.data.success) {
        return response.data.data;
      } else {
        toast.error(response.data.message || "Failed to fetch policies");
        return rejectWithValue(response.data.message);
      }
    } catch (error) {
      let errorMessage = "Failed to fetch policies";

      if (isAxiosError(error) && error.response) {
        errorMessage = error.response.data.message || errorMessage;
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
