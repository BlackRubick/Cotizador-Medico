import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import Input from '../../atoms/Input';
import CategoryFilter from '../../atoms/CategoryFilter';
import PriceTag from '../../atoms/PriceTag';
import QuantitySelector from '../../atoms/QuantitySelector';
import Button from '../../atoms/Button';
import { useCart } from '../../../context/CartContext';

const ProductConfigurator = ({ products, categoryName }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({
    compatibility: [],
    priceRange: null
  });
  const [quantities, setQuantities] = useState({});
  const { addToCart } = useCart();

  // Filtros básicos
  const filters = {
    compatibility: ['ADULTO', 'PEDIÁTRICO', 'NEONATAL', 'HOSPITAL', 'CLÍNICA'],
    priceRange: [
      { label: '$0 - $5,000', min: 0, max: 5000 },
      { label: '$5,000 - $15,000', min: 5000, max: 15000 },
      { label: '$15,000 - $30,000', min: 15000, max: 30000 },
      { label: '$30,000+', min: 30000, max: 999999 }
    ]
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.code.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCompatibility = selectedFilters.compatibility.length === 0 ||
                                selectedFilters.compatibility.some(comp => 
                                  product.compatibility.includes(comp));
    
    const matchesPrice = !selectedFilters.priceRange ||
                        (product.basePrice >= selectedFilters.priceRange.min &&
                         product.basePrice <= selectedFilters.priceRange.max);
    
    return matchesSearch && matchesCompatibility && matchesPrice;
  });

  const toggleCompatibilityFilter = (compatibility) => {
    setSelectedFilters(prev => ({
      ...prev,
      compatibility: prev.compatibility.includes(compatibility)
        ? prev.compatibility.filter(c => c !== compatibility)
        : [...prev.compatibility, compatibility]
    }));
  };

  const handleAddToCart = (product) => {
    const quantity = quantities[product.id] || 1;
    addToCart(product, quantity);
    alert(`${product.name} agregado al carrito`);
  };

  const updateQuantity = (productId, quantity) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: quantity
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-lg">{categoryName}</span>
        </div>
        <div>
          <h1 className="text-2xl font-bold">{categoryName}</h1>
          <p className="text-gray-600">ACCESORIOS | CONSUMIBLES</p>
          <p className="text-sm text-gray-500">
            ADULTO | PEDIATRICO | NEONATAL
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <Input
          placeholder="Buscar productos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Filters */}
      <div className="space-y-4">
        <div>
          <h3 className="font-medium mb-2">Compatibilidad:</h3>
          <div className="flex flex-wrap gap-2">
            {filters.compatibility.map(comp => (
              <CategoryFilter
                key={comp}
                label={comp}
                active={selectedFilters.compatibility.includes(comp)}
                onClick={() => toggleCompatibilityFilter(comp)}
              />
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-medium mb-2">Rango de Precio:</h3>
          <div className="flex flex-wrap gap-2">
            {filters.priceRange.map((range, index) => (
              <CategoryFilter
                key={index}
                label={range.label}
                active={selectedFilters.priceRange === range}
                onClick={() => setSelectedFilters(prev => ({
                  ...prev,
                  priceRange: prev.priceRange === range ? null : range
                }))}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Products List */}
      <div className="space-y-4">
        {filteredProducts.map(product => (
          <div key={product.id} className="bg-white rounded-lg border p-4">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-16 h-16 object-contain"
                  onError={(e) => {
                    e.target.src = `data:image/svg+xml;base64,${btoa(`
                      <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="64" height="64" fill="#E5E7EB"/>
                        <text x="32" y="32" text-anchor="middle" dominant-baseline="middle" fill="#9CA3AF" font-size="10">IMG</text>
                      </svg>
                    `)}`;
                  }}
                />
              </div>
              
              <div className="flex-1">
                <h4 className="font-medium text-gray-800">{product.name}</h4>
                <p className="text-sm text-gray-500">{product.code}</p>
                <p className="text-sm text-gray-600 mt-1">{product.description}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {product.compatibility.map(comp => (
                    <span key={comp} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {comp}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="text-right space-y-3">
                <PriceTag price={product.basePrice} className="text-lg" />
                <QuantitySelector
                  quantity={quantities[product.id] || 1}
                  onDecrease={() => updateQuantity(product.id, Math.max(1, (quantities[product.id] || 1) - 1))}
                  onIncrease={() => updateQuantity(product.id, (quantities[product.id] || 1) + 1)}
                />
                <Button
                  onClick={() => handleAddToCart(product)}
                  className="w-full"
                >
                  Agregar
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No se encontraron productos que coincidan con los filtros</p>
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-center space-x-2 mt-6">
        {[1, 2, 3, 4, 5, 6, 7].map(page => (
          <button
            key={page}
            className={`w-8 h-8 rounded-full ${
              page === 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            } transition-colors`}
          >
            {page}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductConfigurator;
