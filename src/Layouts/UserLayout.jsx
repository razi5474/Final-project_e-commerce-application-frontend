import React, { useEffect, useState } from 'react'
import Navbar from '../components/layout/Navbar'
import { Outlet } from 'react-router-dom'
import Footer from '../components/layout/Footer'
import { useDispatch, useSelector } from 'react-redux'
import UserNavbar from '../components/layout/UserNavbar'
import { api } from '../config/axiosInstance'
import { saveUser, clearUser } from '../Redux/Features/user/userSlice'
import Loader from '../components/common/Loader'

const UserLayout = () => {
  const dispatch = useDispatch();
  const { isAuthUser } = useSelector((state) => state.user);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data } = await api.get('/user/check-user', { withCredentials: true });
        dispatch(saveUser(data.userObject));
      } catch (error) {
        dispatch(clearUser());
      } finally {
        setIsLoading(false);
      }
    };

    checkUser();
  }, [dispatch]);

  // 👇 Wait until user is checked
  if (isLoading) {
    return <Loader message="Loading layout..." />;
  }

  return (
    <div>
      {isAuthUser ? <UserNavbar /> : <Navbar />}
      <Outlet />
      <Footer />
    </div>
  )
}

export default UserLayout;
