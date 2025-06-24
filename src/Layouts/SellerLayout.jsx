import React from 'react'
import Navbar from '../components/layout/Navbar'
import { Outlet } from 'react-router-dom'
import Footer from '../components/layout/Footer'
import { useSelector } from 'react-redux'
import SellerNavbar from '../components/layout/SellerNavbar'

const SellerLayout = () => {
  const { isAuthUser, userData } = useSelector((state) => state.user);

  const isSeller = isAuthUser && userData && userData.role === 'seller';

  return (
    <div>
      {isSeller ? <SellerNavbar /> : <Navbar />}
      <Outlet />
      <Footer />
    </div>
  );
};

export default SellerLayout;
