import { createSlice } from "@reduxjs/toolkit";

export const productSlide = createSlice({
  name: "cart",
  initialState: {
    quantity: 0,
  },
  reducers: {
    updateQuantity: (state) => {
      const cartList = JSON.parse(localStorage.getItem("cart")) || [];
      state.quantity = cartList
        .map((i) => i.quantity)
        .reduce((prev, cur) => prev + cur, 0);
    },
  },
});

export const { updateQuantity } = productSlide.actions;

export default productSlide.reducer;
