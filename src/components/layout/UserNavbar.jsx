import React, { useState } from 'react';
import { BsCart3 } from 'react-icons/bs';
import { CiShop } from 'react-icons/ci';
import { FaBars, FaTimes } from 'react-icons/fa';
import ThemeToggle from './ThemeToggle';
import { NavLink } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { api } from '../../config/axiosInstance';
import { clearUser } from '../../Redux/Features/user/userSlice';
import { useDispatch } from 'react-redux';
import SearchBar from './SearchBar';

const UserNavbar = () => {
    const dispatch = useDispatch();
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.get("/user/logout");

    } catch (err) {
      console.error("Logout failed", err);
    }
    finally{
      dispatch(clearUser());
      navigate("/login"); // Redirect to login page after logout
    }

  };
  const goToProfile = () => {
    navigate("/user/profile"); // Your profile route
  };
  return (
    <div>
      <nav className="w-full h-15 bg-base-100 text-base-content shadow px-4 py-2 md:px-6 relative z-50 ">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <NavLink to="/" className="flex items-center">
            <CiShop className="text-2xl md:text-3xl text-primary" />
            <span className="text-lg md:text-xl font-bold">Razkart</span>
          </NavLink>
        </div>


        {/* Search bar */}
        <div className="hidden lg:flex flex-1 mx-4">
          <SearchBar/>
        </div>

        {/* Right icons (desktop) */}
        <div className="hidden lg:flex items-center space-x-4">
          <button className="bg-primary text-white px-4 py-2 rounded-md text-sm hover:bg-primary-focus">
            Become a Seller
          </button>
          <button aria-label="Cart" onClick={() => navigate('/user/cart')}>
          <BsCart3 className="text-2xl" />
          </button>

          {/* Profile Dropdown */}
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <img
                  src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                  alt="User profile"
                />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 text-base-content rounded-box z-10 mt-3 w-52 p-2 shadow"
            >
              <li>
              <button onClick={goToProfile} className="justify-between">
                Profile <span className="badge">New</span>
              </button>
            </li>
            {/* <li>
              <button onClick={() => navigate("/settings")}>Settings</button>
            </li> */}
            <li>
              <button onClick={handleLogout}>Logout</button>
            </li>
                </ul>
              </div>

          {/* Dark Mode Toggle */}
          <ThemeToggle />
        </div>

        {/* Hamburger for mobile */}
        <div className="lg:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
            {menuOpen ? <FaTimes className="text-2xl" /> : <FaBars className="text-2xl" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="absolute left-0 right-0 top-full z-50 lg:hidden bg-base-100 text-base-content   px-4 py-4 shadow-md space-y-4 ">
          <SearchBar/>

          <button className="w-full bg-primary text-white py-2 rounded-md text-sm hover:bg-primary-focus transition">
            Become a Seller
          </button>

          <div className="flex items-center justify-between">
            <button aria-label="Cart">
              <BsCart3 className="text-2xl" />
            </button>

            {/* Profile */}
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full">
                  <img
                    alt="User"
                    src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                  />
                </div>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-base-100 text-base-content rounded-box shadow-lg mt-3 w-44"
              >
                <li>
                    <button onClick={goToProfile} className="justify-between">
                      Profile <span className="badge">New</span>
                    </button>
                  </li>
                  {/* <li>
                    <button onClick={() => navigate("/settings")}>Settings</button>
                  </li> */}
                  <li>
                    <button onClick={handleLogout}>Logout</button>
                  </li>
              </ul>
            </div>

            {/* Dark Mode */}
            <ThemeToggle />
          </div>
        </div>
      )}
    </nav>
    </div>
  )
}

export default UserNavbar
