import React from 'react';
import ProductCatalog from '../../organisms/ProductCatalog';
import PageDebug from '../../PageDebug';
import { useNavigate } from 'react-router-dom';

const CatalogPage = () => {
  const navigate = useNavigate();

  const handleCategorySelect = (category) => {
    navigate(`/cotizar/categoria/${category.id}`);
  };

  return (
    <div>
      <PageDebug pageName="Catálogo / Nueva Cotización" />
      <ProductCatalog onCategorySelect={handleCategorySelect} />
    </div>
  );
};

export default CatalogPage;
