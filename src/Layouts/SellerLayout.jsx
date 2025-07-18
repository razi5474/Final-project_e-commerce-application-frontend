import React, { useEffect, useState } from 'react';
import SellerNavbar from '../components/layout/seller/SellerNavbar';
import Footer from '../components/layout/Footer';
import { Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { api } from '../config/axiosInstance';
import { saveUser, clearUser } from '../Redux/Features/user/userSlice';
import Loader from '../components/common/Loader';
import SellerSidebar from '../components/layout/seller/sellerSidebar';

const SellerLayout = () => {
  const dispatch = useDispatch();
  const { isAuthUser, userData } = useSelector((state) => state.user);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSeller = async () => {
      if (!document.cookie.includes('token')) {
        setIsLoading(false);
        return;
      }

      try {
        const { data } = await api.get('/seller/check-seller');
        dispatch(saveUser(data.userObject));
      } catch (error) {
        if (error.response?.status !== 401) {
          console.error('Seller check failed', error);
        }
        dispatch(clearUser());
      } finally {
        setIsLoading(false);
      }
    };
    checkSeller();
  }, [dispatch]);

  if (isLoading) return <Loader message="Loading seller layout..." />;

  const isSeller = isAuthUser && userData?.role === 'seller';

  return (
    <div className="flex flex-col min-h-screen">
      {isSeller && <SellerNavbar />}

      {/* Content area (sidebar + main content) */}
      <div className="flex flex-1">
        <SellerSidebar />
        <main className="flex-1 bg-base-100 text-base-content p-4 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* Footer stays at bottom */}
      <Footer />
    </div>
  );
};

export default SellerLayout;
