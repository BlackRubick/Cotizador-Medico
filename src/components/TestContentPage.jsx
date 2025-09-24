import React from 'react';

const TestContentPage = ({ title = "Página de Prueba" }) => {
  return (
    <div className="p-6">
      <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
        ✅ <strong>¡{title} cargada correctamente!</strong>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">{title}</h1>
        <p className="text-gray-600">Esta página está funcionando correctamente.</p>
        <p className="text-sm text-gray-500 mt-2">Timestamp: {new Date().toLocaleString()}</p>
      </div>
    </div>
  );
};

export default TestContentPage;
