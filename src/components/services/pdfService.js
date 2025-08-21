// src/services/pdfService.js - Generación de PDF para cotizaciones
import jsPDF from 'jspdf';
import 'jspdf-autotable';

class PDFService {
  constructor() {
    this.pageWidth = 210; // A4 width in mm
    this.pageHeight = 297; // A4 height in mm
    this.margin = 20;
    this.contentWidth = this.pageWidth - (this.margin * 2);
  }

  // Generar PDF de cotización
  generateQuotePDF(quoteData, companyData = {}) {
    const doc = new jsPDF();
    let currentY = this.margin;

    // Configurar fuentes
    doc.setFont('helvetica');

    // Header de la empresa
    currentY = this.addCompanyHeader(doc, currentY, companyData);
    currentY += 10;

    // Título de la cotización
    currentY = this.addQuoteTitle(doc, currentY, quoteData);
    currentY += 10;

    // Información del cliente
    currentY = this.addClientInfo(doc, currentY, quoteData);
    currentY += 10;

    // Tabla de productos
    currentY = this.addProductsTable(doc, currentY, quoteData);
    currentY += 10;

    // Términos y condiciones
    currentY = this.addTermsAndConditions(doc, currentY, quoteData);

    // Footer
    this.addFooter(doc, companyData);

    return doc;
  }

  // Header de la empresa
  addCompanyHeader(doc, startY, companyData) {
    const company = {
      name: companyData.name || 'CONDUIT LIFE',
      address: companyData.address || 'Av. Principal 123, Tuxtla Gutiérrez, Chiapas',
      phone: companyData.phone || '+52 961 123 4567',
      email: companyData.email || 'contacto@conduitlife.com',
      website: companyData.website || 'www.conduitlife.com',
      ...companyData
    };

    // Logo placeholder (podrías agregar un logo real aquí)
    doc.setFillColor(79, 70, 229); // Color azul
    doc.rect(this.margin, startY, 30, 20, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('LOGO', this.margin + 10, startY + 12);

    // Información de la empresa
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(company.name, this.margin + 40, startY + 8);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(company.address, this.margin + 40, startY + 14);
    doc.text(`Tel: ${company.phone} | Email: ${company.email}`, this.margin + 40, startY + 18);

    return startY + 25;
  }

  // Título de la cotización
  addQuoteTitle(doc, startY, quoteData) {
    // Título principal
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(79, 70, 229);
    doc.text('COTIZACIÓN', this.margin, startY);

    // Información de la cotización en el lado derecho
    const rightX = this.pageWidth - this.margin - 60;
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    
    const quoteInfo = [
      ['Folio:', quoteData.folio || this.generateFolio()],
      ['Fecha:', this.formatDate(new Date())],
      ['Válida hasta:', this.formatDate(this.addDays(new Date(), 30))],
      ['Estado:', quoteData.estado || 'PENDIENTE']
    ];

    quoteInfo.forEach((info, index) => {
      doc.setFont('helvetica', 'bold');
      doc.text(info[0], rightX, startY + 5 + (index * 4));
      doc.setFont('helvetica', 'normal');
      doc.text(info[1], rightX + 20, startY + 5 + (index * 4));
    });

    return startY + 25;
  }

  // Información del cliente
  addClientInfo(doc, startY, quoteData) {
    // Título de sección
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(79, 70, 229);
    doc.text('INFORMACIÓN DEL CLIENTE', this.margin, startY);

    // Línea divisoria
    doc.setDrawColor(79, 70, 229);
    doc.setLineWidth(0.5);
    doc.line(this.margin, startY + 3, this.pageWidth - this.margin, startY + 3);

    // Información del cliente en dos columnas
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    
    const leftColumn = [
      ['Razón Social:', quoteData.clientName || quoteData.razonSocial || ''],
      ['Contacto:', quoteData.clientContact || quoteData.encargado || ''],
      ['Puesto:', quoteData.clientPosition || quoteData.puesto || ''],
    ];

    const rightColumn = [
      ['Email:', quoteData.email || quoteData.correo || ''],
      ['Teléfono:', quoteData.phone || quoteData.numero || ''],
      ['Dirección:', quoteData.clientAddress || quoteData.direccion || '']
    ];

    // Columna izquierda
    leftColumn.forEach((item, index) => {
      if (item[1]) {
        doc.setFont('helvetica', 'bold');
        doc.text(item[0], this.margin, startY + 10 + (index * 5));
        doc.setFont('helvetica', 'normal');
        doc.text(item[1], this.margin + 30, startY + 10 + (index * 5));
      }
    });

    // Columna derecha
    const rightX = this.pageWidth / 2 + 10;
    rightColumn.forEach((item, index) => {
      if (item[1]) {
        doc.setFont('helvetica', 'bold');
        doc.text(item[0], rightX, startY + 10 + (index * 5));
        doc.setFont('helvetica', 'normal');
        doc.text(item[1], rightX + 25, startY + 10 + (index * 5));
      }
    });

    return startY + 30;
  }

  // Tabla de productos
  addProductsTable(doc, startY, quoteData) {
    // Título de sección
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(79, 70, 229);
    doc.text('PRODUCTOS COTIZADOS', this.margin, startY);

    // Preparar datos de la tabla
    const products = quoteData.cartItems || quoteData.products || [];
    
    const tableData = products.map((item, index) => [
      (index + 1).toString(),
      item.code || item.codigo || '',
      item.name || item.item || item.descripcion || '',
      item.brand || item.marca || 'N/A',
      item.quantity || item.cantidad || 1,
      this.formatCurrency(item.basePrice || item.precioUnitario || 0),
      this.formatCurrency((item.quantity || 1) * (item.basePrice || item.precioUnitario || 0))
    ]);

    // Configuración de la tabla
    const tableConfig = {
      startY: startY + 8,
      head: [['#', 'Código', 'Descripción', 'Marca', 'Cant.', 'Precio Unit.', 'Total']],
      body: tableData,
      theme: 'grid',
      headStyles: {
        fillColor: [79, 70, 229],
        textColor: 255,
        fontSize: 9,
        fontStyle: 'bold',
        halign: 'center'
      },
      bodyStyles: {
        fontSize: 8,
        cellPadding: 3
      },
      columnStyles: {
        0: { halign: 'center', cellWidth: 10 },
        1: { halign: 'center', cellWidth: 25 },
        2: { halign: 'left', cellWidth: 60 },
        3: { halign: 'center', cellWidth: 25 },
        4: { halign: 'center', cellWidth: 15 },
        5: { halign: 'right', cellWidth: 25 },
        6: { halign: 'right', cellWidth: 25 }
      },
      alternateRowStyles: {
        fillColor: [248, 249, 250]
      }
    };

    doc.autoTable(tableConfig);

    // Calcular totales
    const subtotal = products.reduce((sum, item) => {
      return sum + ((item.quantity || 1) * (item.basePrice || item.precioUnitario || 0));
    }, 0);
    
    const iva = subtotal * 0.16;
    const total = subtotal + iva;

    // Añadir totales
    const finalY = doc.lastAutoTable.finalY || startY + 50;
    const totalsX = this.pageWidth - this.margin - 60;

    doc.setFontSize(10);
    
    // Subtotal
    doc.setFont('helvetica', 'normal');
    doc.text('Subtotal:', totalsX, finalY + 10);
    doc.text(this.formatCurrency(subtotal), totalsX + 35, finalY + 10);

    // IVA
    doc.text('IVA (16%):', totalsX, finalY + 15);
    doc.text(this.formatCurrency(iva), totalsX + 35, finalY + 15);

    // Línea de total
    doc.setLineWidth(0.5);
    doc.line(totalsX, finalY + 18, totalsX + 50, finalY + 18);

    // Total
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('TOTAL:', totalsX, finalY + 25);
    doc.text(this.formatCurrency(total), totalsX + 35, finalY + 25);

    return finalY + 35;
  }

  // Términos y condiciones
  addTermsAndConditions(doc, startY, quoteData) {
    // Verificar si hay espacio suficiente
    if (startY > this.pageHeight - 80) {
      doc.addPage();
      startY = this.margin;
    }

    // Título de sección
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(79, 70, 229);
    doc.text('CONDICIONES DE VENTA', this.margin, startY);

    // Línea divisoria
    doc.setDrawColor(79, 70, 229);
    doc.setLineWidth(0.5);
    doc.line(this.margin, startY + 3, this.pageWidth - this.margin, startY + 3);

    // Términos y condiciones
    doc.setFontSize(9);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');

    const terms = [
      '• PRECIOS: Los precios no incluyen IVA (16%)',
      '• MONEDA: Pesos Mexicanos',
      '• CONDICIONES DE PAGO: 100% Anticipado a la entrega (Transferencia Bancaria)',
      '• TIEMPO DE ENTREGA: 15 días hábiles',
      '• GARANTÍA: 12 meses sobre defectos de fabricación',
      '• OBSERVACIONES: Sin más por el momento, nos ponemos a sus órdenes para cualquier duda',
      '',
      'Esta cotización tiene una vigencia de 30 días naturales a partir de la fecha de emisión.'
    ];

    let currentTermY = startY + 10;
    terms.forEach(term => {
      if (term === '') {
        currentTermY += 3;
      } else {
        const lines = doc.splitTextToSize(term, this.contentWidth);
        doc.text(lines, this.margin, currentTermY);
        currentTermY += lines.length * 4;
      }
    });

    return currentTermY + 10;
  }

  // Footer
  addFooter(doc, companyData) {
    const footerY = this.pageHeight - 30;
    
    // Línea divisoria
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.3);
    doc.line(this.margin, footerY, this.pageWidth - this.margin, footerY);

    // Texto del footer
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.setFont('helvetica', 'normal');
    
    const footerText = `${companyData.name || 'CONDUIT LIFE'} - Equipos Médicos y Biomédicos`;
    doc.text(footerText, this.margin, footerY + 8);

    // Número de página
    const pageNumber = `Página ${doc.internal.getNumberOfPages()}`;
    doc.text(pageNumber, this.pageWidth - this.margin - 20, footerY + 8);

    // Fecha de generación
    const generatedDate = `Generado: ${this.formatDateTime(new Date())}`;
    doc.text(generatedDate, this.margin, footerY + 15);
  }

  // Métodos de utilidad
  generateFolio() {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const sequence = Math.floor(Math.random() * 99) + 1;
    
    return `BHL${day}${month}${year}C${sequence}`;
  }

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
      console.log('🔄 Generando PDF de cotización...', quoteData);

      const doc = this.generateQuotePDF(quoteData, companyData);
      
      // Generar nombre del archivo
      const folio = quoteData.folio || this.generateFolio();
      const fileName = `Cotizacion-${folio}.pdf`;
      
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
      newWindow.document.write(`
        <iframe 
          width='100%' 
          height='100%' 
          src='${pdfDataUri}'
          style='border: none;'>
        </iframe>
      `);
      
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
}

export default new PDFService();