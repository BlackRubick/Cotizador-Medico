import React, { useState } from 'react';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import ProductGrid from '../../molecules/ProductGrid';
import ExcelUploader from '../../molecules/ExcelUploader';
import UploadStatusBanner from '../../atoms/UploadStatusBanner';
import Button from '../../atoms/Button';
import productService from '../../../services/productService';

const ProductCatalog = ({ onCategorySelect, onBack }) => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [uploadStatus, setUploadStatus] = useState(null);

  const handleExcelDataLoaded = (apiResponse) => {
    // La respuesta ya viene de la API procesada por ExcelUploader
    console.log('Datos recibidos de la API:', apiResponse);
    
    const { created = 0, updated = 0, errors = [] } = apiResponse;
    
    // Crear mensaje de estado basado en la respuesta de la API
    let message;
    let success = true;
    
    if (errors.length === 0) {
      message = `✅ Catálogo actualizado exitosamente: ${created} productos creados, ${updated} productos actualizados`;
    } else if (created > 0 || updated > 0) {
      message = `⚠️ Catálogo parcialmente actualizado: ${created} productos creados, ${updated} productos actualizados, ${errors.length} errores`;
      success = false; // Marcar como no completamente exitoso
    } else {
      message = `❌ Error en la carga: ${errors.length} errores encontrados`;
      success = false;
    }
    
    setUploadStatus({
      success,
      message,
      details: { created, updated, errors }
    });
    
    if (success || created > 0 || updated > 0) {
      // Forzar re-render del ProductGrid solo si hubo cambios
      setRefreshKey(prev => prev + 1);
    }
  };

  const handleUploadError = (error) => {
    console.error('Error en la carga del Excel:', error);
    setUploadStatus({
      success: false,
      message: `❌ Error al cargar archivo: ${error}`,
      details: { originalError: error }
    });
  };

  const handleReset = () => {
    productService.resetToDefaults();
    setRefreshKey(prev => prev + 1);
    setUploadStatus({
      success: true,
      message: 'Catálogo restablecido a valores originales'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {onBack && (
            <Button 
              variant="ghost" 
              onClick={onBack}
              className="flex items-center space-x-2"
            >
              <ArrowLeft size={20} />
              <span>Volver</span>
            </Button>
          )}
          <h1 className="text-2xl font-bold text-gray-800">Catálogo de Productos</h1>
        </div>
        <div className="flex items-center space-x-3">
          {/* Excel Uploader: botón para cargar catálogo desde Excel */}
          <ExcelUploader
            onDataLoaded={handleExcelDataLoaded}
            onError={handleUploadError}
          />

          {/* Botón para restablecer catálogo */}
          <Button
            variant="outline"
            onClick={handleReset}
            className="flex items-center space-x-2"
          >
            <RefreshCw size={16} />
            <span>Restablecer catálogo</span>
          </Button>
        </div>
        

      </div>

      {/* Banner de estado de carga */}
      <UploadStatusBanner 
        status={uploadStatus}
        onDismiss={() => setUploadStatus(null)}
      />


      
      <ProductGrid 
        key={refreshKey}
        onCategorySelect={onCategorySelect}
        forceReload={refreshKey}
      />
    </div>
  );
};

export default ProductCatalog;
