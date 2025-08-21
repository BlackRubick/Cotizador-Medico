// src/components/services/pdfService.js - ACTUALIZADO con formato ICD
import jsPDF from 'jspdf';
import 'jspdf-autotable';

class PDFService {
  constructor() {
    this.pageWidth = 210; // A4 width in mm
    this.pageHeight = 297; // A4 height in mm
    this.margin = 20;
    this.contentWidth = this.pageWidth - (this.margin * 2);
  }

  // Generar PDF de cotización con formato ICD
  generateQuotePDF(quoteData, companyData = {}) {
    const doc = new jsPDF();
    let currentY = this.margin;

    // Configurar fuentes
    doc.setFont('helvetica');

    // Header de la empresa ICD
    currentY = this.addICDHeader(doc, currentY, companyData, quoteData);
    currentY += 10;

    // Título COTIZACIÓN
    currentY = this.addQuoteTitle(doc, currentY, quoteData);
    currentY += 15;

    // Información del cliente (dos columnas)
    currentY = this.addClientInfoTwoColumns(doc, currentY, quoteData);
    currentY += 15;

    // Tabla de productos estilo ICD
    currentY = this.addICDProductsTable(doc, currentY, quoteData);

    // Footer con información de contacto
    this.addICDFooter(doc, companyData);

    return doc;
  }

  // Header estilo ICD con logo circular y información
  addICDHeader(doc, startY, companyData, quoteData = {}) {
    const company = {
      name: 'Ingeniería Clínica Y Diseño',
      fullName: 'INGENIERÍA CLÍNICA Y DISEÑO S.A. DE C.V.',
      address: 'Camino Real a Xochitepec 108 PA, Colonia La Noria Xochimilco, CDMX CP:16030',
      phone: '+52 55 5526 789034',
      email: 'contacto@clinicaydiseno.com',
      website: 'www.clinicaydiseno.com',
      rfc: 'ICD130614LQ4',
      ...companyData
    };

    // Logo simplificado con rectángulo
    const logoX = this.margin;
    const logoY = startY;
    const logoWidth = 35;
    const logoHeight = 25;

    // Fondo del logo (turquesa)
    doc.setFillColor(64, 224, 208);
    doc.rect(logoX, logoY, logoWidth, logoHeight, 'F');

    // Texto "ICD" en el logo
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('ICD', logoX + 8, logoY + 15);

    // Información de la empresa al lado del logo
    const textX = logoX + logoWidth + 10;
    
    doc.setTextColor(30, 144, 255); // Azul
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(company.name, textX, startY + 8);

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    
    // Dirección en líneas separadas
    const addressLines = this.splitTextToLines(company.address, 60);
    addressLines.forEach((line, index) => {
      doc.text(line, textX, startY + 15 + (index * 4));
    });

    // Información adicional en la esquina superior derecha
    const rightX = this.pageWidth - this.margin - 50;
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text('Fecha: ' + this.formatDate(new Date()), rightX, startY + 8);
    doc.text('Folio: ' + (quoteData.folio || this.generateICDFolio()), rightX, startY + 13);

    return startY + 35;
  }

  // Título COTIZACIÓN centrado y destacado
  addQuoteTitle(doc, startY, quoteData) {
    // Rectángulo de fondo azul
    doc.setFillColor(30, 144, 255);
    doc.rect(this.margin, startY, this.contentWidth, 15, 'F');

    // Texto COTIZACIÓN en blanco
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    
    const titleWidth = doc.getTextWidth('COTIZACIÓN');
    const titleX = (this.pageWidth - titleWidth) / 2;
    doc.text('COTIZACIÓN', titleX, startY + 10);

    return startY + 15;
  }

  // Información del cliente en dos columnas estilo ICD
  addClientInfoTwoColumns(doc, startY, quoteData) {
    // Información del hospital (izquierda)
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Hospital Angeles Acoxpa', this.margin, startY);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    
    const leftInfo = [
      `Calz Acoxpa 430, Coapa, Ex-Hacienda Coapa,`,
      `Tlalpan, 14308 Ciudad de México, CDMX.`,
      `biomedica@angeles.mx`,
      `55526789034`
    ];

    leftInfo.forEach((line, index) => {
      doc.text(line, this.margin, startY + 8 + (index * 4));
    });

    // Información de ICD (derecha)
    const rightX = this.pageWidth / 2 + 10;
    
    doc.setFont('helvetica', 'bold');
    doc.text('Ingeniería Clínica y Diseño S.A. de C.V.', rightX, startY);
    
    doc.setFont('helvetica', 'normal');
    
    const rightInfo = [
      `ICD130614LQ4`,
      `Camino Real a Xochitepec 108 PA, Colonia`,
      `La Noria Xochimilco, CDMX CP:16030`
    ];

    rightInfo.forEach((line, index) => {
      doc.text(line, rightX, startY + 8 + (index * 4));
    });

    return startY + 25;
  }

  // Tabla de productos estilo ICD
  addICDProductsTable(doc, startY, quoteData) {
    // Párrafo introductorio
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    
    const introText = 'Por este medio de la presente, adjunto cotización formal de accesorios y/o consumibles con sus especificaciones técnicas, facilitando su análisis. Quedo a su disposición para ampliar información o ajustes requeridos.';
    
    const lines = doc.splitTextToSize(introText, this.contentWidth);
    lines.forEach((line, index) => {
      doc.text(line, this.margin, startY + (index * 4));
    });

    startY += lines.length * 4 + 10;

    // Preparar datos de la tabla
    const products = quoteData.cartItems || quoteData.products || [];
    
    const tableData = products.map((item, index) => [
      item.name || item.item || item.descripcion || '',
      (item.quantity || item.cantidad || 1).toString(),
      this.formatCurrency(item.basePrice || item.precioUnitario || 0),
      this.formatCurrency((item.quantity || 1) * (item.basePrice || item.precioUnitario || 0))
    ]);

    // Configuración de la tabla estilo ICD
    const tableConfig = {
      startY: startY,
      head: [['Descripcion', 'Qty', 'Precio Unitario', 'Precio Total']],
      body: tableData,
      theme: 'grid',
      headStyles: {
        fillColor: [30, 144, 255], // Azul ICD
        textColor: 255,
        fontSize: 10,
        fontStyle: 'bold',
        halign: 'center',
        cellPadding: 4
      },
      bodyStyles: {
        fontSize: 9,
        cellPadding: 4,
        textColor: 0
      },
      columnStyles: {
        0: { halign: 'left', cellWidth: 100 }, // Descripción más ancha
        1: { halign: 'center', cellWidth: 20 },
        2: { halign: 'right', cellWidth: 35 },
        3: { halign: 'right', cellWidth: 35 }
      },
      alternateRowStyles: {
        fillColor: [248, 249, 250]
      },
      margin: { left: this.margin, right: this.margin }
    };

    doc.autoTable(tableConfig);

    // Calcular totales
    const subtotal = products.reduce((sum, item) => {
      return sum + ((item.quantity || 1) * (item.basePrice || item.precioUnitario || 0));
    }, 0);
    
    const iva = subtotal * 0.16;
    const total = subtotal + iva;

    // Área de totales sin mostrar subtotal e IVA (como en la imagen)
    const finalY = doc.lastAutoTable.finalY || startY + 50;
    
    // Solo mostrar el RFC en la esquina inferior
    const rfcX = this.pageWidth - this.margin - 40;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('RFC', rfcX, finalY + 15);
    doc.text('ICD 090619J79', rfcX, finalY + 20);

    return finalY + 30;
  }

  // Footer estilo ICD con información de contacto
  addICDFooter(doc, companyData) {
    const footerY = this.pageHeight - 35;
    
    // Línea divisoria azul
    doc.setDrawColor(30, 144, 255);
    doc.setLineWidth(2);
    doc.line(this.margin, footerY, this.pageWidth - this.margin, footerY);

    // Información de contacto en el footer
    doc.setFontSize(8);
    doc.setTextColor(30, 144, 255);
    doc.setFont('helvetica', 'normal');
    
    const footerText = 'contacto@clinicaydiseno.com';
    const footerTextWidth = doc.getTextWidth(footerText);
    doc.text(footerText, this.margin, footerY + 8);

    // RFC en el lado derecho
    const rfcText = 'RFC\nICD 090619J79';
    doc.text(rfcText, this.pageWidth - this.margin - 25, footerY + 8);
  }

  // Función para dividir texto en líneas
  splitTextToLines(text, maxWidth) {
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';

    words.forEach(word => {
      const testLine = currentLine + (currentLine ? ' ' : '') + word;
      if (testLine.length <= maxWidth) {
        currentLine = testLine;
      } else {
        if (currentLine) lines.push(currentLine);
        currentLine = word;
      }
    });

    if (currentLine) lines.push(currentLine);
    return lines;
  }

  // Generar folio estilo ICD
  generateICDFolio() {
    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear().toString().slice(-2);
    const sequence = Math.floor(Math.random() * 999) + 1;
    
    return `ICD${day}${month}${year}${sequence}`;
  }

  // Métodos de utilidad (mantener los existentes)
  formatDate(date) {
    return date.toLocaleDateString('es-MX', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  formatDateTime(date) {
    return date.toLocaleString('es-MX', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatCurrency(amount) {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0
    }).format(amount || 0);
  }

  addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  // Método principal para generar y descargar PDF
  async generateAndDownloadQuotePDF(quoteData, companyData = {}) {
    try {
      console.log('🔄 Generando PDF de cotización ICD...', quoteData);

      const doc = this.generateQuotePDF(quoteData, companyData);
      
      // Generar nombre del archivo
      const folio = quoteData.folio || this.generateICDFolio();
      const fileName = `Cotizacion-ICD-${folio}.pdf`;
      
      // Descargar el PDF
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

  // Método para generar PDF como blob (para envío por email)
  async generateQuotePDFBlob(quoteData, companyData = {}) {
    try {
      const doc = this.generateQuotePDF(quoteData, companyData);
      return doc.output('blob');
    } catch (error) {
      console.error('Error generating PDF blob:', error);
      throw error;
    }
  }

  // Método para previsualizar PDF
  async previewQuotePDF(quoteData, companyData = {}) {
    try {
      const doc = this.generateQuotePDF(quoteData, companyData);
      
      // Abrir en nueva ventana
      const pdfDataUri = doc.output('datauristring');
      const newWindow = window.open();
      if (newWindow) {
        newWindow.document.write(`
          <iframe 
            width='100%' 
            height='100%' 
            src='${pdfDataUri}'
            style='border: none;'>
          </iframe>
        `);
        newWindow.document.title = 'Vista Previa - Cotización ICD';
      }
      
      return {
        success: true,
        message: 'PDF abierto en nueva ventana'
      };
    } catch (error) {
      console.error('Error previewing PDF:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Método adicional para generar PDF con información específica del hospital
  async generateHospitalQuotePDF(quoteData, hospitalData, companyData = {}) {
    try {
      // Preparar datos específicos del hospital
      const enhancedQuoteData = {
        ...quoteData,
        hospitalInfo: {
          name: hospitalData.name || 'Hospital Angeles Acoxpa',
          address: hospitalData.address || 'Calz Acoxpa 430, Coapa, Ex-Hacienda Coapa, Tlalpan, 14308 Ciudad de México, CDMX.',
          email: hospitalData.email || 'biomedica@angeles.mx',
          phone: hospitalData.phone || '55526789034'
        }
      };

      const doc = this.generateQuotePDF(enhancedQuoteData, companyData);
      
      const folio = quoteData.folio || this.generateICDFolio();
      const fileName = `Cotizacion-${hospitalData.name?.replace(/\s+/g, '-') || 'Hospital'}-${folio}.pdf`;
      
      doc.save(fileName);
      
      return {
        success: true,
        fileName,
        message: 'PDF de cotización hospitalaria generado exitosamente'
      };
      
    } catch (error) {
      console.error('Error generating hospital PDF:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

export default new PDFService();