import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../utils/axiosConfig";
import toast from "react-hot-toast"; // ✅ Added

// Fetch All Lost Reasons
export const fetchLostReasons = createAsyncThunk(
  "lostReasons/fetchLostReasons",
  async (data, thunkAPI) => {
    try {
      const params = {};
      if (data?.is_active) params.is_active = data.is_active;
      const response = await apiClient.get("/v1/lost-reasons", { params });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch lost reasons"
      );
    }
  }
);

// Add a Lost Reason
export const addLostReason = createAsyncThunk(
  "lostReasons/addLostReason",
  async (lostReasonData, thunkAPI) => {
    try {
      const response = await apiClient.post("/v1/lost-reasons", lostReasonData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to add lost reason"
      );
    }
  }
);

// Update a Lost Reason
export const updateLostReason = createAsyncThunk(
  "lostReasons/updateLostReason",
  async ({ id, lostReasonData }, thunkAPI) => {
    try {
      const response = await apiClient.put(`/v1/lost-reasons/${id}`, lostReasonData);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        return thunkAPI.rejectWithValue({
          status: 404,
          message: "Not found",
        });
      }
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to update lost reason"
      );
    }
  }
);

// Delete a Lost Reason
export const deleteLostReason = createAsyncThunk(
  "lostReasons/deleteLostReason",
  async (id, thunkAPI) => {
    try {
      const response = await apiClient.delete(`/v1/lost-reasons/${id}`);
      return {
        data: { id },
        message: response.data.message || "Lost reason deleted successfully",
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to delete lost reason"
      );
    }
  }
);

// Fetch a Single Lost Reason by ID
export const fetchLostReasonById = createAsyncThunk(
  "lostReasons/fetchLostReasonById",
  async (id, thunkAPI) => {
    try {
      const response = await apiClient.get(`/v1/lost-reasons/${id}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch lost reason"
      );
    }
  }
);

const lostReasonsSlice = createSlice({
  name: "lostReasons",
  initialState: {
    lostReasons: [],
    lostReasonDetail: null,
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
      .addCase(fetchLostReasons.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLostReasons.fulfilled, (state, action) => {
        state.loading = false;
        state.lostReasons = action.payload.data;
      })
      .addCase(fetchLostReasons.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
        toast.error(action.payload.message || "Failed to fetch lost reasons");
      })

      .addCase(addLostReason.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addLostReason.fulfilled, (state, action) => {
        state.loading = false;
        state.lostReasons = [action.payload.data, ...state.lostReasons];
        state.success = action.payload.message;
        toast.success(action.payload.message || "Lost reason added successfully");
      })
      .addCase(addLostReason.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
        toast.error(action.payload.message || "Failed to add lost reason");
      })

      .addCase(updateLostReason.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateLostReason.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.lostReasons?.findIndex(
          (reason) => reason.id === action.payload.data.id
        );
        if (index !== -1) {
          state.lostReasons[index] = action.payload.data;
        } else {
          state.lostReasons = [action.payload.data, ...state.lostReasons];
        }
        state.success = action.payload.message;
        toast.success(action.payload.message || "Lost reason updated successfully");
      })
      .addCase(updateLostReason.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
        toast.error(action.payload.message || "Failed to update lost reason");
      })

      .addCase(deleteLostReason.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteLostReason.fulfilled, (state, action) => {
        state.loading = false;
        state.lostReasons = state.lostReasons.filter(
          (reason) => reason.id !== action.payload.data.id
        );
        state.success = action.payload.message;
        toast.success(action.payload.message || "Lost reason deleted successfully");
      })
      .addCase(deleteLostReason.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
        toast.error(action.payload.message || "Failed to delete lost reason");
      })

      .addCase(fetchLostReasonById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLostReasonById.fulfilled, (state, action) => {
        state.loading = false;
        state.lostReasonDetail = action.payload.data;
      })
      .addCase(fetchLostReasonById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
        toast.error(action.payload.message || "Failed to fetch lost reason");
      });
  },
});

export const { clearMessages } = lostReasonsSlice.actions;
export default lostReasonsSlice.reducer;
