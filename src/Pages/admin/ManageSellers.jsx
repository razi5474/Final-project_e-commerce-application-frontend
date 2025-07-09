import React, { useEffect, useState } from 'react';
import { api } from '../../config/axiosInstance';
import { toast } from 'react-hot-toast';
import { FaCheckCircle, FaTimesCircle, FaTrashAlt, FaSearch } from 'react-icons/fa';
import { Dialog } from '@headlessui/react';

const ITEMS_PER_PAGE = 5;

const ManageSellers = () => {
  const [sellers, setSellers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [sellerToDelete, setSellerToDelete] = useState(null);

  const fetchSellers = async () => {
    try {
      const res = await api.get('/admin/all-sellers');
      setSellers(res.data.sellers || []);
    } catch (err) {
      toast.error('Failed to load sellers');
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
      fetchSellers();
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
      setShowModal(false);
      fetchSellers();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to delete seller');
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Manage Sellers</h2>

      <div className="mb-4 flex items-center gap-2">
        <FaSearch className="text-gray-500" />
        <input
          type="text"
          placeholder="Search by name or store..."
          className="input input-bordered w-full max-w-md"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="table w-full text-sm">
          <thead className="bg-base-200">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Store</th>
              <th>Phone</th>
              <th>Status</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((seller) => (
              <tr key={seller._id} className="border-t">
                <td>{seller.userId?.name}</td>
                <td>{seller.userId?.email}</td>
                <td>{seller.storeName}</td>
                <td>{seller.userId?.phone}</td>
                <td>
                  {seller.isPermission ? (
                    <span className="text-green-600 flex items-center gap-1">
                      <FaCheckCircle /> Verified
                    </span>
                  ) : (
                    <span className="text-yellow-500 flex items-center gap-1">
                      <FaTimesCircle /> Pending
                    </span>
                  )}
                </td>
                <td className="flex gap-3 justify-center items-center">
                  {!seller.isPermission && (
                    <button
                      onClick={() => verifySeller(seller._id)}
                      className="btn btn-sm btn-success text-white"
                    >
                      Verify
                    </button>
                  )}
                  <button
                    onClick={() => confirmDelete(seller)}
                    className="btn btn-sm btn-error text-white"
                  >
                    <FaTrashAlt />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {paginated.map((seller) => (
          <div key={seller._id} className="bg-base-200 p-4 rounded-xl shadow space-y-2">
            <div className="font-semibold text-base-content">{seller.userId?.name}</div>
            <div className="text-sm text-base-content">Store: {seller.storeName}</div>
            <div className="text-sm text-base-content">
              Status:{' '}
              {seller.isPermission ? (
                <span className="text-green-600 flex items-center gap-1">
                  <FaCheckCircle /> Verified
                </span>
              ) : (
                <span className="text-yellow-500 flex items-center gap-1">
                  <FaTimesCircle /> Pending
                </span>
              )}
            </div>
            <div className="flex gap-3 mt-2">
              {!seller.isPermission && (
                <button
                  onClick={() => verifySeller(seller._id)}
                  className="btn btn-xs btn-success text-white"
                >
                  Verify
                </button>
              )}
              <button
                onClick={() => confirmDelete(seller)}
                className="btn btn-xs btn-error text-white"
              >
                <FaTrashAlt />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-end gap-2 mt-4">
        {Array.from({ length: pageCount }, (_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`btn btn-sm ${page === i + 1 ? 'btn-primary' : 'btn-ghost'}`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      <Dialog open={showModal} onClose={() => setShowModal(false)} className="fixed inset-0 z-50">
        <div className="fixed inset-0 bg-black bg-opacity-40" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white dark:bg-gray-900 p-6 rounded-xl max-w-md w-full shadow-xl">
            <Dialog.Title className="text-lg font-semibold text-red-600 mb-2">
              Confirm Deletion
            </Dialog.Title>
            <p className="text-sm mb-4 text-base-content">
              Are you sure you want to delete seller{' '}
              <span className="font-semibold">{sellerToDelete?.userId?.name}</span>?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="btn btn-sm btn-ghost"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="btn btn-sm btn-error text-white"
              >
                Delete
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default ManageSellers;
