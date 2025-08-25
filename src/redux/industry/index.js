import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../utils/axiosConfig";
import toast from "react-hot-toast"; // ✅ Toast

// ---------------- Thunks ---------------- //

// Fetch All Industries
export const fetchIndustries = createAsyncThunk(
  "industries/fetchIndustries",
  async (datas, thunkAPI) => {
    try {
      const params = {};
      if (datas?.search) params.search = datas?.search;
      if (datas?.page) params.page = datas?.page;
      if (datas?.size) params.size = datas?.size;

      const response = await apiClient.get("/v1/industries", { params });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch industries"
      );
    }
  }
);

// Add an Industry
export const addIndustry = createAsyncThunk(
  "industries/addIndustry",
  async (industryData, thunkAPI) => {
    try {
      const response = await apiClient.post("/v1/industries", industryData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to add industry"
      );
    }
  }
);

// Update an Industry
export const updateIndustry = createAsyncThunk(
  "industries/updateIndustry",
  async ({ id, industryData }, thunkAPI) => {
    try {
      const response = await apiClient.put(`/v1/industries/${id}`, industryData);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        return thunkAPI.rejectWithValue({
          status: 404,
          message: "Not found",
        });
      }
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to update industry"
      );
    }
  }
);

// Delete an Industry
export const deleteIndustry = createAsyncThunk(
  "industries/deleteIndustry",
  async (id, thunkAPI) => {
    try {
      const response = await apiClient.delete(`/v1/industries/${id}`);
      return {
        data: { id },
        message: response.data.message || "Industry deleted successfully",
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to delete industry"
      );
    }
  }
);

// ---------------- Slice ---------------- //

const industriesSlice = createSlice({
  name: "industries",
  initialState: {
    industries: {}, // ✅ same structure as others
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
      .addCase(fetchIndustries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchIndustries.fulfilled, (state, action) => {
        state.loading = false;
        state.industries = action.payload.data;
      })
      .addCase(fetchIndustries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
        toast.error(action.payload.message || "Failed to fetch industries");
      })

      // Add
      .addCase(addIndustry.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addIndustry.fulfilled, (state, action) => {
        state.loading = false;
        state.industries = {
          ...state.industries,
          data: [action.payload.data, ...(state.industries?.data || [])],
        };
        state.success = action.payload.message;
        toast.success(action.payload.message || "Industry added successfully");
      })
      .addCase(addIndustry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
        toast.error(action.payload.message || "Failed to add industry");
      })

      // Update
      .addCase(updateIndustry.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateIndustry.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.industries?.data?.findIndex(
          (industry) => industry.id === action.payload.data.id
        );
        if (index !== -1) {
          state.industries.data[index] = action.payload.data;
        } else {
          state.industries = {
            ...state.industries,
            data: [...(state.industries?.data || []), action.payload.data],
          };
        }
        state.success = action.payload.message;
        toast.success(action.payload.message || "Industry updated successfully");
      })
      .addCase(updateIndustry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
        toast.error(action.payload.message || "Failed to update industry");
      })

      // Delete
      .addCase(deleteIndustry.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteIndustry.fulfilled, (state, action) => {
        state.loading = false;
        const filterData = state.industries.data.filter(
          (industry) => industry.id !== action.payload.data.id
        );
        state.industries = { ...state.industries, data: filterData };
        state.success = action.payload.message;
        toast.success(action.payload.message || "Industry deleted successfully");
      })
      .addCase(deleteIndustry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
        toast.error(action.payload.message || "Failed to delete industry");
      });
  },
});

export const { clearMessages } = industriesSlice.actions;
export default industriesSlice.reducer;
