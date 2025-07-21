// src/components/molecules/ProductGrid/ProductGrid.jsx
import React, { useState, useEffect } from 'react';
import ProductCard from '../../atoms/ProductCard';
import productService from '../../services/productService';

const ProductGrid = ({ onCategorySelect }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await productService.getCategories();
      
      if (response.success) {
        // Mapear categorías del backend al formato del frontend
        const mappedCategories = response.data
          .filter(cat => cat.isActive) // Solo categorías activas
          .map(category => ({
            id: category.id,
            name: category.name,
            description: category.description,
            image: category.imageUrl || `/api/placeholder/150/150`,
            productCount: category.productCount || 0,
            slug: category.slug
          }));
        
        setCategories(mappedCategories);
      } else {
        throw new Error(response.message || 'Error al cargar categorías');
      }
    } catch (err) {
      console.error('Error loading categories:', err);
      setError(err.message || 'Error al cargar las categorías');
      
      // Fallback a categorías estáticas si falla la API
      setCategories([
        {
          id: '1',
          name: 'XPREZZON',
          description: 'Monitores de signos vitales',
          image: '/api/placeholder/150/150',
          productCount: 0
        },
        {
          id: '2', 
          name: 'CUBE',
          description: 'Sistemas de monitoreo',
          image: '/api/placeholder/150/150',
          productCount: 0
        },
        {
          id: '3',
          name: 'CSU',
          description: 'Unidades de control',
          image: '/api/placeholder/150/150',
          productCount: 0
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white rounded-xl shadow-lg p-6 animate-pulse">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-24 h-24 bg-gray-200 rounded-lg"></div>
              <div className="text-center space-y-2">
                <div className="h-6 bg-gray-200 rounded w-24"></div>
                <div className="h-4 bg-gray-200 rounded w-32"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 text-6xl mb-4">⚠️</div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Error al cargar categorías</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={loadCategories}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">📦</div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">No hay categorías disponibles</h3>
        <p className="text-gray-600">Las categorías de productos aparecerán aquí cuando estén configuradas.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {categories.map(category => (
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