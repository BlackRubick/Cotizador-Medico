import { useAuthContext } from '../context/AuthContext';

export const useUserRole = () => {
  const { user } = useAuthContext();
  
  // Obtener rol del usuario con fallback a vendedor
  const userRole = (user?.role || user?.tipo_usuario || 'vendedor').toLowerCase();
  
  const isAdmin = () => {
    return userRole === 'admin' || userRole === 'administrador';
  };
  
  const isVendedor = () => {
    return userRole === 'vendedor';
  };
  
  const hasAccess = (allowedRoles = []) => {
    if (allowedRoles.length === 0) return true;
    return allowedRoles.some(role => role.toLowerCase() === userRole);
  };
  
  const getDefaultRoute = () => {
    return isAdmin() ? '/dashboard' : '/cotizar';
  };
  
  const getDisplayRole = () => {
    return isAdmin() ? 'Administrador' : 'Vendedor';
  };
  
  return {
    userRole,
    isAdmin: isAdmin(),
    isVendedor: isVendedor(),
    hasAccess,
    getDefaultRoute,
    getDisplayRole,
    user
  };
};
