import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import { useUserRole } from '../hooks/useUserRole';

const RoleBasedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, loading } = useAuthContext();
  const { hasAccess, getDefaultRoute, userRole } = useUserRole();

  // Debug temporal
  console.log('🔒 RoleBasedRoute:', { 
    userRole, 
    allowedRoles, 
    hasAccess: hasAccess(allowedRoles),
    isAuthenticated,
    loading
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log('❌ Usuario no autenticado, redirigiendo a /login');
    return <Navigate to="/login" replace />;
  }

  // Si no se especifican roles permitidos, permitir acceso a cualquier usuario autenticado
  if (allowedRoles.length === 0) {
    console.log('✅ Sin restricciones de rol, acceso permitido');
    return children;
  }

  // Verificar si el usuario tiene un rol permitido
  if (hasAccess(allowedRoles)) {
    console.log('✅ Acceso concedido para rol:', userRole);
    return children;
  }

  // Si el usuario no tiene permisos, redirigir a su página por defecto
  console.log('❌ Acceso denegado, redirigiendo a:', getDefaultRoute());
  return <Navigate to={getDefaultRoute()} replace />;
};

export default RoleBasedRoute;
