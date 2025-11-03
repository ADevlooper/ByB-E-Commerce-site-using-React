import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleWishlist, selectIsInWishlist } from '../redux/wishlistSlice';

function WishlistButton({ productId }) {
  const dispatch = useDispatch();
  const isInWishlist = useSelector((state) => selectIsInWishlist(state, productId));

  const handleToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(toggleWishlist(productId));
  };

  return (
    <button
      onClick={handleToggle}
      className={`p-2 rounded-lg border transition-colors ${
        isInWishlist
          ? 'bg-red-100 text-red-800 border-red-800'
          : 'bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200'
      }`}
    >
      ♥
    </button>
  );
}

export default WishlistButton;
