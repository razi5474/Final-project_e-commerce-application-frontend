import React, { useState } from 'react';
import { Store, Menu, X, ShoppingCart, LogOut, User, Search } from 'lucide-react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { api } from '../../config/axiosInstance';
import { clearUser } from '../../Redux/Features/user/userSlice';
import ThemeToggle from './ThemeToggle';
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
    finally {
      dispatch(clearUser());
      navigate("/login", { replace: true });
    }
  };

  const goToProfile = () => {
    navigate("/user/profile");
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-base-100/80 backdrop-blur-md border-b border-base-200">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
              <Store className="w-6 h-6 text-primary" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Razkart
            </span>
          </Link>

          {/* Search bar (desktop) */}
          <div className="hidden lg:flex flex-1 max-w-xl mx-8">
            <SearchBar />
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-4">
            <button className="btn btn-primary btn-sm hidden xl:flex">
              Become a Seller
            </button>

            <button
              className="btn btn-ghost btn-circle"
              onClick={() => navigate('/user/cart')}
              aria-label="Cart"
            >
              <div className="indicator">
                <ShoppingCart className="w-5 h-5" />
                {/* <span className="badge badge-xs badge-primary indicator-item"></span> */}
              </div>
            </button>

            <ThemeToggle />

            {/* Profile Dropdown */}
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar border border-base-300">
                <div className="w-9 rounded-full">
                  <img
                    alt="User"
                    src="/images/man_2922510.png"
                  />
                </div>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-base-100 text-base-content rounded-box z-[1] mt-3 w-52 p-2 shadow-lg border border-base-200"
              >
                <li>
                  <button onClick={goToProfile} className="justify-between">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Profile
                    </div>
                    <span className="badge badge-xs badge-primary">New</span>
                  </button>
                </li>
                <div className="divider my-0"></div>
                <li>
                  <button onClick={handleLogout} className="text-error">
                    <div className="flex items-center gap-2">
                      <LogOut className="w-4 h-4" />
                      Logout
                    </div>
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Mobile Toggle */}
          <button
            className="lg:hidden btn btn-ghost btn-square"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-base-200 overflow-hidden bg-base-100"
          >
            <div className="p-4 space-y-4">
              <SearchBar />

              <div className="flex items-center justify-between gap-2 p-2 bg-base-200/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="avatar">
                    <div className="w-10 rounded-full">
                      <img src="/images/man_2922510.png" alt="User" />
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Welcome back</p>
                    <p className="text-xs text-base-content/70">View Profile</p>
                  </div>
                </div>
                <button onClick={goToProfile} className="btn btn-ghost btn-sm btn-circle">
                  <User className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => navigate('/user/cart')} className="btn btn-outline w-full gap-2">
                  <ShoppingCart className="w-4 h-4" />
                  Cart
                </button>
                <button onClick={handleLogout} className="btn btn-outline btn-error w-full gap-2">
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>

              <button className="btn btn-primary w-full">
                Become a Seller
              </button>

              <div className="flex justify-center pt-2">
                <ThemeToggle />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default UserNavbar;
