import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaSearch,
  FaShoppingCart,
  FaBars,
  FaTimes,
  FaHeart,
  FaSignInAlt,
} from "react-icons/fa";
import { FaCircleUser } from "react-icons/fa6";
import { Badge } from "antd";
import { observer } from "mobx-react-lite";
import { userStore } from "../store/user.mobx";
import CartDropdown from "./Cart";
import { cartStore } from "../store/cart.mobx";
import logout from "../auth/logout";
import logo from "../assets/landing/logo.jfif"; 
import {Modal} from "antd";
import Search from "./Search";

import useCookie from "../hooks/useCookie";

interface HeaderProps {
  wishlistCount?: number;
  isLoggedIn?: boolean;
  userName?: string;
  onLogout?: () => void;
}

// Sample cart items for demonstration

const Header = observer(
  ({ wishlistCount = 0 }: HeaderProps) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    const {clearCookie} = useCookie("access_token");

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
      setIsModalOpen(false);
      logout();
      userStore.clearUser();
      clearCookie(); // Clear the cookie
      navigate("/");
    };

    // Cart functions
    const handleUpdateQuantity = (id: number, quantity: number) => {
      cartStore.updateQuantity(id, quantity);
      if (quantity <= 0) {
        handleRemoveItem(id);
      }
    };

    const handleRemoveItem = (id: number) => {
      cartStore.removeFromCart(id);
    };

    const totalCartItems = cartStore.cartItems.reduce(
      (total, item) => total + item.quantity,
      0
    );

    return (
      <header className="bg-white shadow-md sticky top-0 z-50">
        <Modal
          title="Logout Confirmation"
          open={isModalOpen}
          onOk={handleLogout}
          onCancel={() => setIsModalOpen(false)}
          okType="danger"
          okText="Logout"
          cancelText="Cancel"
        />
        {/* Main header */}
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <img
                src={logo}
                alt="Logo"
                className="h-12 w-12 object-cover rounded-lg overflow-hidden"
              />
            </Link>

            {/* Search bar */}
            <Search />


            {/* Right side icons */}
            <div className="flex items-center space-x-4">
              {/* Search icon - Mobile */}
              <button className="md:hidden p-2 text-gray-600 hover:text-gray-900">
                <FaSearch size={20} />
              </button>

              {/* Wishlist */}
              <Link
                to="/wishlist"
                className="relative p-2 text-red-500 transition-colors"
              >
                <FaHeart size={20} />
                {wishlistCount > 0 && (
                  <Badge
                    count={wishlistCount}
                    size="small"
                    className="absolute -top-1 -right-1"
                  />
                )}
              </Link>

              {/* Shopping Cart */}
              <div className="relative">
                <div
                  className="relative p-2 text-blue-400 transition-colors flex items-center justify-center cursor-pointer"
                  onMouseEnter={() => setIsCartOpen(true)}
                  onMouseLeave={() => setIsCartOpen(false)}
                >
                  <FaShoppingCart size={20} />
                  {totalCartItems > 0 && (
                    <Badge
                      count={totalCartItems}
                      size="small"
                      className="absolute top-1 right-1"
                    />
                  )}

                  {/* Cart Dropdown */}
                  <CartDropdown
                    cartItems={cartStore.cartItems}
                    isVisible={isCartOpen}
                    onUpdateQuantity={handleUpdateQuantity}
                    onRemoveItem={handleRemoveItem}
                  />
                </div>
              </div>

              {/* User Account */}
              <div className="relative">
                {userStore.isLoggedIn ? (
                  <div className="flex items-end space-x-2">
                    <div className="relative group">
                      <button className="bg-lime-600 text-white flex flex-row items-end space-x-1 p-2 shadow-md rounded hover:bg-lime-700 transition-colors">
                        <FaCircleUser  size={24} color="#fff"  className="mr-2"/>
                        {userStore.user?.fullName.toUpperCase() || "User"}
                      </button>
                      {/* Dropdown menu */}
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                        <div className="py-1">
                          <Link
                            to="/profile"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            My Profile
                          </Link>

                          <Link
                            to="/settings"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            Settings
                          </Link>
                          <button
                            onClick={()=> setIsModalOpen(true)}
                            className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100"
                          >
                            Logout
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Link
                      to="/login"
                      className="flex items-center space-x-1 px-3 py-2  text-white rounded bg-blue-500 transition-colors"
                    >
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
              <Link
                to="/"
                className="text-gray-700 hover:bg-blue-400 p-4 hover:text-white hover:font-semibold font-medium transition-colors"
              >
                Home
              </Link>
              <Link
                to="/products"
                className="text-gray-700 hover:bg-blue-400 p-4 hover:text-white hover:font-semibold font-medium transition-colors"
              >
                All Products
              </Link>
              <Link
                to="/products"
                className="text-gray-700 hover:bg-blue-400 p-4 hover:text-white hover:font-semibold font-medium transition-colors"
              >
                Sách đang sale
              </Link>
              <Link
                to="/products"
                className="text-gray-700 hover:bg-blue-400 p-4 hover:text-white hover:font-semibold font-medium transition-colors"
              >
                Kinh điển
              </Link>
              <Link
                to="/products"
                className="text-gray-700 hover:bg-blue-400 p-4 hover:text-white hover:font-semibold font-medium transition-colors"
              >
                Sách giáo khoa
              </Link>
              <Link
                to="/products"
                className="text-gray-700 hover:bg-blue-400 p-4 hover:text-white hover:font-semibold font-medium transition-colors"
              >
                Truyện tranh
              </Link>
              <Link
                to="/deals"
                className="text-red-600 hover:text-white hover:bg-[#ef5a60] p-4 font-medium transition-colors"
              >
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
                    to="/products"
                    className="text-gray-700 hover:text-blue-600 font-medium py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sách đang sale
                  </Link>
                  <Link
                    to="/products"
                    className="text-gray-700 hover:text-blue-600 font-medium py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sách giáo khoa
                  </Link>
                  <Link
                    to="/products"
                    className="text-gray-700 hover:text-blue-600 font-medium py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sách kinh điển
                  </Link>
                  <Link
                    to="/products"
                    className="text-gray-700 hover:text-blue-600 font-medium py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Truyện tranh
                  </Link>
                  <Link
                    to="/deals"
                    className="text-red-600 hover:text-white hover:bg-[#ef5a60] font-medium py-2"
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
  }
);

export default Header;
