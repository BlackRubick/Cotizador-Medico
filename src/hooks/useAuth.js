// hooks/useAuth.js
import { useState, useEffect, useContext, createContext } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    // Si no hay contexto, devolver un hook simple (para compatibilidad)
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(() => {
      // Intentar cargar usuario del localStorage
      return authService.getUser();
    });

    const login = async (credentials) => {
      setLoading(true);
      try {
        const response = await authService.login(credentials);
        
        if (response.success) {
          setUser(response.user);
          return { success: true };
        } else {
          throw new Error(response.message || 'Error de login');
        }
      } catch (error) {
        return { success: false, error: error.message };
      } finally {
        setLoading(false);
      }
    };

    const logout = () => {
      authService.logout();
      setUser(null);
    };

    const forgotPassword = async (email) => {
      setLoading(true);
      try {
        const response = await authService.forgotPassword(email);
        return { success: response.success, message: response.message };
      } catch (error) {
        return { success: false, error: error.message };
      } finally {
        setLoading(false);
      }
    };

    return {
      user,
      loading,
      login,
      logout,
      forgotPassword,
      isAuthenticated: authService.isAuthenticated()
    };
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');

      if (token && savedUser) {
        setUser(JSON.parse(savedUser));
        setIsAuthenticated(true);
        
        // Verificar que el token sigue siendo válido
        try {
          const response = await authService.getMe();
          if (response.success) {
            setUser(response.user);
            // Actualizar usuario en localStorage
            localStorage.setItem('user', JSON.stringify(response.user));
          }
        } catch (error) {
          console.log('Token inválido, limpiando sesión');
          logout();
        }
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials);
      
      if (response.success) {
        setUser(response.user);
        setIsAuthenticated(true);
        return { success: true };
      } else {
        throw new Error(response.message || 'Error de login');
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  const forgotPassword = async (email) => {
    try {
      const response = await authService.forgotPassword(email);
      return { success: response.success, message: response.message };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    forgotPassword,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// HOC para proteger rutas
export const withAuth = (WrappedComponent) => {
  return function AuthComponent(props) {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    if (!isAuthenticated) {
      // Redirigir al login o mostrar mensaje
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Acceso no autorizado</h2>
            <p className="text-gray-600 mb-6">Debes iniciar sesión para acceder a esta página</p>
            <button 
              onClick={() => window.location.href = '/login'}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Ir al Login
            </button>
          </div>
        </div>
      );
    }

    return <WrappedComponent {...props} />;
  };
};