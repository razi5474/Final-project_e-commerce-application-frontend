import React, { useEffect, useState } from 'react';
import { api } from '../../config/axiosInstance';
import toast from 'react-hot-toast';
import { FaTrash, FaStar } from 'react-icons/fa';
import ConfirmModal from '../../components/common/ConfirmModal';
import Loader from '../../components/common/Loader';

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [selectedReviewId, setSelectedReviewId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedRating, setSelectedRating] = useState('');

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await api.get('/review/admin/all');
      setReviews(res.data.reviews);
      setFilteredReviews(res.data.reviews);

      const productMap = {};
      res.data.reviews.forEach((r) => {
        if (r.productID?._id && r.productID?.title) {
          productMap[r.productID._id] = r.productID.title;
        }
      });
      setProducts(Object.entries(productMap));
    } catch (err) {
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleDelete = async () => {
    try {
      await api.delete(`/review/admin/delete/${selectedReviewId}`);
      toast.success('Review deleted');
      setShowModal(false);
      fetchReviews();
    } catch (err) {
      toast.error('Failed to delete review');
    }
  };

  const handleFilter = () => {
    let filtered = [...reviews];
    if (selectedProduct) {
      filtered = filtered.filter((r) => r.productID?._id === selectedProduct);
    }
    if (selectedRating) {
      filtered = filtered.filter((r) => r.rating === Number(selectedRating));
    }
    setFilteredReviews(filtered);
  };

  const resetFilter = () => {
    setSelectedProduct('');
    setSelectedRating('');
    setFilteredReviews(reviews);
  };

  const renderStars = (count) => (
    <div className="flex text-yellow-500">
      {[...Array(5)].map((_, i) => (
        <FaStar key={i} className={i < count ? 'text-yellow-500' : 'text-gray-300'} />
      ))}
    </div>
  );

  if (loading) return <Loader message="Loading reviews..." />;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">All Reviews</h2>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <select
          value={selectedProduct}
          onChange={(e) => setSelectedProduct(e.target.value)}
          className="select select-bordered w-full md:w-1/3"
        >
          <option value="">Filter by Product</option>
          {products.map(([id, title]) => (
            <option key={id} value={id}>
              {title}
            </option>
          ))}
        </select>

        <select
          value={selectedRating}
          onChange={(e) => setSelectedRating(e.target.value)}
          className="select select-bordered w-full md:w-1/3"
        >
          <option value="">Filter by Rating</option>
          {[5, 4, 3, 2, 1].map((r) => (
            <option key={r} value={r}>
              {r} Star{r > 1 && 's'}
            </option>
          ))}
        </select>

        <button className="btn btn-primary w-full md:w-auto" onClick={handleFilter}>
          Apply Filters
        </button>
        <button className="btn btn-outline w-full md:w-auto" onClick={resetFilter}>
          Reset
        </button>
      </div>

      {/* No reviews */}
      {filteredReviews.length === 0 && (
        <p className="text-center text-gray-500">No reviews found.</p>
      )}

      {/* Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="table w-full border border-base-200">
          <thead>
            <tr className="bg-base-200 text-base-content">
              <th>User</th>
              <th>Product</th>
              <th>Rating</th>
              <th>Comment</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredReviews.map((r) => (
              <tr key={r._id}>
                <td>{r.userID?.name}</td>
                <td>{r.productID?.title}</td>
                <td>{renderStars(r.rating)}</td>
                <td className="max-w-xs truncate">{r.comment}</td>
                <td>{new Date(r.createdAt).toLocaleDateString()}</td>
                <td>
                  <button
                    className="btn btn-xs btn-error text-white"
                    onClick={() => {
                      setSelectedReviewId(r._id);
                      setShowModal(true);
                    }}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Card View */}
      <div className="md:hidden grid grid-cols-1 gap-4">
        {filteredReviews.map((r) => (
          <div
            key={r._id}
            className="bg-base-100 border border-base-200 rounded-lg p-4 shadow space-y-2"
          >
            <div className="font-semibold">{r.userID?.name}</div>
            <div className="text-sm">{r.productID?.title}</div>
            <div>{renderStars(r.rating)}</div>
            <div className="text-sm">{r.comment}</div>
            <div className="text-xs text-gray-500">{new Date(r.createdAt).toLocaleDateString()}</div>
            <div className="flex justify-end">
              <button
                onClick={() => {
                  setSelectedReviewId(r._id);
                  setShowModal(true);
                }}
                className="btn btn-sm btn-error text-white"
              >
                <FaTrash size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Confirm Modal */}
      {showModal && (
        <ConfirmModal
          message="Are you sure you want to delete this review?"
          onConfirm={handleDelete}
          onCancel={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default AdminReviews;
