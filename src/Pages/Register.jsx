import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { api } from '../config/axiosInstance';
import { saveUser, clearUser } from '../Redux/Features/user/userSlice';

const Register = ({ role }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
    try {
      const payload = { ...values };

      if (role === 'seller') {
        payload.storeName = values.storeName;
        payload.storeDescription = values.storeDescription;
        payload.storeAddress = values.storeAddress;
      }

      const response = await api.post(user.signupAPI, payload);
      dispatch(saveUser(response?.data?.userObject));
      navigate(user.profileRoute);
    } catch (error) {
      console.error('Registration Error:', error.response?.data || error.message);
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-100 to-indigo-200 dark:from-gray-900 dark:to-gray-800 px-4">
      <div className="w-full max-w-lg bg-white dark:bg-base-100 rounded-2xl shadow-2xl p-8">
        <h2 className="text-3xl font-bold text-center text-primary dark:text-white mb-6">
          {role === 'seller' ? 'Join as a Seller' : 'Create an Account'}
        </h2>

        <form onSubmit={formik.handleSubmit} className="space-y-5">
          {[
            { id: 'name', label: 'Full Name', type: 'text' },
            { id: 'email', label: 'Email', type: 'email' },
            { id: 'phone', label: 'Phone Number', type: 'text', maxLength: 10 },
            { id: 'password', label: 'Password', type: 'password' },
            { id: 'confirmPassword', label: 'Confirm Password', type: 'password' },
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
                className={`mt-1 w-full px-4 py-2 border rounded-xl bg-gray-50 dark:bg-base-200 focus:outline-none focus:ring-2 focus:ring-primary transition-all ${
                  formik.touched[id] && formik.errors[id] ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {formik.touched[id] && formik.errors[id] && (
                <p className="text-xs text-red-500 mt-1">{formik.errors[id]}</p>
              )}
            </div>
          ))}

          {role === 'seller' && (
            <>
              {[
                { id: 'storeName', label: 'Store Name', type: 'text' },
                { id: 'storeDescription', label: 'Store Description', type: 'textarea' },
                { id: 'storeAddress', label: 'Store Address', type: 'text' },
              ].map(({ id, label, type }) => (
                <div key={id}>
                  <label htmlFor={id} className="block text-sm font-semibold text-gray-700 dark:text-white">
                    {label}
                  </label>
                  {type === 'textarea' ? (
                    <textarea
                      id={id}
                      {...formik.getFieldProps(id)}
                      rows={3}
                      className={`mt-1 w-full px-4 py-2 border rounded-xl bg-gray-50 dark:bg-base-200 focus:outline-none focus:ring-2 focus:ring-primary transition-all ${
                        formik.touched[id] && formik.errors[id] ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                  ) : (
                    <input
                      id={id}
                      type="text"
                      {...formik.getFieldProps(id)}
                      className={`mt-1 w-full px-4 py-2 border rounded-xl bg-gray-50 dark:bg-base-200 focus:outline-none focus:ring-2 focus:ring-primary transition-all ${
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

        <p className="text-sm text-center text-gray-600 dark:text-gray-400 mt-5">
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
