import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import cod from '../assets/cod.png';

function Payment() {
  const { cart, getOrderSummary } = useCart();
  const summary = getOrderSummary();
  const [address, setAddress] = useState({
    name: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    country: ''
  });

  const countries = [
    'United States',
    'Canada',
    'United Kingdom',
    'Australia',
    'Germany',
    'France',
    'India',
    'China',
    'Japan',
    'Brazil'
  ];
  const [paymentMethod, setPaymentMethod] = useState('');
  const [voucher, setVoucher] = useState('');
  const [discount, setDiscount] = useState(0);
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });
  const [upiId, setUpiId] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [addressErrors, setAddressErrors] = useState({
    name: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    country: ''
  });
  const [paymentErrors, setPaymentErrors] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });
  const [showAddressForm, setShowAddressForm] = useState(savedAddresses.length === 0);
  const [editingAddress, setEditingAddress] = useState(null);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal + summary.shipping + summary.tax - summary.discount - discount;

  // Load saved addresses from localStorage
  useEffect(() => {
    const addresses = localStorage.getItem('addresses');
    if (addresses) {
      const parsedAddresses = JSON.parse(addresses);
      setSavedAddresses(parsedAddresses);
      setShowAddressForm(parsedAddresses.length === 0);
    }
  }, []);

  const validateField = (name, value) => {
    switch (name) {
      case 'name':
        if (value && !/^[a-zA-Z]+$/.test(value)) return 'Full Name must contain only alphabets';
        break;
      case 'street':
        if (value && !/^[a-zA-Z0-9, ]+$/.test(value)) return 'Street Address can only contain alphabets, numbers, commas, and spaces';
        break;
      case 'city':
        if (value && !/^[a-zA-Z,]+$/.test(value)) return 'City can only contain alphabets and commas';
        break;
      case 'state':
        if (value && !/^[a-zA-Z]+$/.test(value)) return 'State must contain only alphabets';
        break;
      case 'zip':
        if (value && !/^[0-9]+$/.test(value)) return 'ZIP Code must contain only numbers';
        break;
      default:
        return '';
    }
    return '';
  };

  const validatePaymentField = (name, value) => {
    switch (name) {
      case 'number':
        if (value && !/^\d{16}$/.test(value)) return 'Card Number must be exactly 16 digits';
        break;
      case 'expiry':
        if (value && !/^(0[1-9]|1[0-2])\/\d{2}$/.test(value)) return 'Expiry Date must be in MM/YY format';
        if (value) {
          const [month, year] = value.split('/');
          const currentDate = new Date();
          const currentYear = currentDate.getFullYear() % 100;
          const currentMonth = currentDate.getMonth() + 1;
          const expYear = parseInt(year, 10);
          const expMonth = parseInt(month, 10);
          if (expYear < currentYear || (expYear === currentYear && expMonth <= currentMonth)) {
            return 'Expiry Date must be in the future';
          }
          if (expYear > currentYear + 20) {
            return 'Expiry Date cannot be more than 20 years in the future';
          }
        }
        break;
      case 'cvv':
        if (value && !/^\d{3}$/.test(value)) return 'CVV must be exactly 3 digits';
        break;
      case 'name':
        if (value && !/^[a-zA-Z\s]+$/.test(value)) return 'Name on Card must contain only alphabets and spaces';
        break;
      default:
        return '';
    }
    return '';
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddress({ ...address, [name]: value });
    const error = validateField(name, value);
    setAddressErrors({ ...addressErrors, [name]: error });
  };

  const handleVoucherApply = () => {
    // Simple voucher logic - in real app, this would validate against backend
    if (voucher === 'DISCOUNT10') {
      setDiscount(subtotal * 0.1);
    } else {
      alert('Invalid voucher code');
    }
  };

  const handleContinue = () => {
    if (!address.name || !address.street || !address.city || !address.state || !address.zip || !address.country || !paymentMethod) {
      alert('Please fill in all required fields');
      return;
    }
    if ((paymentMethod === 'credit' || paymentMethod === 'debit') &&
        (!cardDetails.number || !cardDetails.expiry || !cardDetails.cvv || !cardDetails.name)) {
      alert('Please fill in all card details');
      return;
    }
    if (paymentMethod === 'upi' && !upiId) {
      alert('Please enter your UPI ID');
      return;
    }
    // In real app, this would process payment
    alert('Order placed successfully!');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Delivery Address */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Delivery Address</h2>
          {savedAddresses.length > 0 && !showAddressForm ? (
            <div className="space-y-4">
              {savedAddresses.map(addr => (
                <div key={addr.id} className="border p-4 rounded-md">
                  <p className="font-semibold">{addr.name}</p>
                  <p>{addr.street}, {addr.city}, {addr.state} {addr.zip}, {addr.country}</p>
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => {
                        setEditingAddress(addr);
                        setAddress(addr);
                        setShowAddressForm(true);
                      }}
                      className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        const updatedAddresses = savedAddresses.filter(a => a.id !== addr.id);
                        setSavedAddresses(updatedAddresses);
                        localStorage.setItem('addresses', JSON.stringify(updatedAddresses));
                        if (updatedAddresses.length === 0) {
                          setShowAddressForm(true);
                        }
                      }}
                      className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
              <button
                onClick={() => {
                  setShowAddressForm(true);
                  setEditingAddress(null);
                  setAddress({ name: '', street: '', city: '', state: '', zip: '', country: '' });
                }}
                className="w-full bg-gray-600 text-white py-2 rounded-md hover:bg-gray-700"
              >
                Add New Address
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={address.name}
                  onChange={handleAddressChange}
                  className={`w-full p-3 border rounded-md ${addressErrors.name ? 'border-red-500' : 'border-gray-300'}`}
                  required
                />
                {addressErrors.name && <p className="text-red-500 text-sm mt-1">{addressErrors.name}</p>}
              </div>
              <div>
                <input
                  type="text"
                  name="street"
                  placeholder="Street Address"
                  value={address.street}
                  onChange={handleAddressChange}
                  className={`w-full p-3 border rounded-md ${addressErrors.street ? 'border-red-500' : 'border-gray-300'}`}
                  required
                />
                {addressErrors.street && <p className="text-red-500 text-sm mt-1">{addressErrors.street}</p>}
              </div>
              <div>
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={address.city}
                  onChange={handleAddressChange}
                  className={`w-full p-3 border rounded-md ${addressErrors.city ? 'border-red-500' : 'border-gray-300'}`}
                  required
                />
                {addressErrors.city && <p className="text-red-500 text-sm mt-1">{addressErrors.city}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <input
                    type="text"
                    name="state"
                    placeholder="State"
                    value={address.state}
                    onChange={handleAddressChange}
                    className={`p-3 border rounded-md ${addressErrors.state ? 'border-red-500' : 'border-gray-300'}`}
                    required
                  />
                  {addressErrors.state && <p className="text-red-500 text-sm mt-1">{addressErrors.state}</p>}
                </div>
                <div>
                  <input
                    type="text"
                    name="zip"
                    placeholder="ZIP Code"
                    value={address.zip}
                    onChange={handleAddressChange}
                    className={`p-3 border rounded-md ${addressErrors.zip ? 'border-red-500' : 'border-gray-300'}`}
                    required
                  />
                  {addressErrors.zip && <p className="text-red-500 text-sm mt-1">{addressErrors.zip}</p>}
                </div>
              </div>
              <div>
                <select
                  name="country"
                  value={address.country}
                  onChange={handleAddressChange}
                  className={`w-full p-3 border rounded-md ${addressErrors.country ? 'border-red-500' : 'border-gray-300'}`}
                  required
                >
                  <option value="">Select Country</option>
                  {countries.map(country => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
                {addressErrors.country && <p className="text-red-500 text-sm mt-1">{addressErrors.country}</p>}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    const errors = {};
                    if (!address.name) errors.name = 'Full Name is required';
                    if (!address.street) errors.street = 'Street Address is required';
                    if (!address.city) errors.city = 'City is required';
                    if (!address.state) errors.state = 'State is required';
                    if (!address.zip) errors.zip = 'ZIP Code is required';
                    if (!address.country) errors.country = 'Country is required';

                    if (Object.keys(errors).length > 0) {
                      setAddressErrors(errors);
                      return;
                    }

                    let updatedAddresses;
                    if (editingAddress) {
                      updatedAddresses = savedAddresses.map(a => a.id === editingAddress.id ? { ...address, id: editingAddress.id } : a);
                    } else {
                      updatedAddresses = [...savedAddresses, { ...address, id: Date.now() }];
                    }
                    setSavedAddresses(updatedAddresses);
                    localStorage.setItem('addresses', JSON.stringify(updatedAddresses));
                    setShowAddressForm(false);
                    setEditingAddress(null);
                    setAddress({ name: '', street: '', city: '', state: '', zip: '', country: '' });
                  }}
                  className="flex-1 bg-green-600 text-white py-2 rounded-md hover:bg-green-700"
                >
                  {editingAddress ? 'Update Address' : 'Save Address'}
                </button>
                {savedAddresses.length > 0 && (
                  <button
                    onClick={() => {
                      setShowAddressForm(false);
                      setEditingAddress(null);
                      setAddress({ name: '', street: '', city: '', state: '', zip: '', country: '' });
                    }}
                    className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Payment Method & Voucher */}
        <div className="space-y-6">
          {/* Payment Method */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-5">Payment Method</h2>
            <div className="space-y-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="payment"
                  value="credit"
                  onChange={(e) => {
                    setPaymentMethod(e.target.value);
                    setModalType('card');
                    setShowModal(true);
                  }}
                  className="mr-3"
                />
                <img
                  src="https://img.icons8.com/color/48/000000/credit-card.png"
                  alt="Credit Card"
                  className="w-10 h-9 mr-3"
                />
                Credit Card
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="payment"
                  value="debit"
                  onChange={(e) => {
                    setPaymentMethod(e.target.value);
                    setModalType('card');
                    setShowModal(true);
                  }}
                  className="mr-3"
                />
                <img
                  src="https://img.icons8.com/color/48/000000/bank-card-back-side.png"
                  alt="Debit Card"
                  className="w-10 h-9 mr-3"
                />
                Debit Card
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="payment"
                  value="upi"
                  onChange={(e) => {
                    setPaymentMethod(e.target.value);
                    setModalType('upi');
                    setShowModal(true);
                  }}
                  className="mr-3"
                />
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/UPI-Logo-vector.svg/2560px-UPI-Logo-vector.svg.png"
                  alt="UPI"
                  className="w-10 h-9 mr-3"
                />
                UPI
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mr-3"
                />
                <img
                  src={cod}
                  alt="Cash on Delivery"
                  className="w-10 h-9 mr-3"
                />
                Cash on Delivery
              </label>
            </div>
          </div>



          {/* Discount Voucher */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Discount Voucher</h2>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter voucher code"
                value={voucher}
                onChange={(e) => setVoucher(e.target.value)}
                className="flex-1 p-3 border rounded-md"
              />
              <button
                onClick={handleVoucherApply}
                className="bg-red-800 text-white px-4 py-3 rounded-md hover:bg-red-900"
              >
                Apply
              </button>
            </div>
            {discount > 0 && (
              <p className="text-green-600 mt-2">Discount applied: ${discount.toFixed(2)}</p>
            )}
          </div>
        </div>
      </div>

      {/* Order Summary */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Order Summary</h2>
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
              </div>
              <div className="text-right">
                <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            </div>
          ))}
          <div className="border-t pt-2 space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
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
            {discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Voucher Discount</span>
                <span>-${discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-lg border-t pt-2">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
        <button
          onClick={handleContinue}
          className="w-full bg-red-800 text-white py-3 rounded-md hover:bg-red-900 mt-4"
        >
          Continue
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <style>
            {`
              .modal-enter {
                animation: fadeInZoom 0.3s ease-out;
              }
              @keyframes fadeInZoom {
                from {
                  opacity: 0;
                  transform: scale(0.8);
                }
                to {
                  opacity: 1;
                  transform: scale(1);
                }
              }
            `}
          </style>
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4 modal-enter">
            <h2 className="text-xl font-bold mb-4">
              {modalType === 'card' ? 'Enter Card Details' : 'Enter UPI Details'}
            </h2>
            {modalType === 'card' && (
              <div className="space-y-4">
                <div>
                  <input
                    type="text"
                    placeholder="Card Number"
                    value={cardDetails.number}
                    onChange={(e) => {
                      const value = e.target.value;
                      setCardDetails({ ...cardDetails, number: value });
                      const error = validatePaymentField('number', value);
                      setPaymentErrors({ ...paymentErrors, number: error });
                    }}
                    className={`w-full p-3 border rounded-md ${paymentErrors.number ? 'border-red-500' : 'border-gray-300'}`}
                    required
                  />
                  {paymentErrors.number && <p className="text-red-500 text-sm mt-1">{paymentErrors.number}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <input
                      type="text"
                      placeholder="Expiry Date (MM/YY)"
                      value={cardDetails.expiry}
                      onChange={(e) => {
                        const value = e.target.value;
                        setCardDetails({ ...cardDetails, expiry: value });
                        const error = validatePaymentField('expiry', value);
                        setPaymentErrors({ ...paymentErrors, expiry: error });
                      }}
                      className={`p-3 border rounded-md ${paymentErrors.expiry ? 'border-red-500' : 'border-gray-300'}`}
                      required
                    />
                    {paymentErrors.expiry && <p className="text-red-500 text-sm mt-1">{paymentErrors.expiry}</p>}
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="CVV"
                      value={cardDetails.cvv}
                      onChange={(e) => {
                        const value = e.target.value;
                        setCardDetails({ ...cardDetails, cvv: value });
                        const error = validatePaymentField('cvv', value);
                        setPaymentErrors({ ...paymentErrors, cvv: error });
                      }}
                      className={`p-3 border rounded-md ${paymentErrors.cvv ? 'border-red-500' : 'border-gray-300'}`}
                      required
                    />
                    {paymentErrors.cvv && <p className="text-red-500 text-sm mt-1">{paymentErrors.cvv}</p>}
                  </div>
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Name on Card"
                    value={cardDetails.name}
                    onChange={(e) => {
                      const value = e.target.value;
                      setCardDetails({ ...cardDetails, name: value });
                      const error = validatePaymentField('name', value);
                      setPaymentErrors({ ...paymentErrors, name: error });
                    }}
                    className={`w-full p-3 border rounded-md ${paymentErrors.name ? 'border-red-500' : 'border-gray-300'}`}
                    required
                  />
                  {paymentErrors.name && <p className="text-red-500 text-sm mt-1">{paymentErrors.name}</p>}
                </div>
              </div>
            )}
            {modalType === 'upi' && (
              <input
                type="text"
                placeholder="Enter UPI ID or Number"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                className="w-full p-3 border rounded-md"
                required
              />
            )}
            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (modalType === 'card') {
                    const errors = {};
                    if (!cardDetails.number) errors.number = 'Card Number is required';
                    if (!cardDetails.expiry) errors.expiry = 'Expiry Date is required';
                    if (!cardDetails.cvv) errors.cvv = 'CVV is required';
                    if (!cardDetails.name) errors.name = 'Name on Card is required';
                    if (paymentErrors.number || paymentErrors.expiry || paymentErrors.cvv || paymentErrors.name) {
                      setPaymentErrors({ ...paymentErrors, ...errors });
                      return;
                    }
                  }
                  setShowModal(false);
                }}
                className="px-4 py-2 bg-red-800 text-white rounded-md hover:bg-red-900"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Payment;
