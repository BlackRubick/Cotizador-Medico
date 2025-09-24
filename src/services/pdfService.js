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

    // Cálculo dinámico del tamaño de fuente y espaciado
    const itemsCount = cartItems.length;
    let fontSize = 12;
    let rowPadding = 8;
    let headerHeight = 120;
    let clientHeight = 100;
    let sectionSpacing = 20;

    // Ajustar tamaños según la cantidad de items
    if (itemsCount > 15) {
      fontSize = 8;
      rowPadding = 4;
      headerHeight = 100;
      clientHeight = 80;
      sectionSpacing = 15;
    } else if (itemsCount > 10) {
      fontSize = 9;
      rowPadding = 5;
      headerHeight = 110;
      clientHeight = 90;
      sectionSpacing = 18;
    } else if (itemsCount > 5) {
      fontSize = 10;
      rowPadding = 6;
      headerHeight = 115;
      clientHeight = 95;
      sectionSpacing = 19;
    }

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
            line-height: 1.3;
            color: #1f2937;
            background: white;
            font-size: ${fontSize}px;
          }
          
          .quote-container {
            position: relative;
            width: 216mm;
            min-height: 279mm;
            max-width: 216mm;
            padding: 15mm;
            background: white;
            box-sizing: border-box;
            border-radius: 6px;
            box-shadow: 0 0 8px rgba(0,0,0,0.1);
          }
          
          .template-image {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 1;
            opacity: 0.6;
            pointer-events: none;
            object-fit: cover;
            object-position: center top;
          }
          
          .content {
            position: relative;
            z-index: 2;
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            gap: ${sectionSpacing}px;
          }
          
          .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            min-height: ${headerHeight}px;
            margin-top: 140px; /* Espacio para el logo de la plantilla */
            padding: 15px;
            background: rgba(255, 255, 255, 0.9);
            border-radius: 8px;
            backdrop-filter: blur(5px);
          }
          
          .company-info {
            flex: 1;
            padding-right: 20px;
          }
          
          .company-name {
            font-size: ${fontSize + 6}px;
            font-weight: bold;
            color: #000000;
            margin-bottom: 8px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          
          .company-details {
            font-size: ${fontSize - 1}px;
            color: #374151;
            line-height: 1.4;
          }
          
          .company-details div {
            margin-bottom: 3px;
          }
          
          .quote-info {
            text-align: right;
            background: rgba(255, 255, 255, 0.95);
            padding: 15px;
            border-radius: 8px;
            border-left: 3px solid ${template.colors.primary};
            min-width: 200px;
          }
          
          .quote-title {
            font-size: ${fontSize + 4}px;
            font-weight: bold;
            color: ${template.colors.primary};
            margin-bottom: 8px;
          }
          
          .quote-number {
            font-size: ${fontSize + 1}px;
            color: #374151;
            margin-bottom: 5px;
          }
          
          .quote-date {
            font-size: ${fontSize}px;
            color: #6b7280;
          }
          
          .section {
            background: rgba(255, 255, 255, 0.95);
            padding: 20px;
            border-radius: 8px;
            backdrop-filter: blur(5px);
            margin-bottom: ${sectionSpacing}px;
          }
          
          .section-title {
            font-size: ${fontSize + 2}px;
            font-weight: bold;
            color: ${template.colors.primary};
            margin-bottom: 15px;
            padding-bottom: 8px;
            border-bottom: 2px solid ${template.colors.primary}20;
          }
          
          .client-info {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 15px;
          }
          
          .client-row {
            display: flex;
            align-items: flex-start;
            margin-bottom: 8px;
          }
          
          .client-label {
            font-weight: bold;
            width: 100px;
            color: #374151;
            flex-shrink: 0;
          }
          
          .client-value {
            color: #1f2937;
            flex: 1;
            word-wrap: break-word;
          }
          
          .products-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
            background: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          }
          
          .products-table th {
            background: linear-gradient(135deg, ${template.colors.primary}, ${template.colors.primary}90);
            color: white;
            padding: ${rowPadding + 4}px 8px;
            text-align: left;
            font-weight: bold;
            font-size: ${fontSize}px;
          }
          
          .products-table td {
            padding: ${rowPadding}px 8px;
            border-bottom: 1px solid #f3f4f6;
            font-size: ${fontSize}px;
            color: #1f2937;
            vertical-align: top;
          }
          
          .products-table tbody tr:nth-child(even) {
            background-color: #f9fafb;
          }
          
          .products-table tbody tr:hover {
            background-color: #f3f4f6;
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
          
          .product-description {
            line-height: 1.3;
          }
          
          .product-brand {
            font-size: ${fontSize - 2}px;
            color: #6b7280;
            margin-top: 3px;
          }
          
          .summary-section {
            margin-top: 20px;
            display: flex;
            justify-content: flex-end;
          }
          
          .summary-table {
            width: 300px;
            border-collapse: collapse;
            background: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          }
          
          .summary-table td {
            padding: 12px 15px;
            border-bottom: 1px solid #f3f4f6;
            color: #1f2937;
            font-size: ${fontSize}px;
          }
          
          .summary-table .total-row {
            background: linear-gradient(135deg, ${template.colors.primary}10, ${template.colors.primary}05);
            font-weight: bold;
            font-size: ${fontSize + 2}px;
            color: ${template.colors.primary};
          }
          
          .price {
            font-weight: bold;
            color: #1f2937;
          }
          
          /* Estilos responsivos para impresión */
          @media print {
            .quote-container {
              box-shadow: none;
              margin: 0;
              padding: 10mm;
              width: 216mm !important;
              min-height: 279mm !important;
            }
            
            body {
              margin: 0 !important;
              padding: 0 !important;
            }
            
            .template-image {
              opacity: 0.4;
            }
          }
          
          /* Ajustes para casos extremos */
          .overflow-protection {
            max-height: calc(279mm - 40mm);
            overflow: hidden;
          }
        </style>
      </head>
      <body>
        <div class="quote-container">
          ${templateImageData && templateImageData.base64 ? 
            `<img src="${templateImageData.base64}" alt="Plantilla ${template.name}" class="template-image" />` :
            `<img src="${window.location.origin}${template.image}" alt="Plantilla ${template.name}" class="template-image" crossorigin="anonymous" />`
          }
          
          <div class="content overflow-protection">
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
            <div class="section">
              <h2 class="section-title">Información del Cliente</h2>
              <div class="client-info">
                <div>
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
                </div>
                <div>
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
              </div>
            </div>
            
            <!-- Productos -->
            <div class="section">
              <h2 class="section-title">Productos y Servicios</h2>
              <table class="products-table">
                <thead>
                  <tr>
                    <th style="width: 40px;">#</th>
                    <th style="width: 80px;">Código</th>
                    <th>Descripción</th>
                    <th style="width: 50px;">Cant.</th>
                    <th style="width: 90px;">Precio Unit.</th>
                    <th style="width: 90px;">Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${cartItems.map((item, index) => `
                    <tr>
                      <td class="text-center">${index + 1}</td>
                      <td class="text-center font-bold">${item.code || 'N/A'}</td>
                      <td>
                        <div class="font-bold product-description">${item.name || 'Producto sin nombre'}</div>
                        ${item.description ? `<div style="font-size: ${fontSize - 1}px; color: #6b7280; margin-top: 2px;">${item.description}</div>` : ''}
                        ${item.brand ? `<div class="product-brand"><strong>Marca:</strong> ${item.brand}</div>` : ''}
                      </td>
                      <td class="text-center">${item.quantity || 1}</td>
                      <td class="text-right price">$${(item.basePrice || 0).toLocaleString('es-MX')}</td>
                      <td class="text-right price font-bold">$${((item.quantity || 1) * (item.basePrice || 0)).toLocaleString('es-MX')}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
              
              <!-- Resumen -->
              <div class="summary-section">
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
      const canvas = await html2canvas(quoteNode, { 
        scale: 2, 
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });
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
          }
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