import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../utils/axiosConfig";
import toast from "react-hot-toast";
import axios from "axios";

export const fetchAuditLog = createAsyncThunk(
  "order/fetchAuditLog",
  async (datas, thunkAPI) => {
    try {
      const params = {};
      if(datas.search) params.search = datas.search
      if(datas.page) params.page = datas.page
      if(datas.size) params.size = datas.size
      const response = await apiClient.get(`/v1/quotation-log/${datas.id}`,{params});
      return response.data; // Returns a list of order
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch quotation audit log",
      );
    }
  },
);


export const fetchComments = createAsyncThunk(
  "order/fetchComments",
  async ({id,token}, thunkAPI) => {
    const apiClient1 = axios.create({
      baseURL: process.env.REACT_APP_API_BASE_URL || "233", // Set your API base URL
      withCredentials: true,
    });
    try {
      const response = await apiClient1.get(`/v1/public-replies-msg/${id}`,{
        headers:{
          Authorization:`Bearer ${token}`}
       }
     );
      // const response = await apiClient.get(`/v1/replies-msg/${id}`);
      return response.data; // Returns a list of order
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch quotation audit log",
      );
    }
  },
);


export const sendComments = createAsyncThunk(
  "order/sendComments",
  async ({id,token,data}, thunkAPI) => {
    console.log("Token : ",token)
    const apiClient1 = axios.create({
      baseURL: process.env.REACT_APP_API_BASE_URL || "233", // Set your API base URL
      withCredentials: true,
    });
    try {
      const response = await apiClient1.post(`/v1/send-reply/${id}`,data, {
        headers:{
          Authorization:`Bearer ${token}`}
       }
     );
     return response.data; // Returns the order details
    //   const response = await toast.promise(
    //     apiClient.post("/v1/send-reply", orderData),
    //     {
    //         loading: "Quotation creating...",
    //         success: (res) => res.data.message || "Quotation created successfully!",
    //         error: "Failed to create quotation",
    //     }
    // );
    } catch (error) {
      toast.error(error.response?.data || "Failed to create comment");
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to create comment",
      );
    }
  },
);


// Fetch All orders
export const fetchorders = createAsyncThunk(
  "orders/fetchorders",
  async (datas, thunkAPI) => {
    try {
      const response = await apiClient.get(`/v1/order?search=${datas?.search || ""}&page=${datas?.page || ""}&size=${datas?.size || ""}&startDate=${datas?.startDate?.toISOString() || ""}&endDate=${datas?.endDate?.toISOString() || ""}`);
      return response.data; // Returns a list of order
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch order",
      );
    }
  },
);

// Add a order
export const addOrder = createAsyncThunk(
  "orders/addOrder",
  async (orderData, thunkAPI) => {
   
    try {
      const response = await toast.promise(
        apiClient.post("/v1/order", orderData),
        {
            loading: " Order creating...",
            success: (res) => res.data.message || "Order created successfully!",
            error: "Failed to create order",
        }
    );
      // const response = await apiClient.post("/v1/order", orderData);
      // toast.success(response.data.message || "order created successfully");
      return response.data; // Returns the newly added order
    } catch (error) {
      toast.error(error.response?.data || "Failed to create order");
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to create order",
      );
    }
  },
);

// Update a order
export const updateOrder = createAsyncThunk(
  "orders/updateOrder",
  async (orderData, thunkAPI) => {
    let id = orderData.get("id")
    try {
      const response = await toast.promise(
        apiClient.put(`/v1/order/${id}`, orderData),
        {
          loading: " order updating...",
          success: (res) => res.data.message || "order updated successfully!",
          error: "Failed to update order",
        }
      );
      // const response = await apiClient.put(`/v1/order/${id}`, orderData);
      // toast.success(response.data.message || "order updated successfully");
      return response.data; // Returns the updated order
    } catch (error) {
      if (error.response?.status === 404) {
        toast.error("order not found");
        return thunkAPI.rejectWithValue({
          status: 404,
          message: "order not found",
        });
      }
      toast.error(error.response?.data || "Failed to update order");
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to update order",
      );
    }
  },
);

// Delete a order
export const deleteOrder = createAsyncThunk(
  "orders/deleteOrder",
  async (id, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.delete(`/v1/order/${id}`),
        {
          loading: " Order deleting...",
          success: (res) => res.data.message || "Order deleted successfully!",
          error: "Failed to delete order",
        }
      );
      // const response = await apiClient.delete(`/v1/order/${id}`);
      // toast.success(response.data.message || "order deleted successfully");
      return {
        data: { id },
        message: response.data.message || "order deleted successfully",
      };
    } catch (error) {
      toast.error( error.response?.data || "Failed to delete order");
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to delete order",
      );
    }
  },
);
// Delete a order
export const syncOrderToInvoice = createAsyncThunk(
  "orders/syncOrderToInvoice",
  async (id, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.get(`/v1/sync-to-invoice`),
        // apiClient.delete(`/v1/sync-to-invoice/${id}`),
        {
          loading: " Order Syncing...",
          success: (res) => res.data.message || "Order synced in invoice successfully!",
          error: "Failed to sync order in invoice",
        }
      );
      // const response = await apiClient.delete(`/v1/order/${id}`);
      // toast.success(response.data.message || "order deleted successfully");
      return {
        data: { id },
        message: response.data.message || "Order synced in invoice successfully",
      };
    } catch (error) {
      toast.error( error.response?.data || "Failed to Order synced in invoice");
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to Order synced in invoice",
      );
    }
  },
);

// Fetch a Single order by ID
export const fetchOrderById = createAsyncThunk(
  "orders/fetchOrderById",
  async (id, thunkAPI) => {
    try {
      const response = await apiClient.get(`/v1/order/${id}`);
      return response.data; // Returns the order details
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch order",
      );
    }
  },
);
// Fetch a Sales Type
export const fetchSalesType = createAsyncThunk(
  "orders/fetchSalesType",
  async (_, thunkAPI) => {
    try {
      const response = await apiClient.get(`/v1/sales-types`);
      return response.data; // Returns the order details
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch sales type",
      );
    }
  },
);
// Fetch a Generated Order Code
export const fetchOrderCode = createAsyncThunk(
  "orders/fetchOrderCode",
  async (_, thunkAPI) => {
    try {
      const response = await apiClient.get(`/v1/get-order-code`);
      return response.data; // Returns the order details
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch order code",
      );
    }
  },
);

const ordersSlice = createSlice({
  name: "orders",
  initialState: {
    orders: {},
    orderDetail: null,
    salesTypes:[],
    orderCode:null,
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
      .addCase(fetchorders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchorders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.data;
      })
      .addCase(fetchorders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(addOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addOrder.fulfilled, (state, action) => {
        state.loading = false;
        // state.orders = [action.payload.data, ...state.orders];
        state.orders = {...state.orders , data: [ action.payload.data ,...state.orders.data]};
        state.success = action.payload.message;
      })
      .addCase(addOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(updateOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOrder.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.orders?.data?.findIndex(
          (data) => data.id === action.payload.data.id,
        );
        if (index !== -1) {
          state.orders.data[index] = action.payload.data;
        } else {
          state.orders ={...state.orders , data: [ action.payload.data ,...state.orders.data]};
        }
        state.success = action.payload.message;
      })
      .addCase(updateOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(deleteOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.loading = false;
        let filteredData = state.orders.data.filter(
          (data) => data.id !== action.payload.data.id,
        );
        state.orders = {...state.orders,data:filteredData}
        state.success = action.payload.message;
      })
      .addCase(deleteOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(syncOrderToInvoice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(syncOrderToInvoice.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message;
      })
      .addCase(syncOrderToInvoice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(fetchOrderById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.loading = false;
        state.orderDetail = action.payload.data;
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(fetchSalesType.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSalesType.fulfilled, (state, action) => {
        state.loading = false;
        state.salesTypes = action.payload.data;
      })
      .addCase(fetchSalesType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(fetchOrderCode.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderCode.fulfilled, (state, action) => {
        state.loading = false;
        state.orderCode = action.payload.data;
      })
      .addCase(fetchOrderCode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
       .addCase(fetchComments.pending, (state) => {
              state.loading = true;
              state.error = null;
            })
            .addCase(fetchComments.fulfilled, (state, action) => {
              state.loading = false;
              state.comments = action.payload.data;
            })
            .addCase(fetchComments.rejected, (state, action) => {
              state.loading = false;
              state.error = action.payload.message;
            })
            .addCase(sendComments.pending, (state) => {
                    state.loading = true;
                    state.error = null;
                  })
                  .addCase(sendComments.fulfilled, (state, action) => {
                    state.loading = false;
                    // state.order = [action.payload.data, ...state.order];
                    state.comments = {...state.comments , data: [ action.payload.data ,...state?.comments?.data]};
                    state.success = action.payload.message;
                  })
                  .addCase(sendComments.rejected, (state, action) => {
                    state.loading = false;
                    state.error = action.payload.message;
                  })
  },
});

export const { clearMessages } = ordersSlice.actions;
export default ordersSlice.reducer;
