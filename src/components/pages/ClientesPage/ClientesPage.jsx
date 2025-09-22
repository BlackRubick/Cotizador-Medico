import React, { useState, useEffect } from 'react';
import ClientManager from '../../organisms/ClientManager';
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
        // Mapear datos del backend al formato del frontend
        const mappedClients = response.data.map(client => 
          clientService.mapBackendToFrontend(client)
        );
        setClients(mappedClients);
      } else {
        throw new Error(response.message || 'Error al cargar clientes');
      }
    } catch (err) {
      console.error('Error loading clients:', err);
      setError(err.message || 'Error al cargar los clientes');
      
      // Si hay error de autenticación, redirigir al login
      if (err.message.includes('unauthorized') || err.message.includes('token')) {
        console.log('Token inválido, redirigir al login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (clientData, clientId = null) => {
    console.log('handleSave called with:', { clientData, clientId });
    
    try {
      setError(null);
      
      // Validaciones básicas en el frontend
      if (!clientData.empresaResponsable?.trim()) {
        throw new Error('La empresa responsable es requerida');
      }
      if (!clientData.dependencia?.trim()) {
        throw new Error('La dependencia es requerida');
      }
      if (!clientData.hospital?.trim()) {
        throw new Error('El hospital es requerido');
      }
      if (!clientData.estado?.trim()) {
        throw new Error('El estado es requerido');
      }
      if (!clientData.ciudad?.trim()) {
        throw new Error('La ciudad es requerida');
      }
      if (!clientData.codigoPostal?.trim()) {
        throw new Error('El código postal es requerido');
      }
      if (!clientData.direccion?.trim()) {
        throw new Error('La dirección es requerida');
      }
      if (!clientData.equipo?.trim()) {
        throw new Error('El equipo es requerido');
      }
      if (!clientData.marca?.trim()) {
        throw new Error('La marca es requerida');
      }
      if (!clientData.modelo?.trim()) {
        throw new Error('El modelo es requerido');
      }
      if (!clientData.numeroSerie?.trim()) {
        throw new Error('El número de serie es requerido');
      }
      
      // Validar formato de código postal (5 dígitos)
      const cpRegex = /^\d{5}$/;
      if (clientData.codigoPostal && !cpRegex.test(clientData.codigoPostal)) {
        throw new Error('El código postal debe tener 5 dígitos');
      }
      
      // Validar fechas si se proporcionan
      if (clientData.fechaInstalacion && clientData.fechaInstalacion.trim()) {
        const fechaInstalacion = new Date(clientData.fechaInstalacion);
        if (isNaN(fechaInstalacion.getTime())) {
          throw new Error('La fecha de instalación no es válida');
        }
      }
      
      if (clientData.ultimoMantenimiento && clientData.ultimoMantenimiento.trim()) {
        const fechaMantenimiento = new Date(clientData.ultimoMantenimiento);
        if (isNaN(fechaMantenimiento.getTime())) {
          throw new Error('La fecha del último mantenimiento no es válida');
        }
      }
      
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
      
      // Manejar errores específicos del servidor
      if (errorMessage.includes('already exists')) {
        errorMessage = 'Ya existe un cliente con este email';
      } else if (errorMessage.includes('validation')) {
        errorMessage = 'Error de validación: ' + errorMessage;
      } else if (errorMessage.includes('unauthorized')) {
        errorMessage = 'No tienes permisos para realizar esta acción';
      } else if (errorMessage.includes('cannot be null')) {
        errorMessage = 'Faltan campos requeridos en el servidor';
      }
      
      setError(errorMessage);
      
      // Re-lanzar el error para que el componente hijo pueda manejarlo
      throw new Error(errorMessage);
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

  // Mostrar error si hay algún problema
  if (error && clients.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Error al cargar clientes
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