import React, { useEffect, useState } from 'react';
import { api } from '../../config/axiosInstance';
import toast from 'react-hot-toast';
import { FaTrash } from 'react-icons/fa';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const fetchAdminOrders = async () => {
    try {
      const res = await api.get('/order/admin-orders');
      setOrders(res.data.orders);
    } catch (err) {
      toast.error('❌ Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.patch(`/order/admin-update-status/${orderId}`, { status: newStatus });
      toast.success('✅ Status updated');
      fetchAdminOrders();
    } catch (err) {
      toast.error('❌ Failed to update status');
    }
  };

  const confirmDelete = (orderId) => {
    setSelectedOrderId(orderId);
    setShowModal(true);
  };

  const deleteOrder = async () => {
    try {
      await api.delete(`/order/admin-delete/${selectedOrderId}`);
      toast.success('🗑️ Order deleted');
      setShowModal(false);
      fetchAdminOrders();
    } catch (err) {
      toast.error('❌ Failed to delete order');
    }
  };

  useEffect(() => {
    fetchAdminOrders();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">All Orders</h2>

      {loading ? (
        <p>Loading orders...</p>
      ) : orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="overflow-x-auto hidden md:block">
          <table className="table w-full border border-base-200 text-sm md:text-base">
            <thead>
              <tr className="bg-base-200 text-base-content">
                <th>User</th>
                <th>Email</th>
                <th>Products</th>
                <th>Total</th>
                <th>Status</th>
                <th>Payment</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="align-top">
                  <td className="font-semibold text-base md:text-lg">
                    {order.user?.name || 'N/A'}
                  </td>
                  <td>{order.user?.email || 'N/A'}</td>
                  <td>
                    <ul className="list-disc pl-4 text-xs md:text-sm max-w-[150px] break-words">
                      {order.products.map((item, idx) => (
                        <li key={idx}>
                          {item.productID?.title || 'Unknown'} × {item.quantity}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td>₹{order.totalPrice}</td>
                  <td>
                    <select
                      value={order.orderStatus}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      className="select select-sm select-bordered"
                    >
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="capitalize">{order.paymentStatus}</td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button
                      onClick={() => confirmDelete(order._id)}
                      className="btn btn-sm btn-error text-white"
                    >
                      <FaTrash className="text-xs" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Mobile View */}
      <div className="md:hidden flex flex-col gap-4">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-base-100 p-4 rounded-lg shadow border border-base-200"
          >
            <div className="font-bold text-lg mb-1">{order.user?.name || 'N/A'}</div>
            <p className="text-sm mb-1">{order.user?.email || 'N/A'}</p>
            <p className="text-xs mb-1">
              Products:
              <ul className="list-disc pl-5">
                {order.products.map((item, idx) => (
                  <li key={idx}>{item.productID?.title || 'Unknown'} × {item.quantity}</li>
                ))}
              </ul>
            </p>
            <p className="text-sm mb-1">Total: ₹{order.totalPrice}</p>
            <p className="text-sm mb-1">Status: {order.orderStatus}</p>
            <p className="text-sm mb-1">Payment: {order.paymentStatus}</p>
            <p className="text-sm mb-2">Date: {new Date(order.createdAt).toLocaleDateString()}</p>
            <div className="flex gap-2">
              <select
                value={order.orderStatus}
                onChange={(e) => handleStatusChange(order._id, e.target.value)}
                className="select select-sm select-bordered"
              >
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <button
                onClick={() => confirmDelete(order._id)}
                className="btn btn-sm btn-error text-white"
              >
                <FaTrash className="text-xs" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-bold mb-4">Confirm Delete</h3>
            <p className="mb-4">Are you sure you want to delete this order?</p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowModal(false)} className="btn btn-sm">Cancel</button>
              <button onClick={deleteOrder} className="btn btn-sm btn-error text-white">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
