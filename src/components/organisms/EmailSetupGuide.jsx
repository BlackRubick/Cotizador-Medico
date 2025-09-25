// src/components/organisms/EmailSetupGuide.jsx
import React, { useState } from 'react';
import { AlertCircle, CheckCircle, ExternalLink, Copy, Settings } from 'lucide-react';
import { EMAIL_CONFIG, SETUP_INSTRUCTIONS, validateEmailConfig, EMAIL_TEMPLATES } from '../../config/emailConfig';
import emailService from '../../services/emailService';

const EmailSetupGuide = ({ onClose }) => {
  const [activeStep, setActiveStep] = useState(1);
  const [copied, setCopied] = useState('');
  
  const config = emailService.getConfig();
  const validation = validateEmailConfig();

  const copyToClipboard = async (text, type) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(''), 2000);
    } catch (err) {
      console.error('Error copying to clipboard:', err);
    }
  };

  const templateExamples = {
    quote: EMAIL_TEMPLATES.cotizacion.text,
    contact: EMAIL_TEMPLATES.contacto.text,
    admin: EMAIL_TEMPLATES.admin_notification.text
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Settings className="w-6 h-6 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                Guía de Configuración de Correo
              </h3>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              ×
            </button>
          </div>
          
          {/* Status */}
          <div className="mt-3">
            {validation.isValid ? (
              <div className="flex items-center text-green-600 text-sm">
                <CheckCircle className="w-4 h-4 mr-2" />
                Configurado correctamente
              </div>
            ) : (
              <div className="flex items-center text-red-600 text-sm">
                <AlertCircle className="w-4 h-4 mr-2" />
                Configuración incompleta ({validation.errors.length} errores)
              </div>
            )}
          </div>
        </div>

        <div className="flex">
          {/* Sidebar - Steps */}
          <div className="w-1/3 bg-gray-50 p-4 border-r">
            <h4 className="font-medium text-gray-900 mb-4">Pasos de configuración:</h4>
            <div className="space-y-2">
              {Object.entries(SETUP_INSTRUCTIONS).map(([key, step], index) => (
                <button
                  key={key}
                  onClick={() => setActiveStep(index + 1)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    activeStep === index + 1 
                      ? 'bg-blue-100 border-blue-200 border text-blue-800' 
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <div className="font-medium text-sm">{step.title}</div>
                  <div className="text-xs text-gray-600 mt-1">{step.description}</div>
                </button>
              ))}
            </div>
            
            {/* Current Configuration */}
            <div className="mt-6 p-3 bg-white rounded-lg border">
              <h5 className="font-medium text-gray-800 mb-2">Configuración actual:</h5>
              <div className="text-xs text-gray-600 space-y-1">
                <div>Service ID: <code className="bg-gray-100 px-1">{config.service}</code></div>
                <div>Template Quote: <code className="bg-gray-100 px-1">{config.templates.quote}</code></div>
                <div>Company Email: <code className="bg-gray-100 px-1">{config.company.email}</code></div>
                <div className="flex items-center mt-2">
                  {validation.isValid ? (
                    <CheckCircle className="w-3 h-3 text-green-500 mr-1" />
                  ) : (
                    <AlertCircle className="w-3 h-3 text-red-500 mr-1" />
                  )}
                  <span className={validation.isValid ? 'text-green-600' : 'text-red-600'}>
                    {validation.isValid ? 'Válido' : 'Incompleto'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-6">
            {activeStep === 1 && (
              <div>
                <h4 className="text-lg font-medium mb-4">1. Crear cuenta en el proveedor de correo</h4>
                <div className="space-y-4">
                  <p className="text-gray-700">
                    El proveedor de correo te permite enviar emails directamente desde el navegador sin necesidad de un servidor.
                  </p>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h5 className="font-medium text-blue-800 mb-2">Pasos:</h5>
                    <ol className="list-decimal list-inside text-blue-700 space-y-2">
                      <li>Ve al sitio web de tu proveedor de correo</li>
                      <li>Regístrate con tu email</li>
                      <li>Verifica tu cuenta por email</li>
                      <li>Accede a tu dashboard</li>
                    </ol>
                  </div>
                  <p className="text-sm text-gray-600">
                    ✅ La cuenta gratuita incluye 200 emails por mes, perfecto para empezar.
                  </p>
                </div>
              </div>
            )}

            {activeStep === 2 && (
              <div>
                <h4 className="text-lg font-medium mb-4">2. Configurar servicio de email</h4>
                <div className="space-y-4">
                  <p className="text-gray-700">
                    Conecta tu proveedor de email (Gmail, Outlook, etc.) para enviar correos desde tu cuenta.
                  </p>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h5 className="font-medium text-green-800 mb-2">En tu dashboard del proveedor:</h5>
                    <ol className="list-decimal list-inside text-green-700 space-y-2">
                      <li>Ve a "Email Services"</li>
                      <li>Haz clic en "Add New Service"</li>
                      <li>Selecciona tu proveedor (Gmail recomendado)</li>
                      <li>Autoriza el acceso a tu cuenta</li>
                      <li>Copia el Service ID generado</li>
                    </ol>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <h5 className="font-medium text-yellow-800 mb-2">📝 Actualizar configuración:</h5>
                    <p className="text-yellow-700 text-sm mb-2">
                      Reemplaza el Service ID en tu archivo de configuración:
                    </p>
                    <div className="bg-white p-3 rounded border font-mono text-sm">
                      <div className="flex items-center justify-between">
                        <span>SERVICE_ID: 'tu_service_id_aqui'</span>
                        <button 
                          onClick={() => copyToClipboard("SERVICE_ID: 'tu_service_id_aqui'", 'service')}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          {copied === 'service' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeStep === 3 && (
              <div>
                <h4 className="text-lg font-medium mb-4">3. Crear templates de email</h4>
                <div className="space-y-4">
                  <p className="text-gray-700">
                    Los templates definen el formato y contenido de tus emails.
                  </p>
                  
                  <div className="space-y-6">
                    {/* Template Cotización */}
                    <div className="border rounded-lg p-4">
                      <h5 className="font-medium text-gray-800 mb-2 flex items-center">
                        📧 Template para Cotizaciones
                        <button 
                          onClick={() => copyToClipboard(templateExamples.quote, 'quote')}
                          className="ml-2 text-blue-600 hover:text-blue-800"
                        >
                          {copied === 'quote' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </h5>
                      <div className="bg-gray-50 p-3 rounded text-sm font-mono whitespace-pre-wrap overflow-auto max-h-32">
                        {templateExamples.quote}
                      </div>
                      <p className="text-xs text-gray-600 mt-2">
                        Template ID sugerido: <code>template_cotizacion</code>
                      </p>
                    </div>

                    {/* Template Contacto */}
                    <div className="border rounded-lg p-4">
                      <h5 className="font-medium text-gray-800 mb-2 flex items-center">
                        📧 Template para Contacto
                        <button 
                          onClick={() => copyToClipboard(templateExamples.contact, 'contact')}
                          className="ml-2 text-blue-600 hover:text-blue-800"
                        >
                          {copied === 'contact' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </h5>
                      <div className="bg-gray-50 p-3 rounded text-sm font-mono whitespace-pre-wrap overflow-auto max-h-32">
                        {templateExamples.contact}
                      </div>
                      <p className="text-xs text-gray-600 mt-2">
                        Template ID sugerido: <code>template_contacto</code>
                      </p>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h5 className="font-medium text-blue-800 mb-2">Para crear cada template:</h5>
                    <ol className="list-decimal list-inside text-blue-700 space-y-1 text-sm">
                      <li>Ve a "Email Templates" en tu dashboard</li>
                      <li>Haz clic en "Create New Template"</li>
                      <li>Copia y pega el contenido del template</li>
                      <li>Guarda el template con el ID sugerido</li>
                      <li>Prueba enviando un email de prueba</li>
                    </ol>
                  </div>
                </div>
              </div>
            )}

            {activeStep === 4 && (
              <div>
                <h4 className="text-lg font-medium mb-4">4. Actualizar configuración de la app</h4>
                <div className="space-y-4">
                  <p className="text-gray-700">
                    Modifica el archivo de configuración con tus datos específicos.
                  </p>
                  
                  <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                    <h5 className="font-medium text-red-800 mb-2">⚠️ Errores encontrados:</h5>
                    <ul className="text-red-700 text-sm space-y-1">
                      {validation.errors.map((error, index) => (
                        <li key={index}>• {error}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h5 className="font-medium text-gray-800 mb-2">📁 Archivo a modificar:</h5>
                    <code className="text-sm bg-white p-2 rounded border block">
                      src/config/emailConfig.js
                    </code>
                  </div>

                  <div className="space-y-3">
                    <div className="border p-3 rounded">
                      <h6 className="font-medium mb-2">Datos que debes cambiar:</h6>
                      <ul className="text-sm space-y-2 text-gray-700">
                        <li>• <strong>SERVICE_ID:</strong> Tu ID de servicio</li>
                        <li>• <strong>TEMPLATE_ID_*:</strong> Los IDs de tus templates</li>
                        <li>• <strong>COMPANY.email:</strong> Email de tu empresa</li>
                        <li>• <strong>COMPANY.phone:</strong> Teléfono de tu empresa</li>
                        <li>• <strong>ADMIN_EMAILS:</strong> Emails para recibir notificaciones</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeStep === 5 && (
              <div>
                <h4 className="text-lg font-medium mb-4">5. Probar funcionalidad</h4>
                <div className="space-y-4">
                  <p className="text-gray-700">
                    Una vez configurado todo, prueba la funcionalidad enviando emails de prueba.
                  </p>
                  
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h5 className="font-medium text-green-800 mb-2">✅ Cómo probar:</h5>
                    <ol className="list-decimal list-inside text-green-700 space-y-2">
                      <li>Crea una cotización en tu aplicación</li>
                      <li>Añade un cliente con email válido</li>
                      <li>Usa el botón "Enviar por Email"</li>
                      <li>Verifica que llegue el email</li>
                      <li>Revisa que el formato sea correcto</li>
                    </ol>
                  </div>

                  {validation.isValid && (
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <h5 className="font-medium text-blue-800 mb-2">🎉 ¡Todo listo!</h5>
                      <p className="text-blue-700 text-sm">
                        Tu configuración está completa. Ya puedes enviar cotizaciones por email desde tu aplicación.
                      </p>
                    </div>
                  )}

                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h5 className="font-medium text-yellow-800 mb-2">📊 Límites gratuitos:</h5>
                    <ul className="text-yellow-700 text-sm space-y-1">
                      <li>• 200 emails por mes</li>
                      <li>• Todas las funciones incluidas</li>
                      <li>• Sin marca de agua</li>
                      <li>• Soporte básico</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            {activeStep > 1 && (
              <button
                onClick={() => setActiveStep(activeStep - 1)}
                className="text-blue-600 hover:text-blue-800"
              >
                ← Anterior
              </button>
            )}
          </div>
          <div className="text-sm text-gray-600">
            Paso {activeStep} de {Object.keys(SETUP_INSTRUCTIONS).length}
          </div>
          <div className="text-sm text-gray-600">
            {activeStep < Object.keys(SETUP_INSTRUCTIONS).length && (
              <button
                onClick={() => setActiveStep(activeStep + 1)}
                className="text-blue-600 hover:text-blue-800"
              >
                Siguiente →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailSetupGuide;
