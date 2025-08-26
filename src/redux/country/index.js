import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../utils/axiosConfig";
import toast from "react-hot-toast"; // ✅ toast import

// Fetch All Countries
export const fetchCountries = createAsyncThunk(
  "countries/fetchCountries",
  async (data, thunkAPI) => {
    try {
      const params = {};
      if (data?.page) params.page = data.page;
      if (data?.size) params.size = data.size;
      if (data?.search) params.search = data.search;
      if (data?.is_active !== undefined) params.is_active = data.is_active;

      const response = await apiClient.get("/v1/countries", { params });
      return response.data; // ✅ return countries
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || { message: "Failed to fetch countries" }
      );
    }
  }
);

// Add a Country
export const addCountry = createAsyncThunk(
  "countries/addCountry",
  async (countryData, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.post("/v1/countries", countryData),
        {
          loading: "Adding country...",
          success: (res) => res.data.message || "Country added successfully!",
          error: "Failed to add country",
        }
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || { message: "Failed to add country" }
      );
    }
  }
);

// Update a Country
export const updateCountry = createAsyncThunk(
  "countries/updateCountry",
  async ({ id, countryData }, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.put(`/v1/countries/${id}`, countryData),
        {
          loading: "Updating country...",
          success: (res) => res.data.message || "Country updated successfully!",
          error: "Failed to update country",
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
        error.response?.data || { message: "Failed to update country" }
      );
    }
  }
);

// Delete a Country
export const deleteCountry = createAsyncThunk(
  "countries/deleteCountry",
  async (id, thunkAPI) => {
    try {
      const response = await apiClient.delete(`/v1/countries/${id}`);
      return {
        data: { id },
        message: response.data.message || "Country deleted successfully",
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || { message: "Failed to delete country" }
      );
    }
  }
);

// Fetch a Single Country by ID
export const fetchCountryById = createAsyncThunk(
  "countries/fetchCountryById",
  async (id, thunkAPI) => {
    try {
      const response = await apiClient.get(`/v1/countries/${id}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || { message: "Failed to fetch country" }
      );
    }
  }
);

const countriesSlice = createSlice({
  name: "countries",
  initialState: {
    countries: {},
    countryDetail: null,
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
      .addCase(fetchCountries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCountries.fulfilled, (state, action) => {
        state.loading = false;
        state.countries = action.payload.data;
      })
      .addCase(fetchCountries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
        toast.error(action.payload.message || "Failed to fetch countries");
      })

      // Add
      .addCase(addCountry.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addCountry.fulfilled, (state, action) => {
        state.loading = false;
                state.countries = {
                    ...state.countries,
                    data: [action.payload.data, ...state.countries.data]
                };
                state.success = action.payload.message;
                // toast.success(action.payload.message || "Countries add successfully");
      })
      .addCase(addCountry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Update
      .addCase(updateCountry.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCountry.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.countries?.data?.findIndex(
          (countryItem) => countryItem.id === action.payload.data.id
        );
        if (index !== -1) {
          state.countries[index] = action.payload.data;
        } else {
          state.countries = [action.payload.data, ...state.countries];
        }
        state.success = action.payload.message;
      })
      .addCase(updateCountry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Delete
      .addCase(deleteCountry.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCountry.fulfilled, (state, action) => {
        state.loading = false;
                const filterData = state.countries.data.filter(
                    (data) => data.id !== action.payload.data.id
                );
                state.countries = { ...state.countries, data: filterData };
                state.success = action.payload.message;
        toast.success(action.payload.message || "Country deleted successfully");
      })
      .addCase(deleteCountry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
        toast.error(action.payload.message || "Failed to delete country");
      })

      // Fetch Single
      .addCase(fetchCountryById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCountryById.fulfilled, (state, action) => {
        state.loading = false;
        state.countryDetail = action.payload.data;
      })
      .addCase(fetchCountryById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
        toast.error(action.payload.message || "Failed to fetch country");
      });
  },
});

export const { clearMessages } = countriesSlice.actions;
export default countriesSlice.reducer;
