import { useAuthContext } from '../context/AuthContext';

export const useUserRole = () => {
  const { user } = useAuthContext();
  
  // Obtener rol del usuario con fallback a vendedor
  const userRole = (user?.role || user?.tipo_usuario || 'vendedor').toLowerCase();
  
  const isAdmin = userRole === 'admin' || userRole === 'administrador';
  const isVendedor = userRole === 'vendedor';
  
  // Debug temporal
  console.log('👤 useUserRole:', {
    user: user ? { nombre: user.nombre, role: user.role, tipo_usuario: user.tipo_usuario } : null,
    userRole,
    isAdmin,
    isVendedor
  });
  
  const hasAccess = (allowedRoles = []) => {
    if (allowedRoles.length === 0) return true;
    const hasPermission = allowedRoles.some(role => role.toLowerCase() === userRole);
    console.log('🔑 hasAccess:', { userRole, allowedRoles, hasPermission });
    return hasPermission;
  };
  
  const getDefaultRoute = () => {
    const route = isAdmin ? '/dashboard' : '/cotizar';
    console.log('🏠 getDefaultRoute:', { userRole, route });
    return route;
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
