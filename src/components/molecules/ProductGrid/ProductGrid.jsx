import React from 'react';
import ProductCard from '../../atoms/ProductCard';
import { productCategories } from '../../../data/products/productData';

const ProductGrid = ({ onCategorySelect }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {productCategories.map(category => (
        <ProductCard
          key={category.id}
          category={category}
          onClick={() => onCategorySelect(category)}
        />
      ))}
    </div>
  );
};

export default ProductGrid;
