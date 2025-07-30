import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, ShoppingCart, Phone, MapPin, Package, Facebook, Instagram, Twitter, Youtube, User, X, Mail, Lock } from 'lucide-react';

export default function Header() {
  const [search, setSearch] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const [categories, setCategories] = useState([]);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setIsLoggedIn(true);
      setUser(JSON.parse(userData));
    }
  }, []);

  useEffect(() => {
    function updateCart() {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      setCartCount(cart.reduce((sum, item) => sum + (item.qty || 1), 0));
    }
    updateCart();
    window.addEventListener('storage', updateCart);
    window.addEventListener('cartUpdated', updateCart);
    return () => {
      window.removeEventListener('storage', updateCart);
      window.removeEventListener('cartUpdated', updateCart);
    };
  }, []);

  // Fetch categories for nav menu
  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => setCategories(Array.isArray(data) ? data : []))
      .catch(() => setCategories([]));
  }, []);

  function handleSearch(e) {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/products?search=${encodeURIComponent(search)}`);
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginForm),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setIsLoggedIn(true);
        setUser(data.user);
        setShowLoginModal(false);
        setLoginForm({ email: '', password: '' });
      } else {
        alert('Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please try again.');
    }
  };

  const handleGoogleLogin = () => {
    // Google OAuth implementation
    window.open('/api/auth/google', '_self');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
  };

  const handleInputChange = (e) => {
    setLoginForm({
      ...loginForm,
      [e.target.name]: e.target.value
    });
  };

  return (
    <header className="w-full">
      {/* Top Bar */}
      <div className="bg-gray-100 border-b border-gray-200 text-xs md:text-sm hidden md:block">
        <div className="max-w-6xl mx-auto px-2 md:px-4 flex items-center justify-between h-8 md:h-10">
          <div className="flex items-center gap-3 text-gray-600">
            <a href="tel:01886460526" className="flex items-center gap-1 hover:text-blue-600 transition-colors">
              <Phone size={14} /> 01886460526
            </a>
            <span className="flex items-center gap-1"><MapPin size={14} /> Our Location</span>
            <span className="flex items-center gap-1"><Package size={14} /> Track Your Order</span>
          </div>
          {/* Scrolling Banner */}
          <div className="flex-1 flex items-center justify-center overflow-hidden px-2">
            <div className="whitespace-nowrap animate-marquee text-gray-700 font-medium px-8">
              🎉 Welcome to Pet Hub BD! ফ্রি ডেলিভারি ২০০০৳+ অর্ডারে | নতুন পেট ফুড কালেকশন | আজই অর্ডার করুন!
            </div>
            <style>{`
              @keyframes marquee {
                0% { transform: translateX(100%); }
                100% { transform: translateX(-100%); }
              }
              .animate-marquee {
                animation: marquee 18s linear infinite;
              }
            `}</style>
          </div>
          <div className="flex items-center gap-2 md:gap-3">
            <a href="#" className="text-gray-600 hover:text-blue-600"><Facebook size={16} /></a>
            <a href="#" className="text-gray-600 hover:text-pink-600"><Instagram size={16} /></a>
            <a href="#" className="text-gray-600 hover:text-blue-400"><Twitter size={16} /></a>
            <a href="#" className="text-gray-600 hover:text-red-600"><Youtube size={16} /></a>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-2 md:px-4 flex flex-col md:flex-row items-center justify-between h-auto md:h-24 py-2 md:py-0">
          {/* Mobile: Logo, Search, Cart in one row */}
          <div className="w-full flex items-center justify-between md:hidden mb-2">
            <Link to="/" className="flex items-center">
              <img src="/pethubbdlogo.jpg" alt="PetHubBD" className="h-10 w-auto object-contain" />
            </Link>
            <form onSubmit={handleSearch} className="flex-1 flex justify-center mx-2">
              <div className="relative w-full max-w-xs">
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search..."
                  className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-full focus:border-blue-500 focus:outline-none text-sm shadow-sm"
                />
                <button type="submit" className="absolute right-1 top-1/2 -translate-y-1/2 bg-blue-500 hover:bg-blue-600 text-white p-1 rounded-full transition-colors">
                  <Search size={16} />
                </button>
              </div>
            </form>
            <div className="flex items-center gap-2">
              {isLoggedIn ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-700">{user?.name || user?.email}</span>
                  <button onClick={handleLogout} className="text-sm text-red-600 hover:text-red-800">Logout</button>
                </div>
              ) : (
                <button onClick={() => setShowLoginModal(true)} className="p-2 text-gray-700 hover:text-blue-600 transition-colors">
                  <User size={20} />
                </button>
              )}
              <button className="relative p-2 text-gray-700 hover:text-blue-600 transition-colors" onClick={() => navigate('/cart')} type="button">
                <ShoppingCart size={22} />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {cartCount}
                </span>
              </button>
            </div>
          </div>
          {/* Desktop: Logo, Search, Cart */}
          <div className="hidden md:flex items-center justify-between w-full h-full">
            <Link to="/" className="flex items-center h-full">
              <img src="/pethubbdlogo.jpg" alt="PetHubBD" className="h-12 w-auto md:h-16 object-contain" />
            </Link>
            <form onSubmit={handleSearch} className="flex-1 flex justify-center">
              <div className="relative w-full max-w-xl">
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search for products, brands and more..."
                  className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-full focus:border-blue-500 focus:outline-none text-base md:text-lg shadow-sm"
                />
                <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full transition-colors">
                  <Search size={20} />
                </button>
              </div>
            </form>
            <div className="flex items-center h-full ml-2 md:ml-6 gap-4">
              {isLoggedIn ? (
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-700">{user?.name || user?.email}</span>
                  <button onClick={handleLogout} className="text-sm text-red-600 hover:text-red-800 px-3 py-1 border border-red-600 rounded hover:bg-red-50">Logout</button>
                </div>
              ) : (
                <button onClick={() => setShowLoginModal(true)} className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors px-3 py-2 border border-gray-300 rounded-lg hover:border-blue-500">
                  <User size={20} />
                  <span className="text-sm font-medium">Login</span>
                </button>
              )}
              <button className="relative p-2 text-gray-700 hover:text-blue-600 transition-colors" onClick={() => navigate('/cart')} type="button">
                <ShoppingCart size={28} />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="bg-gray-50 border-b border-gray-200 hidden md:block">
        <div className="max-w-7xl mx-auto px-2 md:px-4">
          <div className="flex items-center justify-center space-x-6 md:space-x-8 h-12 text-base font-medium">
            <Link to="/" className="text-gray-700 hover:text-blue-600 transition-colors">Home</Link>
            {categories.map(cat => (
              <Link
                key={cat.id}
                to={`/products?category_id=${cat.id}`}
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Login</h2>
              <button onClick={() => setShowLoginModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email or Phone</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    name="email"
                    value={loginForm.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email or phone"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="password"
                    name="password"
                    value={loginForm.password}
                    onChange={handleInputChange}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                    required
                  />
                </div>
              </div>
              
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Login
              </button>
            </form>
            
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>
              
              <button
                onClick={handleGoogleLogin}
                className="w-full mt-4 flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>
            </div>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <button className="text-blue-600 hover:text-blue-800 font-medium">Sign up</button>
              </p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
