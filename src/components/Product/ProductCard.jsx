import React from 'react';
import { Star, Heart, ShoppingCart, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/product/productDeatails/${product._id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
      className="card card-compact bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 group overflow-hidden border border-base-200"
    >
      <figure className="relative pt-4 px-4 h-48 bg-base-100 flex items-center justify-center overflow-hidden">
        <img
          src={product.images?.[1] || product.images?.[0] || '/default-product.jpg'}
          alt={product.title}
          className="h-full object-contain transform group-hover:scale-110 transition-transform duration-500"
        />

        {/* Hover Actions */}
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={handleClick}
            className="btn btn-circle btn-sm btn-white hover:btn-primary"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            className="btn btn-circle btn-sm btn-white hover:btn-secondary"
            title="Add to Wishlist"
          >
            <Heart className="w-4 h-4" />
          </button>
        </div>
      </figure>

      <div className="card-body">
        <div className="flex justify-between items-start">
          <h3
            className="card-title text-base font-bold line-clamp-1 cursor-pointer hover:text-primary transition-colors"
            onClick={handleClick}
          >
            {product.title}
          </h3>
        </div>

        <p className="text-sm text-base-content/70 line-clamp-2 h-10">
          {product.description}
        </p>

        <div className="flex items-center gap-1 my-1">
          <div className="flex text-warning">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span className="text-xs font-medium ml-1">{product.rating || 4.5}</span>
          </div>
          <span className="text-xs text-base-content/40">• {product.reviews?.length || 120} reviews</span>
        </div>

        <div className="card-actions justify-between items-center mt-2">
          <div className="flex flex-col">
            <span className="text-xs text-base-content/50 line-through">₹{Math.round(product.price * 1.2)}</span>
            <span className="text-lg font-bold text-primary">₹{product.price}</span>
          </div>

          <button
            onClick={handleClick}
            className="btn btn-primary btn-sm gap-2 rounded-full px-4"
          >
            <ShoppingCart className="w-4 h-4" />
            Buy
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
