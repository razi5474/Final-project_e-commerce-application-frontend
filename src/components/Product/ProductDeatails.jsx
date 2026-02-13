import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { api } from '../../config/axiosInstance';
import { Star, ShoppingCart, Heart, Share2, Truck, Shield, ArrowLeft, Minus, Plus, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthUser, userData } = useSelector((state) => state.user);
  const isRestricted = userData?.role === 'seller' || userData?.role === 'admin';

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/product/${id}`);
        setProduct(data.product);
        // Prefer index 1 as requested by user, fallback to index 0
        setSelectedImage(data.product.images?.[1] || data.product.images?.[0] || '');
        setSelectedColor(data.product.colors?.[0] || '');
      } catch {
        toast.error("Failed to load product");
      } finally {
        setLoading(false);
      }

      try {
        const { data } = await api.get(`/review/product/${id}`);
        setReviews(data || []);
      } catch (err) {
        console.error("Failed to fetch reviews:", err);
      }

      try {
        const { data } = await api.get('/cart');
        setCartItems(data?.data?.Products || []);
      } catch {
        // ignore error
      }
    };

    fetchData();
  }, [id]);

  const isInCart = cartItems.some(item =>
    item.productID._id === id || item.productID === id
  );

  const handleAddToCart = async () => {
    if (!isAuthUser) {
      toast.error("Please log in to add products to your cart.");
      return navigate('/login');
    }
    if (product.stock === 0) return toast.error("Product is out of stock");

    try {
      const { data } = await api.post('/cart/addProduct', {
        productId: id,
        quantity: quantity || 1,
      });

      toast.success(data.message || 'Added to cart');
      setCartItems(prev => [...prev, { productID: product, quantity }]);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to add to cart');
    }
  };

  const handleBuyNow = () => {
    if (!isAuthUser) {
      toast.error("Please log in to continue");
      return navigate('/login');
    }

    if (product.stock === 0) {
      toast.error("Product is out of stock");
      return;
    }

    const buyNowItem = {
      productID: product._id,
      title: product.title,
      quantity,
      price: product.offerPrice > 0 ? product.offerPrice : product.price,
      image: selectedImage,
      sellerID: product.sellerID,
    };

    localStorage.setItem('buyNowItem', JSON.stringify(buyNowItem));
    navigate('/user/checkout?mode=buynow');
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await api.delete(`/review/delete/${reviewId}`);
      toast.success("Review deleted");
      setReviews(reviews.filter((r) => r._id !== reviewId));
      setNewRating(0);
      setNewComment('');
    } catch {
      toast.error("Failed to delete review");
    }
  };

  const handleSubmitReview = async () => {
    if (isRestricted) return toast.error("You cannot submit reviews");

    if (!newRating || !newComment.trim()) {
      return toast.error("Please provide both rating and comment.");
    }

    try {
      const { data } = await api.post('/review/add', {
        productId: id,
        rating: newRating,
        comment: newComment
      });

      toast.success("Review submitted!");
      setReviews(prev => [
        ...prev.filter(r => r.userID._id !== data.data.userID),
        data.data
      ]);
      setNewRating(0);
      setNewComment('');
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to submit review");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (!product) {
    return <div className="text-center py-10 text-lg text-base-content">Product not found.</div>;
  }

  return (
    <div className="max-w-7xl mx-auto min-h-screen px-4 sm:px-6 py-8 bg-base-100 text-base-content">
      <button onClick={() => navigate(-1)} className="btn btn-ghost btn-circle mb-4">
        <ArrowLeft className="w-6 h-6" />
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* LEFT: Images */}
        <div className="space-y-4">
          <motion.div
            layoutId="main-image"
            className="border border-base-200 rounded-2xl p-4 bg-white/50 backdrop-blur-sm shadow-sm overflow-hidden flex items-center justify-center h-[400px] md:h-[500px]"
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={selectedImage}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                src={selectedImage}
                alt={product.title}
                className="max-h-full max-w-full object-contain"
              />
            </AnimatePresence>
          </motion.div>

          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {product.images?.map((img, idx) => (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                key={idx}
                onClick={() => setSelectedImage(img)}
                className={`w-20 h-20 flex-shrink-0 cursor-pointer border-2 rounded-xl p-1 bg-white ${selectedImage === img ? 'border-primary' : 'border-base-200'
                  }`}
              >
                <img src={img} alt="thumbnail" className="w-full h-full object-contain" />
              </motion.div>
            ))}
          </div>
        </div>

        {/* RIGHT: Product Info */}
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-base-content to-base-content/70 bg-clip-text text-transparent">
              {product.title}
            </h1>
            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center gap-1 text-warning">
                <Star className="w-5 h-5 fill-current" />
                <span className="font-bold text-lg">{product.rating?.toFixed(1) || 0}</span>
              </div>
              <span className="text-base-content/40">•</span>
              <span className="text-base-content/60 underline cursor-pointer">{reviews.length} reviews</span>
            </div>
          </div>

          <div className="divider my-0"></div>

          <div className="space-y-4">
            <div className="flex items-end gap-3">
              <span className="text-4xl font-bold text-primary">₹{product.offerPrice > 0 ? product.offerPrice : product.price}</span>
              {product.offerPrice > 0 && (
                <>
                  <span className="text-xl text-base-content/40 line-through decoration-2">₹{product.price}</span>
                  <span className="badge badge-secondary badge-outline px-3 py-3">Save ₹{product.price - product.offerPrice}</span>
                </>
              )}
            </div>
            <p className="text-base-content/70 leading-relaxed text-lg">{product.description}</p>
          </div>

          <div className="flex flex-wrap gap-4 mt-2">
            <div className={`badge badge-lg gap-2 ${product.stock > 0 ? 'badge-success badge-outline' : 'badge-error badge-outline'}`}>
              <Truck className="w-4 h-4" />
              {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
            </div>
            <div className="badge badge-lg badge-outline gap-2">
              <Shield className="w-4 h-4" />
              1 Year Warranty
            </div>
          </div>

          {/* Colors */}
          {product.colors?.length > 0 && (
            <div>
              <h4 className="font-bold mb-3 text-sm uppercase tracking-wider text-base-content/60">Select Color</h4>
              <div className="flex gap-3">
                {product.colors.map((color, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedColor(color)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${selectedColor === color ? 'ring-2 ring-offset-2 ring-primary scale-110' : 'hover:scale-105'
                      }`}
                    style={{ backgroundColor: color, border: '1px solid rgba(0,0,0,0.1)' }}
                    title={color}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          {!isRestricted && (
            <div className="flex flex-col sm:flex-row gap-4 mt-4 items-stretch">
              <div className="join border border-base-300 rounded-full h-12 w-fit">
                <button className="join-item btn btn-ghost px-3 hover:bg-transparent" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                  <Minus className="w-4 h-4" />
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="join-item w-12 text-center bg-transparent border-none focus:outline-none [-moz-appearance:_textfield] [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none"
                />
                <button className="join-item btn btn-ghost px-3 hover:bg-transparent" onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}>
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="flex flex-1 gap-3">
                {isInCart ? (
                  <button onClick={() => navigate('/user/cart')} className="btn btn-outline btn-success flex-1 h-12 rounded-full text-lg">
                    Go to Cart
                  </button>
                ) : (
                  <button onClick={handleAddToCart} disabled={product.stock === 0} className="btn btn-outline btn-primary flex-1 h-12 rounded-full text-lg gap-2">
                    <ShoppingCart className="w-5 h-5" /> Add to Cart
                  </button>
                )}
                <button onClick={handleBuyNow} disabled={product.stock === 0} className="btn btn-primary flex-1 h-12 rounded-full text-lg shadow-lg shadow-primary/30">
                  Buy Now
                </button>
                <button className="btn btn-ghost btn-circle border border-base-200 h-12 w-12">
                  <Heart className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-20 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
          <MessageSquare className="w-6 h-6" />
          Customer Reviews
        </h2>

        {/* Review Form */}
        {isAuthUser && !isRestricted && (
          <div className="card bg-base-200/50 p-6 mb-10 border border-base-200">
            <h4 className="font-bold mb-4">
              {reviews.some((r) => r.userID?._id === userData._id)
                ? 'Update Your Review'
                : 'Write a Review'}
            </h4>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm">Rating:</span>
                <div className="rating rating-md">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <input
                      key={num}
                      type="radio"
                      name="rating-2"
                      className="mask mask-star-2 bg-orange-400"
                      checked={newRating === num}
                      onChange={() => setNewRating(num)}
                    />
                  ))}
                </div>
              </div>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={3}
                placeholder="Share your thoughts about this product..."
                className="textarea textarea-bordered w-full"
              ></textarea>
              <button
                onClick={handleSubmitReview}
                className="btn btn-primary self-end"
              >
                Submit Review
              </button>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {reviews.length > 0 ? (
            reviews.map((review) => {
              const isUserReview = review.userID?._id === userData._id;
              return (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  key={review._id}
                  className="card bg-base-100 border border-base-200 p-6 shadow-sm"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex gap-3">
                      <div className="avatar placeholder">
                        <div className="bg-neutral text-neutral-content rounded-full w-10 h-10">
                          <span className="text-lg">{review.userID?.name?.[0]?.toUpperCase() || 'U'}</span>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-bold">{review.userID?.name || 'Anonymous User'}</h4>
                        <div className="flex text-orange-400 text-sm">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-current' : 'opacity-30'}`} />
                          ))}
                        </div>
                      </div>
                    </div>
                    {isUserReview && (
                      <div className="flex gap-2">
                        <button onClick={() => handleDeleteReview(review._id)} className="btn btn-ghost btn-xs text-error">Delete</button>
                      </div>
                    )}
                  </div>
                  <p className="mt-3 text-base-content/80 text-sm leading-relaxed">{review.comment}</p>
                </motion.div>
              );
            })
          ) : (
            <div className="text-center py-10 opacity-60">No reviews yet. Be the first to add one!</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
