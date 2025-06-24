import React from 'react';

const QuoteStatus = ({ status, className = '' }) => {
  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'confirmado':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelado':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'enviado':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'revisión':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusStyle(status)} ${className}`}>
      {status}
    </span>
  );
};

export default QuoteStatus;
