import React, { useState } from 'react';
import { Plus, Filter, Download, Grid, List } from 'lucide-react';
import Button from '../../atoms/Button';
import SearchBar from '../../atoms/SearchBar';
import ClientCard from '../../atoms/ClientCard';
import ClientTable from '../../molecules/ClientTable';
import ClientStats from '../../molecules/ClientStats';
import ClientForm from '../../molecules/ClientForm';

const ClientManager = ({ clients, onSave, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'
  const [selectedType, setSelectedType] = useState('');

  const filteredClients = clients.filter(client => {
    const matchesSearch = 
      client.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.contacto?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = !selectedType || client.tipo === selectedType;
    
    return matchesSearch && matchesType;
  });

  const clientTypes = [...new Set(clients.map(c => c.tipo))];

  const handleSave = (clientData) => {
    onSave(clientData, editingClient?.id);
    setShowForm(false);
    setEditingClient(null);
  };

  const handleEdit = (client) => {
    setEditingClient(client);
    setShowForm(true);
  };

  const handleDelete = (client) => {
    if (window.confirm(`¿Estás seguro de eliminar a ${client.nombre}?`)) {
      onDelete(client.id);
    }
  };

  const handleView = (client) => {
    console.log('Ver detalles de:', client);
    // Aquí podrías abrir un modal o navegar a una página de detalles
  };

  const handleExport = () => {
    console.log('Exportando clientes...');
    alert('Funcionalidad de exportación no implementada');
  };

  if (showForm) {
    return (
      <ClientForm
        client={editingClient}
        onSave={handleSave}
        onCancel={() => {
          setShowForm(false);
          setEditingClient(null);
        }}
        isEditing={!!editingClient}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <h1 className="text-2xl font-bold text-gray-800">Gestión de Clientes</h1>
        <div className="flex space-x-2">
          <Button
            variant="secondary"
            onClick={handleExport}
            className="flex items-center space-x-2"
          >
            <Download size={20} />
            <span>Exportar</span>
          </Button>
          <Button
            onClick={() => setShowForm(true)}
            className="flex items-center space-x-2"
          >
            <Plus size={20} />
            <span>Nuevo Cliente</span>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <ClientStats clients={clients} />

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="flex-1">
          <SearchBar
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar clientes por nombre, contacto o email..."
          />
        </div>
        
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Todos los tipos</option>
          {clientTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>

        <div className="flex space-x-2">
          <Button
            variant={viewMode === 'grid' ? 'primary' : 'secondary'}
            onClick={() => setViewMode('grid')}
            className="p-3"
          >
            <Grid size={20} />
          </Button>
          <Button
            variant={viewMode === 'table' ? 'primary' : 'secondary'}
            onClick={() => setViewMode('table')}
            className="p-3"
          >
            <List size={20} />
          </Button>
        </div>
      </div>

      {/* Results count */}
      <div className="text-sm text-gray-600">
        Mostrando {filteredClients.length} de {clients.length} clientes
      </div>

      {/* Content */}
      {filteredClients.length === 0 ? (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <Plus className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              {searchTerm || selectedType ? 'No se encontraron clientes' : 'No hay clientes registrados'}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || selectedType 
                ? 'Intenta con otros términos de búsqueda'
                : 'Comienza agregando tu primer cliente'
              }
            </p>
            {!searchTerm && !selectedType && (
              <Button onClick={() => setShowForm(true)}>
                Agregar Primer Cliente
              </Button>
            )}
          </div>
        </div>
      ) : (
        <>
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredClients.map(client => (
                <ClientCard
                  key={client.id}
                  client={client}
                  onClick={() => handleView(client)}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow">
              <ClientTable
                clients={filteredClients}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onView={handleView}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ClientManager;
