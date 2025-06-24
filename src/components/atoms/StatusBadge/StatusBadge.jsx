import React from 'react';

const StatusBadge = ({ status, className = '' }) => {
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'activo':
      case 'confirmado':
      case 'completado':
        return 'bg-green-100 text-green-800';
      case 'pendiente':
      case 'en proceso':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelado':
      case 'rechazado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(status)} ${className}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
