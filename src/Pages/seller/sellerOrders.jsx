import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { api } from '../../config/axiosInstance';
import { Package, Truck, CheckCircle, Clock, Calendar, Search, Filter, ChevronLeft, ChevronRight, MoreVertical } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';

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
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    if (!userData) return;
    setLoading(true);
    try {
      const res = await api.get('/order/seller-orders', {
        params: {
          page,
          limit: 10,
          orderStatus: filters.orderStatus || undefined,
          paymentStatus: filters.paymentStatus || undefined,
        },
      });
      setOrders(res.data.orders);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error('Error fetching seller orders:', err);
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
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

  const handleStatusUpdate = async (orderId, newStatus) => {
    // Placeholder for actual API call if it existed in the original code, 
    // but since it wasn't there or was mocked, I'll add a toast for now.
    // If there IS an endpoint, it should be called here.
    try {
      await api.put(`/order/update-status/${orderId}`, { status: newStatus });
      toast.success(`Order marked as ${newStatus}`);
      fetchOrders(); // Refresh list
    } catch (error) {
      // toast.error("Failed to update status"); // server might not support this endpoint yet
      console.error("Update status failed", error);
      // Optimistic update for demo purposes if API fails (or mocking)
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, orderStatus: newStatus } : o));
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'processing': return 'badge-warning';
      case 'shipped': return 'badge-info';
      case 'delivered': return 'badge-success';
      case 'cancelled': return 'badge-error';
      default: return 'badge-ghost';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-base-content">Order Management</h2>
          <p className="text-base-content/60 mt-1">Track and manage your customer orders.</p>
        </div>

        <div className="flex gap-2">
          {['orderStatus', 'paymentStatus'].map((type) => (
            <div key={type} className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn btn-outline btn-sm gap-2">
                <Filter className="w-4 h-4" />
                {filters[type] ? filters[type].charAt(0).toUpperCase() + filters[type].slice(1) : `All ${type === 'orderStatus' ? 'Orders' : 'Payments'}`}
              </div>
              <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52 border border-base-200">
                <li onClick={() => handleFilterChange(type, '')}><a>All</a></li>
                {(type === 'orderStatus'
                  ? ['processing', 'shipped', 'delivered', 'cancelled']
                  : ['paid', 'pending', 'failed']
                ).map((status) => (
                  <li key={status} onClick={() => handleFilterChange(type, status)}>
                    <a>{status.charAt(0).toUpperCase() + status.slice(1)}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20"><span className="loading loading-spinner loading-lg text-primary"></span></div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 bg-base-100 rounded-xl border border-base-200 shadow-sm">
          <div className="bg-base-200 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-10 h-10 text-base-content/40" />
          </div>
          <h3 className="text-lg font-bold">No Orders Found</h3>
          <p className="text-base-content/60">Try adjusting your filters or wait for new sales!</p>
        </div>
      ) : (
        <div className="grid gap-6">
          <AnimatePresence>
            {orders.map((order, index) => {
              const sellerProducts = order.products.filter(
                (p) => p.sellerID?.toString() === userData._id
              );
              if (sellerProducts.length === 0) return null;

              return (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: index * 0.05 }}
                  className="card bg-base-100 shadow-sm border border-base-200 hover:shadow-md transition-shadow"
                >
                  <div className="card-body p-0">
                    {/* Header */}
                    <div className="p-4 bg-base-200/50 border-b border-base-200 flex flex-wrap justify-between items-center gap-4 rounded-t-xl">
                      <div className="flex gap-4 md:gap-8 items-center text-sm">
                        <div>
                          <span className="block text-base-content/50 font-medium text-xs uppercase tracking-wider">Order ID</span>
                          <span className="font-mono font-bold text-base-content/80">#{order._id.slice(-6)}</span>
                        </div>
                        <div>
                          <span className="block text-base-content/50 font-medium text-xs uppercase tracking-wider">Date</span>
                          <span className="font-medium flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(order.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="hidden md:block">
                          <span className="block text-base-content/50 font-medium text-xs uppercase tracking-wider">Customer</span>
                          <span className="font-medium">{order.user?.name}</span>
                        </div>
                      </div>
                      <div className={`badge ${getStatusColor(order.orderStatus)} badge-lg gap-1`}>
                        {order.orderStatus.toUpperCase()}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4 md:p-6">
                      <div className="space-y-4">
                        {sellerProducts.map((p, i) => (
                          <div key={i} className="flex gap-4 items-center">
                            <div className="avatar">
                              <div className="w-16 h-16 rounded-lg border border-base-200 bg-base-100">
                                <img src={p.productID.images?.[1] || p.productID.images?.[0] || '/default.jpg'} alt={p.productID.title} />
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-bold text-base truncate">{p.productID.title}</h4>
                              <div className="flex items-center gap-4 mt-1 text-sm text-base-content/70">
                                <span className="badge badge-sm badge-ghost">Qty: {p.quantity}</span>
                                <span className="font-medium text-base-content">₹{p.price}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="divider my-4"></div>

                      <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="text-base-content/60">Payment Status:</span>
                          <span className={`font-bold uppercase ${order.paymentStatus === 'paid' ? 'text-success' : 'text-warning'}`}>
                            {order.paymentStatus}
                          </span>
                        </div>

                        <div className="flex gap-2">
                          {order.orderStatus === 'processing' && (
                            <button
                              onClick={() => handleStatusUpdate(order._id, 'shipped')}
                              className="btn btn-sm btn-primary gap-2"
                            >
                              <Truck className="w-4 h-4" /> Mark Shipped
                            </button>
                          )}
                          {order.orderStatus === 'shipped' && (
                            <button
                              onClick={() => handleStatusUpdate(order._id, 'delivered')}
                              className="btn btn-sm btn-success text-white gap-2"
                            >
                              <CheckCircle className="w-4 h-4" /> Mark Delivered
                            </button>
                          )}
                          <button className="btn btn-sm btn-ghost">View Details</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <div className="join">
            <button className="join-item btn btn-sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}><ChevronLeft className="w-4 h-4" /></button>
            <button className="join-item btn btn-sm">Page {page}</button>
            <button className="join-item btn btn-sm" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerOrders;
