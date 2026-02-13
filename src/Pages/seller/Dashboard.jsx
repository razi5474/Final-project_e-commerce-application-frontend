import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { api } from "../../config/axiosInstance";
import { Package, ShoppingBag, Star, TrendingUp, DollarSign } from "lucide-react";
import { motion } from "framer-motion";

const SellerDashboard = () => {
  const { userData } = useSelector((state) => state.user);
  const [stats, setStats] = useState({
    products: 0,
    pendingOrders: 0,
    rating: 0,
    revenue: 0 // Mock or real if available
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [productRes, orderRes, reviewRes] = await Promise.all([
          api.get("/product/seller"),
          api.get("/order/seller-orders"),
          api.get("/review/seller")
        ]);

        const products = productRes.data.length;
        const pending = orderRes.data?.orders?.filter(o => o.status === "Pending").length || 0;

        const allAvg = Object.values(reviewRes.data.avgRatings || []);
        const avgRating = allAvg.length > 0
          ? allAvg.reduce((sum, val) => sum + Number(val), 0) / allAvg.length
          : 0;

        setStats({
          products,
          pendingOrders: pending,
          rating: avgRating.toFixed(1),
          revenue: 12500 // Mock revenue for demo
        });
      } catch (err) {
        console.error("Dashboard error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const statCards = [
    { label: 'Total Products', value: stats.products, icon: <Package className="w-6 h-6" />, color: 'text-primary', bg: 'bg-primary/10' },
    { label: 'Pending Orders', value: stats.pendingOrders, icon: <ShoppingBag className="w-6 h-6" />, color: 'text-warning', bg: 'bg-warning/10' },
    { label: 'Average Rating', value: stats.rating, icon: <Star className="w-6 h-6" />, color: 'text-orange-500', bg: 'bg-orange-500/10' },
    { label: 'Total Revenue', value: `₹${stats.revenue}`, icon: <DollarSign className="w-6 h-6" />, color: 'text-success', bg: 'bg-success/10' },
  ];

  if (loading) return <div className="p-8 text-center"><span className="loading loading-spinner loading-lg text-primary"></span></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-base-content">
            Welcome back, {userData?.name || "Seller"}!
          </h1>
          <p className="text-base-content/60 mt-1">Here is what's happening with your store today.</p>
        </div>
        <button className="btn btn-primary gap-2">
          <TrendingUp className="w-4 h-4" /> View Reports
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card bg-base-100 shadow-xl border border-base-200"
          >
            <div className="card-body flex-row items-center justify-between p-6">
              <div>
                <p className="text-base-content/60 font-medium text-sm">{stat.label}</p>
                <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
              </div>
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                {stat.icon}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Placeholder for Recent Activity or Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="card bg-base-100 shadow-xl border border-base-200 p-6 min-h-[300px] flex items-center justify-center">
          <p className="text-base-content/40">Sales Chart Placeholder</p>
        </div>
        <div className="card bg-base-100 shadow-xl border border-base-200 p-6 min-h-[300px] flex items-center justify-center">
          <p className="text-base-content/40">Recent Activities Placeholder</p>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;
