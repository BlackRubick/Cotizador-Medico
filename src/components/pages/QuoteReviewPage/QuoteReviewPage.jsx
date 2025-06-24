import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import QuoteSelector from '../../organisms/QuoteSelector';
import QuoteReviewer from '../../organisms/QuoteReviewer';
import { mockQuotesForReview } from '../../../data/mockQuoteData';

const QuoteReviewPage = () => {
  const navigate = useNavigate();
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [quotes, setQuotes] = useState(mockQuotesForReview);

  const handleSelectQuote = (quote) => {
    setSelectedQuote(quote);
  };

  const handleBack = () => {
    setSelectedQuote(null);
  };

  const handleSave = (updatedQuote) => {
    setQuotes(prev => 
      prev.map(quote => 
        quote.id === updatedQuote.id ? updatedQuote : quote
      )
    );
    setSelectedQuote(updatedQuote);
    console.log('Cotización actualizada:', updatedQuote);
    alert('Cotización guardada exitosamente');
  };

  const handleSend = (quote) => {
    // Simular envío de cotización
    console.log('Enviando cotización:', quote);
    
    // Actualizar estado a "enviado"
    const updatedQuote = { ...quote, estado: 'enviado' };
    handleSave(updatedQuote);
    
    alert(`Cotización enviada a ${quote.correo}`);
  };

  if (selectedQuote) {
    return (
      <QuoteReviewer
        quote={selectedQuote}
        onBack={handleBack}
        onSave={handleSave}
        onSend={handleSend}
      />
    );
  }

  return (
    <QuoteSelector
      quotes={quotes}
      onSelectQuote={handleSelectQuote}
    />
  );
};

export default QuoteReviewPage;
