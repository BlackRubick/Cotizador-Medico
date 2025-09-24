// src/components/pages/HistoryPage/HistoryPage.jsx - ACTUALIZADO CON API REAL Y ALMACENAMIENTO LOCAL
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HistoryViewer from '../../organisms/HistoryViewer';
import quoteService from '../../services/quoteService';
import localStorageService from '../../services/locastorageService';

const HistoryPage = () => {
  const navigate = useNavigate();
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
          limit: 100,
        });
        
        if (response.success) {
          // Mapear datos del backend al formato del frontend
          const serverQuotes = response.data.map(quote => 
            quoteService.mapBackendToFrontend(quote)
          );
          
          // Combinar cotizaciones locales y del servidor
          // Las locales van primero para mostrar las más recientes
          mappedQuotes = [...mappedQuotes, ...serverQuotes];
          
          console.log('✅ Cotizaciones del servidor cargadas:', serverQuotes.length);
        } else {
          throw new Error(response.message || 'Error al cargar cotizaciones del servidor');
        }
      } catch (serverError) {
        console.warn('⚠️ Error cargando cotizaciones del servidor:', serverError.message);
        
        // Si solo tenemos cotizaciones locales, mostrar advertencia pero continuar
        if (mappedQuotes.length > 0) {
          setError(`Mostrando solo cotizaciones locales. Error del servidor: ${serverError.message}`);
        } else {
          // Si no hay cotizaciones locales y falla el servidor
          if (serverError.message.includes('unauthorized') || serverError.message.includes('token')) {
            console.log('Token inválido, redirigir al login');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
            return;
          }
          throw serverError;
        }
      }
      
      // 3. Ordenar por fecha de creación (más recientes primero)
      mappedQuotes.sort((a, b) => {
        const dateA = new Date(a.fechaCreacion || a.fechaEnvio || 0);
        const dateB = new Date(b.fechaCreacion || b.fechaEnvio || 0);
        return dateB - dateA;
      });
      
      setQuotes(mappedQuotes);
      console.log('✅ Total de cotizaciones cargadas:', mappedQuotes.length);
      
    } catch (err) {
      console.error('❌ Error loading quotes:', err);
      setError(err.message || 'Error al cargar las cotizaciones');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (quote) => {
    try {
      console.log('✏️ handleEdit llamado desde HistoryPage:', quote);
      
      const confirmEdit = window.confirm(
        `¿Deseas editar la cotización ${quote.folio}?\n\nTe llevará directamente al generador de cotizaciones con los datos cargados para edición.`
      );
      
      if (confirmEdit) {
        try {
          // Preparar datos completos para la edición
          const productos = Array.isArray(quote.productos) ? quote.productos : 
                          Array.isArray(quote.products) ? quote.products : [];
          
          console.log('📊 Productos de la cotización para edición:', productos);
          
          const editData = {
            isEditing: true,
            quoteId: quote.id,
            folio: quote.folio,
            // Información del cliente
            clientInfo: {
              clientName: quote.razonSocial || quote.clientInfoName || quote.cliente,
              clientContact: quote.encargado || quote.clientInfoContact || quote.contacto,
              email: quote.correo || quote.clientInfoEmail || quote.email,
              phone: quote.numero || quote.clientInfoPhone || quote.telefono || quote.phone,
              clientAddress: quote.direccion || quote.clientInfoAddress,
              clientPosition: quote.puesto || quote.clientInfoPosition
            },
            // Productos de la cotización (mapear al formato del carrito)
            cartItems: productos.map(p => ({
              id: p.id || p.productId || Math.random().toString(36),
              name: p.name || p.descripcion || p.equipo || 'Producto sin nombre',
              description: p.descripcion || p.name || p.description || 'Sin descripción',
              quantity: parseInt(p.quantity || p.cantidad || 1),
              basePrice: parseFloat(p.basePrice || p.unitPrice || p.precio || 0),
              code: p.code || p.codigo || 'SIN_CODIGO',
              brand: p.brand || p.marca || 'Sin marca',
              // Campos adicionales que puedan existir
              category: p.category || p.categoria,
              compatibility: p.compatibility || p.compatibilidad
            })),
            // Términos y condiciones
            terms: quote.condiciones || quote.terms || {},
            // Información de la empresa vendedora
            sellerCompany: quote.empresa || 'CONDUIT LIFE',
            sellerCompanyId: quote.sellerCompanyId || 'conduit-life'
          };
          
          console.log('💾 Guardando datos de edición en localStorage:', editData);
          localStorage.setItem('editingQuote', JSON.stringify(editData));
          
          // Verificar que se guardó correctamente
          const savedData = localStorage.getItem('editingQuote');
          console.log('✅ Datos guardados verificados:', !!savedData, savedData ? 'Tamaño:' + savedData.length : '');
          console.log('📋 Vista previa de datos guardados:', savedData ? JSON.parse(savedData) : null);
          
          // Mostrar mensaje de confirmación
          console.log(`✅ Datos preparados para edición:
• Folio: ${editData.folio}
• Cliente: ${editData.clientInfo.clientName}
• Productos: ${editData.cartItems.length}
• Navegando a: /cotizar/generar`);
          
          // Navegar directamente al QuoteBuilder donde se pueden editar las cotizaciones
          navigate('/cotizar/generar');
          
        } catch (editError) {
          console.error('❌ Error preparando edición:', editError);
          alert('Error al preparar la edición: ' + editError.message);
        }
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

  const handleDelete = async (quote) => {
    try {
      console.log('🗑️ handleDelete llamado desde HistoryPage:', quote);
      
      const confirmDelete = window.confirm(
        `¿Estás seguro de que deseas eliminar la cotización ${quote.folio}?\n\nEsta acción no se puede deshacer.`
      );
      
      if (confirmDelete) {
        setLoading(true);
        
        try {
          // Intentar eliminar del servidor si tiene ID del servidor
          if (quote.id && !quote.id.toString().startsWith('local-')) {
            const response = await quoteService.deleteQuote(quote.id);
            
            if (!response.success) {
              throw new Error(response.message || 'Error al eliminar del servidor');
            }
            
            console.log('✅ Cotización eliminada del servidor');
          } else {
            // Es una cotización local, eliminarla del localStorage
            localStorageService.deleteLocalQuote(quote.id);
            console.log('✅ Cotización local eliminada');
          }
          
          // Actualizar la lista local
          setQuotes(prev => prev.filter(q => q.id !== quote.id));
          
          alert(`✅ Cotización ${quote.folio} eliminada exitosamente`);
          
        } catch (deleteError) {
          console.error('❌ Error eliminando cotización:', deleteError);
          
          // Si falla eliminar del servidor pero es una cotización que existe localmente también
          if (quote.id.toString().startsWith('local-')) {
            localStorageService.deleteLocalQuote(quote.id);
            setQuotes(prev => prev.filter(q => q.id !== quote.id));
            alert(`⚠️ Cotización eliminada localmente. Error del servidor: ${deleteError.message}`);
          } else {
            throw deleteError;
          }
        }
      }
    } catch (error) {
      console.error('❌ Error deleting quote:', error);
      alert('Error al eliminar cotización: ' + error.message);
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
        onDelete={handleDelete}
        onSendEmail={handleSendEmail}
        onFilter={handleFilter}
        loading={loading}
        onRefresh={loadQuotes}
      />
    </div>
  );
};

export default HistoryPage;