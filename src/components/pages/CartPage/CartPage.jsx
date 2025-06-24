import React from 'react';
import { useNavigate } from 'react-router-dom';
import ShoppingCart from '../../organisms/ShoppingCart';

const CartPage = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/cotizar');
  };

  const handleProceedToQuote = () => {
    navigate('/cotizar/generar');
  };

  return (
    <ShoppingCart 
      onBack={handleBack}
      onProceedToQuote={handleProceedToQuote}
    />
  );
};

export default CartPage;
