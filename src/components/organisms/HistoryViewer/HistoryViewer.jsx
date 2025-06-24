import React, { useState } from 'react';
import { Filter, Download, Mail } from 'lucide-react';
import Card from '../../atoms/Card';
import Button from '../../atoms/Button';
import HistoryTable from '../../molecules/HistoryTable';
import FilterPanel from '../../molecules/FilterPanel';

const HistoryViewer = ({ quotes, onEdit, onSendEmail, onFilter }) => {
  const [showFilter, setShowFilter] = useState(false);
  const [filteredQuotes, setFilteredQuotes] = useState(quotes);

  const handleFilter = (filters) => {
    let filtered = quotes;

    if (filters.estado) {
      filtered = filtered.filter(q => q.estado === filters.estado);
    }
    if (filters.mes) {
      filtered = filtered.filter(q => q.fecha.includes(`-${filters.mes}-`));
    }
    if (filters.año) {
      filtered = filtered.filter(q => q.fecha.includes(filters.año));
    }
    if (filters.marca) {
      filtered = filtered.filter(q => 
        q.descripcion?.toLowerCase().includes(filters.marca.toLowerCase())
      );
    }

    setFilteredQuotes(filtered);
    onFilter && onFilter(filters);
  };

  const handleExport = () => {
    // Simular descarga de CSV
    console.log('Exportando historial...');
    alert('Descarga iniciada');
  };

  const handleSendAutoEmail = () => {
    console.log('Enviando correos automáticos...');
    alert('Se enviarán correos automáticos a los clientes');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <h1 className="text-2xl font-bold text-gray-800">Historial de Cotizaciones</h1>
        <div className="flex space-x-2">
          <Button
            variant="secondary"
            onClick={() => setShowFilter(!showFilter)}
            className="flex items-center space-x-2"
          >
            <Filter size={20} />
            <span>Filtrar</span>
          </Button>
          <Button
            variant="secondary"
            onClick={handleExport}
            className="flex items-center space-x-2"
          >
            <Download size={20} />
            <span>Exportar</span>
          </Button>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="w-full max-w-md">
            <FilterPanel
              onFilter={handleFilter}
              onClose={() => setShowFilter(false)}
            />
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-between items-center">
        <p className="text-gray-600">
          Mostrando {filteredQuotes.length} de {quotes.length} cotizaciones
        </p>
        <Button
          onClick={handleSendAutoEmail}
          className="flex items-center space-x-2 bg-green-600 hover:bg-green-700"
        >
          <Mail size={20} />
          <span>Envío Automático</span>
        </Button>
      </div>

      {/* Table */}
      <Card>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">POSIBILIDAD CAMBIO COTIZACIÓN,</h3>
          </div>
          <p className="text-sm text-gray-600">SE ENVIARÍA EN AUTOMÁTICO AL CLIENTE</p>
          <HistoryTable
            quotes={filteredQuotes}
            onEdit={onEdit}
            onSendEmail={onSendEmail}
          />
        </div>
      </Card>
    </div>
  );
};

export default HistoryViewer;
