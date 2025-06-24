import React from 'react';

const QuoteTerms = ({ terms, editable = false, onUpdate }) => {
  const handleTermChange = (field, value) => {
    if (editable && onUpdate) {
      onUpdate({ ...terms, [field]: value });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="font-semibold text-gray-800 mb-4">Condiciones de Venta:</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Precios:
          </label>
          {editable ? (
            <textarea
              value={terms.precios}
              onChange={(e) => handleTermChange('precios', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              rows="2"
            />
          ) : (
            <p className="text-gray-800">{terms.precios}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Moneda:
          </label>
          {editable ? (
            <input
              type="text"
              value={terms.moneda}
              onChange={(e) => handleTermChange('moneda', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            <p className="text-gray-800">{terms.moneda}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Condiciones de Pago:
          </label>
          {editable ? (
            <input
              type="text"
              value={terms.condicionesPago}
              onChange={(e) => handleTermChange('condicionesPago', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            <p className="text-gray-800">{terms.condicionesPago}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Tiempo de Entrega:
          </label>
          {editable ? (
            <input
              type="text"
              value={terms.tiempoEntrega}
              onChange={(e) => handleTermChange('tiempoEntrega', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            <p className="text-gray-800">{terms.tiempoEntrega}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Garantía:
          </label>
          {editable ? (
            <textarea
              value={terms.garantia}
              onChange={(e) => handleTermChange('garantia', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              rows="3"
            />
          ) : (
            <p className="text-gray-800 whitespace-pre-line">{terms.garantia}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Observaciones:
          </label>
          {editable ? (
            <textarea
              value={terms.observaciones}
              onChange={(e) => handleTermChange('observaciones', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              rows="2"
            />
          ) : (
            <p className="text-gray-800">{terms.observaciones}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuoteTerms;
