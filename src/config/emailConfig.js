// src/config/emailConfig.js
// Configuración de EmailJS - CAMBIAR SEGÚN TU CONFIGURACIÓN

export const EMAIL_CONFIG = {
  // IDs de EmailJS (obtener de tu dashboard)
  SERVICE_ID: 'default_service', // ⚠️ CAMBIAR: ID del servicio en EmailJS (ej: 'service_abc123')
  TEMPLATE_ID_QUOTE: 'template_cotizacion', // ⚠️ CAMBIAR: ID del template para cotizaciones
  TEMPLATE_ID_CONTACT: 'template_contacto', // ⚠️ CAMBIAR: ID del template para contacto
  TEMPLATE_ID_ADMIN: 'template_admin_notification', // ⚠️ CAMBIAR: ID del template para admin
  
  // Claves de EmailJS
  PUBLIC_KEY: 'Kijg9SZDUugSSWYYn',
  PRIVATE_KEY: 'icTuV5ZY7LmKztSVmNw0E',
  
  // Configuración de la empresa
  COMPANY: {
    name: 'Cotizador Médico',
    fullName: 'Cotizador Médico S.A. de C.V.',
    email: 'contacto@cotizadormedico.com', // ⚠️ CAMBIAR: Email de tu empresa
    phone: '+52 961 123 4567', // ⚠️ CAMBIAR: Teléfono de tu empresa
    website: 'www.cotizadormedico.com', // ⚠️ CAMBIAR: Website de tu empresa
    address: 'Dirección de tu empresa', // ⚠️ CAMBIAR: Dirección de tu empresa
  },
  
  // Emails para notificaciones
  ADMIN_EMAILS: [
    'admin@cotizadormedico.com', // ⚠️ CAMBIAR: Email del administrador principal
    'ventas@cotizadormedico.com' // ⚠️ CAMBIAR: Email adicional para notificaciones
  ],
  
  // Configuración por defecto de templates
  DEFAULT_SETTINGS: {
    language: 'es',
    timezone: 'America/Mexico_City',
    currency: 'MXN',
    dateFormat: 'es-MX'
  }
};

// Función para validar configuración
export const validateEmailConfig = () => {
  const errors = [];
  
  if (!EMAIL_CONFIG.SERVICE_ID || EMAIL_CONFIG.SERVICE_ID === 'default_service') {
    errors.push('SERVICE_ID no está configurado correctamente');
  }
  
  if (!EMAIL_CONFIG.TEMPLATE_ID_QUOTE || EMAIL_CONFIG.TEMPLATE_ID_QUOTE === 'template_cotizacion') {
    errors.push('TEMPLATE_ID_QUOTE no está configurado correctamente');
  }
  
  if (!EMAIL_CONFIG.PUBLIC_KEY) {
    errors.push('PUBLIC_KEY no está configurado');
  }
  
  if (!EMAIL_CONFIG.COMPANY.email || EMAIL_CONFIG.COMPANY.email.includes('cotizadormedico.com')) {
    errors.push('Email de la empresa no está configurado correctamente');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Instrucciones de configuración
export const SETUP_INSTRUCTIONS = {
  step1: {
    title: '1. Crear cuenta en EmailJS',
    description: 'Ve a https://www.emailjs.com/ y crea una cuenta gratuita'
  },
  step2: {
    title: '2. Configurar servicio de email',
    description: 'Conecta tu proveedor de email (Gmail, Outlook, etc.) y anota el SERVICE_ID'
  },
  step3: {
    title: '3. Crear templates de email',
    description: 'Crea templates para cotizaciones, contacto y notificaciones admin'
  },
  step4: {
    title: '4. Actualizar configuración',
    description: 'Modifica este archivo con tus IDs y datos de empresa'
  },
  step5: {
    title: '5. Probar funcionalidad',
    description: 'Haz pruebas enviando cotizaciones para verificar que funciona'
  }
};

// Templates profesionales basados en el formato de WhatsApp actual
export const EMAIL_TEMPLATES = {
  cotizacion: {
    id: 'template_cotizacion',
    subject: 'Cotización {{quote_number}} - {{company_name}}',
    html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff;">
      <!-- Header -->
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px 20px; text-align: center;">
        <h1 style="margin: 0; font-size: 28px; font-weight: bold;">{{company_name}}</h1>
        <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Cotización Médica Profesional</p>
      </div>
      
      <!-- Body -->
      <div style="padding: 40px 30px;">
        <h2 style="color: #333; font-size: 24px; margin-bottom: 20px; font-weight: bold;">
          Cotización {{quote_number}}
        </h2>
        
        <p style="color: #666; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">
          Estimado/a <strong>{{to_name}}</strong>,
        </p>
        
        <p style="color: #666; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">
          Esperamos se encuentre bien. Por medio del presente, nos es grato hacerle llegar 
          la cotización solicitada para <strong>{{client_hospital}}</strong>.
        </p>
        
        <!-- Detalles Box -->
        <div style="background-color: #f8fafc; border-left: 4px solid #667eea; padding: 25px; margin: 30px 0; border-radius: 0 8px 8px 0;">
          <h3 style="color: #333; font-size: 18px; margin-bottom: 15px; font-weight: bold;">
            📋 Detalles de la cotización:
          </h3>
          <ul style="color: #666; font-size: 16px; line-height: 1.8; margin: 0; padding-left: 20px;">
            <li><strong>Folio:</strong> {{quote_number}}</li>
            <li><strong>Fecha:</strong> {{quote_date}}</li>
            <li><strong>Total:</strong> {{quote_total}}</li>
            <li><strong>Hospital:</strong> {{client_hospital}}</li>
            <li><strong>Contacto:</strong> {{to_name}}</li>
          </ul>
        </div>
        
        <!-- Productos -->
        <div style="margin: 30px 0;">
          <h3 style="color: #333; font-size: 18px; margin-bottom: 15px; font-weight: bold;">
            🏥 Productos cotizados:
          </h3>
          <div style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px;">
            <pre style="font-family: Arial, sans-serif; color: #666; font-size: 14px; line-height: 1.6; margin: 0; white-space: pre-wrap;">{{quote_items}}</pre>
          </div>
        </div>
        
        <!-- Mensaje personalizado -->
        {{#if message}}
        <div style="background-color: #f0f9ff; border: 1px solid #bae6fd; border-radius: 8px; padding: 20px; margin: 25px 0;">
          <h4 style="color: #0369a1; font-size: 16px; margin-bottom: 10px;">💬 Mensaje adicional:</h4>
          <p style="color: #0c4a6e; font-size: 15px; line-height: 1.6; margin: 0;">{{message}}</p>
        </div>
        {{/if}}
        
        <p style="color: #666; font-size: 16px; line-height: 1.6; margin: 30px 0 20px 0;">
          Adjunto encontrará el PDF con todos los detalles, especificaciones técnicas y condiciones comerciales.
        </p>
        
        <p style="color: #666; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
          Quedamos a su disposición para cualquier duda o aclaración.
        </p>
        
        <p style="color: #333; font-size: 16px; font-weight: 600;">
          Saludos cordiales,<br>
          <span style="color: #667eea;">{{from_name}}</span>
        </p>
      </div>
      
      <!-- Footer -->
      <div style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 25px 30px; text-align: center;">
        <div style="color: #64748b; font-size: 14px; line-height: 1.6;">
          <p style="margin: 0 0 10px 0; font-weight: 600;">{{company_name}}</p>
          {{#if company_phone}}<p style="margin: 5px 0;">📞 {{company_phone}}</p>{{/if}}
          {{#if company_email}}<p style="margin: 5px 0;">📧 {{company_email}}</p>{{/if}}
          {{#if company_website}}<p style="margin: 5px 0;">🌐 {{company_website}}</p>{{/if}}
        </div>
      </div>
    </div>
    `,
    text: `Cotización {{quote_number}}

Estimado/a {{to_name}},

Esperamos se encuentre bien. Por medio del presente, nos es grato hacerle llegar la cotización solicitada para {{client_hospital}}.

Detalles de la cotización:
• Folio: {{quote_number}}
• Fecha: {{quote_date}}
• Total: {{quote_total}}
• Hospital: {{client_hospital}}
• Contacto: {{to_name}}

Productos cotizados:
{{quote_items}}

{{message}}

Adjunto encontrará el PDF con todos los detalles, especificaciones técnicas y condiciones comerciales.

Quedamos a su disposición para cualquier duda o aclaración.

Saludos cordiales,
{{from_name}}
{{company_name}}
    `
  },

  contacto: {
    id: 'template_contacto',
    subject: '📧 Nuevo mensaje de contacto - {{subject}}',
    html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff;">
      <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 20px; text-align: center;">
        <h1 style="margin: 0; font-size: 24px;">📧 Nuevo Mensaje de Contacto</h1>
      </div>
      
      <div style="padding: 30px;">
        <div style="background-color: #f0fdf4; border-left: 4px solid #10b981; padding: 20px; margin-bottom: 20px;">
          <h3 style="color: #333; margin-bottom: 15px;">Información del contacto:</h3>
          <p><strong>👤 Nombre:</strong> {{from_name}}</p>
          <p><strong>📧 Email:</strong> {{from_email}}</p>
          <p><strong>📋 Asunto:</strong> {{subject}}</p>
        </div>
        
        <div style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px;">
          <h4 style="color: #333; margin-bottom: 10px;">💬 Mensaje:</h4>
          <p style="color: #666; line-height: 1.6;">{{message}}</p>
        </div>
      </div>
    </div>
    `,
    text: `Nuevo mensaje de contacto

👤 Nombre: {{from_name}}
📧 Email: {{from_email}}
📋 Asunto: {{subject}}

💬 Mensaje:
{{message}}
    `
  },

  admin_notification: {
    id: 'template_admin_notification',
    subject: '🚨 Nueva cotización generada - {{quote_number}}',
    html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff;">
      <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 20px; text-align: center;">
        <h1 style="margin: 0; font-size: 24px;">🚨 Nueva Cotización</h1>
      </div>
      
      <div style="padding: 30px;">
        <div style="background-color: #fffbeb; border-left: 4px solid #f59e0b; padding: 20px;">
          <h3 style="color: #333; margin-bottom: 15px;">Detalles de la cotización:</h3>
          <p><strong>📋 Cotización:</strong> {{quote_number}}</p>
          <p><strong>👤 Cliente:</strong> {{client_name}}</p>
          <p><strong>📧 Email cliente:</strong> {{client_email}}</p>
          <p><strong>💰 Total:</strong> {{quote_total}}</p>
          <p><strong>📅 Fecha:</strong> {{quote_date}}</p>
        </div>
        
        {{#if message}}
        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin-top: 20px;">
          <h4 style="color: #333;">💬 Información adicional:</h4>
          <p style="color: #666;">{{message}}</p>
        </div>
        {{/if}}
      </div>
    </div>
    `,
    text: `🚨 Nueva cotización generada

📋 Cotización: {{quote_number}}
👤 Cliente: {{client_name}}
📧 Email cliente: {{client_email}}
💰 Total: {{quote_total}}
📅 Fecha: {{quote_date}}

{{message}}
    `
  }
};
