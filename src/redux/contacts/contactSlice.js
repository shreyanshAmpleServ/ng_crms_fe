import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../utils/axiosConfig';
import toast from 'react-hot-toast';

// Fetch All Contacts
export const fetchContacts = createAsyncThunk(
  'contacts/fetchContacts',
  async (datas, thunkAPI) => {
    try {
      const response = await apiClient.get(`/v1/contacts?search=${datas?.search || ""}&page=${datas?.page || ""}&size=${datas?.size || ""}&startDate=${datas?.startDate?.toISOString() || ""}&endDate=${datas?.endDate?.toISOString() || ""}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || 'Failed to fetch contacts');
    }
  }
);

// Add a Contact
export const addContact = createAsyncThunk(
  'contacts/addContact',
  async (contactData, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.post('/v1/contacts', contactData),
        {
          loading: "Contact adding...",
          success: (res) => res.data.message || "Contact added successfully!",
          error: "Failed to add contact",
        }
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || 'Failed to add contact');
    }
  }
);

// Update a Contact
export const updateContact = createAsyncThunk(
  'contacts/updateContact',
  async (contactData, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.put(`/v1/contacts/${contactData.get('id')}`, contactData),
        {
          loading: "Contact updating...",
          success: (res) => res.data.message || "Contact updated successfully!",
          error: "Failed to update contact",
        }
      );
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        return thunkAPI.rejectWithValue({
          status: 404,
          message: 'Not found',
        });
      }
      return thunkAPI.rejectWithValue(error.response?.data || 'Failed to update contact');
    }
  }
);

// ✅ Delete a Contact with toast
export const deleteContact = createAsyncThunk(
  'contacts/deleteContact',
  async (id, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.delete(`/v1/contacts/${id}`),
        {
          loading: 'Deleting contact...',
          success: (res) => res.data.message || 'Contact deleted successfully!',
          error: 'Failed to delete contact',
        }
      );
      return {
        data: { id },
        message: response.data.message || 'Contact deleted successfully',
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || 'Failed to delete contact');
    }
  }
);

// Fetch a Single Contact by ID
export const fetchContactById = createAsyncThunk(
  'contacts/fetchContactById',
  async (id, thunkAPI) => {
    try {
      const response = await apiClient.get(`/v1/contacts/${id}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || 'Failed to fetch contact');
    }
  }
);

const contactsSlice = createSlice({
  name: 'contacts',
  initialState: {
    contacts: {},
    contactDetail: null,
    loading: false,
    error: false,
    success: false
  },
  reducers: {
    clearMessages(state) {
      state.error = null;
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchContacts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContacts.fulfilled, (state, action) => {
        state.loading = false;
        state.contacts = action.payload.data;
      })
      .addCase(fetchContacts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })
      .addCase(addContact.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addContact.fulfilled, (state, action) => {
        state.loading = false;
        state.contacts = {
          ...state.contacts,
          data: [action.payload.data, ...state.contacts.data],
        };
        state.success = action.payload.message;
      })
      .addCase(addContact.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(updateContact.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateContact.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.contacts.data?.findIndex(
          (contact) => contact.id === action.payload.data.id
        );
        if (index !== -1) {
          state.contacts.data[index] = action.payload.data;
        } else {
          state.contacts = {
            ...state.contacts,
            data: [action.payload.data, ...state.contacts.data],
          };
        }
        state.success = action.payload.message;
      })
      .addCase(updateContact.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(deleteContact.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteContact.fulfilled, (state, action) => {
        state.loading = false;
        const filteredData = state.contacts.data.filter(
          (data) => data.id !== action.payload.data.id
        );
        state.contacts = { ...state.contacts, data: filteredData };
        state.success = action.payload.message;
      })
      .addCase(deleteContact.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(fetchContactById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContactById.fulfilled, (state, action) => {
        state.loading = false;
        state.contactDetail = action.payload.data;
      })
      .addCase(fetchContactById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export const { clearMessages } = contactsSlice.actions;
export default contactsSlice.reducer;
