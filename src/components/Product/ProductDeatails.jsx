import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { api } from '../../config/axiosInstance';
import { AiFillStar } from 'react-icons/ai';
import toast from 'react-hot-toast';
import BackButton from '../common/BackButton';

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await api.get(`/product/${id}`);
        setProduct(data.product);
        setSelectedImage(data.product.images?.[1] || '');
        setSelectedColor(data.product.colors?.[0] || '');
      } catch {
        toast.error("Failed to load product");
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

  // Save Buy Now product to localStorage
  const buyNowItem = {
    productID: product._id,
    title: product.title,
    quantity,
    price: product.offerPrice > 0 ? product.offerPrice : product.price,
    image: selectedImage,
    sellerID: product.sellerID,
  };

  localStorage.setItem('buyNowItem', JSON.stringify(buyNowItem));

  // Navigate to address form with mode
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

  if (!product) {
    return <div className="text-center py-10 text-lg text-base-content">Loading product details...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto min-h-screen px-4 sm:px-6 md:px-8 py-10 bg-base-100 text-base-content">
      <BackButton />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
        {/* LEFT: Images */}
        <div>
          <div className="border border-base-300 rounded-lg p-4">
            <img src={selectedImage} alt={product.title} className="w-full h-[400px] object-contain" />
          </div>
          <div className="flex gap-2 mt-4">
            {product.images?.map((img, idx) => (
              <img
                key={idx}
                src={img}
                onClick={() => setSelectedImage(img)}
                className={`w-16 h-16 object-contain cursor-pointer border ${
                  selectedImage === img ? 'border-primary' : 'border-base-300'
                } rounded`}
                alt="thumbnail"
              />
            ))}
          </div>
        </div>

        {/* RIGHT: Product Info */}
        <div>
          <h1 className="text-3xl font-semibold">{product.title}</h1>

          <div className="flex items-center mt-2 text-yellow-500">
            <AiFillStar />
            <span className="ml-1 text-sm">{product.rating?.toFixed(1) || 0} / 5</span>
          </div>

          <div className="mt-3 flex items-center gap-4">
            {product.offerPrice > 0 ? (
              <>
                <p className="text-2xl font-bold text-black-600">₹{product.offerPrice}</p>
                <p className="text-lg line-through opacity-70">₹{product.price}</p>
              </>
            ) : (
              <p className="text-2xl font-bold">₹{product.price}</p>
            )}
          </div>

          <p className="mt-4 leading-relaxed opacity-80">{product.description}</p>
          <p className={`text-sm font-medium mt-2 ${product.stock > 0 ? 'text-success' : 'text-error'}`}>
            {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
          </p>

          {/* Colors */}
          {product.colors?.length > 0 && (
            <div className="mt-4">
              <h4 className="font-semibold mb-2">Available Colors:</h4>
              <div className="flex gap-2">
                {product.colors.map((color, idx) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedColor(color)}
                    style={{ backgroundColor: color }}
                    className={`w-6 h-6 rounded-full border-2 cursor-pointer transition-all duration-200 ${
                      selectedColor === color ? 'ring-2 ring-offset-2 ring-primary border-primary' : 'border-base-300'
                    }`}
                    title={color}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          {!isRestricted && (
            <div className="mt-4">
              <label className="block text-sm mb-1">Quantity</label>
              <input
                type="number"
                value={quantity}
                min={1}
                max={product.stock}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-24 input input-bordered"
              />
            </div>
          )}

          {/* Buttons */}
          {!isRestricted && (
            <div className="mt-6 flex flex-wrap items-center gap-2 sm:gap-4">
              {isInCart ? (
                <button
                  onClick={() => navigate('/user/cart')}
                  className="btn btn-success flex-1 min-w-[120px]"
                >
                  Go to Cart
                </button>
              ) : (
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="btn btn-primary flex-1 min-w-[120px]"
                >
                  Add to Cart
                </button>
              )}
              <button
                onClick={handleBuyNow}
                disabled={product.stock === 0}
                className="btn btn-warning flex-1 min-w-[120px]"
              >
                Buy Now
              </button>
            </div>
          )}

          {/* Reviews */}
          <div className="mt-10">
            <h3 className="text-xl font-semibold mb-3">Customer Reviews</h3>
            {reviews.length > 0 ? (
              <div className="space-y-4 max-h-[250px] overflow-y-auto pr-2">
                {reviews.map((review) => {
                  const isUserReview = review.userID?._id === userData._id;
                  return (
                    <div
                      key={review._id}
                      className={`border-b border-base-300 pb-2 ${
                        isUserReview ? 'bg-base-200 rounded-md px-2' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{review.userID?.name || 'User'}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-yellow-500 flex items-center gap-1 text-sm">
                            <AiFillStar />
                            {review.rating}
                          </span>
                          {isUserReview && (
                            <>
                              <button
                                onClick={() => {
                                  setNewRating(review.rating);
                                  setNewComment(review.comment);
                                }}
                                className="btn btn-xs btn-outline btn-info"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteReview(review._id)}
                                className="btn btn-xs btn-outline btn-error"
                              >
                                Delete
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                      <p className="text-sm opacity-80">{review.comment}</p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm opacity-60">No reviews yet.</p>
            )}
          </div>

          {/* Review Form */}
          {isAuthUser && !isRestricted && (
            <div className="mt-8 border-t border-base-300 pt-6">
              <h4 className="text-lg font-semibold mb-2">
                {reviews.some((r) => r.userID?._id === userData._id)
                  ? 'Update Your Review'
                  : 'Write a Review'}
              </h4>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm opacity-80">Rating:</span>
                {[1, 2, 3, 4, 5].map((num) => (
                  <button
                    key={num}
                    onClick={() => setNewRating(num)}
                    className={`text-xl ${
                      newRating >= num ? 'text-yellow-500' : 'text-base-300'
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={3}
                placeholder="Write your comment..."
                className="textarea textarea-bordered w-full"
              ></textarea>
              <button
                onClick={handleSubmitReview}
                className="mt-3 btn btn-primary"
              >
                {reviews.some((r) => r.userID?._id === userData._id)
                  ? 'Update Review'
                  : 'Submit Review'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
