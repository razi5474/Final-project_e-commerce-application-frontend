import React, { useState } from 'react';
import { FaUserShield, FaBars, FaTimes } from 'react-icons/fa';
import { useNavigate, NavLink } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { clearUser } from '../../../Redux/Features/user/userSlice';
import ThemeToggle from '../ThemeToggle';
import { api } from '../../../config/axiosInstance';
import { toast } from 'react-hot-toast';
const AdminNavbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

   const handleLogout = async () => {
    try {
      await api.get('/user/logout'); // ✅ Use same endpoint as User
      toast.success('Logout successful');
    } catch (err) {
      console.error('Logout failed', err);
      toast.error('Logout failed');
    } finally {
      dispatch(clearUser());
      navigate('/admin/login');
    }
  };

  const goToDashboard = () => {
    navigate('/admin');
  };

  const goToProfile = () => {
    navigate('/admin/profile');
  };

  return (
    <nav className="w-full h-15 bg-gradient-to-r from-slate-900 via-sky-900 to-blue-900 text-white px-4 py-2 md:px-6 shadow relative z-50">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <NavLink to="/" className="flex items-center space-x-2">
          <FaUserShield className="text-2xl text-white" />
          <span className="text-xl font-bold">Razkart Admin</span>
        </NavLink>

        {/* Desktop Icons */}
        <div className="hidden lg:flex items-center space-x-4">
          <button
            onClick={goToDashboard}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 text-white px-4 py-2 rounded-md text-sm font-semibold shadow-md"
          >
            Admin Dashboard
          </button>

          {/* Profile Dropdown */}
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="hover:text-yellow-400 transition">
              <FaUserShield className="text-2xl" />
            </div>
            <ul className="menu menu-sm dropdown-content bg-base-100 text-base-content rounded-box z-10 mt-3 w-52 p-2 shadow">
              <li>
                <button onClick={goToProfile} className="justify-between">
                  Profile <span className="badge badge-info">Admin</span>
                </button>
              </li>
              <li>
                <button onClick={handleLogout}>Logout</button>
              </li>
            </ul>
          </div>

          <ThemeToggle />
        </div>

        {/* Hamburger */}
        <div className="lg:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
            {menuOpen ? <FaTimes className="text-2xl" /> : <FaBars className="text-2xl" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute left-0 right-0 top-full z-50 lg:hidden bg-base-100 text-base-content px-4 py-4 shadow-md space-y-4">
          <button
            onClick={goToDashboard}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 rounded-md text-sm shadow hover:opacity-90 transition"
          >
            Admin Dashboard
          </button>

          <div className="flex items-center justify-between">
            <div className="dropdown dropdown-right">
              <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                <FaUserShield className="text-2xl" />
              </div>
              <ul className="menu menu-sm dropdown-content bg-base-100 text-base-content rounded-box mt-3 w-44 shadow-lg">
                <li>
                  <button onClick={goToProfile} className="justify-between">
                    Profile <span className="badge badge-info">Admin</span>
                  </button>
                </li>
                <li>
                  <button onClick={handleLogout}>Logout</button>
                </li>
              </ul>
            </div>

            <ThemeToggle />
          </div>
        </div>
      )}
    </nav>
  );
};

export default AdminNavbar;
