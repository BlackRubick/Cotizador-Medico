import React from 'react';
import { X, Building, MapPin, Settings, Calendar, Package, User, Phone, Mail, Briefcase } from 'lucide-react';

const ClientEquipmentModal = ({ client, isOpen, onClose }) => {
  if (!isOpen || !client) return null;

  // Función para formatear fechas
  const formatDate = (dateString) => {
    if (!dateString) return 'No especificada';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-MX', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  // Función para obtener color de estado
  const getStatusColor = (status) => {
    if (!status) return 'bg-gray-100 text-gray-800';
    
    const statusLower = status.toLowerCase();
    if (statusLower.includes('activo') || statusLower.includes('terminado')) {
      return 'bg-green-100 text-green-800 border-green-200';
    }
    if (statusLower.includes('pendiente')) {
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
    if (statusLower.includes('inactivo') || statusLower.includes('mantenimiento')) {
      return 'bg-red-100 text-red-800 border-red-200';
    }
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
          <div className="flex items-center space-x-3">
            <Building className="w-8 h-8" />
            <div>
              <h2 className="text-xl font-bold">{client.hospital || 'Hospital'}</h2>
              <p className="text-blue-100">{client.dependencia || 'Información del Hospital'}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-blue-600 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Información de la Empresa */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center space-x-2 mb-3">
                <Building className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-blue-800">Información de la Empresa</h3>
              </div>
              <div className="space-y-2">
                <div>
                  <span className="text-sm text-blue-600 font-medium">Empresa Responsable:</span>
                  <p className="text-gray-800 font-semibold">{client.empresaResponsable || 'No especificado'}</p>
                </div>
                <div>
                  <span className="text-sm text-blue-600 font-medium">Dependencia:</span>
                  <p className="text-gray-700">{client.dependencia || 'No especificado'}</p>
                </div>
                <div>
                  <span className="text-sm text-blue-600 font-medium">Hospital:</span>
                  <p className="text-gray-800 font-semibold">{client.hospital || 'No especificado'}</p>
                </div>
                <div>
                  <span className="text-sm text-blue-600 font-medium">Contrato:</span>
                  <p className="text-gray-700">{client.contrato || 'No especificado'}</p>
                </div>
              </div>
            </div>

            {/* Ubicación */}
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="flex items-center space-x-2 mb-3">
                <MapPin className="w-5 h-5 text-green-600" />
                <h3 className="text-lg font-semibold text-green-800">Ubicación</h3>
              </div>
              <div className="space-y-2">
                <div>
                  <span className="text-sm text-green-600 font-medium">Estado:</span>
                  <p className="text-gray-800">{client.estado || 'No especificado'}</p>
                </div>
                <div>
                  <span className="text-sm text-green-600 font-medium">Ciudad:</span>
                  <p className="text-gray-800">{client.ciudad || 'No especificado'}</p>
                </div>
                <div>
                  <span className="text-sm text-green-600 font-medium">Código Postal:</span>
                  <p className="text-gray-800">{client.codigoPostal || 'No especificado'}</p>
                </div>
                <div>
                  <span className="text-sm text-green-600 font-medium">Dirección:</span>
                  <p className="text-gray-800">{client.direccion || 'No especificado'}</p>
                </div>
              </div>
            </div>

            {/* Equipo Biomédico */}
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <div className="flex items-center space-x-2 mb-3">
                <Settings className="w-5 h-5 text-purple-600" />
                <h3 className="text-lg font-semibold text-purple-800">Equipo Biomédico</h3>
              </div>
              <div className="space-y-2">
                <div>
                  <span className="text-sm text-purple-600 font-medium">Tipo de Equipo:</span>
                  <p className="text-gray-800 font-semibold">{client.equipo || 'No especificado'}</p>
                </div>
                <div>
                  <span className="text-sm text-purple-600 font-medium">Marca:</span>
                  <p className="text-gray-800">{client.marca || 'No especificado'}</p>
                </div>
                <div>
                  <span className="text-sm text-purple-600 font-medium">Modelo:</span>
                  <p className="text-gray-800">{client.modelo || 'No especificado'}</p>
                </div>
                <div>
                  <span className="text-sm text-purple-600 font-medium">Número de Serie:</span>
                  <p className="text-gray-800 font-mono bg-white px-2 py-1 rounded border">
                    {client.numeroSerie || 'No especificado'}
                  </p>
                </div>
              </div>
            </div>

            {/* Fechas Importantes */}
            <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
              <div className="flex items-center space-x-2 mb-3">
                <Calendar className="w-5 h-5 text-orange-600" />
                <h3 className="text-lg font-semibold text-orange-800">Fechas Importantes</h3>
              </div>
              <div className="space-y-2">
                <div>
                  <span className="text-sm text-orange-600 font-medium">Fecha de Instalación:</span>
                  <p className="text-gray-800">{formatDate(client.fechaInstalacion)}</p>
                </div>
                <div>
                  <span className="text-sm text-orange-600 font-medium">Último Mantenimiento:</span>
                  <p className="text-gray-800">{formatDate(client.ultimoMantenimiento)}</p>
                </div>
              </div>
            </div>

            {/* NUEVA SECCIÓN: Encargados del Hospital */}
            <div className="lg:col-span-2 bg-teal-50 p-4 rounded-lg border border-teal-200">
              <div className="flex items-center space-x-2 mb-4">
                <User className="w-5 h-5 text-teal-600" />
                <h3 className="text-lg font-semibold text-teal-800">
                  Encargados del Hospital
                  <span className="ml-2 text-sm font-normal text-teal-600">
                    ({client.encargados?.length || 0} contactos)
                  </span>
                </h3>
              </div>
              
              {client.encargados && client.encargados.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {client.encargados.map((encargado, index) => (
                    <div key={encargado.id || index} className="bg-white p-4 rounded-lg border border-teal-100 shadow-sm">
                      <div className="flex items-start space-x-3">
                        <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <User className="w-6 h-6 text-teal-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-800 truncate">
                            {encargado.nombre || 'Nombre no especificado'}
                          </h4>
                          
                          {encargado.cargo && (
                            <div className="flex items-center space-x-1 mt-1">
                              <Briefcase className="w-3 h-3 text-teal-500" />
                              <p className="text-sm text-teal-700 font-medium truncate">
                                {encargado.cargo}
                              </p>
                            </div>
                          )}
                          
                          <div className="mt-2 space-y-1">
                            {encargado.telefono && (
                              <div className="flex items-center space-x-2">
                                <Phone className="w-3 h-3 text-gray-500 flex-shrink-0" />
                                <span className="text-xs text-gray-600 truncate">
                                  {encargado.telefono}
                                </span>
                              </div>
                            )}
                            
                            {encargado.email && (
                              <div className="flex items-center space-x-2">
                                <Mail className="w-3 h-3 text-gray-500 flex-shrink-0" />
                                <span className="text-xs text-gray-600 truncate">
                                  {encargado.email}
                                </span>
                              </div>
                            )}
                          </div>
                          
                          {encargado.fechaRegistro && (
                            <div className="mt-2 pt-2 border-t border-gray-100">
                              <p className="text-xs text-gray-400">
                                Registrado: {formatDate(encargado.fechaRegistro)}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-white rounded-lg border border-teal-100">
                  <User className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 font-medium">No hay encargados registrados</p>
                  <p className="text-gray-400 text-sm mt-1">
                    Los contactos del hospital aparecerán aquí cuando sean agregados
                  </p>
                </div>
              )}
            </div>

            {/* Estado del Equipo */}
            {(client.estatusAbril2025 || client.estatusInicio26) && (
              <div className="lg:col-span-2 bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex items-center space-x-2 mb-3">
                  <Package className="w-5 h-5 text-gray-600" />
                  <h3 className="text-lg font-semibold text-gray-800">Estado del Equipo</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {client.estatusAbril2025 && (
                    <div className="bg-white p-3 rounded-lg border">
                      <span className="text-sm text-gray-600 font-medium">Estado Abril 2025:</span>
                      <div className="mt-1">
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(client.estatusAbril2025)}`}>
                          {client.estatusAbril2025}
                        </span>
                      </div>
                    </div>
                  )}
                  
                  {client.estatusInicio26 && (
                    <div className="bg-white p-3 rounded-lg border">
                      <span className="text-sm text-gray-600 font-medium">Estado Inicio 2026:</span>
                      <div className="mt-1">
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(client.estatusInicio26)}`}>
                          {client.estatusInicio26}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Footer */}
        <div className="border-t bg-gray-50 px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              {client.fechaCreacion && (
                <span>Registrado el {formatDate(client.fechaCreacion)}</span>
              )}
            </div>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientEquipmentModal;