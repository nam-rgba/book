import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaSearch, 
  FaShoppingCart, 
  FaUser, 
  FaBars, 
  FaTimes,
  FaHeart,
  FaSignInAlt,
} from 'react-icons/fa';
import { Badge } from 'antd';

interface HeaderProps {
  cartItemCount?: number;
  wishlistCount?: number;
  isLoggedIn?: boolean;
  userName?: string;
  onLogout?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  cartItemCount = 0,
  wishlistCount = 0,
  isLoggedIn = false,
  userName = '',
  onLogout
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to search results page
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
    navigate('/');
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">


      {/* Main header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-gray-900 hidden sm:block">
              BMD Shop
            </span>
          </Link>

          {/* Search bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <form onSubmit={handleSearch} className="flex w-full">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="px-2 py-2 bg-blue-400 text-white rounded-r-lg hover:bg-blue-500 transition-colors duration-200"
              >
                <FaSearch />
              </button>
            </form>
          </div>

          {/* Right side icons */}
          <div className="flex items-center space-x-4">
            {/* Search icon - Mobile */}
            <button className="md:hidden p-2 text-gray-600 hover:text-gray-900">
              <FaSearch size={20} />
            </button>

            {/* Wishlist */}
            <Link to="/wishlist" className="relative p-2 text-red-500 transition-colors">
              <FaHeart size={20} />
              {wishlistCount > 0 && (
                <Badge count={wishlistCount} size="small" className="absolute -top-1 -right-1" />
              )}
            </Link>

            {/* Shopping Cart */}
            <Link to="/cart" className="relative p-2 text-blue-400 transition-colors">
              <FaShoppingCart size={20} />
              {cartItemCount > 0 && (
                <Badge count={cartItemCount} size="small" className="absolute -top-1 -right-1" />
              )}
            </Link>

            {/* User Account */}
            <div className="relative">
              {isLoggedIn ? (
                <div className="flex items-center space-x-2">
                  <span className="hidden sm:block text-gray-700">
                    Welcome, {userName}
                  </span>
                  <div className="relative group">
                    <button className="p-2 text-gray-600 hover:text-gray-900">
                      <FaUser size={20} />
                    </button>
                    {/* Dropdown menu */}
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                      <div className="py-1">
                        <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          My Profile
                        </Link>
                        <Link to="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          My Orders
                        </Link>
                        <Link to="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          Settings
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link to="/login" className="flex items-center space-x-1 px-3 py-2  text-white rounded bg-blue-500 transition-colors">
                    <FaSignInAlt size={16} />
                    <span className="hidden sm:block ml-2">Login</span>
                  </Link>

                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={toggleMenu}
              className="md:hidden p-2 text-gray-600 hover:text-gray-900"
            >
              {isMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile search bar */}
        <div className="md:hidden mt-4">
          <form onSubmit={handleSearch} className="flex">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700"
            >
              <FaSearch />
            </button>
          </form>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="bg-gray-50 ">
        <div className="container mx-auto px-4">
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center justify-center space-x-8 ">
            <Link to="/" className="text-gray-700 hover:bg-blue-400 p-4 hover:text-white hover:font-semibold font-medium transition-colors">
              Home
            </Link>
            <Link to="/products" className="text-gray-700 hover:bg-blue-400 p-4 hover:text-white hover:font-semibold font-medium transition-colors">
              All Products
            </Link>
            <Link to="/categories/electronics" className="text-gray-700 hover:bg-blue-400 p-4 hover:text-white hover:font-semibold font-medium transition-colors">
              Electronics
            </Link>
            <Link to="/categories/clothing" className="text-gray-700 hover:bg-blue-400 p-4 hover:text-white hover:font-semibold font-medium transition-colors">
              Clothing
            </Link>
            <Link to="/categories/home" className="text-gray-700 hover:bg-blue-400 p-4 hover:text-white hover:font-semibold font-medium transition-colors">
              Home & Garden
            </Link>
            <Link to="/categories/sports" className="text-gray-700 hover:bg-blue-400 p-4 hover:text-white hover:font-semibold font-medium transition-colors">
              Sports
            </Link>
            <Link to="/deals" className="text-red-600 hover:text-red-700 font-medium transition-colors">
              Special Deals
            </Link>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t">
              <div className="flex flex-col space-y-3">
                <Link 
                  to="/" 
                  className="text-gray-700 hover:text-blue-600 font-medium py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
                <Link 
                  to="/products" 
                  className="text-gray-700 hover:text-blue-600 font-medium py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  All Products
                </Link>
                <Link 
                  to="/categories/electronics" 
                  className="text-gray-700 hover:text-blue-600 font-medium py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Electronics
                </Link>
                <Link 
                  to="/categories/clothing" 
                  className="text-gray-700 hover:text-blue-600 font-medium py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Clothing
                </Link>
                <Link 
                  to="/categories/home" 
                  className="text-gray-700 hover:text-blue-600 font-medium py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home & Garden
                </Link>
                <Link 
                  to="/categories/sports" 
                  className="text-gray-700 hover:text-blue-600 font-medium py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sports
                </Link>
                <Link 
                  to="/deals" 
                  className="text-red-600 hover:text-red-700 font-medium py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Special Deals
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;