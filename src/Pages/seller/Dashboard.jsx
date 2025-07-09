import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { api } from "../../config/axiosInstance";
import { FaBoxOpen, FaStar, FaClock } from "react-icons/fa";

const SellerDashboard = () => {
  const { userData } = useSelector((state) => state.user);
  const [totalProducts, setTotalProducts] = useState(0);
  const [pendingOrders, setPendingOrders] = useState(0);
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // 1. Total products
        const productRes = await api.get("/product/seller");
        setTotalProducts(productRes.data.length);

        // 2. Pending orders
        const orderRes = await api.get("/order/seller-orders");
        const pending = orderRes.data?.orders?.filter(
          (order) => order.status === "Pending"
        );
        setPendingOrders(pending.length);

        // 3. Average rating
        const reviewRes = await api.get("/review/seller");
        const allAvg = Object.values(reviewRes.data.avgRatings || []);
        const average =
          allAvg.length > 0
            ? allAvg.reduce((sum, val) => sum + Number(val), 0) / allAvg.length
            : 0;
        setAverageRating(average.toFixed(1));
      } catch (err) {
        console.error("Dashboard error:", err);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-3xl font-bold mb-6 text-base-content">
        Welcome, {userData?.name || "Seller"} 👋
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-base-200 p-6 rounded-xl shadow flex items-center gap-4">
          <FaBoxOpen className="text-4xl text-primary" />
          <div>
            <p className="text-xl font-bold">{totalProducts}</p>
            <p className="text-sm text-base-content opacity-80">
              Total Products
            </p>
          </div>
        </div>

        <div className="bg-base-200 p-6 rounded-xl shadow flex items-center gap-4">
          <FaClock className="text-4xl text-warning" />
          <div>
            <p className="text-xl font-bold">{pendingOrders}</p>
            <p className="text-sm text-base-content opacity-80">
              Pending Orders
            </p>
          </div>
        </div>

        <div className="bg-base-200 p-6 rounded-xl shadow flex items-center gap-4">
          <FaStar className="text-4xl text-yellow-500" />
          <div>
            <p className="text-xl font-bold">{averageRating}</p>
            <p className="text-sm text-base-content opacity-80">
              Avg. Rating
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;
