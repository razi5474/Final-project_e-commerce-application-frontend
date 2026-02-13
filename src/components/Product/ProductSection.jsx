import React from 'react';
import { Link } from 'react-router-dom';
import useFetch from '../../hooks/useFetch';
import ProductCard from './ProductCard';
import { Loader } from 'lucide-react';

const ProductSection = () => {
  const { data: products, loading, error } = useFetch('/product/all?limit=8'); // Limit to 8 for featured section

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <section className="py-16 px-4 md:px-10 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-base-content">Trending Products</h2>
          <p className="text-base-content/60 mt-2">Top picks from our collection</p>
        </div>
        <Link to="/products" className="btn btn-outline btn-primary">View All Products</Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {products?.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default ProductSection;
