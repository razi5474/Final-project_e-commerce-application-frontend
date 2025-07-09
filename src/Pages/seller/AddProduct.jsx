import React, { useEffect, useState } from 'react';
import { api } from '../../config/axiosInstance';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AddProduct = () => {
  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState([null, null, null, null]);
  const [productData, setProductData] = useState({
    title: '',
    description: '',
    category: '',
    price: '',
    offerPrice: '',
    stock: '',
    colors: ['#000000'],
  });
  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.user); // get user info

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/category');
        setCategories(res.data.catagories);
      } catch (err) {
        toast.error('❌ Failed to load categories');
      }
    };
    fetchCategories();
  }, []);

  const handleImageChange = (e, index) => {
    const file = e.target.files[0];
    if (!file) return;
    const updatedImages = [...images];
    updatedImages[index] = {
      file,
      preview: URL.createObjectURL(file),
    };
    setImages(updatedImages);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  const descLength = productData.description.length;
  if (descLength < 20 || descLength > 500) {
    return toast.error('❌ Description must be between 20 and 500 characters.');
  }

  const formData = new FormData();

  images.forEach((imgObj) => {
    if (imgObj?.file) {
      formData.append('images', imgObj.file);
    }
  });

  // ✅ FIXED: Properly append colors and other fields
  for (const key in productData) {
    if (Array.isArray(productData[key])) {
      productData[key].forEach(val => formData.append(key, val));
    } else {
      formData.append(key, productData[key]);
    }
  }

  try {
    await api.post('/product/create', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    toast.success('Product created successfully!');
    setTimeout(() => {
      if (userData?.role === 'admin') navigate('/admin/manage-products');
      else if (userData?.role === 'seller') navigate('/seller/products');
    }, 800);

    setProductData({
      title: '',
      description: '',
      category: '',
      price: '',
      offerPrice: '',
      stock: '',
      colors: ['#000000'],
    });
    setImages([null, null, null, null]);
  } catch (err) {
    const msg = err.response?.data?.error || '❌ Product creation failed.';
    toast.error(msg);
  }
};


  return (
    <div className="p-4 md:p-8">
      <h2 className="text-2xl font-bold mb-6">Add Product</h2>

      <div className="bg-base-100 text-base-content shadow-md rounded-lg p-6 md:p-10 max-w-5xl border border-base-200 dark:border-white/10">
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Images */}
          <div>
            <p className="text-base font-medium">Product Images</p>
            <div className="flex flex-wrap items-center gap-4 mt-2">
              {images.map((img, index) => (
                <label key={index} htmlFor={`image${index}`}>
                  <input
                    accept="image/*"
                    type="file"
                    id={`image${index}`}
                    hidden
                    onChange={(e) => handleImageChange(e, index)}
                  />
                  <img
                    className="w-24 h-24 border border-dashed rounded cursor-pointer object-cover"
                    src={
                      img?.preview ||
                      'https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/e-commerce/uploadArea.png'
                    }
                    alt="Upload"
                  />
                </label>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block font-medium mb-1" htmlFor="name">Product Name</label>
            <input
              id="name"
              name="title"
              type="text"
              placeholder="Type here"
              value={productData.title}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded border border-base-300 bg-base-200 text-base-content focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block font-medium mb-1" htmlFor="description">Product Description</label>
            <textarea
              id="description"
              name="description"
              rows={4}
              placeholder="Type here"
              value={productData.description}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded border border-base-300 bg-base-200 text-base-content focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              required
            ></textarea>
          </div>

          {/* Category */}
          <div>
            <label className="block font-medium mb-1" htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              value={productData.category}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded border border-base-300 bg-base-200 text-base-content focus:outline-none focus:ring-2 focus:ring-primary"
              required
            >
              <option value="">Select Category</option>
              {categories.map((item) => (
                <option key={item._id} value={item._id}>{item.name}</option>
              ))}
            </select>
          </div>

          {/* Price + Offer */}
          <div className="flex gap-5 flex-wrap">
            <div className="flex-1 min-w-[150px]">
              <label className="block font-medium mb-1" htmlFor="price">Product Price</label>
              <input
                id="price"
                name="price"
                type="number"
                placeholder="0"
                value={productData.price}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded border border-base-300 bg-base-200 text-base-content focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <div className="flex-1 min-w-[150px]">
              <label className="block font-medium mb-1" htmlFor="offerPrice">Offer Price</label>
              <input
                id="offerPrice"
                name="offerPrice"
                type="number"
                placeholder="0"
                value={productData.offerPrice}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded border border-base-300 bg-base-200 text-base-content focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Stock + Colors */}
          <div className="flex gap-5 flex-wrap">
            <div className="flex-1 min-w-[150px]">
              <label className="block font-medium mb-1" htmlFor="stock">Product Stock</label>
              <input
                id="stock"
                name="stock"
                type="number"
                placeholder="e.g. 100"
                value={productData.stock}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded border border-base-300 bg-base-200 text-base-content focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            {/* Colors */}
            <div className="flex-1 min-w-[150px]">
              <label className="block font-medium mb-1">Product Colors</label>
              <div className="flex gap-3 flex-wrap items-center">
                {productData.colors.map((color, idx) => (
                  <div key={idx} className="relative flex items-center gap-1">
                    {/* Swatch */}
                    <div
                      className="w-8 h-8 rounded-full border-2 border-gray-300 cursor-pointer"
                      style={{ backgroundColor: color }}
                      onClick={() => document.getElementById(`color-picker-${idx}`).click()}
                    ></div>

                    {/* Hidden input */}
                    <input
                      type="color"
                      id={`color-picker-${idx}`}
                      value={color}
                      onChange={(e) => {
                        const updated = [...productData.colors];
                        updated[idx] = e.target.value;
                        setProductData({ ...productData, colors: updated });
                      }}
                      className="absolute opacity-0 w-0 h-0"
                    />

                    {/* Remove */}
                    <button
                      type="button"
                      onClick={() => {
                        const updated = [...productData.colors];
                        updated.splice(idx, 1);
                        setProductData({ ...productData, colors: updated });
                      }}
                      className="text-red-500 text-sm"
                    >
                      ✕
                    </button>
                  </div>
                ))}

                {/* Add */}
                <button
                  type="button"
                  onClick={() =>
                    setProductData({
                      ...productData,
                      colors: [...productData.colors, '#000000'],
                    })
                  }
                  className="text-sm text-blue-600 underline"
                >
                  + Add Color
                </button>
              </div>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="px-8 py-2.5 bg-primary hover:bg-primary-focus text-white font-semibold rounded transition"
          >
            ADD
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
