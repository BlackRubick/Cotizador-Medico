// src/components/services/quoteService.js - ACTUALIZADO para tu API
import { apiRequest } from '../config/api';

class QuoteService {
  // Crear una nueva cotización
  async createQuote(quoteData) {
    try {
      console.log('🚀 Creating quote with data:', quoteData);
      
      // Mapear datos del frontend al formato del backend
      const mappedData = this.mapFrontendToBackend(quoteData);
      console.log('📤 Mapped data for API:', mappedData);
      
      const response = await apiRequest('/quotes', {
        method: 'POST',
        body: JSON.stringify(mappedData),
      });
      
      console.log('✅ Quote created successfully:', response);
      return response;
    } catch (error) {
      console.error('❌ Create quote error:', error);
      throw error;
    }
  }

  // Obtener todas las cotizaciones
  async getQuotes(params = {}) {
    try {
      const queryParams = new URLSearchParams(params).toString();
      const endpoint = queryParams ? `/quotes?${queryParams}` : '/quotes';
      
      const response = await apiRequest(endpoint);
      return response;
    } catch (error) {
      console.error('Get quotes error:', error);
      throw error;
    }
  }

  // Obtener una cotización por ID
  async getQuote(id) {
    try {
      const response = await apiRequest(`/quotes/${id}`);
      return response;
    } catch (error) {
      console.error('Get quote error:', error);
      throw error;
    }
  }

  // Actualizar cotización
  async updateQuote(id, quoteData) {
    try {
      const mappedData = this.mapFrontendToBackend(quoteData);
      
      const response = await apiRequest(`/quotes/${id}`, {
        method: 'PUT',
        body: JSON.stringify(mappedData),
      });
      
      return response;
    } catch (error) {
      console.error('Update quote error:', error);
      throw error;
    }
  }

  // Actualizar estado de cotización
  async updateQuoteStatus(id, status) {
    try {
      const response = await apiRequest(`/quotes/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      
      return response;
    } catch (error) {
      console.error('Update quote status error:', error);
      throw error;
    }
  }

  // Eliminar cotización
  async deleteQuote(id) {
    try {
      const response = await apiRequest(`/quotes/${id}`, {
        method: 'DELETE',
      });
      
      return response;
    } catch (error) {
      console.error('Delete quote error:', error);
      throw error;
    }
  }

  // Obtener estadísticas de cotizaciones
  async getQuoteStats() {
    try {
      const response = await apiRequest('/quotes/stats');
      return response;
    } catch (error) {
      console.error('Get quote stats error:', error);
      throw error;
    }
  }

  // Mapear datos del frontend al formato del backend
  mapFrontendToBackend(frontendData) {
    console.log('🔄 Mapping frontend data:', frontendData);
    
    // Mapear productos del carrito
    const mappedProducts = (frontendData.products || frontendData.items || []).map(item => ({
      id: item.id,
      productId: item.id,
      code: item.code,
      name: item.name,
      brand: item.brand || 'N/A',
      category: item.category || item.categoryName || 'N/A',
      description: item.description || '',
      quantity: item.quantity,
      basePrice: item.basePrice || item.unitPrice || 0,
      unitPrice: item.basePrice || item.unitPrice || 0,
      totalPrice: (item.quantity || 1) * (item.basePrice || item.unitPrice || 0)
    }));

    return {
      // Información del cliente
      clientId: frontendData.clientId || null,
      clientName: frontendData.clientName || frontendData.clientInfo?.name,
      clientContact: frontendData.clientContact || frontendData.clientInfo?.contact,
      email: frontendData.email || frontendData.clientInfo?.email,
      phone: frontendData.phone || frontendData.clientInfo?.phone,
      clientAddress: frontendData.clientAddress || frontendData.clientInfo?.address,
      clientPosition: frontendData.clientPosition || frontendData.clientInfo?.position || '',
      
      // Productos
      products: mappedProducts,
      
      // Términos y condiciones
      terms: {
        paymentConditions: frontendData.terms?.paymentConditions || '100% Anticipado a la entrega. (Transferencia Bancaria)',
        deliveryTime: frontendData.terms?.deliveryTime || '15 días hábiles',
        warranty: frontendData.terms?.warranty || 'Garantía: 12 meses sobre defectos de fabricación.',
        observations: frontendData.terms?.observations || 'Sin más por el momento, nos ponemos a sus órdenes para cualquier duda y/o información adicional.',
        validUntil: frontendData.terms?.validUntil || null
      }
    };
  }

  // Mapear datos del backend al frontend
  mapBackendToFrontend(backendQuote) {
    return {
      id: backendQuote.id,
      folio: backendQuote.folio,
      fecha: this.formatDate(backendQuote.createdAt),
      estado: this.mapStatus(backendQuote.status),
      razonSocial: backendQuote.clientInfoName,
      direccion: backendQuote.clientInfoAddress,
      encargado: backendQuote.clientInfoContact,
      puesto: backendQuote.clientInfoPosition,
      correo: backendQuote.clientInfoEmail,
      numero: backendQuote.clientInfoPhone,
      productos: backendQuote.products || [],
      subtotal: parseFloat(backendQuote.subtotal || 0),
      iva: parseFloat(backendQuote.taxAmount || 0),
      total: parseFloat(backendQuote.total || 0),
      condiciones: {
        precios: 'LOS PRECIOS NO INCLUYEN IVA (16%)',
        moneda: backendQuote.currency || 'Pesos Mexicanos',
        condicionesPago: backendQuote.termsPaymentConditions,
        tiempoEntrega: backendQuote.termsDeliveryTime,
        garantia: backendQuote.termsWarranty,
        observaciones: backendQuote.termsObservations
      },
      fechaCreacion: backendQuote.createdAt,
      fechaEnvio: backendQuote.sentDate,
      fechaConfirmacion: backendQuote.confirmedDate
    };
  }

  // Mapear estados del backend al frontend
  mapStatus(backendStatus) {
    const statusMap = {
      'draft': 'borrador',
      'sent': 'enviado',
      'pending': 'pendiente',
      'confirmed': 'confirmado',
      'rejected': 'rechazado',
      'cancelled': 'cancelado',
      'expired': 'expirado'
    };
    
    return statusMap[backendStatus] || backendStatus;
  }

  // Formatear fecha para mostrar
  formatDate(dateString) {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('es-MX', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  // Validar datos de cotización antes de enviar
  validateQuoteData(quoteData) {
    const errors = [];

    if (!quoteData.clientId && !quoteData.clientName) {
      errors.push('Cliente es requerido');
    }

    if (!quoteData.email) {
      errors.push('Email del cliente es requerido');
    }

    if (!quoteData.products || quoteData.products.length === 0) {
      errors.push('Al menos un producto es requerido');
    }

    if (quoteData.products) {
      quoteData.products.forEach((product, index) => {
        if (!product.id && !product.productId) {
          errors.push(`Producto ${index + 1}: ID es requerido`);
        }
        if (!product.quantity || product.quantity <= 0) {
          errors.push(`Producto ${index + 1}: Cantidad debe ser mayor a 0`);
        }
        if (!product.basePrice && !product.unitPrice) {
          errors.push(`Producto ${index + 1}: Precio es requerido`);
        }
      });
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Calcular totales de cotización
  calculateTotals(products) {
    const subtotal = products.reduce((sum, product) => {
      const quantity = product.quantity || 1;
      const price = product.basePrice || product.unitPrice || 0;
      return sum + (quantity * price);
    }, 0);

    const tax = subtotal * 0.16; // 16% IVA
    const total = subtotal + tax;

    return {
      subtotal,
      tax,
      total
    };
  }

  // Generar PDF de cotización (placeholder para futura implementación)
  async generateQuotePDF(quoteId) {
    try {
      const response = await apiRequest(`/quotes/${quoteId}/pdf`, {
        method: 'GET',
        headers: {
          'Accept': 'application/pdf'
        }
      });
      
      return response;
    } catch (error) {
      console.error('Generate PDF error:', error);
      throw error;
    }
  }

  // Enviar cotización por email
  async sendQuoteByEmail(quoteId, emailData = {}) {
    try {
      const response = await apiRequest(`/quotes/${quoteId}/send`, {
        method: 'POST',
        body: JSON.stringify(emailData),
      });
      
      return response;
    } catch (error) {
      console.error('Send quote email error:', error);
      throw error;
    }
  }
}

export default new QuoteService();