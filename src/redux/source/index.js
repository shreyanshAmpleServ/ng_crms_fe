import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../utils/axiosConfig";
import toast from "react-hot-toast"; // ✅ Added

// Fetch All Sources
export const fetchSources = createAsyncThunk(
  "sources/fetchSources",
  async (data, thunkAPI) => {
    try {
      const params = {};
      if (data?.is_active) params.is_active = data.is_active;
      if (data?.search) params.search = data.search;
      if (data?.page) params.page = data.page;
      if (data?.size) params.size = data.size;
      const response = await apiClient.get("/v1/sources",{params});
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch sources",
      );
    }
  }
);

// Add a Source
export const addSource = createAsyncThunk(
  "sources/addSource",
  async (sourceData, thunkAPI) => {
    try {
      const response = await apiClient.post("/v1/sources", sourceData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to add source",
      );
    }
  }
);

// Update a Source
export const updateSource = createAsyncThunk(
  "sources/updateSource",
  async ({ id, sourceData }, thunkAPI) => {
    try {
      const response = await apiClient.put(`/v1/sources/${id}`, sourceData);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        return thunkAPI.rejectWithValue({
          status: 404,
          message: "Not found",
        });
      }
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to update source",
      );
    }
  }
);

// Delete a Source
export const deleteSource = createAsyncThunk(
  "sources/deleteSource",
  async (id, thunkAPI) => {
    try {
      const response = await apiClient.delete(`/v1/sources/${id}`);
      return {
        data: { id },
        message: response.data.message || "Source deleted successfully",
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to delete source",
      );
    }
  }
);

// Fetch a Single Source by ID
export const fetchSourceById = createAsyncThunk(
  "sources/fetchSourceById",
  async (id, thunkAPI) => {
    try {
      const response = await apiClient.get(`/v1/sources/${id}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch source",
      );
    }
  }
);

const sourcesSlice = createSlice({
  name: "sources",
  initialState: {
    sources: {},
    sourceDetail: null,
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
      .addCase(fetchSources.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSources.fulfilled, (state, action) => {
        state.loading = false;
        state.sources = action.payload.data;
      })
      .addCase(fetchSources.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
        toast.error(action.payload.message || "Failed to fetch sources");
      })

      .addCase(addSource.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addSource.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.sources?.data?.findIndex(
          (data) => data.id === action.payload.data.id
      );
      if (index !== -1) {
          state.sources.data[index] = action.payload.data;
      } else {
          state.sources = {
              ...state.sources,
              data: [...state.sources, action.payload.data]
          };
      }
        state.success = action.payload.message;
        toast.success(action.payload.message || "Source added successfully");
      })
      .addCase(addSource.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
        toast.error(action.payload.message || "Failed to add source");
      })

      .addCase(updateSource.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSource.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.sources.findIndex(
          (source) => source.id === action.payload.data.id
        );
        if (index !== -1) {
          state.sources[index] = action.payload.data;
        } else {
          state.sources = [action.payload.data, ...state.sources];
        }
        state.success = action.payload.message;
        toast.success(action.payload.message || "Source updated successfully");
      })
      .addCase(updateSource.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
        toast.error(action.payload.message || "Failed to update source");
      })

      .addCase(deleteSource.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSource.fulfilled, (state, action) => {
        state.loading = false;
        const filterData = state.sources.data.filter(
          (data) => data.id !== action.payload.data.id
      );
      state.sources = { ...state.sources, data: filterData };
        state.success = action.payload.message;
        toast.success(action.payload.message || "Source deleted successfully");
      })
      .addCase(deleteSource.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
        toast.error(action.payload.message || "Failed to delete source");
      })

      .addCase(fetchSourceById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSourceById.fulfilled, (state, action) => {
        state.loading = false;
        state.sourceDetail = action.payload.data;
      })
      .addCase(fetchSourceById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
        toast.error(action.payload.message || "Failed to fetch source");
      });
  },
});

export const { clearMessages } = sourcesSlice.actions;
export default sourcesSlice.reducer;
