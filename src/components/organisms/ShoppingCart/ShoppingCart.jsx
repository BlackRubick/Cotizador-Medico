import React from 'react';
import { ArrowLeft, ShoppingBag } from 'lucide-react';
import CartItem from '../../molecules/CartItem';
import CartSummary from '../../molecules/CartSummary';
import Button from '../../atoms/Button';
import Card from '../../atoms/Card';
import { useCart } from '../../../context/CartContext';

const ShoppingCart = ({ onBack, onProceedToQuote }) => {
  const { cartItems, clearCart } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="flex items-center space-x-2"
          >
            <ArrowLeft size={20} />
            <span>Volver al Catálogo</span>
          </Button>
          <h1 className="text-2xl font-bold text-gray-800">Carrito de Cotización</h1>
        </div>

        <Card className="text-center py-12">
          <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Tu carrito está vacío
          </h3>
          <p className="text-gray-500 mb-6">
            Agrega productos al carrito para generar una cotización
          </p>
          <Button onClick={onBack}>
            Explorar Productos
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="flex items-center space-x-2"
          >
            <ArrowLeft size={20} />
            <span>Continuar Comprando</span>
          </Button>
          <h1 className="text-2xl font-bold text-gray-800">Carrito de Cotización</h1>
        </div>
        <Button 
          variant="secondary" 
          onClick={clearCart}
          className="text-red-600 hover:bg-red-50"
        >
          Limpiar Carrito
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map(item => (
            <CartItem key={item.id} item={item} />
          ))}
        </div>

        {/* Summary */}
        <div className="space-y-4">
          <CartSummary />
          <Button 
            onClick={onProceedToQuote}
            className="w-full"
          >
            Proceder a Cotización
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;
