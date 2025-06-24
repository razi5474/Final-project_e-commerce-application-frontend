import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState, useCallback } from 'react';
import { saveUser, clearUser } from '../Redux/Features/user/userSlice';
import { api } from '../config/axiosInstance';
import Loader from '../components/common/Loader';

const ProtectedRoutes = ({ allowedRoles }) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { isAuthUser, userData } = useSelector((state) => state.user);
  const [isLoading, setIsLoading] = useState(true);

  // ✅ Memoized check to avoid re-creation
  const checkUser = useCallback(async () => {
    try {
      const { data } = await api.get('/user/check-user', { withCredentials: true });
      dispatch(saveUser(data.userObject));
    } catch (err) {
      console.error("❌ Auth Error:", err.message);
      dispatch(clearUser());
    } finally {
      setIsLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    checkUser();
  }, [checkUser, location.pathname]);

  if (isLoading) return <Loader message="Checking authentication..." />;

  if (!isAuthUser) return <Navigate to="/login" state={{ from: location }} replace />;

  if (allowedRoles && !allowedRoles.includes(userData?.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoutes;
