import React from 'react';
import Dashboard from '../../organisms/Dashboard';
import { mockQuotes } from '../../../data/mockData';

const DashboardPage = ({ onNavigate }) => {
  const handleCreateQuote = () => {
    console.log('Crear nueva cotización');
    onNavigate('cotizar');
  };

  const handleFilterQuotes = (filters) => {
    console.log('Filtrar cotizaciones:', filters);
  };

  const handleSelectQuote = (quote) => {
    console.log('Seleccionar cotización:', quote);
    // Navegar a detalles de cotización
  };

  return (
    <Dashboard
      quotes={mockQuotes}
      onCreateQuote={handleCreateQuote}
      onFilterQuotes={handleFilterQuotes}
      onSelectQuote={handleSelectQuote}
    />
  );
};

export default DashboardPage;
