// src/components/molecules/ClientForm/ClientForm.jsx - ACTUALIZADO
import React, { useState } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';
import Input from '../../atoms/Input';
import Button from '../../atoms/Button';

const ClientForm = ({ client = null, onSave, onCancel, isEditing = false }) => {
  const [formData, setFormData] = useState({
    empresaResponsable: client?.empresaResponsable || '',
    dependencia: client?.dependencia || '',
    hospital: client?.hospital || '',
    estado: client?.estado || '',
    ciudad: client?.ciudad || '',
    codigoPostal: client?.codigoPostal || '',
    direccion: client?.direccion || '',
    contrato: client?.contrato || '',
    equipo: client?.equipo || '',
    marca: client?.marca || '',
    modelo: client?.modelo || '',
    numeroSerie: client?.numeroSerie || '',
    fechaInstalacion: client?.fechaInstalacion || '',
    ultimoMantenimiento: client?.ultimoMantenimiento || '',
    estatusAbril2025: client?.estatusAbril2025 || '',
    estatusInicio26: client?.estatusInicio26 || ''
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.empresaResponsable.trim()) {
      newErrors.empresaResponsable = 'La empresa responsable es requerida';
    }
    
    if (!formData.dependencia.trim()) {
      newErrors.dependencia = 'La dependencia es requerida';
    }
    
    if (!formData.hospital.trim()) {
      newErrors.hospital = 'El hospital es requerido';
    }
    
    if (!formData.estado.trim()) {
      newErrors.estado = 'El estado es requerido';
    }
    
    if (!formData.ciudad.trim()) {
      newErrors.ciudad = 'La ciudad es requerida';
    }
    
    if (!formData.codigoPostal.trim()) {
      newErrors.codigoPostal = 'El código postal es requerido';
    } else if (!/^\d{5}$/.test(formData.codigoPostal)) {
      newErrors.codigoPostal = 'El código postal debe tener 5 dígitos';
    }
    
    if (!formData.direccion.trim()) {
      newErrors.direccion = 'La dirección es requerida';
    }
    
    if (!formData.equipo.trim()) {
      newErrors.equipo = 'El equipo es requerido';
    }
    
    if (!formData.marca.trim()) {
      newErrors.marca = 'La marca es requerida';
    }
    
    if (!formData.modelo.trim()) {
      newErrors.modelo = 'El modelo es requerido';
    }
    
    if (!formData.numeroSerie.trim()) {
      newErrors.numeroSerie = 'El número de serie es requerido';
    }

    // Validaciones de fechas (opcionales)
    if (formData.fechaInstalacion && formData.fechaInstalacion.trim()) {
      const fechaInstalacion = new Date(formData.fechaInstalacion);
      if (isNaN(fechaInstalacion.getTime())) {
        newErrors.fechaInstalacion = 'Fecha de instalación inválida';
      }
    }
    
    if (formData.ultimoMantenimiento && formData.ultimoMantenimiento.trim()) {
      const fechaMantenimiento = new Date(formData.ultimoMantenimiento);
      if (isNaN(fechaMantenimiento.getTime())) {
        newErrors.ultimoMantenimiento = 'Fecha de último mantenimiento inválida';
      }
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
      await onSave(formData);
      // Si llegamos aquí, la operación fue exitosa
      // El componente padre manejará el cierre del formulario
    } catch (error) {
      console.error('Error saving client:', error);
      
      // Manejar errores específicos del servidor
      if (error.message.includes('already exists')) {
        setApiError('Ya existe un cliente con este nombre o email');
      } else if (error.message.includes('validation')) {
        setApiError('Error de validación. Verifica que todos los campos sean correctos');
      } else if (error.message.includes('unauthorized')) {
        setApiError('No tienes permisos para realizar esta acción');
      } else {
        setApiError(error.message || 'Error al guardar el cliente');
      }
    } finally {
      setLoading(false);
    }
  };



  return (
    <>
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">
            {isEditing ? 'Editar Cliente' : 'Nuevo Cliente'}
          </h2>
          <button
            onClick={onCancel}
            disabled={loading}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

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
          {/* Información General */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Información General</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Empresa Responsable"
                name="empresaResponsable"
                value={formData.empresaResponsable}
                onChange={handleChange}
                error={errors.empresaResponsable}
                disabled={loading}
                required
                placeholder="Ej: Hospital General de Tuxtla"
              />
              
              <Input
                label="Dependencia"
                name="dependencia"
                value={formData.dependencia}
                onChange={handleChange}
                error={errors.dependencia}
                disabled={loading}
                required
                placeholder="Ej: Secretaría de Salud"
              />
              
              <Input
                label="Hospital"
                name="hospital"
                value={formData.hospital}
                onChange={handleChange}
                error={errors.hospital}
                disabled={loading}
                required
                placeholder="Ej: Hospital Regional de Alta Especialidad"
              />
              
              <Input
                label="Contrato"
                name="contrato"
                value={formData.contrato}
                onChange={handleChange}
                error={errors.contrato}
                disabled={loading}
                placeholder="Número de contrato (opcional)"
              />
            </div>
          </div>

          {/* Ubicación */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Ubicación</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Estado"
                name="estado"
                value={formData.estado}
                onChange={handleChange}
                error={errors.estado}
                disabled={loading}
                required
                placeholder="Ej: Chiapas"
              />
              
              <Input
                label="Ciudad/Localidad"
                name="ciudad"
                value={formData.ciudad}
                onChange={handleChange}
                error={errors.ciudad}
                disabled={loading}
                required
                placeholder="Ej: Tuxtla Gutiérrez"
              />
              
              <Input
                label="Código Postal"
                name="codigoPostal"
                value={formData.codigoPostal}
                onChange={handleChange}
                error={errors.codigoPostal}
                disabled={loading}
                required
                placeholder="Ej: 29000"
                maxLength={5}
              />
            </div>
            
            <div className="mt-4">
              <Input
                label="Dirección"
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
                error={errors.direccion}
                disabled={loading}
                required
                placeholder="Dirección completa"
              />
            </div>
          </div>

          {/* Información del Equipo */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Información del Equipo</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Equipo"
                name="equipo"
                value={formData.equipo}
                onChange={handleChange}
                error={errors.equipo}
                disabled={loading}
                required
                placeholder="Ej: Ventilador Mecánico"
              />
              
              <Input
                label="Marca"
                name="marca"
                value={formData.marca}
                onChange={handleChange}
                error={errors.marca}
                disabled={loading}
                required
                placeholder="Ej: Philips"
              />
              
              <Input
                label="Modelo"
                name="modelo"
                value={formData.modelo}
                onChange={handleChange}
                error={errors.modelo}
                disabled={loading}
                required
                placeholder="Ej: V60 Plus"
              />
              
              <Input
                label="Número de Serie"
                name="numeroSerie"
                value={formData.numeroSerie}
                onChange={handleChange}
                error={errors.numeroSerie}
                disabled={loading}
                required
                placeholder="Ej: VP60-2023-001"
              />
            </div>
          </div>

          {/* Fechas y Estatus */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Fechas y Estatus</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha de Instalación
                </label>
                <input
                  type="date"
                  name="fechaInstalacion"
                  value={formData.fechaInstalacion}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:opacity-50"
                />
                {errors.fechaInstalacion && (
                  <p className="text-red-500 text-sm mt-1">{errors.fechaInstalacion}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Último Mantenimiento
                </label>
                <input
                  type="date"
                  name="ultimoMantenimiento"
                  value={formData.ultimoMantenimiento}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:opacity-50"
                />
                {errors.ultimoMantenimiento && (
                  <p className="text-red-500 text-sm mt-1">{errors.ultimoMantenimiento}</p>
                )}
              </div>
              
              <Input
                label="Estatus Abril 2025"
                name="estatusAbril2025"
                value={formData.estatusAbril2025}
                onChange={handleChange}
                error={errors.estatusAbril2025}
                disabled={loading}
                placeholder="Ej: Activo, Inactivo, Mantenimiento"
              />
              
              <Input
                label="Estatus Inicio 26"
                name="estatusInicio26"
                value={formData.estatusInicio26}
                onChange={handleChange}
                error={errors.estatusInicio26}
                disabled={loading}
                placeholder="Estatus proyectado para 2026"
              />
            </div>
          </div>



          <div className="flex space-x-4 pt-4">
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
    </>
  );
};

export default ClientForm;