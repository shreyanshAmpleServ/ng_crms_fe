import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../utils/axiosConfig";
import toast from "react-hot-toast";

// Fetch Activity Types
export const fetchActivityTypes = createAsyncThunk(
  "activities/fetchActivityType",
  async (_, thunkAPI) => {
    try {
      const response = await apiClient.get("/v1/activityTypes");
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch activities"
      );
    }
  }
);

// Fetch All Activities
export const fetchActivities = createAsyncThunk(
  "activities/fetchActivities",
  async (reqBody, thunkAPI) => {
    try {
      const params = {};
      if (reqBody?.search) params.search = reqBody.search;
      if (reqBody?.filter) params.filter = reqBody.filter;
      if (reqBody?.filter2) params.filter2 = reqBody.filter2;
      if (reqBody?.startDate) params.startDate = reqBody.startDate?.toISOString();
      if (reqBody?.endDate) params.endDate = reqBody.endDate?.toISOString();
      if (reqBody?.page) params.page = reqBody.page;
      if (reqBody?.size) params.size = reqBody.size;

      const response = await apiClient.get(`/v1/activities`, { params });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch activities"
      );
    }
  }
);
export const fetchActivitiesByObject = createAsyncThunk(
  "activities/fetchActivitiesByObject",
  async (reqBody, thunkAPI) => {
    try {
      const params = {};
      if (reqBody?.search) params.search = reqBody.search;
      if (reqBody?.filter) params.filter = reqBody.filter;
      if (reqBody?.filter2) params.filter2 = reqBody.filter2;
      if (reqBody?.startDate) params.startDate = reqBody.startDate?.toISOString();
      if (reqBody?.endDate) params.endDate = reqBody.endDate?.toISOString();
      if (reqBody?.page) params.page = reqBody.page;
      if (reqBody?.size) params.size = reqBody.size;
      if (reqBody?.object_id) params.object_id = reqBody.object_id;
      if (reqBody?.activityType) params.activityType = reqBody.activityType;

      const response = await apiClient.get(`/v1/activities-by-object`, { params });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch activities"
      );
    }
  }
);

// Fetch Grouped Activities
export const fetchGroupedActivities = createAsyncThunk(
  "activities/fetchGroupedActivities",
  async (data, thunkAPI) => {
    try {
      const params = {};
      if (data?.deal_id) params.deal_id = data.deal_id;
      if (data?.contact_id) params.contact_id = data.contact_id;
      if (data?.company_id) params.company_id = data.company_id;
      if (data?.project_id) params.project_id = data.project_id;
      if (data?.vendor_id) params.vendor_id = data.vendor_id;
      if (data?.lead_id) params.lead_id = data.lead_id;
      if (data?.orderBy) params.orderBy = data.orderBy;
      if (data?.sortBy) params.sortBy = data.sortBy;
      if (data?.search) params.search = data.search;

      const response = await apiClient.get(`/v1/grouped-activities`, { params });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch activities"
      );
    }
  }
);

// Add Activity
export const addActivities = createAsyncThunk(
  "activities/addActivities",
  async (activityData, thunkAPI) => {
    try {
      const response = await apiClient.post("/v1/activities", activityData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to add activity"
      );
    }
  }
);

// Update Activity
export const updateActivities = createAsyncThunk(
  "activities/updateActivities",
  async ({ id, activityData }, thunkAPI) => {
    try {
      const response = await apiClient.put(`/v1/activities/${id}`, activityData);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        return thunkAPI.rejectWithValue({ status: 404, message: "Activity not found" });
      }
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to update activity"
      );
    }
  }
);

// Delete Activity
export const deleteActivities = createAsyncThunk(
  "activities/deleteActivities",
  async (id, thunkAPI) => {
    try {
      const response = await apiClient.delete(`/v1/activities/${id}`);
      return {
        data: { id },
        message: response.data.message || "Activity deleted successfully",
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(
          error?.response?.data?.message || "Failed to delete activity"
      );
    }
  }
);

const acticitiesSlice = createSlice({
  name: "activities",
  initialState: {
    activities: [],
    activitiesGrouped: null,
    activityTypes: [],
    loading: false,
    error: false,
    success: false,
  },
  reducers: {
    clearMessages(state) {
      state.error = null;
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Activities
      .addCase(fetchActivities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActivities.fulfilled, (state, action) => {
        state.loading = false;
        state.activities = action.payload.data;
      })
      .addCase(fetchActivities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
        toast.error(action.payload.message || "Failed to fetch activities");
      })
      .addCase(fetchActivitiesByObject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActivitiesByObject.fulfilled, (state, action) => {
        state.loading = false;
        state.activities = action.payload.data;
      })
      .addCase(fetchActivitiesByObject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
        toast.error(action.payload.message || "Failed to fetch activities");
      })

      // Add Activity
      .addCase(addActivities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addActivities.fulfilled, (state, action) => {
        state.loading = false;
        state.activities = {
          ...state.activities,
          data: [action.payload.data, ...state.activities.data],
        };
        state.success = action.payload.message;
        toast.success(action.payload.message || "Activity added successfully");
      })
      .addCase(addActivities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
        toast.error(action.payload.message || "Failed to add activity");
      })

      // Update Activity
      .addCase(updateActivities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateActivities.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.activities.data?.findIndex(
          (company) => company.id === action.payload.data.id
        );
        if (index !== -1) {
          state.activities.data[index] = action.payload.data;
        } else {
          state.activities = {
            ...state.activities,
            data: [action.payload.data, ...state.activities.data],
          };
        }
        state.success = action.payload.message;
        toast.success(action.payload.message || "Activity updated successfully");
      })
      .addCase(updateActivities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
        toast.error(action.payload.message || "Failed to update activity");
      })

      // Delete Activity
      .addCase(deleteActivities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteActivities.fulfilled, (state, action) => {
        state.loading = false;
        const filteredData = state.activities.data.filter(
          (activity) => activity.id !== action.payload.data.id
        );
        state.activities = { ...state.activities, data: filteredData };
        state.success = action.payload.message;
        toast.success(action.payload.message || "Activity deleted successfully");
      })
      .addCase(deleteActivities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
        toast.error(action.payload.message || "Failed to delete activity");
      })

      // Fetch Activity Types
      .addCase(fetchActivityTypes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActivityTypes.fulfilled, (state, action) => {
        state.loading = false;
        state.activityTypes = action.payload.data;
      })
      .addCase(fetchActivityTypes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
        toast.error(action.payload.message || "Failed to fetch activity types");
      })

      // Fetch Grouped Activities
      .addCase(fetchGroupedActivities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGroupedActivities.fulfilled, (state, action) => {
        state.loading = false;
        state.activitiesGrouped = action.payload.data;
      })
      .addCase(fetchGroupedActivities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
        toast.error(action.payload.message || "Failed to fetch grouped activities");
      });
  },
});

export const { clearMessages } = acticitiesSlice.actions;
export default acticitiesSlice.reducer;
