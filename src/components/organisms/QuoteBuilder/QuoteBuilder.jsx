// src/components/organisms/QuoteBuilder/QuoteBuilder.jsx - COMPLETO CORREGIDO
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Send, Save, User, AlertCircle } from 'lucide-react';
import CartSummary from '../../molecules/CartSummary';
import Button from '../../atoms/Button';
import Input from '../../atoms/Input';
import Card from '../../atoms/Card';
import { useCart } from '../../../context/CartContext';
import quoteService from '../../services/quoteService';
import clientService from '../../services/clientService';

const QuoteBuilder = ({ onBack }) => {
  const { cartItems, quoteInfo, setQuoteInfo, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [showClientSearch, setShowClientSearch] = useState(false);
  const [clientSearchTerm, setClientSearchTerm] = useState('');

  // Cargar clientes al montar el componente
  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      const response = await clientService.getClients({ limit: 100 });
      if (response.success) {
        setClients(response.data || []);
      }
    } catch (error) {
      console.error('Error loading clients:', error);
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
  };

  // ✅ FUNCIÓN CORREGIDA: Auto-completar todos los campos
  const handleClientSelect = (client) => {
    console.log('🎯 Cliente seleccionado:', client);
    
    setSelectedClient(client);
    
    // ✅ CORREGIDO: Auto-completar TODOS los campos con los datos del cliente
    setQuoteInfo({
      ...quoteInfo,
      // IDs y referencias
      clientId: client.id,
      
      // Información básica (usar diferentes propiedades según como vengan del backend)
      clientName: client.nombre || client.name || '',
      company: client.nombre || client.name || '',
      
      // Contacto
      clientContact: client.contacto || client.contact || '',
      email: client.email || '',
      phone: client.telefono || client.phone || '',
      
      // Dirección (puede venir con diferentes nombres desde el backend)
      clientAddress: client.direccion || client.fullAddress || client.address || '',
      
      // Puesto (opcional, normalmente no viene del cliente)
      clientPosition: quoteInfo.clientPosition || ''
    });
    
    setShowClientSearch(false);
    setClientSearchTerm('');
    
    // Limpiar errores de cliente
    if (errors.client) {
      setErrors(prev => ({
        ...prev,
        client: ''
      }));
    }
    
    console.log('✅ Información actualizada:', {
      clientName: client.nombre || client.name,
      clientContact: client.contacto || client.contact,
      email: client.email,
      phone: client.telefono || client.phone,
      clientAddress: client.direccion || client.fullAddress
    });
  };

  // ✅ FILTRO CORREGIDO: Manejo de valores undefined
  const filteredClients = clients.filter(client => {
    const searchTerm = clientSearchTerm.toLowerCase();
    const nombre = (client.nombre || '').toLowerCase();
    const contacto = (client.contacto || '').toLowerCase();
    const email = (client.email || '').toLowerCase();
    
    return nombre.includes(searchTerm) ||
           contacto.includes(searchTerm) ||
           email.includes(searchTerm);
  });

  const validateForm = () => {
    const newErrors = {};

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

  const handleSaveQuote = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setApiError('');

    try {
      const quoteData = {
        clientId: selectedClient?.id || null,
        clientName: quoteInfo.clientName || selectedClient?.nombre,
        clientContact: quoteInfo.clientContact || selectedClient?.contacto,
        email: quoteInfo.email,
        phone: quoteInfo.phone,
        clientAddress: quoteInfo.clientAddress || selectedClient?.direccion,
        clientPosition: quoteInfo.clientPosition || '',
        products: cartItems,
        terms: {
          paymentConditions: '100% Anticipado a la entrega. (Transferencia Bancaria)',
          deliveryTime: '15 días hábiles',
          warranty: 'Garantía: 12 meses sobre defectos de fabricación.',
          observations: 'Sin más por el momento, nos ponemos a sus órdenes para cualquier duda y/o información adicional.'
        }
      };

      console.log('Saving quote as draft:', quoteData);
      
      const response = await quoteService.createQuote(quoteData);
      
      if (response.success) {
        alert('Cotización guardada como borrador');
        console.log('Quote saved:', response.data);
      } else {
        throw new Error(response.message || 'Error al guardar cotización');
      }
    } catch (error) {
      console.error('Error saving quote:', error);
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

    try {
      const quoteData = {
        clientId: selectedClient?.id || null,
        clientName: quoteInfo.clientName || selectedClient?.nombre,
        clientContact: quoteInfo.clientContact || selectedClient?.contacto,
        email: quoteInfo.email,
        phone: quoteInfo.phone,
        clientAddress: quoteInfo.clientAddress || selectedClient?.direccion,
        clientPosition: quoteInfo.clientPosition || '',
        products: cartItems,
        terms: {
          paymentConditions: '100% Anticipado a la entrega. (Transferencia Bancaria)',
          deliveryTime: '15 días hábiles',
          warranty: 'Garantía: 12 meses sobre defectos de fabricación.',
          observations: 'Sin más por el momento, nos ponemos a sus órdenes para cualquier duda y/o información adicional.'
        }
      };

      console.log('Creating and sending quote:', quoteData);
      
      // Crear cotización
      const response = await quoteService.createQuote(quoteData);
      
      if (response.success) {
        // Actualizar estado a "enviado"
        await quoteService.updateQuoteStatus(response.data.id, 'sent');
        
        alert('Cotización enviada exitosamente');
        console.log('Quote sent:', response.data);
        
        // Limpiar carrito y volver
        clearCart();
        onBack();
      } else {
        throw new Error(response.message || 'Error al enviar cotización');
      }
    } catch (error) {
      console.error('Error sending quote:', error);
      setApiError(error.message || 'Error al enviar la cotización');
    } finally {
      setIsSubmitting(false);
    }
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
        {/* Client Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* ✅ SECCIÓN CORREGIDA: Información del Cliente */}
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
                    <h3 className="font-medium text-blue-900">{selectedClient.nombre}</h3>
                    <p className="text-blue-700">Contacto: {selectedClient.contacto}</p>
                    <p className="text-blue-700">Email: {selectedClient.email}</p>
                    <p className="text-blue-700">Teléfono: {selectedClient.telefono}</p>
                    {selectedClient.direccion && (
                      <p className="text-blue-700">Dirección: {selectedClient.direccion}</p>
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
                            <div className="font-medium">{client.nombre}</div>
                            <div className="text-sm text-gray-600">{client.contacto} - {client.email}</div>
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
                  // ✅ CAMBIADO: Ya no se deshabilita cuando hay cliente seleccionado
                />
                
                <Input
                  label="Contacto Principal"
                  name="clientContact"
                  value={quoteInfo.clientContact}
                  onChange={handleInputChange}
                  placeholder="Persona de contacto"
                  disabled={isSubmitting}
                  error={errors.clientContact}
                  // ✅ CAMBIADO: Ya no se deshabilita cuando hay cliente seleccionado
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
                  // ✅ Email siempre se puede editar por si necesita enviar a otro email
                />
                
                <Input
                  label="Teléfono"
                  name="phone"
                  value={quoteInfo.phone}
                  onChange={handleInputChange}
                  placeholder="+52 961 123 4567"
                  disabled={isSubmitting}
                  // ✅ CAMBIADO: Ya no se deshabilita cuando hay cliente seleccionado
                />
              </div>

              <Input
                label="Dirección"
                name="clientAddress"
                value={quoteInfo.clientAddress}
                onChange={handleInputChange}
                placeholder="Dirección completa"
                disabled={isSubmitting}
                // ✅ CAMBIADO: Ya no se deshabilita cuando hay cliente seleccionado
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
                <Button onClick={onBack} className="mt-4">
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
          
          <div className="space-y-3">
            <Button 
              onClick={handleSendQuote}
              disabled={isSubmitting || cartItems.length === 0}
              className="w-full flex items-center justify-center space-x-2"
            >
              <Send size={20} />
              <span>{isSubmitting ? 'Enviando...' : 'Enviar Cotización'}</span>
            </Button>
            
            <Button 
              onClick={handleSaveQuote}
              variant="secondary"
              disabled={isSubmitting || cartItems.length === 0}
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
        </div>
      </div>
    </div>
  );
};

export default QuoteBuilder;