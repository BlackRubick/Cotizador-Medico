// src/components/organisms/EmailQuoteModal.jsx
import React, { useState, useEffect } from 'react';
import pdfService from '../../services/pdfService';
import quoteService from '../../services/quoteService';

const EmailQuoteModal = ({ isOpen, onClose, quoteData, clientData }) => {
  const [formData, setFormData] = useState({
    to_email: '',
    to_name: '',
    subject: '',
    message: '',
    company_name: 'Cotizador Médico',
    from_name: 'Equipo de Ventas',
    client_hospital: '',
    branch: '' // Nuevo campo para sucursal
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Inicializar formulario cuando se abre el modal
  useEffect(() => {
    if (isOpen && clientData) {
      const hospitalName = clientData.hospitalName || clientData.hospital || clientData.name || clientData.nombre || '';
      const contactName = clientData.contactName || clientData.contact || clientData.name || clientData.nombre || '';
      
      setFormData(prev => ({
        ...prev,
        to_email: clientData.email || clientData.correo || '',
        to_name: contactName,
        subject: `Cotización ${quoteData?.folio || quoteData?.id || new Date().getTime()} - ${prev.company_name}`,
        message: `Estimado/a ${contactName},

Esperamos se encuentre bien. Por medio del presente, nos es grato hacerle llegar la cotización solicitada para ${hospitalName}.

Adjunto encontrará el PDF con todos los detalles, especificaciones técnicas y condiciones comerciales.

Quedamos a su disposición para cualquier duda o aclaración.`,
        client_hospital: hospitalName
      }));
    }
  }, [isOpen, clientData, quoteData]);

  // Limpiar estados cuando se cierre el modal
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        to_email: '',
        to_name: '',
        subject: '',
        message: '',
        company_name: 'Cotizador Médico',
        from_name: 'Equipo de Ventas',
        client_hospital: '',
        branch: '' // Reiniciar campo de sucursal
      });
      setError('');
      setSuccess('');
    }
  }, [isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const sendQuoteEmail = async (emailData) => {
    try {
      let pdfBlob;
      if (pdfService.generateAndDownloadQuotePDF) {
        const jsPDF = (await import('jspdf')).default;
        const doc = new jsPDF('p', 'mm', 'letter');
        // Usa el folio del backend para el asunto
        const folio = emailData.quote?.folio || emailData.quote?.id || '';
        const subject = `Cotización ${folio} - ${emailData.company_name}`;
        const message = String(emailData.message || '');
        doc.text(subject, 10, 10);
        // Divide el mensaje en líneas para evitar overflow y errores
        const lines = doc.splitTextToSize(message, 180);
        doc.text(lines, 10, 20);
        pdfBlob = doc.output('blob');
      } else {
        throw new Error('No se encontró la función para generar el PDF.');
      }

      // 2. Crear FormData y enviar al backend
      const formData = new FormData();
      formData.append('branch', emailData.branch); // Solo el valor seleccionado
      formData.append('to', emailData.to_email);
      formData.append('subject', emailData.subject);
      formData.append('text', emailData.message);
      formData.append('pdfBuffer', pdfBlob, 'cotizacion.pdf');
      // Valida el identificador antes de enviar
      const quoteIdentifier = emailData.quote?.folio || emailData.quote?.id || '';
      if (!quoteIdentifier) {
        return { success: false, error: 'No se encontró el identificador de la cotización. Guarda la cotización antes de enviar el email.' };
      }
      const response = await fetch(`/api/quotes/${quoteIdentifier}/send`, {
        method: 'POST',
        body: formData
      });
      const result = await response.json();
      return result;
    } catch (err) {
      return { success: false, error: err.message || 'Error de conexión' };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.to_email.trim()) {
      alert('Por favor, ingrese el email del destinatario');
      return;
    }

    if (!formData.subject.trim()) {
      alert('Por favor, ingrese el asunto del email');
      return;
    }

    if (!formData.branch.trim()) {
      alert('Por favor, ingrese la sucursal (branch)');
      return;
    }
    // Normaliza el branch para el backend
    const normalizedBranch = formData.branch.trim().toLowerCase().replace(/\s+/g, '');
    setIsLoading(true);
    let quoteToSend = quoteData;
    // Si no hay folio ni id, guarda la cotización primero
    if (!quoteData?.folio && !quoteData?.id) {
      try {
        // Construir datos mínimos requeridos para el backend
        const safeQuoteData = {
          ...quoteData,
          email: formData.to_email || quoteData.email || '',
          products: quoteData.items || quoteData.products || [],
        };
        const createResult = await quoteService.createQuote(safeQuoteData);
        if (createResult.success && createResult.data) {
          quoteToSend = { ...quoteData, id: createResult.data.id, folio: createResult.data.folio };
        } else {
          setIsLoading(false);
          setError(createResult.message || 'No se pudo guardar la cotización.');
          return;
        }
      } catch (err) {
        setIsLoading(false);
        setError(err.message || 'Error al guardar la cotización.');
        return;
      }
    }
    const emailData = {
      ...formData,
      branch: normalizedBranch,
      quote: quoteToSend,
      reply_to: formData.to_email,
      client_hospital: formData.client_hospital || formData.to_name
    };
    const result = await sendQuoteEmail(emailData);
    setIsLoading(false);
    if (result.success) {
      setSuccess('Email enviado con éxito!');
      setTimeout(() => {
        onClose();
      }, 2000);
    } else {
      setError(result.error || result.message || 'Error al enviar el email. Por favor, intente nuevamente.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Enviar Cotización por Email
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
          {/* Destinatario */}
          <div>
            <label htmlFor="to_email" className="block text-sm font-medium text-gray-700 mb-1">
              Email del Destinatario *
            </label>
            <input
              type="email"
              id="to_email"
              name="to_email"
              value={formData.to_email}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* Nombre del destinatario */}
          <div>
            <label htmlFor="to_name" className="block text-sm font-medium text-gray-700 mb-1">
              Nombre del Contacto
            </label>
            <input
              type="text"
              id="to_name"
              name="to_name"
              value={formData.to_name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Nombre del hospital */}
          <div>
            <label htmlFor="client_hospital" className="block text-sm font-medium text-gray-700 mb-1">
              Nombre del Hospital/Institución
            </label>
            <input
              type="text"
              id="client_hospital"
              name="client_hospital"
              value={formData.client_hospital}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Sucursal */}
          <div>
            <label htmlFor="branch" className="block text-sm font-medium text-gray-700 mb-1">
              Sucursal (Branch) *
            </label>
            <select
              id="branch"
              name="branch"
              value={formData.branch}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Selecciona una sucursal</option>
              <option value="conduitlife">Conduit Life</option>
              <option value="biosystems">Biosystems</option>
              <option value="escalabiomedica">Escala Biomedica</option>
              <option value="clinicaydiseno">Clinica y Diseño</option>
            </select>
          </div>

          {/* Asunto */}
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
              Asunto *
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* Mensaje */}
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
              Mensaje
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Datos de la empresa */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="company_name" className="block text-sm font-medium text-gray-700 mb-1">
                Nombre de la Empresa
              </label>
              <input
                type="text"
                id="company_name"
                name="company_name"
                value={formData.company_name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="from_name" className="block text-sm font-medium text-gray-700 mb-1">
                Nombre del Remitente
              </label>
              <input
                type="text"
                id="from_name"
                name="from_name"
                value={formData.from_name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Información de la cotización */}
          {quoteData && (
            <div className="bg-gray-50 p-3 rounded-md">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Datos de la Cotización:</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <p><strong>Folio:</strong> #{quoteData.folio || 'N/A'}</p>
                <p><strong>Fecha:</strong> {quoteData.date || new Date().toLocaleDateString('es-ES')}</p>
                <p><strong>Total:</strong> ${quoteData.total || '0'}</p>
                <p><strong>Productos:</strong> {quoteData.products?.length || 0} productos</p>
              </div>
            </div>
          )}

          {/* Estados */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 rounded-md p-3">
              <p className="text-sm text-green-600">{success}</p>
            </div>
          )}
        </form>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            disabled={isLoading}
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading || !formData.to_email.trim() || !formData.subject.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Enviando...
              </>
            ) : (
              'Enviar Email'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailQuoteModal;
