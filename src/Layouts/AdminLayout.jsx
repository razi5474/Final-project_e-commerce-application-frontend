import React, { useEffect, useState } from 'react';
import AdminNavbar from '../components/layout/admin/AdminNavbar';
import AdminSidebar from '../components/layout/admin/AdminSidebar';
import Footer from '../components/layout/Footer';
import { Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { api } from '../config/axiosInstance';
import { saveUser, clearUser } from '../Redux/Features/user/userSlice';
import Loader from '../components/common/Loader';

const AdminLayout = () => {
  const dispatch = useDispatch();
  const { isAuthUser, userData } = useSelector((state) => state.user);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAdmin = async () => {
      if (!document.cookie.includes('token')) {
        setIsLoading(false);
        return;
      }

      try {
        const { data } = await api.get('/admin/check-admin');
        dispatch(saveUser(data.userObject));
      } catch (error) {
        if (error.response?.status !== 401) {
          console.error('Admin check failed', error);
        }
        dispatch(clearUser());
      } finally {
        setIsLoading(false);
      }
    };

    checkAdmin();
  }, [dispatch]);

  if (isLoading) return <Loader message="Loading admin layout..." />;

  const isAdmin = isAuthUser && userData?.role === 'admin';

  if (!isAdmin) {
    return <div className="text-center mt-20 text-red-600 font-semibold">Unauthorized Access</div>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <AdminNavbar />
      <div className="flex flex-1">
        <AdminSidebar />
        <main className="flex-1 bg-base-100 text-base-content p-4 overflow-y-auto">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default AdminLayout;
