import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../utils/axiosConfig";
import toast from "react-hot-toast"; // ✅ Toast import

// Fetch All Call Purposes
export const fetchCallPurposes = createAsyncThunk(
  "callPurposes/fetchCallPurposes",
  async (_, thunkAPI) => {
    try {
      const response = await apiClient.get("/v1/call-purposes");
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch call purposes"
      );
    }
  }
);

// Add a Call Purpose
export const addCallPurpose = createAsyncThunk(
  "callPurposes/addCallPurpose",
  async (callPurposeData, thunkAPI) => {
    try {
      const response = await apiClient.post("/v1/call-purposes", callPurposeData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to add call purpose"
      );
    }
  }
);

// Update a Call Purpose
export const updateCallPurpose = createAsyncThunk(
  "callPurposes/updateCallPurpose",
  async ({ id, callPurposeData }, thunkAPI) => {
    try {
      const response = await apiClient.put(`/v1/call-purposes/${id}`, callPurposeData);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        return thunkAPI.rejectWithValue({
          status: 404,
          message: "Not found",
        });
      }
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to update call purpose"
      );
    }
  }
);

// Delete a Call Purpose
export const deleteCallPurpose = createAsyncThunk(
  "callPurposes/deleteCallPurpose",
  async (id, thunkAPI) => {
    try {
      const response = await apiClient.delete(`/v1/call-purposes/${id}`);
      return {
        data: { id },
        message: response.data.message || "Call purpose deleted successfully",
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to delete call purpose"
      );
    }
  }
);

const callPurposesSlice = createSlice({
  name: "callPurposes",
  initialState: {
    callPurposes: [],
    loading: false,
    error: null,
    success: null,
  },
  reducers: {
    clearMessages(state) {
      state.error = null;
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchCallPurposes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCallPurposes.fulfilled, (state, action) => {
        state.loading = false;
        state.callPurposes = action.payload.data;
      })
      .addCase(fetchCallPurposes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
        toast.error(action.payload.message || "Failed to fetch call purposes");
      })

      // Add
      .addCase(addCallPurpose.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addCallPurpose.fulfilled, (state, action) => {
        state.loading = false;
        state.callPurposes = [action.payload.data, ...state.callPurposes];
        state.success = action.payload.message;
        toast.success(action.payload.message || "Call purpose added successfully");
      })
      .addCase(addCallPurpose.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
        toast.error(action.payload.message || "Failed to add call purpose");
      })

      // Update
      .addCase(updateCallPurpose.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCallPurpose.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.callPurposes?.findIndex(
          (status) => status.id === action.payload.data.id
        );
        if (index !== -1) {
          state.callPurposes[index] = action.payload.data;
        } else {
          state.callPurposes = [action.payload.data, ...state.callPurposes];
        }
        state.success = action.payload.message;
        toast.success(action.payload.message || "Call purpose updated successfully");
      })
      .addCase(updateCallPurpose.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
        toast.error(action.payload.message || "Failed to update call purpose");
      })

      // Delete
      .addCase(deleteCallPurpose.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCallPurpose.fulfilled, (state, action) => {
        state.loading = false;
        state.callPurposes = state.callPurposes.filter(
          (status) => status.id !== action.payload.data.id
        );
        state.success = action.payload.message;
        toast.success(action.payload.message || "Call purpose deleted successfully");
      })
      .addCase(deleteCallPurpose.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
        toast.error(action.payload.message || "Failed to delete call purpose");
      });
  },
});

export const { clearMessages } = callPurposesSlice.actions;
export default callPurposesSlice.reducer;
