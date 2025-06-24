import React, { useState } from 'react';
import { Plus, Filter, Search } from 'lucide-react';
import Card from '../../atoms/Card';
import Button from '../../atoms/Button';
import Input from '../../atoms/Input';
import QuoteCard from '../../molecules/QuoteCard';
import FilterPanel from '../../molecules/FilterPanel';

const Dashboard = ({ quotes, onCreateQuote, onFilterQuotes, onSelectQuote }) => {
  const [showFilter, setShowFilter] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredQuotes = quotes.filter(quote =>
    quote.razonSocial.toLowerCase().includes(searchTerm.toLowerCase()) ||
    quote.cliente?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const recentQuotes = filteredQuotes.slice(0, 6);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <Button onClick={onCreateQuote} className="flex items-center space-x-2">
          <Plus size={20} />
          <span>Nueva Cotización</span>
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <Input
              placeholder="Buscar cotizaciones..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Button
          variant="secondary"
          onClick={() => setShowFilter(!showFilter)}
          className="flex items-center space-x-2"
        >
          <Filter size={20} />
          <span>Filtros</span>
        </Button>
      </div>

      {/* Filter Panel */}
      {showFilter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="w-full max-w-md">
            <FilterPanel
              onFilter={onFilterQuotes}
              onClose={() => setShowFilter(false)}
            />
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-600">Total Cotizaciones</h3>
            <p className="text-3xl font-bold text-blue-600">{quotes.length}</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-600">Confirmadas</h3>
            <p className="text-3xl font-bold text-green-600">
              {quotes.filter(q => q.estado === 'confirmado').length}
            </p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-600">Pendientes</h3>
            <p className="text-3xl font-bold text-yellow-600">
              {quotes.filter(q => q.estado === 'pendiente').length}
            </p>
          </div>
        </Card>
      </div>

      {/* Recent Quotes */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Cotizaciones Recientes</h2>
        {recentQuotes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentQuotes.map(quote => (
              <QuoteCard
                key={quote.id}
                quote={quote}
                onClick={() => onSelectQuote(quote)}
              />
            ))}
          </div>
        ) : (
          <Card>
            <div className="text-center py-8 text-gray-500">
              <p>No hay cotizaciones disponibles</p>
              <Button onClick={onCreateQuote} className="mt-4">
                Crear primera cotización
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
