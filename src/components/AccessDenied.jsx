import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldX, ArrowLeft } from 'lucide-react';
import { useUserRole } from '../hooks/useUserRole';

const AccessDenied = ({ message = "No tienes permisos para acceder a esta página" }) => {
  const { getDefaultRoute, getDisplayRole } = useUserRole();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full text-center p-8">
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
          {/* Icono */}
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
            <ShieldX className="h-8 w-8 text-red-600" />
          </div>
          
          {/* Título */}
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Acceso Denegado
          </h1>
          
          {/* Mensaje */}
          <p className="text-gray-600 mb-2">
            {message}
          </p>
          
          <p className="text-sm text-gray-500 mb-6">
            Tu rol actual es: <span className="font-medium text-gray-700">{getDisplayRole()}</span>
          </p>
          
          {/* Botón de regreso */}
          <Link
            to={getDefaultRoute()}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <ArrowLeft size={18} />
            <span>Volver al inicio</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AccessDenied;
