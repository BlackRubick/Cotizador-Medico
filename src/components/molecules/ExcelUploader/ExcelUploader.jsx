import React, { useState, useRef } from 'react';
import { Upload, FileSpreadsheet, CheckCircle, AlertCircle } from 'lucide-react';
import Button from '../../atoms/Button';
import ExcelTemplateDownloader from '../../atoms/ExcelTemplateDownloader';
import { apiRequest } from '../../config/api';

const ExcelUploader = ({ onDataLoaded, onError }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validar que sea un archivo Excel
    if (!file.name.match(/\.(xlsx|xls)$/)) {
      setUploadStatus({ type: 'error', message: 'Por favor selecciona un archivo Excel (.xlsx o .xls)' });
      onError && onError('Formato de archivo no válido');
      return;
    }

    setIsLoading(true);
    setUploadStatus(null);

    try {
      // Importar XLSX dinámicamente
      const XLSX = await import('xlsx');
      
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          
          // Leer la primera hoja
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          
          // Convertir a JSON
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          
          if (jsonData.length === 0) {
            throw new Error('El archivo está vacío');
          }

          // Procesar los datos
          const processedData = processExcelData(jsonData);
          
          // Enviar datos a la API
          await sendDataToAPI(processedData);
          
        } catch (error) {
          console.error('Error processing Excel file:', error);
          setUploadStatus({ type: 'error', message: 'Error al procesar el archivo Excel' });
          onError && onError(error.message);
        } finally {
          setIsLoading(false);
        }
      };

      reader.onerror = () => {
        setUploadStatus({ type: 'error', message: 'Error al leer el archivo' });
        setIsLoading(false);
        onError && onError('Error al leer el archivo');
      };

      reader.readAsArrayBuffer(file);
      
    } catch (error) {
      console.error('Error importing XLSX:', error);
      setUploadStatus({ type: 'error', message: 'Error: Librería XLSX no disponible. Ejecuta: npm install xlsx' });
      setIsLoading(false);
      onError && onError('Librería XLSX no instalada');
    }
  };

  const processExcelData = (rawData) => {
    if (rawData.length < 2) {
      throw new Error('El archivo debe tener al menos una fila de encabezados y una fila de datos');
    }

    const headers = rawData[0];
    const rows = rawData.slice(1);

    // Mapear índices de columnas para el formato específico del usuario
    const columnMap = {
      // Columnas principales
      categoria: findColumnIndex(headers, ['CATEGORIA', 'categoria', 'Categoria']),
      especialidad: findColumnIndex(headers, ['ESPECIALIDAD', 'especialidad', 'Especialidad']),
      clasificacion: findColumnIndex(headers, ['CLASIFICACION', 'clasificacion', 'Clasificacion']),
      para: findColumnIndex(headers, ['PARA', 'para', 'Para']),
      marca: findColumnIndex(headers, ['MARCA', 'marca', 'Marca']),
      modelo: findColumnIndex(headers, ['MODELO', 'modelo', 'Modelo']),
      descripcion: findColumnIndex(headers, ['DESCRIPCIÓN', 'DESCRIPCION', 'descripcion', 'Descripcion']),
      uso: findColumnIndex(headers, ['USO', 'uso', 'Uso']),
      unidad: findColumnIndex(headers, ['UNIDAD', 'unidad', 'Unidad']),
      proveedor: findColumnIndex(headers, ['PROVEEDOR', 'proveedor', 'Proveedor']),
      uom: findColumnIndex(headers, ['UOM', 'uom', 'Uom']),
      priceExw: findColumnIndex(headers, ['PRICE EXW', 'price exw', 'Price EXW', 'PRICE_EXW']),
      moneda: findColumnIndex(headers, ['MONEDA', 'moneda', 'Moneda']),
      valorMoneda: findColumnIndex(headers, ['VALOR MONEDA', 'valor moneda', 'Valor Moneda', 'VALOR_MONEDA']),
      landenFactor: findColumnIndex(headers, ['LANDEN FACTOR', 'landen factor', 'Landen Factor', 'LANDEN_FACTOR']),
      marginFactor: findColumnIndex(headers, ['MARGIN FACTOR', 'margin factor', 'Margin Factor', 'MARGIN_FACTOR']),
      compatibilidad: findColumnIndex(headers, ['COMPATIBILIDAD', 'compatibilidad', 'Compatibilidad']),
      precioVenta: findColumnIndex(headers, ['PRECIO VENTA', 'precio venta', 'Precio Venta', 'PRECIO_VENTA']),
      
      // Fallbacks para compatibilidad con formato anterior
      name: findColumnIndex(headers, ['DESCRIPCIÓN', 'DESCRIPCION', 'descripcion', 'MODELO', 'modelo', 'nombre', 'name']),
      category: findColumnIndex(headers, ['CATEGORIA', 'categoria', 'ESPECIALIDAD', 'especialidad']),
      price: findColumnIndex(headers, ['PRECIO VENTA', 'precio venta', 'PRICE EXW', 'price exw', 'precio', 'price'])
    };

    // Validar que tenemos las columnas mínimas requeridas
    const hasBasicInfo = (columnMap.descripcion !== -1 || columnMap.modelo !== -1) && 
                        (columnMap.precioVenta !== -1 || columnMap.priceExw !== -1);
    
    if (!hasBasicInfo) {
      throw new Error('El archivo debe contener al menos: DESCRIPCIÓN o MODELO, y PRECIO VENTA o PRICE EXW');
    }

    return rows
      .filter(row => row && row.length > 0 && (row[columnMap.descripcion] || row[columnMap.modelo])) // Filtrar filas vacías
      .map((row, index) => {
        try {
          // Generar ID único basado en marca + modelo o descripción
          const marca = String(row[columnMap.marca] || '').trim();
          const modelo = String(row[columnMap.modelo] || '').trim();
          const descripcion = String(row[columnMap.descripcion] || '').trim();
          
          const productId = marca && modelo 
            ? `${marca}-${modelo}`.replace(/\s+/g, '-').toLowerCase()
            : descripcion.substring(0, 50).replace(/\s+/g, '-').toLowerCase() || `product-${index + 1}`;

          // Determinar el nombre del producto
          const productName = descripcion || `${marca} ${modelo}`.trim() || 'Producto sin nombre';

          // Determinar categoría
          const categoria = String(row[columnMap.categoria] || '').trim();
          const especialidad = String(row[columnMap.especialidad] || '').trim();
          const productCategory = categoria || especialidad || 'general';

          // Determinar precio (priorizar precio de venta, luego EXW)
          let basePrice = 0;
          if (columnMap.precioVenta !== -1 && row[columnMap.precioVenta]) {
            basePrice = parseFloat(row[columnMap.precioVenta]) || 0;
          } else if (columnMap.priceExw !== -1 && row[columnMap.priceExw]) {
            basePrice = parseFloat(row[columnMap.priceExw]) || 0;
          }

          // Construir descripción completa
          const uso = String(row[columnMap.uso] || '').trim();
          const clasificacion = String(row[columnMap.clasificacion] || '').trim();
          const para = String(row[columnMap.para] || '').trim();
          
          const fullDescription = [
            descripcion,
            uso ? `Uso: ${uso}` : '',
            clasificacion ? `Clasificación: ${clasificacion}` : '',
            para ? `Para: ${para}` : ''
          ].filter(Boolean).join(' | ');

          // Determinar compatibilidad
          const compatibilidadStr = String(row[columnMap.compatibilidad] || row[columnMap.para] || 'ADULTO');
          const compatibility = compatibilidadStr.split(',').map(c => c.trim().toUpperCase()).filter(Boolean);

          const product = {
            id: productId,
            name: productName,
            category: productCategory.toLowerCase().replace(/\s+/g, '-'),
            basePrice: basePrice,
            description: fullDescription,
            code: modelo || productId,
            image: '/api/placeholder/80/60',
            
            // Datos adicionales específicos del formato
            marca: marca,
            modelo: modelo,
            especialidad: especialidad,
            clasificacion: clasificacion,
            uso: uso,
            unidad: String(row[columnMap.unidad] || ''),
            proveedor: String(row[columnMap.proveedor] || ''),
            uom: String(row[columnMap.uom] || ''),
            priceExw: parseFloat(row[columnMap.priceExw]) || 0,
            moneda: String(row[columnMap.moneda] || ''),
            valorMoneda: parseFloat(row[columnMap.valorMoneda]) || 1,
            landenFactor: parseFloat(row[columnMap.landenFactor]) || 1,
            marginFactor: parseFloat(row[columnMap.marginFactor]) || 1,
            
            accessories: [],
            compatibility: compatibility
          };

          // Incluir alias/formatos que el backend podría esperar
          product.precioUnitario = product.basePrice;
          product.precioVentaPaquete = product.basePrice;
          product.precioVenta = product.basePrice;
          product.priceExw = product.priceExw || product.basePrice;

          if (!product.name || product.name === 'Producto sin nombre') {
            throw new Error(`Fila ${index + 2}: Se requiere DESCRIPCIÓN o MARCA + MODELO`);
          }

          if (product.basePrice <= 0) {
            throw new Error(`Fila ${index + 2}: Se requiere PRECIO VENTA o PRICE EXW mayor a 0`);
          }

          return product;
        } catch (error) {
          throw new Error(`Error en fila ${index + 2}: ${error.message}`);
        }
      });
  };

  const findColumnIndex = (headers, possibleNames) => {
    for (let name of possibleNames) {
      const index = headers.findIndex(header => 
        header && header.toString().toLowerCase().trim() === name.toLowerCase()
      );
      if (index !== -1) return index;
    }
    return -1;
  };

  const sendDataToAPI = async (products) => {
    try {
      console.log('Enviando productos a la API:', products);
      
      const response = await apiRequest('/bulk/products', {
        method: 'POST',
        body: JSON.stringify({
          products: products,
          source: 'excel_upload'
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('Respuesta de la API:', response);
      
      // Mostrar resumen de resultados
      const { created, updated, errors = [] } = response;
      let message = `✅ Proceso completado: ${created || 0} productos creados, ${updated || 0} productos actualizados`;
      
      if (errors.length > 0) {
        message += `\n⚠️ ${errors.length} errores encontrados`;
        console.warn('Errores durante la carga:', errors);
      }

      setUploadStatus({ 
        type: errors.length > 0 ? 'warning' : 'success', 
        message: message,
        details: { created, updated, errors }
      });

      // Notificar al componente padre
      if (onDataLoaded) {
        onDataLoaded(response);
      }

      return response;
      
    } catch (error) {
      console.error('Error enviando datos a la API:', error);
      
      let errorMessage = 'Error al enviar datos al servidor';
      
      if (error.message.includes('401')) {
        errorMessage = 'Error de autenticación. Por favor inicia sesión nuevamente.';
      } else if (error.message.includes('403')) {
        errorMessage = 'No tienes permisos para cargar productos.';
      } else if (error.message.includes('404')) {
        errorMessage = 'Endpoint de carga no encontrado. Verifica la configuración del servidor.';
      } else if (error.message.includes('fetch')) {
        errorMessage = 'No se pudo conectar con el servidor. Verifica la conexión.';
      }

      setUploadStatus({ 
        type: 'error', 
        message: errorMessage,
        details: { originalError: error.message }
      });
      
      throw error;
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const resetUpload = () => {
    setUploadStatus(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <Button
          onClick={handleButtonClick}
          disabled={isLoading}
          className="flex items-center space-x-2"
          variant="outline"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span>Procesando...</span>
            </>
          ) : (
            <>
              <Upload size={16} />
              <span>Cargar Catálogo Excel</span>
            </>
          )}
        </Button>

        <ExcelTemplateDownloader />
        
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileSelect}
          className="hidden"
        />

        {uploadStatus && (
          <Button
            onClick={resetUpload}
            variant="ghost"
            size="sm"
            className="text-gray-500"
          >
            Limpiar
          </Button>
        )}
      </div>

      {uploadStatus && (
        <div className={`flex items-start space-x-2 p-3 rounded-md ${
          uploadStatus.type === 'success' 
            ? 'bg-green-50 text-green-800 border border-green-200' 
            : uploadStatus.type === 'warning'
            ? 'bg-yellow-50 text-yellow-800 border border-yellow-200'
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {uploadStatus.type === 'success' ? (
            <CheckCircle size={16} className="mt-0.5" />
          ) : (
            <AlertCircle size={16} className="mt-0.5" />
          )}
          <div className="flex-1">
            <p className="text-sm whitespace-pre-line">{uploadStatus.message}</p>
            {uploadStatus.details?.errors && uploadStatus.details.errors.length > 0 && (
              <details className="mt-2">
                <summary className="text-xs cursor-pointer hover:underline">
                  Ver errores ({uploadStatus.details.errors.length})
                </summary>
                <div className="mt-1 text-xs bg-white bg-opacity-50 p-2 rounded border max-h-32 overflow-y-auto">
                  {uploadStatus.details.errors.map((error, index) => (
                    <div key={index} className="mb-1">
                      • {error}
                    </div>
                  ))}
                </div>
              </details>
            )}
          </div>
        </div>
      )}


    </div>
  );
};

export default ExcelUploader;
