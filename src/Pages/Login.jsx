import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { api } from '../config/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearUser, saveUser } from '../Redux/Features/user/userSlice';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { Link } from 'react-router-dom';

const Login = ({ role }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);

  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const user = {
    role: 'user',
    loginAPI: '/user/login',
    signupRoute: '/register',
    profileRoute: '/user/profile',
  };

  if (role === 'seller') {
    user.role = 'seller';
    user.loginAPI = '/seller/login';
    user.signupRoute = '/seller/register';
    user.profileRoute = '/seller/profile';
  } else if (role === 'admin') {
    user.role = 'admin';
    user.loginAPI = '/user/login';
    user.signupRoute = null;
    user.profileRoute = '/admin';
  }

  // 🔁 Redirect if already logged in
  useEffect(() => {
    if (userData?._id && userData?.role === role) {
      navigate(user.profileRoute);
    }
  }, [userData]);

  const submitData = async (values) => {
    try {
      setLoading(true);
      setServerError('');

      const response = await api.post(user.loginAPI, values, { withCredentials: true });
      const userObject = response?.data?.userObject;

      // ❌ Role mismatch
      if (userObject?.role !== user.role) {
        setServerError(`You are not authorized to login as ${user.role}`);
        return;
      }

      // ❌ Blocked user
      if (userObject?.isBlocked) {
        setServerError('Your account has been blocked by admin.');
        return;
      }

      dispatch(saveUser(userObject));
      navigate(user.profileRoute);
    } catch (error) {
      if (error?.response?.status === 403) {
        setServerError(error.response.data.error || 'Access denied');
      } else if (error?.response?.status === 400) {
        setServerError(error.response.data.error || 'Invalid email or password');
      } else {
        setServerError('Something went wrong. Please try again.');
      }
      dispatch(clearUser());
    } finally {
      setLoading(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email format').required('Email is required'),
      password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    }),
    onSubmit: (values) => {
      setServerError('');
      submitData(values);
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-100 to-indigo-200 dark:from-gray-900 dark:to-gray-800 px-4">
      <div className="w-full max-w-md bg-white dark:bg-base-100 rounded-xl shadow-2xl p-8 space-y-6">
        <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white">
          Login to Your{' '}
          <span className="text-blue-600 capitalize flex items-center justify-center gap-1">
            {role === 'user' && '👤'}
            {role === 'seller' && '🛍'}
            {role === 'admin' && '🛡'}
            {user.role}
          </span>{' '}
          Account
        </h2>

        {serverError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-md text-sm">
            {serverError}
          </div>
        )}

        <form onSubmit={formik.handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-white">
              Email
            </label>
            <input
              type="email"
              id="email"
              autoFocus
              {...formik.getFieldProps('email')}
              className={`mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring focus:ring-blue-300 focus:outline-none dark:bg-base-200 ${
                formik.touched.email && formik.errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {formik.touched.email && formik.errors.email && (
              <p className="text-red-500 text-xs mt-1">{formik.errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div className="relative">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-white">
              Password
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              {...formik.getFieldProps('password')}
              className={`mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring focus:ring-blue-300 focus:outline-none dark:bg-base-200 ${
                formik.touched.password && formik.errors.password ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[38px] text-gray-500 hover:text-blue-600"
            >
              {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </button>
            {formik.touched.password && formik.errors.password && (
              <p className="text-red-500 text-xs mt-1">{formik.errors.password}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition duration-200 font-semibold disabled:opacity-60"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {user.role !== 'admin' && (
          <div className="text-center text-sm text-gray-600 dark:text-gray-400">
            Don't have an account?{' '}
            <Link to={user.signupRoute} className="text-blue-600 hover:underline dark:text-blue-400">
              Register
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
