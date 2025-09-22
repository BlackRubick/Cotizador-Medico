// services/localStorageService.js
class LocalStorageService {
  constructor() {
    this.QUOTES_KEY = 'cotizaciones_locales';
    this.COUNTER_KEY = 'cotizacion_counter';
  }

  // Obtener todas las cotizaciones locales
  getLocalQuotes() {
    try {
      const quotes = localStorage.getItem(this.QUOTES_KEY);
      return quotes ? JSON.parse(quotes) : [];
    } catch (error) {
      console.error('Error reading local quotes:', error);
      return [];
    }
  }

  // Guardar una nueva cotización local
  saveLocalQuote(quoteData) {
    try {
      const existingQuotes = this.getLocalQuotes();
      
      // Generar ID único si no existe
      if (!quoteData.id) {
        const counter = this.getNextCounter();
        quoteData.id = `local_${counter}`;
      }

      // Generar folio si no existe
      if (!quoteData.folio) {
        quoteData.folio = this.generateFolio();
      }

      // Agregar timestamps
      const now = new Date().toISOString();
      const newQuote = {
        ...quoteData,
        fechaCreacion: now,
        fechaActualizacion: now,
        estado: 'enviado',
        estadoLocal: true, // Marca para identificar cotizaciones locales
        fechaEnvio: now
      };

      // Agregar al inicio del array (más recientes primero)
      existingQuotes.unshift(newQuote);

      // Guardar en localStorage
      localStorage.setItem(this.QUOTES_KEY, JSON.stringify(existingQuotes));

      console.log('✅ Cotización guardada localmente:', newQuote.folio);
      return { success: true, data: newQuote };
    } catch (error) {
      console.error('❌ Error saving local quote:', error);
      return { success: false, error: error.message };
    }
  }

  // Actualizar una cotización existente
  updateLocalQuote(id, updatedData) {
    try {
      const quotes = this.getLocalQuotes();
      const index = quotes.findIndex(q => q.id === id);
      
      if (index !== -1) {
        quotes[index] = {
          ...quotes[index],
          ...updatedData,
          fechaActualizacion: new Date().toISOString()
        };
        
        localStorage.setItem(this.QUOTES_KEY, JSON.stringify(quotes));
        return { success: true, data: quotes[index] };
      }
      
      return { success: false, error: 'Cotización no encontrada' };
    } catch (error) {
      console.error('Error updating local quote:', error);
      return { success: false, error: error.message };
    }
  }

  // Eliminar una cotización local
  deleteLocalQuote(id) {
    try {
      const quotes = this.getLocalQuotes();
      const filteredQuotes = quotes.filter(q => q.id !== id);
      
      localStorage.setItem(this.QUOTES_KEY, JSON.stringify(filteredQuotes));
      return { success: true };
    } catch (error) {
      console.error('Error deleting local quote:', error);
      return { success: false, error: error.message };
    }
  }

  // Generar folio único
  generateFolio() {
    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear().toString().slice(-2);
    const counter = this.getNextCounter();
    
    return `LOC${day}${month}${year}${String(counter).padStart(3, '0')}`;
  }

  // Obtener y incrementar contador
  getNextCounter() {
    try {
      let counter = localStorage.getItem(this.COUNTER_KEY);
      counter = counter ? parseInt(counter) : 0;
      counter += 1;
      localStorage.setItem(this.COUNTER_KEY, counter.toString());
      return counter;
    } catch (error) {
      console.error('Error with counter:', error);
      return Math.floor(Math.random() * 1000);
    }
  }

  // Formatear cotización para el historial
  formatQuoteForHistory(quote) {
    const totalAmount = quote.products?.reduce((sum, item) => {
      return sum + ((item.quantity || 1) * (item.basePrice || 0));
    }, 0) || 0;

    return {
      id: quote.id,
      folio: quote.folio,
      fecha: this.formatDate(quote.fechaCreacion) || this.formatDate(new Date()),
      // Campos principales
      cliente: quote.clientName || 'Cliente no especificado',
      correo: quote.email || '',
      telefono: quote.phone || '',
      estado: quote.estado || 'enviado',
      empresa: quote.sellerCompany || '',
      productos: quote.products || [],
      total: totalAmount,
      descripcion: `${(quote.products || []).length} producto${(quote.products || []).length !== 1 ? 's' : ''}`,
      // Campos de compatibilidad con diferentes estructuras
      razonSocial: quote.clientName || 'Cliente no especificado',
      encargado: quote.clientContact || '',
      contacto: quote.clientContact || '',
      direccion: quote.clientAddress || '',
      puesto: quote.clientPosition || '',
      numero: quote.phone || '',
      // Referencias adicionales
      products: quote.products || [],
      clientInfoName: quote.clientName,
      clientInfoContact: quote.clientContact,
      clientInfoEmail: quote.email,
      clientInfoPhone: quote.phone,
      clientInfoAddress: quote.clientAddress,
      clientInfoPosition: quote.clientPosition,
      // Timestamps
      fechaCreacion: quote.fechaCreacion,
      fechaEnvio: quote.fechaEnvio,
      estadoLocal: true,
      // Campos adicionales para compatibilidad
      clientId: quote.clientId,
      sellerCompanyId: quote.sellerCompanyId,
      terms: quote.terms
    };
  }

  // Obtener estadísticas de cotizaciones locales
  getLocalStats() {
    const quotes = this.getLocalQuotes();
    
    return {
      total: quotes.length,
      enviadas: quotes.filter(q => q.estado === 'enviado').length,
      borradores: quotes.filter(q => q.estado === 'borrador').length,
      confirmadas: quotes.filter(q => q.estado === 'confirmado').length,
      totalAmount: quotes.reduce((sum, q) => {
        const quoteTotal = q.products?.reduce((pSum, p) => {
          return pSum + ((p.quantity || 1) * (p.basePrice || 0));
        }, 0) || 0;
        return sum + quoteTotal;
      }, 0)
    };
  }

  // Limpiar todas las cotizaciones locales
  clearAllLocalQuotes() {
    try {
      localStorage.removeItem(this.QUOTES_KEY);
      localStorage.removeItem(this.COUNTER_KEY);
      return { success: true };
    } catch (error) {
      console.error('Error clearing local quotes:', error);
      return { success: false, error: error.message };
    }
  }

  // Exportar cotizaciones locales (para respaldo)
  exportLocalQuotes() {
    const quotes = this.getLocalQuotes();
    const dataStr = JSON.stringify(quotes, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `cotizaciones_backup_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  }

  // Importar cotizaciones locales (desde respaldo)
  importLocalQuotes(jsonData) {
    try {
      const importedQuotes = JSON.parse(jsonData);
      const existingQuotes = this.getLocalQuotes();
      
      // Combinar sin duplicados (basado en folio)
      const combinedQuotes = [...existingQuotes];
      const existingFolios = new Set(existingQuotes.map(q => q.folio));
      
      importedQuotes.forEach(quote => {
        if (!existingFolios.has(quote.folio)) {
          combinedQuotes.push(quote);
        }
      });
      
      localStorage.setItem(this.QUOTES_KEY, JSON.stringify(combinedQuotes));
      return { success: true, imported: importedQuotes.length };
    } catch (error) {
      console.error('Error importing quotes:', error);
      return { success: false, error: error.message };
    }
  }

  // Método auxiliar para formatear fechas de manera consistente
  formatDate(dateInput) {
    if (!dateInput) return '';
    
    try {
      const date = new Date(dateInput);
      
      // Verificar si la fecha es válida
      if (isNaN(date.getTime())) {
        console.warn('Fecha inválida:', dateInput);
        return new Date().toLocaleDateString('es-MX', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        });
      }
      
      return date.toLocaleDateString('es-MX', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (error) {
      console.error('Error formateando fecha:', error);
      return new Date().toLocaleDateString('es-MX', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    }
  }
}

export default new LocalStorageService();
