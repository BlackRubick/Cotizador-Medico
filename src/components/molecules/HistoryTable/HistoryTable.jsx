// src/components/molecules/HistoryTable/HistoryTable.jsx - ACTUALIZADO
import React from 'react';
import { Edit, Mail, Eye, Calendar, User, Building2, Trash2 } from 'lucide-react';
import StatusBadge from '../../atoms/StatusBadge';
import pdfService from '../../../services/pdfService';

const HistoryTable = ({ quotes, onEdit, onSendEmail, onDelete, loading = false }) => {
  // Función para mapear estados del backend a español
  const getStatusLabel = (status) => {
    const statusMap = {
      'draft': 'Borrador',
      'sent': 'Enviado',
      'pending': 'Pendiente',
      'confirmed': 'Confirmado',
      'rejected': 'Rechazado',
      'cancelled': 'Cancelado',
      'expired': 'Expirado'
    };
    return statusMap[status] || status;
  };

  // Función para obtener color del estado
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'draft':
      case 'borrador':
        return 'bg-gray-100 text-gray-800';
      case 'sent':
      case 'enviado':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
      case 'confirmado':
        return 'bg-green-100 text-green-800';
      case 'rejected':
      case 'rechazado':
        return 'bg-red-100 text-red-800';
      case 'cancelled':
      case 'cancelado':
        return 'bg-red-100 text-red-800';
      case 'expired':
      case 'expirado':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Función para formatear precio
  const formatPrice = (price) => {
    if (!price && price !== 0) return '$0';
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0
    }).format(price);
  };

  // Función para formatear fecha
  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      // Verificar si la fecha es válida
      if (isNaN(date.getTime())) {
        return dateString; // Devolver original si no es válida
      }
      return date.toLocaleDateString('es-MX', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (error) {
      return dateString; // Devolver original si hay error
    }
  };

  if (!quotes || quotes.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Cargando cotizaciones...</p>
            </>
          ) : (
            <>
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                No hay cotizaciones disponibles
              </h3>
              <p className="text-gray-500">
                Las cotizaciones aparecerán aquí cuando se generen desde el sistema.
              </p>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b-2 border-gray-200 bg-gray-50">
            <th className="text-left py-4 px-4 font-semibold text-gray-700">
              <div className="flex items-center space-x-2">
                <Building2 size={16} />
                <span>Cliente</span>
              </div>
            </th>
            <th className="text-left py-4 px-4 font-semibold text-gray-700">Folio</th>
            <th className="text-left py-4 px-4 font-semibold text-gray-700">
              <div className="flex items-center space-x-2">
                <Calendar size={16} />
                <span>Fecha</span>
              </div>
            </th>
            <th className="text-left py-4 px-4 font-semibold text-gray-700">
              <div className="flex items-center space-x-2">
                <User size={16} />
                <span>Contacto</span>
              </div>
            </th>
            <th className="text-right py-4 px-4 font-semibold text-gray-700">Total</th>
            <th className="text-center py-4 px-4 font-semibold text-gray-700">Estado</th>
            <th className="text-center py-4 px-4 font-semibold text-gray-700">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {quotes.map((quote, index) => (
            <tr 
              key={quote.id || index} 
              className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
            >
              {/* Cliente */}
              <td className="py-4 px-4">
                <div>
                  <div className="font-medium text-gray-900">
                    {quote.razonSocial || quote.clientInfoName || 'Cliente no especificado'}
                  </div>
                  {quote.correo && (
                    <div className="text-sm text-gray-500">{quote.correo}</div>
                  )}
                </div>
              </td>

              {/* Folio */}
              <td className="py-4 px-4">
                <div className="flex items-center space-x-2">
                  <div className={`font-mono text-sm px-2 py-1 rounded inline-block ${
                    quote.estadoLocal 
                      ? 'bg-purple-50 text-purple-700 border border-purple-200' 
                      : 'bg-blue-50 text-blue-700'
                  }`}>
                    {quote.folio || 'N/A'}
                  </div>
                  {quote.estadoLocal && (
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span className="text-xs text-purple-600 font-medium">LOCAL</span>
                    </div>
                  )}
                </div>
              </td>

              {/* Fecha */}
              <td className="py-4 px-4">
                <div className="text-sm">
                  {formatDate(quote.fecha || quote.fechaCreacion || quote.createdAt)}
                </div>
              </td>

              {/* Contacto */}
              <td className="py-4 px-4">
                <div>
                  <div className="font-medium text-sm">
                    {quote.encargado || quote.clientInfoContact || 'N/A'}
                  </div>
                  {quote.puesto && (
                    <div className="text-xs text-gray-500">{quote.puesto}</div>
                  )}
                </div>
              </td>

              {/* Total */}
              <td className="py-4 px-4 text-right">
                <div className="font-bold text-lg text-green-600">
                  {formatPrice(quote.total)}
                </div>
                {quote.subtotal && (
                  <div className="text-xs text-gray-500">
                    + {formatPrice(quote.iva || quote.taxAmount || (quote.total - quote.subtotal))} IVA
                  </div>
                )}
              </td>

              {/* Estado */}
              <td className="py-4 px-4 text-center">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(quote.estado || quote.status)}`}>
                  {getStatusLabel(quote.estado || quote.status)}
                </span>
              </td>

              {/* Acciones */}
              <td className="py-4 px-4">
                <div className="flex items-center justify-center space-x-2">
                  {/* Botón Editar */}
                  <button
                    onClick={() => onEdit && onEdit(quote)}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Editar cotización"
                  >
                    <Edit size={16} />
                  </button>

                  {/* Botón Eliminar */}
                  <button
                    onClick={() => onDelete && onDelete(quote)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Eliminar cotización"
                  >
                    <Trash2 size={16} />
                  </button>

                  {/* Botón Enviar Email */}
                  <button
                    onClick={() => onSendEmail && onSendEmail(quote)}
                    className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    title="Enviar por email"
                  >
                    <Mail size={16} />
                  </button>

                  {/* Botón Ver PDF */}
                  <button
                    onClick={async () => {
                      try {
                        console.log('📄 Generando vista previa del PDF para:', quote.folio);
                        
                        // Preparar datos de la cotización para PDF
                        const productos = Array.isArray(quote.productos) ? quote.productos : 
                                        Array.isArray(quote.products) ? quote.products : [];
                        
                        console.log('📊 Datos de la cotización:', quote);
                        console.log('🛒 Productos encontrados:', productos);
                        
                        const quoteDataForPDF = {
                          folio: quote.folio || 'SIN_FOLIO',
                          clientName: quote.razonSocial || quote.clientInfoName || quote.cliente || 'Cliente no especificado',
                          clientContact: quote.encargado || quote.clientInfoContact || quote.contacto || 'N/A',
                          email: quote.correo || quote.clientInfoEmail || quote.email || 'sin-email@ejemplo.com',
                          phone: quote.numero || quote.clientInfoPhone || quote.telefono || quote.phone || 'N/A',
                          clientAddress: quote.direccion || quote.clientInfoAddress || 'Dirección no especificada',
                          clientPosition: quote.puesto || quote.clientInfoPosition || 'N/A',
                          cartItems: productos.map(p => ({
                            id: p.id || p.productId || Math.random().toString(36),
                            name: p.name || p.descripcion || p.equipo || 'Producto sin nombre',
                            description: p.descripcion || p.name || p.description || 'Sin descripción',
                            quantity: parseInt(p.quantity || p.cantidad || 1),
                            basePrice: parseFloat(p.basePrice || p.unitPrice || p.precio || 0),
                            code: p.code || p.codigo || 'SIN_CODIGO',
                            brand: p.brand || p.marca || 'Sin marca'
                          })),
                          fecha: quote.fecha || new Date().toLocaleDateString('es-MX')
                        };
                        
                        console.log('📄 Datos preparados para PDF:', quoteDataForPDF);
                        
                        // Datos de empresa por defecto (usar el primero si no está especificado)
                        const defaultCompany = {
                          id: 'conduit-life',
                          name: 'CONDUIT LIFE',
                          fullName: 'CONDUIT LIFE S.A. DE C.V.',
                          address: 'Av. Principal 123, Tuxtla Gutiérrez, Chiapas',
                          phone: '+52 961 123 4567',
                          email: 'contacto@conduitlife.com',
                          rfc: 'CL123456789'
                        };
                        
                        const result = await pdfService.previewQuotePDF(quoteDataForPDF, defaultCompany);
                        
                        if (!result.success) {
                          throw new Error(result.error);
                        }
                        
                      } catch (error) {
                        console.error('❌ Error mostrando PDF:', error);
                        alert('Error al mostrar PDF: ' + error.message);
                      }
                    }}
                    className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                    title="Ver PDF"
                  >
                    <Eye size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Información adicional al pie de la tabla */}
      <div className="bg-gray-50 px-4 py-3 border-t">
        <div className="flex justify-between items-center text-sm text-gray-600">
          <div>
            Total de cotizaciones: <span className="font-medium">{quotes.length}</span>
          </div>
          
          {/* Resumen de estados */}
          <div className="flex space-x-4">
            {['confirmed', 'pending', 'sent'].map(status => {
              const count = quotes.filter(q => 
                (q.estado || q.status)?.toLowerCase() === status || 
                (q.estado || q.status)?.toLowerCase() === getStatusLabel(status).toLowerCase()
              ).length;
              
              if (count > 0) {
                return (
                  <div key={status} className="flex items-center space-x-1">
                    <div className={`w-3 h-3 rounded-full ${
                      status === 'confirmed' ? 'bg-green-500' :
                      status === 'pending' ? 'bg-yellow-500' : 'bg-blue-500'
                    }`}></div>
                    <span>{getStatusLabel(status)}: {count}</span>
                  </div>
                );
              }
              return null;
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryTable;