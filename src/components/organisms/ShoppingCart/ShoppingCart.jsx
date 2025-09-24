import React from 'react';
import { ArrowLeft, ShoppingBag } from 'lucide-react';
import CartItem from '../../molecules/CartItem';
import CartSummary from '../../molecules/CartSummary';
import Button from '../../atoms/Button';
import Card from '../../atoms/Card';
import ProductImage from '../../atoms/ProductImage';
import { useCart } from '../../../context/CartContext';

const ShoppingCart = ({ onBack, onProceedToQuote }) => {
  const { cartItems, clearCart } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header vacío con gradiente profesional - RESPONSIVE */}
        <div className="bg-gradient-to-r from-slate-700 to-slate-800 text-white shadow-xl">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
              <Button 
                variant="ghost" 
                onClick={onBack}
                className="flex items-center space-x-1 sm:space-x-2 text-white hover:bg-white/10 border-white/20 px-2 sm:px-4 py-2 self-start"
              >
                <ArrowLeft size={16} className="sm:w-5 sm:h-5" />
                <span className="text-sm sm:text-base">Volver al Catálogo</span>
              </Button>
              <div className="flex items-center space-x-2 sm:space-x-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 backdrop-blur-sm rounded-lg sm:rounded-xl flex items-center justify-center border border-white/30">
                  <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="min-w-0">
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight">Carrito de Cotización</h1>
                  <p className="text-slate-200 text-xs sm:text-sm font-medium hidden sm:block">
                    SISTEMA DE COTIZACIÓN MÉDICA
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contenido vacío - RESPONSIVE */}
        <div className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-12">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl border border-gray-200 p-6 sm:p-12 text-center">
            <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-br from-slate-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <ShoppingBag className="w-8 h-8 sm:w-12 sm:h-12 text-slate-600" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">
              Tu carrito está vacío
            </h3>
            <p className="text-gray-600 text-base sm:text-lg mb-6 sm:mb-8 max-w-md mx-auto">
              Agrega productos médicos al carrito para generar una cotización profesional
            </p>
            <Button 
              onClick={onBack}
              className="w-full sm:w-auto bg-gradient-to-r from-slate-600 to-blue-700 hover:from-slate-700 hover:to-blue-800 text-white px-6 sm:px-8 py-3 text-base sm:text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200"
            >
               Explorar Catálogo
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header profesional con gradiente - RESPONSIVE */}
      <div className="bg-gradient-to-r from-slate-700 to-slate-800 text-white shadow-xl">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Button 
                variant="ghost" 
                onClick={onBack}
                className="flex items-center space-x-1 sm:space-x-2 text-white hover:bg-white/10 border-white/20 px-2 sm:px-4 py-2"
              >
                <ArrowLeft size={16} className="sm:w-5 sm:h-5" />
                <span className="text-sm sm:text-base">
                  <span className="sm:hidden">Volver</span>
                  <span className="hidden sm:inline">Continuar Comprando</span>
                </span>
              </Button>
              <div className="flex items-center space-x-2 sm:space-x-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 backdrop-blur-sm rounded-lg sm:rounded-xl flex items-center justify-center border border-white/30">
                  <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="min-w-0">
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight">
                    <span className="sm:hidden">Carrito</span>
                    <span className="hidden sm:inline">Carrito de Cotización</span>
                  </h1>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mt-1">
                    <p className="text-slate-200 text-xs sm:text-sm font-medium hidden lg:block">
                      SISTEMA DE COTIZACIÓN MÉDICA
                    </p>
                    <span className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-medium bg-white/20 text-white self-start">
                      {cartItems.length} {cartItems.length === 1 ? 'producto' : 'productos'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal - RESPONSIVE */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="flex flex-col lg:grid lg:grid-cols-3 lg:gap-8 space-y-6 lg:space-y-0">
          
          {/* Summary móvil - Mostrar primero en móvil */}
          <div className="lg:hidden">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 sticky top-0 z-10">
              <CartSummary />
              <div className="p-4 border-t border-gray-200">
                <Button 
                  onClick={onProceedToQuote}
                  className="w-full bg-gradient-to-r from-slate-600 to-blue-700 hover:from-slate-700 hover:to-blue-800 text-white py-3 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                >
                   Generar Cotización
                </Button>
              </div>
            </div>
          </div>

          {/* Cart Items - Responsive */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center">
                <span className="w-2 h-2 sm:w-3 sm:h-3 bg-indigo-500 rounded-full mr-2 sm:mr-3"></span>
                <span className="text-base sm:text-xl">Productos en tu carrito</span>
              </h2>
              <div className="space-y-3 sm:space-y-4">
                {cartItems.map(item => (
                  <CartItem key={item.id} item={item} />
                ))}
              </div>
            </div>
          </div>

          {/* Summary desktop - Solo desktop */}
          <div className="hidden lg:block space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 sticky top-4">
              <CartSummary />
              <div className="p-6 border-t border-gray-200">
                <Button 
                  onClick={onProceedToQuote}
                  className="w-full bg-gradient-to-r from-slate-600 to-blue-700 hover:from-slate-700 hover:to-blue-800 text-white py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                >
                   Generar Cotización
                </Button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;
