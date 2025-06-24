import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../config/axiosInstance";
import ProductCard from "../components/Product/ProductCard";
import Loader from "../components/common/Loader";
import BackButton from "../components/common/BackButton";

const CategoryProducts = () => {
  const { categoryId } = useParams();
  const [products, setProducts] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        const { data: catRes } = await api.get(`/category/${categoryId}`);
        setCategoryName(catRes.catagory.name);

        const { data: prodRes } = await api.get(`/product/category/${categoryId}`);
        setProducts(prodRes.products);
      } catch (error) {
        console.error("Failed to fetch category data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryData();
  }, [categoryId]);

  if (loading) return <Loader message="Loading category products..." />;

  return (
    <div className="w-full py-6 px-4 md:px-10 font-sans">
      <BackButton className="mb-6" />
      <h1 className="text-3xl md:text-4xl font-bold text-primary mb-6 text-left">
        All types of {categoryName}
      </h1>

      {products.length === 0 ? (
        <p className="text-gray-500">No products found in this category.</p>
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

export default CategoryProducts;
