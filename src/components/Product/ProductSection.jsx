import React from 'react';
import useFetch from '../../hooks/UseFetch';
import ProductCard from './ProductCard';

const ProductSection = () => {
  const { data: products, loading, error } = useFetch('/product/all');

  if (loading) {
    return (
      <div className="text-center py-10 text-lg dark:text-white animate-pulse">
        Loading products...
      </div>
    );
  }

  return (
    <section className="py-10 px-4 sm:px-6 md:px-10 lg:px-16 bg-base-100 transition-colors duration-300">
      <h2 className="text-4xl font-extrabold mb-8 text-base-content text-center">Our Featured Products</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default ProductSection;
