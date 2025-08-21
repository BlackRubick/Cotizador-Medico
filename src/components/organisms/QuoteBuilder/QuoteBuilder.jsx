// src/components/organisms/QuoteBuilder/QuoteBuilder.jsx - ACTUALIZADO CON PDF
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Send, Save, User, AlertCircle, CheckCircle, Building, Download, Eye } from 'lucide-react';
import CartSummary from '../../molecules/CartSummary';
import Button from '../../atoms/Button';
import Input from '../../atoms/Input';
import Card from '../../atoms/Card';
import { useCart } from '../../../context/CartContext';
import quoteService from '../../services/quoteService';
import clientService from '../../services/clientService';
import pdfService from '../../services/pdfService';

const QuoteBuilder = ({ onBack }) => {
  const { cartItems, quoteInfo, setQuoteInfo, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showClientSearch, setShowClientSearch] = useState(false);
  const [clientSearchTerm, setClientSearchTerm] = useState('');
  const [generatedQuote, setGeneratedQuote] = useState(null);

  // Opciones de empresas vendedoras (actualizadas con datos reales)
  const sellerCompanies = [
    { 
      id: 'conduit-life', 
      name: 'CONDUIT LIFE',
      fullName: 'CONDUIT LIFE S.A. DE C.V.',
      address: 'Av. Principal 123, Tuxtla Gutiérrez, Chiapas',
      phone: '+52 961 123 4567',
      email: 'contacto@conduitlife.com',
      website: 'www.conduitlife.com',
      rfc: 'CON850101ABC'
    },
    { 
      id: 'escala-biomedica', 
      name: 'ESCALA BIOMEDICA',
      fullName: 'ESCALA BIOMÉDICA S.A. DE C.V.',
      address: 'Blvd. Belisario Domínguez 456, Tuxtla Gutiérrez, Chiapas',
      phone: '+52 961 234 5678',
      email: 'ventas@escalabiomedica.com',
      website: 'www.escalabiomedica.com',
      rfc: 'ESC900215XYZ'
    },
    { 
      id: 'ingenieria-clinica', 
      name: 'INGENIERIA CLINICA Y DISEÑO',
      fullName: 'INGENIERÍA CLÍNICA Y DISEÑO S.A. DE C.V.',
      address: 'Camino Real a Xochitepec 108 PA, Colonia La Noria Xochimilco, CDMX CP:16030',
      phone: '+52 55 5526 789034',
      email: 'contacto@clinicaydiseno.com',
      website: 'www.clinicaydiseno.com',
      rfc: 'ICD130614LQ4'
    },
    { 
      id: 'biosystems-hls', 
      name: 'Biosystems HLS',
      fullName: 'BIOSYSTEMS HEALTH & LIFE SCIENCES S.A. DE C.V.',
      address: 'Av. Insurgentes 789, Tuxtla Gutiérrez, Chiapas',
      phone: '+52 961 345 6789',
      email: 'info@biosystemshls.com',
      website: 'www.biosystemshls.com',
      rfc: 'BIO820305GHI'
    }
  ];

  // Cargar clientes al montar el componente
  useEffect(() => {
    loadClients();
    // Establecer empresa por defecto
    if (!quoteInfo.sellerCompany) {
      setQuoteInfo(prev => ({
        ...prev,
        sellerCompany: 'ingenieria-clinica' // ICD como empresa por defecto según la imagen
      }));
    }
  }, []);

  const loadClients = async () => {
    try {
      console.log('🔄 Cargando clientes...');
      const response = await clientService.getClients({ limit: 100 });
      if (response.success) {
        setClients(response.data || []);
        console.log('✅ Clientes cargados:', response.data.length);
      }
    } catch (error) {
      console.error('❌ Error loading clients:', error);
      setApiError('Error al cargar clientes: ' + error.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setQuoteInfo({
      ...quoteInfo,
      [name]: value
    });
    
    // Limpiar errores cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    if (apiError) {
      setApiError('');
    }
    
    if (successMessage) {
      setSuccessMessage('');
    }
  };

  // Auto-completar todos los campos cuando se selecciona un cliente
  const handleClientSelect = (client) => {
    console.log('🎯 Cliente seleccionado:', client);
    
    setSelectedClient(client);
    
    setQuoteInfo({
      ...quoteInfo,
      clientId: client.id,
      clientName: client.name || '',
      company: client.name || '',
      clientContact: client.contact || '',
      email: client.email || '',
      phone: client.phone || '',
      clientAddress: client.fullAddress || client.street || '',
      clientPosition: quoteInfo.clientPosition || ''
    });
    
    setShowClientSearch(false);
    setClientSearchTerm('');
    
    if (errors.client) {
      setErrors(prev => ({
        ...prev,
        client: ''
      }));
    }
    
    console.log('✅ Información del cliente actualizada');
  };

  // Filtrar clientes para búsqueda
  const filteredClients = clients.filter(client => {
    const searchTerm = clientSearchTerm.toLowerCase();
    const nombre = (client.name || '').toLowerCase();
    const contacto = (client.contact || '').toLowerCase();
    const email = (client.email || '').toLowerCase();
    
    return nombre.includes(searchTerm) ||
           contacto.includes(searchTerm) ||
           email.includes(searchTerm);
  });

  const validateForm = () => {
    const newErrors = {};

    if (!quoteInfo.sellerCompany) {
      newErrors.sellerCompany = 'Selecciona la empresa vendedora';
    }

    if (!selectedClient && !quoteInfo.clientName) {
      newErrors.client = 'Selecciona un cliente o ingresa información del cliente';
    }

    if (!quoteInfo.email) {
      newErrors.email = 'Email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(quoteInfo.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!quoteInfo.clientContact && !quoteInfo.clientName) {
      newErrors.clientContact = 'Contacto principal es requerido';
    }

    if (cartItems.length === 0) {
      newErrors.products = 'Agrega al menos un producto al carrito';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Función para preparar datos de la cotización para PDF
  const prepareQuoteDataForPDF = () => {
    const selectedSellerCompany = sellerCompanies.find(company => company.id === quoteInfo.sellerCompany);
    
    return {
      // Información de la empresa vendedora
      sellerCompany: selectedSellerCompany,
      
      // Información del cliente
      clientName: quoteInfo.clientName || selectedClient?.name,
      clientContact: quoteInfo.clientContact || selectedClient?.contact,
      email: quoteInfo.email,
      phone: quoteInfo.phone,
      clientAddress: quoteInfo.clientAddress || selectedClient?.fullAddress,
      clientPosition: quoteInfo.clientPosition || '',
      
      // Productos del carrito
      cartItems: cartItems,
      products: cartItems, // Alias para compatibilidad
      
      // Folio y fecha (se generan automáticamente)
      folio: generateFolio(),
      fecha: new Date().toLocaleDateString('es-MX'),
      
      // Términos estándar
      terms: {
        paymentConditions: '100% Anticipado a la entrega. (Transferencia Bancaria)',
        deliveryTime: '15 días hábiles',
        warranty: 'Garantía: 12 meses sobre defectos de fabricación.',
        observations: 'Sin más por el momento, nos ponemos a sus órdenes para cualquier duda y/o información adicional.'
      }
    };
  };

  // Función para generar folio similar al de la imagen
  const generateFolio = () => {
    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear().toString().slice(-2);
    const sequence = Math.floor(Math.random() * 99) + 1;
    
    return `ICD${day}${month}${year}379`;
  };

  const handleSaveQuote = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setApiError('');
    setSuccessMessage('');

    try {
      const selectedSellerCompany = sellerCompanies.find(company => company.id === quoteInfo.sellerCompany);
      
      const quoteData = {
        sellerCompany: selectedSellerCompany?.name || '',
        sellerCompanyId: quoteInfo.sellerCompany,
        clientId: selectedClient?.id || null,
        clientName: quoteInfo.clientName || selectedClient?.name,
        clientContact: quoteInfo.clientContact || selectedClient?.contact,
        email: quoteInfo.email,
        phone: quoteInfo.phone,
        clientAddress: quoteInfo.clientAddress || selectedClient?.fullAddress,
        clientPosition: quoteInfo.clientPosition || '',
        products: cartItems,
        terms: {
          paymentConditions: '100% Anticipado a la entrega. (Transferencia Bancaria)',
          deliveryTime: '15 días hábiles',
          warranty: 'Garantía: 12 meses sobre defectos de fabricación.',
          observations: 'Sin más por el momento, nos ponemos a sus órdenes para cualquier duda y/o información adicional.'
        }
      };

      console.log('💾 Guardando cotización como borrador:', quoteData);
      
      const response = await quoteService.createQuote(quoteData);
      
      if (response.success) {
        setGeneratedQuote({ ...quoteData, id: response.data.id, folio: response.data.folio });
        setSuccessMessage(`✅ Cotización ${response.data.folio} guardada como borrador exitosamente`);
        console.log('✅ Quote saved:', response.data);
        
        setTimeout(() => {
          setSuccessMessage('');
        }, 5000);
      } else {
        throw new Error(response.message || 'Error al guardar cotización');
      }
    } catch (error) {
      console.error('❌ Error saving quote:', error);
      setApiError(error.message || 'Error al guardar la cotización');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendQuote = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setApiError('');
    setSuccessMessage('');

    try {
      const selectedSellerCompany = sellerCompanies.find(company => company.id === quoteInfo.sellerCompany);
      
      const quoteData = {
        sellerCompany: selectedSellerCompany?.name || '',
        sellerCompanyId: quoteInfo.sellerCompany,
        clientId: selectedClient?.id || null,
        clientName: quoteInfo.clientName || selectedClient?.name,
        clientContact: quoteInfo.clientContact || selectedClient?.contact,
        email: quoteInfo.email,
        phone: quoteInfo.phone,
        clientAddress: quoteInfo.clientAddress || selectedClient?.fullAddress,
        clientPosition: quoteInfo.clientPosition || '',
        products: cartItems,
        terms: {
          paymentConditions: '100% Anticipado a la entrega. (Transferencia Bancaria)',
          deliveryTime: '15 días hábiles',
          warranty: 'Garantía: 12 meses sobre defectos de fabricación.',
          observations: 'Sin más por el momento, nos ponemos a sus órdenes para cualquier duda y/o información adicional.'
        }
      };

      console.log('📤 Creando y enviando cotización:', quoteData);
      
      const response = await quoteService.createQuote(quoteData);
      
      if (response.success) {
        await quoteService.updateQuoteStatus(response.data.id, 'sent');
        
        setGeneratedQuote({ ...quoteData, id: response.data.id, folio: response.data.folio });
        setSuccessMessage(`🚀 Cotización ${response.data.folio} enviada exitosamente a ${quoteInfo.email}`);
        console.log('✅ Quote sent:', response.data);
        
        setTimeout(() => {
          clearCart();
          onBack();
        }, 3000);
      } else {
        throw new Error(response.message || 'Error al enviar cotización');
      }
    } catch (error) {
      console.error('❌ Error sending quote:', error);
      setApiError(error.message || 'Error al enviar la cotización');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Función para generar PDF sin guardar en BD
  const handleGeneratePDF = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      console.log('📄 Generando PDF de cotización...');
      
      const quoteData = prepareQuoteDataForPDF();
      const selectedSellerCompany = sellerCompanies.find(company => company.id === quoteInfo.sellerCompany);
      
      // Generar PDF usando el servicio
      const result = await pdfService.generateAndDownloadQuotePDF(quoteData, selectedSellerCompany);
      
      if (result.success) {
        setSuccessMessage(`✅ PDF generado exitosamente: ${result.fileName}`);
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        throw new Error(result.error);
      }
      
    } catch (error) {
      console.error('❌ Error generating PDF:', error);
      setApiError('Error al generar PDF: ' + error.message);
    }
  };

  // Función para previsualizar PDF
  const handlePreviewPDF = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      console.log('👁️ Previsualizando PDF...');
      
      const quoteData = prepareQuoteDataForPDF();
      const selectedSellerCompany = sellerCompanies.find(company => company.id === quoteInfo.sellerCompany);
      
      const result = await pdfService.previewQuotePDF(quoteData, selectedSellerCompany);
      
      if (!result.success) {
        throw new Error(result.error);
      }
      
    } catch (error) {
      console.error('❌ Error previewing PDF:', error);
      setApiError('Error al previsualizar PDF: ' + error.message);
    }
  };

  // Obtener nombre de la empresa seleccionada para mostrar
  const getSelectedCompanyName = () => {
    const selected = sellerCompanies.find(company => company.id === quoteInfo.sellerCompany);
    return selected ? selected.name : 'No seleccionada';
  };

  const getSelectedCompanyData = () => {
    return sellerCompanies.find(company => company.id === quoteInfo.sellerCompany);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="flex items-center space-x-2"
          disabled={isSubmitting}
        >
          <ArrowLeft size={20} />
          <span>Volver al Carrito</span>
        </Button>
        <h1 className="text-2xl font-bold text-gray-800">Generar Cotización</h1>
      </div>

      {/* Mensajes de éxito */}
      {successMessage && (
        <Card className="border-green-200 bg-green-50">
          <div className="flex items-start space-x-3">
            <CheckCircle className="text-green-500 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <h4 className="text-green-800 font-medium">Éxito</h4>
              <p className="text-green-700">{successMessage}</p>
            </div>
          </div>
        </Card>
      )}

      {/* Error de API */}
      {apiError && (
        <Card className="border-red-200 bg-red-50">
          <div className="flex items-start space-x-3">
            <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <h4 className="text-red-800 font-medium">Error</h4>
              <p className="text-red-700">{apiError}</p>
            </div>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Company and Client Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Información de la Empresa Vendedora */}
          <Card>
            <div className="flex items-center space-x-3 mb-6">
              <Building className="w-6 h-6 text-green-600" />
              <h2 className="text-lg font-semibold">Empresa Vendedora</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Seleccionar Empresa *
                </label>
                <select
                  name="sellerCompany"
                  value={quoteInfo.sellerCompany || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  disabled={isSubmitting}
                >
                  <option value="">-- Selecciona una empresa --</option>
                  {sellerCompanies.map(company => (
                    <option key={company.id} value={company.id}>
                      {company.name}
                    </option>
                  ))}
                </select>
                {errors.sellerCompany && (
                  <p className="mt-1 text-sm text-red-600">{errors.sellerCompany}</p>
                )}
              </div>

              {quoteInfo.sellerCompany && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Building className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-green-800">
                      {getSelectedCompanyName()}
                    </span>
                  </div>
                  {getSelectedCompanyData() && (
                    <div className="text-sm text-green-700 space-y-1">
                      <p>{getSelectedCompanyData().fullName}</p>
                      <p>{getSelectedCompanyData().address}</p>
                      <p>{getSelectedCompanyData().phone} | {getSelectedCompanyData().email}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </Card>

          {/* Información del Cliente */}
          <Card>
            <div className="flex items-center space-x-3 mb-6">
              <User className="w-6 h-6 text-blue-600" />
              <h2 className="text-lg font-semibold">Información del Cliente</h2>
            </div>
            
            {/* Cliente seleccionado o búsqueda */}
            {selectedClient ? (
              <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-blue-900">{selectedClient.name}</h3>
                    <p className="text-blue-700">Contacto: {selectedClient.contact}</p>
                    <p className="text-blue-700">Email: {selectedClient.email}</p>
                    <p className="text-blue-700">Teléfono: {selectedClient.phone}</p>
                    {selectedClient.fullAddress && (
                      <p className="text-blue-700">Dirección: {selectedClient.fullAddress}</p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setSelectedClient(null);
                      setQuoteInfo({
                        ...quoteInfo,
                        clientId: null,
                        clientName: '',
                        company: '',
                        email: '',
                        phone: '',
                        clientContact: '',
                        clientAddress: ''
                      });
                    }}
                    className="text-blue-600 hover:text-blue-800"
                    disabled={isSubmitting}
                  >
                    Cambiar
                  </Button>
                </div>
              </div>
            ) : (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Buscar Cliente Existente
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Buscar por nombre, contacto o email..."
                    value={clientSearchTerm}
                    onChange={(e) => {
                      setClientSearchTerm(e.target.value);
                      setShowClientSearch(e.target.value.length > 0);
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isSubmitting}
                  />
                  {showClientSearch && clientSearchTerm && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {filteredClients.length > 0 ? (
                        filteredClients.map(client => (
                          <div
                            key={client.id}
                            onClick={() => handleClientSelect(client)}
                            className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                          >
                            <div className="font-medium">{client.name}</div>
                            <div className="text-sm text-gray-600">{client.contact} - {client.email}</div>
                          </div>
                        ))
                      ) : (
                        <div className="p-3 text-gray-500 text-center">
                          No se encontraron clientes
                        </div>
                      )}
                    </div>
                  )}
                </div>
                {errors.client && (
                  <p className="mt-1 text-sm text-red-600">{errors.client}</p>
                )}
              </div>
            )}

            <div className="space-y-4">
              <div className="text-sm text-gray-600 mb-4">
                {selectedClient ? 'Información del cliente seleccionado:' : 'O ingresa información manualmente:'}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Nombre del Cliente / Empresa"
                  name="clientName"
                  value={quoteInfo.clientName}
                  onChange={handleInputChange}
                  placeholder="Nombre completo o empresa"
                  disabled={isSubmitting}
                  error={errors.clientName}
                />
                
                <Input
                  label="Contacto Principal"
                  name="clientContact"
                  value={quoteInfo.clientContact}
                  onChange={handleInputChange}
                  placeholder="Persona de contacto"
                  disabled={isSubmitting}
                  error={errors.clientContact}
                />
                
                <Input
                  label="Email"
                  name="email"
                  type="email"
                  value={quoteInfo.email}
                  onChange={handleInputChange}
                  placeholder="correo@empresa.com"
                  required
                  disabled={isSubmitting}
                  error={errors.email}
                />
                
                <Input
                  label="Teléfono"
                  name="phone"
                  value={quoteInfo.phone}
                  onChange={handleInputChange}
                  placeholder="+52 961 123 4567"
                  disabled={isSubmitting}
                />
              </div>

              <Input
                label="Dirección"
                name="clientAddress"
                value={quoteInfo.clientAddress}
                onChange={handleInputChange}
                placeholder="Dirección completa"
                disabled={isSubmitting}
              />

              <Input
                label="Puesto del Contacto"
                name="clientPosition"
                value={quoteInfo.clientPosition}
                onChange={handleInputChange}
                placeholder="Ej: Director Médico, Jefe de Compras"
                disabled={isSubmitting}
              />
            </div>
          </Card>

          {/* Quote Items */}
          <Card>
            <h2 className="text-lg font-semibold mb-4">Productos Cotizados</h2>
            {cartItems.length > 0 ? (
              <div className="space-y-3">
                {cartItems.map(item => (
                  <div key={item.id} className="flex items-center justify-between py-3 border-b last:border-b-0">
                    <div className="flex-1">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-500">Código: {item.code}</p>
                      <p className="text-sm text-gray-600">{item.description}</p>
                      {item.brand && (
                        <p className="text-sm text-gray-500">Marca: {item.brand}</p>
                      )}
                    </div>
                    <div className="text-right ml-4">
                      <p className="font-medium">Cantidad: {item.quantity}</p>
                      <p className="text-blue-600 font-bold">
                        ${item.basePrice?.toLocaleString()} c/u
                      </p>
                      <p className="text-lg font-bold text-green-600">
                        ${((item.quantity || 1) * (item.basePrice || 0)).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No hay productos en el carrito</p>
                <Button onClick={onBack} className="mt-4" disabled={isSubmitting}>
                  Agregar Productos
                </Button>
              </div>
            )}
            {errors.products && (
              <p className="mt-2 text-sm text-red-600">{errors.products}</p>
            )}
          </Card>

          {/* Terms and Conditions Preview */}
          <Card>
            <h2 className="text-lg font-semibold mb-4">Condiciones de Venta</h2>
            <div className="space-y-3 text-sm">
              <div>
                <strong>Precios:</strong> LOS PRECIOS NO INCLUYEN IVA (16%)
              </div>
              <div>
                <strong>Moneda:</strong> Pesos Mexicanos
              </div>
              <div>
                <strong>Condiciones de Pago:</strong> 100% Anticipado a la entrega. (Transferencia Bancaria)
              </div>
              <div>
                <strong>Tiempo de Entrega:</strong> 15 días hábiles
              </div>
              <div>
                <strong>Garantía:</strong> 12 meses sobre defectos de fabricación. No aplica garantía en partes colocadas por personal no certificado.
              </div>
              <div>
                <strong>Observaciones:</strong> Sin más por el momento, nos ponemos a sus órdenes para cualquier duda y/o información adicional.
              </div>
            </div>
          </Card>
        </div>

        {/* Summary and Actions */}
        <div className="space-y-4">
          <CartSummary />
          
          {/* Resumen de la empresa seleccionada */}
          {quoteInfo.sellerCompany && (
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="flex items-center space-x-2 mb-2">
                <Building className="w-5 h-5 text-green-600" />
                <h4 className="font-medium text-green-800">Empresa Vendedora</h4>
              </div>
              <p className="text-sm text-green-700 font-medium">
                {getSelectedCompanyName()}
              </p>
            </div>
          )}
          
          {/* Botones de acción PDF */}
          <div className="space-y-3">
            <Button 
              onClick={handlePreviewPDF}
              variant="secondary"
              disabled={isSubmitting || cartItems.length === 0 || !quoteInfo.sellerCompany}
              className="w-full flex items-center justify-center space-x-2 bg-purple-50 text-purple-600 hover:bg-purple-100 border-purple-200"
            >
              <Eye size={20} />
              <span>Vista Previa PDF</span>
            </Button>
            
            <Button 
              onClick={handleGeneratePDF}
              variant="secondary"
              disabled={isSubmitting || cartItems.length === 0 || !quoteInfo.sellerCompany}
              className="w-full flex items-center justify-center space-x-2 bg-orange-50 text-orange-600 hover:bg-orange-100 border-orange-200"
            >
              <Download size={20} />
              <span>Descargar PDF</span>
            </Button>
          </div>
          
          {/* Botones principales */}
          <div className="space-y-3">
            <Button 
              onClick={handleSendQuote}
              disabled={isSubmitting || cartItems.length === 0 || !quoteInfo.sellerCompany}
              className="w-full flex items-center justify-center space-x-2"
            >
              <Send size={20} />
              <span>{isSubmitting ? 'Enviando...' : 'Enviar Cotización'}</span>
            </Button>
            
            <Button 
              onClick={handleSaveQuote}
              variant="secondary"
              disabled={isSubmitting || cartItems.length === 0 || !quoteInfo.sellerCompany}
              className="w-full flex items-center justify-center space-x-2"
            >
              <Save size={20} />
              <span>{isSubmitting ? 'Guardando...' : 'Guardar Borrador'}</span>
            </Button>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2">Información de Envío</h4>
            <p className="text-sm text-blue-600">
              La cotización será enviada por correo electrónico al cliente con todos los detalles y condiciones.
            </p>
          </div>

          {/* Additional Info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-800 mb-2">Próximos Pasos</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• La cotización se guardará en el sistema</li>
              <li>• Se enviará automáticamente por email</li>
              <li>• Podrás hacer seguimiento en el historial</li>
              <li>• El cliente podrá responder directamente</li>
            </ul>
          </div>

          {/* Información del PDF generado */}
          {generatedQuote && (
            <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
              <h4 className="font-medium text-indigo-800 mb-2">PDF Disponible</h4>
              <div className="text-sm text-indigo-700 space-y-1">
                <p>Folio: <span className="font-mono">{generatedQuote.folio}</span></p>
                <p>Fecha: {new Date().toLocaleDateString('es-MX')}</p>
                <div className="flex space-x-2 mt-3">
                  <Button
                    onClick={handleGeneratePDF}
                    variant="secondary"
                    className="flex-1 text-xs bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
                  >
                    <Download size={14} className="mr-1" />
                    Descargar
                  </Button>
                  <Button
                    onClick={handlePreviewPDF}
                    variant="secondary"
                    className="flex-1 text-xs bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
                  >
                    <Eye size={14} className="mr-1" />
                    Ver
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuoteBuilder;