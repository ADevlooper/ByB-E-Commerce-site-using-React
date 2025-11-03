import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  wishlist: (() => {
    const saved = localStorage.getItem('wishlist');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
    return [];
  })(),
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    toggleWishlist: (state, action) => {
      const productId = action.payload;
      const index = state.wishlist.indexOf(productId);
      if (index > -1) {
        state.wishlist.splice(index, 1);
      } else {
        state.wishlist.push(productId);
      }
      localStorage.setItem('wishlist', JSON.stringify(state.wishlist));
    },
    addToWishlist: (state, action) => {
      if (!state.wishlist.includes(action.payload)) {
        state.wishlist.push(action.payload);
        localStorage.setItem('wishlist', JSON.stringify(state.wishlist));
      }
    },
    removeFromWishlist: (state, action) => {
      const index = state.wishlist.indexOf(action.payload);
      if (index > -1) {
        state.wishlist.splice(index, 1);
        localStorage.setItem('wishlist', JSON.stringify(state.wishlist));
      }
    },
  },
});

export const { toggleWishlist, addToWishlist, removeFromWishlist } = wishlistSlice.actions;

export const selectWishlist = (state) => state.wishlist.wishlist;

export const selectIsInWishlist = (state, productId) => state.wishlist.wishlist.includes(productId);

export default wishlistSlice.reducer;
