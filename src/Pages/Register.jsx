import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { api } from '../config/axiosInstance';
import { saveUser, clearUser } from '../Redux/Features/user/userSlice';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { toast } from 'react-hot-toast';

const Register = ({ role }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [serverError, setServerError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-100 to-indigo-200 dark:from-gray-900 dark:to-gray-800 px-4 py-10">
      <div className="w-full max-w-lg bg-white dark:bg-base-100 rounded-2xl shadow-2xl p-8">
        <h2 className="text-3xl font-bold text-center text-primary dark:text-white mb-6">
          {role === 'seller' ? 'Join as a Seller' : 'Create an Account'}
        </h2>

        {serverError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-md text-sm mb-4">
            {serverError}
          </div>
        )}
        <form onSubmit={formik.handleSubmit} className="space-y-5">
          {[
            { id: 'name', label: 'Full Name', type: 'text' },
            { id: 'email', label: 'Email', type: 'email' },
            { id: 'phone', label: 'Phone Number', type: 'text', maxLength: 10 },
          ].map(({ id, label, type, ...rest }) => (
            <div key={id}>
              <label htmlFor={id} className="block text-sm font-semibold text-gray-700 dark:text-white">
                {label}
              </label>
              <input
                id={id}
                type={type}
                {...formik.getFieldProps(id)}
                {...rest}
                className={`mt-1 w-full px-4 py-2 border rounded-xl bg-gray-50 dark:bg-base-200 focus:outline-none focus:ring-2 focus:ring-primary ${
                  formik.touched[id] && formik.errors[id] ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {formik.touched[id] && formik.errors[id] && (
                <p className="text-xs text-red-500 mt-1">{formik.errors[id]}</p>
              )}
            </div>
          ))}

          {/* Password */}
          <div className="relative">
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 dark:text-white">
              Password
            </label>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              {...formik.getFieldProps('password')}
              className={`mt-1 w-full px-4 py-2 border rounded-xl bg-gray-50 dark:bg-base-200 focus:outline-none focus:ring-2 focus:ring-primary ${
                formik.touched.password && formik.errors.password ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-[38px] right-3 text-gray-600"
            >
              {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </button>
            {formik.touched.password && formik.errors.password && (
              <p className="text-xs text-red-500 mt-1">{formik.errors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 dark:text-white">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              {...formik.getFieldProps('confirmPassword')}
              className={`mt-1 w-full px-4 py-2 border rounded-xl bg-gray-50 dark:bg-base-200 focus:outline-none focus:ring-2 focus:ring-primary ${
                formik.touched.confirmPassword && formik.errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute top-[38px] right-3 text-gray-600"
            >
              {showConfirmPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </button>
            {formik.touched.confirmPassword && formik.errors.confirmPassword && (
              <p className="text-xs text-red-500 mt-1">{formik.errors.confirmPassword}</p>
            )}
          </div>

          {/* Seller-specific fields */}
          {role === 'seller' && (
            <>
              {[{ id: 'storeName', label: 'Store Name' },
                { id: 'storeDescription', label: 'Store Description', isTextarea: true },
                { id: 'storeAddress', label: 'Store Address' }
              ].map(({ id, label, isTextarea }) => (
                <div key={id}>
                  <label htmlFor={id} className="block text-sm font-semibold text-gray-700 dark:text-white">
                    {label}
                  </label>
                  {isTextarea ? (
                    <textarea
                      id={id}
                      {...formik.getFieldProps(id)}
                      rows={3}
                      className={`mt-1 w-full px-4 py-2 border rounded-xl bg-gray-50 dark:bg-base-200 focus:outline-none focus:ring-2 focus:ring-primary ${
                        formik.touched[id] && formik.errors[id] ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                  ) : (
                    <input
                      id={id}
                      type="text"
                      {...formik.getFieldProps(id)}
                      className={`mt-1 w-full px-4 py-2 border rounded-xl bg-gray-50 dark:bg-base-200 focus:outline-none focus:ring-2 focus:ring-primary ${
                        formik.touched[id] && formik.errors[id] ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                  )}
                  {formik.touched[id] && formik.errors[id] && (
                    <p className="text-xs text-red-500 mt-1">{formik.errors[id]}</p>
                  )}
                </div>
              ))}
            </>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-primary to-blue-500 text-white py-2.5 rounded-xl font-semibold shadow-md hover:opacity-90 transition"
          >
            Register
          </button>
        </form>

        <p className="text-sm text-center text-gray-600 dark:text-gray-400 mt-6">
          Already have an account?{' '}
          <a href={user.loginRoute} className="text-primary hover:underline font-medium">
            Login here
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
