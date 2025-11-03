import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  cart: (() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      const parsed = JSON.parse(savedCart);
      return parsed.map(item => ({ ...item, quantity: Number(item.quantity) || 1 }));
    }
    return [];
  })(),
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const product = action.payload;
      const existingItem = state.cart.find(item =>
        item.id === product.id &&
        item.selectedColor === product.selectedColor &&
        item.selectedModel === product.selectedModel
      );

      if (existingItem) {
        existingItem.quantity += product.quantity;
      } else {
        state.cart.push(product);
      }
      localStorage.setItem('cart', JSON.stringify(state.cart));
    },
    removeFromCart: (state, action) => {
      state.cart = state.cart.filter(item => item.id !== action.payload);
      localStorage.setItem('cart', JSON.stringify(state.cart));
    },
    updateQuantity: (state, action) => {
      const { productId, newQuantity } = action.payload;
      if (newQuantity < 1) return;
      const item = state.cart.find(item => item.id === productId);
      if (item) {
        item.quantity = newQuantity;
        localStorage.setItem('cart', JSON.stringify(state.cart));
      }
    },
    clearCart: (state) => {
      state.cart = [];
      localStorage.removeItem('cart');
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;

export const selectCart = (state) => state.cart.cart;

export const selectOrderSummary = (state) => {
  const cart = state.cart.cart;
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 100 ? 0 : 10;
  const tax = subtotal * 0.1;
  const discount = subtotal > 200 ? subtotal * 0.05 : 0;
  const total = subtotal + shipping + tax - discount;

  return {
    subtotal: parseFloat(subtotal.toFixed(2)),
    shipping: parseFloat(shipping.toFixed(2)),
    tax: parseFloat(tax.toFixed(2)),
    discount: parseFloat(discount.toFixed(2)),
    total: parseFloat(total.toFixed(2)),
    itemCount: cart.reduce((sum, item) => sum + item.quantity, 0),
    freeShippingThreshold: 100,
    discountThreshold: 200,
    discountRate: 5,
    taxRate: 10
  };
};

export default cartSlice.reducer;
