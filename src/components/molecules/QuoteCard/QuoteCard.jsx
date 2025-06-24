import React from 'react';
import { Calendar, DollarSign, Building } from 'lucide-react';
import Card from '../../atoms/Card';
import StatusBadge from '../../atoms/StatusBadge';

const QuoteCard = ({ quote, onClick }) => {
  return (
    <Card className="cursor-pointer hover:shadow-xl transition-shadow duration-200" onClick={onClick}>
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-lg">{quote.razonSocial}</h3>
          <StatusBadge status={quote.estado} />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-gray-600">
            <Calendar size={16} />
            <span className="text-sm">{quote.fecha}</span>
          </div>
          
          <div className="flex items-center space-x-2 text-gray-600">
            <DollarSign size={16} />
            <span className="text-sm font-medium">${quote.precio}</span>
          </div>
          
          {quote.cliente && (
            <div className="flex items-center space-x-2 text-gray-600">
              <Building size={16} />
              <span className="text-sm">{quote.cliente}</span>
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
