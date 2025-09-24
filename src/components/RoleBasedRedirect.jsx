import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import { useUserRole } from '../hooks/useUserRole';

const RoleBasedRedirect = () => {
  const { isAuthenticated, loading } = useAuthContext();
  const { getDefaultRoute, userRole, isAdmin, user } = useUserRole();
  
  // Debug logs temporales
  console.log('RoleBasedRedirect Debug:', {
    user,
    userRole,
    isAdmin,
    defaultRoute: getDefaultRoute(),
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
    return <Navigate to="/login" replace />;
  }
  
  return <Navigate to={getDefaultRoute()} replace />;
};

export default RoleBasedRedirect;
