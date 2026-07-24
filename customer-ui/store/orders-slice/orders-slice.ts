import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axiosInstance from '@/api/axiosInstance';
import { Order, OrderResponse } from '@/types/order'; 
import { RootState } from '../store';
interface OrderState {
  orderList: Order[];  
  currentOrder: Order | null;
  loading: boolean;
  error: string | null;
  success: boolean | null;
}


const initialState: OrderState = {
  orderList: [],       
  currentOrder: null,  
  loading: false,       
  error: null,   
  success:null   
};


export const fetchOrders = createAsyncThunk(
  'order/fetchOrders',
  async (_, thunkAPI) => {
    const state = thunkAPI.getState() as RootState;
    const userId = state.auth.user?._id;   
    if (!userId) {
      return thunkAPI.rejectWithValue('User not authenticated');
    }
    try {
    const response = await axiosInstance.get(`/orders/get-orders-by-user/${userId}`);
    return response.data;
    }catch (error:any){
      return thunkAPI.rejectWithValue(error.response?.data?.message );
    }
  }
);

export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (orderData: any, thunkAPI) => {
    try {
      const response = await axiosInstance.post('/orders/create-new-order', orderData);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Order creation failed');
    }
  }
);


const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action: PayloadAction<OrderResponse>) => {
        state.loading = false;
        state.orderList = action.payload.data.orders; 
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch orders';
      })
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder  = action.payload;
        state.success = true;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Order creation failed';
      });
  },
});

export default orderSlice.reducer;
