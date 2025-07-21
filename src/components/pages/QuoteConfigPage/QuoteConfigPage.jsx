// src/components/pages/QuoteConfigPage/QuoteConfigPage.jsx
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProductConfigurator from '../../molecules/ProductConfigurator';

const QuoteConfigPage = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  
  // Obtener el nombre de la categoría desde la URL o usar el ID
  const categoryName = getCategoryName(categoryId);

  const handleBack = () => {
    navigate('/cotizar');
  };

  function getCategoryName(id) {
    // Mapeo de IDs a nombres (esto podría venir de la API en el futuro)
    const categoryNames = {
      '1': 'XPREZZON',
      '2': 'CUBE', 
      '3': 'CSU',
      'xprezzon': 'XPREZZON',
      'cube': 'CUBE',
      'csu': 'CSU'
    };
    
    return categoryNames[id] || `Categoría ${id}`;
  }

  return (
    <div>
      <ProductConfigurator 
        categoryId={categoryId}
        categoryName={categoryName}
        onBack={handleBack}
      />
    </div>
  );
};

export default QuoteConfigPage;