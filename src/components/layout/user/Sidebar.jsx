import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { User, MapPin, ShoppingBag, LogOut, LayoutDashboard } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { clearUser } from '../../../Redux/Features/user/userSlice';
import { motion } from 'framer-motion';

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(clearUser());
    navigate('/');
  };

  const navItems = [
    { to: '/user/profile', icon: <User className="w-5 h-5" />, label: 'Profile Information' },
    { to: '/user/profile/address', icon: <MapPin className="w-5 h-5" />, label: 'Manage Addresses' },
    { to: '/user/profile/orders', icon: <ShoppingBag className="w-5 h-5" />, label: 'My Orders' },
  ];

  return (
    <aside className="w-full md:w-64 bg-base-100 shadow-lg md:h-screen sticky top-0 md:flex flex-col border-r border-base-200">
      <div className="p-6 border-b border-base-200">
        <h2 className="text-2xl font-bold flex items-center gap-2 text-primary">
          <LayoutDashboard className="w-6 h-6" />
          Dashboard
        </h2>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/user/profile'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${isActive
                ? 'bg-primary text-primary-content shadow-md'
                : 'text-base-content/70 hover:bg-base-200 hover:text-base-content'
              }`
            }
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-base-200">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-error hover:bg-error/10 transition-colors font-medium"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
