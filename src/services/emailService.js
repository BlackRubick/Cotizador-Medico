// src/services/emailService.js

class EmailService {
  /**
   * Enviar cotización por email
   * @param {Object} emailData - Datos del email
   * @param {string} emailData.to_email - Email del destinatario
   * @param {string} emailData.to_name - Nombre del destinatario
   * @param {string} emailData.subject - Asunto del email
   * @param {string} emailData.message - Mensaje del email
   * @param {Object} emailData.quote - Datos de la cotización
   * @param {string} emailData.company_name - Nombre de la empresa
   * @param {string} emailData.from_name - Nombre del remitente
   * @param {string} emailData.client_hospital - Nombre del hospital/cliente
   */
  async sendQuote(emailData) {
    try {
      // Lógica para enviar email con nodemailer en el backend
      console.log('📧 Enviando email profesional (lógica no implementada):', emailData);

      return {
        success: true,
        message: 'Cotización enviada por email exitosamente (simulación)',
      };

    } catch (error) {
      console.error('❌ Error al enviar email:', error);
      return {
        success: false,
        message: 'Error al enviar el email: ' + (error.text || error.message),
        error
      };
    }
  }

  /**
   * Enviar email de contacto
   * @param {Object} contactData - Datos del contacto
   */
  async sendContactEmail(contactData) {
    try {
      // Lógica para enviar email con nodemailer en el backend
      console.log('📧 Enviando email de contacto (lógica no implementada):', contactData);

      return {
        success: true,
        message: 'Mensaje enviado exitosamente (simulación)',
      };

    } catch (error) {
      console.error('Error al enviar email de contacto:', error);
      return {
        success: false,
        message: 'Error al enviar el mensaje: ' + error.text || error.message,
        error
      };
    }
  }

  /**
   * Enviar notificación de nueva cotización a admin
   * @param {Object} quoteData - Datos de la cotización
   */
  async sendQuoteNotificationToAdmin(quoteData) {
    try {
      // Lógica para enviar email con nodemailer en el backend
      console.log('📧 Enviando notificación a admin (lógica no implementada):', quoteData);

      return {
        success: true,
        message: 'Notificación enviada al administrador (simulación)',
      };

    } catch (error) {
      console.error('Error al enviar notificación:', error);
      return {
        success: false,
        message: 'Error al enviar notificación',
        error
      };
    }
  }

  /**
   * Formatear items de la cotización para el email (versión profesional)
   * @param {Array} items - Items de la cotización
   */
  formatQuoteItemsProfessional(items) {
    if (!items || items.length === 0) return 'No hay productos en esta cotización.';
    
    let formatted = '';
    let total = 0;
    
    items.forEach((item, index) => {
      const cantidad = item.quantity || item.cantidad || 1;
      const precio = parseFloat(item.price || item.precio || 0);
      const nombre = item.name || item.descripcion || item.nombre || 'Producto';
      const codigo = item.code || item.codigo || '';
      const subtotal = cantidad * precio;
      total += subtotal;
      
      formatted += `${index + 1}. ${nombre}\n`;
      if (codigo) formatted += `   Código: ${codigo}\n`;
      formatted += `   Cantidad: ${cantidad}\n`;
      formatted += `   Precio unitario: $${precio.toLocaleString('es-MX', { minimumFractionDigits: 2 })}\n`;
      formatted += `   Subtotal: $${subtotal.toLocaleString('es-MX', { minimumFractionDigits: 2 })}\n`;
      if (index < items.length - 1) formatted += '\n';
    });
    
    formatted += `\n${'='.repeat(40)}\n`;
    formatted += `TOTAL: $${total.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`;
    
    return formatted;
  }

  /**
   * Formatear items de la cotización para el email (versión simple)
   * @param {Array} items - Items de la cotización
   */
  formatQuoteItems(items) {
    if (!items || items.length === 0) return 'No hay productos en esta cotización.';
    
    return items.map((item, index) => 
      `${index + 1}. ${item.name || item.descripcion || 'Producto'} - Cantidad: ${item.quantity || item.cantidad || 1} - Precio: $${item.price || item.precio || '0'}`
    ).join('\n');
  }

  /**
   * Validar configuración de email
   */
  validateConfig() {
    return true; // Simulación de validación
  }

  /**
   * Obtener configuración actual
   */
  getConfig() {
    return {
      service: 'SERVICE_ID_SIMULADO',
      templates: {
        quote: 'TEMPLATE_ID_QUOTE_SIMULADO',
        contact: 'TEMPLATE_ID_CONTACT_SIMULADO',
        admin: 'TEMPLATE_ID_ADMIN_SIMULADO'
      },
      company: {
        name: 'Nombre Empresa',
        email: 'email@empresa.com',
        phone: '123456789',
        website: 'www.empresa.com'
      },
      validation: this.validateConfig()
    };
  }
}

export default new EmailService();
