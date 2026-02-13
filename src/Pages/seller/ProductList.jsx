import React, { useEffect, useState } from "react";
import { api } from "../../config/axiosInstance";
import { Edit2, Trash2, Plus, Search, MoreVertical, Package } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get("/product/seller");
      setProducts(res.data.products);
    } catch (err) {
      console.error("Failed to fetch seller products:", err);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id) => {
    navigate(`/seller/update-product/${id}`);
  };

  const handleImageClick = (id) => {
    navigate(`/product/productDeatails/${id}`);
  };

  const handleDelete = async () => {
    if (!selectedProductId) return;
    try {
      await api.delete(`/product/delete/${selectedProductId}`);
      setProducts((prev) => prev.filter(p => p._id !== selectedProductId));
      toast.success("Product deleted successfully");
      setSelectedProductId(null);
    } catch (err) {
      toast.error("Failed to delete product");
      console.error(err);
    }
  };

  const filteredProducts = products.filter(product =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-base-content">Products</h2>
          <p className="text-base-content/60 mt-1">Manage your product catalog</p>
        </div>
        <button className="btn btn-primary gap-2" onClick={() => navigate('/seller/add-product')}>
          <Plus className="w-5 h-5" /> Add New Product
        </button>
      </div>

      <div className="card bg-base-100 shadow-xl border border-base-200">
        <div className="card-body p-4 md:p-6">

          {/* Toolbar */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
            <div className="relative w-full md:w-96">
              <input
                type="text"
                placeholder="Search products..."
                className="input input-bordered w-full pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/40" />
            </div>
            <div className="badge badge-lg badge-ghost gap-2">
              Total Products: <span className="font-bold">{filteredProducts.length}</span>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-20"><span className="loading loading-spinner loading-lg text-primary"></span></div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20">
              <div className="bg-base-200 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-10 h-10 text-base-content/40" />
              </div>
              <h3 className="text-lg font-bold">No Products Found</h3>
              <p className="text-base-content/60">Start by adding your first product!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th className="hidden md:table-cell">Category</th>
                    <th>Price</th>
                    <th className="hidden sm:table-cell">Stock</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {filteredProducts.map((product) => (
                      <motion.tr
                        key={product._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        layout
                      >
                        <td>
                          <div className="flex items-center gap-3">
                            <div className="avatar cursor-pointer" onClick={() => handleImageClick(product._id)}>
                              <div className="mask mask-squircle w-12 h-12 bg-base-200">
                                <img src={product.images?.[1] || product.images?.[0] || "https://via.placeholder.com/50"} alt={product.title} />
                              </div>
                            </div>
                            <div className="max-w-[200px] sm:max-w-xs">
                              <div className="font-bold truncate cursor-pointer hover:text-primary transition" onClick={() => handleImageClick(product._id)}>
                                {product.title}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="hidden md:table-cell">
                          <div className="badge badge-ghost badge-sm">{product.category?.name || "N/A"}</div>
                        </td>
                        <td>
                          <div className="font-bold">₹{product.offerPrice || product.price}</div>
                          {product.offerPrice && <div className="text-xs line-through opacity-50">₹{product.price}</div>}
                        </td>
                        <td className="hidden sm:table-cell">
                          {product.stock > 0 ? (
                            <div className="badge badge-success badge-sm gap-1 text-white">In Stock</div>
                          ) : (
                            <div className="badge badge-error badge-sm gap-1 text-white">Out of Stock</div>
                          )}
                        </td>
                        <td className="text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleEdit(product._id)}
                              className="btn btn-square btn-sm btn-ghost hover:bg-primary hover:text-white transition"
                              title="Edit"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setSelectedProductId(product._id)}
                              className="btn btn-square btn-sm btn-ghost text-error hover:bg-error hover:text-white transition"
                              title="Delete"
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

export default ProductList;
