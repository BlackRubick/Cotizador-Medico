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
        {/* Header vacío con gradiente profesional */}
        <div className="bg-gradient-to-r from-slate-700 to-slate-800 text-white shadow-xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                onClick={onBack}
                className="flex items-center space-x-2 text-white hover:bg-white/10 border-white/20"
              >
                <ArrowLeft size={20} />
                <span>Volver al Catálogo</span>
              </Button>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30">
                  <ShoppingBag className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-extrabold tracking-tight">Carrito de Cotización</h1>
                  <p className="text-slate-200 text-sm font-medium">
                    SISTEMA DE COTIZACIÓN MÉDICA
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contenido vacío */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-12 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-12 h-12 text-slate-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Tu carrito está vacío
            </h3>
            <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
              Agrega productos médicos al carrito para generar una cotización profesional
            </p>
            <Button 
              onClick={onBack}
              className="bg-gradient-to-r from-slate-600 to-blue-700 hover:from-slate-700 hover:to-blue-800 text-white px-8 py-3 text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200"
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
      {/* Header profesional con gradiente */}
      <div className="bg-gradient-to-r from-slate-700 to-slate-800 text-white shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                onClick={onBack}
                className="flex items-center space-x-2 text-white hover:bg-white/10 border-white/20"
              >
                <ArrowLeft size={20} />
                <span>Continuar Comprando</span>
              </Button>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30">
                  <ShoppingBag className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-extrabold tracking-tight">Carrito de Cotización</h1>
                  <div className="flex items-center space-x-4 mt-1">
                    <p className="text-slate-200 text-sm font-medium">
                      SISTEMA DE COTIZACIÓN MÉDICA
                    </p>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/20 text-white">
                      {cartItems.length} {cartItems.length === 1 ? 'producto' : 'productos'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <span className="w-3 h-3 bg-indigo-500 rounded-full mr-3"></span>
                Productos en tu carrito
              </h2>
              <div className="space-y-4">
                {cartItems.map(item => (
                  <CartItem key={item.id} item={item} />
                ))}
              </div>
            </div>

          </div>

          {/* Summary */}
          <div className="space-y-6">
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
