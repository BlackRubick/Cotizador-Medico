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

  // 🛠️ FUNCIÓN TEMPORAL: Generar precios basados en categoría hasta arreglar la importación
  const generateTemporaryPrice = (product, category) => {
    // Precios base por categoría
    const basePrices = {
      'Accesorio': 1500,
      'Consumible': 800,  
      'Equipo': 25000,
      'Refaccion': 3000
    };
    
    let basePrice = basePrices[category] || 2000;
    
    // Ajustar precio según el código del producto (simulando precios reales)
    const codeNum = parseInt(product.code.replace(/[^0-9]/g, '')) || 1000;
    const variation = (codeNum % 1000) * 0.1; // Variación basada en el código
    
    return Math.round(basePrice + variation);
  };

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
        
        // 🔍 DEBUG CRÍTICO: Verificar si ALGÚN producto tiene precio
        if (response && response.data && Array.isArray(response.data)) {
          const productsWithPrice = response.data.filter(p => 
            p.precioVentaPaquete > 0 || 
            p.precioUnitario > 0 || 
            p.finalPrice > 0 || 
            p.basePrice > 0 || 
            p.factoryPrice > 0 || 
            p.costo > 0 || 
            p.costoUnitario > 0
          );
          
          console.log(`🚨 DIAGNÓSTICO CRÍTICO: De ${response.data.length} productos, solo ${productsWithPrice.length} tienen precio > 0`);
          
          if (productsWithPrice.length === 0) {
            console.log('🚨 PROBLEMA IDENTIFICADO: NINGÚN producto en la API tiene precio. El problema está en tu base de datos/importación de Excel.');
          }
        }
        
        if (response && response.data && Array.isArray(response.data)) {
          products = response.data.map((product, index) => {
            // 🔍 DEBUG COMPLETO: Mostrar TODOS los campos del producto para encontrar el precio
            if (index === 0) { // Solo mostrar el primer producto para no saturar la consola
              console.log('🔍 DEBUGGING PRODUCTO COMPLETO - Todos los campos disponibles:');
              console.log(product);
              console.log('📋 Campos que podrían contener precio:', {
                // Precios principales
                precioVentaPaquete: product.precioVentaPaquete,
                precioUnitario: product.precioUnitario,
                finalPrice: product.finalPrice,
                basePrice: product.basePrice,
                factoryPrice: product.factoryPrice,
                // Costos
                costo: product.costo,
                costoUnitario: product.costoUnitario,
                // Otros posibles campos de precio
                precio: product.precio,
                price: product.price,
                cost: product.cost,
                unitPrice: product.unitPrice,
                salePrice: product.salePrice,
                // Campos con guión bajo
                precio_venta: product.precio_venta,
                precio_unitario: product.precio_unitario,
                precio_costo: product.precio_costo,
                // Campos específicos de tu Excel
                'Precio Venta': product['Precio Venta'],
                'Precio Unitario': product['Precio Unitario'],
                'Costo': product['Costo'],
                'Precio': product['Precio']
              });
            }
            
            // Intentar múltiples formas de obtener el precio
            let price = product.precioVentaPaquete || 
                        product.precioUnitario || 
                        product.finalPrice || 
                        product.basePrice || 
                        product.factoryPrice || 
                        product.costo || 
                        product.costoUnitario ||
                        product.precio ||
                        product.price ||
                        product.cost ||
                        product.unitPrice ||
                        product.salePrice ||
                        product.precio_venta ||
                        product.precio_unitario ||
                        product.precio_costo ||
                        product['Precio Venta'] ||
                        product['Precio Unitario'] ||
                        product['Costo'] ||
                        product['Precio'] ||
                        0;
            
            // 🛠️ SOLUCIÓN TEMPORAL: Si no hay precio, generar uno basado en categoría y código
            if (price === 0 || price === null || price === undefined) {
              price = generateTemporaryPrice(product, categoryName);
              console.log(`🛠️ PRECIO TEMPORAL ASIGNADO para ${product.code}: $${price}`);
            }
            
            // Debug individual por producto si no tiene precio
            if (price === 0) {
              console.log(`⚠️ PRODUCTO SIN PRECIO: ${product.code} - ${product.item || product.name}`, {
                todosLosCamposDePrecios: {
                  precioVentaPaquete: product.precioVentaPaquete,
                  precioUnitario: product.precioUnitario,
                  finalPrice: product.finalPrice,
                  basePrice: product.basePrice,
                  costo: product.costo,
                  costoUnitario: product.costoUnitario
                }
              });
            }
            
            return {
              id: product.id,
              name: product.item || product.name || 'Producto sin nombre',
              code: product.code,
              description: product.paraDescripcion || product.para_descripcion || product.description || 'Sin descripción',
              category: product.category?.name || categoryName,
              brand: product.proveedor || product.brand,
              basePrice: price,
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
              finalPrice: product.finalPrice || 0,
              factoryPrice: product.factoryPrice || 0,
              formattedPrice: product.formattedPrice,
              formattedUnitPrice: product.formattedUnitPrice,
              moneda: product.moneda || 'MXN',
              valorMoneda: product.valorMoneda || 1,
              impuestos: product.impuestos || 0,
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
      
      // Debug: Verificar precios en los productos finales
      const productsWithPrice = paginatedProducts.filter(p => p.basePrice > 0);
      const productsWithoutPrice = paginatedProducts.filter(p => p.basePrice === 0);
      
      console.log(`💰 Productos CON precio: ${productsWithPrice.length}/${paginatedProducts.length}`);
      console.log(`⚠️ Productos SIN precio: ${productsWithoutPrice.length}/${paginatedProducts.length}`);
      
      if (productsWithoutPrice.length > 0) {
        console.log('🔍 Productos sin precio (muestra de 3):', 
          productsWithoutPrice.slice(0, 3).map(p => ({
            code: p.code,
            name: p.name,
            allPriceFields: {
              basePrice: p.basePrice,
              finalPrice: p.finalPrice,
              precioUnitario: p.precioUnitario,
              precioVentaPaquete: p.precioVentaPaquete,
              costo: p.costo,
              costoUnitario: p.costoUnitario
            }
          }))
        );
      }

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
    
    // TEMPORAL: Permitir agregar productos sin precio para debug
    if (product.basePrice <= 0) {
      console.log(`⚠️ AGREGANDO PRODUCTO SIN PRECIO para debug: ${product.name}`, product);
      // No hacer return, continuar con el proceso
    }
    
    // Verificar stock si está disponible (simplificado para productos de API)
    if (product.stock?.isInStock === false) {
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
      {/* Header responsive mejorado */}
      <div className="bg-gradient-to-r from-slate-700 to-slate-800 text-white shadow-xl">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-2 sm:space-x-4 w-full sm:w-auto">
              {onBack && (
                <Button 
                  variant="ghost" 
                  onClick={onBack}
                  className="flex items-center space-x-1 sm:space-x-2 text-white hover:bg-white/10 border-white/20 px-2 sm:px-4 py-2"
                >
                  <ArrowLeft size={18} className="sm:w-5 sm:h-5" />
                  <span className="text-sm sm:text-base">Volver</span>
                </Button>
              )}
              <div className="flex items-center space-x-2 sm:space-x-4 flex-1 sm:flex-none">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 backdrop-blur-sm rounded-lg sm:rounded-xl flex items-center justify-center border border-white/30">
                  <span className="text-white font-bold text-sm sm:text-lg">
                    {categoryName ? categoryName.substring(0, 3).toUpperCase() : 'PRD'}
                  </span>
                </div>
                <div className="flex-1 sm:flex-none">
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight break-words">
                    {categoryName || 'Productos'}
                  </h1>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal responsive */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-4 sm:space-y-8">

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

        {/* Warning sobre precios temporales */}
        {!loading && products.length > 0 && products.some(p => p.basePrice > 2000) && (
          <div className="bg-orange-50 border-l-4 border-orange-400 rounded-lg p-6 shadow-sm">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-orange-500 text-lg">⚠️</span>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-orange-800 font-semibold text-lg">Precios Temporales Activos</h3>
                <p className="text-orange-700 mt-1">
                  Los productos están mostrando precios temporales porque no se encontraron precios en la base de datos. 
                  <strong> Necesitas reimportar tu Excel con precios en el servidor.</strong>
                </p>
                <div className="mt-3 text-sm text-orange-600">
                  <strong>Solución:</strong> Revisa que tu archivo Excel tenga precios y reimporta los productos en tu panel de administración.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Search responsive */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="relative">
            <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-10 sm:pl-12 pr-3 sm:pr-4 py-2 sm:py-3 text-sm sm:text-base border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Filters responsive */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-3 sm:gap-0">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center">
              <Filter className="mr-2" size={18} />
              Filtros
            </h3>
            <Button 
              variant="ghost" 
              onClick={clearFilters}
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 text-sm sm:text-base px-3 py-2"
            >
              Limpiar
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2 sm:mb-3 flex items-center text-sm sm:text-base">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                Compatibilidad
              </h4>
              <div className="flex flex-wrap gap-1 sm:gap-2">
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
              <h4 className="font-medium text-gray-900 mb-2 sm:mb-3 flex items-center text-sm sm:text-base">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Precio
              </h4>
              <div className="flex flex-wrap gap-1 sm:gap-2">
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
            <div key={product.id} className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-3 sm:p-6 hover:shadow-lg hover:border-blue-200 transition-all duration-200">
              {/* Layout móvil: vertical, Desktop: horizontal */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
                {/* Imagen del producto */}
                <div className="flex-shrink-0 mx-auto sm:mx-0">
                  <ProductImage 
                    productCode={product.code}
                    productName={product.name}
                    containerClassName="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg sm:rounded-xl flex items-center justify-center border-2 border-gray-200"
                    className="w-16 h-16 sm:w-20 sm:h-20 object-contain"
                  />
                </div>
                
                {/* Contenido principal */}
                <div className="flex-1 min-w-0 w-full">
                  <div className="flex flex-col space-y-4">
                    {/* Información del producto */}
                    <div className="flex-1">
                      <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{product.name}</h4>
                      
                      {/* Código y marca - móvil: vertical, desktop: horizontal */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0 text-sm text-gray-500 mb-3">
                        <span className="inline-flex items-center px-2 py-1 rounded-md bg-gray-100 text-gray-700 font-mono text-xs w-fit">
                          #{product.code}
                        </span>
                        {product.brand && (
                          <span className="inline-flex items-center px-2 py-1 rounded-md bg-blue-50 text-blue-700 text-xs w-fit">
                            {product.brand}
                          </span>
                        )}
                      </div>
                      
                      {/* Descripción */}
                      <p className="text-gray-700 text-sm leading-relaxed mb-3 line-clamp-3 sm:line-clamp-2">{product.description}</p>
                      
                      {/* Badges de compatibilidad */}
                      {product.compatibility && product.compatibility.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {product.compatibility.slice(0, 3).map(comp => (
                            <span key={comp} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                              {comp}
                            </span>
                          ))}
                          {product.compatibility.length > 3 && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                              +{product.compatibility.length - 3}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Precio y acciones - Mobile responsive */}
                      <div className="mt-auto pt-3 border-t border-gray-100">
                        {/* Precio */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
                          <div className="text-right sm:text-left mb-2 sm:mb-0">
                            <span className="text-2xl font-bold text-emerald-600">
                              ${finalPrice.toLocaleString('es-MX')}
                            </span>
                            {product.originalPrice && finalPrice < product.originalPrice && (
                              <span className="text-sm text-gray-500 line-through ml-2">
                                ${product.originalPrice.toLocaleString('es-MX')}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Botones de acción */}
                        <div className="flex flex-col sm:flex-row gap-2">
                          <button
                            onClick={() => handleViewDetails(product)}
                            className="flex-1 px-3 py-2 text-sm font-medium text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 hover:border-emerald-300 transition-colors duration-200"
                          >
                            Ver Detalles
                          </button>
                          
                          <button
                            onClick={() => addToCart(product)}
                            className="flex-1 px-3 py-2 text-sm font-medium text-white bg-emerald-600 border border-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors duration-200 flex items-center justify-center gap-2"
                          >
                            <CartIcon className="w-4 h-4" />
                            Agregar
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Mensaje cuando no hay productos */}
            {paginatedProducts.length === 0 && !isLoading && (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">🔍</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron productos</h3>
                <p className="text-gray-500">Intenta ajustar los filtros o términos de búsqueda.</p>
              </div>
            )}

            {/* Paginación responsive */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-6 border-t border-gray-200">
                <div className="text-sm text-gray-600 order-2 sm:order-1">
                  Mostrando {((currentPage - 1) * productsPerPage) + 1} - {Math.min(currentPage * productsPerPage, filteredProducts.length)} de {filteredProducts.length} productos
                </div>
                
                <div className="flex items-center gap-2 order-1 sm:order-2">
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Anterior
                  </button>
                  
                  <div className="flex items-center gap-1">
                    {getPageNumbers().map((page) => (
                      <button
                        key={page}
                        onClick={() => typeof page === 'number' && setCurrentPage(page)}
                        disabled={typeof page !== 'number'}
                        className={`px-3 py-2 text-sm font-medium rounded-lg ${
                          page === currentPage
                            ? 'bg-emerald-600 text-white'
                            : typeof page === 'number'
                            ? 'text-gray-600 bg-white border border-gray-300 hover:bg-gray-50'
                            : 'text-gray-400 cursor-default'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                  
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Siguiente
                  </button>
                </div>
              </div>
            )}

                      )}
        </div>
      </div>
    </div>
  );
};}
                    </div>
                    
                    <div className="flex flex-col items-end space-y-4 ml-6">
                      <div className="text-right">
                        <div className="space-y-2">
                          <PriceTag price={product.basePrice} className="text-2xl font-bold" />
                          <p className="text-xs text-gray-500">Precio por unidad</p>
                          {product.moneda && product.moneda !== 'MXN' && (
                            <p className="text-xs text-blue-600">Moneda: {product.moneda}</p>
                          )}
                          {/* 🔍 DEBUG: Mostrar información de precios */}
                          <div className="text-xs text-gray-400 bg-gray-50 p-2 rounded">
                            <div>Código: {product.code}</div>
                            <div className={product.basePrice > 2000 ? 'text-orange-600 font-bold' : ''}>
                              Precio final: ${product.basePrice}
                              {product.basePrice > 2000 && ' (TEMPORAL)'}
                            </div>
                            <div className="text-xs">
                              PVP: {product.precioVentaPaquete || 'null'} | 
                              PU: {product.precioUnitario || 'null'} | 
                              Final: {product.finalPrice || 'null'}
                            </div>
                          </div>
                        </div>
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
                          className={`w-full min-w-[120px] font-medium px-6 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 ${
                            product.stock?.isInStock !== false
                              ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white'
                              : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                          }`}
                          disabled={product.stock?.isInStock === false}
                        >
                          {product.stock?.isInStock === false 
                            ? '❌ Sin Stock'
                            : product.basePrice <= 0 
                              ? '� Debug (Sin Precio)'
                              : '🛒 Agregar'
                          }
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