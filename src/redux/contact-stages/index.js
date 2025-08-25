import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../utils/axiosConfig";
import toast from "react-hot-toast"; // ✅ Toast added

// ---------------- Thunks ---------------- //

// Fetch All Contact Stages
export const fetchContactStages = createAsyncThunk(
  "contactStages/fetchContactStages",
  async (datas, thunkAPI) => {
    try {
      const params = {};
      if (datas?.search) params.search = datas.search;
      if (datas?.page) params.page = datas.page;
      if (datas?.size) params.size = datas.size;

      const response = await apiClient.get("/v1/contact-stages", { params });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch contact stages"
      );
    }
  }
);

// Add Contact Stage
export const addContactStage = createAsyncThunk(
  "contactStages/addContactStage",
  async (contactStageData, thunkAPI) => {
    try {
      const response = await apiClient.post("/v1/contact-stages", contactStageData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to add contact stage"
      );
    }
  }
);

// Update Contact Stage
export const updateContactStage = createAsyncThunk(
  "contactStages/updateContactStage",
  async ({ id, contactStageData }, thunkAPI) => {
    try {
      const response = await apiClient.put(`/v1/contact-stages/${id}`, contactStageData);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        return thunkAPI.rejectWithValue({
          status: 404,
          message: "Not found",
        });
      }
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to update contact stage"
      );
    }
  }
);

// Delete Contact Stage
export const deleteContactStage = createAsyncThunk(
  "contactStages/deleteContactStage",
  async (id, thunkAPI) => {
    try {
      const response = await apiClient.delete(`/v1/contact-stages/${id}`);
      return {
        data: { id },
        message: response.data.message || "Contact stage deleted successfully",
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to delete contact stage"
      );
    }
  }
);

// Fetch Single Contact Stage by ID
export const fetchContactStageById = createAsyncThunk(
  "contactStages/fetchContactStageById",
  async (id, thunkAPI) => {
    try {
      const response = await apiClient.get(`/v1/contact-stages/${id}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch contact stage"
      );
    }
  }
);

// ---------------- Slice ---------------- //

const contactStagesSlice = createSlice({
  name: "contactStages",
  initialState: {
    contactStages: {},       // ✅ direct array
    contactStageDetail: null,
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
      .addCase(fetchContactStages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContactStages.fulfilled, (state, action) => {
        state.loading = false;
        state.contactStages = action.payload.data || [];
      })
      .addCase(fetchContactStages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
        toast.error(action.payload?.message || "Failed to fetch contact stages");
      })

      // Add
      .addCase(addContactStage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addContactStage.fulfilled, (state, action) => {
        state.loading = false;
    state.loading = false;
        // state.contactStages = [action.payload.data, ...state.contactStages];
        state.contactStages = {...state.contactStages , data: [ action.payload.data ,...state.contactStages.data]};
        state.success = action.payload.message;

        toast.success(action.payload.message || "Contact stage added successfully");
      })
      .addCase(addContactStage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
        toast.error(action.payload?.message || "Failed to add contact stage");
      })

      // Update
      .addCase(updateContactStage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateContactStage.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.contactStages?.data?.findIndex(
          (data) => data.id === action.payload.data.id,
        );
        if (index !== -1) {
          state.contactStages.data[index] = action.payload.data;
        } else {
          state.contactStages ={...state.contactStages , data: [ action.payload.data ,...state.contactStages.data]};
        }
        state.success = action.payload.message;
        toast.success(action.payload.message || "Contact stage updated successfully");
      })
      .addCase(updateContactStage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
        toast.error(action.payload?.message || "Failed to update contact stage");
      })

      // Delete
      .addCase(deleteContactStage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteContactStage.fulfilled, (state, action) => {
          state.loading = false;
        let filteredData = state.contactStages.data.filter(
          (data) => data.id !== action.payload.data.id,
        );
        state.contactStages = {...state.contactStages,data:filteredData}
        state.success = action.payload.message;
      
        toast.success(action.payload.message || "Contact stage deleted successfully");
      })
      .addCase(deleteContactStage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
        toast.error(action.payload?.message || "Failed to delete contact stage");
      })

      // Fetch by ID
      .addCase(fetchContactStageById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContactStageById.fulfilled, (state, action) => {
        state.loading = false;
        state.contactStageDetail = action.payload.data;
      })
      .addCase(fetchContactStageById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
        toast.error(action.payload?.message || "Failed to fetch contact stage");
      });
  },
});

export const { clearMessages } = contactStagesSlice.actions;
export default contactStagesSlice.reducer;
