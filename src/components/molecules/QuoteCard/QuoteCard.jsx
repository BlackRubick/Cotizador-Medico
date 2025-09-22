import React from 'react';
import { Calendar, DollarSign, Building } from 'lucide-react';
import Card from '../../atoms/Card';
import StatusBadge from '../../atoms/StatusBadge';

const QuoteCard = ({ quote, onClick }) => {
  const clientName = quote.razonSocial || quote.clientInfoName || quote.cliente || 'Cliente no especificado';
  const total = quote.total || quote.precio || 0;
  const fecha = quote.fecha || quote.fechaCreacion || 'Sin fecha';
  const estado = quote.estado || quote.status || 'sin estado';
  const folio = quote.folio || 'Sin folio';
  
  // Formatear precio
  const formatPrice = (price) => {
    if (!price && price !== 0) return '$0';
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <Card className="cursor-pointer hover:shadow-xl transition-shadow duration-200 relative overflow-hidden" onClick={onClick}>
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg text-gray-800 line-clamp-2">{clientName}</h3>
            <p className="text-xs text-gray-500 font-mono">{folio}</p>
            {quote.estadoLocal && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 mt-1">
                LOCAL
              </span>
            )}
          </div>
          <StatusBadge status={estado} />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-gray-600">
            <Calendar size={16} />
            <span className="text-sm">{fecha}</span>
          </div>
          
          <div className="flex items-center space-x-2 text-gray-600">
            <DollarSign size={16} />
            <span className="text-sm font-medium">{formatPrice(total)}</span>
          </div>
          
          {(quote.encargado || quote.contacto || quote.clientContact) && (
            <div className="flex items-center space-x-2 text-gray-600">
              <Building size={16} />
              <span className="text-sm">{quote.encargado || quote.contacto || quote.clientContact}</span>
            </div>
          )}
        </div>
        
        {quote.descripcion && (
          <p className="text-sm text-gray-500 line-clamp-2">
            {quote.descripcion}
          </p>
        )}
        

      </div>
    </Card>
  );
};

export default QuoteCard;
