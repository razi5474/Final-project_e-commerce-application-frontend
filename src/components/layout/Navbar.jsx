import React, { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import { CiShop } from 'react-icons/ci';
import ThemeToggle from './ThemeToggle';
import { NavLink } from 'react-router-dom';
import SearchBar from './SearchBar';


const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="w-full bg-base-100 text-base-content shadow px-4 py-2 md:px-6 relative z-50">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <NavLink to="/" className="flex items-center space-x-2">
          <CiShop className="text-2xl md:text-3xl text-primary" />
          <span className="text-lg md:text-xl font-bold">Razkart</span>
        </NavLink>

        {/* Search bar (desktop only) */}
        <div className="hidden lg:flex flex-1 mx-4">
          <SearchBar/>
        </div>

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center space-x-4">
          <NavLink to="/login">
            <button className="px-4 py-1.5 border border-purple-600 text-purple-600 bg-white rounded-md hover:bg-purple-50 hover:text-purple-700 transition-all duration-200">Login</button>
          </NavLink>
          <NavLink to="/register">
            <button className="px-4 py-1.5 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-all duration-200">Sign Up</button>
          </NavLink>
          <NavLink to="/seller/register">
            <button className="px-4 py-1.5 bg-gradient-to-r from-purple-600 to-purple-950 text-white rounded-md hover:from-purple-700 hover:to-purple-900 transition-all duration-200">
              Become a Seller
            </button>
          </NavLink>
          <ThemeToggle />
        </div>

        {/* Mobile Hamburger */}
        <div className="lg:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
            {menuOpen ? <FaTimes className="text-2xl" /> : <FaBars className="text-2xl" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
  <div className="absolute left-0 right-0 top-full bg-base-100 text-base-content px-4 py-5 shadow-md space-y-4 lg:hidden flex flex-col">
    {/* Search Input */}
    <SearchBar/>

    {/* Auth Buttons with spacing */}
    <div className="flex flex-col gap-2 pt-2">
      <NavLink to="/login">
        <button className="w-full py-2 rounded-md text-sm border border-purple-600 text-purple-600 bg-white hover:bg-purple-50 hover:text-purple-700 transition-all duration-200">
          Login
        </button>
      </NavLink>
      <NavLink to="/register">
        <button className="w-full py-2 rounded-md text-sm bg-purple-600 text-white hover:bg-purple-700 transition-all duration-200">
          Sign Up
        </button>
      </NavLink>
      <NavLink to="/seller/register">
        <button className="w-full py-2 rounded-md text-sm bg-gradient-to-r from-purple-600 to-purple-950 text-white hover:from-purple-700 hover:to-purple-900 transition-all duration-200">
          Become a Seller
        </button>
      </NavLink>
    </div>

    {/* Theme Toggle */}
    <div className="pt-2">
      <ThemeToggle />
    </div>
  </div>
)}

    </nav>
  );
};

export default Navbar;
