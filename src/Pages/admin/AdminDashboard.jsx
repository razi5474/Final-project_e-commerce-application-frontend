import React from 'react';
import { Users, Store, Package, ShoppingBag, Star, TrendingUp, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminDashboard = () => {
  // Mock data for visual structure - ideally this would come from an API
  const stats = [
    { title: 'Total Users', icon: <Users className="w-6 h-6" />, value: 1200, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { title: 'Total Sellers', icon: <Store className="w-6 h-6" />, value: 230, color: 'text-orange-500', bg: 'bg-orange-500/10' },
    { title: 'Total Products', icon: <Package className="w-6 h-6" />, value: 870, color: 'text-green-500', bg: 'bg-green-500/10' },
    { title: 'Total Orders', icon: <ShoppingBag className="w-6 h-6" />, value: 3400, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { title: 'Total Reviews', icon: <Star className="w-6 h-6" />, value: 1450, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-base-content">Admin Dashboard</h1>
          <p className="text-base-content/60 mt-1">System overview and management.</p>
        </div>
        <button className="btn btn-primary gap-2">
          <Activity className="w-4 h-4" /> System Health
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {stats.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="card bg-base-100 shadow-xl border border-base-200"
          >
            <div className="card-body p-6 flex flex-row items-center justify-between">
              <div>
                <p className="text-sm font-medium text-base-content/60">{stat.title}</p>
                <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
              </div>
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                {stat.icon}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Recent Orders Section */}
        <div className="card bg-base-100 shadow-xl border border-base-200">
          <div className="card-body p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-primary" />
                Recent Orders
              </h2>
              <button className="btn btn-sm btn-ghost text-primary">View All</button>
            </div>
            <div className="overflow-x-auto">
              <table className="table">
                <tbody>
                  {[
                    { id: '#3425', status: 'Completed', class: 'badge-success' },
                    { id: '#3424', status: 'Pending', class: 'badge-warning' },
                    { id: '#3423', status: 'Cancelled', class: 'badge-error' },
                    { id: '#3422', status: 'Completed', class: 'badge-success' },
                  ].map((order, i) => (
                    <tr key={i} className="hover">
                      <td className="font-mono font-medium">{order.id}</td>
                      <td>
                        <div className={`badge ${order.class} text-white badge-sm`}>{order.status}</div>
                      </td>
                      <td className="text-right text-base-content/60 text-sm">2 mins ago</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Top Sellers */}
        <div className="card bg-base-100 shadow-xl border border-base-200">
          <div className="card-body p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-success" />
                Top Sellers
              </h2>
              <button className="btn btn-sm btn-ghost text-primary">View All</button>
            </div>
            <div className="space-y-4">
              {['FashionKart', 'ElectroZone', 'BookBazaar', 'HomeStyle'].map((name, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-base-200/50 rounded-xl hover:bg-base-200 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="avatar placeholder">
                      <div className="bg-neutral text-neutral-content rounded-full w-10">
                        <span className="text-xs">{name.substring(0, 2).toUpperCase()}</span>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">{name}</h4>
                      <p className="text-xs text-base-content/60">1{100 - idx * 25} Sales</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-warning font-bold text-sm">
                    <Star className="w-4 h-4 fill-current" />
                    {4.8 - idx * 0.2}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
