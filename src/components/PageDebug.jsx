import React from 'react';
import { useUserRole } from '../hooks/useUserRole';
import { useLocation } from 'react-router-dom';

const PageDebug = ({ pageName }) => {
  const { userRole, user } = useUserRole();
  const location = useLocation();

  return (
    <div className="bg-blue-100 border-l-4 border-blue-500 p-4 mb-6">
      <h3 className="text-blue-800 font-semibold">Debug Info - {pageName}</h3>
      <div className="text-blue-700 text-sm mt-2">
        <p><strong>Usuario:</strong> {user?.nombre || user?.name || 'N/A'}</p>
        <p><strong>Rol:</strong> {userRole}</p>
        <p><strong>Ruta actual:</strong> {location.pathname}</p>
        <p><strong>Página:</strong> {pageName}</p>
      </div>
    </div>
  );
};

export default PageDebug;
