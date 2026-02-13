import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingBag, Star, User, LogOut, PlusCircle } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { clearUser } from '../../../Redux/Features/user/userSlice';

const SellerSidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(clearUser());
    navigate('/seller/login');
  };

  const navItems = [
    { to: '/seller', icon: <LayoutDashboard className="w-5 h-5" />, label: 'Dashboard', end: true },
    { to: '/seller/products', icon: <Package className="w-5 h-5" />, label: 'Products' },
    { to: '/seller/add-product', icon: <PlusCircle className="w-5 h-5" />, label: 'Add Product' },
    { to: '/seller/orders', icon: <ShoppingBag className="w-5 h-5" />, label: 'Orders' },
    { to: '/seller/reviews', icon: <Star className="w-5 h-5" />, label: 'Reviews' },
    { to: '/seller/profile', icon: <User className="w-5 h-5" />, label: 'Profile' },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-base-100 border-r border-base-200 min-h-screen sticky top-0">
      <div className="p-6 border-b border-base-200">
        <h2 className="text-xl font-bold text-primary flex items-center gap-2">
          <span className="badge badge-primary badge-outline text-xs">SELLER</span>
          Portal
        </h2>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
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

export default SellerSidebar;
