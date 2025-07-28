import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../utils/axiosConfig";
import toast from "react-hot-toast"; // ✅ Add toast

// Fetch All Call Statuses
export const fetchCallStatuses = createAsyncThunk(
  "callStatuses/fetchCallStatuses",
  async (_, thunkAPI) => {
    try {
      const response = await apiClient.get("/v1/call-statuses");
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch call statuses"
      );
    }
  }
);

// Add a Call Status
export const addCallStatus = createAsyncThunk(
  "callStatuses/addCallStatus",
  async (callStatusData, thunkAPI) => {
    try {
      const response = await apiClient.post("/v1/call-statuses", callStatusData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to add call status"
      );
    }
  }
);

// Update a Call Status
export const updateCallStatus = createAsyncThunk(
  "callStatuses/updateCallStatus",
  async ({ id, callStatusData }, thunkAPI) => {
    try {
      const response = await apiClient.put(`/v1/call-statuses/${id}`, callStatusData);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        return thunkAPI.rejectWithValue({
          status: 404,
          message: "Not found",
        });
      }
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to update call status"
      );
    }
  }
);

// Delete a Call Status
export const deleteCallStatus = createAsyncThunk(
  "callStatuses/deleteCallStatus",
  async (id, thunkAPI) => {
    try {
      const response = await apiClient.delete(`/v1/call-statuses/${id}`);
      return {
        data: { id },
        message: response.data.message || "Call status deleted successfully",
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to delete call status"
      );
    }
  }
);

const callStatusesSlice = createSlice({
  name: "callStatuses",
  initialState: {
    callStatuses: [],
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
      .addCase(fetchCallStatuses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCallStatuses.fulfilled, (state, action) => {
        state.loading = false;
        state.callStatuses = action.payload.data;
      })
      .addCase(fetchCallStatuses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
        toast.error(action.payload.message || "Failed to fetch call statuses");
      })

      .addCase(addCallStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addCallStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.callStatuses = [action.payload.data, ...state.callStatuses];
        state.success = action.payload.message;
        toast.success(action.payload.message || "Call status added successfully");
      })
      .addCase(addCallStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
        toast.error(action.payload.message || "Failed to add call status");
      })

      .addCase(updateCallStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCallStatus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.callStatuses?.findIndex(
          (status) => status.id === action.payload.data.id
        );
        if (index !== -1) {
          state.callStatuses[index] = action.payload.data;
        } else {
          state.callStatuses = [action.payload.data, ...state.callStatuses];
        }
        state.success = action.payload.message;
        toast.success(action.payload.message || "Call status updated successfully");
      })
      .addCase(updateCallStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
        toast.error(action.payload.message || "Failed to update call status");
      })

      .addCase(deleteCallStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCallStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.callStatuses = state.callStatuses.filter(
          (status) => status.id !== action.payload.data.id
        );
        state.success = action.payload.message;
        toast.success(action.payload.message || "Call status deleted successfully");
      })
      .addCase(deleteCallStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
        toast.error(action.payload.message || "Failed to delete call status");
      });
  },
});

export const { clearMessages } = callStatusesSlice.actions;
export default callStatusesSlice.reducer;
