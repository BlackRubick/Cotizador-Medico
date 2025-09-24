import React from 'react';
import { Trash2 } from 'lucide-react';
import QuantitySelector from '../../atoms/QuantitySelector';
import PriceTag from '../../atoms/PriceTag';
import { useCart } from '../../../context/CartContext';

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 p-3 sm:p-4 bg-white rounded-lg border">
      
      {/* Header móvil con imagen, título y eliminar */}
      <div className="flex items-start space-x-3 sm:space-x-0">
        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
          <img 
            src={item.image} 
            alt={item.name}
            className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
            onError={(e) => {
              e.target.src = `data:image/svg+xml;base64,${btoa(`
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="48" height="48" fill="#E5E7EB"/>
                  <text x="24" y="24" text-anchor="middle" dominant-baseline="middle" fill="#9CA3AF" font-size="8">IMG</text>
                </svg>
              `)}`;
            }}
          />
        </div>
        
        {/* Info del producto */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="min-w-0 flex-1">
              <h4 className="font-medium text-gray-800 text-sm sm:text-base line-clamp-2 leading-tight">
                {item.name}
              </h4>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">{item.code}</p>
              <div className="mt-1 sm:hidden">
                <PriceTag price={item.basePrice} className="text-xs" />
                <span className="text-xs text-gray-400 ml-1">c/u</span>
              </div>
            </div>
            
            {/* Botón eliminar - móvil */}
            <button
              onClick={() => removeFromCart(item.id)}
              className="sm:hidden p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors ml-2"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Precio unitario - solo desktop */}
      <div className="hidden sm:block sm:min-w-0">
        <PriceTag price={item.basePrice} className="text-sm" />
      </div>
      
      {/* Controles de cantidad y precio total - responsive */}
      <div className="flex items-center justify-between sm:justify-end sm:space-x-4">
        <QuantitySelector
          quantity={item.quantity}
          onDecrease={() => updateQuantity(item.id, item.quantity - 1)}
          onIncrease={() => updateQuantity(item.id, item.quantity + 1)}
        />
        
        <div className="text-right">
          <PriceTag price={item.totalPrice} className="text-base sm:text-lg font-semibold" />
          <p className="text-xs text-gray-500 sm:hidden">Total</p>
        </div>
      </div>
      
      {/* Botón eliminar - solo desktop */}
      <button
        onClick={() => removeFromCart(item.id)}
        className="hidden sm:block p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
};

export default CartItem;
