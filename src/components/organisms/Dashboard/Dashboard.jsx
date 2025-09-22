import React, { useState } from 'react';
import { Plus, Filter, Search, TrendingUp, CheckCircle, Clock, FileText } from 'lucide-react';
import Card from '../../atoms/Card';
import Button from '../../atoms/Button';
import Input from '../../atoms/Input';
import QuoteCard from '../../molecules/QuoteCard';
import FilterPanel from '../../molecules/FilterPanel';

const Dashboard = ({ quotes, loading = false, error = null, onCreateQuote, onFilterQuotes, onSelectQuote, onRefresh }) => {
  const [showFilter, setShowFilter] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Función para cerrar el modal
  const closeFilter = () => setShowFilter(false);

  // Manejar tecla Escape
  React.useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && showFilter) {
        closeFilter();
      }
    };

    if (showFilter) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden'; // Prevenir scroll del body
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [showFilter]);

  const filteredQuotes = quotes.filter(quote => {
    const searchLower = searchTerm.toLowerCase();
    return (
      quote.razonSocial?.toLowerCase().includes(searchLower) ||
      quote.cliente?.toLowerCase().includes(searchLower) ||
      quote.clientInfoName?.toLowerCase().includes(searchLower) ||
      quote.folio?.toLowerCase().includes(searchLower) ||
      quote.encargado?.toLowerCase().includes(searchLower) ||
      quote.contacto?.toLowerCase().includes(searchLower)
    );
  });

  const recentQuotes = filteredQuotes.slice(0, 6);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-6 lg:space-y-0">
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Dashboard
              </h1>
              <p className="text-gray-600 text-lg">Gestiona tus cotizaciones de manera eficiente</p>
            </div>
            <Button 
              onClick={onCreateQuote} 
              className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 px-6 py-3 rounded-xl"
            >
              <Plus size={20} />
              <span className="font-semibold">Nueva Cotización</span>
            </Button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <Input
                  placeholder="Buscar por razón social o cliente..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 py-3 rounded-xl border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                />
              </div>
            </div>
            <Button
              variant="secondary"
              onClick={() => setShowFilter(!showFilter)}
              className="flex items-center space-x-2 bg-gray-50 hover:bg-gray-100 border-gray-200 rounded-xl px-6 py-3 transition-all duration-200"
            >
              <Filter size={20} />
              <span>Filtros</span>
            </Button>
          </div>
        </div>

        {/* Filter Panel */}
        {showFilter && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={closeFilter}
          >
            <div 
              className="w-full max-w-md transform scale-95 animate-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              <FilterPanel
                onFilter={onFilterQuotes}
                onClose={closeFilter}
              />
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl shadow-sm border border-blue-200 p-6 hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-blue-600 uppercase tracking-wide">Total Cotizaciones</h3>
                <p className="text-3xl font-bold text-blue-800 mt-2">
                  {loading ? (
                    <div className="animate-pulse bg-blue-200 h-8 w-16 rounded"></div>
                  ) : (
                    quotes.length
                  )}
                </p>
                {quotes.some(q => q.estadoLocal) && (
                  <p className="text-xs text-blue-600 mt-1">
                    {quotes.filter(q => q.estadoLocal).length} locales
                  </p>
                )}
              </div>
              <div className="bg-blue-200 rounded-full p-3">
                <FileText className="text-blue-600" size={24} />
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl shadow-sm border border-green-200 p-6 hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-green-600 uppercase tracking-wide">Confirmadas</h3>
                <p className="text-3xl font-bold text-green-800 mt-2">
                  {loading ? (
                    <div className="animate-pulse bg-green-200 h-8 w-16 rounded"></div>
                  ) : (
                    quotes.filter(q => 
                      q.estado?.toLowerCase() === 'confirmado' || 
                      q.estado?.toLowerCase() === 'confirmed' ||
                      q.status?.toLowerCase() === 'confirmed'
                    ).length
                  )}
                </p>
              </div>
              <div className="bg-green-200 rounded-full p-3">
                <CheckCircle className="text-green-600" size={24} />
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl shadow-sm border border-yellow-200 p-6 hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-yellow-600 uppercase tracking-wide">Pendientes</h3>
                <p className="text-3xl font-bold text-yellow-800 mt-2">
                  {loading ? (
                    <div className="animate-pulse bg-yellow-200 h-8 w-16 rounded"></div>
                  ) : (
                    quotes.filter(q => 
                      q.estado?.toLowerCase() === 'pendiente' || 
                      q.estado?.toLowerCase() === 'pending' ||
                      q.status?.toLowerCase() === 'pending'
                    ).length
                  )}
                </p>
              </div>
              <div className="bg-yellow-200 rounded-full p-3">
                <Clock className="text-yellow-600" size={24} />
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl shadow-sm border border-purple-200 p-6 hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-purple-600 uppercase tracking-wide">Valor Total</h3>
                <p className="text-3xl font-bold text-purple-800 mt-2">
                  {loading ? (
                    <div className="animate-pulse bg-purple-200 h-8 w-24 rounded"></div>
                  ) : (
                    `$${quotes.reduce((total, quote) => total + (parseFloat(quote.total) || 0), 0).toLocaleString('es-MX')}`
                  )}
                </p>
              </div>
              <div className="bg-purple-200 rounded-full p-3">
                <TrendingUp className="text-purple-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Quotes */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <h2 className="text-2xl font-bold text-gray-800">Cotizaciones Recientes</h2>
              {loading && (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
              )}
            </div>


          </div>
          
          {error ? (
            <div className="text-center py-16">
              <div className="bg-red-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                <FileText className="text-red-400" size={40} />
              </div>
              <h3 className="text-xl font-semibold text-red-700 mb-2">Error al cargar cotizaciones</h3>
              <p className="text-red-500 mb-6 max-w-md mx-auto">{error}</p>
              <Button 
                onClick={onRefresh} 
                className="bg-red-600 hover:bg-red-700 px-8 py-3 rounded-xl"
              >
                Reintentar
              </Button>
            </div>
          ) : loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="bg-gray-100 rounded-xl p-6 animate-pulse">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-gray-300 h-6 w-32 rounded"></div>
                    <div className="bg-gray-300 h-6 w-20 rounded"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="bg-gray-300 h-4 w-full rounded"></div>
                    <div className="bg-gray-300 h-4 w-3/4 rounded"></div>
                  </div>
                  <div className="mt-4 bg-gray-300 h-8 w-24 rounded"></div>
                </div>
              ))}
            </div>
          ) : recentQuotes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {recentQuotes.map(quote => (
                <div key={quote.id || quote.folio} className="transform hover:scale-105 transition-all duration-200">
                  <QuoteCard
                    quote={quote}
                    onClick={() => onSelectQuote(quote)}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                <FileText className="text-gray-400" size={40} />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No hay cotizaciones disponibles</h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                Comienza creando tu primera cotización para gestionar tus propuestas comerciales de manera eficiente.
              </p>
              <Button 
                onClick={onCreateQuote} 
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 px-8 py-3 rounded-xl"
              >
                <Plus size={20} className="mr-2" />
                Crear primera cotización
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
