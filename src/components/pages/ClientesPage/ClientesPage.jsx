import React, { useState } from 'react';
import ClientManager from '../../organisms/ClientManager';

const ClientesPage = () => {
  const [clients, setClients] = useState([
    {
      id: 1,
      nombre: 'Hospital General de Tuxtla',
      contacto: 'Dr. Eduardo Ramírez',
      telefono: '+52 961 234 5678',
      email: 'contacto@hospitalgeneral.com',
      direccion: 'Av. Central 123, Tuxtla Gutiérrez, Chiapas',
      rfc: 'HGT850101ABC',
      tipo: 'Hospital',
      estado: 'activo'
    },
    {
      id: 2,
      nombre: 'Clínica Especializada del Sur',
      contacto: 'Lic. Patricia Morales',
      telefono: '+52 961 345 6789',
      email: 'info@clinicasur.com',
      direccion: 'Calle 5 de Mayo 456, Tuxtla Gutiérrez, Chiapas',
      rfc: 'CES900215XYZ',
      tipo: 'Clínica',
      estado: 'activo'
    },
    {
      id: 3,
      nombre: 'Laboratorio Médico Central',
      contacto: 'Q.F.B. Carlos Ruiz',
      telefono: '+52 961 456 7890',
      email: 'laboratorio@medcentral.com',
      direccion: 'Blvd. Belisario Domínguez 789, Tuxtla Gutiérrez',
      rfc: 'LMC751020DEF',
      tipo: 'Laboratorio',
      estado: 'activo'
    }
  ]);

  const handleSave = (clientData, clientId = null) => {
    if (clientId) {
      // Editar cliente existente
      setClients(prev => 
        prev.map(client => 
          client.id === clientId 
            ? { ...client, ...clientData }
            : client
        )
      );
      console.log('Cliente actualizado:', clientData);
    } else {
      // Crear nuevo cliente
      const newClient = {
        ...clientData,
        id: Math.max(...clients.map(c => c.id), 0) + 1,
        estado: 'activo'
      };
      setClients(prev => [...prev, newClient]);
      console.log('Nuevo cliente creado:', newClient);
    }
  };

  const handleDelete = (clientId) => {
    setClients(prev => prev.filter(client => client.id !== clientId));
    console.log('Cliente eliminado:', clientId);
  };

  return (
    <ClientManager
      clients={clients}
      onSave={handleSave}
      onDelete={handleDelete}
    />
  );
};

export default ClientesPage;
