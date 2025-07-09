import React, { useEffect, useState } from 'react';
import { api } from '../config/axiosInstance';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get('/order/my-orders');
        setOrders(res.data.orders);
      } catch (err) {
        toast.error('Failed to fetch orders');
      }
    };
    fetchOrders();
  }, []);

  const boxIcon =
    'https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/e-commerce/boxIcon.svg';

  const paginatedOrders = orders.slice(
    (currentPage - 1) * ordersPerPage,
    currentPage * ordersPerPage
  );

  const totalPages = Math.ceil(orders.length / ordersPerPage);

  if (!orders.length) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-semibold mb-2 text-base-content">My Orders</h2>
        <p className="text-gray-500">No orders yet.</p>
      </div>
    );
  }

  return (
    <div className="md:p-10 p-4 space-y-6">
      <h2 className="text-2xl font-bold text-base-content">Orders List</h2>

      {paginatedOrders.map((order, index) => (
        <div
          key={order._id || index}
          className="flex flex-col md:grid md:grid-cols-[2fr_1.5fr_1fr_1.5fr] md:items-center gap-5 p-5 max-w-5xl rounded-md border border-base-300 bg-base-100 text-base-content"
        >
          {/* Products */}
          <div className="flex gap-5 items-center">
            <Link to={`/product/productDeatails/${order.products?.[0]?.productID?._id}`}>
              <img
                className="w-20 h-12 object-contain opacity-100 bg-white"
                src={
                  order.products?.[0]?.productID?.images?.[1] ||
                  order.products?.[0]?.productID?.images?.[0] ||
                  boxIcon
                }
                alt="product"
              />
            </Link>
            <div>
              {order.products.map((item, i) => (
                <div key={i} className="flex flex-col justify-center">
                  <Link
                    to={`/product/productDeatails/${item.productID?._id}`}
                    className="font-medium hover:underline"
                  >
                    {item.productID?.title || 'Deleted Product'}
                    {item.quantity > 1 && (
                      <span className="text-indigo-500 ml-1">x {item.quantity}</span>
                    )}
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Address */}
          <div className="text-sm leading-snug">
            <p className="font-medium">{order.shippingAddress?.fullName}</p>
            <p>
              {order.shippingAddress?.address}, {order.shippingAddress?.city},{' '}
              {order.shippingAddress?.state} - {order.shippingAddress?.postalCode},{' '}
              {order.shippingAddress?.country}
            </p>
            <p>Phone: {order.shippingAddress?.phone}</p>
          </div>

          {/* Price */}
          <p className="font-medium text-base text-black/70">₹{order.totalPrice}</p>

          {/* Order Info */}
          <div className="text-sm space-y-1">
            <p>
              <span className="font-medium">Date:</span>{' '}
              {new Date(order.createdAt).toLocaleDateString()}
            </p>
            <p>
              <span className="font-medium">Payment:</span>{' '}
              {order.paymentStatus === 'paid' ? (
                <span className="text-green-600">Paid</span>
              ) : (
                <span className="text-yellow-600">Pending</span>
              )}
            </p>
            <p>
              <span className="font-medium">Status:</span>{' '}
              <span
                className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  order.orderStatus === 'processing'
                    ? 'bg-yellow-100 text-yellow-700'
                    : order.orderStatus === 'shipped'
                    ? 'bg-blue-100 text-blue-700'
                    : order.orderStatus === 'delivered'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {order.orderStatus.toUpperCase()}
              </span>
            </p>
          </div>
        </div>
      ))}

      {/* Pagination Controls */}
      <div className="flex justify-center items-center gap-2 mt-6">
        <button
          className="btn btn-sm"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Prev
        </button>
        <span className="text-sm font-medium">
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="btn btn-sm"
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Orders;
