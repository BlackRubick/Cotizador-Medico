// src/components/molecules/ClientForm/ClientForm.jsx - ACTUALIZADO
import React, { useState } from 'react';
import { X, Save, AlertCircle, Activity } from 'lucide-react';
import Input from '../../atoms/Input';
import Button from '../../atoms/Button';
import ClientEquipmentModal from '../ClientEquipmentModal';

const ClientForm = ({ client = null, onSave, onCancel, isEditing = false }) => {
  const [formData, setFormData] = useState({
    nombre: client?.nombre || '',
    contacto: client?.contacto || '',
    telefono: client?.telefono || '',
    email: client?.email || '',
    direccion: client?.direccion || '',
    rfc: client?.rfc || '',
    tipo: client?.tipo || 'Hospital'
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showEquipmentModal, setShowEquipmentModal] = useState(false);

  const clientTypes = [
    'Hospital',
    'Clínica', 
    'Laboratorio',
    'Centro Diagnóstico',
    'Consultorio',
    'Otro'
  ];

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    }
    
    if (!formData.contacto.trim()) {
      newErrors.contacto = 'El contacto es requerido';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    
    if (!formData.telefono.trim()) {
      newErrors.telefono = 'El teléfono es requerido';
    }

    // Validación de RFC (opcional pero si se proporciona debe ser válido)
    if (formData.rfc && !/^[A-ZÑ&]{3,4}\d{6}[A-Z\d]{3}$/.test(formData.rfc.toUpperCase())) {
      newErrors.rfc = 'RFC inválido (formato: ABC123456789)';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'rfc' ? value.toUpperCase() : value
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

  const handleManageEquipment = () => {
    if (!isEditing) {
      alert('Primero debes guardar el cliente para poder gestionar sus equipos');
      return;
    }
    setShowEquipmentModal(true);
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Nombre de la Empresa"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              error={errors.nombre}
              disabled={loading}
              required
              placeholder="Ej: Hospital General de Tuxtla"
            />
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo <span className="text-red-500">*</span>
              </label>
              <select
                name="tipo"
                value={formData.tipo}
                onChange={handleChange}
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:opacity-50"
                required
              >
                {clientTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            
            <Input
              label="Contacto Principal"
              name="contacto"
              value={formData.contacto}
              onChange={handleChange}
              error={errors.contacto}
              disabled={loading}
              required
              placeholder="Ej: Dr. Eduardo Ramírez"
            />
            
            <Input
              label="RFC"
              name="rfc"
              value={formData.rfc}
              onChange={handleChange}
              error={errors.rfc}
              disabled={loading}
              placeholder="Ej: ABC123456789"
              maxLength={13}
            />
            
            <Input
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              disabled={loading}
              required
              placeholder="contacto@empresa.com"
            />
            
            <Input
              label="Teléfono"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              error={errors.telefono}
              disabled={loading}
              required
              placeholder="+52 961 123 4567"
            />
          </div>
          
          <Input
            label="Dirección"
            name="direccion"
            value={formData.direccion}
            onChange={handleChange}
            disabled={loading}
            placeholder="Dirección completa"
          />

          {/* Sección de Equipos Biomédicos */}
          {isEditing && (
            <div className="border-t pt-4 mt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">Equipos Biomédicos</h3>
                  <p className="text-sm text-gray-600">
                    Gestiona los equipos biomédicos asociados a este cliente
                  </p>
                </div>
                <Button
                  type="button"
                  onClick={handleManageEquipment}
                  variant="secondary"
                  className="flex items-center space-x-2 bg-blue-50 text-blue-600 hover:bg-blue-100 border-blue-200"
                  disabled={loading}
                >
                  <Activity size={16} />
                  <span>Gestionar Equipos</span>
                </Button>
              </div>
            </div>
          )}

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

        {/* Información adicional para nuevos clientes */}
        {!isEditing && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <Activity className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-blue-800 font-medium">Equipos Biomédicos</h4>
                <p className="text-blue-700 text-sm mt-1">
                  Después de guardar el cliente, podrás agregar y gestionar sus equipos biomédicos 
                  desde la sección de equipos.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal de equipos */}
      {showEquipmentModal && (
        <ClientEquipmentModal
          client={client}
          isOpen={showEquipmentModal}
          onClose={() => setShowEquipmentModal(false)}
        />
      )}
    </>
  );
};

export default ClientForm;