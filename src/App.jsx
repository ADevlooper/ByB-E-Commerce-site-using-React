import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/navbar';
import Adcorousel from './components/adcorousel';
import Shortmenu from './components/shortmenu';
import About from './pages/about';
import Contact from './pages/contact';
import Products from './pages/products';
import Cart from './pages/cart';
import Payment from './pages/payment';
import Account from './pages/account';
import Footer from './components/footer';
import GoToTop from './components/gototop';
import ProductDetail from './pages/ProductDetail';
import DealsForYou from './components/dealsForYou';
import ScrollToTop from './components/ScrollToTop';
import './App.css';

const Home = () => (
  <>
    <Adcorousel />
    <Shortmenu />
    <DealsForYou />
  </>
);

function App() {
  return (
    <>
      <ScrollToTop />
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/account" element={<Account />} />
        </Routes>
        <Footer />
        <GoToTop />
      </div>
    </>
  );
}

export default App;
