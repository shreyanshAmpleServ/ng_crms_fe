import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../utils/axiosConfig";
import toast from "react-hot-toast";

// Fetch All Call Types
export const fetchCallTypes = createAsyncThunk(
  "callTypes/fetchCallTypes",
  async (data, thunkAPI) => {
    try {
      const params = {};
      if (data?.page) params.page = data.page;
      if (data?.size) params.size = data.size;
      if (data?.search) params.search = data.search;

      const response = await apiClient.get("/v1/call-types", { params });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch call types"
      );
    }
  }
);

// Add a Call Type
export const addCallType = createAsyncThunk(
  "callTypes/addCallType",
  async (callTypeData, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.post("/v1/call-types", callTypeData),
        {
          loading: "Adding call type...",
          success: (res) => res.data.message || "Call type added successfully",
          error: "Failed to add call type",
        }
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to add call type"
      );
    }
  }
);

// Update a Call Type
export const updateCallType = createAsyncThunk(
  "callTypes/updateCallType",
  async ({ id, callTypeData }, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.put(`/v1/call-types/${id}`, callTypeData),
        {
          loading: "Updating call type...",
          success: (res) => res.data.message || "Call type updated successfully",
          error: "Failed to update call type",
        }
      );
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        return thunkAPI.rejectWithValue({ status: 404, message: "Not found" });
      }
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to update call type"
      );
    }
  }
);

// Delete a Call Type
export const deleteCallType = createAsyncThunk(
  "callTypes/deleteCallType",
  async (id, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.delete(`/v1/call-types/${id}`),
        {
          loading: "Deleting call type...",
          success: (res) => res.data.message || "Call type deleted successfully",
          error: "Failed to delete call type",
        }
      );

      return {
        data: { id },
        message: response.data.message || "Call type deleted successfully",
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to delete call type"
      );
    }
  }
);

const callTypesSlice = createSlice({
  name: "callTypes",
  initialState: {
    callTypes: {}, // ✅ same style as callStatuses
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
      .addCase(fetchCallTypes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCallTypes.fulfilled, (state, action) => {
        state.loading = false;
        state.callTypes = action.payload.data;
      })
      .addCase(fetchCallTypes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
        toast.error(action.payload.message || "Failed to fetch call types");
      })

      // Add
      .addCase(addCallType.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addCallType.fulfilled, (state, action) => {
        state.loading = false;
        state.callTypes.data = [action.payload.data, ...state.callTypes.data];
        state.success = action.payload.message;
      })
      .addCase(addCallType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Update
      .addCase(updateCallType.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCallType.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.callTypes.data.findIndex(
          (type) => type.id === action.payload.data.id
        );
        if (index !== -1) {
          state.callTypes.data[index] = action.payload.data;
        } else {
          state.callTypes.data.push(action.payload.data);
        }
        state.success = action.payload.message;
      })
      .addCase(updateCallType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Delete
      .addCase(deleteCallType.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCallType.fulfilled, (state, action) => {
        state.loading = false;
        state.callTypes.data = state.callTypes.data.filter(
          (type) => type.id !== action.payload.data.id
        );
        state.success = action.payload.message;
      })
      .addCase(deleteCallType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export const { clearMessages } = callTypesSlice.actions;
export default callTypesSlice.reducer;
