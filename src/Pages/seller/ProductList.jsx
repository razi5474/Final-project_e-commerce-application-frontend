import React, { useEffect, useState } from "react";
import { api } from "../../config/axiosInstance";
import { FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/product/seller");
        setProducts(res.data.products);
      } catch (err) {
        console.error("Failed to fetch seller products:", err);
      }
    };
    fetchProducts();
  }, []);

  const handleEdit = (id) => {
    navigate(`/seller/update-product/${id}`);
  };

  const handleImageClick = (id) => {
    navigate(`/product/productDeatails/${id}`); // navigate to product details page
  };

  return (
    <div className="flex-1 px-1 sm:px-4 md:px-5 py-2 sm:py-4 md:py-8 flex flex-col justify-between">
      <div className="w-full ">
        <h2 className="text-2xl font-bold mb-2">My Products</h2>

        <div className="flex flex-col items-center max-w-6xl w-full overflow-hidden rounded-md bg-base-100 border border-gray-200 shadow-sm">
            {/* Mobile only header */}
              <div className="sm:hidden w-full px-4 py-2 text-xs text-gray-500 font-medium bg-gray-50 border-b border-gray-200 flex justify-between">
                <span>Product</span>
                <span>Price</span>
                <span>Edit</span>
              </div>
          <table className="w-full table-auto text-sm">
            <thead className="bg-base-200 text-base-content hidden sm:table-header-group">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Product</th>
                <th className="text-left px-4 py-3 font-medium hidden sm:table-cell">Category</th>
                <th className="text-left px-4 py-3 font-medium hidden sm:table-cell">Selling Price</th>
                <th className="text-left px-4 py-3 font-medium hidden sm:table-cell">In Stock</th>
                <th className="text-center px-4 py-3 font-medium">Edit</th>
              </tr>
            </thead>
            <tbody className="text-base-content">
              {products.map((product) => (
                <tr key={product._id} className="border-t">
                  {/* Product image & title (title hidden on mobile) */}
                  <td className="px-4 py-3 flex items-center gap-3 max-w-xs truncate">
                    <img
                      src={product.images?.[0] || "https://via.placeholder.com/50"}
                      alt={product.title}
                      onClick={() => handleImageClick(product._id)}
                      className="w-12 h-12 object-cover border rounded cursor-pointer"
                    />
                    <span className="truncate font-medium text-sm hidden sm:inline">
                      {product.title.length > 50
                        ? product.title.substring(0, 50) + "..."
                        : product.title}
                    </span>
                  </td>

                  {/* Category – shown only on larger screens */}
                  <td className="px-4 py-3 hidden sm:table-cell">
                    {product.category?.name || "N/A"}
                  </td>

                  {/* Price – visible on all devices */}
                  <td className="px-4 py-3 font-semibold text-base-content">
                    ₹{product.offerPrice || product.price}
                  </td>

                  {/* Stock – hidden on mobile */}
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        defaultChecked={product.stock > 0}
                        readOnly
                      />
                      <div className="w-10 h-6 bg-gray-300 rounded-full peer peer-checked:bg-green-500 transition"></div>
                      <span className="dot absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-4"></span>
                    </label>
                  </td>

                  {/* Edit button – always shown */}
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleEdit(product._id)}
                      className="text-blue-600 hover:text-blue-800"
                      title="Edit Product"
                    >
                      <FaEdit size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-6 text-gray-400">
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
