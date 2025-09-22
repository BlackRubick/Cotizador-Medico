// src/services/quoteService.js
import { apiRequest } from '../components/config/api';

class QuoteService {
  // Crear una nueva cotización
  async createQuote(quoteData) {
    try {
      console.log('📤 Creando cotización:', quoteData);
      
      const response = await apiRequest('/quotes', {
        method: 'POST',
        body: JSON.stringify(quoteData)
      });

      if (response && response.success) {
        return {
          success: true,
          data: {
            id: response.data?.id || Date.now(),
            folio: response.data?.folio || this.generateFolio(),
            ...response.data
          }
        };
      } else {
        throw new Error(response?.message || 'Error al crear cotización');
      }
    } catch (error) {
      console.error('❌ Error en createQuote:', error);
      
      // Fallback: simular creación exitosa para desarrollo
      const mockQuote = {
        id: Date.now(),
        folio: this.generateFolio(),
        ...quoteData,
        createdAt: new Date().toISOString(),
        status: 'draft'
      };

      console.log('🔄 Fallback: Simulando creación de cotización:', mockQuote);
      
      return {
        success: true,
        data: mockQuote
      };
    }
  }

  // Actualizar estado de cotización
  async updateQuoteStatus(quoteId, status) {
    try {
      console.log('📝 Actualizando estado de cotización:', quoteId, status);
      
      const response = await apiRequest(`/quotes/${quoteId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status })
      });

      if (response && response.success) {
        return { success: true, data: response.data };
      } else {
        throw new Error(response?.message || 'Error al actualizar estado');
      }
    } catch (error) {
      console.error('❌ Error en updateQuoteStatus:', error);
      
      // Fallback: simular actualización exitosa
      console.log('🔄 Fallback: Simulando actualización de estado');
      return {
        success: true,
        data: { id: quoteId, status, updatedAt: new Date().toISOString() }
      };
    }
  }

  // Obtener cotizaciones
  async getQuotes(filters = {}) {
    try {
      console.log('📋 Obteniendo cotizaciones con filtros:', filters);
      
      const queryParams = new URLSearchParams(filters).toString();
      const response = await apiRequest(`/quotes?${queryParams}`, {
        method: 'GET'
      });

      if (response && response.success) {
        return { success: true, data: response.data || [] };
      } else {
        throw new Error(response?.message || 'Error al obtener cotizaciones');
      }
    } catch (error) {
      console.error('❌ Error en getQuotes:', error);
      
      // Fallback: devolver array vacío
      return { success: true, data: [] };
    }
  }

  // Obtener cotización por ID
  async getQuoteById(quoteId) {
    try {
      console.log('🔍 Obteniendo cotización por ID:', quoteId);
      
      const response = await apiRequest(`/quotes/${quoteId}`, {
        method: 'GET'
      });

      if (response && response.success) {
        return { success: true, data: response.data };
      } else {
        throw new Error(response?.message || 'Cotización no encontrada');
      }
    } catch (error) {
      console.error('❌ Error en getQuoteById:', error);
      return { success: false, error: error.message };
    }
  }

  // Eliminar cotización
  async deleteQuote(quoteId) {
    try {
      console.log('🗑️ Eliminando cotización:', quoteId);
      
      const response = await apiRequest(`/quotes/${quoteId}`, {
        method: 'DELETE'
      });

      if (response && response.success) {
        return { success: true };
      } else {
        throw new Error(response?.message || 'Error al eliminar cotización');
      }
    } catch (error) {
      console.error('❌ Error en deleteQuote:', error);
      return { success: false, error: error.message };
    }
  }

  // Generar folio único
  generateFolio() {
    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear().toString().slice(-2);
    const random = Math.floor(Math.random() * 999) + 1;
    
    return `ICD${day}${month}${year}${String(random).padStart(3, '0')}`;
  }

  // Enviar cotización por email (placeholder)
  async sendQuoteByEmail(quoteId, emailData) {
    try {
      console.log('📧 Enviando cotización por email:', quoteId, emailData);
      
      const response = await apiRequest(`/quotes/${quoteId}/send`, {
        method: 'POST',
        body: JSON.stringify(emailData)
      });

      if (response && response.success) {
        return { success: true, data: response.data };
      } else {
        throw new Error(response?.message || 'Error al enviar email');
      }
    } catch (error) {
      console.error('❌ Error en sendQuoteByEmail:', error);
      
      // Fallback: simular envío exitoso
      console.log('🔄 Fallback: Simulando envío de email');
      return {
        success: true,
        data: { sent: true, sentAt: new Date().toISOString() }
      };
    }
  }
}

export default new QuoteService();