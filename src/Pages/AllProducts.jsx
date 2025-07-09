import { useEffect, useState } from "react";
import { api } from "../config/axiosInstance";
import ProductCard from "../components/Product/ProductCard";
import Loader from "../components/common/Loader";
import BackButton from "../components/common/BackButton";

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const { data } = await api.get("/product/all?limit=1000"); // 👈 make sure this endpoint exists
        setProducts(data.products);
      } catch (error) {
        console.error("Failed to fetch all products", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllProducts();
  }, []);

  if (loading) return <Loader message="Loading all products..." />;

  return (
    <div className="w-full py-6 px-4 md:px-10 font-sans">
      <BackButton className="mb-6" />

      <h1 className="text-3xl md:text-4xl font-bold text-primary mb-8 text-left">
        All Products
      </h1>

      {products.length === 0 ? (
        <p className="text-gray-500">No products available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default AllProducts;
