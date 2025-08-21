// src/components/molecules/ClientEquipmentModal/ClientEquipmentModal.jsx - ACTUALIZADO
import React, { useState, useEffect } from 'react';
import { X, Activity, Plus, Edit, Trash2, AlertCircle, CheckCircle } from 'lucide-react';
import Button from '../../atoms/Button';
import Card from '../../atoms/Card';
import EquipmentForm from '../EquipmentForm';
import equipmentService from '../../services/equipmentService';

const ClientEquipmentModal = ({ client, isOpen, onClose }) => {
  const [equipments, setEquipments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [stats, setStats] = useState(null);

  // Cargar equipos cuando se abra el modal
  useEffect(() => {
    if (isOpen && client) {
      loadEquipments();
    }
  }, [isOpen, client]);

  const loadEquipments = async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log('🔄 Cargando equipos para cliente:', client.id);
      const response = await equipmentService.getClientEquipment(client.id);
      
      if (response.success) {
        const mappedEquipments = response.data.map(equipmentService.mapBackendToFrontend);
        setEquipments(mappedEquipments);
        
        // Calcular estadísticas
        const equipmentStats = equipmentService.getEquipmentStats(mappedEquipments);
        setStats(equipmentStats);
        
        console.log('✅ Equipos cargados:', mappedEquipments.length);
      } else {
        throw new Error(response.message || 'Error al cargar equipos');
      }
    } catch (err) {
      console.error('❌ Error loading equipments:', err);
      setError(err.message || 'Error al cargar los equipos');
      
      // Si no hay equipos o es un error 404, mostrar lista vacía
      if (err.message.includes('404') || err.message.includes('not found')) {
        setEquipments([]);
        setStats(equipmentService.getEquipmentStats([]));
        setError('');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEquipment = async (equipmentData, equipmentId = null) => {
    try {
      setError('');
      setSuccessMessage('');
      
      let response;
      
      if (equipmentId) {
        // Actualizar equipo existente
        console.log('🔄 Actualizando equipo:', equipmentId);
        response = await equipmentService.updateEquipment(equipmentId, equipmentData);
        
        if (response.success) {
          const updatedEquipment = equipmentService.mapBackendToFrontend(response.data);
          setEquipments(prev => 
            prev.map(eq => eq.id === equipmentId ? updatedEquipment : eq)
          );
          setSuccessMessage('Equipo actualizado exitosamente');
        }
      } else {
        // Crear nuevo equipo
        console.log('🔄 Creando nuevo equipo para cliente:', client.id);
        response = await equipmentService.createEquipment(client.id, equipmentData);
        
        if (response.success) {
          const newEquipment = equipmentService.mapBackendToFrontend(response.data);
          setEquipments(prev => [...prev, newEquipment]);
          setSuccessMessage('Equipo agregado exitosamente');
        }
      }
      
      if (!response.success) {
        throw new Error(response.message || 'Error al guardar equipo');
      }
      
      // Recalcular estadísticas
      const newStats = equipmentService.getEquipmentStats(equipments);
      setStats(newStats);
      
      // Cerrar formulario
      setShowForm(false);
      setEditingEquipment(null);
      
      // Limpiar mensaje después de 3 segundos
      setTimeout(() => setSuccessMessage(''), 3000);
      
    } catch (err) {
      console.error('❌ Error saving equipment:', err);
      throw err; // Re-lanzar para que el formulario lo maneje
    }
  };

  const handleEditEquipment = (equipment) => {
    setEditingEquipment(equipment);
    setShowForm(true);
  };

  const handleDeleteEquipment = async (equipment) => {
    if (!window.confirm(`¿Estás seguro de eliminar el equipo "${equipment.name}"?`)) {
      return;
    }

    try {
      setError('');
      
      console.log('🗑️ Eliminando equipo:', equipment.id);
      const response = await equipmentService.deleteEquipment(equipment.id);
      
      if (response.success) {
        setEquipments(prev => prev.filter(eq => eq.id !== equipment.id));
        setSuccessMessage('Equipo eliminado exitosamente');
        
        // Recalcular estadísticas
        const newEquipments = equipments.filter(eq => eq.id !== equipment.id);
        const newStats = equipmentService.getEquipmentStats(newEquipments);
        setStats(newStats);
        
        // Limpiar mensaje después de 3 segundos
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        throw new Error(response.message || 'Error al eliminar equipo');
      }
    } catch (err) {
      console.error('❌ Error deleting equipment:', err);
      setError(err.message || 'Error al eliminar el equipo');
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingEquipment(null);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800';
      case 'out_of_service':
        return 'bg-red-100 text-red-800';
      case 'retired':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'Activo';
      case 'maintenance':
        return 'Mantenimiento';
      case 'out_of_service':
        return 'Fuera de Servicio';
      case 'retired':
        return 'Retirado';
      default:
        return status;
    }
  };

  if (!isOpen || !client) return null;

  // Mostrar formulario si está activo
  if (showForm) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <EquipmentForm
          equipment={editingEquipment}
          clientId={client.id}
          onSave={handleSaveEquipment}
          onCancel={handleCloseForm}
          isEditing={!!editingEquipment}
        />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
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
          <div className="flex items-center space-x-2">
            <Button
              onClick={() => setShowForm(true)}
              className="flex items-center space-x-2 bg-green-600 hover:bg-green-700"
            >
              <Plus size={16} />
              <span>Agregar Equipo</span>
            </Button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={24} className="text-gray-500" />
            </button>
          </div>
        </div>

        {/* Mensajes */}
        <div className="p-6 pb-0">
          {successMessage && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start space-x-3">
              <CheckCircle className="text-green-500 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <h4 className="text-green-800 font-medium">Éxito</h4>
                <p className="text-green-700">{successMessage}</p>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
              <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <h4 className="text-red-800 font-medium">Error</h4>
                <p className="text-red-700">{error}</p>
                <Button 
                  onClick={loadEquipments} 
                  variant="secondary" 
                  className="mt-2"
                >
                  Reintentar
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Cargando equipos...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Estadísticas */}
              {stats && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card className="text-center p-4">
                    <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
                    <div className="text-sm text-gray-600">Total</div>
                  </Card>
                  <Card className="text-center p-4">
                    <div className="text-2xl font-bold text-green-600">{stats.active}</div>
                    <div className="text-sm text-gray-600">Activos</div>
                  </Card>
                  <Card className="text-center p-4">
                    <div className="text-2xl font-bold text-yellow-600">{stats.maintenance}</div>
                    <div className="text-sm text-gray-600">Mantenimiento</div>
                  </Card>
                  <Card className="text-center p-4">
                    <div className="text-2xl font-bold text-orange-600">{stats.needsMaintenance}</div>
                    <div className="text-sm text-gray-600">Próx. Mant.</div>
                  </Card>
                </div>
              )}

              {/* Lista de equipos */}
              {equipments.length === 0 ? (
                <div className="text-center py-12">
                  <Activity className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">
                    No hay equipos registrados
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Este cliente no tiene equipos biomédicos registrados en el sistema.
                  </p>
                  <Button 
                    onClick={() => setShowForm(true)}
                    className="flex items-center space-x-2"
                  >
                    <Plus size={16} />
                    <span>Agregar Primer Equipo</span>
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {equipments.map((equipment) => {
                    const maintenanceCheck = equipmentService.needsMaintenance(
                      equipment.lastMaintenance, 
                      equipment.maintenanceInterval
                    );

                    return (
                      <Card key={equipment.id} className="p-6 hover:shadow-lg transition-shadow">
                        <div className="space-y-4">
                          {/* Header del equipo con acciones */}
                          <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                                <Activity className="w-5 h-5" />
                              </div>
                              <div>
                                <h4 className="font-bold text-gray-800">{equipment.name}</h4>
                                <p className="text-sm text-gray-500">{equipment.model}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(equipment.status)}`}>
                                {getStatusLabel(equipment.status)}
                              </span>
                              <div className="flex space-x-1">
                                <button
                                  onClick={() => handleEditEquipment(equipment)}
                                  className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                                  title="Editar"
                                >
                                  <Edit size={16} />
                                </button>
                                <button
                                  onClick={() => handleDeleteEquipment(equipment)}
                                  className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                                  title="Eliminar"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </div>
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
                            <div>
                              <p className="text-gray-500">Categoría</p>
                              <p className="font-medium">{equipment.category}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Ubicación</p>
                              <p className="font-medium">{equipment.location}</p>
                            </div>
                          </div>

                          {/* Fechas importantes */}
                          <div className="space-y-2 text-sm">
                            {equipment.installDate && (
                              <div className="flex justify-between">
                                <span className="text-gray-500">Instalación:</span>
                                <span className="font-medium">{new Date(equipment.installDate).toLocaleDateString('es-MX')}</span>
                              </div>
                            )}
                            {equipment.lastMaintenance && (
                              <div className="flex justify-between">
                                <span className="text-gray-500">Último Mant.:</span>
                                <span className="font-medium">{new Date(equipment.lastMaintenance).toLocaleDateString('es-MX')}</span>
                              </div>
                            )}
                          </div>

                          {/* Alerta de mantenimiento */}
                          {maintenanceCheck.needed && (
                            <div className={`p-2 rounded-lg ${maintenanceCheck.overdue ? 'bg-red-50 border border-red-200' : 'bg-yellow-50 border border-yellow-200'}`}>
                              <p className={`text-xs ${maintenanceCheck.overdue ? 'text-red-700' : 'text-yellow-700'}`}>
                                {maintenanceCheck.overdue 
                                  ? `⚠️ Mantenimiento vencido (${Math.abs(maintenanceCheck.daysUntil)} días)`
                                  : `🔔 Mantenimiento próximo (${maintenanceCheck.daysUntil} días)`
                                }
                              </p>
                            </div>
                          )}

                          {/* Especificaciones (solo las primeras 3) */}
                          {equipment.specifications && equipment.specifications.length > 0 && (
                            <div>
                              <p className="text-sm font-medium text-gray-600 mb-1">Especificaciones:</p>
                              <ul className="text-xs text-gray-500 space-y-1">
                                {equipment.specifications.slice(0, 3).map((spec, index) => (
                                  <li key={index} className="flex items-center space-x-2">
                                    <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
                                    <span>{spec}</span>
                                  </li>
                                ))}
                                {equipment.specifications.length > 3 && (
                                  <li className="text-blue-600 font-medium">
                                    +{equipment.specifications.length - 3} más...
                                  </li>
                                )}
                              </ul>
                            </div>
                          )}
                        </div>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center p-6 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-600">
            {equipments.length > 0 && `${equipments.length} equipos registrados`}
          </div>
          <div className="flex space-x-3">
            <Button variant="secondary" onClick={onClose}>
              Cerrar
            </Button>
            {equipments.length > 0 && (
              <Button className="bg-blue-600 hover:bg-blue-700">
                Exportar Lista
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientEquipmentModal;