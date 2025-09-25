import React, { useState } from 'react';
import Modal from '../atoms/Modal';
import Button from '../atoms/Button';
import Input from '../atoms/Input';
import { AlertCircle, CheckCircle, Mail } from 'lucide-react';
import pdfService from '../../services/pdfService';
import axios from 'axios';

const BRANCHES = [
  { id: 'conduit-life', name: 'Conduit Life' },
  { id: 'biosystems-hls', name: 'Biosystems HLS' },
  { id: 'ingenieria-clinica', name: 'Ingeniería Clínica y Diseño' },
  { id: 'escala-biomedica', name: 'Escala Biomédica' }
];

const EmailQuoteModal = ({ open, onClose, quoteData, clientData, quoteId }) => {
  const [branch, setBranch] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSendEmail = async () => {
    setError('');
    setSuccess('');
    if (!branch) {
      setError('Selecciona la sucursal desde la que se enviará el correo.');
      return;
    }
    setIsSending(true);
    try {
      // 1. Generar PDF
      const pdfResult = await pdfService.generateQuotePDF(quoteData);
      if (!pdfResult.success || !pdfResult.fileBuffer) {
        throw new Error('No se pudo generar el PDF.');
      }
      // 2. Enviar al backend
      const response = await axios.post(`/api/quotes/${quoteId}/send`, {
        branch,
        pdfBuffer: pdfResult.fileBuffer // Debe ser base64
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
        <div>
          <label className="block text-sm font-medium mb-2">Sucursal de envío *</label>
          <select
            value={branch}
            onChange={e => setBranch(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
            disabled={isSending}
          >
            <option value="">-- Selecciona sucursal --</option>
            {BRANCHES.map(b => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
        </div>
        <Button
          onClick={handleSendEmail}
          disabled={isSending || !branch}
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
