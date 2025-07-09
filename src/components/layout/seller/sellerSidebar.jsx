import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaPlus, FaList, FaBoxOpen, FaStar, FaUser, FaShoppingBag, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { api } from '../../../config/axiosInstance';
import { toast } from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { clearUser } from '../../../Redux/Features/user/userSlice';

const links = [
  { name: 'Profile', to: 'profile', icon: <FaUser /> },
  { name: 'Add Product', to: 'add-product', icon: <FaPlus /> },
  { name: 'My Products', to: 'products', icon: <FaBoxOpen /> },
  { name: 'Orders', to: 'orders', icon: <FaShoppingBag /> },
  { name: 'Reviews', to: 'reviews', icon: <FaStar /> },
];

const SellerSidebar = () => {
  const navigate = useNavigate();
    const dispatch = useDispatch();
    const handleLogout = async () => {
    try {
      await api.get('/seller/logout');
      dispatch(clearUser());
      localStorage.clear(); // optional
      toast.success('Logged out successfully');
      navigate('/seller/login');
    } catch (err) {
      console.error("Logout failed", err);
      toast.error("Logout failed");
    }
  };
  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-sm font-medium ${
      isActive
        ? 'bg-white text-orange-500 shadow'
        : 'text-white hover:bg-orange-400/70'
    }`;

  return (
    <aside className="w-16 md:w-64 bg-gradient-to-b from-orange-500 to-pink-500 text-white min-h-screen transition-all duration-300">
      <div className="p-4">
        <h2 className="text-xl font-bold hidden md:block">Seller Dashboard</h2>
      </div>
      <nav className="flex flex-col gap-1">
        {links.map(({ name, to, icon }) => (
          <NavLink key={name} to={to} className={linkClass}>
            <span className="text-lg">{icon}</span>
            <span className="hidden md:inline">{name}</span>
          </NavLink>
        ))}
      </nav>
      <button
               onClick={handleLogout}
              className="mt-auto flex items-center gap-3 px-4 py-3 text-white hover:bg-red-500 text-sm">
              <span className="text-lg">
                <FaSignOutAlt />
              </span>
              <span className="hidden md:inline">Logout</span>
            </button>
    </aside>
  );
};

export default SellerSidebar;
