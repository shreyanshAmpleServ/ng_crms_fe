import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../utils/axiosConfig";
import toast from "react-hot-toast"; // ✅ toast added

// Fetch All Currencies
export const fetchCurrencies = createAsyncThunk(
    "currencies/fetchCurrencies",
    async (data, thunkAPI) => {
        try {
            const params = {};
            if (data?.is_active) params.is_active = data.is_active;
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
                return thunkAPI.rejectWithValue({
                    status: 404,
                    message: "Not found",
                });
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

const currenciesSlice = createSlice({
    name: "currencies",
    initialState: {
        currencies: [],
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
            .addCase(fetchCurrencies.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCurrencies.fulfilled, (state, action) => {
                state.loading = false;
                state.currencies = action.payload.data;
            })
            .addCase(fetchCurrencies.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
                toast.error(action.payload.message || "Failed to fetch currencies"); // ✅
            })
            .addCase(addCurrency.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addCurrency.fulfilled, (state, action) => {
                state.loading = false;
                state.currencies = [action.payload.data, ...state.currencies];
                state.success = action.payload.message;
                toast.success(action.payload.message || "Currency added successfully"); // ✅
            })
            .addCase(addCurrency.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
                toast.error(action.payload.message || "Failed to add currency"); // ✅
            })
            .addCase(updateCurrency.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateCurrency.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.currencies?.findIndex(
                    (currency) => currency.id === action.payload.data.id
                );
                if (index !== -1) {
                    state.currencies[index] = action.payload.data;
                } else {
                    state.currencies = [action.payload.data, ...state.currencies];
                }
                state.success = action.payload.message;
                toast.success(action.payload.message || "Currency updated successfully"); // ✅
            })
            .addCase(updateCurrency.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
                toast.error(action.payload.message || "Failed to update currency"); // ✅
            })
            .addCase(deleteCurrency.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteCurrency.fulfilled, (state, action) => {
                state.loading = false;
                state.currencies = state.currencies.filter(
                    (currency) => currency.id !== action.payload.data.id
                );
                state.success = action.payload.message;
                toast.success(action.payload.message || "Currency deleted successfully"); // ✅
            })
            .addCase(deleteCurrency.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
                toast.error(action.payload.message || "Failed to delete currency"); // ✅
            })
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
                state.error = action.payload.message;
                toast.error(action.payload.message || "Failed to fetch currency"); // ✅
            });
    },
});

export const { clearMessages } = currenciesSlice.actions;
export default currenciesSlice.reducer;
