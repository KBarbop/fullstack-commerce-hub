import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "./store";

// Category Selectors
export const selectCategories = (state: RootState) => state.category.categories;
export const selectSelectedCategoryId = (state: RootState) => state.category.selectedCategoryId;
export const selectProducts = (state: RootState) => state.product.products;

export const selectProductsByCategory = createSelector(
  [selectProducts, selectCategories, selectSelectedCategoryId],
  (products, categories, selectedCategoryId) => {
    if (!selectedCategoryId) return [];
    const selectedCategory = categories.find((category) => category._id === selectedCategoryId);
    if (!selectedCategory) return [];
    return products.filter((product) => product.category === selectedCategory.title_en);
  }
);

// Cart Selectors
export const selectCartItems = (state: RootState) => state.cart.items;

export const selectTotalQuantity = createSelector(
  [selectCartItems],
  (items) => items.reduce((total, item) => total + item.quantity, 0)
);

export const selectTotalAmount = createSelector(
  [selectCartItems],
  (items) => items.reduce((total, item) => total + item.product.price * item.quantity, 0)
);
