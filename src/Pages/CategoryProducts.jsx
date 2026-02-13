import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../config/axiosInstance";
import ProductCard from "../components/Product/ProductCard";
import Loader from "../components/common/Loader";
import { motion } from "framer-motion";
import { ShoppingBag, ChevronRight, Filter, Grid, X } from "lucide-react";
import toast from "react-hot-toast";

const CategoryProducts = () => {
  const { categoryId } = useParams();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(true);
  const [showFilter, setShowFilter] = useState(false);
  const [priceRange, setPriceRange] = useState(500000);
  const [sort, setSort] = useState({ field: 'createdAt', order: 'desc' });

  useEffect(() => {
    const fetchCategoryData = async () => {
      setLoading(true);
      try {
        // Fetch category name if not already set
        if (!categoryName) {
          const { data: catRes } = await api.get(`/category/${categoryId}`);
          setCategoryName(catRes.catagory.name);
        }

        const { data: prodRes } = await api.get(`/product/category/${categoryId}?limit=1000&sort=${sort.field}&order=${sort.order}`);
        setProducts(prodRes.products);
        setFilteredProducts(prodRes.products);
      } catch (error) {
        console.error("Failed to fetch category data:", error);
        toast.error("Failed to load category products");
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryData();
  }, [categoryId, sort]);

  useEffect(() => {
    const filtered = products.filter(p => p.price <= priceRange);
    setFilteredProducts(filtered);
  }, [priceRange, products]);

  const handleSortChange = (e) => {
    const value = e.target.value;
    switch (value) {
      case 'price-low': setSort({ field: 'price', order: 'asc' }); break;
      case 'price-high': setSort({ field: 'price', order: 'desc' }); break;
      case 'newest': setSort({ field: 'createdAt', order: 'desc' }); break;
      case 'title': setSort({ field: 'title', order: 'asc' }); break;
      default: setSort({ field: 'createdAt', order: 'desc' });
    }
  };

  if (loading) return <Loader message={`Fetching the best ${categoryName || 'items'} for you...`} />;

  return (
    <div className="min-h-screen bg-base-100">
      {/* Header Section */}
      <section className="bg-primary/5 py-12 md:py-20 border-b border-base-200">
        <div className="container mx-auto px-4 md:px-10">
          <div className="flex items-center gap-2 text-sm text-base-content/60 mb-6 font-medium">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <Link to="/products" className="hover:text-primary transition-colors">Products</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-primary">{categoryName}</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <motion.h1
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-4xl md:text-5xl font-extrabold text-base-content mb-4"
              >
                {categoryName} <span className="text-primary">Collection</span>
              </motion.h1>
              <p className="text-lg text-base-content/60 max-w-xl">
                Discover our handpicked selection of {categoryName} items, designed for quality and style.
              </p>
            </div>

            <div className="flex gap-3">
              <div className="badge badge-lg badge-primary gap-2 p-4 h-auto font-bold shadow-md shadow-primary/20">
                <ShoppingBag className="w-4 h-4" />
                {products.length} Items found
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto py-12 px-4 md:px-10">
        {/* Toolbar */}
        <div className="flex flex-col gap-6 mb-10 pb-6 border-b border-base-200">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <button
                className={`btn ${showFilter ? 'btn-primary' : 'btn-ghost'} gap-2 font-bold bg-base-200/50`}
                onClick={() => setShowFilter(!showFilter)}
              >
                <Filter className="w-4 h-4" /> Filter
              </button>
              <div className="hidden sm:flex items-center gap-2 bg-base-200/50 p-1 rounded-lg">
                <button className="btn btn-sm btn-square btn-primary"><Grid className="w-4 h-4" /></button>
                <button className="btn btn-sm btn-square btn-ghost opacity-50"><Filter className="w-4 h-4 rotate-90" /></button>
              </div>
            </div>

            <select
              className="select select-bordered select-sm md:select-md w-full max-w-[170px] md:max-w-xs bg-base-200/50 font-medium"
              onChange={handleSortChange}
              defaultValue="newest"
            >
              <option value="featured" disabled>Sort By</option>
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="title">Product Name</option>
            </select>
          </div>

          {/* Filter Bar */}
          {showFilter && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              className="bg-base-200/30 p-6 rounded-2xl border border-base-200"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg">Filter Products</h3>
                <button onClick={() => setShowFilter(false)}><X className="w-5 h-5 opacity-50" /></button>
              </div>
              <div className="max-w-md">
                <label className="label font-medium">Max Price: <span className="text-primary font-bold">₹{priceRange.toLocaleString()}</span></label>
                <input
                  type="range"
                  min="0"
                  max="500000"
                  value={priceRange}
                  onChange={(e) => setPriceRange(parseInt(e.target.value))}
                  className="range range-primary range-sm"
                />
                <div className="flex justify-between text-xs px-2 mt-2 opacity-50 font-bold">
                  <span>₹0</span>
                  <span>₹5L+</span>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="bg-base-200 p-8 rounded-full mb-6">
              <ShoppingBag className="w-16 h-16 text-base-content/20" />
            </div>
            <h2 className="text-2xl font-bold mb-2">No items here yet</h2>
            <p className="text-base-content/60 mb-8">Try adjusting your filters or check back soon!</p>
            <button
              className="btn btn-primary rounded-full px-8"
              onClick={() => { setPriceRange(500000); setShowFilter(false); }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          >
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CategoryProducts;
