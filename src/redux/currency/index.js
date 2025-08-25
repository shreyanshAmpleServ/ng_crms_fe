import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../utils/axiosConfig";
import toast from "react-hot-toast";

// ---------------- Thunks ---------------- //

// Fetch All Currencies
export const fetchCurrencies = createAsyncThunk(
  "currencies/fetchCurrencies",
  async (datas, thunkAPI) => {
    try {
      const params = {};
      if (datas?.page) params.page = datas.page;
      if (datas?.size) params.size = datas.size;
      if (datas?.search) params.search = datas.search;
      if (datas?.is_active !== undefined) params.is_active = datas.is_active;

      const response = await apiClient.get("/v1/currencies", { params });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch currencies"
      );
    }
  }
);

// Add a Currency
export const addCurrency = createAsyncThunk(
  "currencies/addCurrency",
  async (currencyData, thunkAPI) => {
    try {
      const response = await apiClient.post("/v1/currencies", currencyData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to add currency"
      );
    }
  }
);

// Update a Currency
export const updateCurrency = createAsyncThunk(
  "currencies/updateCurrency",
  async ({ id, currencyData }, thunkAPI) => {
    try {
      const response = await apiClient.put(`/v1/currencies/${id}`, currencyData);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        return thunkAPI.rejectWithValue({ status: 404, message: "Not found" });
      }
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to update currency"
      );
    }
  }
);

// Delete a Currency
export const deleteCurrency = createAsyncThunk(
  "currencies/deleteCurrency",
  async (id, thunkAPI) => {
    try {
      const response = await apiClient.delete(`/v1/currencies/${id}`);
      return {
        data: { id },
        message: response.data.message || "Currency deleted successfully",
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to delete currency"
      );
    }
  }
);

// Fetch a Single Currency by ID
export const fetchCurrencyById = createAsyncThunk(
  "currencies/fetchCurrencyById",
  async (id, thunkAPI) => {
    try {
      const response = await apiClient.get(`/v1/currencies/${id}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch currency"
      );
    }
  }
);

// ---------------- Slice ---------------- //

const currenciesSlice = createSlice({
  name: "currencies",
  initialState: {
    currencies: {}, // ✅ keep as object with data array
    currencyDetail: null,
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
      // Fetch All
      .addCase(fetchCurrencies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrencies.fulfilled, (state, action) => {
        state.loading = false;
        state.currencies = action.payload.data || { data: [] };
      })
      .addCase(fetchCurrencies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
        toast.error(action.payload?.message || "Failed to fetch currencies");
      })

      // Add
      .addCase(addCurrency.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addCurrency.fulfilled, (state, action) => {
        state.loading = false;
        state.currencies = {
          ...state.currencies,
          data: [action.payload.data, ...state.currencies.data],
        };
        state.success = action.payload.message;
        toast.success(action.payload.message || "Currency added successfully");
      })
      .addCase(addCurrency.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
        toast.error(action.payload?.message || "Failed to add currency");
      })

      // Update
      .addCase(updateCurrency.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCurrency.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.currencies.data.findIndex(
          (c) => c.id === action.payload.data.id
        );
        if (index !== -1) {
          state.currencies.data[index] = action.payload.data;
        } else {
          state.currencies = {
            ...state.currencies,
            data: [action.payload.data, ...state.currencies.data],
          };
        }
        state.success = action.payload.message;
        toast.success(action.payload.message || "Currency updated successfully");
      })
      .addCase(updateCurrency.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
        toast.error(action.payload?.message || "Failed to update currency");
      })

      // Delete
      .addCase(deleteCurrency.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCurrency.fulfilled, (state, action) => {
        state.loading = false;
        state.currencies = {
          ...state.currencies,
          data: state.currencies.data.filter(
            (c) => c.id !== action.payload.data.id
          ),
        };
        state.success = action.payload.message;
        toast.success(action.payload.message || "Currency deleted successfully");
      })
      .addCase(deleteCurrency.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
        toast.error(action.payload?.message || "Failed to delete currency");
      })

      // Fetch by ID
      .addCase(fetchCurrencyById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrencyById.fulfilled, (state, action) => {
        state.loading = false;
        state.currencyDetail = action.payload.data;
      })
      .addCase(fetchCurrencyById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
        toast.error(action.payload?.message || "Failed to fetch currency");
      });
  },
});

export const { clearMessages } = currenciesSlice.actions;
export default currenciesSlice.reducer;
