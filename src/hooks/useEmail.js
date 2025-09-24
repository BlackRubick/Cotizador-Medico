// src/hooks/useEmail.js
import { useState } from 'react';
import emailService from '../services/emailService';

export const useEmail = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  /**
   * Enviar cotización por email
   */
  const sendQuoteEmail = async (emailData) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await emailService.sendQuote(emailData);
      
      if (result.success) {
        setSuccess(result.message);
        return result;
      } else {
        setError(result.message);
        return result;
      }
    } catch (err) {
      const errorMessage = 'Error inesperado al enviar el email';
      setError(errorMessage);
      return { success: false, message: errorMessage, error: err };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Enviar email de contacto
   */
  const sendContactEmail = async (contactData) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await emailService.sendContactEmail(contactData);
      
      if (result.success) {
        setSuccess(result.message);
        return result;
      } else {
        setError(result.message);
        return result;
      }
    } catch (err) {
      const errorMessage = 'Error inesperado al enviar el mensaje';
      setError(errorMessage);
      return { success: false, message: errorMessage, error: err };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Enviar notificación al administrador
   */
  const sendAdminNotification = async (quoteData) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await emailService.sendQuoteNotificationToAdmin(quoteData);
      
      if (result.success) {
        setSuccess(result.message);
        return result;
      } else {
        setError(result.message);
        return result;
      }
    } catch (err) {
      const errorMessage = 'Error al enviar notificación';
      setError(errorMessage);
      return { success: false, message: errorMessage, error: err };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Limpiar estados
   */
  const clearStates = () => {
    setError(null);
    setSuccess(null);
  };

  return {
    // Estados
    isLoading,
    error,
    success,
    
    // Funciones
    sendQuoteEmail,
    sendContactEmail,
    sendAdminNotification,
    clearStates,
    
    // Utilidades
    validateConfig: emailService.validateConfig,
    getConfig: emailService.getConfig
  };
};
