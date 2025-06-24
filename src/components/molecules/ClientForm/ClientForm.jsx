import React, { useState } from 'react';
import { X, Save } from 'lucide-react';
import Input from '../../atoms/Input';
import Button from '../../atoms/Button';

const ClientForm = ({ client = null, onSave, onCancel, isEditing = false }) => {
  const [formData, setFormData] = useState({
    nombre: client?.nombre || '',
    contacto: client?.contacto || '',
    telefono: client?.telefono || '',
    email: client?.email || '',
    direccion: client?.direccion || '',
    rfc: client?.rfc || '',
    tipo: client?.tipo || 'Cliente'
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    
    if (!formData.telefono.trim()) {
      newErrors.telefono = 'El teléfono es requerido';
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
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">
          {isEditing ? 'Editar Cliente' : 'Nuevo Cliente'}
        </h2>
        <button
          onClick={onCancel}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Nombre de la Empresa"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            error={errors.nombre}
            required
          />
          
          <Input
            label="Tipo"
            name="tipo"
            value={formData.tipo}
            onChange={handleChange}
            placeholder="Cliente, Proveedor, etc."
          />
          
          <Input
            label="Contacto Principal"
            name="contacto"
            value={formData.contacto}
            onChange={handleChange}
            placeholder="Nombre del contacto"
          />
          
          <Input
            label="RFC"
            name="rfc"
            value={formData.rfc}
            onChange={handleChange}
            placeholder="RFC de la empresa"
          />
          
          <Input
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            required
          />
          
          <Input
            label="Teléfono"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            error={errors.telefono}
            required
          />
        </div>
        
        <Input
          label="Dirección"
          name="direccion"
          value={formData.direccion}
          onChange={handleChange}
          placeholder="Dirección completa"
        />

        <div className="flex space-x-4 pt-4">
          <Button type="submit" className="flex-1 flex items-center justify-center space-x-2">
            <Save size={16} />
            <span>{isEditing ? 'Actualizar' : 'Guardar'}</span>
          </Button>
          <Button 
            type="button"
            variant="secondary" 
            onClick={onCancel}
            className="flex-1"
          >
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ClientForm;
