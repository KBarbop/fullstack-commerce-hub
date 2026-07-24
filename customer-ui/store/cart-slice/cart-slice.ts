import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product, CartItem,CartState } from "@/types";


const initialState: CartState = {
  items: [],
  totalQuantity: 0,
  totalAmount: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addProduct: (
      state,
      action: PayloadAction<{
        product: Product;
        quantity: number;
        selectedIngredients?:  Array<{
          option: string;
          index: number;
          en: string;
          el: string;
        }>
        selectedOptions?:Array<{
          group: string;
          options: Array<{ option: string; index: number; en: string; el: string }>;
        }>;
        totalPrice: number;
      }>
    ) => {
      const { product, quantity, selectedIngredients, selectedOptions, totalPrice } = action.payload;

      const existingItem = state.items.find((item) => item.product._id === product._id);

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({
          product,
          quantity,
          selectedIngredients,
          selectedOptions, 
        });
      }

      state.totalQuantity += quantity;
      state.totalAmount += totalPrice * quantity;
    },
    resetCart: (state) => {
      state.items = [];
      state.totalQuantity = 0;
      state.totalAmount = 0;
    },

    increaseQuantity: (state, action: PayloadAction<{ _id: string; price: number; selectedIngredients?: { [key: string]: { en: string; el: string } } }>) => {
      const { _id, price, selectedIngredients } = action.payload;
      const existingItem = state.items.find(
        (item) =>
          item.product._id === _id &&
          JSON.stringify(item.selectedIngredients) === JSON.stringify(selectedIngredients)
      );

      if (existingItem) {
        existingItem.quantity += 1;
        state.totalQuantity += 1;
        state.totalAmount += price;
      }
    },

    decreaseQuantity: (state, action: PayloadAction<{ _id: string; price: number; selectedIngredients?: { [key: string]: { en: string; el: string } } }>) => {
      const { _id, price, selectedIngredients } = action.payload;
      const existingItem = state.items.find(
        (item) =>
          item.product._id === _id &&
          JSON.stringify(item.selectedIngredients) === JSON.stringify(selectedIngredients)
      );

      if (existingItem) {
        if (existingItem.quantity > 1) {
          existingItem.quantity -= 1;
          state.totalQuantity -= 1;
          state.totalAmount -= price;
        } else {
          state.items = state.items.filter(
            (item) =>
              item.product._id !== _id ||
              JSON.stringify(item.selectedIngredients) !== JSON.stringify(selectedIngredients)
          );
          state.totalQuantity -= 1;
          state.totalAmount -= price;
        }
      }
    },
  },
});

export const { addProduct, resetCart, increaseQuantity, decreaseQuantity } = cartSlice.actions;
export default cartSlice.reducer;
