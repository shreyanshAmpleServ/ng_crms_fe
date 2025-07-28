import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../utils/axiosConfig";
import toast from "react-hot-toast"; // ✅ Import toast

// Fetch All Meeting Statuses
export const fetchMeetingTypes = createAsyncThunk(
  "meetingTypes/fetchMeetingTypes",
  async (_, thunkAPI) => {
    try {
      const response = await apiClient.get("/v1/meeting-types");
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch meeting types"
      );
    }
  }
);

// Add a Meeting Type
export const addMeetingType = createAsyncThunk(
  "meetingTypes/addMeetingType",
  async (meetingTypeData, thunkAPI) => {
    try {
      const response = await apiClient.post("/v1/meeting-types", meetingTypeData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to add meeting type"
      );
    }
  }
);

// Update a Meeting Type
export const updateMeetingType = createAsyncThunk(
  "meetingTypes/updateMeetingType",
  async ({ id, meetingTypeData }, thunkAPI) => {
    try {
      const response = await apiClient.put(`/v1/meeting-types/${id}`, meetingTypeData);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        return thunkAPI.rejectWithValue({
          status: 404,
          message: "Not found",
        });
      }
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to update meeting type"
      );
    }
  }
);

// Delete a Meeting Type
export const deleteMeetingType = createAsyncThunk(
  "meetingTypes/deleteMeetingType",
  async (id, thunkAPI) => {
    try {
      const response = await apiClient.delete(`/v1/meeting-types/${id}`);
      return {
        data: { id },
        message: response.data.message || "Meeting type deleted successfully",
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to delete meeting type"
      );
    }
  }
);

const meetingTypesSlice = createSlice({
  name: "meetingTypes",
  initialState: {
    meetingTypes: [],
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
      .addCase(fetchMeetingTypes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMeetingTypes.fulfilled, (state, action) => {
        state.loading = false;
        state.meetingTypes = action.payload.data;
      })
      .addCase(fetchMeetingTypes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
        toast.error(action.payload.message || "Failed to fetch meeting types");
      })

      // Add
      .addCase(addMeetingType.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addMeetingType.fulfilled, (state, action) => {
        state.loading = false;
        state.meetingTypes = [action.payload.data, ...state.meetingTypes];
        state.success = action.payload.message;
        toast.success(action.payload.message || "Meeting type added successfully");
      })
      .addCase(addMeetingType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
        toast.error(action.payload.message || "Failed to add meeting type");
      })

      // Update
      .addCase(updateMeetingType.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMeetingType.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.meetingTypes?.findIndex(
          (status) => status.id === action.payload.data.id
        );
        if (index !== -1) {
          state.meetingTypes[index] = action.payload.data;
        } else {
          state.meetingTypes = [action.payload.data, ...state.meetingTypes];
        }
        state.success = action.payload.message;
        toast.success(action.payload.message || "Meeting type updated successfully");
      })
      .addCase(updateMeetingType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
        toast.error(action.payload.message || "Failed to update meeting type");
      })

      // Delete
      .addCase(deleteMeetingType.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteMeetingType.fulfilled, (state, action) => {
        state.loading = false;
        state.meetingTypes = state.meetingTypes.filter(
          (status) => status.id !== action.payload.data.id
        );
        state.success = action.payload.message;
        toast.success(action.payload.message || "Meeting type deleted successfully");
      })
      .addCase(deleteMeetingType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
        toast.error(action.payload.message || "Failed to delete meeting type");
      });
  },
});

export const { clearMessages } = meetingTypesSlice.actions;
export default meetingTypesSlice.reducer;
