import React, { useState } from 'react';
import { Menu, X, Store, LogIn, UserPlus } from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from './ThemeToggle';
import SearchBar from './SearchBar';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

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
            <ThemeToggle />

            <div className="flex items-center gap-2">
              <NavLink to="/login">
                <button className="btn btn-ghost btn-sm">
                  <LogIn className="w-4 h-4 mr-2" />
                  Login
                </button>
              </NavLink>
              <NavLink to="/register">
                <button className="btn btn-primary btn-sm">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Sign Up
                </button>
              </NavLink>
            </div>

            <NavLink to="/seller/register">
              <button className="btn btn-secondary btn-sm">
                Become a Seller
              </button>
            </NavLink>
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

              <div className="grid grid-cols-2 gap-3">
                <NavLink to="/login" className="btn btn-outline w-full content-center">
                  Login
                </NavLink>
                <NavLink to="/register" className="btn btn-primary w-full content-center">
                  Sign Up
                </NavLink>
              </div>

              <NavLink to="/seller/register" className="btn btn-secondary w-full content-center">
                Become a Seller
              </NavLink>

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

export default Navbar;
