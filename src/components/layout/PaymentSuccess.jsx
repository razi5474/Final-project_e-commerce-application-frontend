import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { api } from '../../config/axiosInstance';
import { toast } from 'react-hot-toast';

const PaymentSuccess = () => {
  useEffect(() => {
    const createOrder = async () => {
      try {
        const address = JSON.parse(localStorage.getItem('shippingAddress'));
        const products = JSON.parse(localStorage.getItem('orderProducts'));

        if (!address || !products) {
          toast.error('Missing address or product details');
          return;
        }

        const res = await api.post('/order/create', {
          ...address,
          products,
        });

        toast.success('Order placed successfully!');

        // Clear localStorage after order
        localStorage.removeItem('shippingAddress');
        localStorage.removeItem('orderProducts');
      } catch (err) {
        console.error('Order Creation Failed:', err.response?.data || err.message);
        toast.error(err.response?.data?.error || 'Failed to place order.');
      }
    };

    createOrder();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-base-100 text-base-content">
      <div className="max-w-md w-full bg-base-200 rounded-xl shadow-md p-8 text-center">
        <CheckCircle className="mx-auto text-green-500 w-16 h-16 mb-4" />
        <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
        <p className="mb-6 text-sm text-base-content/70">
          Thank you for your purchase. Your order has been confirmed.
        </p>
        <Link to="/user/profile/orders" className="btn btn-primary w-full">
          View My Orders
        </Link>
        <Link to="/" className="mt-4 inline-block text-sm link link-primary">
          Go back to Home
        </Link>
      </div>
    </div>
  );
};

export default PaymentSuccess;
