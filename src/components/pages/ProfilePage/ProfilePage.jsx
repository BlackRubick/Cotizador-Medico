import React, { useState } from 'react';
import { Edit2, Save, X } from 'lucide-react';
import { useAuthContext } from '../../../context/AuthContext';
import Card from '../../atoms/Card';
import Button from '../../atoms/Button';
import Input from '../../atoms/Input';
import Avatar from '../../atoms/Avatar';
// ...existing code...

const ProfilePage = () => {
  const { user } = useAuthContext();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    role: user?.role || ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = () => {
    console.log('Guardando perfil:', formData);
    alert('Perfil actualizado correctamente');
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: user?.phone || '',
      role: user?.role || ''
    });
    setIsEditing(false);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="p-8">
        <div className="space-y-6">
          {/* Header with Avatar */}
          <div className="flex flex-col items-center space-y-4">
            <Avatar size="xl" />
            <h1 className="text-2xl font-bold text-gray-800">Perfil</h1>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    !isEditing ? 'bg-gray-50 text-gray-600' : ''
                  }`}
                />
                {!isEditing && (
                  <Edit2 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Apellidos
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    !isEditing ? 'bg-gray-50 text-gray-600' : ''
                  }`}
                />
                {!isEditing && (
                  <Edit2 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Correo
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    !isEditing ? 'bg-gray-50 text-gray-600' : ''
                  }`}
                />
                {!isEditing && (
                  <Edit2 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Número
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    !isEditing ? 'bg-gray-50 text-gray-600' : ''
                  }`}
                />
                {!isEditing && (
                  <Edit2 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Puesto
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    !isEditing ? 'bg-gray-50 text-gray-600' : ''
                  }`}
                />
                {!isEditing && (
                  <Edit2 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                )}
              </div>
            </div>
          </div>

          {/* Admin Notice */}
          {!isEditing && user?.role === 'Administrador' && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
              <p className="text-sm text-blue-700 font-medium mb-2">
                COMO ADMINISTRADOR PUEDES<br />
                MODIFICAR TU PERFIL
              </p>
              <Button
                onClick={() => setIsEditing(true)}
                className="flex items-center space-x-2 mx-auto"
              >
                <Edit2 size={16} />
                <span>Editar Perfil</span>
              </Button>
            </div>
          )}

          {!isEditing && user?.role !== 'Administrador' && (
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <p className="text-sm text-gray-600">
                EL PERFIL SOLO<br />
                PUEDE SER<br />
                MODIFICADO POR<br />
                ADMINISTRADOR
              </p>
            </div>
          )}

          {/* Configuración adicional */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Configuración</h3>
            <div className="flex flex-wrap gap-3">
              {/* EmailConfigButton eliminado porque EmailJS ya no se utiliza */}
            </div>
          </div>

          {/* Action Buttons for Editing */}
          {isEditing && (
            <div className="flex space-x-4">
              <Button
                onClick={handleSave}
                className="flex-1 flex items-center justify-center space-x-2"
              >
                <Save size={16} />
                <span>Guardar Cambios</span>
              </Button>
              <Button
                onClick={handleCancel}
                variant="secondary"
                className="flex-1 flex items-center justify-center space-x-2"
              >
                <X size={16} />
                <span>Cancelar</span>
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default ProfilePage;
