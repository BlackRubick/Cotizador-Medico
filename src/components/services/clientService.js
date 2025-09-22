// services/clientService.js
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ClientService {
  // Método auxiliar para hacer requests
  async makeRequest(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    // Obtener token del localStorage
    const token = localStorage.getItem('token');
    if (token) {
      defaultOptions.headers.Authorization = `Bearer ${token}`;
    }

    const config = {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers,
      },
    };

    try {
      console.log('Making request to:', url);
      console.log('Request config:', config);
      
      const response = await fetch(url, config);
      
      let data;
      let responseText;
      
      try {
        // Primero obtener el texto de respuesta
        responseText = await response.text();
        
        // Intentar parsearlo como JSON
        data = JSON.parse(responseText);
      } catch (jsonError) {
        console.error('Response is not valid JSON:', responseText);
        
        // Si es un error 429, crear un objeto de error apropiado
        if (response.status === 429) {
          data = { message: 'Too Many Requests - Rate limit exceeded' };
        } else {
          data = { message: responseText || 'Error del servidor' };
        }
      }

      console.log('Response status:', response.status);
      console.log('Response data:', data);

      if (!response.ok) {
        // Manejo especial para rate limiting
        if (response.status === 429) {
          throw new Error('Too Many Requests - El servidor está limitando las peticiones. Intenta de nuevo en unos momentos.');
        }
        
        // Mejorar el manejo de errores para mostrar más detalles
        let errorMessage = data.message || `HTTP error! status: ${response.status}`;
        
        // Si hay errores de validación específicos, incluirlos
        if (data.errors && Array.isArray(data.errors)) {
          errorMessage += ': ' + data.errors.join(', ');
        }
        
        // Si hay un error específico del campo
        if (data.error) {
          errorMessage += ': ' + data.error;
        }
        
        throw new Error(errorMessage);
      }

      return data;
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  }

  // Obtener todos los clientes
  async getClients(params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    const endpoint = queryParams ? `/clients?${queryParams}` : '/clients';
    
    const response = await this.makeRequest(endpoint);
    return response;
  }

  // Obtener un cliente por ID
  async getClient(id) {
    const response = await this.makeRequest(`/clients/${id}`);
    return response;
  }

  // Crear nuevo cliente
  async createClient(clientData) {
    console.log('Creating client with data:', clientData);
    
    // Validaciones básicas en el frontend con los nuevos campos
    if (!clientData.empresaResponsable || !clientData.dependencia || !clientData.hospital || 
        !clientData.estado || !clientData.ciudad || !clientData.codigoPostal || 
        !clientData.direccion || !clientData.equipo || !clientData.marca || 
        !clientData.modelo || !clientData.numeroSerie) {
      throw new Error('Los campos empresaResponsable, dependencia, hospital, estado, ciudad, codigoPostal, direccion, equipo, marca, modelo y numeroSerie son requeridos');
    }

    // Mapear datos del frontend al formato del backend
    const mappedData = {
      name: clientData.empresaResponsable.trim(),
      contact: clientData.dependencia.trim(),
      email: `${clientData.numeroSerie.trim().toLowerCase()}@hospital.com`, // Email generado
      phone: clientData.codigoPostal.trim(),
      street: clientData.direccion.trim(),
      city: clientData.ciudad.trim(),
      state: clientData.estado.trim(),
      zipCode: clientData.codigoPostal.trim(),
      country: 'México',
      clientType: 'Hospital',
      notes: JSON.stringify({
        empresaResponsable: clientData.empresaResponsable,
        dependencia: clientData.dependencia,
        hospital: clientData.hospital,
        contrato: clientData.contrato,
        equipo: clientData.equipo,
        marca: clientData.marca,
        modelo: clientData.modelo,
        numeroSerie: clientData.numeroSerie,
        fechaInstalacion: clientData.fechaInstalacion,
        ultimoMantenimiento: clientData.ultimoMantenimiento,
        estatusAbril2025: clientData.estatusAbril2025,
        estatusInicio26: clientData.estatusInicio26
      })
    };

    console.log('Mapped data for backend:', mappedData);

    const response = await this.makeRequest('/clients', {
      method: 'POST',
      body: JSON.stringify(mappedData),
    });
    
    return response;
  }

  // Actualizar cliente
  async updateClient(id, clientData) {
    const mappedData = {
      name: clientData.empresaResponsable.trim(),
      contact: clientData.dependencia.trim(),
      email: `${clientData.numeroSerie.trim().toLowerCase()}@hospital.com`,
      phone: clientData.codigoPostal.trim(),
      street: clientData.direccion.trim(),
      city: clientData.ciudad.trim(),
      state: clientData.estado.trim(),
      zipCode: clientData.codigoPostal.trim(),
      country: 'México',
      clientType: 'Hospital',
      notes: JSON.stringify({
        empresaResponsable: clientData.empresaResponsable,
        dependencia: clientData.dependencia,
        hospital: clientData.hospital,
        contrato: clientData.contrato,
        equipo: clientData.equipo,
        marca: clientData.marca,
        modelo: clientData.modelo,
        numeroSerie: clientData.numeroSerie,
        fechaInstalacion: clientData.fechaInstalacion,
        ultimoMantenimiento: clientData.ultimoMantenimiento,
        estatusAbril2025: clientData.estatusAbril2025,
        estatusInicio26: clientData.estatusInicio26
      })
    };

    const response = await this.makeRequest(`/clients/${id}`, {
      method: 'PUT',
      body: JSON.stringify(mappedData),
    });
    
    return response;
  }

  // Eliminar cliente
  async deleteClient(id) {
    const response = await this.makeRequest(`/clients/${id}`, {
      method: 'DELETE',
    });
    
    return response;
  }

  // Obtener estadísticas de clientes
  async getClientStats() {
    const response = await this.makeRequest('/clients/stats');
    return response;
  }

  // Métodos auxiliares para mapear datos
  extractStreetFromAddress(fullAddress) {
    if (!fullAddress) return '';
    // Tomar solo la primera parte antes de la primera coma
    return fullAddress.split(',')[0].trim();
  }

  mapClientType(frontendType) {
    const typeMap = {
      'Cliente': 'Hospital',
      'Hospital': 'Hospital',
      'Clínica': 'Clínica',
      'Laboratorio': 'Laboratorio',
      'Centro Diagnóstico': 'Centro Diagnóstico',
      'Consultorio': 'Consultorio',
      'Proveedor': 'Otro'
    };
    
    return typeMap[frontendType] || 'Hospital';
  }

  // Mapear datos del backend al frontend
  mapBackendToFrontend(backendClient) {
    // Intentar parsear los datos adicionales desde notes
    let additionalData = {};
    try {
      if (backendClient.notes) {
        additionalData = JSON.parse(backendClient.notes);
      }
    } catch (error) {
      console.warn('Error parsing client notes:', error);
    }

    return {
      id: backendClient.id,
      empresaResponsable: additionalData.empresaResponsable || backendClient.name,
      dependencia: additionalData.dependencia || backendClient.contact,
      hospital: additionalData.hospital || backendClient.name,
      estado: additionalData.estado || backendClient.state,
      ciudad: additionalData.ciudad || backendClient.city,
      codigoPostal: additionalData.codigoPostal || backendClient.zipCode,
      direccion: additionalData.direccion || backendClient.street,
      contrato: additionalData.contrato || '',
      equipo: additionalData.equipo || '',
      marca: additionalData.marca || '',
      modelo: additionalData.modelo || '',
      numeroSerie: additionalData.numeroSerie || '',
      fechaInstalacion: additionalData.fechaInstalacion || '',
      ultimoMantenimiento: additionalData.ultimoMantenimiento || '',
      estatusAbril2025: additionalData.estatusAbril2025 || '',
      estatusInicio26: additionalData.estatusInicio26 || '',
      tipo: backendClient.clientType,
      estado: backendClient.status === 'active' ? 'activo' : 'inactivo',
      fechaCreacion: backendClient.createdAt,
      ultimaCotizacion: backendClient.lastQuoteDate,
      totalCotizaciones: backendClient.totalQuotes,
      montoTotal: backendClient.totalAmount
    };
  }
}

export default new ClientService();