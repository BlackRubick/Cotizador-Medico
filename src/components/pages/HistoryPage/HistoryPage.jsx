import React from 'react';
import HistoryViewer from '../../organisms/HistoryViewer';
import { mockQuotes } from '../../../data/mockData';

const HistoryPage = () => {
  const handleEdit = (quote) => {
    console.log('Editar cotización:', quote);
    alert(`Editando cotización: ${quote.razonSocial}`);
  };

  const handleSendEmail = (quote) => {
    console.log('Enviar correo:', quote);
    alert(`Enviando correo para: ${quote.razonSocial}`);
  };

  const handleFilter = (filters) => {
    console.log('Filtros aplicados:', filters);
  };

  return (
    <HistoryViewer
      quotes={mockQuotes}
      onEdit={handleEdit}
      onSendEmail={handleSendEmail}
      onFilter={handleFilter}
    />
  );
};

export default HistoryPage;
