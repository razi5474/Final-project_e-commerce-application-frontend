import React, { useEffect, useState } from 'react';
import { api } from '../config/axiosInstance';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { Minus, Plus, X, ShoppingCart, Trash2, ArrowLeft } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { motion, AnimatePresence } from 'framer-motion';

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await api.get('/cart');
      setCart(res.data.data);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to fetch cart');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const updateQuantity = async (productId, newQty) => {
    if (!productId || typeof newQty !== 'number' || newQty < 1) {
      toast.error("Invalid product ID or quantity");
      return;
    }
    try {
      const res = await api.put('/cart/updateCart', { productId, quantity: newQty });
      setCart(res.data.cart);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update cart');
    }
  };

  const removeItem = async (productId) => {
    try {
      const res = await api.delete('/cart/removeProduct', { data: { productId } });
      setCart(res.data.cart);
      toast.success('Item removed');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to remove item');
    }
  };

  const clearCart = async () => {
    try {
      await api.delete('/cart/clearCart');
      setCart(null);
      toast.success('Cart cleared');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to clear cart');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-[60vh] text-primary">Loading your cart...</div>;
  }

  if (!cart || cart.Products.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center min-h-[60vh] gap-4"
      >
        <div className="w-24 h-24 bg-base-200 rounded-full flex items-center justify-center">
          <ShoppingCart className="w-10 h-10 text-base-content/30" />
        </div>
        <h2 className="text-2xl font-bold text-base-content">Your cart is empty</h2>
        <p className="text-base-content/60">Looks like you haven't added anything yet.</p>
        <button onClick={() => navigate('/')} className="btn btn-primary mt-4">
          Start Shopping
        </button>
      </motion.div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate(-1)} className="btn btn-ghost btn-circle">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-3xl font-bold text-base-content">Your Cart</h1>
        <span className="badge badge-lg badge-neutral">{cart.Products.length} items</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          <AnimatePresence>
            {cart.Products.map((item) => (
              <motion.div
                key={item._id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex flex-col sm:flex-row items-center justify-between bg-base-100 p-4 rounded-xl shadow-sm border border-base-200 gap-4"
              >
                <div
                  onClick={() => navigate(`/product/productDeatails/${item.productID?._id || item.productID}`)}
                  className="flex gap-4 items-center w-full sm:w-auto cursor-pointer group"
                >
                  <div className="w-20 h-20 bg-base-200 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={item.productID?.images?.[1] || item.productID?.images?.[0] || '/default-product.jpg'}
                      alt={item.productID?.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg group-hover:text-primary transition-colors line-clamp-1">{item.productID?.title}</h3>
                    <p className="text-sm text-base-content/60">Unit Price: ₹{item.price}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between w-full sm:w-auto gap-6">
                  {/* Quantity Controls */}
                  <div className="join border border-base-300 rounded-lg">
                    <button onClick={() => updateQuantity(item.productID?._id || item.productID, item.quantity - 1)} className="join-item btn btn-sm btn-ghost px-2">
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="join-item flex items-center px-4 bg-base-100 font-medium text-sm">
                      {item.quantity}
                    </span>
                    <button onClick={() => updateQuantity(item.productID?._id || item.productID, item.quantity + 1)} className="join-item btn btn-sm btn-ghost px-2">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="text-right font-bold text-lg min-w-[80px]">
                    ₹{item.quantity * item.price}
                  </div>

                  <button
                    onClick={() => removeItem(item.productID?._id || item.productID)}
                    className="btn btn-ghost btn-circle text-error hover:bg-error/10"
                    title="Remove Item"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          <div className="flex justify-end mt-6">
            <button onClick={clearCart} className="btn btn-outline btn-error btn-sm gap-2">
              <Trash2 className="w-4 h-4" />
              Clear Cart
            </button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="h-fit sticky top-24">
          <div className="bg-base-100 rounded-2xl p-6 shadow-xl border border-base-200">
            <h2 className="text-xl font-bold mb-6">Order Summary</h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-base-content/70">
                <span>Subtotal</span>
                <span className="font-semibold text-base-content">₹{cart.totalPrice}</span>
              </div>
              <div className="flex justify-between text-base-content/70">
                <span>Shipping</span>
                <span className="text-success font-medium">Free</span>
              </div>
            </div>

            <div className="divider my-2"></div>

            <div className="flex justify-between items-end mb-6">
              <span className="font-bold text-lg">Total</span>
              <span className="font-extrabold text-3xl text-primary">₹{cart.totalPrice}</span>
            </div>

            <button onClick={() => navigate('/user/checkout')} className="btn btn-primary w-full btn-lg shadow-lg hover:scale-[1.02] transition-transform">
              Proceed to Checkout
            </button>

            <div className="mt-8">
              <p className="text-xs text-center text-base-content/50 mb-3">Secure Payment Methods</p>
              <div className="flex justify-center gap-4 opacity-70 grayscale hover:grayscale-0 transition-all">
                {/* Using text content for now as images might be missing or generic icons preference */}
                <span className="badge badge-outline">Visa</span>
                <span className="badge badge-outline">Mastercard</span>
                <span className="badge badge-outline">PayPal</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
