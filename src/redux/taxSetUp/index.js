import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../utils/axiosConfig";
import toast from "react-hot-toast";

// ✅ Fetch All Tax Setup (with filters & pagination)
export const fetchTaxSetup = createAsyncThunk(
  "taxs/fetchTaxSetup",
  async (data, thunkAPI) => {
    try {
      const params = {};
      if (data?.page) params.page = data.page;
      if (data?.size) params.size = data.size;
      if (data?.search) params.search = data.search;
      if (data?.is_active !== undefined) params.is_active = data.is_active;

      const response = await apiClient.get("/v1/tax-setup", { params });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || { message: "Failed to fetch taxs" }
      );
    }
  }
);

// ✅ Add Tax
export const addTaxSetup = createAsyncThunk(
  "taxs/addTaxSetup",
  async (taxData, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.post("/v1/tax-setup", taxData),
        {
          loading: "Adding tax...",
          success: (res) => res.data.message || "Tax added successfully!",
          error: "Failed to add tax",
        }
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || { message: "Failed to add tax" }
      );
    }
  }
);

// ✅ Update Tax
export const updateTaxSetup = createAsyncThunk(
  "taxs/updateTaxSetup",
  async ({ id, taxData }, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.put(`/v1/tax-setup/${id}`, taxData),
        {
          loading: "Updating tax...",
          success: (res) => res.data.message || "Tax updated successfully!",
          error: "Failed to update tax",
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
        error.response?.data || { message: "Failed to update tax" }
      );
    }
  }
);

// ✅ Delete Tax
export const deleteTaxSetup = createAsyncThunk(
  "taxs/deleteTaxSetup",
  async (id, thunkAPI) => {
    try {
      const response = await apiClient.delete(`/v1/tax-setup/${id}`);
      return {
        data: { id },
        message: response.data.message || "Tax deleted successfully",
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || { message: "Failed to delete tax" }
      );
    }
  }
);

const taxsSlice = createSlice({
  name: "taxs",
  initialState: {
    taxs: {},
    pagination: null, // ✅ pagination meta store
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
      // ✅ Fetch
      .addCase(fetchTaxSetup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTaxSetup.fulfilled, (state, action) => {
        state.loading = false;
        state.taxs = action.payload.data || [];
        state.pagination = action.payload.meta || null;
      })
      .addCase(fetchTaxSetup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
        toast.error(action.payload.message || "Failed to fetch taxs");
      })

      // ✅ Add
      .addCase(addTaxSetup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addTaxSetup.fulfilled, (state, action) => {
        state.loading = false;
                state.taxs = {
                    ...state.taxs,
                    data: [action.payload.data, ...state.taxs.data]
                };
                state.success = action.payload.message;
      })
      .addCase(addTaxSetup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // ✅ Update
      .addCase(updateTaxSetup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTaxSetup.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.taxs?.data?.findIndex(
          (data) => data.id === action.payload.data.id
        );
        if (index !== -1) {
          state.taxs[index] = action.payload.data;
        } else {
          state.taxs = [action.payload.data, ...state.taxs];
        }
        state.success = action.payload.message;
      })
      .addCase(updateTaxSetup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // ✅ Delete
      .addCase(deleteTaxSetup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTaxSetup.fulfilled, (state, action) => {
         state.loading = false;
                const filterData = state.taxs.data.filter(
                    (data) => data.id !== action.payload.data.id
                );
                state.taxs = { ...state.taxs, data: filterData };
                state.success = action.payload.message;
        toast.success(action.payload.message || "Tax deleted successfully");
      })
      .addCase(deleteTaxSetup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
        toast.error(action.payload.message || "Failed to delete tax");
      });
  },
});

export const { clearMessages } = taxsSlice.actions;
export default taxsSlice.reducer;
