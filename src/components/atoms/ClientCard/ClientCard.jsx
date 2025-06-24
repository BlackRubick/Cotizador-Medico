import React from 'react';
import { Building, Mail, Phone, MapPin } from 'lucide-react';

const ClientCard = ({ client, onClick, className = '' }) => {
  return (
    <div 
      onClick={onClick}
      className={`bg-white rounded-xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-shadow duration-200 border ${className}`}
    >
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Building className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-800">{client.nombre}</h3>
              <p className="text-sm text-gray-500">{client.tipo || 'Cliente'}</p>
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-gray-600">
            <Mail size={16} />
            <span className="text-sm">{client.email}</span>
          </div>
          
          <div className="flex items-center space-x-2 text-gray-600">
            <Phone size={16} />
            <span className="text-sm">{client.telefono}</span>
          </div>
          
          {client.direccion && (
            <div className="flex items-center space-x-2 text-gray-600">
              <MapPin size={16} />
              <span className="text-sm">{client.direccion}</span>
            </div>
          )}
        </div>
        
        {client.contacto && (
          <div className="border-t pt-3">
            <p className="text-sm text-gray-500">Contacto principal:</p>
            <p className="font-medium text-gray-700">{client.contacto}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientCard;
