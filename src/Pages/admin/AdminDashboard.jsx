import React from 'react';
import {
  FaUsers,
  FaStore,
  FaBoxOpen,
  FaShoppingCart,
  FaChartBar,
  FaStar,
} from 'react-icons/fa';

const AdminDashboard = () => {
  const stats = [
    {
      title: 'Total Users',
      icon: <FaUsers />,
      value: 1200,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      title: 'Total Sellers',
      icon: <FaStore />,
      value: 230,
      color: 'bg-orange-100 text-orange-600',
    },
    {
      title: 'Total Products',
      icon: <FaBoxOpen />,
      value: 870,
      color: 'bg-green-100 text-green-600',
    },
    {
      title: 'Total Orders',
      icon: <FaShoppingCart />,
      value: 3400,
      color: 'bg-purple-100 text-purple-600',
    },
    {
      title: 'Total Reviews',
      icon: <FaStar />,
      value: 1450,
      color: 'bg-yellow-100 text-yellow-600',
    },
  ];

  return (
    <div className="p-6 space-y-6 text-base-content">
      <h1 className="text-2xl font-semibold mb-4">Admin Dashboard</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="bg-base-100 rounded-2xl p-4 shadow hover:shadow-md transition-all flex items-center gap-4"
          >
            <div className={`p-3 rounded-full text-xl ${stat.color}`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-sm text-base-content/60">{stat.title}</p>
              <h2 className="text-xl font-bold">{stat.value}</h2>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders Section */}
      <div className="bg-base-100 rounded-2xl shadow p-6 mt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Recent Orders</h2>
          <button className="btn btn-sm btn-outline">View All</button>
        </div>
        <ul className="space-y-3 text-sm">
          <li className="flex justify-between border-b pb-2">
            <span>Order #3425</span>
            <span className="text-success">Completed</span>
          </li>
          <li className="flex justify-between border-b pb-2">
            <span>Order #3424</span>
            <span className="text-warning">Pending</span>
          </li>
          <li className="flex justify-between">
            <span>Order #3423</span>
            <span className="text-error">Cancelled</span>
          </li>
        </ul>
      </div>

      {/* Top Sellers */}
      <div className="bg-base-100 rounded-2xl shadow p-6 mt-6">
        <h2 className="text-lg font-semibold mb-4">Top Sellers</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {['FashionKart', 'ElectroZone', 'BookBazaar'].map((name, idx) => (
            <div
              key={idx}
              className="p-4 bg-base-200 rounded-xl flex justify-between items-center"
            >
              <div>
                <h4 className="font-semibold">{name}</h4>
                <p className="text-xs text-base-content/60">Total Orders: {100 + idx * 20}</p>
              </div>
              <span className="badge badge-success badge-lg">⭐ {4.5 - idx * 0.2}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Top Products */}
      <div className="bg-base-100 rounded-2xl shadow p-6 mt-6">
        <h2 className="text-lg font-semibold mb-4">Top Products</h2>
        <div className="overflow-x-auto">
          <table className="table w-full border border-base-200">
            <thead>
              <tr className="bg-base-200 text-base-content">
                <th>Product</th>
                <th>Category</th>
                <th>Sold</th>
                <th>Rating</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'Smartphone X', category: 'Electronics', sold: 120, rating: 4.6 },
                { name: 'Wireless Headphones', category: 'Accessories', sold: 98, rating: 4.4 },
                { name: 'Yoga Mat', category: 'Fitness', sold: 80, rating: 4.7 },
              ].map((prod, idx) => (
                <tr key={idx}>
                  <td>{prod.name}</td>
                  <td>{prod.category}</td>
                  <td>{prod.sold}</td>
                  <td>{prod.rating}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
