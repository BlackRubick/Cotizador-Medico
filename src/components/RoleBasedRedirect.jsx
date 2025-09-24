import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUserRole } from '../hooks/useUserRole';

const RoleBasedRedirect = () => {
  const { getDefaultRoute } = useUserRole();
  
  return <Navigate to={getDefaultRoute()} replace />;
};

export default RoleBasedRedirect;
