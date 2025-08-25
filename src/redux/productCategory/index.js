import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../utils/axiosConfig";
import toast from "react-hot-toast"; // ✅ toast import

// ---------------- Thunks ---------------- //

// Fetch All Product Categories
export const fetchProductCategory = createAsyncThunk(
  "productCategories/fetchProductCategory",
  async (datas, thunkAPI) => {
    try {
      const params = {};
      if (datas?.search) params.search = datas?.search;
      if (datas?.page) params.page = datas?.page;
      if (datas?.size) params.size = datas?.size;

      const response = await apiClient.get("/v1/product-category", { params });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch product categories"
      );
    }
  }
);

// Add Product Category
export const addProductCategory = createAsyncThunk(
  "productCategories/addProductCategory",
  async (categoryData, thunkAPI) => {
    try {
      const response = await apiClient.post("/v1/product-category", categoryData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to add product category"
      );
    }
  }
);

// Update Product Category
export const updateProductCategory = createAsyncThunk(
  "productCategories/updateProductCategory",
  async ({ id, categoryData }, thunkAPI) => {
    try {
      const response = await apiClient.put(`/v1/product-category/${id}`, categoryData);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        return thunkAPI.rejectWithValue({
          status: 404,
          message: "Not found",
        });
      }
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to update product category"
      );
    }
  }
);

// Delete Product Category
export const deleteProductCategory = createAsyncThunk(
  "productCategories/deleteProductCategory",
  async (id, thunkAPI) => {
    try {
      const response = await apiClient.delete(`/v1/product-category/${id}`);
      return {
        data: { id },
        message: response.data.message || "Product category deleted successfully",
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to delete product category"
      );
    }
  }
);

// ---------------- Slice ---------------- //

const productCategoriesSlice = createSlice({
  name: "productCategories",
  initialState: {
    productCategories: {}, // ✅ maintain same structure
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
      .addCase(fetchProductCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.productCategories = action.payload.data;
      })
      .addCase(fetchProductCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
        toast.error(action.payload.message || "Failed to fetch product categories");
      })

      // Add
      .addCase(addProductCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addProductCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.productCategories = {
          ...state.productCategories,
          data: [action.payload.data, ...(state.productCategories?.data || [])],
        };
        state.success = action.payload.message;
        toast.success(action.payload.message || "Product category added successfully");
      })
      .addCase(addProductCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
        toast.error(action.payload.message || "Failed to add product category");
      })

      // Update
      .addCase(updateProductCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProductCategory.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.productCategories?.data?.findIndex(
          (category) => category.id === action.payload.data.id
        );
        if (index !== -1) {
          state.productCategories.data[index] = action.payload.data;
        } else {
          state.productCategories = {
            ...state.productCategories,
            data: [...(state.productCategories?.data || []), action.payload.data],
          };
        }
        state.success = action.payload.message;
        toast.success(action.payload.message || "Product category updated successfully");
      })
      .addCase(updateProductCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
        toast.error(action.payload.message || "Failed to update product category");
      })

      // Delete
      .addCase(deleteProductCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProductCategory.fulfilled, (state, action) => {
        state.loading = false;
        const filterData = state.productCategories.data.filter(
          (category) => category.id !== action.payload.data.id
        );
        state.productCategories = { ...state.productCategories, data: filterData };
        state.success = action.payload.message;
        toast.success(action.payload.message || "Product category deleted successfully");
      })
      .addCase(deleteProductCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
        toast.error(action.payload.message || "Failed to delete product category");
      });
  },
});

export const { clearMessages } = productCategoriesSlice.actions;
export default productCategoriesSlice.reducer;
