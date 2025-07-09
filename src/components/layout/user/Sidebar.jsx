import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaUser, FaMapMarkerAlt, FaShoppingCart, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { api } from '../../../config/axiosInstance';
import { toast } from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { clearUser } from '../../../Redux/Features/user/userSlice';
const links = [
  { name: 'Profile Info', to: '', icon: <FaUser /> },
  { name: 'Address', to: 'address', icon: <FaMapMarkerAlt /> },
  { name: 'My Orders', to: 'orders', icon: <FaShoppingCart /> },
];

const Sidebar = () => {
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
    `flex items-center py-3 px-4 gap-3 transition-all duration-200 text-sm font-medium border-l-4
     ${isActive
        ? 'bg-indigo-500/10 text-indigo-500 border-indigo-500'
        : 'text-base-content hover:bg-base-300 border-transparent'
     }`;

  return (
    <aside className="w-16 md:w-64 border-r border-base-300 bg-base-200 text-base-content min-h-screen transition-all duration-300">
      <div className="p-4">
        <h2 className="text-xl font-bold hidden md:block">User Dashboard</h2>
      </div>
      <nav className="flex flex-col gap-1">
        {links.map(({ name, to, icon }) => (
          <NavLink key={name} to={to} className={linkClass} end>
            <span className="text-lg">{icon}</span>
            <span className="hidden md:inline">{name}</span>
          </NavLink>
        ))}
      </nav>
      <button
               onClick={handleLogout}
              className="mt-auto flex items-center gap-3 px-4 py-3 text-base hover:bg-red-500 text-sm">
              <span className="text-lg">
                <FaSignOutAlt/>
              </span>
              <span className="hidden md:inline">Logout</span>
            </button>
    </aside>
  );
};

export default Sidebar;
