import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { api } from '../config/axiosInstance';
import { clearUser } from '../Redux/Features/user/userSlice';
import { Eye, EyeOff, UserPlus, Mail, Phone, Lock, User, MapPin, Store, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

const Register = ({ role }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [serverError, setServerError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const user = {
    role: 'user',
    signupAPI: '/user/register',
    loginRoute: '/login',
    profileRoute: '/user/profile',
  };

  if (role === 'seller') {
    user.role = 'seller';
    user.signupAPI = '/seller/register';
    user.loginRoute = '/seller/login';
    user.profileRoute = '/seller/profile';
  }

  const submitData = async (values) => {
    setServerError('');
    setLoading(true);
    try {
      const payload = { ...values };

      if (role === 'seller') {
        payload.storeName = values.storeName;
        payload.storeDescription = values.storeDescription;
        payload.storeAddress = values.storeAddress;
      }

      const response = await api.post(user.signupAPI, payload);
      const userObject = response?.data?.userData;

      if (userObject?.role !== user.role) {
        setServerError(`Role mismatch: expected ${user.role}, got ${userObject?.role}`);
        return;
      }

      navigate(`/register-success?role=${user.role}`);
      formik.resetForm();
    } catch (error) {
      const msg = error.response?.data?.message || error.response?.data?.error || "Something went wrong";
      console.error('Registration Error:', msg);
      setServerError(msg);
      dispatch(clearUser());
    } finally {
      setLoading(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      storeName: '',
      storeDescription: '',
      storeAddress: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().min(3).required('Name is required'),
      email: Yup.string().email().required('Email is required'),
      phone: Yup.string()
        .matches(/^[6-9]\d{9}$/, 'Enter a valid 10-digit phone number')
        .required('Phone is required'),
      password: Yup.string().min(6).required('Password is required'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], 'Passwords must match')
        .required('Confirm your password'),
      ...(role === 'seller' && {
        storeName: Yup.string().required('Store name is required'),
        storeDescription: Yup.string().required('Description required'),
        storeAddress: Yup.string().required('Address required'),
      }),
    }),
    onSubmit: (values) => submitData(values),
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card w-full max-w-lg bg-base-100 shadow-xl"
      >
        <div className="card-body">
          <h2 className="text-3xl font-bold text-center mb-6">
            {role === 'seller' ? 'Join as a Seller' : 'Create an Account'}
          </h2>

          {serverError && (
            <div className="alert alert-error text-sm py-2 rounded-lg mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span>{serverError}</span>
            </div>
          )}

          <form onSubmit={formik.handleSubmit} className="space-y-4">
            {[
              { id: 'name', label: 'Full Name', type: 'text', icon: <User className="w-5 h-5" /> },
              { id: 'email', label: 'Email', type: 'email', icon: <Mail className="w-5 h-5" /> },
              { id: 'phone', label: 'Phone Number', type: 'text', maxLength: 10, icon: <Phone className="w-5 h-5" /> },
            ].map(({ id, label, type, icon, ...rest }) => (
              <div key={id} className="form-control">
                <label htmlFor={id} className="label">
                  <span className="label-text font-medium">{label}</span>
                </label>
                <div className="relative">
                  <input
                    id={id}
                    type={type}
                    {...formik.getFieldProps(id)}
                    {...rest}
                    className={`input input-bordered w-full pl-10 ${formik.touched[id] && formik.errors[id] ? 'input-error' : ''
                      }`}
                  />
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/40">
                    {icon}
                  </span>
                </div>
                {formik.touched[id] && formik.errors[id] && (
                  <span className="text-error text-xs mt-1 ml-1">{formik.errors[id]}</span>
                )}
              </div>
            ))}

            {/* Seller-specific fields */}
            {role === 'seller' && (
              <>
                {[
                  { id: 'storeName', label: 'Store Name', icon: <Store className="w-5 h-5" /> },
                  { id: 'storeAddress', label: 'Store Address', icon: <MapPin className="w-5 h-5" /> }
                ].map(({ id, label, icon }) => (
                  <div key={id} className="form-control">
                    <label htmlFor={id} className="label"><span className="label-text font-medium">{label}</span></label>
                    <div className="relative">
                      <input
                        id={id}
                        type="text"
                        {...formik.getFieldProps(id)}
                        className={`input input-bordered w-full pl-10 ${formik.touched[id] && formik.errors[id] ? 'input-error' : ''}`}
                      />
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/40">{icon}</span>
                    </div>
                    {formik.touched[id] && formik.errors[id] && <span className="text-error text-xs mt-1 ml-1">{formik.errors[id]}</span>}
                  </div>
                ))}

                <div className="form-control">
                  <label htmlFor="storeDescription" className="label"><span className="label-text font-medium">Store Description</span></label>
                  <div className="relative">
                    <textarea
                      id="storeDescription"
                      rows={3}
                      {...formik.getFieldProps('storeDescription')}
                      className={`textarea textarea-bordered w-full pl-10 ${formik.touched.storeDescription && formik.errors.storeDescription ? 'textarea-error' : ''}`}
                    ></textarea>
                    <span className="absolute left-3 top-4 text-base-content/40"><FileText className="w-5 h-5" /></span>
                  </div>
                  {formik.touched.storeDescription && formik.errors.storeDescription && <span className="text-error text-xs mt-1 ml-1">{formik.errors.storeDescription}</span>}
                </div>
              </>
            )}

            {/* Password */}
            <div className="form-control">
              <label className="label"><span className="label-text font-medium">Password</span></label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...formik.getFieldProps('password')}
                  className={`input input-bordered w-full pl-10 pr-10 ${formik.touched.password && formik.errors.password ? 'input-error' : ''}`}
                />
                <Lock className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/40" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-base-content/40 hover:text-primary">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {formik.touched.password && formik.errors.password && <span className="text-error text-xs mt-1 ml-1">{formik.errors.password}</span>}
            </div>

            {/* Confirm Password */}
            <div className="form-control">
              <label className="label"><span className="label-text font-medium">Confirm Password</span></label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  {...formik.getFieldProps('confirmPassword')}
                  className={`input input-bordered w-full pl-10 pr-10 ${formik.touched.confirmPassword && formik.errors.confirmPassword ? 'input-error' : ''}`}
                />
                <Lock className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/40" />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-base-content/40 hover:text-primary">
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {formik.touched.confirmPassword && formik.errors.confirmPassword && <span className="text-error text-xs mt-1 ml-1">{formik.errors.confirmPassword}</span>}
            </div>

            <div className="form-control mt-6">
              <button
                type="submit"
                className="btn btn-primary w-full gap-2 text-lg"
                disabled={loading}
              >
                {loading ? <span className="loading loading-spinner"></span> : <UserPlus className="w-5 h-5" />}
                {loading ? 'Registering...' : role === 'seller' ? 'Join as Seller' : 'Create Account'}
              </button>
            </div>
          </form>

          <div className="text-center mt-4">
            <p className="text-sm text-base-content/60">
              Already have an account?{' '}
              <Link to={user.loginRoute} className="link link-primary font-bold hover:no-underline">
                Login here
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
