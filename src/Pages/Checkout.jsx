import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../config/axiosInstance';
import { toast } from 'react-hot-toast';
import { loadStripe } from '@stripe/stripe-js';
import { useLocation } from 'react-router-dom';

const Checkout = () => {
const location = useLocation();
const searchParams = new URLSearchParams(location.search);
const mode = searchParams.get("mode"); // 'buynow' or null

  const [address, setAddress] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India'
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setAddress((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  const isValid = Object.values(address).every((val) => val.trim() !== '');
  if (!isValid) {
    toast.error('Please fill all address fields');
    return;
  }

  try {
    const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
    localStorage.setItem('shippingAddress', JSON.stringify(address));

    let products = [];

    if (mode === 'buynow') {
      const buyNowItem = JSON.parse(localStorage.getItem('buyNowItem'));
      if (!buyNowItem) {
        toast.error("No Buy Now item found");
        return;
      }
      products = [buyNowItem];
    } else {
      const cartRes = await api.get('/cart');
      products = cartRes.data.data.Products;
    }

    // Save order items
    const formattedProducts = products.map(item => ({
      productID: item.productID,
      quantity: item.quantity,
      price: item.price,
    }));
    localStorage.setItem('orderProducts', JSON.stringify(formattedProducts));

    const sessionRes = await api.post('/payment/create-checkout-session', {
      products,
      shippingAddress: address,
    });

    await stripe.redirectToCheckout({ sessionId: sessionRes.data.sessionId });

  } catch (err) {
    console.error(err);
    toast.error('Payment session failed.');
  }
};

  return (
    <div className="container mx-auto px-4 py-10 max-w-xl">
      <h2 className="text-3xl font-bold text-center mb-6 text-base-content">Shipping Address</h2>
      <form onSubmit={handleSubmit} className="space-y-4 bg-base-200 p-6 rounded-lg shadow-lg">
        <input type="text" name="fullName" placeholder="Full Name" value={address.fullName} onChange={handleChange} className="input input-bordered w-full" required />
        <input type="text" name="phone" placeholder="Phone Number" value={address.phone} onChange={handleChange} className="input input-bordered w-full" required />
        <input type="text" name="address" placeholder="Street Address" value={address.address} onChange={handleChange} className="input input-bordered w-full" required />
        <input type="text" name="city" placeholder="City" value={address.city} onChange={handleChange} className="input input-bordered w-full" required />
        <input type="text" name="state" placeholder="State" value={address.state} onChange={handleChange} className="input input-bordered w-full" required />
        <input type="text" name="postalCode" placeholder="Postal Code" value={address.postalCode} onChange={handleChange} className="input input-bordered w-full" required />
        <button type="submit" className="btn btn-primary w-full text-white">
          Continue to Payment
        </button>
      </form>
    </div>
  );
};

export default Checkout;
