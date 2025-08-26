import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../utils/axiosConfig";
import toast from "react-hot-toast"; // ✅ Toast import

// ============================
// Thunks
// ============================

// Fetch All Call Results (with pagination, search, filters)
export const fetchCallResults = createAsyncThunk(
  "callResults/fetchCallResults",
  async (data = {}, thunkAPI) => {
    try {
      const params = {};

      if (data?.page) params.page = data.page;
      if (data?.size) params.size = data.size;
      if (data?.search) params.search = data.search;
      if (data?.is_active !== undefined) params.is_active = data.is_active;

      const response = await apiClient.get("/v1/call-results", { params });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || { message: "Failed to fetch call results" }
      );
    }
  }
);

// Add a Call Result
export const addCallResult = createAsyncThunk(
  "callResults/addCallResult",
  async (callResultData, thunkAPI) => {
    try {
      const response = await apiClient.post("/v1/call-results", callResultData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || { message: "Failed to add call result" }
      );
    }
  }
);

// Update a Call Result
export const updateCallResult = createAsyncThunk(
  "callResults/updateCallResult",
  async ({ id, callResultData }, thunkAPI) => {
    try {
      const response = await apiClient.put(`/v1/call-results/${id}`, callResultData);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        return thunkAPI.rejectWithValue({
          status: 404,
          message: "Not found",
        });
      }
      return thunkAPI.rejectWithValue(
        error.response?.data || { message: "Failed to update call result" }
      );
    }
  }
);

// Delete a Call Result
export const deleteCallResult = createAsyncThunk(
  "callResults/deleteCallResult",
  async (id, thunkAPI) => {
    try {
      const response = await apiClient.delete(`/v1/call-results/${id}`);
      return {
        data: { id },
        message: response.data.message || "Call result deleted successfully",
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || { message: "Failed to delete call result" }
      );
    }
  }
);

// ============================
// Slice
// ============================

const callResultsSlice = createSlice({
  name: "callResults",
  initialState: {
    callResults: {}, // ✅ object (with pagination metadata) instead of array
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
      .addCase(fetchCallResults.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCallResults.fulfilled, (state, action) => {
        state.loading = false;
        state.callResults = action.payload.data; // ✅ set API data
        // toast.success("Call results fetched successfully ✅");
      })
      .addCase(fetchCallResults.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
        toast.error(action.payload.message || "Failed to fetch call results ");
      })

      // Add
      .addCase(addCallResult.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addCallResult.fulfilled, (state, action) => {
        state.loading = false;
        state.callResults.data = [action.payload.data, ...state.callResults.data];
        state.success = action.payload.message;
        toast.success(action.payload.message || "Call result added successfully ");
      })
      .addCase(addCallResult.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
        toast.error(action.payload.message || "Failed to add call result ");
      })

      // Update
      .addCase(updateCallResult.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCallResult.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.callResults.data.findIndex(
          (status) => status.id === action.payload.data.id
        );
        if (index !== -1) {
          state.callResults.data[index] = action.payload.data;
        } else {
          state.callResults.data.push(action.payload.data);
        }
        state.success = action.payload.message;
        toast.success(action.payload.message || "Call result updated successfully ");
      })
      .addCase(updateCallResult.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
        toast.error(action.payload.message || "Failed to update call result ");
      })

      // Delete
      .addCase(deleteCallResult.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCallResult.fulfilled, (state, action) => {
        state.loading = false;
        state.callResults.data = state.callResults.data.filter(
          (status) => status.id !== action.payload.data.id
        );
        state.success = action.payload.message;
        toast.success(action.payload.message || "Call result deleted successfully ");
      })
      .addCase(deleteCallResult.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
        toast.error(action.payload.message || "Failed to delete call result ");
      });
  },
});

export const { clearMessages } = callResultsSlice.actions;
export default callResultsSlice.reducer;
