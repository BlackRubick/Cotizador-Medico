import React from 'react';
import { useNavigate } from 'react-router-dom';
import QuoteBuilder from '../../organisms/QuoteBuilder';

const QuoteGeneratorPage = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/cotizar/carrito');
  };

  return (
    <QuoteBuilder onBack={handleBack} />
  );
};

export default QuoteGeneratorPage;
