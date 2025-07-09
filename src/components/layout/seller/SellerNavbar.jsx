import React, { useState } from 'react';
import { BsCart3 } from 'react-icons/bs';
import { CiShop } from 'react-icons/ci';
import { FaBars, FaTimes } from 'react-icons/fa';
import ThemeToggle from '../ThemeToggle';
import { NavLink, useNavigate } from 'react-router-dom';
import { api } from '../../../config/axiosInstance';
import { clearUser } from '../../../Redux/Features/user/userSlice';
import { useDispatch } from 'react-redux';
import SearchBar from '../SearchBar';
import { BsShop } from "react-icons/bs";


const SellerNavbar = () => {
  const dispatch = useDispatch();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.get("/seller/logout");
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      dispatch(clearUser());
      navigate("/seller/login");
    }
  };

  const goToProfile = () => {
    navigate("/seller/profile");
  };

  const goToDashboard = () => {
    navigate("/seller/");
  };

  return (
    <div>
      <nav className="w-full h-15 bg-base-100 text-base-content shadow px-4 py-2 md:px-6 relative z-50">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <NavLink to="/" className="flex items-center">
              <CiShop className="text-2xl md:text-3xl text-primary" />
              <span className="text-lg md:text-xl font-bold">Razkart Seller</span>
            </NavLink>
          </div>

          {/* Search Bar */}
          <div className="hidden lg:flex flex-1 mx-4">
            <SearchBar />
          </div>

          {/* Desktop Right Icons */}
          <div className="hidden lg:flex items-center space-x-4">
            <button
              onClick={goToDashboard}
              className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-4 py-2 rounded-md text-sm shadow-lg font-semibold hover:opacity-90 transition"
            >
              Seller Dashboard
            </button>
            {/* <button aria-label="Cart" onClick={() => navigate('/seller/cart')}>
              <BsCart3 className="text-2xl" />
            </button> */}

            {/* Profile Dropdown */}
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="hover:text-orange-500 transition">
                {/* <div className="w-10 rounded-full">
                  <img src="/images/seller_17427615.png" alt="Seller profile" />
                </div> */}
                <BsShop className="text-2xl" />
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-base-100 text-base-content rounded-box z-10 mt-3 w-52 p-2 shadow"
              >
                <li>
                  <button onClick={goToProfile} className="justify-between">
                    Profile <span className="badge badge-success">Seller</span>
                  </button>
                </li>
                <li>
                  <button onClick={handleLogout}>Logout</button>
                </li>
              </ul>
            </div>

            <ThemeToggle />
          </div>

          {/* Hamburger (Mobile) */}
          <div className="lg:hidden">
            <button onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
              {menuOpen ? <FaTimes className="text-2xl" /> : <FaBars className="text-2xl" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="absolute left-0 right-0 top-full z-50 lg:hidden bg-base-100 text-base-content px-4 py-4 shadow-md space-y-4">
            <SearchBar />

            <button
              onClick={goToDashboard}
              className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white py-2 rounded-md text-sm shadow hover:opacity-90 transition"
            >
              Seller Dashboard
            </button>

            <div className="flex items-center justify-between">
              {/* <button aria-label="Cart" onClick={() => navigate('/seller/cart')}>
                <BsCart3 className="text-2xl" />
              </button> */}

              <div className="dropdown dropdown-right">
                <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                  {/* <div className="w-10 rounded-full">
                    <img src="/images/seller_17427615.png" alt="Seller avatar" />
                  </div> */}
                  <BsShop className="text-2xl" />
                </div>
                <ul
                  tabIndex={0}
                  className="menu menu-sm dropdown-content bg-base-100 text-base-content rounded-box mt-3 w-52 p-2 shadow right-0"
                >
                  <li>
                    <button onClick={goToProfile} className="justify-between">
                      Profile <span className="badge badge-success">Seller</span>
                    </button>
                  </li>
                  <li>
                    <button onClick={handleLogout}>Logout</button>
                  </li>
                </ul>
              </div>

              <ThemeToggle />
            </div>
          </div>
        )}
      </nav>
    </div>
  );
};

export default SellerNavbar;
