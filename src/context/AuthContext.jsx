import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../components/services/authService'; 

const AuthContext = createContext();

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Verificar si hay usuario logueado al cargar la app
  useEffect(() => {
    const storedUser = authService.getUser();
    if (storedUser && authService.isAuthenticated()) {
      setIsAuthenticated(true);
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials);
      
      if (response.success) {
        setIsAuthenticated(true);
        setUser(response.user);
        return { success: true };
      } else {
        return { success: false, error: response.message || 'Error al iniciar sesión' };
      }
    } catch (error) {
      return { success: false, error: error.message || 'Error de conexión' };
    }
  };

  const logout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      user,
      loading,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};