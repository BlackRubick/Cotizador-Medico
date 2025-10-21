// src/components/services/productService.js
import { apiRequest } from '../config/api';

class ProductService {
  // Obtener todos los productos
  async getProducts(params = {}) {
    try {
      const queryParams = new URLSearchParams(params).toString();
      const endpoint = queryParams ? `/products?${queryParams}` : '/products';
      
      const response = await apiRequest(endpoint);
      return response;
    } catch (error) {
      console.error('Get products error:', error);
      throw error;
    }
  }

  // Obtener un producto por ID
  async getProduct(id) {
    try {
      const response = await apiRequest(`/products/${id}`);
      return response;
    } catch (error) {
      console.error('Get product error:', error);
      throw error;
    }
  }

  // Obtener productos por categoría
  async getProductsByCategory(categoryId, params = {}) {
    try {
      const allParams = { ...params, category: categoryId };
      return await this.getProducts(allParams);
    } catch (error) {
      console.error('Get products by category error:', error);
      throw error;
    }
  }

  // Buscar productos
  async searchProducts(searchTerm, filters = {}) {
    try {
      const params = {
        search: searchTerm,
        ...filters
      };
      return await this.getProducts(params);
    } catch (error) {
      console.error('Search products error:', error);
      throw error;
    }
  }

  // Obtener categorías
  async getCategories() {
    try {
      const response = await apiRequest('/categories');
      return response;
    } catch (error) {
      console.error('Get categories error:', error);
      throw error;
    }
  }

  // Obtener estadísticas de productos
  async getProductStats() {
    try {
      const response = await apiRequest('/products/stats');
      return response;
    } catch (error) {
      console.error('Get product stats error:', error);
      throw error;
    }
  }

  // Mapear producto del backend al formato del frontend
// Mapear producto del backend al formato del frontend
  mapBackendToFrontend(backendProduct) {
    console.log('🔄 Mapping product:', backendProduct); // DEBUG
    
    // ✅ CORREGIDO: Usar los campos reales de tu base de datos
    // Priorizar múltiples campos que el backend podría retornar
    const basePrice = parseFloat(
      backendProduct.basePrice ||
      backendProduct.precioVenta ||
      backendProduct.precioVentaPaquete ||
      backendProduct.precioUnitario ||
      backendProduct.priceExw ||
      backendProduct.price ||
      backendProduct.costo ||
      0
    ) || 0;
    
    // ✅ CORREGIDO: Formatear precio sin usar this
    const formatPrice = (price, currency = 'MXN') => {
      if (!price) return '$0';
      return new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 0
      }).format(price);
    };
    
    return {
      id: backendProduct.id,
      name: backendProduct.item || backendProduct.code || 'Producto sin nombre', // ✅ item en lugar de name
      code: backendProduct.code,
      description: backendProduct.paraDescripcion || backendProduct.uso || backendProduct.item || '', // ✅ paraDescripcion
      category: backendProduct.category?.name || backendProduct.servicio || 'Sin categoría', // ✅ category.name o servicio
      categoryId: backendProduct.categoryId,
      categoryName: backendProduct.category?.name || backendProduct.servicio || 'Sin categoría',
      brand: backendProduct.proveedor || 'N/A', // ✅ proveedor en lugar de brand
      basePrice: parseFloat(basePrice),
      formattedPrice: formatPrice(basePrice, backendProduct.moneda || 'MXN'), // ✅ Usar función local
      currency: backendProduct.moneda || 'MXN', // ✅ moneda en lugar de currency
      compatibility: backendProduct.clasificacion ? [backendProduct.clasificacion] : [], // ✅ clasificacion
      specifications: {
        servicio: backendProduct.servicio,
        especialidad: backendProduct.especialidad,
        clasificacion: backendProduct.clasificacion,
        cantidadPaquete: backendProduct.cantidadPaquete,
        uso: backendProduct.uso,
        almacen: backendProduct.almacen,
        incluye: backendProduct.incluye,
        impuestos: backendProduct.impuestos
      },
      images: [],
      accessories: [],
      stock: {
        quantity: 100, 
        minStock: 10,
        location: backendProduct.almacen || 'Almacén principal',
        isInStock: true,
        isLowStock: false
      },
      status: 'active',
      tags: [backendProduct.servicio, backendProduct.especialidad].filter(Boolean),
      supplier: {
        name: backendProduct.proveedor,
        contact: null,
        email: null,
        phone: null
      },
      warranty: {
        duration: 12,
        type: 'manufacturer',
        description: 'Garantía del fabricante'
      },
      salesCount: 0,
      lastSaleDate: null,
      createdAt: backendProduct.createdAt,
      updatedAt: backendProduct.updatedAt
    };
  }
  // Filtrar productos por compatibilidad
  filterByCompatibility(products, compatibility) {
    if (!compatibility || compatibility.length === 0) return products;
    
    return products.filter(product => {
      if (!product.compatibility || product.compatibility.length === 0) return false;
      return compatibility.some(comp => product.compatibility.includes(comp));
    });
  }

  // Filtrar productos por rango de precio
  filterByPriceRange(products, minPrice, maxPrice) {
    return products.filter(product => {
      const price = product.basePrice || 0;
      if (minPrice && price < minPrice) return false;
      if (maxPrice && price > maxPrice) return false;
      return true;
    });
  }

  // Ordenar productos
  sortProducts(products, sortBy = 'name', sortOrder = 'asc') {
    return [...products].sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      // Manejar valores nulos/undefined
      if (aValue == null) aValue = '';
      if (bValue == null) bValue = '';

      // Convertir a string para comparación
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortOrder === 'desc') {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
      } else {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      }
    });
  }

  // Agrupar productos por categoría
  groupByCategory(products) {
    return products.reduce((groups, product) => {
      const category = product.category || 'Sin Categoría';
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(product);
      return groups;
    }, {});
  }

  // Validar datos de producto
  validateProductData(productData) {
    const errors = [];

    if (!productData.name || productData.name.trim() === '') {
      errors.push('Nombre del producto es requerido');
    }

    if (!productData.code || productData.code.trim() === '') {
      errors.push('Código del producto es requerido');
    }

    if (!productData.description || productData.description.trim() === '') {
      errors.push('Descripción es requerida');
    }

    if (!productData.categoryId) {
      errors.push('Categoría es requerida');
    }

    if (!productData.brand || productData.brand.trim() === '') {
      errors.push('Marca es requerida');
    }

    if (!productData.basePrice || productData.basePrice <= 0) {
      errors.push('Precio base debe ser mayor a 0');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Crear producto (para administradores)
  async createProduct(productData) {
    try {
      const validation = this.validateProductData(productData);
      if (!validation.isValid) {
        throw new Error(`Errores de validación: ${validation.errors.join(', ')}`);
      }

      const response = await apiRequest('/products', {
        method: 'POST',
        body: JSON.stringify(productData),
      });
      
      return response;
    } catch (error) {
      console.error('Create product error:', error);
      throw error;
    }
  }

  // Actualizar producto (para administradores)
  async updateProduct(id, productData) {
    try {
      const response = await apiRequest(`/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify(productData),
      });
      
      return response;
    } catch (error) {
      console.error('Update product error:', error);
      throw error;
    }
  }

  // Eliminar producto (para administradores)
  async deleteProduct(id) {
    try {
      const response = await apiRequest(`/products/${id}`, {
        method: 'DELETE',
      });
      
      return response;
    } catch (error) {
      console.error('Delete product error:', error);
      throw error;
    }
  }

  // Obtener imagen por defecto si no existe
  getDefaultImage(product) {
    if (product.images && product.images.length > 0) {
      return product.images[0].url || product.images[0].path;
    }
    
    // Generar imagen placeholder
    return `data:image/svg+xml;base64,${btoa(`
      <svg width="150" height="150" viewBox="0 0 150 150" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="150" height="150" fill="#E5E7EB"/>
        <text x="75" y="75" text-anchor="middle" dominant-baseline="middle" fill="#9CA3AF" font-size="12">${product.name || 'Producto'}</text>
      </svg>
    `)}`;
  }

  // Verificar disponibilidad de stock
  checkStockAvailability(product, requestedQuantity) {
    const availableStock = product.stock?.quantity || product.stockQuantity || 0;
    
    return {
      available: availableStock >= requestedQuantity,
      availableQuantity: availableStock,
      requestedQuantity,
      shortage: Math.max(0, requestedQuantity - availableStock)
    };
  }
}

export default new ProductService();