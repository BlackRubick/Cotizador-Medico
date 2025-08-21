// src/components/molecules/ClientEquipmentModal/ClientEquipmentModal.jsx
import React from 'react';
import { X, Activity, Stethoscope, Monitor, Heart, Thermometer, Calendar, MapPin, User, Wrench } from 'lucide-react';
import Button from '../../atoms/Button';
import Card from '../../atoms/Card';

// Datos mock de equipos biomédicos por cliente
const mockEquipments = {
  1: [ // Hospital General
    {
      id: 1,
      name: 'Monitor de Signos Vitales GE',
      model: 'CARESCAPE B450',
      serialNumber: 'GE2023-001',
      category: 'Monitoreo',
      brand: 'General Electric',
      installDate: '2023-01-15',
      lastMaintenance: '2024-01-10',
      status: 'Activo',
      location: 'UCI - Cama 3',
      specifications: [
        'Monitor multiparamétrico',
        'ECG de 12 derivaciones',
        'SpO2, NIBP, Temperatura',
        'Pantalla táctil 15"'
      ]
    },
    {
      id: 2,
      name: 'Desfibrilador Philips',
      model: 'HeartStart MRx',
      serialNumber: 'PH2022-045',
      category: 'Emergencia',
      brand: 'Philips',
      installDate: '2022-08-20',
      lastMaintenance: '2023-12-15',
      status: 'Activo',
      location: 'Emergencias',
      specifications: [
        'Desfibrilador/Monitor',
        'Marcapasos externo',
        'SpO2 y CO2',
        'Batería de larga duración'
      ]
    },
    {
      id: 3,
      name: 'Ventilador Mecánico',
      model: 'Hamilton-C3',
      serialNumber: 'HAM2023-012',
      category: 'Ventilación',
      brand: 'Hamilton Medical',
      installDate: '2023-03-10',
      lastMaintenance: '2024-01-05',
      status: 'Mantenimiento',
      location: 'UCI - Sala 2',
      specifications: [
        'Ventilación invasiva/no invasiva',
        'Modos avanzados',
        'Pantalla táctil',
        'Turbina de alta precisión'
      ]
    }
  ],
  2: [ // Clínica Especializada
    {
      id: 4,
      name: 'Electrocardiógrafo',
      model: 'MAC 2000',
      serialNumber: 'GE2023-078',
      category: 'Diagnóstico',
      brand: 'GE Healthcare',
      installDate: '2023-06-12',
      lastMaintenance: '2024-01-08',
      status: 'Activo',
      location: 'Consulta 1',
      specifications: [
        'ECG de 12 derivaciones',
        'Interpretación automática',
        'Conectividad WiFi',
        'Impresora térmica'
      ]
    },
    {
      id: 5,
      name: 'Oxímetro de Pulso',
      model: 'Masimo Rad-97',
      serialNumber: 'MAS2023-156',
      category: 'Monitoreo',
      brand: 'Masimo',
      installDate: '2023-09-05',
      lastMaintenance: '2023-12-20',
      status: 'Activo',
      location: 'Triage',
      specifications: [
        'SpO2 y frecuencia de pulso',
        'Tecnología SET',
        'Alarmas configurables',
        'Batería recargable'
      ]
    }
  ],
  3: [ // Laboratorio Médico Central
    {
      id: 6,
      name: 'Analizador Bioquímico',
      model: 'Cobas c311',
      serialNumber: 'ROC2023-089',
      category: 'Laboratorio',
      brand: 'Roche',
      installDate: '2023-04-18',
      lastMaintenance: '2024-01-12',
      status: 'Activo',
      location: 'Lab Principal',
      specifications: [
        'Análisis bioquímico automatizado',
        '300 pruebas/hora',
        'Refrigeración integrada',
        'Control de calidad automático'
      ]
    },
    {
      id: 7,
      name: 'Centrífuga de Laboratorio',
      model: 'Sigma 3-30KS',
      serialNumber: 'SIG2022-234',
      category: 'Laboratorio',
      brand: 'Sigma',
      installDate: '2022-11-22',
      lastMaintenance: '2023-11-20',
      status: 'Activo',
      location: 'Lab - Área de Preparación',
      specifications: [
        'Centrífuga refrigerada',
        '30,000 RPM máx',
        'Control digital',
        'Sistema de seguridad avanzado'
      ]
    }
  ]
};

const getEquipmentIcon = (category) => {
  switch (category.toLowerCase()) {
    case 'monitoreo':
      return <Monitor className="w-5 h-5" />;
    case 'emergencia':
      return <Heart className="w-5 h-5" />;
    case 'ventilación':
      return <Activity className="w-5 h-5" />;
    case 'diagnóstico':
      return <Stethoscope className="w-5 h-5" />;
    case 'laboratorio':
      return <Thermometer className="w-5 h-5" />;
    default:
      return <Monitor className="w-5 h-5" />;
  }
};

const getStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case 'activo':
      return 'bg-green-100 text-green-800';
    case 'mantenimiento':
      return 'bg-yellow-100 text-yellow-800';
    case 'fuera de servicio':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const ClientEquipmentModal = ({ client, isOpen, onClose }) => {
  if (!isOpen || !client) return null;

  // Obtener equipos del cliente (por ID)
  const equipments = mockEquipments[client.id] || [];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-blue-50">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Equipos Biomédicos</h2>
              <p className="text-blue-600 font-medium">{client.nombre || client.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {equipments.length === 0 ? (
            <div className="text-center py-12">
              <Activity className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                No hay equipos registrados
              </h3>
              <p className="text-gray-500">
                Este cliente no tiene equipos biomédicos registrados en el sistema.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-800">
                  {equipments.length} Equipos Registrados
                </h3>
                <div className="text-sm text-gray-500">
                  Última actualización: {new Date().toLocaleDateString('es-MX')}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {equipments.map((equipment) => (
                  <Card key={equipment.id} className="p-6 hover:shadow-lg transition-shadow">
                    <div className="space-y-4">
                      {/* Header del equipo */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                            {getEquipmentIcon(equipment.category)}
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-800">{equipment.name}</h4>
                            <p className="text-sm text-gray-500">{equipment.model}</p>
                          </div>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(equipment.status)}`}>
                          {equipment.status}
                        </span>
                      </div>

                      {/* Información básica */}
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Marca</p>
                          <p className="font-medium">{equipment.brand}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Serie</p>
                          <p className="font-medium">{equipment.serialNumber}</p>
                        </div>
                      </div>

                      {/* Ubicación y fechas */}
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-sm">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">Ubicación:</span>
                          <span className="font-medium">{equipment.location}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">Instalación:</span>
                          <span className="font-medium">{new Date(equipment.installDate).toLocaleDateString('es-MX')}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm">
                          <Wrench className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">Último Mantenimiento:</span>
                          <span className="font-medium">{new Date(equipment.lastMaintenance).toLocaleDateString('es-MX')}</span>
                        </div>
                      </div>

                      {/* Especificaciones */}
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-2">Especificaciones:</p>
                        <ul className="text-xs text-gray-500 space-y-1">
                          {equipment.specifications.map((spec, index) => (
                            <li key={index} className="flex items-center space-x-2">
                              <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
                              <span>{spec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
          <Button variant="secondary" onClick={onClose}>
            Cerrar
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            Exportar Lista
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ClientEquipmentModal;