import React, { useState } from 'react';
import { Store, LayoutDashboard, LogOut, User, Menu, X, Search } from 'lucide-react';
import { useNavigate, NavLink, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { clearUser } from '../../../Redux/Features/user/userSlice';
import ThemeToggle from '../ThemeToggle';
import SearchBar from '../SearchBar';
import { api } from '../../../config/axiosInstance';
import { toast } from 'react-hot-toast';

const SellerNavbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await api.get('/seller/logout');
      toast.success('Logout successful');
    } catch (err) {
      console.error('Logout failed', err);
      toast.error('Logout failed');
    } finally {
      dispatch(clearUser());
      navigate('/seller/login', { replace: true });
    }
  };

  const goToDashboard = () => {
    navigate('/seller');
    setMenuOpen(false);
  };

  const goToProfile = () => {
    navigate('/seller/profile');
    setMenuOpen(false);
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
            <span className="text-xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
              Razkart Seller
            </span>
          </Link>

          {/* Search bar (desktop) */}
          <div className="hidden lg:flex flex-1 max-w-xl mx-8">
            <SearchBar />
          </div>

          {/* Desktop Right Icons */}
          <div className="hidden lg:flex items-center gap-4">
            <button
              onClick={goToDashboard}
              className="btn btn-primary btn-sm gap-2"
            >
              <LayoutDashboard className="w-4 h-4" />
              Seller Dashboard
            </button>

            <ThemeToggle />

            {/* Profile Dropdown */}
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar border border-base-300">
                <div className="w-9 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-5 h-5 text-primary" />
                </div>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-base-100 text-base-content rounded-box z-[1] mt-3 w-52 p-2 shadow-lg border border-base-200"
              >
                <div className="px-4 py-2 border-b border-base-200 mb-2">
                  <p className="font-bold text-xs opacity-50 uppercase tracking-wider">Seller Center</p>
                </div>
                <li>
                  <button onClick={goToProfile} className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Profile
                  </button>
                </li>
                <li>
                  <button onClick={handleLogout} className="text-error flex items-center gap-2">
                    <LogOut className="w-4 h-4" />
                    Logout
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

              <div className="flex items-center gap-3 p-3 bg-base-200/50 rounded-lg">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Store className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-bold">Welcome, Partner</p>
                  <p className="text-xs opacity-60 italic text-primary">Manage your store on the go</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2">
                <button onClick={goToDashboard} className="btn btn-ghost justify-start gap-3 w-full">
                  <LayoutDashboard className="w-5 h-5" />
                  Seller Dashboard
                </button>
                <button onClick={goToProfile} className="btn btn-ghost justify-start gap-3 w-full">
                  <User className="w-5 h-5" />
                  Seller Profile
                </button>
              </div>

              <div className="divider my-0"></div>

              <div className="flex items-center justify-between">
                <ThemeToggle />
                <button onClick={handleLogout} className="btn btn-error btn-sm gap-2">
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default SellerNavbar;
