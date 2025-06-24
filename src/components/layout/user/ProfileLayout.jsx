import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { clearUser } from '../../../Redux/Features/user/userSlice';
import { api } from '../../../config/axiosInstance';
import { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import { IoIosArrowDropdown } from "react-icons/io";
import BackButton from '../../common/BackButton'; // make sure the path is correct

const ProfileLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.user);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await api.get('/user/logout');
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      dispatch(clearUser());
      navigate('/login');
    }
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  useEffect(() => {
    const theme = localStorage.getItem('theme');
    if (theme) {
      document.documentElement.setAttribute('data-theme', theme);
    }
  }, []);

  useEffect(() => {
    // prevent background scroll when sidebar is open on mobile
    document.body.style.overflow = sidebarOpen ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [sidebarOpen]);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-base-100 text-base-content transition-all duration-300">
      
      {/* Mobile Navbar */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-base-200 shadow">
        <h1 className="text-lg font-semibold text-blue-600">My Account</h1>
        <button onClick={toggleSidebar} aria-label="Toggle menu" className="text-xl">
          {sidebarOpen ? <FaTimes /> : <IoIosArrowDropdown />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed md:static top-0 left-0 z-40 w-64 h-full bg-base-200 p-6 transform transition-transform duration-300 ease-in-out overflow-y-auto ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xl font-bold">
            {userData?.name?.charAt(0) || 'U'}
          </div>
          <h2 className="mt-2 font-medium text-gray-800">Hello,</h2>
          <p className="text-blue-600 font-bold">{userData?.name || 'User'}</p>
        </div>

        <nav className="space-y-3 text-sm">
          <h3 className="text-gray-500 uppercase font-medium">Account</h3>
          <NavLink
            to="/user/profile"
            className={({ isActive }) =>
              isActive ? 'text-blue-600 font-semibold block' : 'block hover:text-blue-600'
            }
            onClick={() => setSidebarOpen(false)}
          >
            👤 Profile Info
          </NavLink>
          <NavLink
            to="/user/profile/address"
            className={({ isActive }) =>
              isActive ? 'text-blue-600 font-semibold block' : 'block hover:text-blue-600'
            }
            onClick={() => setSidebarOpen(false)}
          >
            🏠 Manage Addresses
          </NavLink>

          <h3 className="text-gray-500 uppercase font-medium mt-4">Orders</h3>
          <NavLink
            to="/user/orders"
            className={({ isActive }) =>
              isActive ? 'text-blue-600 font-semibold block' : 'block hover:text-blue-600'
            }
            onClick={() => setSidebarOpen(false)}
          >
            📦 My Orders
          </NavLink>

          <button
            onClick={handleLogout}
            className="mt-6 w-full text-left text-red-600 hover:underline"
          >
            🚪 Logout
          </button>
        </nav>
      </aside>

      {/* Right Panel */}
      <main className="flex-1 p-4 md:p-6 bg-base-100 overflow-y-auto">
        <BackButton />
        <div className="mt-4">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default ProfileLayout;
