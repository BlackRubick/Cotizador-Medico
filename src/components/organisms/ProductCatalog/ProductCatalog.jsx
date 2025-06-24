import React from 'react';
import { ArrowLeft } from 'lucide-react';
import ProductGrid from '../../molecules/ProductGrid';
import Button from '../../atoms/Button';

const ProductCatalog = ({ onCategorySelect, onBack }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        {onBack && (
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="flex items-center space-x-2"
          >
            <ArrowLeft size={20} />
            <span>Volver</span>
          </Button>
        )}
        <h1 className="text-2xl font-bold text-gray-800">Catálogo de Productos</h1>
      </div>
      
      <ProductGrid onCategorySelect={onCategorySelect} />
    </div>
  );
};

export default ProductCatalog;
