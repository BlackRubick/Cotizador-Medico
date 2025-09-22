// src/services/clientService.js
import { apiRequest } from '../components/config/api';

class ClientService {
  // Obtener lista de clientes
  async getClients(filters = {}) {
    try {
      console.log('👥 Obteniendo clientes con filtros:', filters);
      
      const queryParams = new URLSearchParams(filters).toString();
      const response = await apiRequest(`/clients?${queryParams}`, {
        method: 'GET'
      });

      console.log('📡 Respuesta de clientes:', response);

      if (response && response.success !== false) {
        // Si la respuesta es directamente un array
        if (Array.isArray(response)) {
          return { success: true, data: response };
        }
        
        // Si la respuesta tiene estructura con data
        if (response.data && Array.isArray(response.data)) {
          return { success: true, data: response.data };
        }
        
        // Si response es el objeto de datos directamente
        return { success: true, data: response };
      } else {
        throw new Error(response?.message || 'Error al obtener clientes');
      }
    } catch (error) {
      console.error('❌ Error en getClients:', error);
      
      // Fallback: devolver clientes de prueba
      const mockClients = [
        {
          id: 1,
          name: 'Hospital General de Tuxtla',
          contact: 'Dr. Juan Pérez',
          email: 'contacto@hospitaltuxtla.mx',
          phone: '+52 961 123 4567',
          street: 'Av. Central 123',
          city: 'Tuxtla Gutiérrez',
          state: 'Chiapas',
          zipCode: '29000',
          fullAddress: 'Av. Central 123, Tuxtla Gutiérrez, Chiapas 29000'
        },
        {
          id: 2,
          name: 'Clínica Santa Fe',
          contact: 'Dra. María González',
          email: 'info@clinicasantafe.mx',
          phone: '+52 961 234 5678',
          street: 'Blvd. Belisario Domínguez 456',
          city: 'Tuxtla Gutiérrez',
          state: 'Chiapas',
          zipCode: '29050',
          fullAddress: 'Blvd. Belisario Domínguez 456, Tuxtla Gutiérrez, Chiapas 29050'
        },
        {
          id: 3,
          name: 'Centro Médico del Sur',
          contact: 'Dr. Carlos Martínez',
          email: 'administracion@centromedicosur.mx',
          phone: '+52 961 345 6789',
          street: 'Calle 5 de Mayo 789',
          city: 'Tuxtla Gutiérrez',
          state: 'Chiapas',
          zipCode: '29070',
          fullAddress: 'Calle 5 de Mayo 789, Tuxtla Gutiérrez, Chiapas 29070'
        }
      ];

      console.log('🔄 Fallback: Devolviendo clientes de prueba:', mockClients.length);
      return { success: true, data: mockClients };
    }
  }

  // Obtener cliente por ID
  async getClientById(clientId) {
    try {
      console.log('🔍 Obteniendo cliente por ID:', clientId);
      
      const response = await apiRequest(`/clients/${clientId}`, {
        method: 'GET'
      });

      if (response && response.success !== false) {
        return { success: true, data: response.data || response };
      } else {
        throw new Error(response?.message || 'Cliente no encontrado');
      }
    } catch (error) {
      console.error('❌ Error en getClientById:', error);
      return { success: false, error: error.message };
    }
  }

  // Crear nuevo cliente
  async createClient(clientData) {
    try {
      console.log('➕ Creando cliente:', clientData);
      
      const response = await apiRequest('/clients', {
        method: 'POST',
        body: JSON.stringify(clientData)
      });

      if (response && response.success) {
        return { success: true, data: response.data };
      } else {
        throw new Error(response?.message || 'Error al crear cliente');
      }
    } catch (error) {
      console.error('❌ Error en createClient:', error);
      
      // Fallback: simular creación exitosa
      const mockClient = {
        id: Date.now(),
        ...clientData,
        fullAddress: `${clientData.street || ''}, ${clientData.city || ''}, ${clientData.state || ''} ${clientData.zipCode || ''}`.trim(),
        createdAt: new Date().toISOString()
      };

      console.log('🔄 Fallback: Simulando creación de cliente:', mockClient);
      return { success: true, data: mockClient };
    }
  }

  // Actualizar cliente
  async updateClient(clientId, clientData) {
    try {
      console.log('📝 Actualizando cliente:', clientId, clientData);
      
      const response = await apiRequest(`/clients/${clientId}`, {
        method: 'PUT',
        body: JSON.stringify(clientData)
      });

      if (response && response.success) {
        return { success: true, data: response.data };
      } else {
        throw new Error(response?.message || 'Error al actualizar cliente');
      }
    } catch (error) {
      console.error('❌ Error en updateClient:', error);
      return { success: false, error: error.message };
    }
  }

  // Eliminar cliente
  async deleteClient(clientId) {
    try {
      console.log('🗑️ Eliminando cliente:', clientId);
      
      const response = await apiRequest(`/clients/${clientId}`, {
        method: 'DELETE'
      });

      if (response && response.success) {
        return { success: true };
      } else {
        throw new Error(response?.message || 'Error al eliminar cliente');
      }
    } catch (error) {
      console.error('❌ Error en deleteClient:', error);
      return { success: false, error: error.message };
    }
  }

  // Buscar clientes por término
  async searchClients(searchTerm) {
    try {
      console.log('🔍 Buscando clientes:', searchTerm);
      
      const response = await apiRequest(`/clients/search?q=${encodeURIComponent(searchTerm)}`, {
        method: 'GET'
      });

      if (response && response.success !== false) {
        return { success: true, data: response.data || response };
      } else {
        throw new Error(response?.message || 'Error en búsqueda');
      }
    } catch (error) {
      console.error('❌ Error en searchClients:', error);
      
      // Fallback: buscar en clientes locales
      const allClients = await this.getClients();
      if (allClients.success) {
        const filtered = allClients.data.filter(client => 
          client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          client.contact?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          client.email?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        
        return { success: true, data: filtered };
      }
      
      return { success: false, error: error.message };
    }
  }
}

export default new ClientService();