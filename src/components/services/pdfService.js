// src/components/services/pdfService.js - REPLICANDO DISEÑO EXACTO
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

class PDFService {
  constructor() {
    this.pageWidth = 210; // A4 width in mm
    this.pageHeight = 297; // A4 height in mm
    this.margin = 20;
    this.contentWidth = this.pageWidth - (this.margin * 2);
  }

  // Generar PDF exacto al diseño ICD
  generateQuotePDF(quoteData, companyData = {}) {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    let currentY = this.margin;

    // Header con logo ICD
    currentY = this.addICDHeaderExact(doc, currentY, quoteData);
    currentY += 15;

    // Título COTIZACIÓN
    currentY = this.addExactTitle(doc, currentY);
    currentY += 20;

    // Información en dos columnas
    currentY = this.addExactClientInfo(doc, currentY, quoteData);
    currentY += 25;

    // Párrafo introductorio
    currentY = this.addIntroText(doc, currentY);
    currentY += 15;

    // Tabla de productos exacta
    currentY = this.addExactProductTable(doc, currentY, quoteData);

    // Footer exacto
    this.addExactFooter(doc);

    return doc;
  }

  // Header exacto con logo circular ICD
  addICDHeaderExact(doc, startY, quoteData) {
    // Logo circular con gradiente turquesa-azul
    const logoX = this.pageWidth / 2 - 25;
    const logoY = startY;
    const logoRadius = 25;

    // Círculo exterior turquesa
    doc.setFillColor(64, 224, 208); // Turquesa
    doc.circle(logoX, logoY, logoRadius, 'F');

    // Círculo interior azul
    doc.setFillColor(30, 144, 255); // Azul
    doc.circle(logoX, logoY, logoRadius - 3, 'F');

    // Línea de pulso cardiaco (simulada con líneas)
    doc.setDrawColor(255, 255, 255);
    doc.setLineWidth(2);
    const pulseY = logoY;
    const pulseStartX = logoX - 20;
    const pulseEndX = logoX + 20;
    
    // Línea base
    doc.line(pulseStartX, pulseY, pulseStartX + 8, pulseY);
    // Pico 1
    doc.line(pulseStartX + 8, pulseY, pulseStartX + 10, pulseY - 8);
    doc.line(pulseStartX + 10, pulseY - 8, pulseStartX + 12, pulseY + 8);
    doc.line(pulseStartX + 12, pulseY + 8, pulseStartX + 14, pulseY - 5);
    // Pico 2
    doc.line(pulseStartX + 14, pulseY - 5, pulseStartX + 16, pulseY + 3);
    doc.line(pulseStartX + 16, pulseY + 3, pulseStartX + 18, pulseY - 3);
    // Línea final
    doc.line(pulseStartX + 18, pulseY - 3, pulseEndX, pulseY);

    // Texto "ICD" en el centro
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    const icdWidth = doc.getTextWidth('ICD');
    doc.text('ICD', logoX - (icdWidth / 2), logoY + 5);

    // Texto "Ingeniería Clínica Y Diseño" debajo del logo
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    const companyText = 'Ingeniería Clínica Y Diseño';
    const companyWidth = doc.getTextWidth(companyText);
    doc.text(companyText, logoX - (companyWidth / 2), logoY + logoRadius + 8);

    // Información en las esquinas superiores
    // Fecha (izquierda)
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('Fecha: Abril 25, 2025', this.margin, startY + 5);

    // Folio (derecha)
    const folio = quoteData.folio || this.generateICDFolio();
    const folioText = `Folio: ${folio}`;
    const folioWidth = doc.getTextWidth(folioText);
    doc.text(folioText, this.pageWidth - this.margin - folioWidth, startY + 5);

    return startY + logoRadius + 15;
  }

  // Título exacto
  addExactTitle(doc, startY) {
    // Línea decorativa superior (gradiente simulado con rectángulos)
    const lineY = startY;
    const lineHeight = 3;
    
    // Gradiente turquesa a azul
    const segments = 20;
    const segmentWidth = this.contentWidth / segments;
    
    for (let i = 0; i < segments; i++) {
      const ratio = i / segments;
      const r = Math.round(64 + (30 - 64) * ratio);
      const g = Math.round(224 + (144 - 224) * ratio);
      const b = Math.round(208 + (255 - 208) * ratio);
      
      doc.setFillColor(r, g, b);
      doc.rect(this.margin + (i * segmentWidth), lineY, segmentWidth, lineHeight, 'F');
    }

    // Título COTIZACIÓN
    doc.setFillColor(30, 144, 255); // Azul
    const titleHeight = 12;
    doc.rect(this.margin, startY + 5, this.contentWidth, titleHeight, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    
    const titleText = 'COTIZACIÓN';
    const titleWidth = doc.getTextWidth(titleText);
    const titleX = (this.pageWidth - titleWidth) / 2;
    doc.text(titleText, titleX, startY + 13);

    return startY + titleHeight + 5;
  }

  // Información del cliente exacta (dos columnas)
  addExactClientInfo(doc, startY, quoteData) {
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');

    // Columna izquierda - Hospital
    const leftX = this.margin;
    doc.text('Hospital Angeles Acoxpa', leftX, startY);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    
    const leftInfo = [
      'Calz Acoxpa 430, Coapa, Ex-Hacienda Coapa,',
      'Tlalpan, 14308 Ciudad de México, CDMX.',
      'biomedica@angeles.mx',
      '55526789034'
    ];

    leftInfo.forEach((line, index) => {
      doc.text(line, leftX, startY + 6 + (index * 4));
    });

    // Columna derecha - ICD
    const rightX = this.pageWidth / 2 + 10;
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('Ingeniería Clínica y Diseño S.A. de C.V.', rightX, startY);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    
    const rightInfo = [
      'ICD130614LQ4',
      'Camino Real a Xochitepec 108 PA, Colonia',
      'La Noria Xochimilco, CDMX CP:16030'
    ];

    rightInfo.forEach((line, index) => {
      doc.text(line, rightX, startY + 6 + (index * 4));
    });

    return startY + 20;
  }

  // Texto introductorio exacto
  addIntroText(doc, startY) {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    
    const introText = 'Por este medio de la presente, adjunto cotización formal de accesorios y/o consumibles con sus especificaciones técnicas, facilitando su análisis. Quedo a su disposición para ampliar información o ajustes requeridos.';
    
    const lines = doc.splitTextToSize(introText, this.contentWidth);
    lines.forEach((line, index) => {
      doc.text(line, this.margin, startY + (index * 4));
    });

    return startY + (lines.length * 4);
  }

  // Tabla exacta con colores alternados
  addExactProductTable(doc, startY, quoteData) {
    const products = quoteData.cartItems || quoteData.products || [
      {
        name: 'SPACELABS - 700-0031-00 - TEMPERATURA Cable de temperatura dual TruLink, 30 cm/12 pulgadas, Adaptador para monitores *Es necesario para todas las sondas reutilizables y conforme a las indicaciones para el sistema desechable de uso en un solo paciente.',
        quantity: 1,
        basePrice: 90
      },
      {
        name: 'SPACELABS - 714-0019-02 - NIBP Manguera NIBP, tubo único, neonatal, 9.275 cm/ pies, liberación rápida',
        quantity: 2,
        basePrice: 150
      },
      {
        name: 'SPACELABS - 690-0297-00 - TEMPERATURA Sonda de temperatura con sensor de superficie cutánea, compatible con la serie YSI 700, tamaño pediátrico, 305 cm/10 pies',
        quantity: 1,
        basePrice: 200
      },
      {
        name: 'SPACELABS - 690-0297-00 - TEMPERATURA Sonda de temperatura con sensor de superficie cutánea, compatible con la serie YSI 700, tamaño pediátrico, 305 cm/10 pies',
        quantity: 1,
        basePrice: 90
      },
      {
        name: 'SPACELABS - 714-0019-02 - NIBP Manguera NIBP, tubo único, neonatal, 9.275 cm/ pies, liberación rápida',
        quantity: 2,
        basePrice: 150
      },
      {
        name: 'SPACELABS - 690-0297-00 - TEMPERATURA Sonda de temperatura con sensor de superficie cutánea, compatible con la serie YSI 700, tamaño pediátrico, 305 cm/10 pies',
        quantity: 1,
        basePrice: 200
      },
      {
        name: 'SPACELABS - 690-0297-00 - TEMPERATURA Sonda de temperatura con sensor de superficie cutánea, compatible con la serie YSI 700, tamaño pediátrico, 305 cm/10 pies',
        quantity: 2,
        basePrice: 150
      }
    ];

    // Verificar si autoTable está disponible
    if (typeof doc.autoTable !== 'function') {
      return this.addSimpleTableExact(doc, startY, products);
    }

    // Preparar datos para la tabla
    const tableData = products.map((item) => [
      item.name || item.descripcion || '',
      (item.quantity || item.cantidad || 1).toString(),
      `$${(item.basePrice || item.precioUnitario || 0)}`,
      `$${((item.quantity || 1) * (item.basePrice || item.precioUnitario || 0)).toFixed(2)}`
    ]);

    try {
      doc.autoTable({
        startY: startY,
        head: [['Descripcion', 'Qty', 'Precio Unitario', 'Precio Total']],
        body: tableData,
        theme: 'grid',
        headStyles: {
          fillColor: [63, 81, 181], // Azul exacto del header
          textColor: 255,
          fontSize: 11,
          fontStyle: 'bold',
          halign: 'center',
          cellPadding: 5
        },
        bodyStyles: {
          fontSize: 9,
          cellPadding: 4,
          textColor: 0,
          lineColor: [200, 200, 200],
          lineWidth: 0.5
        },
        columnStyles: {
          0: { halign: 'left', cellWidth: 110 },
          1: { halign: 'center', cellWidth: 20 },
          2: { halign: 'center', cellWidth: 30 },
          3: { halign: 'center', cellWidth: 30 }
        },
        alternateRowStyles: {
          fillColor: [245, 245, 250] // Gris muy claro para filas alternas
        },
        margin: { left: this.margin, right: this.margin },
        didParseCell: function(data) {
          // Ajustar altura de celda para texto largo
          if (data.column.index === 0 && data.row.index >= 0) {
            data.cell.styles.cellPadding = 3;
            data.cell.styles.fontSize = 8;
          }
        }
      });

      return doc.lastAutoTable.finalY + 10;
    } catch (error) {
      console.error('Error en autoTable:', error);
      return this.addSimpleTableExact(doc, startY, products);
    }
  }

  // Tabla simple exacta como fallback
  addSimpleTableExact(doc, startY, products) {
    const headers = ['Descripcion', 'Qty', 'Precio Unitario', 'Precio Total'];
    const colWidths = [110, 20, 30, 30];
    const rowHeight = 8;
    let currentY = startY;

    // Header
    doc.setFillColor(63, 81, 181);
    doc.rect(this.margin, currentY, this.contentWidth, rowHeight, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    
    let currentX = this.margin;
    headers.forEach((header, index) => {
      doc.text(header, currentX + 2, currentY + 5);
      currentX += colWidths[index];
    });
    
    currentY += rowHeight;

    // Filas de productos
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    
    products.forEach((product, rowIndex) => {
      const rowData = [
        product.name || product.descripcion || '',
        (product.quantity || 1).toString(),
        `$${product.basePrice || 0}`,
        `$${((product.quantity || 1) * (product.basePrice || 0)).toFixed(2)}`
      ];

      // Fondo alternado
      if (rowIndex % 2 === 1) {
        doc.setFillColor(245, 245, 250);
        doc.rect(this.margin, currentY, this.contentWidth, rowHeight, 'F');
      }
      
      currentX = this.margin;
      rowData.forEach((cell, colIndex) => {
        if (colIndex === 0) {
          // Descripción - texto largo
          const lines = doc.splitTextToSize(cell, colWidths[0] - 4);
          lines.slice(0, 2).forEach((line, lineIndex) => {
            doc.text(line, currentX + 2, currentY + 3 + (lineIndex * 3));
          });
        } else {
          doc.text(cell, currentX + 2, currentY + 5);
        }
        currentX += colWidths[colIndex];
      });
      
      currentY += Math.max(rowHeight, 8);
    });

    return currentY + 10;
  }

  // Footer exacto con gradiente
  addExactFooter(doc) {
    const footerY = this.pageHeight - 40;
    
    // Línea decorativa con gradiente
    const segments = 20;
    const segmentWidth = this.contentWidth / segments;
    
    for (let i = 0; i < segments; i++) {
      const ratio = i / segments;
      const r = Math.round(64 + (30 - 64) * ratio);
      const g = Math.round(224 + (144 - 224) * ratio);
      const b = Math.round(208 + (255 - 208) * ratio);
      
      doc.setFillColor(r, g, b);
      doc.rect(this.margin + (i * segmentWidth), footerY, segmentWidth, 2, 'F');
    }

    // Rectángulo azul en la parte inferior
    doc.setFillColor(30, 144, 255);
    doc.rect(0, footerY + 15, this.pageWidth, 25, 'F');

    // Información de contacto
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    
    doc.text('contacto@clinicaydiseno.com', this.margin, footerY + 28);

    // RFC
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('RFC', this.pageWidth - this.margin - 35, footerY + 25);
    doc.text('ICD 090619J79', this.pageWidth - this.margin - 35, footerY + 30);
  }

  // Generar folio exacto
  generateICDFolio() {
    return 'ICD090619J79';
  }

  // Métodos de utilidad (mantener los existentes)
  formatDate(date) {
    return date.toLocaleDateString('es-MX', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  formatCurrency(amount) {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0
    }).format(amount || 0);
  }

  // Método principal para generar y descargar PDF
  async generateAndDownloadQuotePDF(quoteData, companyData = {}) {
    try {
      console.log('🔄 Generando PDF exacto de cotización ICD...', quoteData);

      const doc = this.generateQuotePDF(quoteData, companyData);
      
      const folio = quoteData.folio || this.generateICDFolio();
      const fileName = `Cotizacion-ICD-${folio}.pdf`;
      
      doc.save(fileName);
      
      console.log('✅ PDF generado exitosamente:', fileName);
      
      return {
        success: true,
        fileName,
        message: 'PDF generado exitosamente'
      };

    } catch (error) {
      console.error('❌ Error generando PDF:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Método para previsualizar PDF
  async previewQuotePDF(quoteData, companyData = {}) {
    try {
      console.log('👁️ Generando vista previa exacta del PDF...');
      
      const doc = this.generateQuotePDF(quoteData, companyData);
      
      const pdfDataUri = doc.output('datauristring');
      const newWindow = window.open();
      if (newWindow) {
        newWindow.document.write(`
          <html>
            <head>
              <title>Vista Previa - Cotización ICD</title>
              <style>
                body { margin: 0; padding: 0; background: #f0f0f0; }
                iframe { width: 100%; height: 100vh; border: none; }
              </style>
            </head>
            <body>
              <iframe src='${pdfDataUri}'></iframe>
            </body>
          </html>
        `);
        newWindow.document.close();
      } else {
        console.warn('No se pudo abrir nueva ventana, descargando PDF...');
        return this.generateAndDownloadQuotePDF(quoteData, companyData);
      }
      
      return {
        success: true,
        message: 'PDF abierto en nueva ventana'
      };
    } catch (error) {
      console.error('❌ Error previewing PDF:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Método para generar PDF como blob
  async generateQuotePDFBlob(quoteData, companyData = {}) {
    try {
      const doc = this.generateQuotePDF(quoteData, companyData);
      return doc.output('blob');
    } catch (error) {
      console.error('Error generating PDF blob:', error);
      throw error;
    }
  }
}

export default new PDFService();