// src/components/organisms/QuoteBuilder/QuoteBuilder.jsx - ACTUALIZADO CON HOSPITALES COMO CLIENTES
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Save, User, AlertCircle, CheckCircle, Building, Download, Eye, Phone, Mail, MapPin, Briefcase } from 'lucide-react';
import CartSummary from '../../molecules/CartSummary';
import Button from '../../atoms/Button';
import Input from '../../atoms/Input';
import Card from '../../atoms/Card';
import EmailButton from '../../atoms/EmailButton';
import EmailQuoteModal from '../../modals/EmailQuoteModal';
import { useCart } from '../../../context/CartContext';
import quoteService from '../../../services/quoteService';
import clientService from '../../../services/clientService';
import pdfService from '../../../services/pdfService';
import localStorageService from '../../../services/localStorageService';

const QuoteBuilder = ({ onBack }) => {
  const { cartItems, quoteInfo, setQuoteInfo, clearCart, setCartItems } = useCart();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showClientSearch, setShowClientSearch] = useState(false);
  const [clientSearchTerm, setClientSearchTerm] = useState('');
  const [generatedQuote, setGeneratedQuote] = useState(null);
  const [isEditingMode, setIsEditingMode] = useState(false);
  const [editingQuoteData, setEditingQuoteData] = useState(null);
  const [showEmailModal, setShowEmailModal] = useState(false);

  const sellerCompanies = [
    { 
      id: 'conduit-life', 
      name: 'CONDUIT LIFE',
      fullName: 'Conduit Life S.A. de C.V.',
      address: 'Camino Real a Xochitepec 108 PA, Colonia La Noria Xochimilco, CDMX CP: 16030',
      phone: '+52 961 123 4567',
      email: 'contacto@conduitlife.com',
      website: 'www.conduitlife.com',
      rfc: 'CLI150120328'
    },
    { 
      id: 'biosystems-hls', 
      name: 'BIOSYSTEMS HLS',
      fullName: 'Biosystems HLS S.A. de C.V.',
      address: 'Camino Real a Xochitepec 108 PA, Colonia La Noria Xochimilco, CDMX CP: 16030',
      rfc: 'BHL130614LQ4'
    },
    { 
      id: 'ingenieria-clinica', 
      name: 'INGENIERÍA CLÍNICA Y DISEÑO',
      fullName: 'Ingeniería Clínica y Diseño S.A. de C.V.',
      address: 'Viena 68, Colonia Del Carmen, Alcaldía Coyoacán, CP. 04100 CDMX',

      rfc: 'ICD090619J79'
    },
    { 
      id: 'escala-biomedica', 
      name: 'ESCALA BIOMÉDICA',
      fullName: 'Escala Biomédica S.A. de C.V.',
      address: 'Av. Insurgentes 682 int. 706, Colonia Del Valle Norte, Benito Juárez CP. 03103 CDMX',
      rfc: 'EBI1081216T38'
    }
  ];

  // Cargar clientes al montar el componente y verificar datos de edición
  useEffect(() => {
    console.log('🚀 QuoteBuilder montado, iniciando carga...');
    
    const initializeComponent = async () => {
      try {
        // Primero verificar si hay datos de edición
        const editingData = localStorage.getItem('editingQuote');
        console.log('🔍 Datos de edición disponibles:', !!editingData);
        
        // Cargar clientes
        await loadClients();
        
        // Cargar datos de edición si existen
        loadEditingQuoteData();
        
        // Establecer empresa por defecto solo si no estamos editando
        if (!quoteInfo.sellerCompany && !editingData) {
          setQuoteInfo(prev => ({
            ...prev,
            sellerCompany: 'ingenieria-clinica' // ICD como empresa por defecto según la imagen
          }));
        }
      } catch (error) {
        console.error('❌ Error inicializando QuoteBuilder:', error);
        setApiError('Error al inicializar: ' + error.message);
      }
    };

    initializeComponent();
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

  // Cargar datos de cotización para editar
  const loadEditingQuoteData = () => {
    try {
      const editingData = localStorage.getItem('editingQuote');
      console.log('🔍 Verificando datos de edición en localStorage:', !!editingData);
      
      if (editingData) {
        const parsedData = JSON.parse(editingData);
        console.log('📝 Datos de cotización encontrados para edición:', parsedData);
        
        // Establecer modo edición
        setIsEditingMode(true);
        setEditingQuoteData(parsedData);
        
        // Cargar información del cliente en el formulario
        if (parsedData.clientInfo) {
          console.log('👤 Cargando información del cliente:', parsedData.clientInfo);
          setQuoteInfo(prev => ({
            ...prev,
            clientName: parsedData.clientInfo.clientName || '',
            clientContact: parsedData.clientInfo.clientContact || '',
            email: parsedData.clientInfo.email || '',
            phone: parsedData.clientInfo.phone || '',
            clientAddress: parsedData.clientInfo.clientAddress || '',
            clientPosition: parsedData.clientInfo.clientPosition || '',
            sellerCompany: parsedData.sellerCompanyId || 'ingenieria-clinica'
          }));
        }
        
        // Cargar productos al carrito - SOLO si el carrito está vacío o no se ha navegado desde edición
        const navigatingFromEdit = localStorage.getItem('navigatingFromEdit');
        const currentCartItemsCount = cartItems.length;
        
        console.log('🔍 Estado del carrito:', {
          navegandoDesdeEdicion: !!navigatingFromEdit,
          productosEnCarritoActual: currentCartItemsCount,
          productosEnDatosEdicion: parsedData.cartItems?.length || 0,
          flagEnLocalStorage: navigatingFromEdit
        });
        
        // Solo sobrescribir el carrito si NO venimos de agregar productos
        if (!navigatingFromEdit) {
          if (parsedData.cartItems && Array.isArray(parsedData.cartItems)) {
            console.log('🛒 Cargando productos originales al carrito:', parsedData.cartItems);
            
            // Usar setTimeout para asegurar que el estado se actualice correctamente
            setTimeout(() => {
              // Limpiar carrito actual
              clearCart();
              
              // Mapear productos al formato del carrito y agregarlos
              const cartItemsFormatted = parsedData.cartItems.map(item => ({
                ...item,
                totalPrice: item.quantity * item.basePrice,
                selectedAccessories: item.selectedAccessories || []
              }));
              
              console.log('📦 Productos formateados para el carrito:', cartItemsFormatted);
              setCartItems(cartItemsFormatted);
              
              // Mostrar mensaje de éxito
              setSuccessMessage(`✅ Editando cotización ${parsedData.folio}. ${parsedData.cartItems.length} productos cargados.`);
              
              // Auto-cerrar el mensaje de éxito después de 8 segundos
              setTimeout(() => setSuccessMessage(''), 8000);
              
            }, 100);
          } else {
            // Si no hay productos, mostrar mensaje
            console.log('⚠️ No se encontraron productos en la cotización para editar');
            setSuccessMessage(`✅ Editando cotización ${parsedData.folio}. Sin productos.`);
            setTimeout(() => setSuccessMessage(''), 5000);
          }
        } else {
          // Venimos de agregar productos, mantener el carrito actual
          console.log('🔄 Manteniendo productos actuales del carrito (se agregaron productos adicionales)');
          console.log('📦 Productos actuales en carrito:', currentCartItemsCount);
          console.log('🏷️ Flag navigatingFromEdit encontrado:', navigatingFromEdit);
          
          // Mostrar mensaje indicando que se mantuvieron los productos agregados
          const productosOriginales = parsedData.cartItems?.length || 0;
          const productosAgregados = Math.max(0, currentCartItemsCount - productosOriginales);
          
          setSuccessMessage(`✅ Editando cotización ${parsedData.folio}. ${currentCartItemsCount} productos total (${productosOriginales} originales + ${productosAgregados} agregados).`);
          setTimeout(() => setSuccessMessage(''), 8000);
          
          // Limpiar el flag para futuras navegaciones (con delay para asegurar que se procese)
          setTimeout(() => {
            localStorage.removeItem('navigatingFromEdit');
          }, 500);
        }
        
        // NO eliminar los datos de localStorage aún, los eliminaremos cuando se guarde/actualice
        console.log('ℹ️ Datos de edición mantenidos en localStorage para referencia');
        
      } else {
        console.log('ℹ️ No hay datos de edición en localStorage');
        setIsEditingMode(false);
        setEditingQuoteData(null);
      }
    } catch (error) {
      console.error('❌ Error cargando datos de edición:', error);
      setApiError('Error al cargar datos para edición: ' + error.message);
      // Limpiar datos corruptos
      localStorage.removeItem('editingQuote');
      setIsEditingMode(false);
      setEditingQuoteData(null);
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

  // Función actualizada para manejar selección de cliente con datos de hospital
  const handleClientSelect = (client) => {
    console.log('🎯 Cliente seleccionado (raw):', client);
    
    // Usar directamente los campos del backend que ya están disponibles
    const hospitalName = client.hospitalName || client.name || 'Hospital no especificado';
    const dependencia = client.dependencia || client.contact || 'Sin dependencia';
    const empresaResponsable = client.name || 'No especificado';
    
    // Parsear encargados si existen en notes
    let encargados = [];
    if (client.notes) {
      try {
        const additionalData = JSON.parse(client.notes);
        if (additionalData.encargados && Array.isArray(additionalData.encargados)) {
          encargados = additionalData.encargados.filter(enc => enc.nombre && enc.nombre.trim());
        }
      } catch (error) {
        console.warn('Error parsing client notes:', error);
      }
    }
    
    // Si no hay encargados, crear uno del contacto principal
    if (encargados.length === 0) {
      encargados = [{
        id: 1,
        nombre: client.contact || 'Contacto Principal',
        cargo: 'Responsable',
        telefono: client.phone || '',
        email: client.email || ''
      }];
    }
    
    // USAR EL SEGUNDO ENCARGADO para los campos de contacto, si existe, si no el primero
    const encargadoPrincipal = encargados.length >= 2 ? encargados[1] : encargados[0];
    
    setSelectedClient({
      id: client.id,
      name: hospitalName, // Hospital como nombre principal
      contact: encargadoPrincipal.nombre,
      email: encargadoPrincipal.email,
      phone: encargadoPrincipal.telefono,
      fullAddress: client.fullAddress || client.street || '',
      // Datos adicionales del hospital
      hospital: hospitalName,
      empresaResponsable: empresaResponsable,
      dependencia: dependencia,
      encargados: encargados
    });
    
    // Rellenar formulario con datos del hospital
    setQuoteInfo({
      ...quoteInfo,
      clientId: client.id,
      clientName: hospitalName, // Hospital como nombre principal
      company: hospitalName,
      clientContact: encargadoPrincipal.nombre,
      email: encargadoPrincipal.email,
      phone: encargadoPrincipal.telefono,
      clientAddress: client.fullAddress || client.street || '',
      clientPosition: encargadoPrincipal.cargo || ''
    });
    
    setShowClientSearch(false);
    setClientSearchTerm('');
    
    if (errors.client) {
      setErrors(prev => ({
        ...prev,
        client: ''
      }));
    }
    
    console.log('✅ Información del hospital actualizada como cliente');
  };

  // Función para seleccionar un contacto específico del hospital
  const handleContactSelect = (encargado) => {
    console.log('👤 Contacto seleccionado:', encargado);
    
    // Actualizar solo los datos del contacto, mantener el resto del hospital
    setQuoteInfo({
      ...quoteInfo,
      clientContact: encargado.nombre,
      email: encargado.email || '',
      phone: encargado.telefono || '',
      clientPosition: encargado.cargo || ''
    });
    
    console.log('✅ Datos del contacto actualizados en el formulario');
  };

  // Función actualizada para filtrar clientes por hospital principalmente
  const filteredClients = clients.filter(client => {
    const searchTerm = clientSearchTerm.toLowerCase();
    
    // Usar directamente los campos del backend - SIN mapear
    const hospitalName = (client.hospitalName || client.name || '').toLowerCase();
    const empresaResponsable = (client.name || '').toLowerCase();
    const dependencia = (client.contact || '').toLowerCase();
    const ciudad = (client.city || '').toLowerCase();
    const estado = (client.state || '').toLowerCase();
    const ubicacion = `${ciudad} ${estado}`.toLowerCase();
    
    console.log('🔍 Buscando:', searchTerm, 'en hospital:', hospitalName);
    
    // Buscar en múltiples campos - PRINCIPALMENTE EN HOSPITALNAME
    return hospitalName.includes(searchTerm) ||
           empresaResponsable.includes(searchTerm) ||
           dependencia.includes(searchTerm) ||
           ciudad.includes(searchTerm) ||
           estado.includes(searchTerm);
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

  // Refuerza la función para folio único
  const generateFolio = () => {
    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear().toString().slice(-2);
    const hour = String(date.getHours()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');
    const sec = String(date.getSeconds()).padStart(2, '0');
    const ms = String(date.getMilliseconds()).padStart(3, '0');
    const random = Math.floor(Math.random() * 10000) + 1; // 1-9999
    let prefix = 'ICD';
    if (quoteInfo.sellerCompany === 'biosystems-hls') prefix = 'BHL';
    if (quoteInfo.sellerCompany === 'conduit-life') prefix = 'CLF';
    if (quoteInfo.sellerCompany === 'escala-biomedica') prefix = 'EBI';
    // Folio: PREFIJODDMMYYHHMMSSMSRRRR
    return `${prefix}${day}${month}${year}${hour}${min}${sec}${ms}${random}`;
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
      
      // Normalizar productos antes de guardar/enviar
      const normalizedProducts = cartItems.map(item => ({
        ...item,
        quantity: Number(item.quantity) || 1,
        basePrice: Number(item.basePrice) || 0,
      }));
      const total = normalizedProducts.reduce((sum, item) => sum + (item.quantity * item.basePrice), 0);
      
      const quoteData = {
        sellerCompany: selectedSellerCompany?.name || '',
        sellerCompanyId: quoteInfo.sellerCompany,
        clientName: quoteInfo.clientName || selectedClient?.name,
        clientContact: quoteInfo.clientContact || selectedClient?.contact,
        email: quoteInfo.email,
        phone: quoteInfo.phone,
        clientAddress: quoteInfo.clientAddress || selectedClient?.fullAddress,
        clientPosition: quoteInfo.clientPosition || '',
        products: normalizedProducts,
        total,
        folio: generateFolio(), // <--- Asegura folio único
        terms: {
          paymentConditions: '100% Anticipado a la entrega. (Transferencia Bancaria)',
          deliveryTime: '15 días hábiles',
          warranty: 'Garantía: 12 meses sobre defectos de fabricación.',
          observations: 'Sin más por el momento, nos ponemos a sus órdenes para cualquier duda y/o información adicional.'
        }
      };
      
      // Solo agregar clientId si hay un cliente seleccionado de la BD
      if (selectedClient?.id) {
        quoteData.clientId = selectedClient.id;
      }
      
      console.log('📝 Datos de cotización para guardar:', {
        ...quoteData,
        products: `${quoteData.products.length} productos`,
        hasClientId: !!quoteData.clientId,
        selectedClient: !!selectedClient
      });

      if (isEditingMode && editingQuoteData) {
        // Modo edición: actualizar cotización existente
        console.log('✏️ Actualizando cotización existente:', editingQuoteData.quoteId);
        console.log('📦 Productos que se van a guardar (actuales del carrito):', cartItems);
        console.log('📊 Total de productos a guardar:', cartItems.length);
        
        const response = await quoteService.updateQuote(editingQuoteData.quoteId, quoteData);
        
        if (response.success) {
          setGeneratedQuote({ ...quoteData, id: editingQuoteData.quoteId, folio: editingQuoteData.folio });
          setSuccessMessage(`✅ Cotización ${editingQuoteData.folio} actualizada exitosamente`);
          console.log('✅ Quote updated:', response.data);
          
          // Limpiar datos de edición
          localStorage.removeItem('editingQuote');
          setIsEditingMode(false);
          setEditingQuoteData(null);
          
          // Marcar que se debe recargar el historial
          sessionStorage.setItem('reloadHistory', 'true');
          
          setTimeout(() => {
            setSuccessMessage('');
            
            // Redirigir al historial después de actualizar para ver los cambios
            navigate('/historial');
          }, 2000);
        } else {
          throw new Error(response.message || 'Error al actualizar cotización');
        }
      } else {
        // Modo normal: crear nueva cotización
        console.log('💾 Guardando nueva cotización como borrador:', quoteData);
        
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
      }
    } catch (error) {
      console.error('❌ Error saving quote:', error);
      setApiError(error.message || `Error al ${isEditingMode ? 'actualizar' : 'guardar'} la cotización`);
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
      
      // Normalizar productos antes de guardar/enviar
      const normalizedProducts = cartItems.map(item => ({
        ...item,
        quantity: Number(item.quantity) || 1,
        basePrice: Number(item.basePrice) || 0,
      }));
      const total = normalizedProducts.reduce((sum, item) => sum + (item.quantity * item.basePrice), 0);
      
      const quoteData = {
        sellerCompany: selectedSellerCompany?.name || '',
        sellerCompanyId: quoteInfo.sellerCompany,
        clientName: quoteInfo.clientName || selectedClient?.name,
        clientContact: quoteInfo.clientContact || selectedClient?.contact,
        email: quoteInfo.email,
        phone: quoteInfo.phone,
        clientAddress: quoteInfo.clientAddress || selectedClient?.fullAddress,
        clientPosition: quoteInfo.clientPosition || '',
        products: normalizedProducts,
        total,
        folio: generateFolio(), // <--- Asegura folio único
        terms: {
          paymentConditions: '100% Anticipado a la entrega. (Transferencia Bancaria)',
          deliveryTime: '15 días hábiles',
          warranty: 'Garantía: 12 meses sobre defectos de fabricación.',
          observations: 'Sin más por el momento, nos ponemos a sus órdenes para cualquier duda y/o información adicional.'
        }
      };
      
      // Solo agregar clientId si hay un cliente seleccionado de la BD
      if (selectedClient?.id) {
        quoteData.clientId = selectedClient.id;
      }

      console.log('� Datos de cotización para enviar:', {
        ...quoteData,
        products: `${quoteData.products.length} productos`,
        hasClientId: !!quoteData.clientId,
        selectedClient: !!selectedClient
      });

      console.log('�📤 Creando cotización y preparando envío por WhatsApp');
      console.log('📦 Productos que se van a enviar (actuales del carrito):', cartItems);
      console.log('📊 Total de productos a enviar:', cartItems.length);
      
      let quoteFolio = null;
      let quoteId = null;
      let savedInBD = false;
      let wasEditingMode = isEditingMode && editingQuoteData; // Guardar antes de limpiar
      
      // Verificar si estamos en modo edición
      if (isEditingMode && editingQuoteData) {
        // Modo edición: actualizar cotización existente (copiado exactamente del botón "Actualizar")
        console.log('✏️ Actualizando cotización existente:', editingQuoteData.quoteId);
        console.log('📦 Productos que se van a guardar (actuales del carrito):', cartItems);
        console.log('📊 Total de productos a guardar:', cartItems.length);
        
        const response = await quoteService.updateQuote(editingQuoteData.quoteId, quoteData);
        
        if (response.success) {
          setGeneratedQuote({ ...quoteData, id: editingQuoteData.quoteId, folio: editingQuoteData.folio });
          console.log('✅ Quote updated:', response.data);
          
          // Limpiar datos de edición
          localStorage.removeItem('editingQuote');
          setIsEditingMode(false);
          setEditingQuoteData(null);
          
          // Marcar que se debe recargar el historial
          sessionStorage.setItem('reloadHistory', 'true');
          
          quoteFolio = editingQuoteData.folio;
          quoteId = editingQuoteData.quoteId;
          savedInBD = true;
        } else {
          throw new Error(response.message || 'Error al actualizar cotización');
        }
      } else {
        // Modo normal: crear nueva cotización (BD primero, local como respaldo)
        try {
          const response = await quoteService.createQuote(quoteData);
          
          if (response.success) {
            await quoteService.updateQuoteStatus(response.data.id, 'sent');
            quoteFolio = response.data.folio;
            quoteId = response.data.id;
            savedInBD = true;
            console.log('✅ Cotización guardada en BD:', quoteFolio);
          } else {
            throw new Error(response.message || 'Error al guardar en BD');
          }
        } catch (bdError) {
          console.warn('⚠️ No se pudo guardar en BD, guardando localmente:', bdError.message);
          
          // Si falla la BD, guardar localmente
          const localResult = localStorageService.saveLocalQuote(quoteData);
          
          if (localResult.success) {
            quoteFolio = localResult.data.folio;
            quoteId = localResult.data.id;
            console.log('✅ Cotización guardada localmente:', quoteFolio);
          } else {
            throw new Error('Error al guardar cotización: ' + localResult.error);
          }
        }
      }
      
      // 2. Generar PDF para WhatsApp
      console.log('📄 Generando PDF para envío por WhatsApp...');
      const pdfQuoteData = prepareQuoteDataForPDF();
      pdfQuoteData.folio = quoteFolio;
      
      const pdfResult = await pdfService.generateAndDownloadQuotePDF(pdfQuoteData, selectedSellerCompany);
      
      if (pdfResult.success) {
        // 3. Preparar mensaje de WhatsApp
        const hospitalName = quoteInfo.clientName || selectedClient?.name;
        const contactName = quoteInfo.clientContact || selectedClient?.contact;
        const companyName = selectedSellerCompany?.name || 'Nuestra empresa';
        
        const whatsappMessage = `*Cotización ${quoteFolio}*

Estimado/a ${contactName},

Esperamos se encuentre bien. Por medio del presente, nos es grato hacerle llegar la cotización solicitada para ${hospitalName}.

*Detalles de la cotización:*
• Folio: ${quoteFolio}
• Fecha: ${new Date().toLocaleDateString('es-MX')}
• Productos: ${cartItems.length} artículo${cartItems.length !== 1 ? 's' : ''}
• Hospital: ${hospitalName}

Adjunto encontrará el PDF con todos los detalles, especificaciones técnicas y condiciones comerciales.

Quedamos a su disposición para cualquier duda o aclaración.

Saludos cordiales,
${companyName}`;

        // 4. Obtener número de teléfono del cliente
        let phoneNumber = quoteInfo.phone || selectedClient?.phone || '';
        
        // Limpiar número de teléfono (solo dígitos)
        phoneNumber = phoneNumber.replace(/\D/g, '');
        
        // Si el número no empieza con código de país, agregar +52 (México)
        if (phoneNumber.length === 10) {
          phoneNumber = '52' + phoneNumber;
        } else if (phoneNumber.startsWith('521')) {
          // Ya tiene código de país
        } else if (!phoneNumber.startsWith('52')) {
          phoneNumber = '52' + phoneNumber;
        }
        
        // 5. Crear URL de WhatsApp
        const encodedMessage = encodeURIComponent(whatsappMessage);
        const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
        
        console.log('📱 Abriendo WhatsApp:', whatsappURL);
        
        // 6. Abrir WhatsApp en nueva ventana
        window.open(whatsappURL, '_blank');
        
        setGeneratedQuote({ ...quoteData, id: quoteId, folio: quoteFolio });
        const storageType = savedInBD ? 'en base de datos' : 'localmente';
        const actionType = wasEditingMode ? 'actualizada' : 'guardada';
        setSuccessMessage(`✅ Cotización ${quoteFolio} ${actionType} ${storageType} exitosamente. Se abrió WhatsApp para envío.`);
        console.log('✅ Quote saved and WhatsApp opened:', quoteFolio);
        
        // 7. Redirigir al historial después de un momento
        setTimeout(() => {
          // Marcar que se debe recargar el historial
          sessionStorage.setItem('reloadHistory', 'true');
          clearCart();
          navigate('/historial');
        }, 3000);
      } else {
        throw new Error('Error al generar PDF: ' + pdfResult.error);
      }
    } catch (error) {
      console.error('❌ Error enviando cotización por WhatsApp:', error);
      setApiError(error.message || 'Error al enviar la cotización por WhatsApp');
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
    <div className="min-h-screen bg-gray-50">
      {/* Header profesional con gradiente */}
      <div className="bg-gradient-to-r from-slate-700 to-slate-800 text-white shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                onClick={onBack}
                className="flex items-center space-x-2 text-white hover:bg-white/10 border-white/20"
                disabled={isSubmitting}
              >
                <ArrowLeft size={20} />
                <span>Volver al Carrito</span>
              </Button>
              
              {/* Botón para agregar productos cuando estamos en modo edición */}
              {isEditingMode && (
                <Button 
                  variant="ghost"
                  onClick={() => {
                    // Marcar que estamos navegando desde edición para mantener el contexto
                    localStorage.setItem('navigatingFromEdit', 'true');
                    navigate('/cotizar');
                  }}
                  className="flex items-center space-x-2 text-white hover:bg-white/10 border-white/20"
                  disabled={isSubmitting}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>Agregar Productos</span>
                </Button>
              )}
              
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30">
                  <Send className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-extrabold tracking-tight">
                    {isEditingMode ? `Editar Cotización` : 'Generar Cotización'}
                    {isEditingMode && editingQuoteData && (
                      <span className="text-lg font-normal ml-2 opacity-75">
                        {editingQuoteData.folio}
                      </span>
                    )}
                  </h1>
                </div>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/20 text-white">
                {cartItems.length} {cartItems.length === 1 ? 'producto' : 'productos'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* Mensajes de éxito mejorados */}
        {successMessage && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-400 rounded-lg p-6 shadow-sm">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                </div>
              </div>
              <div className="flex-1">
                <h4 className="text-green-800 font-semibold text-lg">Operación Exitosa</h4>
                <p className="text-green-700 mt-1">{successMessage}</p>
              </div>
            </div>
          </div>
        )}

        {/* Mensaje informativo de modo edición */}
        {isEditingMode && editingQuoteData && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-400 rounded-lg p-6 shadow-sm">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
              </div>
              <div className="flex-1">
                <h4 className="text-blue-800 font-semibold text-lg">Editando Cotización {editingQuoteData.folio}</h4>
                <p className="text-blue-700 mt-1">
                  Puedes modificar los datos del cliente, agregar o quitar productos, y actualizar la cotización. 
                  Usa el botón "Agregar Productos" para explorar el catálogo y añadir más equipos.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Error de API mejorado */}
        {apiError && (
          <div className="bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-red-400 rounded-lg p-6 shadow-sm">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                </div>
              </div>
              <div className="flex-1">
                <h4 className="text-red-800 font-semibold text-lg">Error en el Sistema</h4>


                <p className="text-red-700 mt-1">{apiError}</p>
              </div>
            </div>
          </div>
        )}
    
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Company and Client Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Información de la Empresa Vendedora */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
                  <Building className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Empresa Vendedora</h2>
                  <p className="text-sm text-gray-500">Selecciona la empresa que realizará la cotización</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Seleccionar Empresa *
                  </label>
                  <select
                    name="sellerCompany"
                    value={quoteInfo.sellerCompany || ''}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 shadow-sm"
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
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.sellerCompany}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Información del Cliente */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center">
                  <User className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Información del Cliente</h2>
                  <p className="text-sm text-gray-500">Selecciona un hospital existente o ingresa datos nuevos</p>
                </div>
              </div>
              
              {/* Cliente seleccionado o búsqueda */}
              {selectedClient ? (
                <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      {/* Hospital como título principal */}
                      <div className="flex items-center space-x-2 mb-2">
                        <Building className="w-5 h-5 text-blue-600" />
                        <h3 className="font-bold text-blue-900">
                          {selectedClient.hospital || selectedClient.name}
                        </h3>
                      </div>
                      
                      {/* Información organizada */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-blue-600 font-medium">Dependencia:</span>
                          <p className="text-blue-800">{selectedClient.dependencia || 'No especificado'}</p>
                        </div>
                        
                        <div>
                          <span className="text-blue-600 font-medium">Empresa Responsable:</span>
                          <p className="text-blue-800">{selectedClient.empresaResponsable || 'No especificado'}</p>
                        </div>
                        
                        {selectedClient.fullAddress && (
                          <div className="md:col-span-2">
                            <span className="text-blue-600 font-medium">Dirección:</span>
                            <p className="text-blue-800">{selectedClient.fullAddress}</p>
                          </div>
                        )}
                      </div>

                      {/* Selector de contacto principal si hay múltiples encargados */}
                      {selectedClient.encargados && selectedClient.encargados.length > 1 && (
                        <div className="mt-4 p-3 bg-white border border-blue-300 rounded-lg">
                          <label className="block text-sm font-medium text-blue-700 mb-2">
                            Seleccionar Contacto Principal ({selectedClient.encargados.length} disponibles):
                          </label>
                          <div className="space-y-2">
                            {selectedClient.encargados.map((encargado, index) => (
                              <div
                                key={encargado.id || index}
                                onClick={() => handleContactSelect(encargado)}
                                className={`p-3 border rounded-lg cursor-pointer transition-all ${
                                  quoteInfo.clientContact === encargado.nombre
                                    ? 'border-blue-500 bg-blue-50 shadow-sm'
                                    : 'border-gray-200 hover:border-blue-300 hover:bg-blue-25'
                                }`}
                              >
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <div className="flex items-center space-x-2">
                                      <User className="w-4 h-4 text-blue-600" />
                                      <span className="font-medium text-blue-900">{encargado.nombre}</span>
                                      {quoteInfo.clientContact === encargado.nombre && (
                                        <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full font-medium">
                                          Seleccionado
                                        </span>
                                      )}
                                    </div>
                                    <div className="mt-1 space-y-1 text-sm text-gray-600">
                                      {encargado.cargo && (
                                        <div className="flex items-center space-x-2">
                                          <Briefcase className="w-3 h-3" />
                                          <span>{encargado.cargo}</span>
                                        </div>
                                      )}
                                      {encargado.email && (
                                        <div className="flex items-center space-x-2">
                                          <Mail className="w-3 h-3" />
                                          <span>{encargado.email}</span>
                                        </div>
                                      )}
                                      {encargado.telefono && (
                                        <div className="flex items-center space-x-2">
                                          <Phone className="w-3 h-3" />
                                          <span>{encargado.telefono}</span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Mostrar datos del contacto seleccionado */}
                      {selectedClient.encargados && selectedClient.encargados.length === 1 && (
                        <div className="mt-4 p-3 bg-white border border-blue-300 rounded-lg">
                          <div className="flex items-center space-x-2 mb-2">
                            <User className="w-4 h-4 text-blue-600" />
                            <span className="text-blue-600 font-medium">Contacto Principal:</span>
                          </div>
                          <div className="space-y-1 text-sm text-blue-800 ml-6">
                            <div className="font-medium">{selectedClient.contact}</div>
                            {selectedClient.email && (
                              <div className="flex items-center space-x-2">
                                <Mail className="w-3 h-3" />
                                <span>{selectedClient.email}</span>
                              </div>
                            )}
                            {selectedClient.phone && (
                              <div className="flex items-center space-x-2">
                                <Phone className="w-3 h-3" />
                                <span>{selectedClient.phone}</span>
                              </div>
                            )}
                          </div>
                        </div>
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
                          clientAddress: '',
                          clientPosition: ''
                        });
                      }}
                      className="text-blue-600 hover:text-blue-800 hover:bg-blue-100"
                      disabled={isSubmitting}
                    >
                      Cambiar
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Buscar Hospital Existente
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Buscar por hospital, ciudad, dependencia..."
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
                          filteredClients.map(client => {
                            // Mapear datos para mostrar correctamente - usar directamente hospitalName del backend
                            const hospitalName = client.hospitalName || client.hospital || client.name || 'Hospital no especificado';
                            const ciudad = client.city || 'Ciudad no especificada';
                            const estado = client.state || 'Estado no especificado';
                            const dependencia = client.dependencia || client.contact || 'Sin dependencia';
                            const empresaResponsable = client.name || 'No especificado';
                            
                            // Parsear encargados si existen en notes
                            let encargados = [];
                            if (client.notes) {
                              try {
                                const additionalData = JSON.parse(client.notes);
                                if (additionalData.encargados && Array.isArray(additionalData.encargados)) {
                                  encargados = additionalData.encargados.filter(enc => enc.nombre && enc.nombre.trim());
                                }
                              } catch (error) {
                                console.warn('Error parsing client notes:', error);
                              }
                            }
                            
                            // Si no hay encargados, crear uno del contacto principal
                            if (encargados.length === 0) {
                              encargados = [{
                                id: 1,
                                nombre: client.contact || 'Contacto Principal',
                                cargo: 'Responsable',
                                telefono: client.phone || '',
                                email: client.email || ''
                              }];
                            }
                            
                            // USAR EL SEGUNDO ENCARGADO para mostrar, si existe, si no el primero
                            const encargadoPrincipal = encargados.length >= 2 ? encargados[1] : encargados[0];
                            
                            return (
                              <div
                                key={client.id}
                                onClick={() => handleClientSelect(client)}
                                className="p-4 hover:bg-blue-50 cursor-pointer border-b last:border-b-0 transition-colores"
                              >
                                {/* Hospital como título principal */}
                                <div className="flex items-start space-x-3">
                                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Building className="w-5 h-5 text-blue-600" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="font-semibold text-gray-900 truncate">
                                       {hospitalName}
                                    </div>
                                    
                                    <div className="text-sm text-blue-600 font-medium truncate">
                                      {dependencia}
                                    </div>
                                    
                                    <div className="text-sm text-gray-600 truncate">
                                       {ciudad}, {estado}
                                    </div>
                                    
                                    {encargadoPrincipal && (
                                      <div className="text-sm text-gray-500 truncate mt-1">
                                         {encargadoPrincipal.nombre}
                                        {encargadoPrincipal.cargo && ` - ${encargadoPrincipal.cargo}`}
                                      </div>
                                    )}
                                    
                                    <div className="flex items-center justify-between mt-1">
                                      <div className="text-xs text-gray-400 truncate">
                                        Empresa: {empresaResponsable}
                                      </div>
                                      {encargados.length > 1 && (
                                        <div className="flex items-center space-x-1 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                                          <User className="w-3 h-3" />
                                          <span>{encargados.length} contactos</span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <div className="p-4 text-gray-500 text-center">
                            <Building className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                            <p>No se encontraron hospitales</p>
                            <p className="text-xs text-gray-400">Intenta buscar por nombre del hospital, ciudad o dependencia</p>
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
                  {selectedClient ? 'Información del hospital seleccionado:' : 'O ingresa información manualmente:'}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Nombre del Hospital"
                    name="clientName"
                    value={quoteInfo.clientName}
                    onChange={handleInputChange}
                    placeholder="Nombre del hospital"
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
                    placeholder="correo@hospital.com"
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
                  placeholder="Dirección completa del hospital"
                  disabled={isSubmitting}
                />

                <Input
                  label="Puesto del Contacto"
                  name="clientPosition"
                  value={quoteInfo.clientPosition}
                  onChange={handleInputChange}
                  placeholder="Ej: Director Médico, Jefe de Mantenimiento"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Productos Cotizados</h2>
                  <p className="text-sm text-gray-500">Resumen de los productos incluidos en la cotización</p>
                </div>
              </div>
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
            </div>
          </div>

          <div className="space-y-4">
            <CartSummary />
            
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
                className="w-full flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.63"/>
                </svg>
                <span>
                  {isSubmitting 
                    ? (isEditingMode ? 'Actualizando y Enviando...' : 'Enviando por WhatsApp...') 
                    : (isEditingMode ? 'Actualizar y Enviar' : 'Enviar por WhatsApp')
                  }
                </span>
              </Button>
              {/* Botón de Email */}
              {(selectedClient && (selectedClient.email || selectedClient.correo)) && (
                <EmailButton
                  onClick={async () => {
                    if (!validateForm()) {
                      setApiError('Completa todos los campos requeridos antes de enviar por email.');
                      return;
                    }
                    setApiError('');
                    setSuccessMessage('');
                    setIsSubmitting(true);
                    let modalShouldOpen = false;
                    let pdfAttachment = null;
                    try {
                      const selectedSellerCompany = sellerCompanies.find(company => company.id === quoteInfo.sellerCompany);
                      const quoteData = {
                        sellerCompany: selectedSellerCompany?.name || '',
                        sellerCompanyId: quoteInfo.sellerCompany,
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
                      if (selectedClient?.id) {
                        quoteData.clientId = selectedClient.id;
                      }
                      // Generar PDF para adjuntar al email
                      const pdfResult = await pdfService.generateQuotePDFForEmail(quoteData, selectedSellerCompany);
                      if (pdfResult.success && pdfResult.file) {
                        pdfAttachment = pdfResult.file; // base64 o blob
                      } else {
                        throw new Error('No se pudo generar el PDF para adjuntar al email.');
                      }
                      let response;
                      if (isEditingMode && editingQuoteData?.quoteId) {
                        response = await quoteService.updateQuote(editingQuoteData.quoteId, quoteData);
                      } else {
                        response = await quoteService.createQuote(quoteData);
                      }
                      if (response.success) {
                        setGeneratedQuote({ ...quoteData, id: response.data.id, folio: response.data.folio });
                        setSuccessMessage(`✅ Cotización ${response.data.folio} guardada exitosamente en la API. Ahora puedes enviarla por email.`);
                        console.log('✅ Cotización guardada en la API:', response.data);
                        modalShouldOpen = true;
                      } else {
                        throw new Error(response.message || 'Error al guardar cotización');
                      }
                    } catch (err) {
                      setApiError(err.message || 'Error al guardar/enviar cotización por email');
                      console.error('❌ Error al guardar cotización en la API:', err);
                      modalShouldOpen = false;
                    } finally {
                      setIsSubmitting(false);
                      if (modalShouldOpen) setShowEmailModal(true);
                    }
                  }}
                  quoteData={{
                    folio: generatedQuote?.folio,
                    id: generatedQuote?.id,
                    date: new Date().toLocaleDateString('es-MX', {
                      weekday: 'long',
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric'
                    }),
                    total: cartItems.reduce((total, item) => total + (Number(item.basePrice) * Number(item.quantity)), 0).toLocaleString('es-MX', { style: 'currency', currency: 'MXN' }),
                    products: cartItems
                  }}
                  clientData={{
                    name: selectedClient?.contact || selectedClient?.nombre || selectedClient?.name,
                    hospitalName: selectedClient?.name || selectedClient?.nombre,
                    contactName: selectedClient?.contact || selectedClient?.nombre || selectedClient?.name,
                    email: selectedClient?.email || selectedClient?.correo
                  }}
                  pdfAttachment={pdfAttachment}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  variant="primary"
                >
                  Enviar por Email
                </EmailButton>
              )}
              <EmailQuoteModal
                open={showEmailModal}
                onClose={() => setShowEmailModal(false)}
                quoteData={generatedQuote || {
                  ...prepareQuoteDataForPDF(),
                  folio: generatedQuote?.folio || generateFolio(),
                  products: cartItems // <--- usa products, no items
                }}
                clientData={{
                  name: selectedClient?.contact || selectedClient?.nombre || selectedClient?.name,
                  hospitalName: selectedClient?.name || selectedClient?.nombre,
                  contactName: selectedClient?.contact || selectedClient?.nombre || selectedClient?.name,
                  email: selectedClient?.email || selectedClient?.correo
                }}
                quoteId={generatedQuote?.id || editingQuoteData?.quoteId}
              />
              <Button 
                onClick={handleSaveQuote}
                variant="secondary"
                disabled={isSubmitting || cartItems.length === 0 || !quoteInfo.sellerCompany}
                className="w-full flex items-center justify-center space-x-2"
              >
                <Save size={20} />
                <span>
                  {isSubmitting 
                    ? (isEditingMode ? 'Actualizando...' : 'Guardando...') 
                    : (isEditingMode ? 'Actualizar Cotización' : 'Guardar Borrador')
                  }
                </span>
              </Button>
            </div>
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
    </div>
  );
};

export default QuoteBuilder;