import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaUserShield, FaUsers, FaStore, FaTachometerAlt, FaBox, FaClipboardList, FaStar, FaSignOutAlt, FaThLarge } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { api } from '../../../config/axiosInstance';
import { toast } from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { clearUser } from '../../../Redux/Features/user/userSlice';

const links = [
  { name: 'Dashboard', to: '/admin', icon: <FaTachometerAlt /> },
  { name: 'Profile', to: '/admin/profile', icon: <FaUserShield /> },
  { name: 'Manage Users', to: '/admin/users', icon: <FaUsers /> },
  { name: 'Manage Sellers', to: '/admin/sellers', icon: <FaStore /> },
  { name: 'Manage Products', to: '/admin/manage-products', icon: <FaBox /> },
  { name: 'Manage Orders', to: '/admin/orders', icon: <FaClipboardList /> },
  { name: 'Manage Reviews', to: '/admin/reviews', icon: <FaStar /> },
  { name: 'Manage Categories', to: '/admin/categories', icon: <FaThLarge /> }, // ✅ NEW
];

const AdminSidebar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
  try {
    await api.get('/user/logout');
    dispatch(clearUser());
    localStorage.clear(); // optional
    toast.success('Logged out successfully');
    navigate('/login');
  } catch (err) {
    console.error("Logout failed", err);
    toast.error("Logout failed");
  }
};

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-sm font-medium ${
      isActive
        ? 'bg-white text-blue-600 shadow'
        : 'text-white hover:bg-blue-400/70'
    }`;

  return (
    <aside className="w-16 md:w-64 bg-gradient-to-b from-blue-600 to-purple-600 text-white min-h-screen transition-all duration-300">
      <div className="p-4">
        <h2 className="text-xl font-bold hidden md:block">Admin Panel</h2>
      </div>
      <nav className="flex flex-col gap-1">
        {links.map(({ name, to, icon }) => (
          <NavLink
            key={name}
            to={to}
            className={linkClass}
            end={to === '/admin'} // Only for exact dashboard match
          >
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

export default AdminSidebar;
