// services/clientService.js
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

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
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
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
    // Mapear datos del frontend al formato del backend
    const mappedData = {
      name: clientData.nombre,
      contact: clientData.contacto,
      email: clientData.email,
      phone: clientData.telefono,
      street: this.extractStreetFromAddress(clientData.direccion),
      city: 'Tuxtla Gutiérrez', // Por defecto, puedes hacer esto dinámico
      state: 'Chiapas',
      zipCode: '29000',
      country: 'México',
      rfc: clientData.rfc,
      clientType: this.mapClientType(clientData.tipo),
      notes: clientData.notas || ''
    };

    const response = await this.makeRequest('/clients', {
      method: 'POST',
      body: JSON.stringify(mappedData),
    });
    
    return response;
  }

  // Actualizar cliente
  async updateClient(id, clientData) {
    const mappedData = {
      name: clientData.nombre,
      contact: clientData.contacto,
      email: clientData.email,
      phone: clientData.telefono,
      street: this.extractStreetFromAddress(clientData.direccion),
      city: 'Tuxtla Gutiérrez',
      state: 'Chiapas',
      zipCode: '29000',
      country: 'México',
      rfc: clientData.rfc,
      clientType: this.mapClientType(clientData.tipo),
      notes: clientData.notas || ''
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
    return {
      id: backendClient.id,
      nombre: backendClient.name,
      contacto: backendClient.contact,
      telefono: backendClient.phone,
      email: backendClient.email,
      direccion: backendClient.fullAddress || `${backendClient.street}, ${backendClient.city}, ${backendClient.state}`,
      rfc: backendClient.rfc,
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