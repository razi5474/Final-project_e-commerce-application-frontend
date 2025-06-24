import React from 'react';
import { AiFillStar } from 'react-icons/ai';
import { FiHeart } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/product/productDeatails/${product._id}`);
  };

  return (
    <div className="relative bg-white text-gray-900 dark:bg-base-200 dark:text-base-content rounded-xl shadow-lg hover:shadow-xl transition duration-300 p-3 flex flex-col justify-between h-full">
      {/* Wishlist icon */}
      <div className="absolute top-3 right-3 bg-gray-100 dark:bg-gray-800 p-1 rounded-full shadow">
        <FiHeart className="text-gray-600 dark:text-gray-300 w-5 h-5" />
      </div>

      {/* Product image */}
      <img
        src={product.images?.[1] || '/default-product.jpg'}
        alt={product.title}
        className="w-full h-40 object-contain mb-3 rounded-md"
      />

      {/* Title */}
      <h3 className="text-sm font-semibold line-clamp-2">
        {product.title}
      </h3>

      {/* Description */}
      <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mt-1">
        {product.description}
      </p>

      {/* Price and rating */}
      <div className="flex justify-between items-center mt-3">
        <span className="text-base font-semibold">
          ₹{product.price}
        </span>
        <span className="flex items-center gap-1 text-yellow-500 text-sm">
          <AiFillStar />
          {product.rating || 0}
        </span>
      </div>

      {/* View Details Button */}
      <button
        onClick={handleClick}
        className="mt-4 py-1.5 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md transition duration-200"
      >
        View Details
      </button>
    </div>
  );
};

export default ProductCard;
