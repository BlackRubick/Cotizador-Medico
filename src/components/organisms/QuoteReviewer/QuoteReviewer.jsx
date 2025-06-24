import React, { useState } from 'react';
import { ArrowLeft, Edit2, Save, X, Send, Download, Printer } from 'lucide-react';
import Button from '../../atoms/Button';
import QuoteHeader from '../../molecules/QuoteHeader';
import ProductsTable from '../../molecules/ProductsTable';
import QuoteTerms from '../../molecules/QuoteTerms';

const QuoteReviewer = ({ quote, onBack, onSave, onSend }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedQuote, setEditedQuote] = useState(quote);

  const handleSave = () => {
    onSave(editedQuote);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedQuote(quote);
    setIsEditing(false);
  };

  const handleSend = () => {
    if (window.confirm('¿Enviar cotización al cliente por correo electrónico?')) {
      onSend(editedQuote);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    alert('Funcionalidad de descarga no implementada');
  };

  const handleQuoteUpdate = (updatedQuote) => {
    setEditedQuote(updatedQuote);
  };

  const handleProductsChange = (updatedProducts) => {
    setEditedQuote({
      ...editedQuote,
      productos: updatedProducts
    });
  };

  const handleTermsUpdate = (updatedTerms) => {
    setEditedQuote({
      ...editedQuote,
      condiciones: updatedTerms
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="flex items-center space-x-2"
          >
            <ArrowLeft size={20} />
            <span>Volver</span>
          </Button>
          <h1 className="text-2xl font-bold text-gray-800">Revisar Cotización</h1>
        </div>
        
        <div className="flex space-x-2">
          {isEditing ? (
            <>
              <Button
                onClick={handleSave}
                className="flex items-center space-x-2"
              >
                <Save size={16} />
                <span>Guardar</span>
              </Button>
              <Button
                variant="secondary"
                onClick={handleCancel}
                className="flex items-center space-x-2"
              >
                <X size={16} />
                <span>Cancelar</span>
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="secondary"
                onClick={() => setIsEditing(true)}
                className="flex items-center space-x-2"
              >
                <Edit2 size={16} />
                <span>Editar</span>
              </Button>
              <Button
                variant="secondary"
                onClick={handlePrint}
                className="flex items-center space-x-2"
              >
                <Printer size={16} />
                <span>Imprimir</span>
              </Button>
              <Button
                variant="secondary"
                onClick={handleDownload}
                className="flex items-center space-x-2"
              >
                <Download size={16} />
                <span>Descargar</span>
              </Button>
              <Button
                onClick={handleSend}
                className="flex items-center space-x-2 bg-green-600 hover:bg-green-700"
              >
                <Send size={16} />
                <span>Enviar</span>
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Quote Content */}
      <div className="space-y-6">
        <QuoteHeader
          quote={editedQuote}
          editable={isEditing}
          onUpdate={handleQuoteUpdate}
        />

        <ProductsTable
          products={editedQuote.productos || []}
          editable={isEditing}
          onProductsChange={handleProductsChange}
        />

        <QuoteTerms
          terms={editedQuote.condiciones || {}}
          editable={isEditing}
          onUpdate={handleTermsUpdate}
        />

        {/* Company Signature */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="text-center border-t pt-6">
            <p className="text-sm text-gray-600 mb-2">Saludos cordiales</p>
            <div className="mt-8 border-t border-gray-300 pt-4">
              <p className="font-medium">Priscila Ramírez</p>
              <p className="text-sm text-gray-600">Coordinadora Comunicación</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Action Button */}
      {!isEditing && (
        <div className="fixed bottom-6 right-6 sm:hidden">
          <Button
            onClick={handleSend}
            className="rounded-full w-14 h-14 flex items-center justify-center bg-green-600 hover:bg-green-700 shadow-lg"
          >
            <Send size={20} />
          </Button>
        </div>
      )}
    </div>
  );
};

export default QuoteReviewer;
