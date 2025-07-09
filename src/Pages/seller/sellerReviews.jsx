import React, { useEffect, useState } from 'react';
import { api } from '../../config/axiosInstance';
import { toast } from 'react-hot-toast';
import { FaStar } from 'react-icons/fa';

const SellerReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [products, setProducts] = useState([]);
  const [avgRatings, setAvgRatings] = useState({});
  const [selectedProduct, setSelectedProduct] = useState('Select');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [total, setTotal] = useState(0);

  const fetchReviews = async () => {
    try {
      const productParam = selectedProduct !== 'Select' ? `productId=${selectedProduct}&` : '';
      const res = await api.get(`/review/seller?${productParam}page=${page}&limit=${limit}`);
      setReviews(res.data.reviews);
      setProducts(res.data.products);
      setTotal(res.data.total);
      setAvgRatings(res.data.avgRatings);
    } catch (error) {
      toast.error('Failed to load reviews');
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [selectedProduct, page]);

  const renderStars = (count) => {
    return [...Array(5)].map((_, i) => (
      <FaStar
        key={i}
        className={i < count ? 'text-yellow-400 inline' : 'text-gray-300 dark:text-gray-600 inline'}
      />
    ));
  };

  const handleProductSelect = (id) => {
    setSelectedProduct(id);
    setIsDropdownOpen(false);
    setPage(1);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4 text-base-content">My Product Reviews</h2>

      {/* 🔍 Dropdown Filter */}
      <div className="relative w-full max-w-xs mb-6 text-sm z-40">
        <button
          type="button"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="w-full flex items-center justify-between px-4 py-2 border border-base-300 rounded-md shadow-sm bg-base-100 text-base-content hover:bg-base-200 transition duration-200"
        >
          <span>
            {selectedProduct === 'Select'
              ? 'All Products'
              : products.find(p => p._id === selectedProduct)?.title || 'Select Product'}
          </span>
          <svg
            className={`w-5 h-5 transition-transform duration-200 ${isDropdownOpen ? 'rotate-0' : '-rotate-90'}`}
            xmlns="http://www.w3.org/2000/svg"
            fill="none" viewBox="0 0 24 24" stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isDropdownOpen && (
          <ul className="absolute mt-1 w-full bg-base-100 border border-base-300 rounded shadow-md py-1 z-50 max-h-60 overflow-y-auto">
            <li
              className="px-4 py-2 cursor-pointer hover:bg-primary hover:text-white transition"
              onClick={() => handleProductSelect('Select')}
            >
              All Products
            </li>
            {products.map((p) => (
              <li
                key={p._id}
                className="px-4 py-2 cursor-pointer hover:bg-primary hover:text-white transition"
                onClick={() => handleProductSelect(p._id)}
              >
                {p.title} ({avgRatings[p._id] || 0} ⭐)
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 📋 Reviews */}
      {reviews.length === 0 ? (
        <p className="text-base-content/70">No reviews found.</p>
      ) : (
        <div className="grid gap-4">
          {reviews.map((review) => (
            <div key={review._id} className="border border-base-300 p-4 rounded shadow bg-base-100 text-base-content">
              <h3 className="font-semibold">{review.productID?.title || 'Unknown Product'}</h3>
              <p className="text-sm text-base-content/60">By: {review.userID?.name}</p>
              <p className="my-2">{renderStars(review.rating)}</p>
              <p className="italic">"{review.comment}"</p>
              <p className="text-xs text-base-content/40 mt-1">{new Date(review.createdAt).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}

      {/* 📄 Pagination */}
      <div className="mt-6 flex gap-2 flex-wrap">
        {Array.from({ length: Math.ceil(total / limit) }, (_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`px-3 py-1 rounded border ${
              page === i + 1
                ? 'bg-blue-500 text-white'
                : 'bg-base-100 text-base-content border-base-300'
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SellerReviews;
