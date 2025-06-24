import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProductConfigurator from '../../molecules/ProductConfigurator';
import { products } from '../../../data/products/productData';

const QuoteConfigPage = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  
  const categoryProducts = products[categoryId] || [];
  const categoryName = categoryId?.toUpperCase() || 'PRODUCTOS';

  const handleBack = () => {
    navigate('/cotizar');
  };

  return (
    <div>
      <ProductConfigurator 
        products={categoryProducts}
        categoryName={categoryName}
        onBack={handleBack}
      />
    </div>
  );
};

export default QuoteConfigPage;
