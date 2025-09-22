import React from 'react';
import { CheckCircle, AlertCircle, Info } from 'lucide-react';

const UploadStatusBanner = ({ status, onDismiss }) => {
  if (!status) return null;

  const { success, message, categoriesAdded, productsLoaded } = status;

  return (
    <div className={`mb-4 p-4 rounded-lg border ${
      success 
        ? 'bg-green-50 border-green-200 text-green-800' 
        : 'bg-red-50 border-red-200 text-red-800'
    }`}>
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 mt-0.5">
          {success ? (
            <CheckCircle size={20} className="text-green-600" />
          ) : (
            <AlertCircle size={20} className="text-red-600" />
          )}
        </div>
        
        <div className="flex-1">
          <p className="font-medium">{message}</p>
          
          {success && categoriesAdded > 0 && productsLoaded > 0 && (
            <div className="mt-2 flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-1">
                <Info size={14} />
                <span>{productsLoaded} productos cargados</span>
              </div>
              <div className="flex items-center space-x-1">
                <Info size={14} />
                <span>{categoriesAdded} nuevas categorías</span>
              </div>
            </div>
          )}
        </div>
        
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
};

export default UploadStatusBanner;
