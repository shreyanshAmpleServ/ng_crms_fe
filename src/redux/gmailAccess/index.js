import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../utils/axiosConfig";

// Industry Slice

// Fetch All Industries
export const fetchCheckAuth = createAsyncThunk(
  "gmailMessage/fetchCheckAuth",
  async (_, thunkAPI) => {
    try {
      const response = await apiClient.get("/v1/gmail/check");
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch industries"
      );
    }
  }
);
export const getAllMessage = createAsyncThunk(
  "gmailMessage/getAllMessage",
  async (id, thunkAPI) => {
    try {
      const  params = {}
      if(id) params.id = id 
      const response = await apiClient.get("/v1/gmail/message",{params});
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch industries"
      );
    }
  }
);

// Add an Industry
export const sendMail = createAsyncThunk(
  "gmailMessage/sendMail",
  async (data, thunkAPI) => {
    try {
      const response = await apiClient.post("/v1/gmail/send", data);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to add industry"
      );
    }
  }
);

// Update an Industry
export const fetchGmailURL = createAsyncThunk(
  "gmailMessage/fetchGmailURL",
  async (_, thunkAPI) => {
    try {
      const response = await apiClient.get(`/v1/gmail/url`);
      return response;
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
  "gmailMessage/deleteIndustry",
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

const gmailMessageSlice = createSlice({
  name: "gmailMessage",
  initialState: {
    gmailMessage: {},
    gmailUrl: {},
    gmailCheck: {},
    sendMails:{},
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
      .addCase(fetchCheckAuth.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCheckAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.gmailCheck = action.payload.data;
      })
      .addCase(fetchCheckAuth.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(getAllMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllMessage.fulfilled, (state, action) => {
        state.loading = false;
        state.gmailMessage = action.payload.data;
      })
      .addCase(getAllMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(sendMail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendMail.fulfilled, (state, action) => {
        state.loading = false;
        state.sendMails = action.payload.data;
        state.success = action.payload.message;
      })
      .addCase(sendMail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(fetchGmailURL.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGmailURL.fulfilled, (state, action) => {
        state.loading = false;
        state.gmailUrl = action.payload.data;
        state.success = action.payload.message;
      })
      .addCase(fetchGmailURL.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(deleteIndustry.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteIndustry.fulfilled, (state, action) => {
        state.loading = false;
        state.industries = state.industries.filter(
          (industry) => industry.id !== action.payload.data.id
        );
        state.success = action.payload.message;
      })
      .addCase(deleteIndustry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export const { clearMessages } = gmailMessageSlice.actions;
export default gmailMessageSlice.reducer;
