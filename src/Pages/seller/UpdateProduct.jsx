import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { api } from '../../config/axiosInstance';
import toast from 'react-hot-toast';
import BackButton from '../../components/common/BackButton';

const UpdateProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.user);

  const [productData, setProductData] = useState({
    title: '',
    description: '',
    category: '',
    price: '',
    offerPrice: '',
    stock: '',
    colors: ['#000000'],
  });
  const [images, setImages] = useState([null, null, null, null]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, productRes] = await Promise.all([
          api.get('/category'),
          api.get(`/product/${id}`),
        ]);

        setCategories(catRes.data.catagories);

        const p = productRes.data.product;

        setProductData({
          title: p.title,
          description: p.description,
          category: p.category._id,
          price: p.price,
          offerPrice: p.offerPrice || '',
          stock: p.stock,
          colors: p.colors || ['#000000'],
        });

        const previews = Array(4).fill(null).map((_, i) => ({
          file: null,
          preview: p.images?.[i] || null,
        }));

        setImages(previews);
      } catch (err) {
        toast.error('❌ Failed to load product details');
      }
    };
    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e, index) => {
    const file = e.target.files[0];
    if (!file) return;
    const updated = [...images];
    updated[index] = {
      file,
      preview: URL.createObjectURL(file),
    };
    setImages(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    images.forEach((imgObj) => {
      if (imgObj?.file) formData.append('images', imgObj.file);
    });

    for (const key in productData) {
      if (Array.isArray(productData[key])) {
        productData[key].forEach(val => formData.append(key, val));
      } else {
        formData.append(key, productData[key]);
      }
    }

    try {
      await api.put(`/product/update/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success('✅ Product updated successfully!');

      // ✅ Redirect based on role
      if (userData?.role === 'admin') {
        navigate('/admin/manage-products');
      } else {
        navigate('/seller/products');
      }

    } catch (err) {
      toast.error('❌ Failed to update product');
    }
  };

  return (
    <div className="p-4 md:p-8">
      <BackButton />
      <h2 className="text-2xl font-bold mb-6">Update Product</h2>

      <form
        className="bg-white dark:bg-base-100 p-6 rounded shadow space-y-6"
        onSubmit={handleSubmit}
      >
        {/* Images */}
        <div>
          <label className="font-semibold mb-2 block">Product Images:</label>
          <div className="flex gap-3 flex-wrap">
            {images.map((img, i) => (
              <label key={i}>
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={(e) => handleImageChange(e, i)}
                />
                <img
                  src={
                    img?.preview ||
                    'https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/e-commerce/uploadArea.png'
                  }
                  className="w-24 h-24 object-contain border rounded cursor-pointer"
                  alt="Preview"
                />
              </label>
            ))}
          </div>
        </div>

        {/* Title */}
        <div>
          <label htmlFor="title" className="font-semibold block mb-1">Product Title:</label>
          <input
            id="title"
            type="text"
            name="title"
            value={productData.title}
            onChange={handleChange}
            className="input input-bordered w-full"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="font-semibold block mb-1">Description:</label>
          <textarea
            id="description"
            name="description"
            value={productData.description}
            onChange={handleChange}
            className="textarea textarea-bordered w-full"
            rows={4}
            required
          />
        </div>

        {/* Category */}
        <div>
          <label htmlFor="category" className="font-semibold block mb-1">Category:</label>
          <select
            id="category"
            name="category"
            value={productData.category}
            onChange={handleChange}
            className="select select-bordered w-full"
            required
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>
        </div>

        {/* Price */}
        <div>
          <label htmlFor="price" className="font-semibold block mb-1">Price:</label>
          <input
            id="price"
            type="number"
            name="price"
            value={productData.price}
            onChange={handleChange}
            className="input input-bordered w-full"
            required
          />
        </div>

        {/* Offer Price */}
        <div>
          <label htmlFor="offerPrice" className="font-semibold block mb-1">Offer Price (optional):</label>
          <input
            id="offerPrice"
            type="number"
            name="offerPrice"
            value={productData.offerPrice}
            onChange={handleChange}
            className="input input-bordered w-full"
          />
        </div>

        {/* Stock */}
        <div>
          <label htmlFor="stock" className="font-semibold block mb-1">Stock Quantity:</label>
          <input
            id="stock"
            type="number"
            name="stock"
            value={productData.stock}
            onChange={handleChange}
            className="input input-bordered w-full"
            required
          />
        </div>

        {/* Colors */}
        <div>
          <label className="font-semibold block mb-2">Colors:</label>
          <div className="flex flex-wrap gap-4 items-center">
            {productData.colors.map((color, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => {
                    const updatedColors = [...productData.colors];
                    updatedColors[index] = e.target.value;
                    setProductData((prev) => ({
                      ...prev,
                      colors: updatedColors,
                    }));
                  }}
                  className="w-10 h-10 border rounded"
                />
                <button
                  type="button"
                  onClick={() => {
                    const updatedColors = productData.colors.filter((_, i) => i !== index);
                    setProductData((prev) => ({
                      ...prev,
                      colors: updatedColors,
                    }));
                  }}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  ✖
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={() =>
                setProductData((prev) => ({
                  ...prev,
                  colors: [...prev.colors, '#000000'],
                }))
              }
              className="btn btn-sm btn-outline"
            >
              + Add Color
            </button>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition"
        >
          Update Product
        </button>
      </form>
    </div>
  );
};

export default UpdateProduct;
