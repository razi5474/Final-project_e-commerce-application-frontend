import React from 'react';
import { Link } from 'react-router-dom';
import { XCircle } from 'lucide-react';

const PaymentCancel = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-base-100 text-base-content">
      <div className="max-w-md w-full bg-base-200 rounded-xl shadow-md p-8 text-center">
        <XCircle className="mx-auto text-red-500 w-16 h-16 mb-4" />
        <h1 className="text-3xl font-bold mb-2">Payment Failed</h1>
        <p className="mb-6 text-sm text-base-content/70">
          Oops! Something went wrong. Your payment was not completed.
        </p>
        <Link to="/user/cart" className="btn btn-error w-full">
          Try Again
        </Link>
        <Link to="/" className="mt-4 inline-block text-sm link link-primary">
          Go back to Home
        </Link>
      </div>
    </div>
  );
};

export default PaymentCancel;
