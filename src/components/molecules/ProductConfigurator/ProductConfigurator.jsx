// src/components/molecules/ProductConfigurator/ProductConfigurator.jsx
import React, { useState, useEffect } from 'react';
import { Search, Filter, ArrowLeft } from 'lucide-react';
import Input from '../../atoms/Input';
import CategoryFilter from '../../atoms/CategoryFilter';
import PriceTag from '../../atoms/PriceTag';
import QuantitySelector from '../../atoms/QuantitySelector';
import Button from '../../atoms/Button';
import { useCart } from '../../../context/CartContext';
import productService from '../../services/productService';

const ProductConfigurator = ({ categoryId, categoryName, onBack }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({
    compatibility: [],
    priceRange: null,
    brand: '',
    status: 'active'
  });
  const [quantities, setQuantities] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { addToCart } = useCart();

  // Filtros disponibles
  const filters = {
    compatibility: ['ADULTO', 'PEDIÁTRICO', 'NEONATAL', 'HOSPITAL', 'CLÍNICA'],
    priceRange: [
      { label: '$0 - $5,000', min: 0, max: 5000 },
      { label: '$5,000 - $15,000', min: 5000, max: 15000 },
      { label: '$15,000 - $30,000', min: 15000, max: 30000 },
      { label: '$30,000+', min: 30000, max: 999999 }
    ]
  };

  // Cargar productos cuando cambie la categoría o filtros
  useEffect(() => {
    loadProducts();
  }, [categoryId, selectedFilters, searchTerm, currentPage]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError('');

      const params = {
        page: currentPage,
        limit: 10,
        status: 'active'
      };

      // Agregar filtros a los parámetros
      if (categoryId) {
        params.category = categoryId;
      }

      if (searchTerm) {
        params.search = searchTerm;
      }

      if (selectedFilters.brand) {
        params.brand = selectedFilters.brand;
      }

      if (selectedFilters.compatibility.length > 0) {
        params.compatibility = selectedFilters.compatibility.join(',');
      }

      if (selectedFilters.priceRange) {
        params.minPrice = selectedFilters.priceRange.min;
        params.maxPrice = selectedFilters.priceRange.max;
      }

      console.log('Loading products with params:', params);

      const response = await productService.getProducts(params);

      if (response.success) {
        const mappedProducts = response.data.map(productService.mapBackendToFrontend);
        setProducts(mappedProducts);
        
        if (response.pagination) {
          setTotalPages(response.pagination.pages || 1);
        }
      } else {
        throw new Error(response.message || 'Error al cargar productos');
      }
    } catch (err) {
      console.error('Error loading products:', err);
      setError(err.message || 'Error al cargar los productos');
    } finally {
      setLoading(false);
    }
  };

  const toggleCompatibilityFilter = (compatibility) => {
    setSelectedFilters(prev => ({
      ...prev,
      compatibility: prev.compatibility.includes(compatibility)
        ? prev.compatibility.filter(c => c !== compatibility)
        : [...prev.compatibility, compatibility]
    }));
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handlePriceRangeFilter = (range) => {
    setSelectedFilters(prev => ({
      ...prev,
      priceRange: prev.priceRange === range ? null : range
    }));
    setCurrentPage(1);
  };

  const handleAddToCart = (product) => {
    const quantity = quantities[product.id] || 1;
    
    // Verificar stock si está disponible
    const stockCheck = productService.checkStockAvailability(product, quantity);
    if (!stockCheck.available) {
      alert(`Stock insuficiente. Disponible: ${stockCheck.availableQuantity}, Solicitado: ${quantity}`);
      return;
    }

    // Agregar al carrito
    addToCart({
      id: product.id,
      name: product.name,
      code: product.code,
      description: product.description,
      category: product.category,
      categoryName: product.category,
      brand: product.brand,
      basePrice: product.basePrice,
      image: productService.getDefaultImage(product),
      compatibility: product.compatibility,
      accessories: product.accessories,
      specifications: product.specifications
    }, quantity);

    alert(`${product.name} agregado al carrito`);
  };

  const updateQuantity = (productId, quantity) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: Math.max(1, quantity)
    }));
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSelectedFilters({
      compatibility: [],
      priceRange: null,
      brand: '',
      status: 'active'
    });
    setSearchTerm('');
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading && products.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando productos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
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
        <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-lg">
            {categoryName ? categoryName.substring(0, 3) : 'PRD'}
          </span>
        </div>
        <div>
          <h1 className="text-2xl font-bold">{categoryName || 'Productos'}</h1>
          <p className="text-gray-600">ACCESORIOS | CONSUMIBLES</p>
          <p className="text-sm text-gray-500">
            {products.length} productos disponibles
          </p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <div className="text-red-500">⚠️</div>
            <div>
              <p className="text-red-800 font-medium">Error al cargar productos</p>
              <p className="text-red-700">{error}</p>
              <Button 
                onClick={loadProducts} 
                variant="secondary" 
                className="mt-2"
              >
                Reintentar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <Input
          placeholder="Buscar productos por nombre, código o descripción..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="pl-10"
        />
      </div>

      {/* Filters */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-medium">Filtros:</h3>
          <Button variant="ghost" onClick={clearFilters}>
            Limpiar Filtros
          </Button>
        </div>

        <div>
          <h4 className="font-medium mb-2">Compatibilidad:</h4>
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
          <h4 className="font-medium mb-2">Rango de Precio:</h4>
          <div className="flex flex-wrap gap-2">
            {filters.priceRange.map((range, index) => (
              <CategoryFilter
                key={index}
                label={range.label}
                active={selectedFilters.priceRange === range}
                onClick={() => handlePriceRangeFilter(range)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Products List */}
      <div className="space-y-4">
        {loading && (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        )}

        {products.map(product => (
          <div key={product.id} className="bg-white rounded-lg border p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                <img 
                  src={productService.getDefaultImage(product)}
                  alt={product.name}
                  className="w-16 h-16 object-contain"
                />
              </div>
              
              <div className="flex-1">
                <h4 className="font-medium text-gray-800">{product.name}</h4>
                <p className="text-sm text-gray-500">Código: {product.code}</p>
                <p className="text-sm text-gray-600 mt-1">{product.description}</p>
                {product.brand && (
                  <p className="text-sm text-gray-500 mt-1">Marca: {product.brand}</p>
                )}
                
                {/* Compatibility badges */}
                {product.compatibility && product.compatibility.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {product.compatibility.map(comp => (
                      <span key={comp} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {comp}
                      </span>
                    ))}
                  </div>
                )}

                {/* Stock info */}
                {product.stock && (
                  <div className="mt-2">
                    {product.stock.isInStock ? (
                      <span className="text-xs text-green-600">
                        ✅ En stock ({product.stock.quantity} disponibles)
                      </span>
                    ) : (
                      <span className="text-xs text-red-600">
                        ❌ Sin stock
                      </span>
                    )}
                    {product.stock.isLowStock && product.stock.isInStock && (
                      <span className="text-xs text-orange-600 ml-2">
                        ⚠️ Stock bajo
                      </span>
                    )}
                  </div>
                )}
              </div>
              
              <div className="text-right space-y-3">
                <PriceTag price={product.basePrice} className="text-lg" />
                <QuantitySelector
                  quantity={quantities[product.id] || 1}
                  onDecrease={() => updateQuantity(product.id, (quantities[product.id] || 1) - 1)}
                  onIncrease={() => updateQuantity(product.id, (quantities[product.id] || 1) + 1)}
                  min={1}
                  max={product.stock?.quantity || 99}
                />
                <Button
                  onClick={() => handleAddToCart(product)}
                  className="w-full"
                  disabled={!product.stock?.isInStock}
                >
                  {product.stock?.isInStock ? 'Agregar' : 'Sin Stock'}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* No results */}
      {!loading && products.length === 0 && !error && (
        <div className="text-center py-12 text-gray-500">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-lg font-semibold mb-2">No se encontraron productos</h3>
          <p>Intenta cambiar los filtros o términos de búsqueda</p>
          <Button onClick={clearFilters} className="mt-4">
            Limpiar Filtros
          </Button>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center space-x-2 mt-6">
          <Button
            variant="secondary"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Anterior
          </Button>
          
          {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
            let pageNum;
            if (totalPages <= 7) {
              pageNum = i + 1;
            } else if (currentPage <= 4) {
              pageNum = i + 1;
            } else if (currentPage >= totalPages - 3) {
              pageNum = totalPages - 6 + i;
            } else {
              pageNum = currentPage - 3 + i;
            }

            return (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={`w-10 h-10 rounded-full ${
                  pageNum === currentPage 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                } transition-colors`}
              >
                {pageNum}
              </button>
            );
          })}
          
          <Button
            variant="secondary"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Siguiente
          </Button>
        </div>
      )}

      {/* Loading indicator for pagination */}
      {loading && products.length > 0 && (
        <div className="text-center py-4">
          <p className="text-gray-600">Cargando más productos...</p>
        </div>
      )}
    </div>
  );
};

export default ProductConfigurator;