import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import SearchBar from '../../atoms/SearchBar';
import QuotePreview from '../../atoms/QuotePreview';
import QuoteStatus from '../../atoms/QuoteStatus';
import Button from '../../atoms/Button';

const QuoteSelector = ({ quotes, onSelectQuote }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  const filteredQuotes = quotes.filter(quote => {
    const matchesSearch = 
      quote.razonSocial.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.folio.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.encargado.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !selectedStatus || quote.estado === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

  const statuses = [...new Set(quotes.map(q => q.estado))];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <h1 className="text-2xl font-bold text-gray-800">Revisar Cotizaciones</h1>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="flex-1">
          <SearchBar
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por folio, razón social o encargado..."
          />
        </div>
        
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Todos los estados</option>
          {statuses.map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
      </div>

      {/* Results count */}
      <div className="text-sm text-gray-600">
        Mostrando {filteredQuotes.length} de {quotes.length} cotizaciones
      </div>

      {/* Quotes Grid */}
      {filteredQuotes.length === 0 ? (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              {searchTerm || selectedStatus ? 'No se encontraron cotizaciones' : 'No hay cotizaciones disponibles'}
            </h3>
            <p className="text-gray-500">
              {searchTerm || selectedStatus 
                ? 'Intenta con otros términos de búsqueda'
                : 'Las cotizaciones aparecerán aquí cuando estén disponibles'
              }
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredQuotes.map(quote => (
            <QuotePreview
              key={quote.id}
              quote={quote}
              onClick={() => onSelectQuote(quote)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default QuoteSelector;
