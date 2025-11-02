import React, { useState, useEffect, useRef } from 'react';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import Toaster from '../components/toaster';
import Loader from '../components/Loader';

// Component for conditionally scrolling titles
const ScrollingTitle = ({ title }) => {
  const titleRef = useRef(null);
  const [shouldScroll, setShouldScroll] = useState(false);

  useEffect(() => {
    const checkOverflow = () => {
      if (titleRef.current) {
        const { scrollWidth, clientWidth } = titleRef.current;
        setShouldScroll(scrollWidth > clientWidth);
      }
    };

    checkOverflow();
    window.addEventListener('resize', checkOverflow);
    return () => window.removeEventListener('resize', checkOverflow);
  }, [title]);

  return shouldScroll ? (
    <marquee className="font-semibold text-lg mb-2" behavior="scroll" direction="left" scrollamount="2">
      {title}
    </marquee>
  ) : (
    <h3 ref={titleRef} className="font-semibold text-lg mb-2">
      {title}
    </h3>
  );
};

function Products() {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('default');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  const navigate = useNavigate();
  const { addToCart, toggleWishlist, isInWishlist } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('https://dummyjson.com/products');
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        setProducts(data.products);
        // Extract unique categories
        const uniqueCategories = [...new Set(data.products.map(product => product.category))];
        setCategories(uniqueCategories);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Sort and filter products
  const sortAndFilterProducts = () => {
    let filtered = products.filter(product => {
      const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    // Apply sorting
    switch (sortBy) {
      case 'price-low':
        return filtered.sort((a, b) => a.price - b.price);
      case 'price-high':
        return filtered.sort((a, b) => b.price - a.price);
      case 'name-asc':
        return filtered.sort((a, b) => a.title.localeCompare(b.title));
      case 'name-desc':
        return filtered.sort((a, b) => b.title.localeCompare(a.title));
      default:
        return filtered;
    }
  };

  const filteredProducts = sortAndFilterProducts();

  if (loading) {
    return <Loader />;
  }

  if (error) return (
    <div className="text-center text-red-500 p-4">
      Error: {error}
    </div>
  );

  const handleAddToCart = (e, product) => {
    e.preventDefault(); // Prevent navigation when clicking the button
    addToCart({ ...product, quantity: 1 });
    setToast(`${product.title} added to cart!`);
  };

  const handleBuyNow = (e, product) => {
    e.preventDefault(); // Prevent navigation
    addToCart({ ...product, quantity: 1 });
    navigate('/payment');
  };

  const handleToggleWishlist = (e, productId) => {
    e.preventDefault(); // Prevent navigation
    toggleWishlist(productId);
  };

  return (
    <div className="container mx-auto px-8 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-4xl font-bold">Our Products</h1>
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <div className="flex gap-4">
            {/* Category Filter */}
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="pl-10 pr-10 py-2 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-red-800 appearance-none bg-white"
                style={{ backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'m6 8 4 4 4-4\'/%3e%3c/svg%3e")', backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em', paddingRight: '2.5rem' }}
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
              {/* Category Icon */}
              <svg
                className="absolute left-3 top-2.5 h-4 w-4 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>

            {/* Sort Options */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="pl-10 pr-10 py-2 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-red-800 appearance-none bg-white"
                style={{ backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'m6 8 4 4 4-4\'/%3e%3c/svg%3e")', backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em', paddingRight: '2.5rem' }}
              >
                <option value="default">Sort By</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name-asc">Name: A to Z</option>
                <option value="name-desc">Name: Z to A</option>
              </select>
              {/* Sort Icon */}
              <svg
                className="absolute left-3 top-2.5 h-4 w-4 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative flex-1 md:w-80">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-10 py-2 border border-black rounded-lg focus:outline-none focus:ring-2 bg-white focus:ring-red-800"
            />
            <svg
              className="absolute right-3 top-2.5 h-5 w-5 text-black"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredProducts.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 max-w-sm mx-auto">
            <Link to={`/product/${product.id}`} className="block relative">
              <div className="h-64 bg-gray-200 flex items-center justify-center">
                <img
                  src={product.thumbnail}
                  alt={product.title}
                  className="max-w-full max-h-full object-contain"
                />

                {/* Offer Tag */}
                {product.discountPercentage >= 5 && (
                  <span className="absolute top-2 left-2 bg-red-100 text-red-800 text-sm font-medium px-3 py-1 rounded">
                    {Math.floor(product.discountPercentage)}% OFF
                  </span>
                )}

                {/* Wishlist Heart Overlay */}
                <button
                  onClick={(e) => handleToggleWishlist(e, product.id)}
                  className="absolute top-2 right-2 p-2 bg-white bg-opacity-80 rounded-full shadow-md hover:bg-opacity-100 transition-all duration-200"
                >
                  <svg
                    className={`w-5 h-5 ${isInWishlist(product.id) ? 'text-red-500 fill-current' : 'text-gray-400'}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </button>
              </div>

              <div className="p-4">
                <ScrollingTitle title={product.title} />
                <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-lg font-bold text-red-800">
                    ${product.price}
                  </span>
                  <span className="text-sm text-gray-500 line-through">
                    ${Math.round(product.price * (1 + Math.floor(product.discountPercentage) / 100))}
                  </span>
                </div>
              </div>
            </Link>

            {/* Add to Cart and Order Now buttons outside the Link component */}
            <div className="p-4 pt-0 flex gap-2">
              <button
                onClick={(e) => handleBuyNow(e, product)}
                className="flex-1 border-2 border-red-800 text-red-800 px-4 py-2 rounded-md hover:bg-red-800 hover:text-white transition-colors text-center flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                Buy Now
              </button>
              <button
                onClick={(e) => handleAddToCart(e, product)}
                className="flex-1 bg-red-800 text-white px-6 py-3 rounded-md hover:bg-red-900 transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Toast Notification */}
      {toast && <Toaster message={toast} onClose={() => setToast(null)} position="top-right" />}
    </div>
  );
}

export default Products;
