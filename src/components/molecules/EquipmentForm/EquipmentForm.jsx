// src/components/molecules/EquipmentForm/EquipmentForm.jsx
import React, { useState, useEffect } from 'react';
import { X, Save, AlertCircle, Calendar, MapPin, Wrench } from 'lucide-react';
import Input from '../../atoms/Input';
import Button from '../../atoms/Button';
import equipmentService from '../../services/equipmentService';

const EquipmentForm = ({ 
  equipment = null, 
  clientId,
  onSave, 
  onCancel, 
  isEditing = false 
}) => {
  const [formData, setFormData] = useState({
    name: equipment?.name || '',
    model: equipment?.model || '',
    serialNumber: equipment?.serialNumber || '',
    category: equipment?.category || '',
    brand: equipment?.brand || '',
    location: equipment?.location || '',
    installDate: equipment?.installDate || '',
    lastMaintenance: equipment?.lastMaintenance || '',
    status: equipment?.status || 'active',
    specifications: equipment?.specifications?.join('\n') || '',
    notes: equipment?.notes || '',
    purchaseDate: equipment?.purchaseDate || '',
    warrantyExpiry: equipment?.warrantyExpiry || '',
    supplier: equipment?.supplier || '',
    cost: equipment?.cost || '',
    maintenanceInterval: equipment?.maintenanceInterval || 12
  });

  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  const statusOptions = [
    { value: 'active', label: 'Activo', color: 'text-green-600' },
    { value: 'maintenance', label: 'En Mantenimiento', color: 'text-yellow-600' },
    { value: 'out_of_service', label: 'Fuera de Servicio', color: 'text-red-600' },
    { value: 'retired', label: 'Retirado', color: 'text-gray-600' }
  ];

  // Cargar datos iniciales
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoadingData(true);
      
      const [categoriesRes, brandsRes] = await Promise.all([
        equipmentService.getEquipmentCategories(),
        equipmentService.getEquipmentBrands()
      ]);

      if (categoriesRes.success) {
        setCategories(categoriesRes.data);
      }

      if (brandsRes.success) {
        setBrands(brandsRes.data);
      }
    } catch (error) {
      console.error('Error loading initial data:', error);
      setApiError('Error al cargar datos iniciales');
    } finally {
      setLoadingData(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre del equipo es requerido';
    }
    
    if (!formData.model.trim()) {
      newErrors.model = 'El modelo es requerido';
    }
    
    if (!formData.serialNumber.trim()) {
      newErrors.serialNumber = 'El número de serie es requerido';
    }
    
    if (!formData.category) {
      newErrors.category = 'La categoría es requerida';
    }
    
    if (!formData.brand.trim()) {
      newErrors.brand = 'La marca es requerida';
    }
    
    if (!formData.location.trim()) {
      newErrors.location = 'La ubicación es requerida';
    }

    // Validar fechas
    if (formData.installDate && new Date(formData.installDate) > new Date()) {
      newErrors.installDate = 'La fecha de instalación no puede ser futura';
    }

    if (formData.lastMaintenance && new Date(formData.lastMaintenance) > new Date()) {
      newErrors.lastMaintenance = 'La fecha de mantenimiento no puede ser futura';
    }

    if (formData.purchaseDate && new Date(formData.purchaseDate) > new Date()) {
      newErrors.purchaseDate = 'La fecha de compra no puede ser futura';
    }

    if (formData.cost && (isNaN(formData.cost) || parseFloat(formData.cost) < 0)) {
      newErrors.cost = 'El costo debe ser un número válido mayor o igual a 0';
    }

    if (formData.maintenanceInterval && (isNaN(formData.maintenanceInterval) || parseInt(formData.maintenanceInterval) < 1)) {
      newErrors.maintenanceInterval = 'El intervalo debe ser un número mayor a 0';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar errores cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Limpiar error de API
    if (apiError) {
      setApiError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setApiError('');

    try {
      // Preparar datos para el backend
      const equipmentData = {
        ...formData,
        specifications: formData.specifications 
          ? formData.specifications.split('\n').filter(spec => spec.trim())
          : [],
        cost: formData.cost ? parseFloat(formData.cost) : 0,
        maintenanceInterval: formData.maintenanceInterval 
          ? parseInt(formData.maintenanceInterval) 
          : 12
      };

      await onSave(equipmentData, equipment?.id);
      // Si llegamos aquí, la operación fue exitosa
      // El componente padre manejará el cierre del formulario
    } catch (error) {
      console.error('Error saving equipment:', error);
      
      // Manejar errores específicos del servidor
      if (error.message.includes('already exists')) {
        setApiError('Ya existe un equipo con este número de serie');
      } else if (error.message.includes('validation')) {
        setApiError('Error de validación. Verifica que todos los campos sean correctos');
      } else if (error.message.includes('unauthorized')) {
        setApiError('No tienes permisos para realizar esta acción');
      } else {
        setApiError(error.message || 'Error al guardar el equipo');
      }
    } finally {
      setLoading(false);
    }
  };

  // Calcular próximo mantenimiento
  const calculateNextMaintenance = () => {
    if (!formData.lastMaintenance || !formData.maintenanceInterval) return '';
    
    const lastDate = new Date(formData.lastMaintenance);
    const nextDate = new Date(lastDate);
    nextDate.setMonth(nextDate.getMonth() + parseInt(formData.maintenanceInterval));
    
    return nextDate.toLocaleDateString('es-MX');
  };

  if (loadingData) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg max-w-4xl mx-auto max-h-[90vh] overflow-y-auto">
      <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">
          {isEditing ? 'Editar Equipo Biomédico' : 'Nuevo Equipo Biomédico'}
        </h2>
        <button
          onClick={onCancel}
          disabled={loading}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
        >
          <X size={20} />
        </button>
      </div>

      <div className="p-6">
        {/* Error de API */}
        {apiError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
            <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <h4 className="text-red-800 font-medium">Error</h4>
              <p className="text-red-700">{apiError}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información Básica */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
              Información Básica
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Nombre del Equipo"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
                disabled={loading}
                required
                placeholder="Ej: Monitor de Signos Vitales"
              />
              
              <Input
                label="Modelo"
                name="model"
                value={formData.model}
                onChange={handleChange}
                error={errors.model}
                disabled={loading}
                required
                placeholder="Ej: CARESCAPE B450"
              />
              
              <Input
                label="Número de Serie"
                name="serialNumber"
                value={formData.serialNumber}
                onChange={handleChange}
                error={errors.serialNumber}
                disabled={loading}
                required
                placeholder="Ej: GE2023-001"
              />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoría <span className="text-red-500">*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:opacity-50"
                  required
                >
                  <option value="">Selecciona una categoría</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                {errors.category && (
                  <p className="mt-1 text-sm text-red-600">{errors.category}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Marca <span className="text-red-500">*</span>
                </label>
                <select
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:opacity-50"
                  required
                >
                  <option value="">Selecciona una marca</option>
                  {brands.map(brand => (
                    <option key={brand} value={brand}>{brand}</option>
                  ))}
                </select>
                {errors.brand && (
                  <p className="mt-1 text-sm text-red-600">{errors.brand}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estado <span className="text-red-500">*</span>
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:opacity-50"
                  required
                >
                  {statusOptions.map(status => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Ubicación y Fechas */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 flex items-center space-x-2">
              <MapPin size={20} />
              <span>Ubicación y Fechas</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Ubicación"
                name="location"
                value={formData.location}
                onChange={handleChange}
                error={errors.location}
                disabled={loading}
                required
                placeholder="Ej: UCI - Cama 3"
              />
              
              <Input
                label="Fecha de Instalación"
                name="installDate"
                type="date"
                value={formData.installDate}
                onChange={handleChange}
                error={errors.installDate}
                disabled={loading}
              />
              
              <Input
                label="Fecha de Compra"
                name="purchaseDate"
                type="date"
                value={formData.purchaseDate}
                onChange={handleChange}
                error={errors.purchaseDate}
                disabled={loading}
              />
              
              <Input
                label="Vencimiento de Garantía"
                name="warrantyExpiry"
                type="date"
                value={formData.warrantyExpiry}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
          </div>

          {/* Mantenimiento */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 flex items-center space-x-2">
              <Wrench size={20} />
              <span>Mantenimiento</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Último Mantenimiento"
                name="lastMaintenance"
                type="date"
                value={formData.lastMaintenance}
                onChange={handleChange}
                error={errors.lastMaintenance}
                disabled={loading}
              />
              
              <Input
                label="Intervalo de Mantenimiento (meses)"
                name="maintenanceInterval"
                type="number"
                value={formData.maintenanceInterval}
                onChange={handleChange}
                error={errors.maintenanceInterval}
                disabled={loading}
                min="1"
                max="60"
                placeholder="12"
              />
            </div>

            {/* Próximo mantenimiento calculado */}
            {formData.lastMaintenance && formData.maintenanceInterval && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <span className="text-blue-800 font-medium">
                    Próximo mantenimiento estimado: {calculateNextMaintenance()}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Información Adicional */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
              Información Adicional
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Proveedor"
                name="supplier"
                value={formData.supplier}
                onChange={handleChange}
                disabled={loading}
                placeholder="Nombre del proveedor"
              />
              
              <Input
                label="Costo (MXN)"
                name="cost"
                type="number"
                value={formData.cost}
                onChange={handleChange}
                error={errors.cost}
                disabled={loading}
                min="0"
                step="0.01"
                placeholder="0.00"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Especificaciones Técnicas
              </label>
              <textarea
                name="specifications"
                value={formData.specifications}
                onChange={handleChange}
                disabled={loading}
                rows="4"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:opacity-50"
                placeholder="Una especificación por línea..."
              />
              <p className="mt-1 text-sm text-gray-500">
                Escribe cada especificación en una línea separada
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notas Adicionales
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                disabled={loading}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:opacity-50"
                placeholder="Observaciones, historial de reparaciones, etc..."
              />
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex space-x-4 pt-4 border-t">
            <Button 
              type="submit" 
              disabled={loading}
              className="flex-1 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Guardando...</span>
                </>
              ) : (
                <>
                  <Save size={16} />
                  <span>{isEditing ? 'Actualizar' : 'Guardar'}</span>
                </>
              )}
            </Button>
            <Button 
              type="button"
              variant="secondary" 
              onClick={onCancel}
              disabled={loading}
              className="flex-1"
            >
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EquipmentForm;