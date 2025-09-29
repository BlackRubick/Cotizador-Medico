import React, { useState } from 'react';
import Modal from '../atoms/Modal';
import Button from '../atoms/Button';
import Input from '../atoms/Input';
import { AlertCircle, CheckCircle, Mail } from 'lucide-react';
import pdfService from '../../services/pdfService';
import axios from 'axios';

const EmailQuoteModal = ({ open, onClose, quoteData, clientData, quoteId }) => {
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSendEmail = async () => {
    setError('');
    setSuccess('');
    setIsSending(true);
    try {
      const pdfResult = await pdfService.generateQuotePDF(quoteData);
      if (!pdfResult.success || !pdfResult.fileBuffer) {
        throw new Error('No se pudo generar el PDF.');
      }
      // Enviar al backend usando FormData y el folio real
      const formData = new FormData();
      formData.append('pdfBuffer', pdfResult.fileBuffer); // PDF como archivo
      // Usa el folio real de la cotización
      const folio = quoteData.folio;
      if (!folio) throw new Error('Folio de cotización no encontrado.');
      const response = await axios.post(`/api/quotes/${folio}/send`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (response.data.success) {
        setSuccess('Cotización enviada exitosamente por email.');
        setTimeout(() => {
          setSuccess('');
          onClose();
        }, 2000);
      } else {
        throw new Error(response.data.message || 'Error al enviar email');
      }
    } catch (err) {
      setError(err.message || 'Error al enviar la cotización por email');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Enviar Cotización por Email">
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Mail className="w-6 h-6 text-blue-600" />
          <span className="font-semibold text-blue-800">Enviar a: {clientData?.email}</span>
        </div>
        <Button
          onClick={handleSendEmail}
          disabled={isSending}
          className="w-full bg-blue-600 text-white mt-2"
        >
          {isSending ? 'Enviando...' : 'Enviar Cotización'}
        </Button>
        {error && (
          <div className="flex items-center text-red-600 mt-2">
            <AlertCircle className="w-4 h-4 mr-1" />
            {error}
          </div>
        )}
        {success && (
          <div className="flex items-center text-green-600 mt-2">
            <CheckCircle className="w-4 h-4 mr-1" />
            {success}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default EmailQuoteModal;
