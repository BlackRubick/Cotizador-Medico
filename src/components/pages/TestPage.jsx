import React from 'react';
import PageDebug from '../PageDebug';
import { useUserRole } from '../../hooks/useUserRole';

const TestPage = ({ pageName = "Prueba" }) => {
  const { userRole, user } = useUserRole();

  return (
    <div className="p-6">
      <PageDebug pageName={pageName} />
      
      <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
        ✅ <strong>¡Página cargada correctamente!</strong>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">{pageName}</h1>
        
        <div className="space-y-2 text-gray-600">
          <p><strong>Usuario:</strong> {user?.nombre || user?.name || 'No disponible'}</p>
          <p><strong>Email:</strong> {user?.email || 'No disponible'}</p>
          <p><strong>Rol:</strong> {userRole}</p>
          <p><strong>Timestamp:</strong> {new Date().toLocaleString()}</p>
        </div>
        
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-2">Estado del sistema:</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>✅ Autenticación funcionando</li>
            <li>✅ Rutas protegidas funcionando</li>
            <li>✅ Sistema de roles funcionando</li>
            <li>✅ Navegación funcionando</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TestPage;
