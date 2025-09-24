import React from 'react';
import ProductCatalog from '../../organisms/ProductCatalog';
import { useNavigate } from 'react-router-dom';

const CatalogPage = () => {
  const navigate = useNavigate();

  const handleCategorySelect = (category) => {
    navigate(`/cotizar/categoria/${category.id}`);
  };

  return (
    <ProductCatalog onCategorySelect={handleCategorySelect} />
  );
};

export default CatalogPage;
