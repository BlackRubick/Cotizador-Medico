import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../../../context/CartContext';
import { useNavigate } from 'react-router-dom';

const CartIcon = () => {
  const { getItemCount } = useCart();
  const navigate = useNavigate();
  const itemCount = getItemCount();

  if (itemCount === 0) return null;

  return (
    <button
      onClick={() => navigate('/cotizar/carrito')}
      className="fixed bottom-6 right-6 bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 transition-colors z-50"
    >
      <div className="relative">
        <ShoppingCart size={24} />
        {itemCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {itemCount > 9 ? '9+' : itemCount}
          </span>
        )}
      </div>
    </button>
  );
};

export default CartIcon;
