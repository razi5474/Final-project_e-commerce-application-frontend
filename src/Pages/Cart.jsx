import React, { useEffect, useState } from 'react';
import { api } from '../config/axiosInstance';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { FiMinus, FiPlus, FiX } from 'react-icons/fi';
import BackButton from '../components/common/BackButton';

const Cart = () => {
  const [cart, setCart] = useState(null);
  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      const res = await api.get('/cart');
      setCart(res.data.data);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to fetch cart');
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

  if (!cart || cart.Products.length === 0) {
    return <div className="text-center py-10"><h2 className="text-2xl font-semibold text-base-content">Your cart is empty</h2></div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <BackButton />
      <h1 className="text-3xl font-bold mb-6 text-center text-base-content">Your Cart</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {cart.Products.map((item) => (
            <div key={item._id} className="flex items-center justify-between bg-base-100 p-4 rounded-xl shadow-sm flex-wrap gap-4">
             <div
                onClick={() => navigate(`/product/productDeatails/${item.productID?._id || item.productID}`)}
                className="flex gap-4 items-center w-full md:w-auto cursor-pointer"
              >
                <img
                  src={item.productID?.images?.[1] || '/default-product.jpg'}
                  alt={item.productID?.title}
                  className="w-16 h-16 object-contain rounded-md"
                />
                <div>
                  <h3 className="font-semibold hover:underline">{item.productID?.title}</h3>
                  <p className="text-sm text-gray-500">₹{item.price}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button onClick={() => updateQuantity(item.productID?._id || item.productID, item.quantity - 1)} className="btn btn-xs btn-outline"><FiMinus /></button>
                <span className="px-2">{item.quantity}</span>
                <button onClick={() => updateQuantity(item.productID?._id || item.productID, item.quantity + 1)} className="btn btn-xs btn-outline"><FiPlus /></button>
              </div>

              <div className="text-right font-semibold text-base-content">
                ₹{item.quantity * item.price}
              </div>

              <button onClick={() => removeItem(item.productID?._id || item.productID)} className="btn btn-sm btn-circle text-red-500"><FiX /></button>
            </div>
          ))}

          <div className="flex justify-end mt-4">
            <button onClick={clearCart} className="btn btn-outline btn-error">Clear Cart</button>
          </div>
        </div>

        <div className="bg-base-100 rounded-xl p-6 shadow-lg sticky top-6">
          <h2 className="text-lg font-bold mb-4">Order Summary</h2>
          <div className="flex justify-between py-2"><span>Subtotal</span><span className="font-semibold">₹{cart.totalPrice}</span></div>
          <div className="flex justify-between py-2"><span>Delivery</span><span className="text-green-600">Free</span></div>
          <hr className="my-3" />
          <div className="flex justify-between font-bold text-lg"><span>Total</span><span>₹{cart.totalPrice}</span></div>
          <button onClick={() => navigate('/checkout')} className="btn btn-primary w-full mt-6 text-white">Proceed to Checkout</button>
          <div className="mt-6 text-center text-sm text-gray-500">
            We accept:
            <div className="flex justify-center gap-3 mt-2">
              <img src="/payment/paypal.svg" alt="PayPal" className="h-5" />
              <img src="/payment/stripe.svg" alt="Stripe" className="h-5" />
              <img src="/payment/applepay.svg" alt="Apple Pay" className="h-5" />
              <img src="/payment/gpay.svg" alt="GPay" className="h-5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
