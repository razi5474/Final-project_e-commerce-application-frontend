import React, { useEffect, useState } from 'react';
import { api } from '../../config/axiosInstance';
import toast from 'react-hot-toast';
import { Trash2, Edit2, Plus, Search, Archive } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchProducts = async (page = 1) => {
    setLoading(true);
    try {
      const res = await api.get(`/product/all?page=${page}&limit=10`);
      setProducts(res.data.products);
      setTotalPages(res.data.totalPages);
      setCurrentPage(res.data.currentPage);
    } catch (err) {
      toast.error('❌ Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage]);

  const handleDelete = async () => {
    try {
      await api.delete(`/product/delete/${selectedProductId}`);
      toast.success('✅ Product deleted');
      setSelectedProductId(null);
      fetchProducts(currentPage);
    } catch (err) {
      toast.error('❌ Failed to delete product');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-base-content">Manage Products</h2>
          <p className="text-base-content/60 mt-1">Manage all products in the marketplace.</p>
        </div>
        <button
          className="btn btn-primary gap-2"
          onClick={() => navigate('/admin/add-product')}
        >
          <Plus className="w-5 h-5" /> Add Product
        </button>
      </div>

      <div className="card bg-base-100 shadow-xl border border-base-200">
        <div className="card-body p-0">
          <div className="overflow-x-auto">
            <table className="table">
              <thead className="bg-base-200/50">
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Seller</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {products.map((p, index) => (
                    <motion.tr
                      key={p._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover"
                    >
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="avatar">
                            <div className="mask mask-squircle w-12 h-12 bg-base-200">
                              <img
                                src={p.images?.[1] || p.images?.[0] || 'https://via.placeholder.com/50'}
                                alt={p.title}
                              />
                            </div>
                          </div>
                          <div className="max-w-xs">
                            <div className="font-bold truncate" title={p.title}>{p.title}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="badge badge-ghost badge-sm">{p.category?.name || 'N/A'}</div>
                      </td>
                      <td className="font-mono">₹{p.price}</td>
                      <td>
                        {p.stock > 0 ? (
                          <div className="badge badge-success badge-sm gap-1 text-white">In Stock</div>
                        ) : (
                          <div className="badge badge-error badge-sm gap-1 text-white">Out of Stock</div>
                        )}
                      </td>
                      <td>
                        <div className="font-medium text-sm">{p.sellerID?.storeName || <span className="text-primary italic">Admin</span>}</div>
                      </td>
                      <td className="text-center">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => navigate(`/admin/update-product/${p._id}`)}
                            className="btn btn-square btn-sm btn-ghost hover:text-primary transition"
                            title="Edit Product"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setSelectedProductId(p._id)}
                            className="btn btn-square btn-sm btn-ghost hover:text-error transition"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
            {loading && <div className="text-center py-10"><span className="loading loading-spinner text-primary"></span></div>}
            {!loading && products.length === 0 && <div className="text-center py-10 text-base-content/60">No products found.</div>}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-4 border-t border-base-200 flex justify-center">
              <div className="join">
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPage(index + 1)}
                    className={`join-item btn btn-sm ${currentPage === index + 1 ? 'btn-active' : ''}`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {selectedProductId && (
        <dialog id="delete_modal" className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg text-error">Delete Product</h3>
            <p className="py-4">Are you sure you want to delete this product? This action cannot be undone.</p>
            <div className="modal-action">
              <button className="btn" onClick={() => setSelectedProductId(null)}>Cancel</button>
              <button className="btn btn-error text-white" onClick={handleDelete}>Delete</button>
            </div>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button onClick={() => setSelectedProductId(null)}>close</button>
          </form>
        </dialog>
      )}
    </div>
  );
};

export default ManageProducts;
