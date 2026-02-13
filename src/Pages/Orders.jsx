import React, { useEffect, useState } from 'react';
import { api } from '../config/axiosInstance';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { Package, Truck, CheckCircle, Clock, Calendar, CreditCard, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

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

  const paginatedOrders = orders.slice(
    (currentPage - 1) * ordersPerPage,
    currentPage * ordersPerPage
  );

  const totalPages = Math.ceil(orders.length / ordersPerPage);

  const getStatusColor = (status) => {
    switch (status) {
      case 'processing': return 'badge-warning';
      case 'shipped': return 'badge-info';
      case 'delivered': return 'badge-success';
      case 'cancelled': return 'badge-error';
      default: return 'badge-ghost';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'processing': return <Clock className="w-3 h-3" />;
      case 'shipped': return <Truck className="w-3 h-3" />;
      case 'delivered': return <CheckCircle className="w-3 h-3" />;
      default: return <Package className="w-3 h-3" />;
    }
  };

  if (!orders.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <div className="w-20 h-20 bg-base-200 rounded-full flex items-center justify-center">
          <Package className="w-10 h-10 text-base-content/30" />
        </div>
        <h2 className="text-2xl font-bold text-base-content">No orders found</h2>
        <p className="text-base-content/60">You haven't placed any orders yet.</p>
        <Link to="/products" className="btn btn-primary mt-2">Start Shopping</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-3xl font-bold mb-8 text-base-content">My Orders</h1>

      <div className="space-y-6">
        {paginatedOrders.map((order, index) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            key={order._id || index}
            className="card bg-base-100 shadow-md border border-base-200 overflow-hidden"
          >
            <div className="bg-base-200/50 p-4 flex flex-wrap gap-4 justify-between items-center text-sm">
              <div className="flex gap-6">
                <div>
                  <span className="block text-base-content/60 mb-1 font-medium">Order Placed</span>
                  <span className="flex items-center gap-1 font-medium">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div>
                  <span className="block text-base-content/60 mb-1 font-medium">Total Amount</span>
                  <span className="font-bold">₹{order.totalPrice}</span>
                </div>
                <div className="hidden sm:block">
                  <span className="block text-base-content/60 mb-1 font-medium">Ship To</span>
                  <span className="font-medium text-primary cursor-help" title={`${order.shippingAddress?.address}, ${order.shippingAddress?.city}`}>{order.shippingAddress?.fullName}</span>
                </div>
              </div>
              <div className="flex gap-3">
                <span className={`badge ${getStatusColor(order.orderStatus)} gap-1`}>
                  {getStatusIcon(order.orderStatus)}
                  {order.orderStatus.toUpperCase()}
                </span>
              </div>
            </div>

            <div className="p-4 sm:p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1 space-y-4">
                  {order.products.map((item, i) => (
                    <div key={i} className="flex gap-4">
                      <Link to={`/product/productDeatails/${item.productID?._id}`}>
                        <div className="w-20 h-20 bg-base-200 rounded-md overflow-hidden flex-shrink-0 border border-base-200">
                          <img
                            src={item.productID?.images?.[1] || item.productID?.images?.[0] || '/default-product.jpg'}
                            alt={item.productID?.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </Link>
                      <div>
                        <Link to={`/product/productDeatails/${item.productID?._id}`} className="font-bold hover:text-primary transition-colors line-clamp-1">
                          {item.productID?.title || 'Product Unavailable'}
                        </Link>
                        <p className="text-sm text-base-content/60">Quantity: {item.quantity}</p>
                        <p className="text-sm font-medium mt-1">₹{item.price}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="md:w-1/3 flex flex-col gap-2 border-t md:border-t-0 md:border-l border-base-200 pt-4 md:pt-0 md:pl-6">
                  <h4 className="font-bold text-sm mb-2">Payment Info</h4>
                  <div className="flex items-center gap-2 text-sm">
                    <CreditCard className="w-4 h-4 text-base-content/60" />
                    <span>Status:</span>
                    <span className={order.paymentStatus === 'paid' ? 'text-success font-medium' : 'text-warning font-medium'}>
                      {order.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                    </span>
                  </div>

                  <div className="divider my-2"></div>
                  <button className="btn btn-outline btn-sm w-full">View Invoice</button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-10">
          <button
            className="btn btn-sm btn-square"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm font-medium px-4">
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="btn btn-sm btn-square"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default Orders;
