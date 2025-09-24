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
