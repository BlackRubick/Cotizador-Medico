import React from 'react';
import { Users, Plus } from 'lucide-react';
import Card from '../../atoms/Card';
import Button from '../../atoms/Button';

const ClientesPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Users className="w-8 h-8 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-800">Gestión de Clientes</h1>
        </div>
        <Button className="flex items-center space-x-2">
          <Plus size={20} />
          <span>Nuevo Cliente</span>
        </Button>
      </div>

      <Card className="text-center py-12">
        <div className="max-w-md mx-auto">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Módulo en Desarrollo
          </h3>
          <p className="text-gray-500 mb-6">
            La gestión de clientes estará disponible próximamente. Podrás crear, 
            editar y administrar toda la información de tus clientes.
          </p>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2">Funciones próximas:</h4>
            <ul className="text-sm text-blue-600 space-y-1">
              <li>• Registro completo de clientes</li>
              <li>• Historial de cotizaciones por cliente</li>
              <li>• Información de contacto detallada</li>
              <li>• Seguimiento de interacciones</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ClientesPage;
