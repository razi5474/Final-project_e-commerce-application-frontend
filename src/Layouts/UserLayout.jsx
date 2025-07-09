import React, { useEffect, useState } from 'react';
import Navbar from '../components/layout/Navbar';
import UserNavbar from '../components/layout/UserNavbar';
import SellerNavbar from '../components/layout/seller/SellerNavbar';
import Footer from '../components/layout/Footer';
import { Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { api } from '../config/axiosInstance';
import { saveUser, clearUser } from '../Redux/Features/user/userSlice';
import Loader from '../components/common/Loader';
import AdminNavbar from '../components/layout/admin/AdminNavbar';

const UserLayout = () => {
  const dispatch = useDispatch();
  const { isAuthUser, userData } = useSelector((state) => state.user);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // ✅ Check admin first
        const { data } = await api.get('/admin/check-admin', { withCredentials: true });
        dispatch(saveUser(data.userObject));
      } catch {
        try {
          // ✅ Then check seller
          const { data } = await api.get('/seller/check-seller', { withCredentials: true });
          dispatch(saveUser(data.userObject));
        } catch {
          try {
            // ✅ Lastly, check user
            const { data } = await api.get('/user/check-user', { withCredentials: true });
            dispatch(saveUser(data.userObject));
          } catch {
            dispatch(clearUser());
          }
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [dispatch]);

  if (isLoading) return <Loader message="Loading layout..." />;

  const role = userData?.role;
  let NavbarComponent = <Navbar />;

  if (isAuthUser) {
    if (role === 'user') NavbarComponent = <UserNavbar />;
    else if (role === 'seller') NavbarComponent = <SellerNavbar />;
    else if (role === 'admin') NavbarComponent = <AdminNavbar />;
  }

  return (
    <div>
      {NavbarComponent}
      <Outlet />
      <Footer />
    </div>
  );
};

export default UserLayout;
