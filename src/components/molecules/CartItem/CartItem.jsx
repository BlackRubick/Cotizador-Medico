import React from 'react';
import { Trash2 } from 'lucide-react';
import QuantitySelector from '../../atoms/QuantitySelector';
import PriceTag from '../../atoms/PriceTag';
import { useCart } from '../../../context/CartContext';

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  return (
    <div className="flex items-center space-x-4 p-4 bg-white rounded-lg border">
      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
        <img 
          src={item.image} 
          alt={item.name}
          className="w-12 h-12 object-contain"
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
      
      <div className="flex-1">
        <h4 className="font-medium text-gray-800">{item.name}</h4>
        <p className="text-sm text-gray-500">{item.code}</p>
        <PriceTag price={item.basePrice} className="text-sm" />
      </div>
      
      <QuantitySelector
        quantity={item.quantity}
        onDecrease={() => updateQuantity(item.id, item.quantity - 1)}
        onIncrease={() => updateQuantity(item.id, item.quantity + 1)}
      />
      
      <div className="text-right">
        <PriceTag price={item.totalPrice} />
      </div>
      
      <button
        onClick={() => removeFromCart(item.id)}
        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
};

export default CartItem;
