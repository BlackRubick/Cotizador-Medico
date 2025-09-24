# 📧 Templates para EmailJS - Formato Profesional

**¡Ya tienes los templates listos!** Solo copia y pega en tu dashboard de EmailJS.

## 🎯 Template 1: Cotizaciones (ID: `template_cotizacion`)

### Asunto del email:
```
Cotización {{quote_number}} - {{company_name}}
```

### Contenido HTML:
```html
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
    <div style="background-color: #f0f9ff; border: 1px solid #bae6fd; border-radius: 8px; padding: 20px; margin: 25px 0;">
      <h4 style="color: #0369a1; font-size: 16px; margin-bottom: 10px;">💬 Mensaje:</h4>
      <p style="color: #0c4a6e; font-size: 15px; line-height: 1.6; margin: 0;">{{message}}</p>
    </div>
    
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
      <p style="margin: 5px 0;">📞 {{company_phone}}</p>
      <p style="margin: 5px 0;">📧 {{company_email}}</p>
      <p style="margin: 5px 0;">🌐 {{company_website}}</p>
    </div>
  </div>
</div>
```

### Contenido de texto (fallback):
```
Cotización {{quote_number}}

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
```

---

## 📞 Template 2: Contacto (ID: `template_contacto`)

### Asunto:
```
📧 Nuevo mensaje de contacto - {{subject}}
```

### Contenido HTML:
```html
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
```

### Contenido de texto:
```
Nuevo mensaje de contacto

👤 Nombre: {{from_name}}
📧 Email: {{from_email}}
📋 Asunto: {{subject}}

💬 Mensaje:
{{message}}
```

---

## 🚨 Template 3: Notificación Admin (ID: `template_admin_notification`)

### Asunto:
```
🚨 Nueva cotización generada - {{quote_number}}
```

### Contenido HTML:
```html
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
    
    <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin-top: 20px;">
      <h4 style="color: #333;">💬 Información adicional:</h4>
      <p style="color: #666;">{{message}}</p>
    </div>
  </div>
</div>
```

### Contenido de texto:
```
🚨 Nueva cotización generada

📋 Cotización: {{quote_number}}
👤 Cliente: {{client_name}}
📧 Email cliente: {{client_email}}
💰 Total: {{quote_total}}
📅 Fecha: {{quote_date}}

{{message}}
```

---

## 🔧 Variables disponibles en los templates:

### Para cotizaciones:
- `{{to_name}}` - Nombre del contacto
- `{{to_email}}` - Email del destinatario
- `{{company_name}}` - Nombre de tu empresa
- `{{company_phone}}` - Teléfono de tu empresa
- `{{company_email}}` - Email de tu empresa
- `{{company_website}}` - Website de tu empresa
- `{{from_name}}` - Nombre del remitente
- `{{quote_number}}` - Número de cotización
- `{{quote_date}}` - Fecha de la cotización
- `{{quote_total}}` - Total de la cotización
- `{{quote_items}}` - Lista detallada de productos
- `{{client_hospital}}` - Nombre del hospital/institución
- `{{message}}` - Mensaje personalizado

### Para contacto:
- `{{from_name}}` - Nombre de quien contacta
- `{{from_email}}` - Email de quien contacta
- `{{subject}}` - Asunto del mensaje
- `{{message}}` - Mensaje del contacto

### Para admin:
- `{{quote_number}}` - Número de cotización
- `{{client_name}}` - Nombre del cliente
- `{{client_email}}` - Email del cliente
- `{{quote_total}}` - Total de la cotización
- `{{quote_date}}` - Fecha de generación
- `{{message}}` - Información adicional

---

## ✅ Cómo usar estos templates:

1. **Copia cada template** desde aquí
2. **Ve a tu dashboard de EmailJS** → Email Templates
3. **Create New Template** para cada uno
4. **Pega el contenido HTML** en el campo HTML
5. **Pega el contenido de texto** en el campo Text (fallback)
6. **Usa el ID sugerido** para cada template
7. **Guarda y prueba** cada template

¡Listo! Tus emails tendrán el mismo formato profesional que usas en WhatsApp. 🎉
