import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { api } from '../config/axiosInstance';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearUser, saveUser } from '../Redux/Features/user/userSlice';
import { Eye, EyeOff, LogIn, Mail, Lock, User, ShoppingBag, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

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
    icon: <User className="w-8 h-8" />,
    color: 'text-primary',
  };

  if (role === 'seller') {
    user.role = 'seller';
    user.loginAPI = '/seller/login';
    user.signupRoute = '/seller/register';
    user.profileRoute = '/seller/profile';
    user.icon = <ShoppingBag className="w-8 h-8" />;
    user.color = 'text-secondary';
  } else if (role === 'admin') {
    user.role = 'admin';
    user.loginAPI = '/user/login';
    user.signupRoute = null;
    user.profileRoute = '/admin';
    user.icon = <Shield className="w-8 h-8" />;
    user.color = 'text-accent';
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
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card w-full max-w-md bg-base-100 shadow-xl"
      >
        <div className="card-body">
          <div className="flex flex-col items-center gap-2 mb-6">
            <div className={`p-4 rounded-full bg-base-200 ${user.color}`}>
              {user.icon || <User className="w-8 h-8" />}
            </div>
            <h2 className="text-3xl font-bold text-center">
              Welcome Back
            </h2>
            <p className="text-base-content/60 text-center">
              Login to your <span className="capitalize font-bold text-primary">{user.role}</span> account
            </p>
          </div>

          {serverError && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="alert alert-error text-sm py-2 rounded-lg mb-4"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span>{serverError}</span>
            </motion.div>
          )}

          <form onSubmit={formik.handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Email</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="you@example.com"
                  {...formik.getFieldProps('email')}
                  className={`input input-bordered w-full pl-10 ${formik.touched.email && formik.errors.email ? 'input-error' : ''
                    }`}
                />
                <Mail className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/40" />
              </div>
              {formik.touched.email && formik.errors.email && (
                <span className="text-error text-xs mt-1 ml-1">{formik.errors.email}</span>
              )}
            </div>

            {/* Password */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Password</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  {...formik.getFieldProps('password')}
                  className={`input input-bordered w-full pl-10 pr-10 ${formik.touched.password && formik.errors.password ? 'input-error' : ''
                    }`}
                />
                <Lock className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/40" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-base-content/40 hover:text-primary transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {formik.touched.password && formik.errors.password && (
                <span className="text-error text-xs mt-1 ml-1">{formik.errors.password}</span>
              )}
            </div>

            {/* Submit */}
            <div className="form-control mt-6">
              <button
                type="submit"
                className="btn btn-primary w-full gap-2 text-lg"
                disabled={loading}
              >
                {loading ? <span className="loading loading-spinner"></span> : <LogIn className="w-5 h-5" />}
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </div>
          </form>

          {user.role !== 'admin' && (
            <div className="text-center mt-4">
              <p className="text-sm text-base-content/60">
                Don't have an account?{' '}
                <Link to={user.signupRoute} className="link link-primary font-bold hover:no-underline">
                  Register
                </Link>
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
