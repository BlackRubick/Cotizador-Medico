// src/components/atoms/EmailButton.jsx
import React, { useState } from 'react';
import EmailQuoteModal from '../organisms/EmailQuoteModal';

const EmailButton = ({ 
  quoteData, 
  clientData, 
  className = '',
  variant = 'primary',
  size = 'md',
  children 
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
    outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-blue-500'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  const buttonClasses = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className={buttonClasses}
        title="Enviar cotización por email"
      >
        <svg 
          className="w-4 h-4 mr-2" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" 
          />
        </svg>
        {children || 'Enviar por Email'}
      </button>

      <EmailQuoteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        quoteData={quoteData}
        clientData={clientData}
      />
    </>
  );
};

export default EmailButton;
