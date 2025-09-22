// src/components/molecules/ProductConfigurator/ProductConfigurator.jsx
import React, { useState, useEffect } from 'react';
import { Search, Filter, ArrowLeft } from 'lucide-react';
import Input from '../../atoms/Input';
import CategoryFilter from '../../atoms/CategoryFilter';
import PriceTag from '../../atoms/PriceTag';
import QuantitySelector from '../../atoms/QuantitySelector';
import Button from '../../atoms/Button';
import ProductImage from '../../atoms/ProductImage';
import { useCart } from '../../../context/CartContext';
import productService from '../../../services/productService';
import { apiRequest } from '../../config/api';

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
  }, [categoryId, categoryName, selectedFilters, searchTerm, currentPage]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError('');

      console.log('🔄 Loading products for category:', categoryId, 'categoryName:', categoryName);
      
      let products = [];
      
      if (categoryName) {
        // ⭐ USAR LA API con el parámetro 'category' y el nombre de la categoría
        console.log('🌐 Cargando productos desde API para categoría:', categoryName);
        
        const response = await apiRequest(`/products?category=${encodeURIComponent(categoryName)}&limit=50`, {
          method: 'GET'
        });
        
        console.log('📦 Respuesta de productos desde API:', response);
        
        if (response && response.data && Array.isArray(response.data)) {
          products = response.data.map(product => {
            return {
              id: product.id,
              name: product.item || product.name || 'Producto sin nombre',
              code: product.code,
              description: product.para_descripcion || product.description || 'Sin descripción',
              category: product.category?.name || categoryName,
              brand: product.proveedor || product.brand,
              basePrice: product.precio_venta_paquete || product.precioUnitario || product.basePrice || 0,
              // Mapear campos específicos de tu API
              servicio: product.servicio,
              especialidad: product.especialidad,
              clasificacion: product.clasificacion,
              proveedor: product.proveedor,
              cantidadPaquete: product.cantidadPaquete || 1,
              costo: product.costo || 0,
              costoUnitario: product.costoUnitario || 0,
              precioVentaPaquete: product.precioVentaPaquete || 0,
              precioUnitario: product.precioUnitario || 0,
              // Campos adicionales para compatibilidad
              compatibility: product.compatibility || [product.especialidad].filter(Boolean),
              stock: {
                isInStock: true, // Por defecto asumimos que hay stock
                quantity: 99 // Cantidad por defecto
              }
            };
          });
          
          console.log('✅ Productos formateados:', products.length, 'productos');
        } else {
          console.warn('⚠️ No se encontraron productos en la respuesta de la API');
        }
      } else {
        console.log('🔄 Fallback: No hay categoryName, intentando con productService local');
        // Fallback al servicio local
        if (categoryId) {
          products = productService.getProductsByCategory(categoryId);
        } else {
          products = productService.getAllProducts();
        }
      }

      // Aplicar filtro de búsqueda directamente a los productos de la API
      if (searchTerm) {
        const searchTermLower = searchTerm.toLowerCase();
        products = products.filter(product => 
          product.name.toLowerCase().includes(searchTermLower) ||
          product.code.toLowerCase().includes(searchTermLower) ||
          product.description.toLowerCase().includes(searchTermLower) ||
          (product.brand && product.brand.toLowerCase().includes(searchTermLower)) ||
          (product.servicio && product.servicio.toLowerCase().includes(searchTermLower)) ||
          (product.especialidad && product.especialidad.toLowerCase().includes(searchTermLower))
        );
      }

      // Aplicar filtros
      let filteredProducts = products;

      // Filtrar por compatibilidad
      if (selectedFilters.compatibility.length > 0) {
        filteredProducts = filteredProducts.filter(product =>
          product.compatibility && product.compatibility.some(comp =>
            selectedFilters.compatibility.includes(comp)
          )
        );
      }

      // Filtrar por rango de precio
      if (selectedFilters.priceRange) {
        filteredProducts = filteredProducts.filter(product =>
          product.basePrice >= selectedFilters.priceRange.min &&
          product.basePrice <= selectedFilters.priceRange.max
        );
      }

      // Filtrar por marca
      if (selectedFilters.brand) {
        filteredProducts = filteredProducts.filter(product =>
          product.marca && product.marca.toLowerCase().includes(selectedFilters.brand.toLowerCase())
        );
      }

      // Paginación simple
      const itemsPerPage = 10;
      const totalItems = filteredProducts.length;
      const totalPages = Math.ceil(totalItems / itemsPerPage);
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

      console.log('Final filtered products:', paginatedProducts.length, 'of', totalItems);

      setProducts(paginatedProducts);
      setTotalPages(totalPages);
      
    } catch (err) {
      console.error('Error loading products:', err);
      setError(err.message || 'Error al cargar los productos');
    } finally {
      setLoading(false);
    }
  };  const toggleCompatibilityFilter = (compatibility) => {
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
    
    // Verificar stock si está disponible (simplificado para productos de API)
    if (!product.stock?.isInStock) {
      alert('Producto sin stock disponible');
      return;
    }
    
    if (product.stock?.quantity && quantity > product.stock.quantity) {
      alert(`Stock insuficiente. Disponible: ${product.stock.quantity}, Solicitado: ${quantity}`);
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
      image: `/images/${product.code}.jpg`, // URL por defecto para el carrito
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
    <div className="min-h-screen bg-gray-50">
      {/* Header mejorado con gradiente */}
      <div className="bg-gradient-to-r from-slate-700 to-slate-800 text-white shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {onBack && (
                <Button 
                  variant="ghost" 
                  onClick={onBack}
                  className="flex items-center space-x-2 text-white hover:bg-white/10 border-white/20"
                >
                  <ArrowLeft size={20} />
                  <span>Volver</span>
                </Button>
              )}
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30">
                  <span className="text-white font-bold text-lg">
                    {categoryName ? categoryName.substring(0, 3).toUpperCase() : 'PRD'}
                  </span>
                </div>
                <div>
                  <h1 className="text-3xl font-extrabold tracking-tight">{categoryName || 'Productos'}</h1>
                  <div className="flex items-center space-x-4 mt-2">

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 rounded-lg p-6 shadow-sm">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-red-500 text-lg">⚠️</span>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-red-800 font-semibold text-lg">Error al cargar productos</h3>
                <p className="text-red-700 mt-1">{error}</p>
                <Button 
                  onClick={loadProducts} 
                  variant="secondary" 
                  className="mt-4 bg-red-600 hover:bg-red-700 text-white border-red-600"
                >
                  Reintentar
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Search mejorado */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <Input
              placeholder="Buscar productos por nombre, código, descripción o marca..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-12 pr-4 py-3 text-base border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Filters mejorados */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Filter className="mr-2" size={20} />
              Filtros de búsqueda
            </h3>
            <Button 
              variant="ghost" 
              onClick={clearFilters}
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            >
              Limpiar Filtros
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                Compatibilidad
              </h4>
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
              <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Rango de Precio
              </h4>
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
        </div>

        {/* Products List mejorada */}
        <div className="space-y-4">
          {loading && (
            <div className="flex justify-center py-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Cargando productos...</p>
              </div>
            </div>
          )}

          {products.map(product => (
            <div key={product.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg hover:border-blue-200 transition-all duration-200">
              <div className="flex items-center space-x-6">
                <ProductImage 
                  productCode={product.code}
                  productName={product.name}
                  containerClassName="w-24 h-24 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex items-center justify-center border-2 border-gray-200"
                  className="w-20 h-20 object-contain"
                />
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-900 mb-1">{product.name}</h4>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
                        <span className="inline-flex items-center px-2 py-1 rounded-md bg-gray-100 text-gray-700 font-mono text-xs">
                          #{product.code}
                        </span>
                        {product.brand && (
                          <span className="inline-flex items-center px-2 py-1 rounded-md bg-blue-50 text-blue-700 text-xs">
                            {product.brand}
                          </span>
                        )}
                      </div>
                      <p className="text-gray-700 text-sm leading-relaxed">{product.description}</p>
                      
                      {/* Compatibility badges mejorados */}
                      {product.compatibility && product.compatibility.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-3">
                          {product.compatibility.map(comp => (
                            <span key={comp} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                              {comp}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Stock info mejorado 
                      {product.stock && (
                        <div className="mt-3">
                          {product.stock.isInStock ? (
                            <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                              En stock ({product.stock.quantity} disponibles)
                            </div>
                          ) : (
                            <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                              <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                              Sin stock
                            </div>
                          )}
                          {product.stock.isLowStock && product.stock.isInStock && (
                            <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 border border-orange-200 ml-2">
                              ⚠️ Stock bajo
                            </div>
                          )}
                        </div>
                      )}*/}
                    </div>
                    
                    <div className="flex flex-col items-end space-y-4 ml-6">
                      <div className="text-right">
                        <PriceTag price={product.basePrice} className="text-2xl font-bold" />
                        <p className="text-xs text-gray-500 mt-1">Precio por unidad</p>
                      </div>
                      
                      <div className="flex flex-col items-center space-y-3">
                        <QuantitySelector
                          quantity={quantities[product.id] || 1}
                          onDecrease={() => updateQuantity(product.id, (quantities[product.id] || 1) - 1)}
                          onIncrease={() => updateQuantity(product.id, (quantities[product.id] || 1) + 1)}
                          min={1}
                          max={product.stock?.quantity || 99}
                        />
                        <Button
                          onClick={() => handleAddToCart(product)}
                          className="w-full min-w-[120px] bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium px-6 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                          disabled={!product.stock?.isInStock}
                        >
                          {product.stock?.isInStock ? ' Agregar' : ' Sin Stock'}
                        </Button>
                      </div>
                    </div>
                  </div>
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
    </div>
  );
};

export default ProductConfigurator;