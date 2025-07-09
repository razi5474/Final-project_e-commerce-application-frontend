import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { api } from '../../config/axiosInstance';

const SellerOrders = () => {
  const { userData } = useSelector((state) => state.user);
  const [orders, setOrders] = useState([]);
  const [filters, setFilters] = useState({
    orderStatus: '',
    paymentStatus: '',
  });
  const [isDropdownOpen, setIsDropdownOpen] = useState({
    orderStatus: false,
    paymentStatus: false,
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchOrders = async () => {
    if (!userData) return;

    try {
      const res = await api.get('/order/seller-orders', {
        params: {
          page,
          limit: 5,
          orderStatus: filters.orderStatus || undefined,
          paymentStatus: filters.paymentStatus || undefined,
        },
      });
      setOrders(res.data.orders);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error('Error fetching seller orders:', err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [userData, filters, page]);

  const handleFilterChange = (type, value) => {
    setFilters((prev) => ({ ...prev, [type]: value }));
    setPage(1);
    setIsDropdownOpen((prev) => ({ ...prev, [type]: false }));
  };

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h2 className="text-xl font-bold mb-4 text-base-content">📦 My Product Orders</h2>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        {['orderStatus', 'paymentStatus'].map((type) => (
          <div key={type} className="relative w-48 text-sm z-40">
            <button
              onClick={() =>
                setIsDropdownOpen((prev) => ({ ...prev, [type]: !prev[type] }))
              }
              className="w-full px-4 py-2 border border-base-300 rounded-md shadow-sm bg-base-100 text-base-content hover:bg-base-200 transition"
            >
              {filters[type] ? filters[type] : `All ${type === 'orderStatus' ? 'Order' : 'Payment'} Status`}
              <svg
                className="w-4 h-4 float-right mt-1"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {isDropdownOpen[type] && (
              <ul className="absolute mt-1 w-full bg-base-100 border border-base-300 rounded shadow-md py-1 z-50">
                <li
                  onClick={() => handleFilterChange(type, '')}
                  className="px-4 py-2 cursor-pointer hover:bg-primary hover:text-white transition"
                >
                  All {type === 'orderStatus' ? 'Order' : 'Payment'} Status
                </li>
                {(type === 'orderStatus'
                  ? ['processing', 'shipped', 'delivered']
                  : ['paid', 'pending', 'failed']
                ).map((status) => (
                  <li
                    key={status}
                    onClick={() => handleFilterChange(type, status)}
                    className="px-4 py-2 cursor-pointer hover:bg-primary hover:text-white transition"
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>

      {/* Orders */}
      {orders.length === 0 ? (
        <p className="text-base-content/70">No orders found.</p>
      ) : (
        orders.map((order) => {
          const sellerProducts = order.products.filter(
            (p) => p.sellerID?.toString() === userData._id
          );
          if (sellerProducts.length === 0) return null;

          return (
            <div key={order._id} className="border border-base-300 rounded-lg p-4 mb-6 bg-base-100 text-base-content shadow-sm">
              <div className="text-sm mb-2">
                <p><span className="font-semibold">Order ID:</span> {order._id}</p>
                <p><span className="font-semibold">Buyer:</span> {order.user?.name}</p>
                <p>
                  <span className="font-semibold">Payment Status:</span>{' '}
                  <span
                    className={`font-semibold ${
                      order.paymentStatus === 'paid'
                        ? 'text-green-600'
                        : order.paymentStatus === 'pending'
                        ? 'text-yellow-500'
                        : 'text-red-600'
                    }`}
                  >
                    {order.paymentStatus}
                  </span>
                </p>
                <p><span className="font-semibold">Order Status:</span> {order.orderStatus}</p>
                <p><span className="font-semibold">Order Date:</span> {new Date(order.createdAt).toLocaleDateString()}</p>
              </div>

              {sellerProducts.map((p) => (
                <div
                  key={p.productID._id}
                  className="flex flex-col sm:flex-row items-center gap-4 border-t pt-3 mt-3"
                >
                  <img
                    src={p.productID.images?.[0]}
                    alt={p.productID.title}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="text-sm">
                    <h4 className="font-medium">{p.productID.title}</h4>
                    <p>Quantity: {p.quantity}</p>
                    <p>Price: ₹{p.price}</p>
                  </div>
                </div>
              ))}

              {/* Status Update Buttons */}
              {order.orderStatus === 'processing' && (
                <button
                  onClick={() => handleStatusUpdate(order._id, 'shipped')}
                  className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm"
                >
                  Mark as Shipped
                </button>
              )}

              {order.orderStatus === 'shipped' && (
                <button
                  onClick={() => handleStatusUpdate(order._id, 'delivered')}
                  className="mt-4 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-sm"
                >
                  Mark as Delivered
                </button>
              )}
            </div>
          );
        })
      )}

      {/* Pagination */}
      <div className="flex justify-center items-center mt-6 gap-4">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="px-3 py-1 bg-base-300 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-sm text-base-content">Page {page} of {totalPages}</span>
        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
          className="px-3 py-1 bg-base-300 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default SellerOrders;
