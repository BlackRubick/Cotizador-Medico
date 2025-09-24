# 📧 Configuración de EmailJS para Cotizador Médico

EmailJS ya está integrado en tu aplicación! Solo necesitas configurar los servicios externos.

## 🚀 Estado Actual

✅ **Instalado**: `@emailjs/browser`  
✅ **Servicios creados**: `emailService.js`, `useEmail.js`  
✅ **Componentes listos**: `EmailButton`, `EmailQuoteModal`  
✅ **Integrado en**: Generador de cotizaciones  
✅ **Guía interactiva**: Disponible en Perfil → EmailJS  

## 🎯 Funcionalidades

### 1. **Enviar Cotizaciones por Email**
- Botón "Enviar por Email" en el generador de cotizaciones
- Modal con formulario pre-llenado
- Template profesional con datos de la cotización
- Solo aparece si el cliente tiene email

### 2. **Guía de Configuración Interactiva**
- Acceso desde: Perfil → Botón "EmailJS"
- 5 pasos con instrucciones detalladas
- Templates listos para copiar
- Validación automática de configuración

### 3. **Templates Incluidos**
- **Cotizaciones**: Email profesional con datos del presupuesto
- **Contacto**: Formularios de contacto web
- **Admin**: Notificaciones para administradores

## ⚡ Configuración Rápida (15 minutos)

### Paso 1: Crear cuenta EmailJS
1. Ve a [emailjs.com](https://www.emailjs.com/)
2. Regístrate (gratis: 200 emails/mes)
3. Verifica tu email

### Paso 2: Configurar servicio
1. En tu dashboard → "Email Services"
2. "Add New Service" → Selecciona Gmail/Outlook
3. Autoriza tu cuenta de email
4. **Copia el Service ID**

### Paso 3: Crear templates
En "Email Templates", crear 3 templates con este contenido:

#### Template 1: `template_cotizacion`
```
Asunto: Cotización {{quote_number}} - {{company_name}}

Hola {{to_name}},

Te enviamos la cotización solicitada:

📋 Número: {{quote_number}}
📅 Fecha: {{quote_date}}  
💰 Total: {{quote_total}}

🏥 {{company_name}}
{{message}}

Productos cotizados:
{{quote_items}}

¡Quedamos a tu disposición!

Saludos,
{{from_name}}
```

#### Template 2: `template_contacto`
```
Asunto: Nuevo mensaje de contacto - {{subject}}

Nuevo mensaje de contacto:

👤 Nombre: {{from_name}}
📧 Email: {{from_email}}
📋 Asunto: {{subject}}

💬 Mensaje:
{{message}}
```

#### Template 3: `template_admin_notification`
```
Asunto: 🚨 Nueva cotización generada

Nueva cotización generada:

📋 Cotización: {{quote_number}}
👤 Cliente: {{client_name}}
📧 Email: {{client_email}}
💰 Total: {{quote_total}}
📅 Fecha: {{quote_date}}

💬 {{message}}
```

### Paso 4: Actualizar configuración
Edita el archivo `src/config/emailConfig.js`:

```javascript
export const EMAIL_CONFIG = {
  SERVICE_ID: 'tu_service_id_aqui', // 👈 CAMBIAR
  TEMPLATE_ID_QUOTE: 'template_cotizacion', 
  TEMPLATE_ID_CONTACT: 'template_contacto',
  TEMPLATE_ID_ADMIN: 'template_admin_notification',
  
  PUBLIC_KEY: 'Kijg9SZDUugSSWYYn', // ✅ Ya configurado
  
  COMPANY: {
    name: 'Tu Empresa Médica', // 👈 CAMBIAR
    email: 'contacto@tuempresa.com', // 👈 CAMBIAR
    phone: '+52 961 123 4567', // 👈 CAMBIAR
    website: 'www.tuempresa.com', // 👈 CAMBIAR
    address: 'Tu dirección', // 👈 CAMBIAR
  },
  
  ADMIN_EMAILS: [
    'admin@tuempresa.com', // 👈 CAMBIAR
    'ventas@tuempresa.com' // 👈 CAMBIAR
  ]
};
```

### Paso 5: ¡Probar!
1. Crear una cotización
2. Agregar cliente con email
3. Usar botón "Enviar por Email"
4. Verificar recepción del email

## 🎨 Personalización

### Cambiar estilos del botón
```jsx
<EmailButton
  variant="primary"    // primary, secondary, success, outline
  size="lg"           // sm, md, lg
  className="mi-clase-personalizada"
>
  Mi texto personalizado
</EmailButton>
```

### Agregar en otras páginas
```jsx
import EmailButton from '../atoms/EmailButton';

<EmailButton
  quoteData={miCotizacion}
  clientData={miCliente}
>
  Enviar Presupuesto
</EmailButton>
```

### Hook personalizado
```jsx
import { useEmail } from '../hooks/useEmail';

const MiComponente = () => {
  const { sendQuoteEmail, isLoading, error, success } = useEmail();
  
  const enviarEmail = async () => {
    const resultado = await sendQuoteEmail({
      to_email: 'cliente@email.com',
      to_name: 'Cliente',
      subject: 'Mi cotización',
      quote: datosCotizacion
    });
  };
};
```

## 🔧 Solución de Problemas

### ❌ Error: "Invalid service ID"
- Verificar que SERVICE_ID sea correcto
- Revisar que el servicio esté activo en EmailJS

### ❌ Error: "Template not found"
- Verificar nombres de templates
- Asegurar que estén publicados (no borrador)

### ❌ No llegan emails
- Revisar spam/promociones
- Verificar límites de EmailJS (200/mes gratis)
- Comprobar configuración del servicio de email

### ❌ Error: "User ID required"
- Verificar PUBLIC_KEY en la configuración
- Regenerar claves si es necesario

## 📊 Límites EmailJS Gratuito

- ✅ 200 emails/mes
- ✅ Todas las funciones
- ✅ Sin marca de agua
- ✅ Soporte básico

## 🆘 Ayuda Adicional

### Guía interactiva en la app
- Ve a **Perfil** → Botón **"EmailJS"**
- Sigue los 5 pasos interactivos
- Copia templates listos para usar
- Validación automática de configuración

### Soporte
- [Documentación EmailJS](https://www.emailjs.com/docs/)
- [Ejemplos de templates](https://www.emailjs.com/docs/examples/)
- Dashboard EmailJS para monitorear envíos

---

## ✨ ¡Listo!

Con esta configuración podrás:
- ✅ Enviar cotizaciones profesionales por email
- ✅ Personalizar templates y estilos  
- ✅ Recibir notificaciones de nuevas cotizaciones
- ✅ Integrar formularios de contacto
- ✅ Monitorear el estado de envíos

**¡Tu cotizador médico ahora tiene comunicación por email profesional!** 🎉
