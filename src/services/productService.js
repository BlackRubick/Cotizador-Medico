import { productCategories, products } from '../data/products/productData.js';

class ProductService {
  constructor() {
    this.loadedProducts = { ...products };
    this.loadedCategories = [...productCategories];
  }

  // Obtener todas las categorías
  getCategories() {
    return this.loadedCategories;
  }

  // Obtener productos por categoría
  getProductsByCategory(categoryId) {
    const products = this.loadedProducts[categoryId] || [];
    console.log(`🔍 Getting products for category "${categoryId}":`, products.length, 'products found');
    console.log('🗂️ Available categories:', Object.keys(this.loadedProducts));
    return products;
  }

  // Obtener todos los productos
  getAllProducts() {
    const allProducts = [];
    Object.values(this.loadedProducts).forEach(categoryProducts => {
      allProducts.push(...categoryProducts);
    });
    return allProducts;
  }

  // Cargar productos desde Excel
  loadProductsFromExcel(excelProducts) {
    try {
      console.log('📦 Loading products from Excel:', excelProducts.length, 'products');
      
      // Agrupar productos por categoría
      const productsByCategory = {};
      const existingCategories = new Set(this.loadedCategories.map(cat => cat.id));
      const newCategories = [];

      excelProducts.forEach((product, index) => {
        const categoryId = product.category.toLowerCase().replace(/\s+/g, '-');
        
        console.log(`Product ${index + 1}: "${product.name}" -> Category: "${categoryId}"`);
        
        // Crear categoría si no existe
        if (!existingCategories.has(categoryId)) {
          const newCategory = {
            id: categoryId,
            name: product.category.toUpperCase(),
            description: `Productos de ${product.category}`,
            image: '/api/placeholder/150/150'
          };
          newCategories.push(newCategory);
          existingCategories.add(categoryId);
          console.log('🆕 New category created:', newCategory);
        }

        // Agrupar productos por categoría
        if (!productsByCategory[categoryId]) {
          productsByCategory[categoryId] = [];
        }

        // Asegurar que el producto tenga la categoría correcta y procesar datos adicionales
        const processedProduct = {
          ...product,
          category: categoryId,
          // Mantener información extendida si existe
          extendedData: {
            marca: product.marca || '',
            modelo: product.modelo || '',
            especialidad: product.especialidad || '',
            clasificacion: product.clasificacion || '',
            uso: product.uso || '',
            unidad: product.unidad || '',
            proveedor: product.proveedor || '',
            uom: product.uom || '',
            priceExw: product.priceExw || 0,
            moneda: product.moneda || '',
            valorMoneda: product.valorMoneda || 1,
            landenFactor: product.landenFactor || 1,
            marginFactor: product.marginFactor || 1
          }
        };

        productsByCategory[categoryId].push(processedProduct);
      });

      // Agregar nuevas categorías
      this.loadedCategories.push(...newCategories);
      console.log('📂 Total categories after loading:', this.loadedCategories.length);

      // Agregar o reemplazar productos por categoría
      Object.keys(productsByCategory).forEach(categoryId => {
        this.loadedProducts[categoryId] = productsByCategory[categoryId];
        console.log(`📦 Category "${categoryId}" now has ${productsByCategory[categoryId].length} products`);
      });

      // Guardar en localStorage para persistencia
      this.saveToLocalStorage();

      console.log('💾 Data saved to localStorage');
      console.log('📊 Final state:', {
        categories: this.loadedCategories.length,
        productsByCategory: Object.keys(this.loadedProducts).map(cat => ({
          [cat]: this.loadedProducts[cat].length
        }))
      });

      return {
        success: true,
        message: `Se cargaron ${excelProducts.length} productos en ${Object.keys(productsByCategory).length} categorías`,
        categoriesAdded: newCategories.length,
        productsLoaded: excelProducts.length
      };

    } catch (error) {
      console.error('Error loading products from Excel:', error);
      return {
        success: false,
        message: `Error al cargar productos: ${error.message}`
      };
    }
  }

  // Agregar un producto individual
  addProduct(product) {
    const categoryId = product.category;
    if (!this.loadedProducts[categoryId]) {
      this.loadedProducts[categoryId] = [];
    }
    
    // Verificar si ya existe un producto con el mismo ID
    const existingIndex = this.loadedProducts[categoryId].findIndex(p => p.id === product.id);
    
    if (existingIndex >= 0) {
      // Actualizar producto existente
      this.loadedProducts[categoryId][existingIndex] = product;
    } else {
      // Agregar nuevo producto
      this.loadedProducts[categoryId].push(product);
    }
    
    this.saveToLocalStorage();
  }

  // Eliminar un producto
  removeProduct(categoryId, productId) {
    if (this.loadedProducts[categoryId]) {
      this.loadedProducts[categoryId] = this.loadedProducts[categoryId].filter(p => p.id !== productId);
      this.saveToLocalStorage();
    }
  }

  // Actualizar un producto
  updateProduct(categoryId, productId, updatedProduct) {
    if (this.loadedProducts[categoryId]) {
      const index = this.loadedProducts[categoryId].findIndex(p => p.id === productId);
      if (index >= 0) {
        this.loadedProducts[categoryId][index] = { ...updatedProduct, id: productId, category: categoryId };
        this.saveToLocalStorage();
      }
    }
  }

  // Buscar productos
  searchProducts(query) {
    const allProducts = this.getAllProducts();
    const searchTerm = query.toLowerCase();
    
    return allProducts.filter(product => 
      product.name.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm) ||
      product.code.toLowerCase().includes(searchTerm)
    );
  }

  // Guardar en localStorage
  saveToLocalStorage() {
    try {
      localStorage.setItem('customProducts', JSON.stringify(this.loadedProducts));
      localStorage.setItem('customCategories', JSON.stringify(this.loadedCategories));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }

  // Cargar desde localStorage
  loadFromLocalStorage() {
    try {
      const savedProducts = localStorage.getItem('customProducts');
      const savedCategories = localStorage.getItem('customCategories');
      
      if (savedProducts) {
        this.loadedProducts = JSON.parse(savedProducts);
      }
      
      if (savedCategories) {
        this.loadedCategories = JSON.parse(savedCategories);
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error);
    }
  }

  // Resetear a datos originales
  resetToDefaults() {
    this.loadedProducts = { ...products };
    this.loadedCategories = [...productCategories];
    localStorage.removeItem('customProducts');
    localStorage.removeItem('customCategories');
  }

  // Exportar productos actuales a formato Excel-compatible
  exportToExcelFormat() {
    const allProducts = this.getAllProducts();
    return allProducts.map(product => ({
      CATEGORIA: product.category?.toUpperCase() || 'GENERAL',
      ESPECIALIDAD: product.extendedData?.especialidad || '',
      CLASIFICACION: product.extendedData?.clasificacion || '',
      PARA: product.compatibility?.join(',') || 'ADULTO',
      MARCA: product.extendedData?.marca || '',
      MODELO: product.extendedData?.modelo || product.code || '',
      DESCRIPCIÓN: product.description || product.name,
      USO: product.extendedData?.uso || '',
      UNIDAD: product.extendedData?.unidad || 'UNIDAD',
      PROVEEDOR: product.extendedData?.proveedor || '',
      UOM: product.extendedData?.uom || 'PCS',
      'PRICE EXW': product.extendedData?.priceExw || product.basePrice,
      MONEDA: product.extendedData?.moneda || 'USD',
      'VALOR MONEDA': product.extendedData?.valorMoneda || 1,
      'LANDEN FACTOR': product.extendedData?.landenFactor || 1,
      'MARGIN FACTOR': product.extendedData?.marginFactor || 1,
      COMPATIBILIDAD: product.compatibility?.join(',') || 'ADULTO',
      'PRECIO VENTA': product.basePrice
    }));
  }
}

// Crear una instancia singleton
const productService = new ProductService();

// Cargar datos guardados al inicializar
productService.loadFromLocalStorage();

export default productService;
