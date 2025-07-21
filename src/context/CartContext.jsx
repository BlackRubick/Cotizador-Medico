// src/context/CartContext.jsx
import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [quoteInfo, setQuoteInfo] = useState({
    clientId: null,
    clientName: '',
    company: '',
    email: '',
    phone: '',
    clientContact: '',
    clientAddress: '',
    clientPosition: ''
  });

  const addToCart = (product, quantity = 1, selectedAccessories = []) => {
    console.log('Adding to cart:', { product, quantity, selectedAccessories });
    
    const existingItem = cartItems.find(item => item.id === product.id);
    
    if (existingItem) {
      // Si el producto ya existe, actualizar cantidad
      setCartItems(cartItems.map(item =>
        item.id === product.id
          ? { 
              ...item, 
              quantity: item.quantity + quantity,
              totalPrice: (item.quantity + quantity) * item.basePrice
            }
          : item
      ));
    } else {
      // Agregar nuevo producto al carrito
      const newItem = {
        id: product.id,
        name: product.name,
        code: product.code,
        description: product.description,
        category: product.category || product.categoryName,
        categoryName: product.category || product.categoryName,
        brand: product.brand || 'N/A',
        basePrice: product.basePrice || 0,
        unitPrice: product.basePrice || 0, // Alias para compatibilidad
        quantity,
        totalPrice: (product.basePrice || 0) * quantity,
        image: product.image || '/api/placeholder/80/60',
        compatibility: product.compatibility || [],
        accessories: product.accessories || [],
        selectedAccessories: selectedAccessories || [],
        specifications: product.specifications || {},
        // Información adicional para la cotización
        stock: product.stock || null,
        warranty: product.warranty || null,
        supplier: product.supplier || null
      };
      
      setCartItems([...cartItems, newItem]);
    }
  };

  const removeFromCart = (productId) => {
    console.log('Removing from cart:', productId);
    setCartItems(cartItems.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    console.log('Updating quantity:', { productId, quantity });
    
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCartItems(cartItems.map(item =>
      item.id === productId
        ? { 
            ...item, 
            quantity, 
            totalPrice: item.basePrice * quantity 
          }
        : item
    ));
  };

  const updateItemPrice = (productId, newPrice) => {
    console.log('Updating item price:', { productId, newPrice });
    
    setCartItems(cartItems.map(item =>
      item.id === productId
        ? { 
            ...item, 
            basePrice: newPrice,
            unitPrice: newPrice,
            totalPrice: newPrice * item.quantity 
          }
        : item
    ));
  };

  const clearCart = () => {
    console.log('Clearing cart');
    setCartItems([]);
    // Opcionalmente también limpiar la información de cotización
    // setQuoteInfo({
    //   clientId: null,
    //   clientName: '',
    //   company: '',
    //   email: '',
    //   phone: '',
    //   clientContact: '',
    //   clientAddress: '',
    //   clientPosition: ''
    // });
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + item.totalPrice, 0);
  };

  const getCartSubtotal = () => {
    return getCartTotal();
  };

  const getCartTax = () => {
    return getCartSubtotal() * 0.16; // 16% IVA
  };

  const getCartTotalWithTax = () => {
    return getCartSubtotal() + getCartTax();
  };

  const getItemCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getUniqueItemCount = () => {
    return cartItems.length;
  };

  // Función para obtener el resumen completo del carrito
  const getCartSummary = () => {
    const subtotal = getCartSubtotal();
    const tax = getCartTax();
    const total = getCartTotalWithTax();
    const itemCount = getItemCount();
    const uniqueItems = getUniqueItemCount();

    return {
      subtotal,
      tax,
      total,
      itemCount,
      uniqueItems,
      items: cartItems
    };
  };

  // Función para validar el carrito antes de crear cotización
  const validateCart = () => {
    const errors = [];

    if (cartItems.length === 0) {
      errors.push('El carrito está vacío');
    }

    cartItems.forEach((item, index) => {
      if (!item.basePrice || item.basePrice <= 0) {
        errors.push(`Producto ${index + 1} (${item.name}): Precio inválido`);
      }
      
      if (!item.quantity || item.quantity <= 0) {
        errors.push(`Producto ${index + 1} (${item.name}): Cantidad inválida`);
      }

      if (!item.name || !item.code) {
        errors.push(`Producto ${index + 1}: Información incompleta`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors
    };
  };

  // Función para preparar datos para la API de cotización
  const prepareQuoteData = () => {
    const cartSummary = getCartSummary();
    
    return {
      clientInfo: quoteInfo,
      products: cartItems.map(item => ({
        productId: item.id,
        code: item.code,
        name: item.name,
        brand: item.brand,
        category: item.category,
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.basePrice,
        totalPrice: item.totalPrice,
        compatibility: item.compatibility,
        accessories: item.selectedAccessories || []
      })),
      summary: cartSummary,
      totals: {
        subtotal: cartSummary.subtotal,
        tax: cartSummary.tax,
        total: cartSummary.total
      }
    };
  };

  // Función para buscar un producto en el carrito
  const findCartItem = (productId) => {
    return cartItems.find(item => item.id === productId);
  };

  // Función para verificar si un producto está en el carrito
  const isInCart = (productId) => {
    return cartItems.some(item => item.id === productId);
  };

  const value = {
    // Estado
    cartItems,
    quoteInfo,
    
    // Setters
    setQuoteInfo,
    
    // Funciones de manipulación del carrito
    addToCart,
    removeFromCart,
    updateQuantity,
    updateItemPrice,
    clearCart,
    
    // Funciones de cálculo
    getCartTotal,
    getCartSubtotal,
    getCartTax,
    getCartTotalWithTax,
    getItemCount,
    getUniqueItemCount,
    getCartSummary,
    
    // Funciones de utilidad
    validateCart,
    prepareQuoteData,
    findCartItem,
    isInCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};