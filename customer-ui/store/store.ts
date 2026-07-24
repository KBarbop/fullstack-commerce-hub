import { configureStore } from "@reduxjs/toolkit";
import uiReducer from "./ui-slice/ui-slice";
import cartReducer from "./cart-slice/cart-slice";
import authReducer from "./auth-slice/auth-slice"; 
import categoryReducer from "./category-slice/category-slice"; 
import productReducer from "./product-slice/product-slice";  
import orderReducer from './orders-slice/orders-slice';
import addressesReducer  from "./addreses-slice/addresses-slice";



const store = configureStore({
  reducer: {
    ui: uiReducer,  
    cart: cartReducer,  
    auth: authReducer,
    category: categoryReducer,  
    product: productReducer,
    order: orderReducer,  
    address: addressesReducer  
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
