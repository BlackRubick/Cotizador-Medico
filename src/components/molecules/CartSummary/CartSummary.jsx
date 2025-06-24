import React from 'react';
import PriceTag from '../../atoms/PriceTag';
import { useCart } from '../../../context/CartContext';

const CartSummary = ({ showDetails = true }) => {
  const { cartItems, getCartTotal, getItemCount } = useCart();

  const subtotal = getCartTotal();
  const tax = subtotal * 0.16; // 16% IVA
  const total = subtotal + tax;

  return (
    <div className="bg-white rounded-lg border p-6 space-y-4">
      <h3 className="font-semibold text-lg">Resumen</h3>
      
      {showDetails && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Artículos ({getItemCount()})</span>
            <PriceTag price={subtotal} />
          </div>
          <div className="flex justify-between text-sm">
            <span>IVA (16%)</span>
            <PriceTag price={tax} />
          </div>
          <hr />
        </div>
      )}
      
      <div className="flex justify-between font-semibold text-lg">
        <span>Total</span>
        <PriceTag price={total} className="text-xl" />
      </div>
      
      <div className="text-xs text-gray-500 mt-2">
        Material: {getItemCount()} productos
      </div>
    </div>
  );
};

export default CartSummary;
