import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const RegisterSuccess = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const role = query.get('role') || 'user';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-100 to-indigo-200 dark:from-gray-900 dark:to-gray-800 px-4 py-10">
      <div className="bg-white dark:bg-base-100 p-10 rounded-2xl shadow-xl max-w-md w-full text-center">
        <h2 className="text-3xl font-bold text-green-600 mb-4">🎉 Registration Successful!</h2>

        {role === 'seller' ? (
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Your seller account has been created. Please wait for admin approval.
            We will notify you once your account is verified.
          </p>
        ) : (
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Your account has been created. You can now log in to your account and start exploring.
          </p>
        )}

        <Link
          to={role === 'seller' ? '/seller/login' : '/login'}
          className="inline-block bg-gradient-to-r from-primary to-blue-500 text-white font-semibold px-6 py-3 rounded-xl shadow hover:opacity-90 transition"
        >
          Go to Login
        </Link>
      </div>
    </div>
  );
};

export default RegisterSuccess;
