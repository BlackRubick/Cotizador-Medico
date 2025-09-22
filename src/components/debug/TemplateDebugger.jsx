// src/components/debug/TemplateDebugger.jsx
import React, { useState, useEffect } from 'react';

const TemplateDebugger = () => {
  const [results, setResults] = useState({});

  const templates = [
    { id: 'conduit-life', file: 'CONDUIT-LIFE.JPEG' },
    { id: 'escala-biomedica', file: 'ESCALA-BIOMEDICA.JPEG' },
    { id: 'ingenieria-clinica', file: 'INGENIERIA-CLINICA-DISEÑO.JPEG' },
    { id: 'biosystems-hls', file: 'Biosystems-HLS.JPEG' }
  ];

  const extensions = ['JPEG', 'jpeg', 'JPG', 'jpg', 'PNG', 'png'];

  useEffect(() => {
    checkTemplates();
  }, []);

  const checkTemplates = async () => {
    const newResults = {};

    for (const template of templates) {
      newResults[template.id] = {};
      
      for (const ext of extensions) {
        const fileName = template.file.replace(/\.(jpeg|jpg|png)$/i, `.${ext}`);
        const path = `/plantillas/${fileName}`;
        
        try {
          const result = await checkImageExists(path);
          newResults[template.id][ext] = result;
        } catch (error) {
          newResults[template.id][ext] = { exists: false, error: error.message };
        }
      }
    }

    setResults(newResults);
  };

  const checkImageExists = (src) => {
    return new Promise((resolve) => {
      const img = new Image();
      
      img.onload = () => {
        resolve({ 
          exists: true, 
          width: img.naturalWidth, 
          height: img.naturalHeight,
          src 
        });
      };
      
      img.onerror = () => {
        resolve({ exists: false, src });
      };
      
      img.src = src;
      
      setTimeout(() => {
        resolve({ exists: false, timeout: true, src });
      }, 3000);
    });
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">🔍 Debug de Plantillas PDF</h2>
      
      {Object.keys(results).length === 0 ? (
        <p>Verificando plantillas...</p>
      ) : (
        <div className="space-y-4">
          {templates.map(template => (
            <div key={template.id} className="border rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-2">{template.id.toUpperCase()}</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {extensions.map(ext => {
                  const result = results[template.id]?.[ext];
                  if (!result) return null;
                  
                  return (
                    <div key={ext} className={`p-2 rounded text-sm ${
                      result.exists ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      <div className="font-medium">.{ext}</div>
                      {result.exists ? (
                        <div>
                          ✅ {result.width}x{result.height}
                          <img 
                            src={result.src} 
                            alt={`${template.id}.${ext}`}
                            className="w-12 h-8 object-cover mt-1 rounded"
                          />
                        </div>
                      ) : (
                        <div>❌ No existe</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
      
      <button 
        onClick={checkTemplates}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        🔄 Verificar de nuevo
      </button>
    </div>
  );
};

export default TemplateDebugger;