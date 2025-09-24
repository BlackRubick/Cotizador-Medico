import React from 'react';

const TestContentPage = ({ title = "Página de Prueba" }) => {
  console.log('🎯 TestContentPage rendered:', title);
  
  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="bg-green-500 text-white px-6 py-4 rounded-t-lg font-bold text-xl">
          ✅ PÁGINA FUNCIONANDO: {title}
        </div>
        
        <div className="bg-white rounded-b-lg shadow-xl p-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-6">{title}</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-100 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">Estado:</h3>
              <p className="text-blue-700">✅ Página cargada correctamente</p>
              <p className="text-blue-700">✅ Rutas funcionando</p>
              <p className="text-blue-700">✅ Navegación activa</p>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">Información:</h3>
              <p className="text-gray-600">Página: {title}</p>
              <p className="text-gray-600">Timestamp: {new Date().toLocaleString()}</p>
              <p className="text-gray-600">URL: {window.location.pathname}</p>
            </div>
          </div>
          
          <div className="mt-8 p-6 bg-yellow-50 border-l-4 border-yellow-400">
            <h3 className="font-semibold text-yellow-800 mb-2">🎉 ¡Sistema de Roles Funcionando!</h3>
            <p className="text-yellow-700">
              Si ves esta página, significa que el sistema de navegación y roles está funcionando correctamente.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestContentPage;
