import React, { createContext, useContext, useState } from 'react';

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

  const login = async (credentials) => {
    // Simular autenticación
    if (credentials.username === 'admin' && credentials.password === 'password') {
      setIsAuthenticated(true);
      setUser({
        id: 1,
        username: credentials.username,
        name: 'Juan Carlos',
        lastName: 'González López',
        email: 'juan.gonzalez@empresa.com',
        phone: '+52 961 123 4567',
        role: 'Administrador'
      });
      return { success: true };
    }
    return { success: false, error: 'Credenciales inválidas' };
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      user,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};
