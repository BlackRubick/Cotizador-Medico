import React from 'react';

const PriceTag = ({ price, className = '' }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <span className={`font-bold text-blue-600 ${className}`}>
      {formatPrice(price)}
    </span>
  );
};

export default PriceTag;
