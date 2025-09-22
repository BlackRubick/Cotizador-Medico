import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProductConfigurator from '../../molecules/ProductConfigurator';
import { apiRequest } from '../../config/api';

const QuoteConfigPage = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [categoryName, setCategoryName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategoryName();
  }, [categoryId]);

  const loadCategoryName = async () => {
    try {
      console.log('🔄 Cargando nombre de categoría para ID:', categoryId);
      
      // Intentar cargar desde la API
      const response = await apiRequest('/categories', { method: 'GET' });
      
      // ⭐ CORRECCIÓN: Usar response.data para acceder a las categorías
      if (response && response.data && Array.isArray(response.data)) {
        const category = response.data.find(cat => cat.id.toString() === categoryId);
        if (category) {
          console.log('✅ Categoría encontrada en API:', category.name);
          setCategoryName(category.name);
          setLoading(false);
          return;
        }
      }
      
      // Fallback a nombres hardcodeados si no se encuentra en API
      console.log('⚠️ Usando fallback para categoría:', categoryId);
      const fallbackName = getFallbackCategoryName(categoryId);
      setCategoryName(fallbackName);
      
    } catch (error) {
      console.warn('⚠️ Error al cargar categoría desde API:', error);
      const fallbackName = getFallbackCategoryName(categoryId);
      setCategoryName(fallbackName);
    } finally {
      setLoading(false);
    }
  };

  const getFallbackCategoryName = (id) => {
    const categoryNames = {
      '1': 'Accesorio',
      '2': 'Consumible', 
      '3': 'Equipo',
      '4': 'Refaccion',
      'accesorio': 'Accesorio',
      'consumible': 'Consumible',
      'equipo': 'Equipo',
      'refaccion': 'Refaccion'
    };
    
    return categoryNames[id] || id.toUpperCase().replace('-', ' ');
  };

  const handleBack = () => {
    navigate('/cotizar');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Cargando categoría...</div>
      </div>
    );
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