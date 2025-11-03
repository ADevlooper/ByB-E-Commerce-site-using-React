import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectCart, selectOrderSummary, removeFromCart, updateQuantity } from '../redux/cartSlice';
import { Link, useNavigate } from 'react-router-dom';
import Toaster from '../components/toaster';

function Cart() {
  const dispatch = useDispatch();
  const cart = useSelector(selectCart);
  const summary = useSelector(selectOrderSummary);
  const navigate = useNavigate();
  const [toaster, setToaster] = useState(null);

  const showToaster = (message) => {
    setToaster(message);
    setTimeout(() => setToaster(null), 3000);
  };

  return (
    <div className="container px-8 py-8 max-w-screen-2xl">
      {cart.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">Your cart is empty</p>
          <Link
            to="/products"
            className="inline-block bg-red-800 text-white px-6 py-2 rounded-md hover:bg-red-900"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div>
          <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="space-y-4">
              {cart.map(item => (
                <div key={item.id} className="flex items-center gap-4">
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm">{item.title}</h3>
                    <div className="text-xs text-gray-600">
                      <span>Qty: {item.quantity}</span>
                      <span className="ml-4">${item.price} each</span>
                    </div>
                    <div className="flex items-center gap-4 mt-2 mb-4">
                      <div className="flex items-center border rounded">
                        <button
                          onClick={() => dispatch(updateQuantity({ productId: item.id, newQuantity: item.quantity - 1 }))}
                          className="px-1 py-0 hover:bg-gray-100"
                        >
                          -
                        </button>
                        <span className="px-1 py-0 border-x">{item.quantity}</span>
                        <button
                          onClick={() => dispatch(updateQuantity({ productId: item.id, newQuantity: item.quantity + 1 }))}
                          className="px-1 py-0 hover:bg-gray-100"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => {
                          dispatch(removeFromCart(item.id));
                          showToaster(`${item.title} removed from cart`);
                        }}
                        className="text-red-800 hover:text-red-900 transition-colors p-1 flex items-center justify-center"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${summary.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>${summary.shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>${summary.tax.toFixed(2)}</span>
              </div>
              {summary.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-${summary.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-lg border-t mt-6 pt-2">
                <span>Total</span>
                <span>${summary.total.toFixed(2)}</span>
              </div>
              <button
                onClick={() => {
                  navigate('/payment');
                  showToaster('Proceeding to payment...');
                }}
                className="w-full bg-red-800 text-white py-3 rounded-md hover:bg-red-900 mt-5"
              >
                Proceed to Pay
              </button>
            </div>
          </div>
        </div>
      )}

      {toaster && <Toaster message={toaster} onClose={() => setToaster(null)} />}

    </div>
  );
}

export default Cart;
