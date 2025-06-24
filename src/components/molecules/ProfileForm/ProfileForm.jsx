import React, { useState } from 'react';
import { Edit2 } from 'lucide-react';
import Input from '../../atoms/Input';
import Button from '../../atoms/Button';
import Avatar from '../../atoms/Avatar';

const ProfileForm = ({ profile, onSubmit, isEditable = false }) => {
  const [formData, setFormData] = useState({
    nombre: profile?.nombre || '',
    apellidos: profile?.apellidos || '',
    correo: profile?.correo || '',
    numero: profile?.numero || '',
    puesto: profile?.puesto || ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  return (
    <div className="space-y-6">
      {/* Avatar */}
      <div className="flex flex-col items-center space-y-4">
        <Avatar size="xl" />
        <h2 className="text-xl font-semibold">Perfil</h2>
      </div>

      {/* Form Fields */}
      <div className="space-y-4">
        <div className="relative">
          <Input
            label="Nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            disabled={!isEditable}
            className={!isEditable ? 'bg-gray-50' : ''}
          />
          {!isEditable && <Edit2 className="absolute top-8 right-3 w-4 h-4 text-gray-400" />}
        </div>

        <div className="relative">
          <Input
            label="Apellidos"
            name="apellidos"
            value={formData.apellidos}
            onChange={handleChange}
            disabled={!isEditable}
            className={!isEditable ? 'bg-gray-50' : ''}
          />
          {!isEditable && <Edit2 className="absolute top-8 right-3 w-4 h-4 text-gray-400" />}
        </div>

        <div className="relative">
          <Input
            label="Correo"
            name="correo"
            type="email"
            value={formData.correo}
            onChange={handleChange}
            disabled={!isEditable}
            className={!isEditable ? 'bg-gray-50' : ''}
          />
          {!isEditable && <Edit2 className="absolute top-8 right-3 w-4 h-4 text-gray-400" />}
        </div>

        <div className="relative">
          <Input
            label="Número"
            name="numero"
            value={formData.numero}
            onChange={handleChange}
            disabled={!isEditable}
            className={!isEditable ? 'bg-gray-50' : ''}
          />
          {!isEditable && <Edit2 className="absolute top-8 right-3 w-4 h-4 text-gray-400" />}
        </div>

        <div className="relative">
          <Input
            label="Puesto"
            name="puesto"
            value={formData.puesto}
            onChange={handleChange}
            disabled={!isEditable}
            className={!isEditable ? 'bg-gray-50' : ''}
          />
          {!isEditable && <Edit2 className="absolute top-8 right-3 w-4 h-4 text-gray-400" />}
        </div>
      </div>

      {!isEditable && (
        <div className="bg-gray-50 p-4 rounded-lg text-center">
          <p className="text-sm text-gray-600">
            EL PERFIL SOLO<br />
            PUEDE SER<br />
            MODIFICADO POR<br />
            ADMINISTRADOR
          </p>
        </div>
      )}

      {isEditable && (
        <Button onClick={handleSubmit} className="w-full">
          Guardar Cambios
        </Button>
      )}
    </div>
  );
};

export default ProfileForm;
