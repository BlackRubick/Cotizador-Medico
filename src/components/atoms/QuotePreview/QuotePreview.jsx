import React from 'react';
import { FileText, Calendar, User, Building } from 'lucide-react';

const QuotePreview = ({ quote, onClick, className = '' }) => {
  return (
    <div 
      onClick={onClick}
      className={`bg-white rounded-xl shadow-lg border-2 border-purple-200 p-6 cursor-pointer hover:shadow-xl transition-all duration-200 ${className}`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <FileText className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-gray-800">COTIZACIÓN</h3>
            <p className="text-sm text-gray-500">Folio: {quote.folio}</p>
            <p className="text-sm text-gray-500">Productos: {quote.products?.length || 0}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">FECHA: {quote.fecha}</p>
          <p className="text-sm text-gray-500">ESTADO: {quote.estado}</p>
        </div>
      </div>
      
      <div className="space-y-2 mb-4">
        <div className="flex items-center space-x-2">
          <Building size={16} className="text-gray-400" />
          <span className="text-sm">
            <strong>Razón social:</strong> {quote.razonSocial}
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <User size={16} className="text-gray-400" />
          <span className="text-sm">
            <strong>Encargado:</strong> {quote.encargado}
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <Calendar size={16} className="text-gray-400" />
          <span className="text-sm">
            <strong>Puesto:</strong> {quote.puesto}
          </span>
        </div>
      </div>
      
      <div className="border-t pt-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">
            {quote.productos?.length || 0} productos
          </span>
          <span className="font-bold text-purple-600">
            ${quote.total?.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default QuotePreview;
