#!/bin/bash

# Solución rápida para ProductCard faltante
echo "🔧 Creando ProductCard faltante..."

# Crear la carpeta que falta
mkdir -p src/components/atoms/ProductCard

# Crear ProductCard
cat > src/components/atoms/ProductCard/ProductCard.jsx << 'EOF'
import React from 'react';

const ProductCard = ({ category, onClick, className = '' }) => {
  return (
    <div 
      onClick={onClick}
      className={`bg-white rounded-xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-shadow duration-200 ${className}`}
    >
      <div className="flex flex-col items-center space-y-4">
        <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center">
          <img 
            src={category.image} 
            alt={category.name}
            className="w-16 h-16 object-contain"
            onError={(e) => {
              e.target.src = `data:image/svg+xml;base64,${btoa(`
                <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="64" height="64" fill="#E5E7EB"/>
                  <text x="32" y="32" text-anchor="middle" dominant-baseline="middle" fill="#9CA3AF" font-size="12">${category.name}</text>
                </svg>
              `)}`;
            }}
          />
        </div>
        <div className="text-center">
          <h3 className="font-bold text-lg text-gray-800">{category.name}</h3>
          <p className="text-sm text-gray-600">{category.description}</p>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
EOF

echo "export { default } from './ProductCard';" > src/components/atoms/ProductCard/index.js

echo "✅ ProductCard creado!"
echo "🚀 Ahora ejecuta: npm run dev"
