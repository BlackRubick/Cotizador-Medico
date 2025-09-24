import React from 'react';
import { useUserRole } from '../hooks/useUserRole';

const RoleDebug = () => {
  const { userRole, isAdmin, isVendedor, getDisplayRole, user } = useUserRole();

  // Solo mostrar en desarrollo
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 bg-black bg-opacity-75 text-white p-4 rounded-lg text-xs z-50">
      <h3 className="font-bold mb-2">Debug - Rol Usuario</h3>
      <div className="space-y-1">
        <p><strong>Usuario:</strong> {user?.nombre || user?.name || 'N/A'}</p>
        <p><strong>Rol Raw:</strong> {user?.role || user?.tipo_usuario || 'N/A'}</p>
        <p><strong>Rol Procesado:</strong> {userRole}</p>
        <p><strong>Display:</strong> {getDisplayRole()}</p>
        <p><strong>Es Admin:</strong> {isAdmin ? 'Sí' : 'No'}</p>
        <p><strong>Es Vendedor:</strong> {isVendedor ? 'Sí' : 'No'}</p>
      </div>
    </div>
  );
};

export default RoleDebug;
