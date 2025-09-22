import React, { useState } from 'react';
import { Plus, X, User, Phone, Mail } from 'lucide-react';

const EncargadosManager = ({ encargados = [], onChange }) => {
  const [newEncargado, setNewEncargado] = useState({
    nombre: '',
    cargo: '',
    telefono: '',
    email: ''
  });

  const handleAddEncargado = () => {
    if (newEncargado.nombre.trim()) {
      const updatedEncargados = [...encargados, { ...newEncargado, id: Date.now() }];
      onChange(updatedEncargados);
      setNewEncargado({ nombre: '', cargo: '', telefono: '', email: '' });
    }
  };

  const handleRemoveEncargado = (id) => {
    const updatedEncargados = encargados.filter(enc => enc.id !== id);
    onChange(updatedEncargados);
  };

  const handleInputChange = (field, value) => {
    setNewEncargado(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <User className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-800">Encargados del Hospital</h3>
        <span className="text-sm text-gray-500">({encargados.length})</span>
      </div>

      {/* Lista de encargados existentes */}
      {encargados.length > 0 && (
        <div className="space-y-3 max-h-60 overflow-y-auto">
          {encargados.map((encargado) => (
            <div key={encargado.id} className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">{encargado.nombre}</h4>
                      {encargado.cargo && (
                        <p className="text-sm text-blue-700 font-medium">{encargado.cargo}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="ml-13 space-y-1">
                    {encargado.telefono && (
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Phone size={14} />
                        <span>{encargado.telefono}</span>
                      </div>
                    )}
                    {encargado.email && (
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Mail size={14} />
                        <span>{encargado.email}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <button
                  type="button"
                  onClick={() => handleRemoveEncargado(encargado.id)}
                  className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                  title="Eliminar encargado"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Formulario para agregar nuevo encargado */}
      <div className="bg-green-50 border-2 border-dashed border-green-200 p-4 rounded-lg">
        <div className="flex items-center space-x-2 mb-3">
          <Plus className="w-4 h-4 text-green-600" />
          <p className="text-sm font-medium text-green-800">Agregar nuevo encargado</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Nombre completo *
            </label>
            <input
              type="text"
              value={newEncargado.nombre}
              onChange={(e) => handleInputChange('nombre', e.target.value)}
              placeholder="Ej: Dr. Juan Pérez López"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
          
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Cargo/Puesto
            </label>
            <input
              type="text"
              value={newEncargado.cargo}
              onChange={(e) => handleInputChange('cargo', e.target.value)}
              placeholder="Ej: Director, Jefe de Mantenimiento"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
          
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Teléfono
            </label>
            <input
              type="tel"
              value={newEncargado.telefono}
              onChange={(e) => handleInputChange('telefono', e.target.value)}
              placeholder="Ej: +52 777 123 4567"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
          
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Email
            </label>
            <input
              type="email"
              value={newEncargado.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="Ej: juan.perez@hospital.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
        </div>
        
        <button
          type="button"
          onClick={handleAddEncargado}
          disabled={!newEncargado.nombre.trim()}
          className="mt-3 flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-sm font-medium transition-colors"
        >
          <Plus size={16} />
          <span>Agregar Encargado</span>
        </button>
      </div>

      {encargados.length === 0 && (
        <div className="text-center py-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
          <User className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-500">
            No hay encargados registrados
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Agrega al menos un contacto para mejor comunicación
          </p>
        </div>
      )}
    </div>
  );
};

export default EncargadosManager;