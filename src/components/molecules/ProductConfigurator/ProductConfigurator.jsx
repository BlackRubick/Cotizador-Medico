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
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({
    compatibility: [],
    priceRange: null,
    brand: [],
    productType: [],
    clasificacion: [],
    especialidad: [],
    status: 'active'
  });
  const [quantities, setQuantities] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [availableBrands, setAvailableBrands] = useState([]);
  const [availableCompatibilities, setAvailableCompatibilities] = useState([]);
  const [availableClasificaciones, setAvailableClasificaciones] = useState([]);
  const [availableEspecialidades, setAvailableEspecialidades] = useState([]);
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
    compatibility: availableCompatibilities, // Compatibilidades dinámicas basadas en la columna PARA
    priceRange: [
      { label: '$0 - $5,000', min: 0, max: 5000 },
      { label: '$5,000 - $15,000', min: 5000, max: 15000 },
      { label: '$15,000 - $30,000', min: 15000, max: 30000 },
      { label: '$30,000+', min: 30000, max: 999999 }
    ],
    brands: availableBrands, // Marcas dinámicas basadas en los productos cargados
    productType: ['DESECHABLE', 'REUSABLE'],
    clasificaciones: availableClasificaciones, // Clasificaciones dinámicas
    especialidades: availableEspecialidades // Especialidades dinámicas
  };

  // Debounce para la búsqueda - espera 500ms después de que el usuario deje de escribir
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Cargar productos cuando cambie la categoría, filtros o el término de búsqueda debounceado
  useEffect(() => {
    loadProducts();
  }, [categoryId, categoryName, selectedFilters, debouncedSearchTerm, currentPage]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError('');

      console.log('🔄 Loading products for category:', categoryId, 'categoryName:', categoryName);
      
      let products = [];
      
      if (categoryName) {
        // ⭐ USAR LA API con el parámetro 'category' y el nombre de la categoría
        console.log('🌐 Cargando productos desde API para categoría:', categoryName);
        
        const response = await apiRequest(`/products?category=${encodeURIComponent(categoryName)}`, {
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
            
            // Debug de marcas y compatibilidad para los primeros 5 productos
            if (index < 5) {
              console.log(`🏷️ MARCA Y COMPATIBILIDAD DETECTADA en producto ${index + 1}:`, {
                codigo: product.code,
                nombre: product.item || product.name,
                proveedor: product.proveedor,
                brand: product.brand,
                para: product.para,
                paraDescripcion: product.paraDescripcion,
                marcaFinal: product.proveedor || product.brand || 'SIN MARCA',
                compatibilidadFinal: product.para || product.paraDescripcion || 'SIN COMPATIBILIDAD'
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
              // Campos adicionales para compatibilidad - usar campo PARA del Excel
              compatibility: product.para || product.paraDescripcion || product.compatibility || product.especialidad || null,
              stock: {
                isInStock: true, // Por defecto asumimos que hay stock
                quantity: 99 // Cantidad por defecto
              }
            };
          });
          
          console.log('✅ Productos formateados:', products.length, 'productos');
          
          // 🏷️ EXTRAER TODAS LAS MARCAS DINÁMICAMENTE de TODOS los productos cargados
          const uniqueBrands = [...new Set(
            products
              .map(p => p.proveedor || p.brand) // Usar el campo proveedor que es el correcto
              .filter(brand => brand && typeof brand === 'string' && brand.trim() !== '') // Validar que sea string y no esté vacío
              .map(brand => String(brand).toUpperCase().trim()) // Convertir a string por seguridad y normalizar
          )].sort(); // Ordenar alfabéticamente
          
          console.log('🏷️ TODAS las marcas encontradas en los productos:', uniqueBrands);
          console.log('🔍 Total de marcas únicas detectadas:', uniqueBrands.length);
          
          // Actualizar las marcas disponibles solo si encontramos marcas
          if (uniqueBrands.length > 0) {
            setAvailableBrands(uniqueBrands);
          }
          
          // 🎯 EXTRAER TODAS LAS COMPATIBILIDADES DINÁMICAMENTE de la columna PARA
          const uniqueCompatibilities = [...new Set(
            products
              .map(p => p.para || p.paraDescripcion || p.compatibility || p.especialidad) // Usar campo PARA del Excel
              .filter(comp => comp && typeof comp === 'string' && comp.trim() !== '') // Validar que sea string y no esté vacío
              .map(comp => String(comp).toUpperCase().trim()) // Convertir a string por seguridad y normalizar
          )].sort(); // Ordenar alfabéticamente
          
          console.log('🎯 TODAS las compatibilidades encontradas en columna PARA:', uniqueCompatibilities);
          console.log('🔍 Total de compatibilidades únicas detectadas:', uniqueCompatibilities.length);
          
          // Actualizar las compatibilidades disponibles solo si encontramos compatibilidades
          if (uniqueCompatibilities.length > 0) {
            setAvailableCompatibilities(uniqueCompatibilities);
          }
          
          // 🏥 EXTRAER TODAS LAS CLASIFICACIONES DINÁMICAMENTE
          const uniqueClasificaciones = [...new Set(
            products
              .map(p => p.clasificacion) // Usar campo clasificacion del Excel
              .filter(clas => clas && typeof clas === 'string' && clas.trim() !== '') // Validar que sea string y no esté vacío
              .map(clas => String(clas).toUpperCase().trim()) // Convertir a string por seguridad y normalizar
          )].sort(); // Ordenar alfabéticamente
          
          console.log('🏥 TODAS las clasificaciones encontradas:', uniqueClasificaciones);
          console.log('🔍 Total de clasificaciones únicas detectadas:', uniqueClasificaciones.length);
          
          // Actualizar las clasificaciones disponibles
          if (uniqueClasificaciones.length > 0) {
            setAvailableClasificaciones(uniqueClasificaciones);
          }
          
          // 🩺 EXTRAER TODAS LAS ESPECIALIDADES DINÁMICAMENTE  
          const uniqueEspecialidades = [...new Set(
            products
              .map(p => p.especialidad) // Usar campo especialidad del Excel
              .filter(esp => esp && typeof esp === 'string' && esp.trim() !== '') // Validar que sea string y no esté vacío
              .map(esp => String(esp).toUpperCase().trim()) // Convertir a string por seguridad y normalizar
          )].sort(); // Ordenar alfabéticamente
          
          console.log('🩺 TODAS las especialidades encontradas:', uniqueEspecialidades);
          console.log('🔍 Total de especialidades únicas detectadas:', uniqueEspecialidades.length);
          
          // Actualizar las especialidades disponibles
          if (uniqueEspecialidades.length > 0) {
            setAvailableEspecialidades(uniqueEspecialidades);
          }
          
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

      // Aplicar filtro de búsqueda directamente a los productos de la API (usando debouncedSearchTerm)
      if (debouncedSearchTerm) {
        const searchTermLower = debouncedSearchTerm.toLowerCase();
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

      // Filtrar por compatibilidad (usar campo PARA del Excel)
      if (selectedFilters.compatibility.length > 0) {
        filteredProducts = filteredProducts.filter(product => {
          const productCompatibility = String(product.compatibility || '').toUpperCase().trim();
          return selectedFilters.compatibility.some(comp =>
            productCompatibility === String(comp).toUpperCase().trim() ||
            productCompatibility.includes(String(comp).toUpperCase().trim())
          );
        });
      }

      // Filtrar por rango de precio
      if (selectedFilters.priceRange) {
        filteredProducts = filteredProducts.filter(product =>
          product.basePrice >= selectedFilters.priceRange.min &&
          product.basePrice <= selectedFilters.priceRange.max
        );
      }

      // Filtrar por marca (usar proveedor que es el campo real)
      if (selectedFilters.brand.length > 0) {
        filteredProducts = filteredProducts.filter(product => {
          const productBrand = String(product.proveedor || product.brand || '').toUpperCase().trim();
          return selectedFilters.brand.some(brand =>
            productBrand === String(brand).toUpperCase().trim()
          );
        });
      }

      // Filtrar por tipo de producto (desechable/reusable)
      if (selectedFilters.productType.length > 0) {
        filteredProducts = filteredProducts.filter(product =>
          selectedFilters.productType.some(type => {
            // Buscar en nombre, descripción y campos del producto
            const searchText = `${product.name} ${product.description} ${product.especialidad || ''}`.toLowerCase();
            return searchText.includes(type.toLowerCase());
          })
        );
      }

      // Filtrar por clasificación
      if (selectedFilters.clasificacion.length > 0) {
        filteredProducts = filteredProducts.filter(product => {
          const productClasificacion = String(product.clasificacion || '').toUpperCase().trim();
          return selectedFilters.clasificacion.some(clasificacion =>
            productClasificacion === String(clasificacion).toUpperCase().trim()
          );
        });
      }

      // Filtrar por especialidad
      if (selectedFilters.especialidad.length > 0) {
        filteredProducts = filteredProducts.filter(product => {
          const productEspecialidad = String(product.especialidad || '').toUpperCase().trim();
          return selectedFilters.especialidad.some(especialidad =>
            productEspecialidad === String(especialidad).toUpperCase().trim()
          );
        });
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

  const toggleBrandFilter = (brand) => {
    setSelectedFilters(prev => ({
      ...prev,
      brand: prev.brand.includes(brand)
        ? prev.brand.filter(b => b !== brand)
        : [...prev.brand, brand]
    }));
    setCurrentPage(1);
  };

  const toggleProductTypeFilter = (type) => {
    setSelectedFilters(prev => ({
      ...prev,
      productType: prev.productType.includes(type)
        ? prev.productType.filter(t => t !== type)
        : [...prev.productType, type]
    }));
    setCurrentPage(1);
  };

  const toggleClasificacionFilter = (clasificacion) => {
    setSelectedFilters(prev => ({
      ...prev,
      clasificacion: prev.clasificacion.includes(clasificacion)
        ? prev.clasificacion.filter(c => c !== clasificacion)
        : [...prev.clasificacion, clasificacion]
    }));
    setCurrentPage(1);
  };

  const toggleEspecialidadFilter = (especialidad) => {
    setSelectedFilters(prev => ({
      ...prev,
      especialidad: prev.especialidad.includes(especialidad)
        ? prev.especialidad.filter(e => e !== especialidad)
        : [...prev.especialidad, especialidad]
    }));
    setCurrentPage(1);
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
      brand: [],
      productType: [],
      clasificacion: [],
      especialidad: [],
      status: 'active'
    });
    setSearchTerm('');
    setDebouncedSearchTerm('');
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
      {/* Header mejorado con gradiente - RESPONSIVE */}
      <div className="bg-gradient-to-r from-slate-700 to-slate-800 text-white shadow-xl">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
            <div className="flex items-center space-x-2 sm:space-x-4">
              {onBack && (
                <Button 
                  variant="ghost" 
                  onClick={onBack}
                  className="flex items-center space-x-1 sm:space-x-2 text-white hover:bg-white/10 border-white/20 px-2 sm:px-4 py-2"
                >
                  <ArrowLeft size={16} className="sm:w-5 sm:h-5" />
                  <span className="hidden xs:inline">Volver</span>
                </Button>
              )}
              <div className="flex items-center space-x-2 sm:space-x-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 backdrop-blur-sm rounded-lg sm:rounded-xl flex items-center justify-center border border-white/30">
                  <span className="text-white font-bold text-sm sm:text-lg">
                    {categoryName ? categoryName.substring(0, 3).toUpperCase() : 'PRD'}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight truncate">
                    {categoryName || 'Productos'}
                  </h1>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal - RESPONSIVE */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-4 sm:space-y-8">

        {/* Error Message - RESPONSIVE */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 rounded-lg p-4 sm:p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-start space-y-3 sm:space-y-0 sm:space-x-3">
              <div className="flex-shrink-0 self-center sm:self-start">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-red-500 text-lg">⚠️</span>
                </div>
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h3 className="text-red-800 font-semibold text-base sm:text-lg">Error al cargar productos</h3>
                <p className="text-red-700 mt-1 text-sm sm:text-base">{error}</p>
                <Button 
                  onClick={loadProducts} 
                  variant="secondary" 
                  className="mt-3 sm:mt-4 bg-red-600 hover:bg-red-700 text-white border-red-600 w-full sm:w-auto"
                >
                  Reintentar
                </Button>
              </div>
            </div>
          </div>
        )}



        {/* Search mejorado - RESPONSIVE con debounce */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="relative">
            <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-10 sm:pl-12 pr-10 sm:pr-12 py-2.5 sm:py-3 text-sm sm:text-base border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            
            {/* Indicador de búsqueda en proceso */}
            {searchTerm !== debouncedSearchTerm && searchTerm.length > 0 && (
              <div className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
              </div>
            )}
            
            {/* Indicador de término aplicado */}
            {searchTerm === debouncedSearchTerm && searchTerm.length > 0 && (
              <div className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              </div>
            )}
          </div>
          
          {/* Mensaje informativo sobre el debounce */}
          {searchTerm.length > 0 && searchTerm !== debouncedSearchTerm && (
            <p className="text-xs text-gray-500 mt-2 flex items-center">
              <span className="inline-block w-1 h-1 bg-blue-500 rounded-full mr-2 animate-pulse"></span>
              Escribiendo... La búsqueda se ejecutará automáticamente
            </p>
          )}
        </div>

        {/* Filters mejorados - RESPONSIVE */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 space-y-2 sm:space-y-0">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center">
              <Filter className="mr-2" size={18} />
              <span className="hidden sm:inline">Filtros de búsqueda</span>
              <span className="sm:hidden">Filtros</span>
            </h3>
            <Button 
              variant="ghost" 
              onClick={clearFilters}
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 text-sm sm:text-base px-2 sm:px-4 py-1 sm:py-2 self-start"
            >
              <span className="sm:hidden">Limpiar</span>
              <span className="hidden sm:inline">Limpiar Filtros</span>
            </Button>
          </div>

          <div className="space-y-4 sm:space-y-6">
            {/* Solo mostrar filtro de compatibilidad si hay compatibilidades disponibles */}
            {availableCompatibilities.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2 sm:mb-3 flex items-center text-sm sm:text-base">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Compatibilidad ({availableCompatibilities.length})
                </h4>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {availableCompatibilities.map(comp => (
                    <CategoryFilter
                      key={comp}
                      label={comp}
                      active={selectedFilters.compatibility.includes(comp)}
                      onClick={() => toggleCompatibilityFilter(comp)}
                    />
                  ))}
                </div>
              </div>
            )}

            <div>
              <h4 className="font-medium text-gray-900 mb-2 sm:mb-3 flex items-center text-sm sm:text-base">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Rango de Precio
              </h4>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
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

            {/* Solo mostrar filtro de marca si hay marcas disponibles */}
            {availableBrands.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2 sm:mb-3 flex items-center text-sm sm:text-base">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                  Marca ({availableBrands.length})
                </h4>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {availableBrands.map(brand => (
                    <CategoryFilter
                      key={brand}
                      label={brand}
                      active={selectedFilters.brand.includes(brand)}
                      onClick={() => toggleBrandFilter(brand)}
                    />
                  ))}
                </div>
              </div>
            )}

            <div>
              <h4 className="font-medium text-gray-900 mb-2 sm:mb-3 flex items-center text-sm sm:text-base">
                <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                Tipo de Producto
              </h4>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {filters.productType.map(type => (
                  <CategoryFilter
                    key={type}
                    label={type}
                    active={selectedFilters.productType.includes(type)}
                    onClick={() => toggleProductTypeFilter(type)}
                  />
                ))}
              </div>
            </div>

            {/* Solo mostrar filtro de clasificación si hay clasificaciones disponibles */}
            {availableClasificaciones.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2 sm:mb-3 flex items-center text-sm sm:text-base">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                  Clasificación ({availableClasificaciones.length})
                </h4>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {availableClasificaciones.map(clasificacion => (
                    <CategoryFilter
                      key={clasificacion}
                      label={clasificacion}
                      active={selectedFilters.clasificacion.includes(clasificacion)}
                      onClick={() => toggleClasificacionFilter(clasificacion)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Solo mostrar filtro de especialidad si hay especialidades disponibles */}
            {availableEspecialidades.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2 sm:mb-3 flex items-center text-sm sm:text-base">
                  <span className="w-2 h-2 bg-teal-500 rounded-full mr-2"></span>
                  Especialidad ({availableEspecialidades.length})
                </h4>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {availableEspecialidades.map(especialidad => (
                    <CategoryFilter
                      key={especialidad}
                      label={especialidad}
                      active={selectedFilters.especialidad.includes(especialidad)}
                      onClick={() => toggleEspecialidadFilter(especialidad)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Products List mejorada - COMPLETAMENTE RESPONSIVE */}
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
            <div key={product.id} className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-4 sm:p-6 hover:shadow-lg hover:border-blue-200 transition-all duration-200">
              {/* Layout responsive: móvil (columna) y desktop (fila) */}
              <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
                {/* Header móvil con imagen y título */}
                <div className="flex items-start space-x-3 sm:space-x-0">
                  <ProductImage 
                    productCode={product.code}
                    productName={product.name}
                    containerClassName="w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg sm:rounded-xl flex items-center justify-center border-2 border-gray-200 flex-shrink-0"
                    className="w-14 h-14 sm:w-20 sm:h-20 object-contain"
                  />
                  
                  {/* Info básica móvil */}
                  <div className="flex-1 min-w-0 sm:hidden">
                    <h4 className="text-base font-semibold text-gray-900 mb-1 leading-tight line-clamp-2">{product.name}</h4>
                    <div className="flex flex-wrap gap-1 text-xs">
                      <span className="inline-flex items-center px-2 py-0.5 rounded bg-gray-100 text-gray-700 font-mono text-xs">
                        #{product.code}
                      </span>
                      {product.brand && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-xs">
                          {product.brand}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Contenido principal responsive */}
                <div className="flex-1 min-w-0 space-y-3 sm:space-y-0">
                  {/* Información completa - solo desktop */}
                  <div className="hidden sm:block">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
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
                      </div>
                    </div>
                  </div>

                  {/* Descripción compacta - solo móvil */}
                  <div className="sm:hidden">
                    <p className="text-gray-600 text-sm leading-tight line-clamp-2">{product.description}</p>
                  </div>
                  
                  {/* Compatibility badge responsivo - mostrar solo uno */}
                  {product.compatibility && (
                    <div className="flex flex-wrap gap-1 sm:gap-1 sm:mt-3">
                      <span className="inline-flex items-center px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                        {product.compatibility}
                      </span>
                    </div>
                  )}

                  {/* DEBUG info - solo desktop grande */}
                  <div className="hidden xl:block text-xs text-gray-400 bg-gray-50 p-2 rounded mt-2">
                    <div>Código: {product.code}</div>

                    <div className="text-xs">
                      PVP: {product.precioVentaPaquete || 'null'} | 
                      PU: {product.precioUnitario || 'null'} | 
                      Final: {product.finalPrice || 'null'}
                    </div>
                  </div>
                </div>

                {/* Precio y controles - responsive */}
                <div className="flex flex-row sm:flex-col items-center justify-between sm:justify-end space-x-4 sm:space-x-0 sm:space-y-4 sm:ml-6">
                  {/* Precio */}
                  <div className="text-left sm:text-right">
                    <PriceTag price={product.basePrice} className="text-lg sm:text-2xl font-bold" />
                    <p className="text-xs text-gray-500 hidden sm:block">Precio por unidad</p>
                    {product.moneda && product.moneda !== 'MXN' && (
                      <p className="text-xs text-blue-600 hidden sm:block">Moneda: {product.moneda}</p>
                    )}
                  </div>
                  
                  {/* Controles de cantidad y botón */}
                  <div className="flex flex-row sm:flex-col items-center space-x-2 sm:space-x-0 sm:space-y-3">
                    <QuantitySelector
                      quantity={quantities[product.id] || 1}
                      onDecrease={() => updateQuantity(product.id, (quantities[product.id] || 1) - 1)}
                      onIncrease={() => updateQuantity(product.id, (quantities[product.id] || 1) + 1)}
                      min={1}
                      max={product.stock?.quantity || 99}
                    />
                    <Button
                      onClick={() => handleAddToCart(product)}
                      className={`px-3 sm:px-6 py-2 text-sm sm:text-base font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200 whitespace-nowrap ${
                        product.stock?.isInStock !== false
                          ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white'
                          : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                      }`}
                      disabled={product.stock?.isInStock === false}
                    >
                      <span className="sm:hidden">
                        {product.stock?.isInStock === false 
                          ? '❌'
                          : product.basePrice <= 0 
                            ? '🔧'
                            : '🛒'
                        }
                      </span>
                      <span className="hidden sm:inline">
                        {product.stock?.isInStock === false 
                          ? '❌ Sin Stock'
                          : product.basePrice <= 0 
                            ? '🔧 Debug'
                            : '🛒 Agregar'
                        }
                      </span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      {/* No results - RESPONSIVE */}
      {!loading && products.length === 0 && !error && (
        <div className="text-center py-8 sm:py-12 text-gray-500 px-4">
          <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">🔍</div>
          <h3 className="text-base sm:text-lg font-semibold mb-2">No se encontraron productos</h3>
          <p className="text-sm sm:text-base mb-4">Intenta cambiar los filtros o términos de búsqueda</p>
          <Button onClick={clearFilters} className="w-full sm:w-auto">
            Limpiar Filtros
          </Button>
        </div>
      )}

      {/* Pagination - RESPONSIVE */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-2 mt-6 px-4">
          <Button
            variant="secondary"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="w-full sm:w-auto px-4 py-2 text-sm sm:text-base"
          >
            <span className="sm:hidden">← Ant</span>
            <span className="hidden sm:inline">Anterior</span>
          </Button>
          
          <div className="flex space-x-1 sm:space-x-2 overflow-x-auto max-w-full pb-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              const maxPages = 5; // Usar 5 páginas en móvil por defecto
              if (totalPages <= maxPages) {
                pageNum = i + 1;
              } else if (currentPage <= Math.floor(maxPages/2) + 1) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - Math.floor(maxPages/2)) {
                pageNum = totalPages - maxPages + 1 + i;
              } else {
                pageNum = currentPage - Math.floor(maxPages/2) + i;
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full text-sm sm:text-base font-medium ${
                    pageNum === currentPage 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  } transition-all duration-200 flex-shrink-0`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>
          
          <Button
            variant="secondary"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="w-full sm:w-auto px-4 py-2 text-sm sm:text-base"
          >
            <span className="sm:hidden">Sig →</span>
            <span className="hidden sm:inline">Siguiente</span>
          </Button>
        </div>
      )}

        {/* Loading indicator for pagination - RESPONSIVE */}
        {loading && products.length > 0 && (
          <div className="text-center py-4 px-4">
            <div className="animate-pulse flex justify-center items-center space-x-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            </div>
            <p className="text-gray-600 text-sm sm:text-base mt-2">Cargando más productos...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductConfigurator;