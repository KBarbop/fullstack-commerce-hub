import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axiosInstance from '@/api/axiosInstance';
import { User, AuthState, RegisterProps } from '@/types';

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
  success: false,
};

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }, thunkAPI) => {
    try {
      const response = await axiosInstance.post('/users/log-in', credentials);

      if (response.status === 200 && response.data.responseStatus === 'successfull') {
        const user = response.data.data.user;
        return user;
      } else {
        return thunkAPI.rejectWithValue('Login failed');
      }
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (credentials: RegisterProps, thunkAPI) => {
    try {
      const response = await axiosInstance.post('/users/customers/sign-up', credentials);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Registration failed');
    }
  }
);

export const editUserData = createAsyncThunk(
  'auth/editUserData',
  async (editedData: { username: string; firstName: string; lastName: string; _id: string }, thunkAPI) => {
    try {
      const response = await axiosInstance.patch(`/users/edit-user-data/${editedData._id}`, editedData);
      if (response.status === 200 && response.data.responseStatus === 'successfull') {
        return response.data.data.updatedUser;
      } else {
        return thunkAPI.rejectWithValue('Update failed');
      }
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Update failed');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, thunkAPI) => {
    try {
      const response = await axiosInstance.post('/users/log-out');
      if (response.status === 200) {
        return 'Logout successful';
      } else {
        return thunkAPI.rejectWithValue('Logout failed');
      }
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Logout failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User | null>) {
      state.user = action.payload;
    },
    logout(state) {
      state.user = null;
      state.success = false;
      state.error = null; 
    },
    resetSuccess(state) {
      state.success = false; 
    },
    resetError(state) {
      state.error = null; 
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null; 
        state.success = false; 
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.user = action.payload;
        state.success = true; 
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Login failed'; 
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(register.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Registration failed';
      })
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.success = false;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Logout failed';
      })
      .addCase(editUserData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editUserData.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.user = action.payload;
        state.success = true;
      })
      .addCase(editUserData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Update failed';
      });
  },
});

export const { logout, setUser, resetSuccess, resetError } = authSlice.actions;
export default authSlice.reducer;
