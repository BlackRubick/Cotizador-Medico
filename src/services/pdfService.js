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
          primary: '#1e40af',
          secondary: '#64748b',
          accent: '#059669'
        }
      },
      'escala-biomedica': {
        image: '/plantillas/ESCALA-BIOMEDICA.jpeg',
        fallbackImages: ['/plantillas/ESCALA-BIOMEDICA.JPEG', '/plantillas/ESCALA-BIOMEDICA.jpg', '/plantillas/ESCALA-BIOMEDICA.JPG', '/plantillas/ESCALA-BIOMEDICA.png'],
        name: 'ESCALA BIOMEDICA',
        colors: {
          primary: '#dc2626',
          secondary: '#64748b',
          accent: '#059669'
        }
      },
      'ingenieria-clinica': {
        image: '/plantillas/INGENIERIA-CLINICA-DISEÑO.jpeg',
        fallbackImages: ['/plantillas/INGENIERIA-CLINICA-DISEÑO.JPEG', '/plantillas/INGENIERIA-CLINICA-DISEÑO.jpg', '/plantillas/INGENIERIA-CLINICA-DISEÑO.JPG', '/plantillas/INGENIERIA-CLINICA-DISEÑO.png'],
        name: 'INGENIERIA CLINICA Y DISEÑO',
        colors: {
          primary: '#7c3aed',
          secondary: '#64748b',
          accent: '#059669'
        }
      },
      'biosystems-hls': {
        image: '/plantillas/Biosystems-HLS.jpeg',
        fallbackImages: ['/plantillas/Biosystems-HLS.JPEG', '/plantillas/Biosystems-HLS.jpg', '/plantillas/Biosystems-HLS.JPG', '/plantillas/Biosystems-HLS.png'],
        name: 'Biosystems HLS',
        colors: {
          primary: '#059669',
          secondary: '#64748b',
          accent: '#dc2626'
        }
      }
    };
  }

  // NUEVA FUNCIÓN: Calcular productos por página
  calculateItemsPerPage(itemsCount) {
    // Estimación de altura por fila en mm (considerando fuente y padding)
    const rowHeight = itemsCount > 15 ? 8 : itemsCount > 10 ? 9 : itemsCount > 5 ? 10 : 12;
    
    // Altura disponible para productos (página 279mm - header 60mm - client 40mm - totals 30mm - margins 40mm)
    const availableHeight = 279 - 60 - 40 - 30 - 40; // ~109mm
    
    // Calcular cuántas filas caben
    const maxItemsPerPage = Math.floor(availableHeight / rowHeight);
    
    console.log(`📊 Cálculo de paginación: ${itemsCount} productos, ${maxItemsPerPage} por página`);
    
    return Math.max(8, maxItemsPerPage); // Mínimo 8 productos por página
  }

  // NUEVA FUNCIÓN: Dividir productos en páginas
  paginateProducts(cartItems) {
    const itemsPerPage = this.calculateItemsPerPage(cartItems.length);
    const pages = [];
    
    for (let i = 0; i < cartItems.length; i += itemsPerPage) {
      pages.push(cartItems.slice(i, i + itemsPerPage));
    }
    
    console.log(`📄 Productos divididos en ${pages.length} páginas`);
    return pages;
  }

  // Función para crear el HTML de la cotización con PAGINACIÓN
  createQuoteHTML(quoteData, sellerCompany, templateImageData = null, pageNumber = 1, totalPages = 1, productsForThisPage = null, showSummary = false) {
    const template = this.companyTemplates[sellerCompany.id];
    if (!template) {
      throw new Error('Plantilla no encontrada para la empresa seleccionada');
    }

    const currentDate = new Date().toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Usar productos específicos para esta página o todos los productos
    const cartItems = productsForThisPage || (Array.isArray(quoteData.cartItems) ? quoteData.cartItems : []);
    
    // Calcular totales SIEMPRE con todos los productos
    const allItems = Array.isArray(quoteData.cartItems) ? quoteData.cartItems : [];
    const subtotal = allItems.reduce((sum, item) => 
      sum + ((item.quantity || 1) * (item.basePrice || 0)), 0
    );
    const iva = subtotal * 0.16;
    const total = subtotal + iva;

    // Ajustar tamaños de fuente según la cantidad total de items
    const totalItemsCount = allItems.length;
    let fontSize = 12;
    let rowPadding = 8;
    let headerHeight = 120;
    let sectionSpacing = 20;

    if (totalItemsCount > 15) {
      fontSize = 8;
      rowPadding = 4;
      headerHeight = 100;
      sectionSpacing = 15;
    } else if (totalItemsCount > 10) {
      fontSize = 9;
      rowPadding = 5;
      headerHeight = 110;
      sectionSpacing = 18;
    } else if (totalItemsCount > 5) {
      fontSize = 10;
      rowPadding = 6;
      headerHeight = 115;
      sectionSpacing = 19;
    }

    return `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Cotización ${quoteData.folio} - Página ${pageNumber}</title>
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
            height: 279mm;
            max-width: 216mm;
            max-height: 279mm;
            padding: 15mm;
            background: white;
            box-sizing: border-box;
            border-radius: 6px;
            box-shadow: 0 0 8px rgba(0,0,0,0.1);
            overflow: hidden;
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
          }
          
          .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            min-height: ${headerHeight}px;
            margin-top: ${pageNumber === 1 ? '140px' : '20px'};
            padding: 15px;
            background: rgba(255, 255, 255, 0.9);
            border-radius: 8px;
            backdrop-filter: blur(5px);
            flex-shrink: 0;
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
          
          .page-info {
            font-size: ${fontSize - 1}px;
            color: #6b7280;
            margin-top: 5px;
          }
          
          .section {
            background: rgba(255, 255, 255, 0.95);
            padding: 20px;
            border-radius: 8px;
            backdrop-filter: blur(5px);
            margin-bottom: ${sectionSpacing}px;
            flex-shrink: 0;
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
          
          .products-section {
            flex: 1;
            display: flex;
            flex-direction: column;
            overflow: hidden;
          }
          
          .products-table {
            width: 100%;
            border-collapse: collapse;
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
            margin-top: auto;
            padding-top: 20px;
            display: flex;
            justify-content: flex-end;
            flex-shrink: 0;
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
          
          .continuation-note {
            text-align: center;
            font-style: italic;
            color: #6b7280;
            margin-top: 20px;
            padding: 10px;
            background: rgba(255, 255, 255, 0.8);
            border-radius: 6px;
          }
          
          /* Estilos responsivos para impresión */
          @media print {
            .quote-container {
              box-shadow: none;
              margin: 0;
              padding: 10mm;
              width: 216mm !important;
              height: 279mm !important;
            }
            
            body {
              margin: 0 !important;
              padding: 0 !important;
            }
            
            .template-image {
              opacity: 0.4;
            }
          }
        </style>
      </head>
      <body>
        <div class="quote-container">
          ${templateImageData && templateImageData.base64 ? 
            `<img src="${templateImageData.base64}" alt="Plantilla ${template.name}" class="template-image" />` :
            `<img src="${window.location.origin}${template.image}" alt="Plantilla ${template.name}" class="template-image" crossorigin="anonymous" />`
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
                ${totalPages > 1 ? `<div class="page-info">Página ${pageNumber} de ${totalPages}</div>` : ''}
              </div>
            </div>
            
            <!-- Cliente (solo en primera página) -->
            ${pageNumber === 1 ? `
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
            ` : ''}
            
            <!-- Productos -->
            <div class="section products-section">
              <h2 class="section-title">${pageNumber === 1 ? 'Productos y Servicios' : `Productos y Servicios (Continuación)`}</h2>
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
                  ${cartItems.map((item, index) => {
                    // Calcular el índice global del producto
                    const globalIndex = productsForThisPage ? 
                      allItems.findIndex(globalItem => globalItem === item) + 1 :
                      index + 1;
                    
                    return `
                    <tr>
                      <td class="text-center">${globalIndex}</td>
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
                  `}).join('')}
                </tbody>
              </table>
              
              <!-- Nota de continuación si no es la última página -->
              ${!showSummary && totalPages > 1 ? `
                <div class="continuation-note">
                  Continúa en la siguiente página...
                </div>
              ` : ''}
            </div>
            
            <!-- Resumen (solo en la última página) -->
            ${showSummary ? `
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
            ` : ''}
          </div>
        </div>
      </body>
      </html>
    `;
  }

  // NUEVA FUNCIÓN: Generar PDF con múltiples páginas
  async generateMultiPagePDF(quoteData, sellerCompany) {
    try {
      console.log('📄 Iniciando generación de PDF multipágina');
      
      const allItems = Array.isArray(quoteData.cartItems) ? quoteData.cartItems : [];
      
      if (allItems.length === 0) {
        throw new Error('No hay productos para generar el PDF');
      }

      // Precargar la imagen de la plantilla
      const templateImg = await this.preloadTemplateImage(sellerCompany.id);
      
      // Dividir productos en páginas
      const productPages = this.paginateProducts(allItems);
      const totalPages = productPages.length;
      
      console.log(`📊 Generando ${totalPages} páginas con ${allItems.length} productos`);

      // Crear el PDF
      const pdf = new jsPDF('p', 'mm', 'letter');
      const pageWidth = 216;
      const pageHeight = 279;

      // Generar cada página
      for (let i = 0; i < productPages.length; i++) {
        const pageNumber = i + 1;
        const productsForThisPage = productPages[i];
        const isLastPage = pageNumber === totalPages;

        console.log(`📄 Generando página ${pageNumber}/${totalPages} con ${productsForThisPage.length} productos`);

        // Crear HTML para esta página
        const htmlContent = this.createQuoteHTML(
          quoteData, 
          sellerCompany, 
          templateImg, 
          pageNumber, 
          totalPages, 
          productsForThisPage, 
          isLastPage // Mostrar resumen solo en la última página
        );

        // Crear contenedor temporal
        let container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.left = '-9999px';
        container.style.top = '0';
        container.style.width = '216mm';
        container.style.height = '279mm';
        container.innerHTML = htmlContent;
        document.body.appendChild(container);

        // Esperar a que carguen las imágenes
        await this.waitForImages(container);

        // Renderizar a imagen
        const quoteNode = container.querySelector('.quote-container');
        const canvas = await html2canvas(quoteNode, { 
          scale: 2, 
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff'
        });
        
        const imgData = canvas.toDataURL('image/jpeg', 0.95);

        // Agregar nueva página si no es la primera
        if (pageNumber > 1) {
          pdf.addPage();
        }

        // Agregar imagen al PDF
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pageWidth;
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        
        pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);

        // Limpiar el DOM
        document.body.removeChild(container);
      }

      // Descargar PDF
      const fileName = `Cotizacion_${quoteData.folio}_${sellerCompany.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);

      console.log('✅ PDF multipágina generado exitosamente');
      return { success: true, fileName, pages: totalPages };

    } catch (error) {
      console.error('❌ Error generando PDF multipágina:', error);
      return { success: false, error: error.message };
    }
  }

  // Función principal actualizada para manejar automáticamente la paginación
  async generateAndDownloadQuotePDF(quoteData, sellerCompany) {
    const allItems = Array.isArray(quoteData.cartItems) ? quoteData.cartItems : [];
    const itemsPerPage = this.calculateItemsPerPage(allItems.length);
    
    // Si hay muchos productos, usar PDF multipágina
    if (allItems.length > itemsPerPage) {
      console.log(`📊 Demasiados productos (${allItems.length}), usando paginación automática`);
      return await this.generateMultiPagePDF(quoteData, sellerCompany);
    } else {
      // Usar método original para pocos productos
      return await this.generateSinglePagePDF(quoteData, sellerCompany);
    }
  }

  // Método original renombrado para una sola página
  async generateSinglePagePDF(quoteData, sellerCompany) {
    try {
      const templateImg = await this.preloadTemplateImage(sellerCompany.id);
      const htmlContent = this.createQuoteHTML(quoteData, sellerCompany, templateImg, 1, 1, null, true);
      
      let container = document.createElement('div');
      container.style.position = 'fixed';
      container.style.left = '-9999px';
      container.style.top = '0';
      container.style.width = '216mm';
      container.style.minHeight = '279mm';
      container.innerHTML = htmlContent;
      document.body.appendChild(container);

      await this.waitForImages(container);

      const quoteNode = container.querySelector('.quote-container');
      const canvas = await html2canvas(quoteNode, { 
        scale: 2, 
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });
      
      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const pdf = new jsPDF('p', 'mm', 'letter');
      const pageWidth = 216;
      const pageHeight = 279;
      
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pageWidth;
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      
      const fileName = `Cotizacion_${quoteData.folio}_${sellerCompany.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);
      
      document.body.removeChild(container);
      return { success: true, fileName };

    } catch (error) {
      console.error('❌ Error generando PDF:', error);
      return { success: false, error: error.message };
    }
  }

  // Función para previsualizar PDF (actualizada para manejar múltiples páginas)
  async previewQuotePDF(quoteData, sellerCompany) {
    try {
      console.log('👁️ Iniciando vista previa del PDF');
      
      const allItems = Array.isArray(quoteData.cartItems) ? quoteData.cartItems : [];
      const itemsPerPage = this.calculateItemsPerPage(allItems.length);
      
      // Si hay muchos productos, mostrar aviso y previsualizar solo la primera página
      if (allItems.length > itemsPerPage) {
        const productPages = this.paginateProducts(allItems);
        const totalPages = productPages.length;
        
        if (!confirm(`Esta cotización tendrá ${totalPages} páginas debido a la cantidad de productos (${allItems.length}). ¿Desea previsualizar solo la primera página?`)) {
          return { success: false, error: 'Vista previa cancelada por el usuario' };
        }
        
        // Previsualizar solo la primera página
        const templateImg = await this.preloadTemplateImage(sellerCompany.id);
        const htmlContent = this.createQuoteHTML(
          quoteData, 
          sellerCompany, 
          templateImg, 
          1, 
          totalPages, 
          productPages[0], 
          false
        );
        
        const previewWindow = this.openPreviewWindow(htmlContent, `Cotización ${quoteData.folio} - Página 1 de ${totalPages}`);
        return { success: true, pages: totalPages };
      } else {
        // Vista previa normal para pocos productos
        const templateImg = await this.preloadTemplateImage(sellerCompany.id);
        const htmlContent = this.createQuoteHTML(quoteData, sellerCompany, templateImg, 1, 1, null, true);
        
        const previewWindow = this.openPreviewWindow(htmlContent, `Cotización ${quoteData.folio}`);
        return { success: true, pages: 1 };
      }
    } catch (error) {
      console.error('❌ Error en vista previa:', error);
      return { success: false, error: error.message };
    }
  }

  // Función auxiliar para abrir ventana de vista previa
  openPreviewWindow(htmlContent, title) {
    const previewWindow = window.open('', '_blank', 
      'width=900,height=700,scrollbars=yes,resizable=yes,toolbar=no,menubar=no,location=no,status=no'
    );
    
    if (previewWindow) {
      previewWindow.document.write(htmlContent);
      previewWindow.document.close();
      previewWindow.document.title = title;
      
      previewWindow.addEventListener('load', () => {
        console.log('📄 Vista previa cargada completamente');
        const images = previewWindow.document.querySelectorAll('img');
        console.log(`🖼️ Imágenes en vista previa: ${images.length}`);
        
        images.forEach((img, index) => {
          if (img.complete && img.naturalWidth > 0) {
            console.log(`✅ Imagen ${index + 1} ya cargada en vista previa`);
          } else {
            console.log(`⏳ Esperando carga de imagen ${index + 1} en vista previa`);
            img.onload = () => console.log(`✅ Imagen ${index + 1} cargada en vista previa`);
            img.onerror = () => console.warn(`❌ Error cargando imagen ${index + 1} en vista previa`);
          }
        });
      });
      
      previewWindow.focus();
      return previewWindow;
    } else {
      throw new Error('No se pudo abrir la ventana de vista previa. Verifique que no esté bloqueada por el navegador.');
    }
  }

  // NUEVA FUNCIÓN: Vista previa de todas las páginas
  async previewAllPages(quoteData, sellerCompany) {
    try {
      console.log('👁️ Iniciando vista previa de todas las páginas');
      
      const allItems = Array.isArray(quoteData.cartItems) ? quoteData.cartItems : [];
      const productPages = this.paginateProducts(allItems);
      const totalPages = productPages.length;
      
      if (totalPages === 1) {
        return await this.previewQuotePDF(quoteData, sellerCompany);
      }

      const templateImg = await this.preloadTemplateImage(sellerCompany.id);
      
      // Crear HTML combinado de todas las páginas
      let combinedHTML = `
        <!DOCTYPE html>
        <html lang="es">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Cotización ${quoteData.folio} - Vista Completa</title>
          <style>
            body {
              margin: 0;
              padding: 20px;
              background: #f5f5f5;
              font-family: Arial, sans-serif;
            }
            .page-separator {
              margin: 20px 0;
              padding: 10px;
              background: #333;
              color: white;
              text-align: center;
              border-radius: 5px;
            }
            .page-container {
              margin-bottom: 40px;
              box-shadow: 0 4px 8px rgba(0,0,0,0.1);
              border-radius: 8px;
              overflow: hidden;
            }
          </style>
        </head>
        <body>
          <h1 style="text-align: center; color: #333; margin-bottom: 30px;">
            Vista Previa Completa - Cotización ${quoteData.folio} (${totalPages} páginas)
          </h1>
      `;

      // Generar cada página
      for (let i = 0; i < productPages.length; i++) {
        const pageNumber = i + 1;
        const productsForThisPage = productPages[i];
        const isLastPage = pageNumber === totalPages;

        combinedHTML += `
          <div class="page-separator">
            Página ${pageNumber} de ${totalPages} (${productsForThisPage.length} productos)
          </div>
          <div class="page-container">
        `;

        const pageHTML = this.createQuoteHTML(
          quoteData,
          sellerCompany,
          templateImg,
          pageNumber,
          totalPages,
          productsForThisPage,
          isLastPage
        );

        // Extraer solo el contenido del body
        const bodyContent = pageHTML.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
        if (bodyContent) {
          combinedHTML += bodyContent[1];
        }

        combinedHTML += '</div>';
      }

      combinedHTML += '</body></html>';

      // Abrir ventana de vista previa
      const previewWindow = this.openPreviewWindow(combinedHTML, `Cotización ${quoteData.folio} - Vista Completa`);
      
      return { success: true, pages: totalPages };

    } catch (error) {
      console.error('❌ Error en vista previa completa:', error);
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