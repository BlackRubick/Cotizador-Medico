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
    
    // ========== VALIDACIONES BÁSICAS OPCIONALES ==========
    // Solo validar que tenga al menos empresa responsable o nombre
    if (!clientData.empresaResponsable && !clientData.name) {
      throw new Error('El nombre de la empresa o cliente es requerido');
    }

    // ========== ENCARGADOS OPCIONALES ==========
    // Los encargados ahora son completamente opcionales
    const encargadosValidos = (clientData.encargados || []).filter(enc => enc.nombre && enc.nombre.trim());
    console.log(`👥 Procesando ${encargadosValidos.length} encargado(s) válido(s) de ${(clientData.encargados || []).length} proporcionado(s)`);

    // Usar el primer encargado si existe, sino usar datos generales
    const encargadoPrincipal = encargadosValidos.length > 0 ? encargadosValidos[0] : null;

    // Mapear datos del frontend al formato del backend (TODOS LOS CAMPOS OPCIONALES)
    const mappedData = {
      name: (clientData.empresaResponsable || clientData.name || '').trim(),
      contact: encargadoPrincipal?.nombre?.trim() || clientData.dependencia?.trim() || 'Contacto General',
      email: encargadoPrincipal?.email?.trim() || this.generateEmail(clientData),
      phone: encargadoPrincipal?.telefono?.trim() || this.generatePhone(clientData),
      street: (clientData.direccion || clientData.street || '').trim(),
      city: (clientData.ciudad || clientData.city || '').trim(),
      state: (clientData.estado || clientData.state || '').trim(),
      zipCode: (clientData.codigoPostal || clientData.zipCode || '').trim(),
      country: 'México',
      clientType: 'Hospital',
      notes: JSON.stringify({
        // Datos del hospital y equipo
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
        estatusInicio26: clientData.estatusInicio26,
        // NUEVO: Array de encargados completo
        encargados: encargadosValidos.map(enc => ({
          id: enc.id,
          nombre: enc.nombre.trim(),
          cargo: enc.cargo?.trim() || '',
          telefono: enc.telefono?.trim() || '',
          email: enc.email?.trim() || '',
          fechaRegistro: new Date().toISOString()
        }))
      })
    };

    console.log('Mapped data for backend with encargados:', mappedData);

    const response = await this.makeRequest('/clients', {
      method: 'POST',
      body: JSON.stringify(mappedData),
    });
    
    return response;
  }

  // Actualizar cliente
  async updateClient(id, clientData) {
    console.log('📝 Updating client with data:', clientData);

    // ========== ENCARGADOS OPCIONALES EN UPDATE ==========
    const encargadosValidos = (clientData.encargados || []).filter(enc => enc.nombre && enc.nombre.trim());
    console.log(`👥 Actualizando con ${encargadosValidos.length} encargado(s) válido(s)`);

    // Usar el primer encargado si existe, sino usar datos generales
    const encargadoPrincipal = encargadosValidos.length > 0 ? encargadosValidos[0] : null;

    const mappedData = {
      name: (clientData.empresaResponsable || clientData.name || '').trim(),
      contact: encargadoPrincipal?.nombre?.trim() || clientData.dependencia?.trim() || 'Contacto General',
      email: encargadoPrincipal?.email?.trim() || this.generateEmail(clientData),
      phone: encargadoPrincipal?.telefono?.trim() || this.generatePhone(clientData),
      street: (clientData.direccion || clientData.street || '').trim(),
      city: (clientData.ciudad || clientData.city || '').trim(),
      state: (clientData.estado || clientData.state || '').trim(),
      zipCode: (clientData.codigoPostal || clientData.zipCode || '').trim(),
      country: 'México',
      clientType: 'Hospital',
      notes: JSON.stringify({
        // Datos del hospital y equipo
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
        estatusInicio26: clientData.estatusInicio26,
        // ACTUALIZADO: Array de encargados con preservación de fechas
        encargados: encargadosValidos.map(enc => ({
          id: enc.id,
          nombre: enc.nombre.trim(),
          cargo: enc.cargo?.trim() || '',
          telefono: enc.telefono?.trim() || '',
          email: enc.email?.trim() || '',
          fechaRegistro: enc.fechaRegistro || new Date().toISOString() // Preservar fecha existente
        }))
      })
    };

    console.log('Mapped update data for backend with encargados:', mappedData);

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

  // NUEVOS MÉTODOS PARA MANEJAR ENCARGADOS

  // Obtener encargados de un cliente específico
  async getClientEncargados(clientId) {
    try {
      const client = await this.getClient(clientId);
      const frontendClient = this.mapBackendToFrontend(client);
      return frontendClient.encargados || [];
    } catch (error) {
      console.error('Error getting client encargados:', error);
      throw error;
    }
  }

  // Agregar encargado a un cliente existente
  async addEncargadoToClient(clientId, encargadoData) {
    try {
      // Obtener cliente actual
      const client = await this.getClient(clientId);
      const frontendClient = this.mapBackendToFrontend(client);
      
      // Agregar nuevo encargado
      const newEncargado = {
        id: Date.now(),
        nombre: encargadoData.nombre.trim(),
        cargo: encargadoData.cargo?.trim() || '',
        telefono: encargadoData.telefono?.trim() || '',
        email: encargadoData.email?.trim() || '',
        fechaRegistro: new Date().toISOString()
      };

      frontendClient.encargados = [...(frontendClient.encargados || []), newEncargado];
      
      // Actualizar cliente
      return await this.updateClient(clientId, frontendClient);
    } catch (error) {
      console.error('Error adding encargado to client:', error);
      throw error;
    }
  }

  // Actualizar encargado específico
  async updateClientEncargado(clientId, encargadoId, encargadoData) {
    try {
      // Obtener cliente actual
      const client = await this.getClient(clientId);
      const frontendClient = this.mapBackendToFrontend(client);
      
      // Actualizar encargado específico
      frontendClient.encargados = (frontendClient.encargados || []).map(enc => 
        enc.id === encargadoId 
          ? {
              ...enc,
              nombre: encargadoData.nombre.trim(),
              cargo: encargadoData.cargo?.trim() || '',
              telefono: encargadoData.telefono?.trim() || '',
              email: encargadoData.email?.trim() || ''
            }
          : enc
      );
      
      // Actualizar cliente
      return await this.updateClient(clientId, frontendClient);
    } catch (error) {
      console.error('Error updating client encargado:', error);
      throw error;
    }
  }

  // Eliminar encargado específico
  async removeEncargadoFromClient(clientId, encargadoId) {
    try {
      // Obtener cliente actual
      const client = await this.getClient(clientId);
      const frontendClient = this.mapBackendToFrontend(client);
      
      // Verificar que no sea el último encargado
      if (frontendClient.encargados.length <= 1) {
        throw new Error('No se puede eliminar el último encargado. Debe haber al menos uno.');
      }
      
      // Eliminar encargado específico
      frontendClient.encargados = (frontendClient.encargados || []).filter(enc => enc.id !== encargadoId);
      
      // Actualizar cliente
      return await this.updateClient(clientId, frontendClient);
    } catch (error) {
      console.error('Error removing encargado from client:', error);
      throw error;
    }
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

  // Mapear datos del backend al frontend - ACTUALIZADO CON ENCARGADOS
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

    // Mapear encargados con validación
    let encargados = [];
    if (additionalData.encargados && Array.isArray(additionalData.encargados)) {
      encargados = additionalData.encargados.filter(enc => enc.nombre && enc.nombre.trim());
    }

    // Si no hay encargados en notes, crear uno basado en los datos principales del backend
    if (encargados.length === 0) {
      encargados = [{
        id: 1,
        nombre: backendClient.contact || 'Encargado Principal',
        cargo: 'Contacto Principal',
        telefono: backendClient.phone || '',
        email: backendClient.email || '',
        fechaRegistro: backendClient.createdAt || new Date().toISOString()
      }];
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
      // NUEVO: Array de encargados
      encargados: encargados,
      // Campos adicionales del backend
      tipo: backendClient.clientType,
      estadoCliente: backendClient.status === 'active' ? 'activo' : 'inactivo', // Renombrado para evitar conflicto
      fechaCreacion: backendClient.createdAt,
      ultimaCotizacion: backendClient.lastQuoteDate,
      totalCotizaciones: backendClient.totalQuotes,
      montoTotal: backendClient.totalAmount
    };
  }

  // MÉTODO AUXILIAR: Obtener encargado principal
  getEncargadoPrincipal(encargados) {
    if (!encargados || encargados.length === 0) return null;
    
    // Buscar encargado con cargo de director o similar
    const director = encargados.find(enc => 
      enc.cargo && (
        enc.cargo.toLowerCase().includes('director') ||
        enc.cargo.toLowerCase().includes('jefe') ||
        enc.cargo.toLowerCase().includes('responsable')
      )
    );
    
    return director || encargados[0]; // Retornar director o el primero
  }

  // MÉTODO AUXILIAR: Formatear información de encargados para mostrar
  formatEncargadosInfo(encargados) {
    if (!encargados || encargados.length === 0) return 'Sin encargados';
    
    if (encargados.length === 1) {
      const enc = encargados[0];
      return `${enc.nombre}${enc.cargo ? ` (${enc.cargo})` : ''}`;
    }
    
    return `${encargados.length} encargados: ${encargados.map(e => e.nombre).join(', ')}`;
  }

  // ========== FUNCIONES AUXILIARES PARA GENERAR DATOS ==========

  // Generar email automáticamente
  generateEmail(clientData) {
    if (clientData.email && clientData.email.trim() !== '') {
      return clientData.email.toLowerCase().trim();
    }

    // Generar email basado en número de serie o nombre
    const baseEmail = clientData.numeroSerie || clientData.empresaResponsable || 'cliente';
    return `${baseEmail.toString().trim().toLowerCase().replace(/\s+/g, '.')}@hospital.com`;
  }

  // Generar teléfono automáticamente  
  generatePhone(clientData) {
    if (clientData.phone && clientData.phone.trim() !== '') {
      return clientData.phone.trim();
    }

    // Usar código postal como fallback para teléfono
    return (clientData.codigoPostal || clientData.zipCode || '0000000000').toString();
  }
}

export default new ClientService();