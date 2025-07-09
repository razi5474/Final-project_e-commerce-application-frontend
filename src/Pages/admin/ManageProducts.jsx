import React, { useEffect, useState } from 'react';
import { api } from '../../config/axiosInstance';
import toast from 'react-hot-toast';
import { FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const navigate = useNavigate();

  const fetchProducts = async (page = 1) => {
    try {
      const res = await api.get(`/product/all?page=${page}&limit=10`);
      setProducts(res.data.products);
      setTotalPages(res.data.totalPages);
      setCurrentPage(res.data.currentPage);
    } catch (err) {
      toast.error('❌ Failed to load products');
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
    <div className="p-4">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2 mb-4">
        <h2 className="text-2xl font-bold">Manage Products</h2>
        <button
          className="btn btn-primary btn-sm md:btn-md w-full md:w-auto"
          onClick={() => navigate('/admin/add-product')}
        >
          ➕ Add Product
        </button>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="table w-full border border-base-200">
          <thead>
            <tr className="bg-base-200 text-base-content">
              <th>Image</th>
              <th>Title</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Seller</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id}>
                <td>
                  <img
                    src={p.images?.[1] || 'https://via.placeholder.com/50'}
                    alt="product"
                    className="w-16 h-16 object-contain rounded"
                  />
                </td>
                <td>{p.title}</td>
                <td>{p.category?.name || 'N/A'}</td>
                <td>₹{p.price}</td>
                <td>{p.stock}</td>
                <td>{p.sellerID?.storeName || 'Admin'}</td>
                <td>
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/admin/update-product/${p._id}`)}
                      className="btn btn-xs btn-outline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setSelectedProductId(p._id)}
                      className="btn btn-xs btn-error text-white"
                    >
                      <FaTrash size={12} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden grid grid-cols-1 gap-4">
        {products.map((p) => (
          <div
            key={p._id}
            className="bg-base-100 border border-base-200 rounded-lg shadow p-4 space-y-2"
          >
            <div className="flex items-center gap-4">
              <img
                src={p.images?.[1] || 'https://via.placeholder.com/50'}
                alt={p.title}
                className="w-20 h-20 object-contain rounded"
              />
              <div className="flex-1">
                <h3 className="text-lg font-semibold">{p.title}</h3>
                <p className="text-sm text-gray-500">{p.category?.name || 'No Category'}</p>
              </div>
            </div>

            <div className="text-sm space-y-1">
              <p>Price: ₹{p.price}</p>
              <p>Stock: {p.stock}</p>
              <p>Seller: {p.sellerID?.storeName || 'Admin'}</p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => navigate(`/admin/update-product/${p._id}`)}
                className="btn btn-sm btn-outline"
              >
                Edit
              </button>
              <button
                onClick={() => setSelectedProductId(p._id)}
                className="btn btn-sm btn-error text-white"
              >
                <FaTrash size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 gap-2">
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index + 1)}
              className={`btn btn-sm ${currentPage === index + 1 ? 'btn-primary' : 'btn-outline'}`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {selectedProductId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[90%] max-w-md space-y-4">
            <h3 className="text-xl font-semibold text-red-600">Confirm Deletion</h3>
            <p className="text-sm text-gray-700">
              Are you sure you want to delete this product? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2 pt-4">
              <button
                className="btn btn-sm"
                onClick={() => setSelectedProductId(null)}
              >
                Cancel
              </button>
              <button
                className="btn btn-sm btn-error text-white"
                onClick={handleDelete}
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageProducts;
