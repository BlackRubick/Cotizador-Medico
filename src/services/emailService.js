// src/services/emailService.js
import emailjs from '@emailjs/browser';
import { EMAIL_CONFIG, validateEmailConfig } from '../config/emailConfig';

// Inicializar EmailJS
emailjs.init(EMAIL_CONFIG.PUBLIC_KEY);

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
      const templateParams = {
        to_email: emailData.to_email,
        to_name: emailData.to_name || 'Cliente',
        from_name: emailData.from_name || EMAIL_CONFIG.COMPANY.name,
        company_name: emailData.company_name || EMAIL_CONFIG.COMPANY.name,
        company_phone: EMAIL_CONFIG.COMPANY.phone,
        company_email: EMAIL_CONFIG.COMPANY.email,
        company_website: EMAIL_CONFIG.COMPANY.website,
        
        subject: emailData.subject || `Cotización ${emailData.quote?.number || ''} - ${EMAIL_CONFIG.COMPANY.name}`,
        message: emailData.message || '',
        
        // Datos de la cotización con formato profesional
        quote_number: emailData.quote?.number || `COT-${Date.now()}`,
        quote_date: emailData.quote?.date || new Date().toLocaleDateString('es-MX', {
          weekday: 'long',
          year: 'numeric', 
          month: 'long', 
          day: 'numeric'
        }),
        quote_total: emailData.quote?.total || '0',
        quote_items: this.formatQuoteItemsProfessional(emailData.quote?.items || []),
        
        // Información del cliente/hospital
        client_hospital: emailData.client_hospital || emailData.to_name || 'Hospital',
        
        // Email de respuesta
        reply_to: emailData.reply_to || emailData.to_email,
      };

      console.log('📧 Enviando email profesional con parámetros:', templateParams);

      const response = await emailjs.send(
        EMAIL_CONFIG.SERVICE_ID,
        EMAIL_CONFIG.TEMPLATE_ID_QUOTE,
        templateParams,
        EMAIL_CONFIG.PUBLIC_KEY
      );

      console.log('✅ Email enviado exitosamente:', response);
      return {
        success: true,
        message: 'Cotización enviada por email exitosamente',
        response
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
      const templateParams = {
        from_name: contactData.name,
        from_email: contactData.email,
        subject: contactData.subject || 'Nuevo mensaje de contacto',
        message: contactData.message,
        to_email: EMAIL_CONFIG.COMPANY.email,
        reply_to: contactData.email,
      };

      const response = await emailjs.send(
        EMAIL_CONFIG.SERVICE_ID,
        EMAIL_CONFIG.TEMPLATE_ID_CONTACT,
        templateParams,
        EMAIL_CONFIG.PUBLIC_KEY
      );

      return {
        success: true,
        message: 'Mensaje enviado exitosamente',
        response
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
      const templateParams = {
        admin_email: EMAIL_CONFIG.ADMIN_EMAILS[0],
        quote_number: quoteData.number,
        client_name: quoteData.clientName,
        client_email: quoteData.clientEmail,
        quote_total: quoteData.total,
        quote_date: new Date().toLocaleDateString('es-ES'),
        message: `Nueva cotización generada por ${quoteData.createdBy || 'Usuario'}`,
      };

      const response = await emailjs.send(
        EMAIL_CONFIG.SERVICE_ID,
        EMAIL_CONFIG.TEMPLATE_ID_ADMIN,
        templateParams,
        EMAIL_CONFIG.PUBLIC_KEY
      );

      return {
        success: true,
        message: 'Notificación enviada al administrador',
        response
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
    return validateEmailConfig();
  }

  /**
   * Obtener configuración actual
   */
  getConfig() {
    return {
      service: EMAIL_CONFIG.SERVICE_ID,
      templates: {
        quote: EMAIL_CONFIG.TEMPLATE_ID_QUOTE,
        contact: EMAIL_CONFIG.TEMPLATE_ID_CONTACT,
        admin: EMAIL_CONFIG.TEMPLATE_ID_ADMIN
      },
      company: EMAIL_CONFIG.COMPANY,
      validation: this.validateConfig()
    };
  }
}

export default new EmailService();
