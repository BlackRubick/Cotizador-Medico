// src/components/molecules/EquipmentDetailView/EquipmentDetailView.jsx
import React, { useState } from 'react';
import { 
  X, Edit, Save, Trash2, Calendar, MapPin, Wrench, 
  Activity, AlertTriangle, CheckCircle, Clock 
} from 'lucide-react';
import Button from '../../atoms/Button';
import Card from '../../atoms/Card';
import Input from '../../atoms/Input';
import equipmentService from '../../services/equipmentService';

const EquipmentDetailView = ({ 
  equipment, 
  isOpen, 
  onClose, 
  onSave, 
  onDelete 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(equipment);
  const [loading, setLoading] = useState(false);

  const statusOptions = [
    { value: 'active', label: 'Activo', color: 'text-green-600', bg: 'bg-green-100' },
    { value: 'maintenance', label: 'En Mantenimiento', color: 'text-yellow-600', bg: 'bg-yellow-100' },
    { value: 'out_of_service', label: 'Fuera de Servicio', color: 'text-red-600', bg: 'bg-red-100' },
    { value: 'retired', label: 'Retirado', color: 'text-gray-600', bg: 'bg-gray-100' }
  ];

  const handleEdit = () => {
    setEditData(equipment);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditData(equipment);
    setIsEditing(false);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      await onSave(editData, equipment.id);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving equipment:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    if (window.confirm(`¿Estás seguro de eliminar el equipo "${equipment.name}"?`)) {
      onDelete(equipment);
      onClose();
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getStatusStyle = (status) => {
    const option = statusOptions.find(opt => opt.value === status);
    return option ? `${option.color} ${option.bg}` : 'text-gray-600 bg-gray-100';
  };

  const getStatusLabel = (status) => {
    const option = statusOptions.find(opt => opt.value === status);
    return option ? option.label : status;
  };

  // Verificar mantenimiento
  const maintenanceCheck = equipmentService.needsMaintenance(
    equipment.lastMaintenance, 
    equipment.maintenanceInterval
  );

  if (!isOpen || !equipment) return null;

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
              <h2 className="text-xl font-bold text-gray-800">
                {isEditing ? 'Editando Equipo' : 'Detalles del Equipo'}
              </h2>
              <p className="text-blue-600 font-medium">{equipment.name}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {!isEditing ? (
              <>
                <Button
                  onClick={handleEdit}
                  variant="secondary"
                  className="flex items-center space-x-2"
                >
                  <Edit size={16} />
                  <span>Editar</span>
                </Button>
                <Button
                  onClick={handleDelete}
                  variant="secondary"
                  className="flex items-center space-x-2 text-red-600 hover:bg-red-50"
                >
                  <Trash2 size={16} />
                  <span>Eliminar</span>
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={handleSave}
                  disabled={loading}
                  className="flex items-center space-x-2"
                >
                  <Save size={16} />
                  <span>{loading ? 'Guardando...' : 'Guardar'}</span>
                </Button>
                <Button
                  onClick={handleCancel}
                  variant="secondary"
                  disabled={loading}
                >
                  Cancelar
                </Button>
              </>
            )}
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} className="text-gray-500" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Información Principal */}
            <div className="space-y-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
                  Información General
                </h3>
                
                <div className="space-y-4">
                  {isEditing ? (
                    <>
                      <Input
                        label="Nombre del Equipo"
                        name="name"
                        value={editData.name}
                        onChange={handleChange}
                        disabled={loading}
                        required
                      />
                      <Input
                        label="Modelo"
                        name="model"
                        value={editData.model}
                        onChange={handleChange}
                        disabled={loading}
                        required
                      />
                      <Input
                        label="Número de Serie"
                        name="serialNumber"
                        value={editData.serialNumber}
                        onChange={handleChange}
                        disabled={loading}
                        required
                      />
                      <Input
                        label="Marca"
                        name="brand"
                        value={editData.brand}
                        onChange={handleChange}
                        disabled={loading}
                        required
                      />
                    </>
                  ) : (
                    <>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Modelo</label>
                        <p className="text-gray-800 font-medium">{equipment.model}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Número de Serie</label>
                        <p className="text-gray-800 font-medium">{equipment.serialNumber}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Marca</label>
                        <p className="text-gray-800 font-medium">{equipment.brand}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Categoría</label>
                        <p className="text-gray-800 font-medium">{equipment.category}</p>
                      </div>
                    </>
                  )}
                </div>
              </Card>

              {/* Estado y Ubicación */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2 flex items-center space-x-2">
                  <MapPin size={20} />
                  <span>Estado y Ubicación</span>
                </h3>
                
                <div className="space-y-4">
                  {isEditing ? (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
                        <select
                          name="status"
                          value={editData.status}
                          onChange={handleChange}
                          disabled={loading}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          {statusOptions.map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <Input
                        label="Ubicación"
                        name="location"
                        value={editData.location}
                        onChange={handleChange}
                        disabled={loading}
                        required
                      />
                    </>
                  ) : (
                    <>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Estado</label>
                        <div className="mt-1">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusStyle(equipment.status)}`}>
                            {getStatusLabel(equipment.status)}
                          </span>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Ubicación</label>
                        <p className="text-gray-800 font-medium">{equipment.location}</p>
                      </div>
                    </>
                  )}
                </div>
              </Card>
            </div>

            {/* Fechas y Mantenimiento */}
            <div className="space-y-6">
              {/* Alerta de Mantenimiento */}
              {maintenanceCheck.needed && (
                <Card className={`p-4 border-2 ${maintenanceCheck.overdue ? 'border-red-200 bg-red-50' : 'border-yellow-200 bg-yellow-50'}`}>
                  <div className="flex items-center space-x-3">
                    {maintenanceCheck.overdue ? (
                      <AlertTriangle className="text-red-600" size={24} />
                    ) : (
                      <Clock className="text-yellow-600" size={24} />
                    )}
                    <div>
                      <h4 className={`font-semibold ${maintenanceCheck.overdue ? 'text-red-800' : 'text-yellow-800'}`}>
                        {maintenanceCheck.overdue ? 'Mantenimiento Vencido' : 'Mantenimiento Próximo'}
                      </h4>
                      <p className={`text-sm ${maintenanceCheck.overdue ? 'text-red-700' : 'text-yellow-700'}`}>
                        {maintenanceCheck.overdue 
                          ? `Vencido hace ${Math.abs(maintenanceCheck.daysUntil)} días`
                          : `Faltan ${maintenanceCheck.daysUntil} días`
                        }
                      </p>
                    </div>
                  </div>
                </Card>
              )}

              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2 flex items-center space-x-2">
                  <Calendar size={20} />
                  <span>Fechas Importantes</span>
                </h3>
                
                <div className="space-y-4">
                  {isEditing ? (
                    <>
                      <Input
                        label="Fecha de Instalación"
                        name="installDate"
                        type="date"
                        value={editData.installDate}
                        onChange={handleChange}
                        disabled={loading}
                      />
                      <Input
                        label="Fecha de Compra"
                        name="purchaseDate"
                        type="date"
                        value={editData.purchaseDate}
                        onChange={handleChange}
                        disabled={loading}
                      />
                      <Input
                        label="Vencimiento Garantía"
                        name="warrantyExpiry"
                        type="date"
                        value={editData.warrantyExpiry}
                        onChange={handleChange}
                        disabled={loading}
                      />
                    </>
                  ) : (
                    <>
                      {equipment.installDate && (
                        <div>
                          <label className="text-sm font-medium text-gray-600">Instalación</label>
                          <p className="text-gray-800 font-medium">
                            {new Date(equipment.installDate).toLocaleDateString('es-MX')}
                          </p>
                        </div>
                      )}
                      {equipment.purchaseDate && (
                        <div>
                          <label className="text-sm font-medium text-gray-600">Compra</label>
                          <p className="text-gray-800 font-medium">
                            {new Date(equipment.purchaseDate).toLocaleDateString('es-MX')}
                          </p>
                        </div>
                      )}
                      {equipment.warrantyExpiry && (
                        <div>
                          <label className="text-sm font-medium text-gray-600">Vencimiento Garantía</label>
                          <p className="text-gray-800 font-medium">
                            {new Date(equipment.warrantyExpiry).toLocaleDateString('es-MX')}
                            {new Date(equipment.warrantyExpiry) > new Date() ? (
                              <span className="ml-2 text-green-600 text-sm">✅ Vigente</span>
                            ) : (
                              <span className="ml-2 text-red-600 text-sm">❌ Vencida</span>
                            )}
                          </p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2 flex items-center space-x-2">
                  <Wrench size={20} />
                  <span>Mantenimiento</span>
                </h3>
                
                <div className="space-y-4">
                  {isEditing ? (
                    <>
                      <Input
                        label="Último Mantenimiento"
                        name="lastMaintenance"
                        type="date"
                        value={editData.lastMaintenance}
                        onChange={handleChange}
                        disabled={loading}
                      />
                      <Input
                        label="Intervalo (meses)"
                        name="maintenanceInterval"
                        type="number"
                        value={editData.maintenanceInterval}
                        onChange={handleChange}
                        disabled={loading}
                        min="1"
                        max="60"
                      />
                    </>
                  ) : (
                    <>
                      {equipment.lastMaintenance && (
                        <div>
                          <label className="text-sm font-medium text-gray-600">Último Mantenimiento</label>
                          <p className="text-gray-800 font-medium">
                            {new Date(equipment.lastMaintenance).toLocaleDateString('es-MX')}
                          </p>
                        </div>
                      )}
                      <div>
                        <label className="text-sm font-medium text-gray-600">Intervalo</label>
                        <p className="text-gray-800 font-medium">
                          Cada {equipment.maintenanceInterval} meses
                        </p>
                      </div>
                      {equipment.lastMaintenance && (
                        <div>
                          <label className="text-sm font-medium text-gray-600">Próximo Mantenimiento</label>
                          <p className="text-gray-800 font-medium">
                            {equipmentService.calculateNextMaintenance && 
                             new Date(equipmentService.calculateNextMaintenance(
                               equipment.lastMaintenance, 
                               equipment.maintenanceInterval
                             )).toLocaleDateString('es-MX')
                            }
                          </p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </Card>
            </div>
          </div>

          {/* Especificaciones y Notas */}
          {!isEditing && (
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Especificaciones */}
              {equipment.specifications && Array.isArray(equipment.specifications) && equipment.specifications.length > 0 && (
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
                    Especificaciones Técnicas
                  </h3>
                  <ul className="space-y-2">
                    {equipment.specifications.map((spec, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{spec}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              )}

              {/* Notas */}
              {equipment.notes && (
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
                    Notas Adicionales
                  </h3>
                  <p className="text-gray-700 whitespace-pre-line">{equipment.notes}</p>
                </Card>
              )}

              {/* Información del Proveedor */}
              {(equipment.supplier || equipment.cost) && (
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
                    Información Comercial
                  </h3>
                  <div className="space-y-3">
                    {equipment.supplier && (
                      <div>
                        <label className="text-sm font-medium text-gray-600">Proveedor</label>
                        <p className="text-gray-800 font-medium">{equipment.supplier}</p>
                      </div>
                    )}
                    {equipment.cost > 0 && (
                      <div>
                        <label className="text-sm font-medium text-gray-600">Costo</label>
                        <p className="text-gray-800 font-medium">
                          ${equipment.cost.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN
                        </p>
                      </div>
                    )}
                  </div>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EquipmentDetailView;