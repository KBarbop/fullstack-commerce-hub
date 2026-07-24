import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Notification {
  status: string;
  title: string;
  message: string;
}

interface UIState {
  cartIsVisible: boolean;
  notification: Notification | null;
}

const initialState: UIState = {
  cartIsVisible: false,
  notification: null,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggle(state) {
      state.cartIsVisible = !state.cartIsVisible;
    },
    showNotification(state, action: PayloadAction<Notification>) {
      state.notification = {
        status: action.payload.status,
        title: action.payload.title,
        message: action.payload.message,
      };
    },
  },
});

export const uiActions = uiSlice.actions;

export default uiSlice.reducer;
