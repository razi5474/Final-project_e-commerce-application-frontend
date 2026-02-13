import React, { useEffect, useState } from 'react';
import { api } from '../../config/axiosInstance';
import toast from 'react-hot-toast';
import { Trash2, Star, MessageSquare, Filter, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
      setReviews(reviews.filter(r => r._id !== selectedReviewId));
      setFilteredReviews(filteredReviews.filter(r => r._id !== selectedReviewId));
      setShowModal(false);
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
    <div className="flex text-warning">
      {[...Array(5)].map((_, i) => (
        <Star key={i} className={`w-4 h-4 ${i < count ? 'fill-current' : 'text-base-300'}`} />
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-base-content">All Reviews</h2>
          <p className="text-base-content/60 mt-1">Manage product reviews and ratings.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-base-100 p-4 rounded-xl border border-base-200 shadow-sm flex flex-col md:flex-row gap-3 items-end">
        <div className="w-full md:w-1/3">
          <label className="label text-xs font-semibold uppercase text-base-content/60">Product</label>
          <select
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
            className="select select-bordered w-full"
          >
            <option value="">All Products</option>
            {products.map(([id, title]) => (
              <option key={id} value={id}>
                {title}
              </option>
            ))}
          </select>
        </div>

        <div className="w-full md:w-1/3">
          <label className="label text-xs font-semibold uppercase text-base-content/60">Rating</label>
          <select
            value={selectedRating}
            onChange={(e) => setSelectedRating(e.target.value)}
            className="select select-bordered w-full"
          >
            <option value="">All Ratings</option>
            {[5, 4, 3, 2, 1].map((r) => (
              <option key={r} value={r}>
                {r} Star{r > 1 && 's'}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          <button className="btn btn-primary flex-1 md:flex-none gap-2" onClick={handleFilter}>
            <Filter className="w-4 h-4" /> Apply
          </button>
          <button className="btn btn-ghost flex-1 md:flex-none gap-2" onClick={resetFilter}>
            <X className="w-4 h-4" /> Reset
          </button>
        </div>
      </div>

      <div className="card bg-base-100 shadow-xl border border-base-200">
        <div className="card-body p-0">
          {/* Table View */}
          <div className="overflow-x-auto">
            <table className="table">
              <thead className="bg-base-200/50">
                <tr>
                  <th>User</th>
                  <th>Product</th>
                  <th>Rating</th>
                  <th>Comment</th>
                  <th>Date</th>
                  <th className="text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filteredReviews.map((r, index) => (
                    <motion.tr
                      key={r._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover"
                    >
                      <td>
                        <div className="font-bold">{r.userID?.name || 'Anonymous'}</div>
                      </td>
                      <td>
                        <div className="font-medium text-primary">{r.productID?.title || 'Unknown Product'}</div>
                      </td>
                      <td>{renderStars(r.rating)}</td>
                      <td>
                        <div className="max-w-xs truncate flex items-center gap-2 opacity-80" title={r.comment}>
                          <MessageSquare className="w-3 h-3 flex-shrink-0" />
                          {r.comment}
                        </div>
                      </td>
                      <td className="text-sm opacity-60 font-mono">
                        {new Date(r.createdAt).toLocaleDateString()}
                      </td>
                      <td className="text-center">
                        <button
                          className="btn btn-square btn-sm btn-ghost text-error hover:bg-error/10"
                          onClick={() => {
                            setSelectedReviewId(r._id);
                            setShowModal(true);
                          }}
                          title="Delete Review"
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
            {!loading && filteredReviews.length === 0 && <div className="text-center py-10 text-base-content/60">No reviews found.</div>}
          </div>
        </div>
      </div>

      {/* Confirm Modal */}
      {showModal && (
        <dialog id="delete_modal" className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg text-error">Delete Review</h3>
            <p className="py-4">Are you sure you want to delete this review? This action cannot be undone.</p>
            <div className="modal-action">
              <button className="btn" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-error text-white" onClick={handleDelete}>Delete</button>
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

export default AdminReviews;
