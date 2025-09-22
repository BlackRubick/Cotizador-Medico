import React from 'react';
import { X, Building2, MapPin, Calendar, Settings, Wrench } from 'lucide-react';

const ClientEquipmentModal = ({ client, isOpen, onClose }) => {
  if (!isOpen || !client) return null;

  const formatDate = (dateString) => {
    if (!dateString) return 'No especificada';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-MX', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  };

  const getStatusColor = (status) => {
    if (!status) return 'bg-gray-100 text-gray-800';
    
    const statusLower = status.toLowerCase();
    if (statusLower.includes('activo') || statusLower.includes('terminado')) {
      return 'bg-green-100 text-green-800';
    }
    if (statusLower.includes('pendiente')) {
      return 'bg-yellow-100 text-yellow-800';
    }
    if (statusLower.includes('inactivo') || statusLower.includes('cancelado')) {
      return 'bg-red-100 text-red-800';
    }
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Detalles del Equipo Médico</h2>
            <p className="text-sm text-gray-500 mt-1">Información completa del equipo biomédico</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Información de la Empresa */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center mb-3">
              <Building2 className="text-blue-600 mr-2" size={20} />
              <h3 className="text-lg font-semibold text-blue-900">Información de la Empresa</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Empresa Responsable:</label>
                <p className="font-semibold text-gray-900">{client.empresaResponsable || 'No especificado'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Dependencia:</label>
                <p className="font-semibold text-gray-900">{client.dependencia || 'No especificado'}</p>
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-600">Hospital:</label>
                <p className="font-semibold text-gray-900">{client.hospital || 'No especificado'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Contrato:</label>
                <p className="font-mono text-sm text-gray-900">{client.contrato || 'No especificado'}</p>
              </div>
            </div>
          </div>

          {/* Ubicación */}
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center mb-3">
              <MapPin className="text-green-600 mr-2" size={20} />
              <h3 className="text-lg font-semibold text-green-900">Ubicación</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Estado:</label>
                <p className="font-semibold text-gray-900">{client.estado || 'No especificado'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Ciudad:</label>
                <p className="font-semibold text-gray-900">{client.ciudad || 'No especificado'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Código Postal:</label>
                <p className="font-mono text-gray-900">{client.codigoPostal || 'No especificado'}</p>
              </div>
              <div className="md:col-span-3">
                <label className="text-sm font-medium text-gray-600">Dirección:</label>
                <p className="text-gray-900">{client.direccion || 'No especificado'}</p>
              </div>
            </div>
          </div>

          {/* Información del Equipo */}
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center mb-3">
              <Settings className="text-purple-600 mr-2" size={20} />
              <h3 className="text-lg font-semibold text-purple-900">Equipo Biomédico</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Tipo de Equipo:</label>
                <p className="font-semibold text-gray-900">{client.equipo || 'No especificado'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Marca:</label>
                <p className="font-semibold text-gray-900">{client.marca || 'No especificado'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Modelo:</label>
                <p className="font-mono text-gray-900">{client.modelo || 'No especificado'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Número de Serie:</label>
                <p className="font-mono bg-gray-100 px-2 py-1 rounded text-gray-900">
                  {client.numeroSerie || 'No especificado'}
                </p>
              </div>
            </div>
          </div>

          {/* Fechas y Mantenimiento */}
          <div className="bg-orange-50 p-4 rounded-lg">
            <div className="flex items-center mb-3">
              <Calendar className="text-orange-600 mr-2" size={20} />
              <h3 className="text-lg font-semibold text-orange-900">Fechas Importantes</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Fecha de Instalación:</label>
                <p className="font-semibold text-gray-900">{formatDate(client.fechaInstalacion)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Último Mantenimiento:</label>
                <p className="font-semibold text-gray-900">{formatDate(client.ultimoMantenimiento)}</p>
              </div>
            </div>
          </div>

          {/* Estatus */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center mb-3">
              <Wrench className="text-gray-600 mr-2" size={20} />
              <h3 className="text-lg font-semibold text-gray-900">Estado del Equipo</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Estatus Abril 2025:</label>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-1 ${getStatusColor(client.estatusAbril2025)}`}>
                  {client.estatusAbril2025 || 'No especificado'}
                </span>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Estatus Inicio 2026:</label>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-1 ${getStatusColor(client.estatusInicio26)}`}>
                  {client.estatusInicio26 || 'No especificado'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClientEquipmentModal;