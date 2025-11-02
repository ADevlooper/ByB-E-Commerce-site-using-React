import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import AsideMenu, { LayoutPanelLeftIcon } from '../components/AsideMenu';

const Account = () => {
  const [activeSection, setActiveSection] = useState('profile');
  const [wishlistProducts, setWishlistProducts] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567'
  });
  const { wishlist, toggleWishlist } = useCart();
  const [isAsideOpen, setIsAsideOpen] = useState(false);
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    smsNotifications: true,
    profileVisibility: false,
    dataSharing: true,
    darkMode: false,
    twoFactorAuth: true,
    autoSave: true,
    marketingEmails: false,
    locationTracking: true
  });
  const [paymentMethods, setPaymentMethods] = useState([
    { id: 1, type: 'debit', number: '****1234', expiry: '12/25', bank: 'HDFC Bank' },
    { id: 2, type: 'credit', number: '****5678', expiry: '08/26', bank: 'ICICI Bank' },
    { id: 3, type: 'upi', id: 'user@upi', provider: 'Google Pay' }
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMethod, setEditingMethod] = useState(null);
  const [editForm, setEditForm] = useState({
    type: '',
    number: '',
    expiry: '',
    bank: '',
    id: '',
    provider: ''
  });
  const [addresses, setAddresses] = useState([
    { id: 1, type: 'home', name: 'John Doe', address: '123 Main St, Apt 4B', city: 'New York', state: 'NY', zip: '10001', phone: '+1 (555) 123-4567' },
    { id: 2, type: 'work', name: 'John Doe', address: '456 Office Blvd, Suite 100', city: 'New York', state: 'NY', zip: '10002', phone: '+1 (555) 987-6543' }
  ]);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [editAddressForm, setEditAddressForm] = useState({
    type: '',
    name: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    phone: ''
  });

  const getHeaderText = () => {
    switch (activeSection) {
      case 'profile': return 'Profile';
      case 'orders': return 'My Orders';
      case 'wishlist': return 'Wishlist';
      case 'address': return 'My Address';
      case 'payment': return 'Payment Methods';
      case 'settings': return 'Settings';
      case 'help': return 'Help';
      case 'logout': return 'My Account';
      default: return 'My Account';
    }
  };

  useEffect(() => {
    const fetchWishlistProducts = async () => {
      if (wishlist.size === 0) {
        setWishlistProducts([]);
        return;
      }

      try {
        const productPromises = Array.from(wishlist).map(id =>
          fetch(`https://dummyjson.com/products/${id}`).then(res => res.json())
        );
        const products = await Promise.all(productPromises);
        setWishlistProducts(products);
      } catch (error) {
        console.error('Error fetching wishlist products:', error);
        setWishlistProducts([]);
      }
    };

    fetchWishlistProducts();
  }, [wishlist]);

  // Load addresses and payment methods from localStorage on mount
  useEffect(() => {
    const savedAddresses = localStorage.getItem('addresses');
    if (savedAddresses) {
      setAddresses(JSON.parse(savedAddresses));
    }

    const savedPaymentMethods = localStorage.getItem('paymentMethods');
    if (savedPaymentMethods) {
      setPaymentMethods(JSON.parse(savedPaymentMethods));
    }
  }, []);

  const menuItems = [
    { id: 'profile', label: 'Profile', icon: 'https://img.icons8.com/fluency/48/gender-neutral-user.png' },
    { id: 'orders', label: 'Orders', icon: 'https://img.icons8.com/fluency/48/package.png' },
    { id: 'wishlist', label: 'Wishlist', icon: 'https://img.icons8.com/color/48/hearts.png' },
    { id: 'address', label: 'Address', icon: 'https://img.icons8.com/fluency/48/home.png' },
    { id: 'payment', label: 'Payment Methods', icon: 'https://img.icons8.com/fluency/48/bank-card-back-side.png' },
    { id: 'settings', label: 'Settings', icon: 'https://img.icons8.com/fluency/48/settings.png' },
    { id: 'help', label: 'Get Help', icon: 'https://img.icons8.com/fluency/48/help.png' },
    { id: 'Account', label: 'Account', icon: 'https://img.icons8.com/fluency/48/exit.png' },
  ];

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = () => {
    setIsEditing(false);
    // Here you could add logic to save to backend if needed
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset to original data if needed
  };

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSettingChange = (setting) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const handleEditPaymentMethod = (method) => {
    setEditingMethod(method);
    setEditForm({
      type: method.type,
      number: method.number || '',
      expiry: method.expiry || '',
      bank: method.bank || '',
      id: method.id || '',
      provider: method.provider || ''
    });
    setIsModalOpen(true);
  };

  const handleSaveEdit = () => {
    const updatedMethods = paymentMethods.map(method =>
      method.id === editingMethod.id
        ? { ...method, ...editForm }
        : method
    );
    setPaymentMethods(updatedMethods);
    localStorage.setItem('paymentMethods', JSON.stringify(updatedMethods));
    setIsModalOpen(false);
    setEditingMethod(null);
  };

  const handleCancelEdit = () => {
    setIsModalOpen(false);
    setEditingMethod(null);
  };

  const handleEditAddress = (address) => {
    setEditingAddress(address);
    setEditAddressForm({
      type: address.type,
      name: address.name,
      address: address.address,
      city: address.city,
      state: address.state,
      zip: address.zip,
      phone: address.phone
    });
    setIsAddressModalOpen(true);
  };

  const handleSaveAddressEdit = () => {
    const updatedAddresses = addresses.map(addr =>
      addr.id === editingAddress.id
        ? { ...addr, ...editAddressForm }
        : addr
    );
    setAddresses(updatedAddresses);
    localStorage.setItem('addresses', JSON.stringify(updatedAddresses));
    setIsAddressModalOpen(false);
    setEditingAddress(null);
  };

  const handleCancelAddressEdit = () => {
    setIsAddressModalOpen(false);
    setEditingAddress(null);
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'profile':
        return (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-red-800 text-left">{getHeaderText()}</h1>
              {!isEditing ? (
                <button
                  onClick={handleEditToggle}
                  className="bg-red-800 text-white px-4 py-2 rounded hover:bg-white hover:text-red-800 border-2 border-red-800 flex items-center gap-2 group"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-current">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Edit Profile
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancel}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
            <div className="mb-6 flex">
              <img
                src="https://img.icons8.com/cotton/64/gender-neutral-user--v2.png"
                alt="User Avatar"
                className="w-20 h-20 mb-4 rounded-full"
              />
              <div className="my-auto ml-2">
                <h3 className="text-xl font-semibold">{profileData.name}</h3>
                <p className="text-sm text-gray-500">{profileData.email}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="mt-1 p-2 border border-gray-300 rounded w-full"
                  />
                ) : (
                  <p className="mt-1 p-2 bg-gray-50 rounded">{profileData.name}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                {isEditing ? (
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="mt-1 p-2 border border-gray-300 rounded w-full"
                  />
                ) : (
                  <p className="mt-1 p-2 bg-gray-50 rounded">{profileData.email}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="mt-1 p-2 border border-gray-300 rounded w-full"
                  />
                ) : (
                  <p className="mt-1 p-2 bg-gray-50 rounded">{profileData.phone}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Member Since</label>
                <p className="mt-1 p-2 bg-gray-50 rounded">January 2023</p>
              </div>
            </div>
          </div>
        );
      case 'orders':
        return (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h1 className="text-3xl font-bold text-red-800 text-left mb-6">{getHeaderText()}</h1>
            <p className="text-gray-600">You haven't placed any orders yet.</p>
          </div>
        );
      case 'wishlist':
        return (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h1 className="text-3xl font-bold text-red-800 text-left mb-6">{getHeaderText()}</h1>
            {wishlistProducts.length === 0 ? (
              <p className="text-gray-600">Your wishlist is empty.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {wishlistProducts.map((product) => (
                  <div key={product.id} className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate(`/product/${product.id}`)}>
                    <div className="flex items-start gap-4">
                      <img
                        src={product.thumbnail}
                        alt={product.title}
                        className="w-16 h-16 object-contain rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm mb-1 line-clamp-2">{product.title}</h3>
                        <p className="text-red-800 font-semibold text-sm">${product.price}</p>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleWishlist(product.id);
                          }}
                          className="mt-2 text-red-500 hover:text-red-700 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      case 'address':
        return (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h1 className="text-3xl font-bold text-red-800 text-left mb-6">{getHeaderText()}</h1>
            <div className="space-y-4">
              {addresses.map((address) => (
                <div key={address.id} className="flex items-start justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-start gap-4">
                    <img src="https://img.icons8.com/fluency/48/home.png" alt="Address" className="w-8 h-8 mt-1" />
                    <div>
                      <p className="font-medium capitalize">{address.type}</p>
                      <p className="text-sm text-gray-600">{address.name}</p>
                      <p className="text-sm text-gray-600">{address.address}</p>
                      <p className="text-sm text-gray-600">{address.city}, {address.state} {address.zip}</p>
                      <p className="text-sm text-gray-600">{address.phone}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditAddress(address)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                    <button className="text-red-500 hover:text-red-700">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
              <button className="w-full flex items-center justify-center gap-2 p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-red-500 hover:text-red-500 transition-colors">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Add New Address
              </button>
            </div>
          </div>
        );
      case 'payment':
        return (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h1 className="text-3xl font-bold text-red-800 text-left mb-6">{getHeaderText()}</h1>
            <div className="space-y-4">
              {paymentMethods.map((method) => (
                <div key={method.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-4">
                    {method.type === 'debit' && (
                      <img src="https://img.icons8.com/color/48/debit-card.png" alt="Debit Card" className="w-8 h-8" />
                    )}
                    {method.type === 'credit' && (
                      <img src="https://img.icons8.com/color/48/credit-card.png" alt="Credit Card" className="w-8 h-8" />
                    )}
                    {method.type === 'upi' && (
                      <img src="https://img.icons8.com/color/48/upi.png" alt="UPI" className="w-8 h-8" />
                    )}
                    <div>
                      <p className="font-medium">
                        {method.type === 'upi' ? method.id : method.number}
                      </p>
                      <p className="text-sm text-gray-500">
                        {method.type === 'upi' ? method.provider : `${method.type.toUpperCase()} • ${method.bank} • Expires ${method.expiry}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditPaymentMethod(method)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                    <button className="text-red-500 hover:text-red-700">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
              <button className="w-full flex items-center justify-center gap-2 p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-red-500 hover:text-red-500 transition-colors">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Add Debit Card / Credit Card / UPI
              </button>
            </div>
          </div>
        );
      case 'help':
        return (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h1 className="text-3xl font-bold text-red-800 text-left mb-6">{getHeaderText()}</h1>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Contact Support</h3>
                <p className="text-gray-600 mb-2">Need assistance? Our support team is here to help.</p>
                <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                  Contact Support
                </button>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">FAQ</h3>
                <p className="text-gray-600">Find answers to frequently asked questions.</p>
                <button className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 mt-2">
                  View FAQ
                </button>
              </div>
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h1 className="text-3xl font-bold text-red-800 text-left mb-6">{getHeaderText()}</h1>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Notification Settings</h3>
                <div className="space-y-3">
                  <label className="flex items-center cursor-pointer">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={settings.emailNotifications}
                        onChange={() => handleSettingChange('emailNotifications')}
                        className="sr-only"
                      />
                      <div className={`w-10 h-6 bg-gray-300 rounded-full shadow-inner transition-colors ${settings.emailNotifications ? 'bg-red-500' : ''}`}></div>
                      <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${settings.emailNotifications ? 'translate-x-4' : ''}`}></div>
                    </div>
                    <span className="ml-3">Email notifications</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={settings.pushNotifications}
                        onChange={() => handleSettingChange('pushNotifications')}
                        className="sr-only"
                      />
                      <div className={`w-10 h-6 bg-gray-300 rounded-full shadow-inner transition-colors ${settings.pushNotifications ? 'bg-red-500' : ''}`}></div>
                      <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${settings.pushNotifications ? 'translate-x-4' : ''}`}></div>
                    </div>
                    <span className="ml-3">Push notifications</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={settings.smsNotifications}
                        onChange={() => handleSettingChange('smsNotifications')}
                        className="sr-only"
                      />
                      <div className={`w-10 h-6 bg-gray-300 rounded-full shadow-inner transition-colors ${settings.smsNotifications ? 'bg-red-500' : ''}`}></div>
                      <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${settings.smsNotifications ? 'translate-x-4' : ''}`}></div>
                    </div>
                    <span className="ml-3">SMS notifications</span>
                  </label>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-4">Privacy Settings</h3>
                <div className="space-y-3">
                  <label className="flex items-center cursor-pointer">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={settings.profileVisibility}
                        onChange={() => handleSettingChange('profileVisibility')}
                        className="sr-only"
                      />
                      <div className={`w-10 h-6 bg-gray-300 rounded-full shadow-inner transition-colors ${settings.profileVisibility ? 'bg-red-500' : ''}`}></div>
                      <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${settings.profileVisibility ? 'translate-x-4' : ''}`}></div>
                    </div>
                    <span className="ml-3">Profile visibility</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={settings.dataSharing}
                        onChange={() => handleSettingChange('dataSharing')}
                        className="sr-only"
                      />
                      <div className={`w-10 h-6 bg-gray-300 rounded-full shadow-inner transition-colors ${settings.dataSharing ? 'bg-red-500' : ''}`}></div>
                      <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${settings.dataSharing ? 'translate-x-4' : ''}`}></div>
                    </div>
                    <span className="ml-3">Data sharing</span>
                  </label>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-4">App Settings</h3>
                <div className="space-y-3">
                  <label className="flex items-center cursor-pointer">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={settings.darkMode}
                        onChange={() => handleSettingChange('darkMode')}
                        className="sr-only"
                      />
                      <div className={`w-10 h-6 bg-gray-300 rounded-full shadow-inner transition-colors ${settings.darkMode ? 'bg-red-500' : ''}`}></div>
                      <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${settings.darkMode ? 'translate-x-4' : ''}`}></div>
                    </div>
                    <span className="ml-3">Dark mode</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={settings.twoFactorAuth}
                        onChange={() => handleSettingChange('twoFactorAuth')}
                        className="sr-only"
                      />
                      <div className={`w-10 h-6 bg-gray-300 rounded-full shadow-inner transition-colors ${settings.twoFactorAuth ? 'bg-red-500' : ''}`}></div>
                      <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${settings.twoFactorAuth ? 'translate-x-4' : ''}`}></div>
                    </div>
                    <span className="ml-3">Two-factor authentication</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={settings.autoSave}
                        onChange={() => handleSettingChange('autoSave')}
                        className="sr-only"
                      />
                      <div className={`w-10 h-6 bg-gray-300 rounded-full shadow-inner transition-colors ${settings.autoSave ? 'bg-red-500' : ''}`}></div>
                      <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${settings.autoSave ? 'translate-x-4' : ''}`}></div>
                    </div>
                    <span className="ml-3">Auto-save</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={settings.marketingEmails}
                        onChange={() => handleSettingChange('marketingEmails')}
                        className="sr-only"
                      />
                      <div className={`w-10 h-6 bg-gray-300 rounded-full shadow-inner transition-colors ${settings.marketingEmails ? 'bg-red-500' : ''}`}></div>
                      <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${settings.marketingEmails ? 'translate-x-4' : ''}`}></div>
                    </div>
                    <span className="ml-3">Marketing emails</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={settings.locationTracking}
                        onChange={() => handleSettingChange('locationTracking')}
                        className="sr-only"
                      />
                      <div className={`w-10 h-6 bg-gray-300 rounded-full shadow-inner transition-colors ${settings.locationTracking ? 'bg-red-500' : ''}`}></div>
                      <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${settings.locationTracking ? 'translate-x-4' : ''}`}></div>
                    </div>
                    <span className="ml-3">Location tracking</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        );
      case 'logout':
        return (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h1 className="text-3xl font-bold text-red-800 text-left mb-6">{getHeaderText()}</h1>
            <p className="text-gray-600 mb-4">Are you sure you want to logout?</p>
            <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
              Logout
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container px-4 py-4 ">
      {/* Mobile toggle button for aside (visible on small screens) */}
      <div className="md:hidden flex items-center mb-4">
        <button
          onClick={() => setIsAsideOpen(true)}
          aria-label="Open account menu"
          className="p-2 rounded-md hover:bg-gray-100 inline-flex items-center gap-2"
        >
          <LayoutPanelLeftIcon className="w-6 h-6 text-gray-700" />
          <span className="text-sm font-medium text-gray-700">Menu</span>
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Aside Menu */}
  <aside className="hidden md:block md:w-1/4">
          <div className="bg-white md:h-[80vh] p-4 rounded-lg shadow-md">
            <nav>
              <ul className="space-y-2">
                {menuItems.slice(0, 5).map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => setActiveSection(item.id)}
                      className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${
                        activeSection === item.id
                          ? 'bg-red-100 text-red-800 font-semibold'
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      <img src={item.icon} alt={item.label} className="w-6 h-6" />
                      <span>{item.label}</span>
                    </button>
                  </li>
                ))}
                {menuItems.slice(5).map((item, index) => (
                  <li key={item.id} className={index === 0 ? 'mt-auto' : ''}>
                    <button
                      onClick={() => setActiveSection(item.id)}
                      className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${
                        activeSection === item.id
                          ? 'bg-red-100 text-red-800 font-semibold'
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      <img src={item.icon} alt={item.label} className="w-6 h-6" />
                      <span>{item.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="md:w-3/4">
          {renderContent()}
        </main>
      </div>

      {/* Mobile Aside Menu */}
      <AsideMenu
        open={isAsideOpen}
        onClose={() => setIsAsideOpen(false)}
        items={menuItems}
        activeId={activeSection}
        onSelect={setActiveSection}
      />

      {/* Edit Payment Method Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit Payment Method</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Type</label>
                <select
                  value={editForm.type}
                  onChange={(e) => setEditForm(prev => ({ ...prev, type: e.target.value }))}
                  className="mt-1 p-2 border border-gray-300 rounded w-full"
                >
                  <option value="debit">Debit Card</option>
                  <option value="credit">Credit Card</option>
                  <option value="upi">UPI</option>
                </select>
              </div>
              {editForm.type !== 'upi' ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Card Number</label>
                    <input
                      type="text"
                      value={editForm.number}
                      onChange={(e) => setEditForm(prev => ({ ...prev, number: e.target.value }))}
                      className="mt-1 p-2 border border-gray-300 rounded w-full"
                      placeholder="****1234"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
                    <input
                      type="text"
                      value={editForm.expiry}
                      onChange={(e) => setEditForm(prev => ({ ...prev, expiry: e.target.value }))}
                      className="mt-1 p-2 border border-gray-300 rounded w-full"
                      placeholder="MM/YY"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Bank</label>
                    <input
                      type="text"
                      value={editForm.bank}
                      onChange={(e) => setEditForm(prev => ({ ...prev, bank: e.target.value }))}
                      className="mt-1 p-2 border border-gray-300 rounded w-full"
                      placeholder="Bank Name"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">UPI ID</label>
                    <input
                      type="text"
                      value={editForm.id}
                      onChange={(e) => setEditForm(prev => ({ ...prev, id: e.target.value }))}
                      className="mt-1 p-2 border border-gray-300 rounded w-full"
                      placeholder="user@upi"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Provider</label>
                    <input
                      type="text"
                      value={editForm.provider}
                      onChange={(e) => setEditForm(prev => ({ ...prev, provider: e.target.value }))}
                      className="mt-1 p-2 border border-gray-300 rounded w-full"
                      placeholder="Google Pay"
                    />
                  </div>
                </>
              )}
            </div>
            <div className="flex gap-2 mt-6">
              <button
                onClick={handleSaveEdit}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Save
              </button>
              <button
                onClick={handleCancelEdit}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Address Modal */}
      {isAddressModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-3 sm:p-4 rounded-lg shadow-lg w-full max-w-sm">
            <h2 className="text-sm sm:text-lg font-bold mb-2 sm:mb-3">Edit Address</h2>
            <div className="space-y-2 sm:space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700">Type</label>
                <select
                  value={editAddressForm.type}
                  onChange={(e) => setEditAddressForm(prev => ({ ...prev, type: e.target.value }))}
                  className="mt-1 p-1 border border-gray-300 rounded w-full text-xs sm:text-sm"
                >
                  <option value="home">Home</option>
                  <option value="work">Work</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  value={editAddressForm.name}
                  onChange={(e) => setEditAddressForm(prev => ({ ...prev, name: e.target.value }))}
                  className="mt-1 p-1 border border-gray-300 rounded w-full text-xs sm:text-sm"
                  placeholder="Full Name"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700">Address</label>
                <input
                  type="text"
                  value={editAddressForm.address}
                  onChange={(e) => setEditAddressForm(prev => ({ ...prev, address: e.target.value }))}
                  className="mt-1 p-1 border border-gray-300 rounded w-full text-xs sm:text-sm"
                  placeholder="Street Address"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700">City</label>
                <input
                  type="text"
                  value={editAddressForm.city}
                  onChange={(e) => setEditAddressForm(prev => ({ ...prev, city: e.target.value }))}
                  className="mt-1 p-1 border border-gray-300 rounded w-full text-xs sm:text-sm"
                  placeholder="City"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700">State</label>
                <input
                  type="text"
                  value={editAddressForm.state}
                  onChange={(e) => setEditAddressForm(prev => ({ ...prev, state: e.target.value }))}
                  className="mt-1 p-1 border border-gray-300 rounded w-full text-xs sm:text-sm"
                  placeholder="State"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700">ZIP Code</label>
                <input
                  type="text"
                  value={editAddressForm.zip}
                  onChange={(e) => setEditAddressForm(prev => ({ ...prev, zip: e.target.value }))}
                  className="mt-1 p-1 border border-gray-300 rounded w-full text-xs sm:text-sm"
                  placeholder="ZIP Code"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700">Phone</label>
                <input
                  type="tel"
                  value={editAddressForm.phone}
                  onChange={(e) => setEditAddressForm(prev => ({ ...prev, phone: e.target.value }))}
                  className="mt-1 p-1 border border-gray-300 rounded w-full text-xs sm:text-sm"
                  placeholder="Phone Number"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-3 sm:mt-4">
              <button
                onClick={handleSaveAddressEdit}
                className="bg-green-600 text-white px-2 py-1 sm:px-3 sm:py-1.5 rounded text-xs sm:text-sm hover:bg-green-700"
              >
                Save
              </button>
              <button
                onClick={handleCancelAddressEdit}
                className="bg-gray-500 text-white px-2 py-1 sm:px-3 sm:py-1.5 rounded text-xs sm:text-sm hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Account;
