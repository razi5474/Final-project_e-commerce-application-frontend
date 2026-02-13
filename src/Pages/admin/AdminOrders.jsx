import React, { useEffect, useState } from 'react';
import { api } from '../../config/axiosInstance';
import toast from 'react-hot-toast';
import { Trash2, Package, Calendar, User, Mail, DollarSign, CheckCircle, Clock, Truck, XCircle, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const fetchAdminOrders = async () => {
    try {
      const res = await api.get('/order/admin-orders');
      setOrders(res.data.orders);
      setFilteredOrders(res.data.orders);
    } catch (err) {
      toast.error('❌ Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminOrders();
  }, []);

  useEffect(() => {
    const results = orders.filter(order =>
      order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order._id.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredOrders(results);
  }, [searchTerm, orders]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.patch(`/order/admin-update-status/${orderId}`, { status: newStatus });
      toast.success('✅ Status updated');
      // Optimistic update
      setOrders(orders.map(o => o._id === orderId ? { ...o, orderStatus: newStatus } : o));
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
      setOrders(orders.filter(o => o._id !== selectedOrderId));
      setShowModal(false);
    } catch (err) {
      toast.error('❌ Failed to delete order');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'processing': return <div className="badge badge-warning gap-1 text-white"><Clock className="w-3 h-3" /> Processing</div>;
      case 'shipped': return <div className="badge badge-info gap-1 text-white"><Truck className="w-3 h-3" /> Shipped</div>;
      case 'delivered': return <div className="badge badge-success gap-1 text-white"><CheckCircle className="w-3 h-3" /> Delivered</div>;
      case 'cancelled': return <div className="badge badge-error gap-1 text-white"><XCircle className="w-3 h-3" /> Cancelled</div>;
      default: return <div className="badge badge-ghost">{status}</div>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-base-content">All Orders</h2>
          <p className="text-base-content/60 mt-1">Manage and track customer orders.</p>
        </div>
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search orders..."
            className="input input-bordered w-full pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/40" />
        </div>
      </div>

      <div className="card bg-base-100 shadow-xl border border-base-200">
        <div className="card-body p-0">
          {/* Desktop Table */}
          <div className="overflow-x-auto">
            <table className="table">
              <thead className="bg-base-200/50">
                <tr>
                  <th>Order ID & User</th>
                  <th>Products</th>
                  <th>Total & Payment</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th className="text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filteredOrders.map((order, index) => (
                    <motion.tr
                      key={order._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover"
                    >
                      <td>
                        <div className="flex flex-col">
                          <span className="text-xs font-mono opacity-50">#{order._id.slice(-6)}</span>
                          <span className="font-bold flex items-center gap-1"><User className="w-3 h-3" /> {order.user?.name || 'N/A'}</span>
                          <span className="text-xs flex items-center gap-1 opacity-70"><Mail className="w-3 h-3" /> {order.user?.email || 'N/A'}</span>
                        </div>
                      </td>
                      <td>
                        <div className="max-h-20 overflow-y-auto scrollbar-thin scrollbar-thumb-base-300">
                          {order.products.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-2 mb-1">
                              <div className="avatar">
                                <div className="w-8 h-8 rounded bg-base-200">
                                  <img src={item.productID?.images?.[0]} alt="prod" className="object-cover" />
                                </div>
                              </div>
                              <div className="text-xs">
                                <div className="font-medium">{item.productID?.title || 'Unknown'}</div>
                                <div className="opacity-60">Qty: {item.quantity}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td>
                        <div className="font-bold flex items-center gap-1">₹{order.totalPrice}</div>
                        <div className="badge badge-ghost badge-sm capitalize mt-1">{order.paymentStatus}</div>
                      </td>
                      <td>
                        <div className="flex flex-col gap-2">
                          {getStatusBadge(order.orderStatus)}
                          <select
                            value={order.orderStatus}
                            onChange={(e) => handleStatusChange(order._id, e.target.value)}
                            className="select select-bordered select-xs w-full max-w-[120px]"
                          >
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </div>
                      </td>
                      <td className="text-sm">
                        <div className="flex items-center gap-1 text-base-content/70">
                          <Calendar className="w-3 h-3" />
                          {new Date(order.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="text-center">
                        <button
                          onClick={() => confirmDelete(order._id)}
                          className="btn btn-square btn-sm btn-ghost text-error hover:bg-error/10"
                          title="Delete Order"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
            {loading && <div className="text-center py-10"><span className="loading loading-spinner text-primary"></span></div>}
            {!loading && filteredOrders.length === 0 && <div className="text-center py-10 text-base-content/60">No orders found.</div>}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showModal && (
        <dialog id="delete_modal" className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg text-error">Confirm Delete</h3>
            <p className="py-4">Are you sure you want to delete this order? This action cannot be undone.</p>
            <div className="modal-action">
              <button className="btn" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-error text-white" onClick={deleteOrder}>Delete</button>
            </div>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button onClick={() => setShowModal(false)}>close</button>
          </form>
        </dialog>
      )}
    </div>
  );
};

export default AdminOrders;
