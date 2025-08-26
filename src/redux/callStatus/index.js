import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../utils/axiosConfig";
import toast from "react-hot-toast";

// Fetch All Call Statuses
export const fetchCallStatuses = createAsyncThunk(
  "callStatuses/fetchCallStatuses",
  async (data, thunkAPI) => {
    try {
      const params = {};
      if (data?.page) params.page = data.page;
      if (data?.size) params.size = data.size;
      if (data?.search) params.search = data.search;
      if (data?.is_active !== undefined) params.is_active = data.is_active;

      const response = await apiClient.get("/v1/call-statuses", { params });
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
      const response = await toast.promise(
        apiClient.post("/v1/call-statuses", callStatusData),
        {
          loading: "Adding call status...",
          success: (res) => res.data.message || "Call status added successfully",
          error: "Failed to add call status",
        }
      );
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
      const response = await toast.promise(
        apiClient.put(`/v1/call-statuses/${id}`, callStatusData),
        {
          loading: "Updating call status...",
          success: (res) => res.data.message || "Call status updated successfully",
          error: "Failed to update call status",
        }
      );
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
      const response = await toast.promise(
        apiClient.delete(`/v1/call-statuses/${id}`),
        {
          loading: "Deleting call status...",
          success: (res) => res.data.message || "Call status deleted successfully",
          error: "Failed to delete call status",
        }
      );

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
    callStatuses: {}, // ✅ data array initialize kiya
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

      // Add
      .addCase(addCallStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addCallStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.callStatuses.data = [action.payload.data, ...state.callStatuses.data];
        state.success = action.payload.message;
      })
      .addCase(addCallStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Update
      .addCase(updateCallStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCallStatus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.callStatuses.data.findIndex(
          (data) => data.id === action.payload.data.id
        );
        if (index !== -1) {
          state.callStatuses.data[index] = action.payload.data;
        } else {
          state.callStatuses.data.push(action.payload.data);
        }
        state.success = action.payload.message;
      })
      .addCase(updateCallStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Delete
      .addCase(deleteCallStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCallStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.callStatuses.data = state.callStatuses.data.filter(
          (data) => data.id !== action.payload.data.id
        );
        state.success = action.payload.message;
      })
      .addCase(deleteCallStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export const { clearMessages } = callStatusesSlice.actions;
export default callStatusesSlice.reducer;
