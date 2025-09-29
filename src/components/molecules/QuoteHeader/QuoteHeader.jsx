import React from 'react';
import { Calendar, FileText, MapPin } from 'lucide-react';
import QuoteStatus from '../../atoms/QuoteStatus';

const QuoteHeader = ({ quote, editable = false, onUpdate }) => {
  const handleInputChange = (field, value) => {
    if (editable && onUpdate) {
      onUpdate({ ...quote, [field]: value });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
            <FileText className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              COTIZACIÓN
            </h1>
            <p className="text-gray-600">Folio: {quote.folio}</p>
            <p className="text-gray-600">Productos: {quote.products?.length || 0}</p>
          </div>
        </div>
        
        <div className="text-right">
          <div className="mb-2">
            <span className="text-sm text-gray-500">FECHA: </span>
            <span className="font-medium">{quote.fecha}</span>
          </div>
          <div className="mb-2">
            <span className="text-sm text-gray-500">ESTADO: </span>
            <QuoteStatus status={quote.estado} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Información del Cliente */}
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-800 border-b pb-2">
            Información del Cliente
          </h3>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Razón Social:
              </label>
              {editable ? (
                <input
                  type="text"
                  value={quote.razonSocial}
                  onChange={(e) => handleInputChange('razonSocial', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-gray-800">{quote.razonSocial}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Dirección:
              </label>
              {editable ? (
                <textarea
                  value={quote.direccion}
                  onChange={(e) => handleInputChange('direccion', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows="2"
                />
              ) : (
                <p className="text-gray-800">{quote.direccion}</p>
              )}
            </div>
          </div>
        </div>

        {/* Información del Contacto */}
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-800 border-b pb-2">
            Información de Contacto
          </h3>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Encargado:
              </label>
              {editable ? (
                <input
                  type="text"
                  value={quote.encargado}
                  onChange={(e) => handleInputChange('encargado', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-gray-800">{quote.encargado}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Puesto:
              </label>
              {editable ? (
                <input
                  type="text"
                  value={quote.puesto}
                  onChange={(e) => handleInputChange('puesto', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-gray-800">{quote.puesto}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Correo:
              </label>
              {editable ? (
                <input
                  type="email"
                  value={quote.correo}
                  onChange={(e) => handleInputChange('correo', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-gray-800">{quote.correo}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Número:
              </label>
              {editable ? (
                <input
                  type="tel"
                  value={quote.numero}
                  onChange={(e) => handleInputChange('numero', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-gray-800">{quote.numero}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuoteHeader;
