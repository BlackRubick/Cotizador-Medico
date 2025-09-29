// src/services/pdfService.js
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import autoTable from 'jspdf-autotable';

class PDFService {
  constructor() {
    // Mapeo de empresas a sus plantillas
    this.companyTemplates = {
      'conduit-life': {
        image: '/plantillas/CONDUIT-LIFE.jpeg',
        fallbackImages: ['/plantillas/CONDUIT-LIFE.JPEG', '/plantillas/CONDUIT-LIFE.jpg', '/plantillas/CONDUIT-LIFE.JPG', '/plantillas/CONDUIT-LIFE.png'],
        name: 'CONDUIT LIFE',
        colors: {
          primary: '#1e40af', // Azul corporativo
          secondary: '#64748b',
          accent: '#059669'
        }
      },
      'escala-biomedica': {
        image: '/plantillas/ESCALA-BIOMEDICA.jpeg',
        fallbackImages: ['/plantillas/ESCALA-BIOMEDICA.JPEG', '/plantillas/ESCALA-BIOMEDICA.jpg', '/plantillas/ESCALA-BIOMEDICA.JPG', '/plantillas/ESCALA-BIOMEDICA.png'],
        name: 'ESCALA BIOMEDICA',
        colors: {
          primary: '#dc2626', // Rojo corporativo
          secondary: '#64748b',
          accent: '#059669'
        }
      },
      'ingenieria-clinica': {
        image: '/plantillas/INGENIERIA-CLINICA-DISEÑO.jpeg',
        fallbackImages: ['/plantillas/INGENIERIA-CLINICA-DISEÑO.JPEG', '/plantillas/INGENIERIA-CLINICA-DISEÑO.jpg', '/plantillas/INGENIERIA-CLINICA-DISEÑO.JPG', '/plantillas/INGENIERIA-CLINICA-DISEÑO.png'],
        name: 'INGENIERIA CLINICA Y DISEÑO',
        colors: {
          primary: '#7c3aed', // Morado corporativo
          secondary: '#64748b',
          accent: '#059669'
        }
      },
      'biosystems-hls': {
        image: '/plantillas/Biosystems-HLS.jpeg',
        fallbackImages: ['/plantillas/Biosystems-HLS.JPEG', '/plantillas/Biosystems-HLS.jpg', '/plantillas/Biosystems-HLS.JPG', '/plantillas/Biosystems-HLS.png'],
        name: 'Biosystems HLS',
        colors: {
          primary: '#059669', // Verde corporativo
          secondary: '#64748b',
          accent: '#dc2626'
        }
      }
    };
  }

  // Función para crear el HTML de la cotización
  createQuoteHTML(quoteData, sellerCompany, templateImageData = null) {
    const template = this.companyTemplates[sellerCompany.id];
    if (!template) {
      throw new Error('Plantilla no encontrada para la empresa seleccionada');
    }

    const currentDate = new Date().toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const cartItems = Array.isArray(quoteData.cartItems) ? quoteData.cartItems : [];
    const subtotal = cartItems.reduce((sum, item) => 
      sum + ((item.quantity || 1) * (item.basePrice || 0)), 0
    );
    const iva = subtotal * 0.16;
    const total = subtotal + iva;

    // --- Ajuste dinámico para que siempre quepa en una hoja ---
    // Compactar header y cliente para más espacio a la tabla
    const PAGE_HEIGHT_MM = 279;
    const PAGE_HEIGHT_PX = Math.floor(PAGE_HEIGHT_MM * 3.78); // ≈ 1055px
    const HEADER_PX = 100; // antes 180, ahora más compacto
    const CLIENT_PX = 70;  // antes 120, ahora más compacto
    const PADDING_PX = 10 + 10; // padding top y bottom
    const FOOTER_PX = 50; // margen inferior y resumen
    const AVAILABLE_PX = PAGE_HEIGHT_PX - HEADER_PX - CLIENT_PX - PADDING_PX - FOOTER_PX;
    let minFont = 7;
    let maxFont = 12;
    let fontSize = maxFont;
    let rowPadding = 8;
    let rowHeight = fontSize + rowPadding * 2;
    if (cartItems.length > 0) {
      for (let f = maxFont; f >= minFont; f--) {
        let pad = Math.max(2, Math.floor(f / 2));
        let h = f + pad * 2;
        if ((cartItems.length + 1) * h < AVAILABLE_PX) {
          fontSize = f;
          rowPadding = pad;
          rowHeight = h;
          break;
        }
        if (f === minFont) {
          fontSize = minFont;
          rowPadding = pad;
          rowHeight = h;
        }
      }
    }
    let summaryFontSize = fontSize + 2;

    return `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Cotización ${quoteData.folio}</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: 'Arial', sans-serif;
            line-height: 1.4;
            color: #1f2937;
            background: white;
          }
          .quote-container {
            position: relative;
            width: 216mm;
            height: 279mm;
            max-width: 216mm;
            max-height: 279mm;
            padding: 10mm 10mm 10mm 10mm;
            background: white;
            overflow: hidden;
            box-sizing: border-box;
            border-radius: 6px;
            box-shadow: 0 0 8px #0002;
          }
          .template-image {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 1;
            opacity: 0.8;
            pointer-events: none;
            object-position: center center;
          }
          .template-image.landscape {
            object-fit: cover;
            object-position: center top;
          }
          .template-image.portrait {
            object-fit: contain;
            object-position: center center;
          }
          .content {
            position: relative;
            z-index: 2;
            width: 100%;
            height: 100%;
            padding: 0;
            margin: 0;
            background: transparent;
            overflow: hidden;
            max-height: 259mm;
          }
          .header {
            position: relative;
            left: 0;
            right: 0;
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            padding: 4px;
            background: transparent;
            border-radius: 0;
            box-shadow: none;
            margin-bottom: 16px;
          }
          .company-info {
            flex: 1;
          }
          .company-name {
            font-size: 16px; /* antes 20px */
            font-weight: bold;
            color: #000000;
            margin-bottom: 2px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .company-details {
            font-size: 9px; /* antes 10px */
            color: #000000;
            line-height: 1.2;
          }
          .quote-info {
            text-align: right;
            background: transparent;
            padding: 8px; /* antes 20px */
            border-radius: 0;
            border-left: none;
          }
          .quote-title {
            font-size: 14px; /* antes 18px */
            font-weight: bold;
            color: #000000;
            margin-bottom: 4px;
          }
          .quote-number {
            font-size: 11px; /* antes 14px */
            color: #000000;
            margin-bottom: 2px;
          }
          .quote-date {
            font-size: 10px; /* antes 12px */
            color: #000000;
          }
          .section {
            position: relative;
            left: 0;
            right: 0;
            background: transparent;
            padding: 2px; /* antes 7px */
            border-radius: 0;
            box-shadow: none;
            margin-bottom: 8px; /* antes 24px */
          }
          .section.client-section {
            margin-bottom: 10px; /* antes 32px */
          }
          .section.products-section {
            height: auto;
            overflow: visible;
            max-height: none;
            margin-top: 0;
          }
          .section-title {
            font-size: 12px;
            font-weight: bold;
            color: #000000;
            margin-bottom: 10px; /* antes 40px */
            padding-bottom: 4px; /* antes 8px */
            border-bottom: 1px solid #00000030;
          }
          .section-title.client-space {
            margin-bottom: 12px; /* antes 48px */
            padding-bottom: 4px; /* antes 8px */
            border-bottom: 2px solid #e5e7eb;
          }
          .section-title.products-space {
            margin-top: 4px; /* antes 16px */
            margin-bottom: 12px; /* antes 48px */
            padding-bottom: 4px; /* antes 8px */
            border-bottom: 2px solid #e5e7eb;
          }
          .client-info {
            background: transparent;
            padding: 0;
            border-radius: 0;
            border-left: none;
            box-shadow: none;
          }
          .client-row {
            display: flex;
            margin-bottom: 3px;
            font-size: 10px; /* antes 12px */
          }
          .client-row.first-row {
            margin-top: 8px; /* separación extra después del título */
          }
          .client-label {
            font-weight: bold;
            width: 80px; /* antes 100px */
            color: #000000;
          }
          .client-value {
            color: #000000;
            flex: 1;
          }
          .products-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 4px; /* antes 16px */
            box-shadow: none;
            border-radius: 0;
            overflow: visible;
            background: transparent;
            font-size: ${fontSize}px;
          }
          .products-table th {
            background: linear-gradient(135deg, ${template.colors.primary}, ${template.colors.primary}90);
            color: white;
            padding: ${Math.max(2, rowPadding)}px 2px; /* más compacto */
            text-align: left;
            font-weight: bold;
            font-size: ${fontSize}px;
          }
          .products-table td {
            padding: ${Math.max(2, rowPadding - 2)}px 2px; /* más compacto */
            border-bottom: 1px solid #e5e7eb;
            font-size: ${fontSize}px;
            color: #000000;
          }
          .products-table tbody tr:nth-child(even) {
            background-color: transparent;
          }
          .products-table tbody tr:hover {
            background-color: transparent;
          }
          .text-right {
            text-align: right;
          }
          .text-center {
            text-align: center;
          }
          .font-bold {
            font-weight: bold;
          }
          .summary-table {
            width: 160px; /* antes 220px */
            margin-left: auto;
            margin-top: 4px; /* antes 10px */
            border-collapse: collapse;
            background: transparent;
            border-radius: 0;
            overflow: visible;
            box-shadow: none;
          }
          .summary-table td {
            padding: 4px 6px; /* más compacto */
            border-bottom: 1px solid #e5e7eb;
            color: #000000;
            font-size: ${fontSize}px;
          }
          .summary-table .total-row {
            background: transparent;
            font-weight: bold;
            font-size: ${summaryFontSize}px;
            color: #000000;
          }
          .price {
            font-weight: bold;
            color: #000000;
          }
          @media print {
            .quote-container {
              box-shadow: none;
              margin: 0;
              width: 216mm !important;
              height: 279mm !important;
            }
            body {
              margin: 0 !important;
              padding: 0 !important;
            }
          }
          .content {
            max-width: 186mm;
            max-height: 249mm;
          }
        </style>
      </head>
      <body>
        <div class="quote-container">
          ${templateImageData && templateImageData.base64 ? 
            `<img src="${templateImageData.base64}" alt="Plantilla ${template.name}" class="template-image ${templateImageData.orientation || 'portrait'}" />` :
            `<img src="${window.location.origin}${template.image}" alt="Plantilla ${template.name}" class="template-image portrait" crossorigin="anonymous" />`
          }
          <div class="content">
            <!-- Header -->
            <div class="header">
              <div class="company-info">
                <div class="company-name">${sellerCompany.fullName}</div>
                <div class="company-details">
                  <div><strong>Dirección:</strong> ${sellerCompany.address}</div>
                  <div><strong>Teléfono:</strong> ${sellerCompany.phone}</div>
                  <div><strong>Email:</strong> ${sellerCompany.email}</div>
                  <div><strong>RFC:</strong> ${sellerCompany.rfc}</div>
                </div>
              </div>
              <div class="quote-info">
                <div class="quote-title">COTIZACIÓN</div>
                <div class="quote-number">Folio: <strong>${quoteData.folio}</strong></div>
                <div class="quote-date">${currentDate}</div>
              </div>
            </div>
            <br />
            <!-- Cliente -->
            <div class="section client-section">
              <h2 class="section-title client-space">Información del Cliente</h2>
              <div class="client-row first-row">
                <span class="client-label">Cliente:</span>
                <span class="client-value">${quoteData.clientName}</span>
              </div>
                <div class="client-row">
                  <span class="client-label">Contacto:</span>
                  <span class="client-value">${quoteData.clientContact || 'N/A'}</span>
                </div>
                <div class="client-row">
                  <span class="client-label">Email:</span>
                  <span class="client-value">${quoteData.email}</span>
                </div>
                <div class="client-row">
                  <span class="client-label">Teléfono:</span>
                  <span class="client-value">${quoteData.phone || 'N/A'}</span>
                </div>
                ${quoteData.clientAddress ? `
                <div class="client-row">
                  <span class="client-label">Dirección:</span>
                  <span class="client-value">${quoteData.clientAddress}</span>
                </div>
                ` : ''}
                ${quoteData.clientPosition ? `
                <div class="client-row">
                  <span class="client-label">Puesto:</span>
                  <span class="client-value">${quoteData.clientPosition}</span>
                </div>
                ` : ''}
            </div>
            <br />
            <!-- Productos -->
            <div class="section products-section">
              <h2 class="section-title products-space">Productos y Servicios</h2>
              <table class="products-table">
                <thead>
                  <tr>
                    <th style="width: 50px;">#</th>
                    <th style="width: 70px;">Código</th>
                    <th>Descripción</th>
                    <th style="width: 50px;">Cant.</th>
                    <th style="width: 80px;">Precio Unit.</th>
                    <th style="width: 80px;">Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${cartItems.map((item, index) => `
                    <tr>
                      <td class="text-center">${index + 1}</td>
                      <td class="text-center font-bold">${item.code || 'N/A'}</td>
                      <td>
                        <div class="font-bold">${item.name || 'Producto sin nombre'}</div>
                        <div style="font-size: ${fontSize - 1}px; color: #000000; margin-top: 2px;">${item.description || ''}</div>
                        ${item.brand ? `<div style="font-size: ${fontSize - 2}px; color: #000000; margin-top: 1px;"><strong>Marca:</strong> ${item.brand}</div>` : ''}
                      </td>
                      <td class="text-center">${item.quantity || 1}</td>
                      <td class="text-right price">$${(item.basePrice || 0).toLocaleString('es-MX')}</td>
                      <td class="text-right price font-bold">$${((item.quantity || 1) * (item.basePrice || 0)).toLocaleString('es-MX')}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
              <!-- Resumen -->
              <table class="summary-table">
                <tr>
                  <td><strong>Subtotal:</strong></td>
                  <td class="text-right price">$${subtotal.toLocaleString('es-MX')}</td>
                </tr>
                <tr>
                  <td><strong>IVA (16%):</strong></td>
                  <td class="text-right price">$${iva.toLocaleString('es-MX')}</td>
                </tr>
                <tr class="total-row">
                  <td><strong>TOTAL:</strong></td>
                  <td class="text-right"><strong>$${total.toLocaleString('es-MX')} MXN</strong></td>
                </tr>
              </table>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  // Función principal para generar y descargar PDF
  async generateAndDownloadQuotePDF(quoteData, sellerCompany) {
    try {
      // Precargar la imagen de la plantilla
      const templateImg = await this.preloadTemplateImage(sellerCompany.id);
      // Crear el HTML idéntico a la vista previa
      const htmlContent = this.createQuoteHTML(quoteData, sellerCompany, templateImg);
      // Crear un contenedor oculto en el DOM
      let container = document.createElement('div');
      container.style.position = 'fixed';
      container.style.left = '-9999px';
      container.style.top = '0';
      container.style.width = '216mm';
      container.style.minHeight = '279mm';
      container.innerHTML = htmlContent;
      document.body.appendChild(container);
      // Esperar a que carguen las imágenes
      await this.waitForImages(container);
      // Seleccionar el nodo principal
      const quoteNode = container.querySelector('.quote-container');
      // Renderizar a imagen
      const canvas = await html2canvas(quoteNode, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      // Crear PDF y agregar la imagen
      const pdf = new jsPDF('p', 'mm', 'letter');
      const pageWidth = 216;
      const pageHeight = 279;
      // Calcular tamaño de la imagen en mm
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pageWidth;
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      // Descargar PDF
      const fileName = `Cotizacion_${quoteData.folio}_${sellerCompany.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);
      // Limpiar el DOM
      document.body.removeChild(container);
      return { success: true, fileName };
    } catch (error) {
      console.error('❌ Error generando PDF:', error);
      return { success: false, error: error.message };
    }
  }

  // Generar PDF profesional y retornar como blob
  async generateQuotePDFBlob(quoteData, sellerCompany) {
    // Precargar la imagen de la plantilla
    const templateImg = await this.preloadTemplateImage(sellerCompany.id);
    // Crear el HTML idéntico a la vista previa
    const htmlContent = this.createQuoteHTML(quoteData, sellerCompany, templateImg);
    // Crear un contenedor oculto en el DOM
    let container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.left = '-9999px';
    container.style.top = '0';
    container.style.width = '216mm';
    container.style.minHeight = '279mm';
    container.innerHTML = htmlContent;
    document.body.appendChild(container);
    // Esperar a que carguen las imágenes
    await this.waitForImages(container);
    // Seleccionar el nodo principal
    const quoteNode = container.querySelector('.quote-container');
    // Renderizar a imagen usando el import correcto
    const canvas = await html2canvas(quoteNode, { scale: 2, useCORS: true });
    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    // Crear PDF y agregar la imagen usando el import correcto
    const pdf = new jsPDF('p', 'mm', 'letter');
    const pageWidth = 216;
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pageWidth;
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
    // Limpiar el DOM
    document.body.removeChild(container);
    // Retornar el blob
    return pdf.output('blob');
  }

  // Función para precargar imagen de plantilla con fallbacks y convertir a base64
  async preloadTemplateImage(templateId) {
    const template = this.companyTemplates[templateId];
    if (!template) {
      throw new Error('Plantilla no encontrada');
    }

    const tryLoadImage = (imagePath) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        
        img.onload = () => {
          console.log(`✅ Plantilla cargada: ${imagePath} (${img.naturalWidth}x${img.naturalHeight})`);
          
          // Detectar orientación con más precisión
          const aspectRatio = img.naturalWidth / img.naturalHeight;
          let orientation;
          
          if (aspectRatio > 1.2) {
            orientation = 'landscape'; // Claramente horizontal
          } else if (aspectRatio < 0.8) {
            orientation = 'portrait';  // Claramente vertical
          } else {
            orientation = 'portrait';  // Cuadrada o casi cuadrada, tratar como portrait
          }
          
          console.log(`📐 Orientación detectada: ${orientation} (ratio: ${aspectRatio.toFixed(2)})`);
          
          // Convertir a base64
          try {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            ctx.drawImage(img, 0, 0);
            const base64 = canvas.toDataURL('image/jpeg', 0.8);
            console.log(`🔄 Imagen convertida a base64 (${base64.length} chars)`);
            resolve({ 
              success: true, 
              img, 
              path: imagePath, 
              base64,
              orientation,
              width: img.naturalWidth,
              height: img.naturalHeight
            });
          } catch (error) {
            console.warn(`❌ Error convirtiendo a base64: ${error.message}`);
            resolve({ 
              success: true, 
              img, 
              path: imagePath, 
              base64: null,
              orientation,
              width: img.naturalWidth,
              height: img.naturalHeight
            });
          }
        };
        
        img.onerror = () => {
          console.warn(`❌ Error cargando: ${imagePath}`);
          resolve({ success: false, path: imagePath });
        };
        
        img.src = `${window.location.origin}${imagePath}`;
        
        // Timeout por imagen
        setTimeout(() => {
          console.warn(`⏰ Timeout cargando: ${imagePath}`);
          resolve({ success: false, path: imagePath });
        }, 3000);
      });
    };

    // Intentar cargar imagen principal
    console.log(`🖼️ Intentando cargar plantilla principal para ${templateId}`);
    let result = await tryLoadImage(template.image);
    
    if (result.success) {
      return result;
    }

    // Intentar fallbacks
    if (template.fallbackImages) {
      console.log(`🔄 Probando imágenes alternativas para ${templateId}`);
      for (const fallbackPath of template.fallbackImages) {
        result = await tryLoadImage(fallbackPath);
        if (result.success) {
          return result;
        }
      }
    }

    console.warn(`⚠️ No se pudo cargar ninguna plantilla para ${templateId}`);
    return null;
  }

  // Función para previsualizar PDF
  async previewQuotePDF(quoteData, sellerCompany) {
    try {
      console.log('👁️ Iniciando vista previa del PDF con plantilla:', sellerCompany.id);
      // Precargar la imagen de la plantilla ANTES de crear el HTML
      console.log('🖼️ Precargando plantilla antes de crear vista previa...');
      const templateImg = await this.preloadTemplateImage(sellerCompany.id);
      if (templateImg) {
        console.log('✅ Plantilla precargada exitosamente');
      } else {
        console.warn('⚠️ No se pudo precargar la plantilla, continuando sin imagen de fondo');
      }
      const htmlContent = this.createQuoteHTML(quoteData, sellerCompany, templateImg);
      // Crear nueva ventana con mejor configuración
      const previewWindow = window.open('', '_blank', 
        'width=900,height=700,scrollbars=yes,resizable=yes,toolbar=no,menubar=no,location=no,status=no'
      );
      if (previewWindow) {
        // Escribir el contenido
        previewWindow.document.write(htmlContent);
        previewWindow.document.close();
        // Esperar a que se cargue completamente la ventana
        previewWindow.addEventListener('load', () => {
          console.log('📄 Vista previa cargada completamente');
          // Verificar si las imágenes se cargaron en la nueva ventana
          const images = previewWindow.document.querySelectorAll('img');
          console.log(`🖼️ Imágenes en vista previa: ${images.length}`);
          images.forEach((img, index) => {
            if (img.complete && img.naturalWidth > 0) {
              console.log(`✅ Imagen ${index + 1} ya cargada en vista previa`);
            } else {
              console.log(`⏳ Esperando carga de imagen ${index + 1} en vista previa`);
              img.onload = () => {
                console.log(`✅ Imagen ${index + 1} cargada en vista previa`);
              };
              img.onerror = () => {
                console.warn(`❌ Error cargando imagen ${index + 1} en vista previa`);
              };
            }
          });
        });
        previewWindow.focus();
      } else {
        throw new Error('No se pudo abrir la ventana de vista previa. Verifique que no esté bloqueada por el navegador.');
      }
      return { success: true };
    } catch (error) {
      console.error('❌ Error en vista previa:', error);
      return { success: false, error: error.message };
    }
  }

  // Función auxiliar para esperar a que se carguen las imágenes
  waitForImages(container) {
    return new Promise((resolve) => {
      const images = container.querySelectorAll('img');
      let loadedCount = 0;
      const totalImages = images.length;

      console.log(`🖼️ Esperando ${totalImages} imágenes...`);

      if (totalImages === 0) {
        console.log('✅ No hay imágenes que cargar');
        resolve();
        return;
      }

      const checkImageLoad = (img, index) => {
        if (img.complete && img.naturalWidth > 0) {
          console.log(`✅ Imagen ${index + 1}/${totalImages} cargada: ${img.src}`);
          loadedCount++;
          if (loadedCount === totalImages) {
            console.log('🎉 Todas las imágenes cargadas');
            resolve();
          }
        } else {
          console.log(`⏳ Cargando imagen ${index + 1}: ${img.src}`);
          img.onload = () => {
            console.log(`✅ Imagen ${index + 1}/${totalImages} cargada: ${img.src}`);
            loadedCount++;
            if (loadedCount === totalImages) {
              console.log('🎉 Todas las imágenes cargadas');
              resolve();
            }
          };
          img.onerror = () => {
            console.warn(`⚠️ Error cargando imagen ${index + 1}: ${img.src}`);
            loadedCount++;
            if (loadedCount === totalImages) {
              console.log('🎉 Todas las imágenes procesadas (algunas con error)');
              resolve();
            }
          };
        }
      };

      images.forEach((img, index) => {
        checkImageLoad(img, index);
      });

      // Timeout de seguridad más largo
      setTimeout(() => {
        console.warn('⏰ Timeout de carga de imágenes alcanzado');
        resolve();
      }, 30000); // 30 segundos
    });
  }
}

export default new PDFService();