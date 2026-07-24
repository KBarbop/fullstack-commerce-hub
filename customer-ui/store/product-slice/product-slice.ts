import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "@/types";
import axiosInstance from "@/api/axiosInstance";
import {processProductData} from '@/util/fetchProductsBySlug'
interface ProductState {
  products: Product[];
  productDetails: Product[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  products: [],
  productDetails: [],
  loading: false,
  error: null,
};

export const fetchProducts = createAsyncThunk(
  "product/fetchProducts",
  async (_, thunkAPI) => {
    try {
      const response = await axiosInstance.get("/products/get-products");
      if (response.status === 200) {
        const productsWithSlugs = response.data.data.products.map(processProductData);
        return productsWithSlugs;
      }
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch products"
      );
    }
  }
);

// export const getProductById = createAsyncThunk(
//   "product/getProductById",
//   async (productIds:string[], thunkAPI) => {
//     try {
//       const responses = await Promise.all(
//         productIds.map(id => axiosInstance.get(`/products/${id}`))
//       );
//       return responses.map(response => response.data); 
//     } catch (error: any) {
//       return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch product by id');
//     }
//   }
// );


const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setProducts(state, action: PayloadAction<Product[]>) {
      state.products = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // .addCase(getProductById.pending, (state) => {
      //   state.loading = true;
      //   state.error = null
      // })
      // .addCase(getProductById.fulfilled,(state,action) => {
      //   state.loading = false;
      //   state.productDetails = action.payload;
      // })
      // .addCase(getProductById.rejected,(state,action) => {
      //   state.loading = false;
      //   state.error = action.payload as string || "Failed to fetch product by id"
      // })
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
        state.loading = false;
        state.products = action.payload; 
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || "Failed to fetch products";
      });
  },
});

export const { setProducts } = productSlice.actions;
export default productSlice.reducer;