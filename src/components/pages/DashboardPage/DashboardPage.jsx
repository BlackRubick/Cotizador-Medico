import React, { useState, useEffect } from 'react';
import Dashboard from '../../organisms/Dashboard';
import quoteService from '../../services/quoteService';
import localStorageService from '../../services/locastorageService';

const DashboardPage = ({ onNavigate }) => {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar cotizaciones al montar el componente
  useEffect(() => {
    loadQuotes();
  }, []);

  const loadQuotes = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Cargando cotizaciones para Dashboard...');
      
      let mappedQuotes = [];
      
      // 1. Cargar cotizaciones locales primero (siempre disponibles)
      try {
        const localQuotes = localStorageService.getLocalQuotes();
        const formattedLocalQuotes = localQuotes.map(quote => 
          localStorageService.formatQuoteForHistory(quote)
        );
        mappedQuotes = [...formattedLocalQuotes];
        console.log('✅ Cotizaciones locales cargadas:', formattedLocalQuotes.length);
      } catch (localError) {
        console.warn('⚠️ Error cargando cotizaciones locales:', localError);
      }
      
      // 2. Intentar cargar cotizaciones del servidor
      try {
        const response = await quoteService.getQuotes({
          page: 1,
          limit: 50, // Menos cotizaciones para el dashboard
        });
        
        if (response.success) {
          // Mapear datos del backend al formato del frontend
          const serverQuotes = response.data.map(quote => 
            quoteService.mapBackendToFrontend(quote)
          );
          
          // Combinar cotizaciones (evitar duplicados por folio)
          const existingFolios = new Set(mappedQuotes.map(q => q.folio));
          const newServerQuotes = serverQuotes.filter(q => !existingFolios.has(q.folio));
          mappedQuotes = [...mappedQuotes, ...newServerQuotes];
          
          console.log('✅ Cotizaciones del servidor cargadas:', serverQuotes.length);
        }
      } catch (serverError) {
        console.warn('⚠️ Error cargando cotizaciones del servidor:', serverError);
        // Continuar solo con cotizaciones locales
      }
      
      // 3. Ordenar por fecha (más recientes primero)
      mappedQuotes.sort((a, b) => {
        const dateA = new Date(a.fechaCreacion || a.fecha || 0);
        const dateB = new Date(b.fechaCreacion || b.fecha || 0);
        return dateB - dateA;
      });
      
      setQuotes(mappedQuotes);
      console.log('📊 Total cotizaciones cargadas:', mappedQuotes.length);
      
    } catch (error) {
      console.error('❌ Error cargando cotizaciones:', error);
      setError('Error al cargar las cotizaciones');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateQuote = () => {
    console.log('Crear nueva cotización');
    onNavigate('cotizar');
  };

  const handleFilterQuotes = (filters) => {
    console.log('Filtrar cotizaciones:', filters);
    // TODO: Implementar filtros en el futuro
  };

  const handleSelectQuote = (quote) => {
    console.log('Seleccionar cotización:', quote);
    // Navegar a historial donde se puede ver la cotización
    onNavigate('historial');
  };

  const handleRefresh = () => {
    loadQuotes();
  };

  return (
    <Dashboard
      quotes={quotes}
      loading={loading}
      error={error}
      onCreateQuote={handleCreateQuote}
      onFilterQuotes={handleFilterQuotes}
      onSelectQuote={handleSelectQuote}
      onRefresh={handleRefresh}
    />
  );
};

export default DashboardPage;
