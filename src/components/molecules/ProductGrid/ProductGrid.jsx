import React, { useState, useEffect } from 'react';
import ProductCard from '../../atoms/ProductCard';
import productService from '../../../services/productService';
import { apiRequest } from '../../config/api';

const ProductGrid = ({ onCategorySelect, forceReload }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadCategories();
  }, []);

  // Recargar cuando cambie forceReload (cuando se suba un Excel exitosamente)
  useEffect(() => {
    if (forceReload > 0) {
      console.log('🔄 Forzando recarga de categorías desde API...');
      loadCategories();
    }
  }, [forceReload]);

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError('');

      console.log('🔄 Cargando categorías desde la API...');
      
      // Cargar categorías desde la API
      const response = await apiRequest('/categories', {
        method: 'GET'
      });
      
      console.log('📦 Categorías desde API:', response);
      
      // ⭐ CORRECCIÓN: Usar response.data
      if (response && response.data && Array.isArray(response.data) && response.data.length > 0) {
        // Cargar también los productos para obtener el conteo real por categoría
        console.log('🔍 Cargando conteo de productos por categoría...');
        
        const categoriesWithProducts = await Promise.all(
          response.data.map(async (category) => {
            try {
              // ⭐ CORRECCIÓN: Usar 'category' con el nombre en lugar de 'categoryId'
              const productsResponse = await apiRequest(`/products?category=${encodeURIComponent(category.name)}&limit=1`, {
                method: 'GET'
              });
              
              const productCount = productsResponse?.pagination?.total || 0;
              console.log(`📊 Categoría ${category.name}: ${productCount} productos`);
              
              return {
                id: category.id.toString(),
                name: category.name,
                description: category.description || `Productos de ${category.name}`,
                image: '/api/placeholder/150/150',
                productCount: productCount,
                isActive: category.isActive !== false
              };
            } catch (productError) {
              console.warn(`⚠️ Error cargando productos para ${category.name}:`, productError);
              return {
                id: category.id.toString(),
                name: category.name,
                description: category.description || `Productos de ${category.name}`,
                image: '/api/placeholder/150/150',
                productCount: 0,
                isActive: category.isActive !== false
              };
            }
          })
        );
        // Agregar la categoría especial 'Todos' al inicio
        const totalProductsCount = categoriesWithProducts.reduce((acc, cat) => acc + (cat.productCount || 0), 0);
        const allCategory = {
          id: 'todos',
          name: 'Todos',
          description: 'Todos los productos de todas las categorías',
          image: '/api/placeholder/150/150',
          productCount: totalProductsCount,
          isActive: true
        };
        setCategories([allCategory, ...categoriesWithProducts]);
        return; 
      }
      
      console.log('⚠️ API devolvió datos vacíos o inválidos');
      throw new Error('API devolvió datos vacíos');
      
    } catch (err) {
      console.warn('⚠️ Error al cargar desde API:', err.message);
      console.log('🔄 Intentando cargar desde productService local...');
      
      // Fallback: intentar cargar desde productService local
      try {
        const localCategories = productService.getCategories();
        
        if (localCategories && localCategories.length > 0) {
          const categoriesWithCount = localCategories.map(category => {
            const products = productService.getProductsByCategory(category.id);
            return {
              ...category,
              productCount: products.length
            };
          });
          
          console.log('📦 Categorías locales cargadas:', categoriesWithCount);
          setCategories(categoriesWithCount);
          setError('Conectando con API... Mostrando categorías locales.');
        } else {
          throw new Error('No hay categorías disponibles');
        }
      } catch (fallbackErr) {
        console.error('❌ Error en fallback:', fallbackErr);
        setError('No se pudieron cargar las categorías. Verifica la conexión con la API.');
        setCategories([]);
      }
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
      <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <div className="text-gray-400 text-6xl mb-4">📦</div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">No hay categorías disponibles</h3>
        <p className="text-gray-600 mb-4">
          Carga un archivo Excel con productos para crear categorías automáticamente.
        </p>
        <button
          onClick={loadCategories}
          className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
        >
          Actualizar
        </button>
        
        {/* Botón de debug para diagnosticar */}
        <button
          onClick={() => {
            console.log('🔍 Debug - categorías actuales:', categories);
            console.log('🔍 Debug - error actual:', error);
            console.log('🔍 Debug - loading:', loading);
          }}
          className="mt-4 bg-gray-600 text-white px-4 py-2 rounded text-sm"
        >
          Debug Info
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-600 text-center">
        Mostrando {categories.length} categorías
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map(category => {
          console.log('🔍 Renderizando tarjeta para:', category.name, category);
          return (
            <div key={category.id} className="bg-white p-6 rounded-lg shadow-md border">
              <h3 className="text-lg font-semibold">{category.name}</h3>
              <p className="text-gray-600">{category.description}</p>
              <p className="text-blue-600 font-medium">{category.productCount} productos</p>
              <button 
                onClick={() => onCategorySelect(category)}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Ver productos
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductGrid;