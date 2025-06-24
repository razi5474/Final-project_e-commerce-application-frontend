import React, { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import { CiShop } from 'react-icons/ci';
import ThemeToggle from "./ThemeToggle"; // Adjust path as needed
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { clearUser } from '../../Redux/Features/user/userSlice';

const SellerNavbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(clearUser());
    navigate('/seller/login');
  };

  return (
    <nav className="w-full bg-base-100 text-base-content shadow px-4 py-2 md:px-6 relative z-50">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <NavLink to="/seller/dashboard" className="flex items-center space-x-2">
          <CiShop className="text-2xl md:text-3xl text-primary" />
          <span className="text-lg md:text-xl font-bold">Seller Panel</span>
        </NavLink>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center space-x-6">
          <NavLink to="/seller/dashboard" className="hover:text-primary font-medium">
            Dashboard
          </NavLink>
          <NavLink to="/seller/products" className="hover:text-primary font-medium">
            My Products
          </NavLink>
          <NavLink to="/seller/add-product" className="hover:text-primary font-medium">
            Add Product
          </NavLink>
          <NavLink to="/seller/orders" className="hover:text-primary font-medium">
            Orders
          </NavLink>
          <NavLink to="/seller/profile" className="hover:text-primary font-medium">
            Profile
          </NavLink>
          <button
            onClick={handleLogout}
            className="px-4 py-1.5 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
          >
            Logout
          </button>
          <ThemeToggle />
        </div>

        {/* Mobile Hamburger */}
        <div className="lg:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
            {menuOpen ? <FaTimes className="text-2xl" /> : <FaBars className="text-2xl" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute left-0 right-0 top-full bg-base-100 px-4 py-4 shadow-md flex flex-col space-y-4 lg:hidden">
          <NavLink to="/seller/dashboard" className="hover:text-primary font-medium">
            Dashboard
          </NavLink>
          <NavLink to="/seller/products" className="hover:text-primary font-medium">
            My Products
          </NavLink>
          <NavLink to="/seller/add-product" className="hover:text-primary font-medium">
            Add Product
          </NavLink>
          <NavLink to="/seller/orders" className="hover:text-primary font-medium">
            Orders
          </NavLink>
          <NavLink to="/seller/profile" className="hover:text-primary font-medium">
            Profile
          </NavLink>
          <button
            onClick={handleLogout}
            className="w-full py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            Logout
          </button>
          <ThemeToggle />
        </div>
      )}
    </nav>
  );
};

export default SellerNavbar;
