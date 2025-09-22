import React from 'react';
import { Building, MapPin, Settings, Calendar } from 'lucide-react';

const ClientCard = ({ client, onClick, className = '' }) => {
  return (
    <div 
      onClick={onClick}
      className={`bg-white rounded-xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-shadow duration-200 border ${className}`}
    >
      <div className="space-y-4">
        {/* Header con hospital como título principal */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Building className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg text-gray-800 leading-tight">
                {client.hospital || 'Hospital no especificado'}
              </h3>
              <p className="text-sm text-blue-600 font-medium">
                {client.dependencia || 'Sin dependencia'}
              </p>
            </div>
          </div>
        </div>
        
        {/* Empresa responsable y ubicación */}
        <div className="space-y-3">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Empresa Responsable</p>
            <p className="font-semibold text-gray-800 text-sm leading-tight">
              {client.empresaResponsable || 'No especificado'}
            </p>
          </div>
          
          <div className="flex items-center space-x-2 text-gray-600">
            <MapPin size={14} />
            <span className="text-sm">
              {client.ciudad && client.estado 
                ? `${client.ciudad}, ${client.estado}`
                : 'Ubicación no especificada'
              }
            </span>
          </div>
        </div>
        
        {/* Información del equipo */}
        <div className="bg-purple-50 p-3 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Settings className="w-4 h-4 text-purple-600" />
            <span className="text-xs font-medium text-purple-800 uppercase tracking-wide">
              Equipo Biomédico
            </span>
          </div>
          <div className="space-y-1">
            <p className="font-semibold text-gray-800 text-sm">
              {client.equipo || 'No especificado'}
            </p>
            <div className="flex items-center justify-between text-xs text-gray-600">
              <span>{client.marca || 'Sin marca'}</span>
              <span className="font-mono bg-white px-2 py-1 rounded">
                {client.modelo || 'Sin modelo'}
              </span>
            </div>
          </div>
        </div>
        
        {/* Estatus */}
        {(client.estatusAbril2025 || client.estatusInicio26) && (
          <div className="border-t pt-3">
            <div className="flex items-center space-x-2 mb-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                Estado del Equipo
              </span>
            </div>
            <div className="space-y-1">
              {client.estatusAbril2025 && (
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Abril 2025:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    client.estatusAbril2025?.toLowerCase() === 'activo' ? 'bg-green-100 text-green-700' :
                    client.estatusAbril2025?.toLowerCase() === 'pendiente' ? 'bg-yellow-100 text-yellow-700' :
                    client.estatusAbril2025?.toLowerCase() === 'terminado' ? 'bg-green-100 text-green-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {client.estatusAbril2025}
                  </span>
                </div>
              )}
              {client.estatusInicio26 && (
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Inicio 2026:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    client.estatusInicio26?.toLowerCase() === 'terminado' ? 'bg-green-100 text-green-700' :
                    client.estatusInicio26?.toLowerCase() === 'pendiente' ? 'bg-yellow-100 text-yellow-700' :
                    client.estatusInicio26?.toLowerCase() === 'activo' ? 'bg-green-100 text-green-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {client.estatusInicio26}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientCard;
