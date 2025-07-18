import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../utils/axiosConfig";
import toast from "react-hot-toast";

// Fetch All quoteTemplate
export const fetchquoteTemplate = createAsyncThunk(
  "quoteTemplate/fetchquoteTemplate",
  async (datas, thunkAPI) => {
    try {
      const response = await apiClient.get(`/v1/quote-template?search=${datas?.search || ""}&page=${datas?.page || ""}&size=${datas?.size || ""}&startDate=${datas?.startDate?.toISOString() || ""}&endDate=${datas?.endDate?.toISOString() || ""}`);
      return response.data; // Returns a list of order
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch quote template",
      );
    }
  },
);

// Add a quotation
export const addQuoteTemplate = createAsyncThunk(
  "quoteTemplate/addQuoteTemplate",
  async (orderData, thunkAPI) => {
   
    try {
      const response = await toast.promise(
        apiClient.post("/v1/quote-template", orderData),
        {
            loading: "Quote template creating...",
            success: (res) => res.data.message || "Quote template created successfully!",
            error: "Failed to create quote template",
        }
    );
      // const response = await apiClient.post("/v1/quote-template", orderData);
      // toast.success(response.data.message || "order created successfully");
      return response.data; // Returns the newly added order
    } catch (error) {
      toast.error(error.response?.data || "Failed to create quote template");
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to create quote template",
      );
    }
  },
);

// Update a quotation
export const updateQuoteTemplate = createAsyncThunk(
  "quoteTemplate/updateQuoteTemplate",
  async (orderData, thunkAPI) => {
    let id = orderData.id
    try {
      const response = await toast.promise(
        apiClient.put(`/v1/quote-template/${id}`, orderData?.data),
        {
          loading: "Quote template updating...",
          success: (res) => res.data.message || "Quote template updated successfully!",
          error: "Failed to update quote template",
        }
      );
      // const response = await apiClient.put(`/v1/quote-template/${id}`, orderData);
      // toast.success(response.data.message || "order updated successfully");
      return response.data; // Returns the updated order
    } catch (error) {
      if (error.response?.status === 404) {
        toast.error("order not found");
        return thunkAPI.rejectWithValue({
          status: 404,
          message: "quote template not found",
        });
      }
      toast.error(error.response?.data || "Failed to update quote template");
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to update quote template",
      );
    }
  },
);
// Delete a quotation
export const deleteQuoteTemplate = createAsyncThunk(
  "quoteTemplate/deleteQuoteTemplate",
  async (id, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.delete(`/v1/quote-template/${id}`),
        {
          loading: "Quote template deleting...",
          success: (res) => res.data.message || "Quote template deleted successfully!",
          error: "Failed to delete quote template",
        }
      );
      // const response = await apiClient.delete(`/v1/quote-template/${id}`);
      // toast.success(response.data.message || "order deleted successfully");
      return {
        data: { id },
        message: response.data.message || "quote template deleted successfully",
      };
    } catch (error) {
      toast.error( error.response?.data || "Failed to delete quoteTemplate");
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to delete quoteTemplate",
      );
    }
  },
);

// Fetch a Single order by ID
export const fetchOrderById = createAsyncThunk(
  "quoteTemplate/fetchOrderById",
  async (id, thunkAPI) => {
    try {
      const response = await apiClient.get(`/v1/quote-template/${id}`);
      return response.data; // Returns the order details
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch quote template",
      );
    }
  },
);


const quoteTemplateSlice = createSlice({
  name: "quoteTemplate",
  initialState: {
    quoteTemplate: {},
    templateDetails: null,
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
      .addCase(fetchquoteTemplate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchquoteTemplate.fulfilled, (state, action) => {
        state.loading = false;
        state.quoteTemplate = action.payload.data;
      })
      .addCase(fetchquoteTemplate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(addQuoteTemplate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addQuoteTemplate.fulfilled, (state, action) => {
        state.loading = false;
        // state.quoteTemplate = [action.payload.data, ...state.quoteTemplate];
        state.quoteTemplate = {...state.quoteTemplate , data: [ action.payload.data ,...state.quoteTemplate.data]};
        state.success = action.payload.message;
      })
      .addCase(addQuoteTemplate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(updateQuoteTemplate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateQuoteTemplate.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.quoteTemplate?.data?.findIndex(
          (data) => data.id === action.payload.data.id,
        );
        if (index !== -1) {
          state.quoteTemplate.data[index] = action.payload.data;
        } else {
          state.quoteTemplate ={...state.quoteTemplate , data: [ action.payload.data ,...state.quoteTemplate.data]};
        }
        state.success = action.payload.message;
      })
      .addCase(updateQuoteTemplate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(deleteQuoteTemplate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteQuoteTemplate.fulfilled, (state, action) => {
        state.loading = false;
        let filteredData = state.quoteTemplate.data.filter(
          (data) => data.id !== action.payload.data.id,
        );
        state.quoteTemplate = {...state.quoteTemplate,data:filteredData}
        state.success = action.payload.message;
      })
      .addCase(deleteQuoteTemplate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(fetchOrderById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.loading = false;
        state.templateDetails = action.payload.data;
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export const { clearMessages } = quoteTemplateSlice.actions;
export default quoteTemplateSlice.reducer;
