import React, { useEffect, useState } from 'react';
import { api } from '../../config/axiosInstance';
import { toast } from 'react-hot-toast';
import { ShieldCheck, ShieldAlert, Trash2, Search, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ITEMS_PER_PAGE = 10;

const ManageSellers = () => {
  const [sellers, setSellers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [sellerToDelete, setSellerToDelete] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchSellers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/all-sellers');
      setSellers(res.data.sellers || []);
      setFiltered(res.data.sellers || []);
    } catch (err) {
      toast.error('Failed to load sellers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSellers();
  }, []);

  useEffect(() => {
    const filteredData = sellers.filter(seller =>
      seller.userId?.name?.toLowerCase().includes(search.toLowerCase()) ||
      seller.storeName?.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(filteredData);
    setPage(1);
  }, [search, sellers]);

  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  const pageCount = Math.ceil(filtered.length / ITEMS_PER_PAGE);

  const verifySeller = async (sellerId) => {
    try {
      const res = await api.put(`/admin/verify-seller/${sellerId}`);
      toast.success(res.data.message || 'Seller verified');
      // Optimistic update
      setSellers(sellers.map(s => s._id === sellerId ? { ...s, isPermission: true } : s));
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to verify seller');
    }
  };

  const confirmDelete = (seller) => {
    setSellerToDelete(seller);
    setShowModal(true);
  };

  const handleDelete = async () => {
    try {
      const res = await api.delete(`/seller/delete/${sellerToDelete._id}`);
      toast.success(res.data.message || 'Seller deleted');
      setSellers(sellers.filter(s => s._id !== sellerToDelete._id));
      setShowModal(false);
      setSellerToDelete(null);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to delete seller');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-base-content">Manage Sellers</h2>
          <p className="text-base-content/60 mt-1">Verify and manage seller accounts.</p>
        </div>
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search sellers..."
            className="input input-bordered w-full pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/40" />
        </div>
      </div>

      <div className="card bg-base-100 shadow-xl border border-base-200">
        <div className="card-body p-0">
          <div className="overflow-x-auto">
            <table className="table">
              <thead className="bg-base-200/50">
                <tr>
                  <th>Seller Info</th>
                  <th>Store Details</th>
                  <th>Contact</th>
                  <th>Status</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {paginated.map((seller, index) => (
                    <motion.tr
                      key={seller._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover"
                    >
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="avatar placeholder">
                            <div className="bg-neutral-focus text-neutral-content rounded-full w-10">
                              <span className="text-lg uppercase">{seller.userId?.name?.[0]}</span>
                            </div>
                          </div>
                          <div>
                            <div className="font-bold">{seller.userId?.name}</div>
                            <div className="text-xs opacity-50">Joined: {new Date(seller.createdAt).toLocaleDateString()}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="font-bold">{seller.storeName}</div>
                        <div className="text-xs opacity-50 truncate max-w-[150px]">{seller.storeDescription}</div>
                      </td>
                      <td>
                        <div className="text-sm">{seller.userId?.email}</div>
                        <div className="text-sm">{seller.userId?.phone}</div>
                      </td>
                      <td>
                        {seller.isPermission ? (
                          <div className="badge badge-success gap-1 text-white">
                            <ShieldCheck className="w-3 h-3" /> Verified
                          </div>
                        ) : (
                          <div className="badge badge-warning gap-1 text-white">
                            <ShieldAlert className="w-3 h-3" /> Pending
                          </div>
                        )}
                      </td>
                      <td className="text-center">
                        <div className="flex justify-center gap-2">
                          {!seller.isPermission && (
                            <button
                              onClick={() => verifySeller(seller._id)}
                              className="btn btn-sm btn-success text-white"
                              title="Verify Seller"
                            >
                              Verify
                            </button>
                          )}
                          <button
                            onClick={() => confirmDelete(seller)}
                            className="btn btn-square btn-sm btn-error text-white"
                            title="Delete Seller"
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
            {!loading && paginated.length === 0 && <div className="text-center py-10 text-base-content/60">No sellers found.</div>}
          </div>

          {/* Pagination */}
          {pageCount > 1 && (
            <div className="p-4 border-t border-base-200 flex justify-center">
              <div className="join">
                {Array.from({ length: pageCount }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={`join-item btn btn-sm ${page === i + 1 ? 'btn-active' : ''}`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Modal */}
      {showModal && sellerToDelete && (
        <dialog id="delete_modal" className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg text-error">Delete Seller</h3>
            <p className="py-4">
              Are you sure you want to delete <span className="font-bold">{sellerToDelete.storeName}</span>?
              This will remove all their products and data.
            </p>
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

export default ManageSellers;
