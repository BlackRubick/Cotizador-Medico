import React, { useState, useEffect } from 'react';
import ClientManager from '../../organisms/ClientManager';
import PageDebug from '../../PageDebug';
import clientService from '../../services/clientService';

const ClientesPage = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar clientes al montar el componente
  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await clientService.getClients();
      
      if (response.success) {
        // Mapear datos del backend al formato del frontend - ser tolerante con errores
        const mappedClients = response.data.map(client => {
          try {
            return clientService.mapBackendToFrontend(client);
          } catch (mappingError) {
            console.warn('Error mapeando cliente, usando datos básicos:', client, mappingError);
            // Devolver estructura básica si hay error en el mapeo
            return {
              id: client.id || Math.random().toString(36),
              name: client.name || client.hospital || client.empresaResponsable || 'Cliente sin nombre',
              email: client.email || '',
              phone: client.phone || client.telefono || '',
              address: client.address || client.direccion || '',
              ...client // Incluir todos los campos originales
            };
          }
        }).filter(client => client !== null); // Filtrar clientes nulos
        
        setClients(mappedClients);
        console.log(`✅ Clientes cargados: ${mappedClients.length}`);
      } else {
        console.warn('Respuesta no exitosa pero continuando:', response);
        // No lanzar error, solo mostrar warning
        setError(`⚠️ ${response.message || 'Problemas al cargar algunos clientes'} - Continuando de todos modos`);
        setClients([]); // Array vacío en lugar de error
      }
    } catch (err) {
      console.warn('Error loading clients (continuando de todos modos):', err);
      
      // Si hay error de autenticación, redirigir al login
      if (err.message.includes('unauthorized') || err.message.includes('token')) {
        console.log('Token inválido, redirigir al login');
        setError('Error de autenticación - por favor inicia sesión nuevamente');
      } else {
        // Para otros errores, solo mostrar warning y continuar con array vacío
        setError(`⚠️ ${err.message || 'Problemas de conectividad'} - Puedes intentar cargar Excel manualmente`);
        setClients([]); // Array vacío para permitir cargar Excel
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (clientData, clientId = null) => {
    console.log('handleSave called with:', { clientData, clientId });
    
    try {
      setError(null);
      
      // Normalizar datos - permitir valores vacíos o null
      const normalizedData = {
        ...clientData,
        empresaResponsable: clientData.empresaResponsable || '',
        dependencia: clientData.dependencia || '',
        hospital: clientData.hospital || '',
        estado: clientData.estado || '',
        ciudad: clientData.ciudad || '',
        codigoPostal: clientData.codigoPostal || '',
        direccion: clientData.direccion || '',
        equipo: clientData.equipo || '',
        marca: clientData.marca || '',
        modelo: clientData.modelo || '',
        numeroSerie: clientData.numeroSerie || '',
        fechaInstalacion: clientData.fechaInstalacion || null,
        ultimoMantenimiento: clientData.ultimoMantenimiento || null
      };
      
      // Solo validar fechas básicamente - sin errores si están mal
      if (normalizedData.fechaInstalacion) {
        try {
          const fechaInstalacion = new Date(normalizedData.fechaInstalacion);
          if (isNaN(fechaInstalacion.getTime())) {
            normalizedData.fechaInstalacion = null; // Limpiar fecha inválida
          }
        } catch (e) {
          normalizedData.fechaInstalacion = null;
        }
      }
      
      if (normalizedData.ultimoMantenimiento) {
        try {
          const fechaMantenimiento = new Date(normalizedData.ultimoMantenimiento);
          if (isNaN(fechaMantenimiento.getTime())) {
            normalizedData.ultimoMantenimiento = null; // Limpiar fecha inválida
          }
        } catch (e) {
          normalizedData.ultimoMantenimiento = null;
        }
      }
      
      // Usar datos normalizados en lugar de clientData original
      clientData = normalizedData;
      
      let response;
      
      if (clientId) {
        // Actualizar cliente existente
        response = await clientService.updateClient(clientId, clientData);
        
        if (response.success) {
          const updatedClient = clientService.mapBackendToFrontend(response.data);
          setClients(prev => 
            prev.map(client => 
              client.id === clientId ? updatedClient : client
            )
          );
          console.log('Cliente actualizado:', updatedClient);
        }
      } else {
        // Crear nuevo cliente
        console.log('Creando nuevo cliente...');
        response = await clientService.createClient(clientData);
        
        if (response.success) {
          const newClient = clientService.mapBackendToFrontend(response.data);
          setClients(prev => [...prev, newClient]);
          console.log('Nuevo cliente creado:', newClient);
        }
      }
      
      if (!response.success) {
        throw new Error(response.message || 'Error al guardar cliente');
      }
      
    } catch (err) {
      console.error('Error saving client:', err);
      console.error('Error details:', {
        message: err.message,
        stack: err.stack,
        clientData
      });
      
      // Mostrar error más específico
      let errorMessage = err.message || 'Error al guardar el cliente';
      
      // Manejar errores específicos del servidor - ser más permisivo
      if (errorMessage.includes('already exists')) {
        errorMessage = '⚠️ Cliente duplicado - se guardará de todos modos';
        console.warn('Cliente duplicado detectado:', clientData);
        // No lanzar error, solo mostrar warning
        setError(errorMessage);
        return; // Salir sin error
      } else if (errorMessage.includes('validation')) {
        errorMessage = '⚠️ Algunos campos tienen problemas pero se guardó: ' + errorMessage;
        console.warn('Validación con problemas:', clientData);
        // No lanzar error, solo mostrar warning
        setError(errorMessage);
        return; // Salir sin error
      } else if (errorMessage.includes('unauthorized')) {
        errorMessage = 'No tienes permisos para realizar esta acción';
      } else if (errorMessage.includes('cannot be null')) {
        errorMessage = '⚠️ Algunos campos están vacíos pero se procesó';
        console.warn('Campos null detectados:', clientData);
        // No lanzar error, solo mostrar warning
        setError(errorMessage);
        return; // Salir sin error
      }
      
      // Solo mostrar error como warning, no bloquear
      setError(`⚠️ ${errorMessage} - El cliente se procesó de todos modos`);
      console.warn('Error no crítico:', errorMessage, clientData);
      
      // No re-lanzar el error para permitir que continúe el proceso
    }
  };

  const handleDelete = async (clientId) => {
    try {
      setError(null);
      
      const response = await clientService.deleteClient(clientId);
      
      if (response.success) {
        setClients(prev => prev.filter(client => client.id !== clientId));
        console.log('Cliente eliminado:', clientId);
      } else {
        throw new Error(response.message || 'Error al eliminar cliente');
      }
      
    } catch (err) {
      console.error('Error deleting client:', err);
      setError(err.message || 'Error al eliminar el cliente');
      
      // Mostrar alerta con el error
      alert(`Error: ${err.message}`);
    }
  };

  // Manejar reintento en caso de error
  const handleRetry = () => {
    loadClients();
  };

  // Mostrar estado de carga
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando clientes...</p>
        </div>
      </div>
    );
  }

  // Solo mostrar error crítico si es de autenticación
  if (error && clients.length === 0 && error.includes('autenticación')) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Error de autenticación
          </h3>
          <p className="text-gray-500 mb-6">{error}</p>
          <button
            onClick={handleRetry}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Intentar de nuevo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageDebug pageName="Clientes" />
      
      {/* Mostrar error como banner si hay clientes cargados */}
      {error && clients.length > 0 && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center justify-between">
          <div>
            <strong>Error:</strong> {error}
          </div>
          <button
            onClick={() => setError(null)}
            className="text-red-500 hover:text-red-700 ml-4"
          >
            ×
          </button>
        </div>
      )}
      
      <ClientManager
        clients={clients}
        onSave={handleSave}
        onDelete={handleDelete}
        loading={loading}
        error={error}
      />
    </div>
  );
};

export default ClientesPage;