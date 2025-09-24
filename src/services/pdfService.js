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
            min-height: 279mm;
            padding: 15mm;
            background: white;
            overflow: hidden;
            box-sizing: border-box;
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
          
          /* Para imágenes horizontales (más anchas que altas) */
          .template-image.landscape {
            object-fit: cover;
            object-position: center top;
          }
          
          /* Para imágenes verticales (más altas que anchas) */
          .template-image.portrait {
            object-fit: contain;
            object-position: center center;
          }



          .content {
            position: absolute;
            z-index: 2;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            padding: 0;
            margin: 0;
            background: transparent;
          }

          .header {
            position: absolute;
            top: 180px;
            left: 30px;
            right: 30px;
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            padding: 10px;
            background: transparent;
            border-radius: 0;
            box-shadow: none;
          }

          .company-info {
            flex: 1;
          }

          .company-name {
            font-size: 20px;
            font-weight: bold;
            color: #000000;
            margin-bottom: 6px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }

          .company-details {
            font-size: 10px;
            color: #000000;
            line-height: 1.3;
          }

          .quote-info {
            text-align: right;
            background: transparent;
            padding: 20px;
            border-radius: 0;
            border-left: none;
          }

          .quote-title {
            font-size: 18px;
            font-weight: bold;
            color: #000000;
            margin-bottom: 8px;
          }

          .quote-number {
            font-size: 14px;
            color: #000000;
            margin-bottom: 4px;
          }

          .quote-date {
            font-size: 12px;
            color: #000000;
          }

          .section {
            position: absolute;
            left: 30px;
            right: 30px;
            background: transparent;
            padding: 15px;
            border-radius: 0;
            box-shadow: none;
          }
          
          .section.client-section {
            top: 320px;
          }
          
          .section.products-section {
            top: 480px;
            height: auto;
            overflow-y: visible;
          }
          


          .section-title {
            font-size: 14px;
            font-weight: bold;
            color: #000000;
            margin-bottom: 10px;
            padding-bottom: 3px;
            border-bottom: 1px solid #00000030;
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
            margin-bottom: 6px;
            font-size: 12px;
          }

          .client-label {
            font-weight: bold;
            width: 100px;
            color: #000000;
          }

          .client-value {
            color: #000000;
            flex: 1;
          }

          .products-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
            box-shadow: none;
            border-radius: 0;
            overflow: visible;
            background: transparent;
          }

          .products-table th {
            background: linear-gradient(135deg, ${template.colors.primary}, ${template.colors.primary}90);
            color: white;
            padding: 10px 8px;
            text-align: left;
            font-weight: bold;
            font-size: 12px;
          }

          .products-table td {
            padding: 8px;
            border-bottom: 1px solid #e5e7eb;
            font-size: 11px;
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
            width: 300px;
            margin-left: auto;
            margin-top: 20px;
            border-collapse: collapse;
            background: transparent;
            border-radius: 0;
            overflow: visible;
            box-shadow: none;
          }

          .summary-table td {
            padding: 8px 15px;
            border-bottom: 1px solid #e5e7eb;
            color: #000000;
          }

          .summary-table .total-row {
            background: transparent;
            font-weight: bold;
            font-size: 16px;
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
          
          /* Asegurar que el contenido no se desborde */
          .content {
            max-width: 186mm; /* 216mm - 30mm padding total */
            max-height: 249mm; /* 279mm - 30mm padding total */
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

            <!-- Cliente -->
            <div class="section client-section">
              <h2 class="section-title">Información del Cliente</h2>
              <div class="client-row">
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

            <!-- Productos -->
            <div class="section products-section">
              <h2 class="section-title">Productos y Servicios</h2>
              <table class="products-table">
                <thead>
                  <tr>
                    <th style="width: 60px;">#</th>
                    <th style="width: 80px;">Código</th>
                    <th>Descripción</th>
                    <th style="width: 60px;">Cant.</th>
                    <th style="width: 100px;">Precio Unit.</th>
                    <th style="width: 100px;">Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${cartItems.map((item, index) => `
                    <tr>
                      <td class="text-center">${index + 1}</td>
                      <td class="text-center font-bold">${item.code || 'N/A'}</td>
                      <td>
                        <div class="font-bold">${item.name || 'Producto sin nombre'}</div>
                        <div style="font-size: 11px; color: #000000; margin-top: 4px;">${item.description || ''}</div>
                        ${item.brand ? `<div style="font-size: 10px; color: #000000; margin-top: 2px;"><strong>Marca:</strong> ${item.brand}</div>` : ''}
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
      const cartItems = Array.isArray(quoteData.cartItems) ? quoteData.cartItems : [];
      const subtotal = cartItems.reduce((sum, item) => sum + ((item.quantity || 1) * (item.basePrice || 0)), 0);
      const iva = subtotal * 0.16;
      const total = subtotal + iva;
      const currentDate = new Date().toLocaleDateString('es-MX', {
        year: 'numeric', month: 'long', day: 'numeric'
      });
      // Crear PDF tamaño carta
      const pdf = new jsPDF('p', 'mm', 'letter');
      const pageWidth = 216;
      const pageHeight = 279;
      // Dibujar la plantilla de fondo en cada página
      const drawBackground = () => {
        if (templateImg && templateImg.base64) {
          pdf.addImage(templateImg.base64, 'JPEG', 0, 0, pageWidth, pageHeight);
        }
      };
      drawBackground();
      // Header empresa y cotización
      pdf.setFontSize(18);
      pdf.setTextColor(40);
      pdf.text(sellerCompany.fullName, 15, 25);
      pdf.setFontSize(10);
      pdf.text(`Dirección: ${sellerCompany.address}`, 15, 32);
      pdf.text(`Teléfono: ${sellerCompany.phone}`, 15, 37);
      pdf.text(`Email: ${sellerCompany.email}`, 15, 42);
      pdf.text(`RFC: ${sellerCompany.rfc}`, 15, 47);
      pdf.setFontSize(16);
      pdf.text('COTIZACIÓN', pageWidth - 60, 25);
      pdf.setFontSize(12);
      pdf.text(`Folio: ${quoteData.folio}`, pageWidth - 60, 32);
      pdf.text(currentDate, pageWidth - 60, 37);
      // Cliente
      pdf.setFontSize(12);
      pdf.text('Información del Cliente', 15, 60);
      pdf.setFontSize(10);
      let y = 66;
      pdf.text(`Cliente: ${quoteData.clientName}`, 15, y); y += 6;
      pdf.text(`Contacto: ${quoteData.clientContact || 'N/A'}`, 15, y); y += 6;
      pdf.text(`Email: ${quoteData.email}`, 15, y); y += 6;
      pdf.text(`Teléfono: ${quoteData.phone || 'N/A'}`, 15, y); y += 6;
      if (quoteData.clientAddress) { pdf.text(`Dirección: ${quoteData.clientAddress}`, 15, y); y += 6; }
      if (quoteData.clientPosition) { pdf.text(`Puesto: ${quoteData.clientPosition}`, 15, y); y += 6; }
      // Tabla de productos con paginación
      const tableStartY = y + 8;
      autoTable(pdf, {
        startY: tableStartY,
        head: [[
          '#', 'Código', 'Descripción', 'Cant.', 'Precio Unit.', 'Total'
        ]],
        body: cartItems.map((item, idx) => [
          idx + 1,
          item.code || 'N/A',
          `${item.name || ''}\n${item.description || ''}${item.brand ? `\nMarca: ${item.brand}` : ''}`,
          item.quantity || 1,
          `$${(item.basePrice || 0).toLocaleString('es-MX')}`,
          `$${((item.quantity || 1) * (item.basePrice || 0)).toLocaleString('es-MX')}`
        ]),
        styles: { fontSize: 9, cellPadding: 2 },
        headStyles: { fillColor: [30, 64, 175], textColor: 255 },
        columnStyles: {
          0: { cellWidth: 10, halign: 'center' },
          1: { cellWidth: 22, halign: 'center' },
          2: { cellWidth: 70 },
          3: { cellWidth: 15, halign: 'center' },
          4: { cellWidth: 25, halign: 'right' },
          5: { cellWidth: 25, halign: 'right' }
        },
        margin: { left: 15, right: 15 },
        didDrawPage: drawBackground,
        // Footer solo en la última página
        didDrawCell: function (data) {
          if (data.row.index === cartItems.length - 1 && data.column.index === 5) {
            // Guardar la posición Y final de la tabla
            pdf.lastTableFinalY = data.cell.y + data.cell.height;
          }
        }
      });
      // Resumen SIEMPRE en la última página, bien alineado
      pdf.setPage(pdf.getNumberOfPages());
      let summaryY = pdf.lastTableFinalY ? pdf.lastTableFinalY + 12 : pdf.lastAutoTable.finalY + 12;
      pdf.setFontSize(12);
      pdf.text('Resumen', pageWidth - 80, summaryY);
      pdf.setFontSize(10);
      summaryY += 6;
      pdf.text(`Subtotal: $${subtotal.toLocaleString('es-MX')}`, pageWidth - 80, summaryY);
      summaryY += 6;
      pdf.text(`IVA (16%): $${iva.toLocaleString('es-MX')}`, pageWidth - 80, summaryY);
      summaryY += 6;
      pdf.setFontSize(12);
      pdf.text(`TOTAL: $${total.toLocaleString('es-MX')} MXN`, pageWidth - 80, summaryY);

      // Agregar Observaciones, Condiciones, Términos si existen
      let extraY = summaryY + 14;
      pdf.setFontSize(11);
      pdf.setTextColor(40);
      if (quoteData.observaciones) {
        pdf.text('Observaciones:', 15, extraY);
        pdf.setFontSize(10);
        extraY += 6;
        const splitObs = pdf.splitTextToSize(quoteData.observaciones, pageWidth - 30);
        pdf.text(splitObs, 15, extraY);
        extraY += splitObs.length * 5 + 4;
        pdf.setFontSize(11);
      }
      if (quoteData.condiciones) {
        pdf.text('Condiciones:', 15, extraY);
        pdf.setFontSize(10);
        extraY += 6;
        const splitCond = pdf.splitTextToSize(quoteData.condiciones, pageWidth - 30);
        pdf.text(splitCond, 15, extraY);
        extraY += splitCond.length * 5 + 4;
        pdf.setFontSize(11);
      }
      if (quoteData.terminos) {
        pdf.text('Términos:', 15, extraY);
        pdf.setFontSize(10);
        extraY += 6;
        const splitTerm = pdf.splitTextToSize(quoteData.terminos, pageWidth - 30);
        pdf.text(splitTerm, 15, extraY);
        extraY += splitTerm.length * 5 + 4;
        pdf.setFontSize(11);
      }
      pdf.setTextColor(120);
      // Footer solo en la última página (puedes personalizarlo aquí)
      const footerY = pageHeight - 15;
      pdf.setFontSize(9);
      pdf.text(sellerCompany.email || 'contacto@empresa.com', 15, footerY);
      pdf.text(sellerCompany.name, pageWidth / 2, footerY, { align: 'center' });
      pdf.text('ICD 2025', pageWidth - 15, footerY, { align: 'right' });
      // Guardar PDF
      const fileName = `Cotizacion_${quoteData.folio}_${sellerCompany.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);
      return { success: true, fileName };
    } catch (error) {
      console.error('❌ Error generando PDF:', error);
      return { success: false, error: error.message };
    }
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
      }, 5000);
    });
  }
}

export default new PDFService();