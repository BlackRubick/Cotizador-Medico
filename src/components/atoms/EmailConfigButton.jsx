// src/components/atoms/EmailConfigButton.jsx
import React, { useState } from 'react';
import { Settings, AlertTriangle, CheckCircle } from 'lucide-react';
import EmailSetupGuide from '../organisms/EmailSetupGuide';
import { validateEmailConfig } from '../../config/emailConfig';

const EmailConfigButton = ({ className = '', showStatus = true }) => {
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const validation = validateEmailConfig();

  return (
    <>
      <button
        onClick={() => setIsGuideOpen(true)}
        className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
          validation.isValid
            ? 'text-gray-700 bg-gray-100 hover:bg-gray-200 focus:ring-gray-500'
            : 'text-yellow-700 bg-yellow-100 hover:bg-yellow-200 focus:ring-yellow-500'
        } ${className}`}
        title={validation.isValid ? 'EmailJS configurado' : 'Configurar EmailJS'}
      >
        <Settings className="w-4 h-4 mr-2" />
        {showStatus && (
          validation.isValid ? (
            <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
          ) : (
            <AlertTriangle className="w-4 h-4 mr-2 text-yellow-600" />
          )
        )}
        EmailJS
      </button>

      {isGuideOpen && (
        <EmailSetupGuide onClose={() => setIsGuideOpen(false)} />
      )}
    </>
  );
};

export default EmailConfigButton;
