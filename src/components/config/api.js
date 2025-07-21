// src/components/config/api.js

// Configuración de la API
export const API_CONFIG = {
  // URL base de la API - Vite usa import.meta.env
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  
  // Timeout para requests
  TIMEOUT: 30000, // Aumentado a 30 segundos para operaciones complejas
  
  // Headers por defecto
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
};

// Función helper para obtener headers con autenticación
export const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    ...API_CONFIG.DEFAULT_HEADERS,
    ...(token && { Authorization: `Bearer ${token}` })
  };
};

// Función helper para hacer requests
export const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_CONFIG.BASE_URL}${endpoint}`;
  
  const config = {
    headers: getAuthHeaders(),
    timeout: API_CONFIG.TIMEOUT,
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options.headers,
    },
  };

  try {
    console.log(`Making API request: ${config.method || 'GET'} ${url}`);
    console.log('Request config:', {
      headers: config.headers,
      body: config.body ? JSON.parse(config.body) : undefined
    });

    const response = await fetch(url, config);
    
    // Intentar parsear la respuesta como JSON
    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      // Si no es JSON, obtener como texto
      const text = await response.text();
      data = { message: text };
    }

    console.log(`API Response [${response.status}]:`, data);

    if (!response.ok) {
      // Manejo mejorado de errores
      let errorMessage = data.message || `HTTP error! status: ${response.status}`;
      
      // Errores específicos del servidor
      if (response.status === 401) {
        errorMessage = 'No autorizado. Por favor inicia sesión nuevamente.';
        // Limpiar token inválido
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Opcional: redirigir al login
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      } else if (response.status === 403) {
        errorMessage = 'No tienes permisos para realizar esta acción.';
      } else if (response.status === 404) {
        errorMessage = 'Recurso no encontrado.';
      } else if (response.status === 422) {
        errorMessage = 'Error de validación: ' + (data.message || 'Datos inválidos');
      } else if (response.status === 500) {
        errorMessage = 'Error interno del servidor. Intenta nuevamente.';
      }

      // Si hay errores específicos de validación, incluirlos
      if (data.errors && Array.isArray(data.errors)) {
        errorMessage += '\nDetalles: ' + data.errors.map(err => err.msg || err.message || err).join(', ');
      }

      throw new Error(errorMessage);
    }

    return data;
  } catch (error) {
    console.error('API Request Error:', error);
    
    // Manejo de errores de red
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Error de conexión. Verifica tu conexión a internet y que el servidor esté ejecutándose.');
    }
    
    // Re-lanzar el error original si ya es un error controlado
    throw error;
  }
};

// Función específica para endpoints que devuelven archivos (PDFs, imágenes, etc.)
export const apiRequestFile = async (endpoint, options = {}) => {
  const url = `${API_CONFIG.BASE_URL}${endpoint}`;
  
  const config = {
    headers: {
      Authorization: localStorage.getItem('token') ? `Bearer ${localStorage.getItem('token')}` : undefined
    },
    ...options,
    headers: {
      ...options.headers,
      Authorization: localStorage.getItem('token') ? `Bearer ${localStorage.getItem('token')}` : undefined
    },
  };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response; // Devolver la respuesta para que el caller maneje el blob/file
  } catch (error) {
    console.error('API File Request Error:', error);
    throw error;
  }
};

// Función para subir archivos
export const apiUploadFile = async (endpoint, file, additionalData = {}) => {
  const url = `${API_CONFIG.BASE_URL}${endpoint}`;
  
  const formData = new FormData();
  formData.append('file', file);
  
  // Agregar datos adicionales al FormData
  Object.keys(additionalData).forEach(key => {
    formData.append(key, additionalData[key]);
  });

  const config = {
    method: 'POST',
    headers: {
      Authorization: localStorage.getItem('token') ? `Bearer ${localStorage.getItem('token')}` : undefined
      // No incluir Content-Type para que el browser lo establezca automáticamente con boundary
    },
    body: formData
  };

  try {
    console.log(`Uploading file to: ${url}`);
    
    const response = await fetch(url, config);
    const data = await response.json();

    console.log(`Upload Response [${response.status}]:`, data);

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('API Upload Error:', error);
    throw error;
  }
};

// Funciones de utilidad
export const isTokenValid = () => {
  const token = localStorage.getItem('token');
  if (!token) return false;
  
  try {
    // Verificar si el token tiene el formato JWT básico
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    
    // Decodificar el payload (sin verificar la firma)
    const payload = JSON.parse(atob(parts[1]));
    
    // Verificar si no ha expirado
    const now = Date.now() / 1000;
    return payload.exp > now;
  } catch (error) {
    console.error('Error validating token:', error);
    return false;
  }
};

export const clearAuthData = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const getStoredUser = () => {
  try {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Error parsing stored user:', error);
    return null;
  }
};

// Interceptor para verificar token antes de cada request
const originalApiRequest = apiRequest;
export const apiRequestWithTokenCheck = async (endpoint, options = {}) => {
  // Verificar token antes de hacer el request
  if (!isTokenValid()) {
    clearAuthData();
    throw new Error('Token expirado. Por favor inicia sesión nuevamente.');
  }
  
  return originalApiRequest(endpoint, options);
};

// Función para reintentar requests automáticamente
export const apiRequestWithRetry = async (endpoint, options = {}, maxRetries = 3) => {
  let lastError;
  
  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await apiRequest(endpoint, options);
    } catch (error) {
      lastError = error;
      
      // No reintentar en errores de autenticación/autorización
      if (error.message.includes('401') || error.message.includes('403')) {
        throw error;
      }
      
      // No reintentar en el último intento
      if (i === maxRetries) {
        throw error;
      }
      
      // Esperar antes del siguiente intento (backoff exponencial)
      const delay = Math.pow(2, i) * 1000; // 1s, 2s, 4s
      console.log(`Request failed, retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
};