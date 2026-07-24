import axiosInstance from "@/api/axiosInstance";

import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

import { Address } from '@/types'
import { RootState } from "@/store/store";

interface AddressesState {
    address: Address[];
    loading: boolean;
    error: string | null;
  }
  
  const initialState: AddressesState = {
    address: [],
    loading: false,
    error: null,
  };
  
  // export const fetchAddresses = createAsyncThunk(
  //   "category/fetchAddreses",
  //   async (_, thunkAPI) => {
  //   const state = thunkAPI.getState() as RootState;  
  //   const userId = state.auth.user?._id;  
  //       if (!userId) {
  //         return thunkAPI.rejectWithValue('User not authenticated');
  //       }
  //     try {
  //       const response = await axiosInstance.get("/users/me");
  //       if (response.status === 200) {
  //       return response.data.data.users[0].addresses;
  //       }
  //     } catch (error: any) {
  //       return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to fetch categories");
  //     }
  //   }
  // );

  export const addAddress = createAsyncThunk(
    "addresses/addAddress",
    async (address: Address, thunkAPI) => {
    const state = thunkAPI.getState() as RootState;  
    const userId = state.auth.user?._id;  
    if (!userId) {
      return thunkAPI.rejectWithValue('User not authenticated');
    }
      try {
        const response = await axiosInstance.patch(`/users/customers/add-address/${userId}`, address);
        return response.data;  
      } catch (error: any) {
        return thunkAPI.rejectWithValue(error.response?.data?.message );
      }
    }
  );

  
  export const removeAddress = createAsyncThunk(
    "addresses/removeAddress",
    async (fullAddress: string, thunkAPI) => {
      const state = thunkAPI.getState() as RootState;  
      const userId = state.auth.user?._id;  
      if (!userId) {
        return thunkAPI.rejectWithValue('User not authenticated');
      }
      try {
        const payload = {
          address: fullAddress
        };
        const response = await axiosInstance.patch(`/users/customers/remove-address/${userId}`, payload);
        return response.data;
      } catch (error: any) {
        return thunkAPI.rejectWithValue(error.response?.data?.message);
      }
    }
  );
  
  export const addressesSlice = createSlice({
    name: "addresses",
    initialState,
    reducers: {
        setAddresses: (state, action: PayloadAction<Address[]>) => {
            state.address = action.payload;
          },
    },
    extraReducers: (builder) => {
      builder.addCase(addAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      });
      builder.addCase(addAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.address.push(action.payload);
      });
      builder.addCase(addAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = "Failed to add address";
      });
  
      builder.addCase(removeAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      });
      builder.addCase(removeAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.address = state.address.filter(
          (addr:any) => addr._id !== action.payload._id
        );
      });
      builder.addCase(removeAddress.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to remove address";
      });
    },
  });
  
  export const { setAddresses } = addressesSlice.actions;
  export default addressesSlice.reducer;