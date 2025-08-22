// src/components/pages/HistoryPage/HistoryPage.jsx - ACTUALIZADO CON API REAL
import React, { useState, useEffect } from 'react';
import HistoryViewer from '../../organisms/HistoryViewer';
import quoteService from '../../services/quoteService';

const HistoryPage = () => {
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
      
      console.log('🔄 Cargando historial de cotizaciones...');
      
      const response = await quoteService.getQuotes({
        // Parámetros para obtener todas las cotizaciones
        page: 1,
        limit: 100, // Obtener hasta 100 cotizaciones para el historial
        // Opcional: filtrar solo cotizaciones enviadas/confirmadas
        // status: 'sent,confirmed,rejected'
      });
      
      if (response.success) {
        // Mapear datos del backend al formato del frontend
        const mappedQuotes = response.data.map(quote => 
          quoteService.mapBackendToFrontend(quote)
        );
        
        console.log('✅ Cotizaciones cargadas:', mappedQuotes.length);
        setQuotes(mappedQuotes);
      } else {
        throw new Error(response.message || 'Error al cargar cotizaciones');
      }
    } catch (err) {
      console.error('❌ Error loading quotes:', err);
      setError(err.message || 'Error al cargar las cotizaciones');
      
      // Si hay error de autenticación, redirigir al login
      if (err.message.includes('unauthorized') || err.message.includes('token')) {
        console.log('Token inválido, redirigir al login');
        // Opcional: limpiar token y redirigir
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (quote) => {
    try {
      console.log('✏️ Editando cotización:', quote);
      
      // Aquí puedes implementar la lógica de edición
      // Por ejemplo, abrir un modal de edición o navegar a una página de edición
      
      // Placeholder: mostrar alerta por ahora
      const confirmEdit = window.confirm(`¿Deseas editar la cotización ${quote.folio}?`);
      
      if (confirmEdit) {
        // TODO: Implementar navegación a página de edición
        alert(`Función de edición para ${quote.folio} - Por implementar`);
        
        // Opcional: navegar a página de edición
        // navigate(`/cotizaciones/${quote.id}/editar`);
      }
    } catch (error) {
      console.error('❌ Error editing quote:', error);
      alert('Error al intentar editar la cotización: ' + error.message);
    }
  };

  const handleSendEmail = async (quote) => {
    try {
      console.log('📧 Enviando email para cotización:', quote);
      
      const confirmSend = window.confirm(
        `¿Enviar cotización ${quote.folio} por email a ${quote.correo}?`
      );
      
      if (confirmSend) {
        setLoading(true);
        
        // Llamar al servicio para enviar email
        const response = await quoteService.sendQuoteByEmail(quote.id, {
          email: quote.correo,
          subject: `Cotización ${quote.folio}`,
          message: 'Adjunto encontrará su cotización solicitada.'
        });
        
        if (response.success) {
          alert(`✅ Cotización ${quote.folio} enviada exitosamente a ${quote.correo}`);
          
          // Actualizar estado de la cotización a "enviado"
          await quoteService.updateQuoteStatus(quote.id, 'sent');
          
          // Recargar cotizaciones para reflejar el cambio
          await loadQuotes();
        } else {
          throw new Error(response.message || 'Error al enviar email');
        }
      }
    } catch (error) {
      console.error('❌ Error sending email:', error);
      alert('Error al enviar email: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = async (filters) => {
    try {
      setLoading(true);
      console.log('🔍 Aplicando filtros:', filters);
      
      // Preparar parámetros de filtro para la API
      const queryParams = {
        page: 1,
        limit: 100
      };
      
      // Mapear filtros del frontend a parámetros de API
      if (filters.estado) {
        // Mapear estados del frontend al backend
        const statusMap = {
          'borrador': 'draft',
          'enviado': 'sent', 
          'pendiente': 'pending',
          'confirmado': 'confirmed',
          'rechazado': 'rejected',
          'cancelado': 'cancelled'
        };
        queryParams.status = statusMap[filters.estado] || filters.estado;
      }
      
      if (filters.año) {
        // Filtrar por año en el backend sería ideal, pero por ahora filtraremos en frontend
        queryParams.year = filters.año;
      }
      
      if (filters.mes) {
        queryParams.month = filters.mes;
      }
      
      // Buscar por marca en descripción/productos (si el backend lo soporta)
      if (filters.marca) {
        queryParams.search = filters.marca;
      }
      
      const response = await quoteService.getQuotes(queryParams);
      
      if (response.success) {
        let filteredQuotes = response.data.map(quote => 
          quoteService.mapBackendToFrontend(quote)
        );
        
        // Aplicar filtros adicionales en el frontend si es necesario
        if (filters.mes && !queryParams.month) {
          filteredQuotes = filteredQuotes.filter(q => {
            const quoteMonth = new Date(q.fechaCreacion).getMonth() + 1;
            return String(quoteMonth).padStart(2, '0') === filters.mes;
          });
        }
        
        if (filters.año && !queryParams.year) {
          filteredQuotes = filteredQuotes.filter(q => {
            const quoteYear = new Date(q.fechaCreacion).getFullYear();
            return String(quoteYear) === filters.año;
          });
        }
        
        if (filters.marca && !queryParams.search) {
          filteredQuotes = filteredQuotes.filter(q =>
            q.productos?.some(p => 
              p.marca?.toLowerCase().includes(filters.marca.toLowerCase()) ||
              p.descripcion?.toLowerCase().includes(filters.marca.toLowerCase())
            )
          );
        }
        
        setQuotes(filteredQuotes);
        console.log('✅ Filtros aplicados. Resultados:', filteredQuotes.length);
      } else {
        throw new Error(response.message || 'Error al filtrar cotizaciones');
      }
    } catch (error) {
      console.error('❌ Error filtering quotes:', error);
      setError('Error al filtrar cotizaciones: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    loadQuotes();
  };

  // Estados de carga y error
  if (loading && quotes.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando historial de cotizaciones...</p>
        </div>
      </div>
    );
  }

  if (error && quotes.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Error al cargar historial
          </h3>
          <p className="text-gray-500 mb-6">{error}</p>
          <button
            onClick={handleRetry}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Intentar de nuevo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Mostrar error como banner si hay cotizaciones cargadas */}
      {error && quotes.length > 0 && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center justify-between">
          <div>
            <strong>Error:</strong> {error}
          </div>
          <button
            onClick={() => setError(null)}
            className="text-red-500 hover:text-red-700 ml-4"
          >
            ×
          </button>
        </div>
      )}

      {/* Mostrar indicador de carga si se está filtrando */}
      {loading && quotes.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg mb-6 flex items-center space-x-3">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          <span>Aplicando filtros...</span>
        </div>
      )}
      
      <HistoryViewer
        quotes={quotes}
        onEdit={handleEdit}
        onSendEmail={handleSendEmail}
        onFilter={handleFilter}
        loading={loading}
      />
    </div>
  );
};

export default HistoryPage;