import { useAuthContext } from '../context/AuthContext';

export const useUserRole = () => {
  const { user } = useAuthContext();
  
  // Obtener rol del usuario con fallback a vendedor
  const userRole = (user?.role || user?.tipo_usuario || 'vendedor').toLowerCase();
  
  const isAdmin = userRole === 'admin' || userRole === 'administrador';
  const isVendedor = userRole === 'vendedor';
  
  // Debug logs temporales
  console.log('useUserRole Debug:', {
    user,
    rawRole: user?.role,
    rawTipoUsuario: user?.tipo_usuario,
    processedRole: userRole,
    isAdmin,
    isVendedor
  });
  
  const hasAccess = (allowedRoles = []) => {
    if (allowedRoles.length === 0) return true;
    return allowedRoles.some(role => role.toLowerCase() === userRole);
  };
  
  const getDefaultRoute = () => {
    return isAdmin ? '/dashboard' : '/cotizar';
  };
  
  const getDisplayRole = () => {
    return isAdmin ? 'Administrador' : 'Vendedor';
  };
  
  return {
    userRole,
    isAdmin,
    isVendedor,
    hasAccess,
    getDefaultRoute,
    getDisplayRole,
    user
  };
};
