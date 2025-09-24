import React, { useState, useEffect } from 'react';
import { Filter, Download, Mail, Trash2 } from 'lucide-react';
import Card from '../../atoms/Card';
import Button from '../../atoms/Button';
import HistoryTable from '../../molecules/HistoryTable';
import FilterPanel from '../../molecules/FilterPanel';
import localStorageService from '../../../services/localStorageService';

const HistoryViewer = ({ quotes, onEdit, onSendEmail, onDelete, onFilter, onRefresh }) => {
  const [showFilter, setShowFilter] = useState(false);
  const [filteredQuotes, setFilteredQuotes] = useState(quotes);

  // Actualizar filteredQuotes cuando cambien las quotes
  useEffect(() => {
    setFilteredQuotes(quotes);
  }, [quotes]);

  const handleClearLocalQuotes = () => {
    const localQuotesCount = quotes.filter(q => q.estadoLocal).length;
    
    if (localQuotesCount === 0) {
      alert('No hay cotizaciones locales para eliminar.');
      return;
    }

    const confirmClear = window.confirm(
      `¿Estás seguro de que deseas eliminar las ${localQuotesCount} cotizaciones guardadas localmente?\n\nEsta acción no se puede deshacer.`
    );

    if (confirmClear) {
      const result = localStorageService.clearAllLocalQuotes();
      
      if (result.success) {
        alert(`✅ Se eliminaron ${localQuotesCount} cotizaciones locales exitosamente.`);
        // Recargar el historial
        if (onRefresh) {
          onRefresh();
        }
      } else {
        alert('❌ Error al eliminar cotizaciones locales: ' + result.error);
      }
    }
  };

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
        <div className="space-y-1">
          <p className="text-gray-600">
            Mostrando {filteredQuotes.length} de {quotes.length} cotizaciones
          </p>
          {quotes.some(q => q.estadoLocal) && (
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <p className="text-sm text-purple-600">
                {quotes.filter(q => q.estadoLocal).length} cotizaciones guardadas localmente
              </p>
            </div>
          )}
        </div>
        <div className="flex space-x-2">

          {quotes.some(q => q.estadoLocal) && (
            <div className="flex space-x-2">
              <Button
                onClick={() => {
                  const stats = quotes.reduce((acc, q) => {
                    if (q.estadoLocal) acc.local++;
                    else acc.servidor++;
                    return acc;
                  }, { local: 0, servidor: 0 });
                  
                  alert(`📊 Estadísticas del historial:
• Cotizaciones locales: ${stats.local}
• Cotizaciones del servidor: ${stats.servidor}
• Total: ${quotes.length}`);
                }}
                variant="secondary"
                className="flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span>Estadísticas</span>
              </Button>
              <Button
                onClick={handleClearLocalQuotes}
                variant="secondary"
                className="flex items-center space-x-2 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 size={16} />
                <span>Limpiar Locales</span>
              </Button>
            </div>
          )}
        </div>
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
            onDelete={onDelete}
          />
        </div>
      </Card>
    </div>
  );
};

export default HistoryViewer;
