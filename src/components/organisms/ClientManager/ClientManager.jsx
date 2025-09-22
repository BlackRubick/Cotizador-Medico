import React, { useState } from 'react';
import { Plus, Filter, Download, Grid, List, Upload } from 'lucide-react';
import Button from '../../atoms/Button';
import SearchBar from '../../atoms/SearchBar';
import ClientCard from '../../atoms/ClientCard';
import ClientTable from '../../molecules/ClientTable';
import ClientStats from '../../molecules/ClientStats';
import ClientForm from '../../molecules/ClientForm';
import ClientEquipmentModal from '../../molecules/ClientEquipmentModal/ClientEquipmentModal';

const ClientManager = ({ clients, onSave, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'
  const [selectedType, setSelectedType] = useState('');
  const [importLoading, setImportLoading] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedClientForDetail, setSelectedClientForDetail] = useState(null);

  const filteredClients = clients.filter(client => {
    const matchesSearch = 
      client.empresaResponsable?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.hospital?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.dependencia?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.estado?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.ciudad?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.equipo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.marca?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.modelo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.numeroSerie?.toLowerCase().includes(searchTerm.toLowerCase());
    
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
    if (window.confirm(`¿Estás seguro de eliminar el registro de ${client.empresaResponsable}?`)) {
      onDelete(client.id);
    }
  };

  const handleView = (client) => {
    console.log('Ver detalles de:', client);
    // Aquí podrías abrir un modal o navegar a una página de detalles
  };

  const handleViewEquipmentDetails = (client) => {
    setSelectedClientForDetail(client);
    setShowDetailModal(true);
  };

  const handleCloseDetailModal = () => {
    setShowDetailModal(false);
    setSelectedClientForDetail(null);
  };

  const handleExport = () => {
    console.log('Exportando clientes...');
    alert('Funcionalidad de exportación no implementada');
  };

  const handleImportExcel = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validar que sea un archivo Excel
    const allowedExtensions = ['.xlsx', '.xls'];
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    
    if (!allowedExtensions.includes(fileExtension)) {
      alert('Por favor, selecciona un archivo Excel válido (.xlsx o .xls)');
      event.target.value = '';
      return;
    }

    setImportLoading(true);

    try {
      // Importar la librería xlsx dinámicamente
      const XLSX = await import('xlsx');
      
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          
          // Tomar la primera hoja
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          
          // Convertir a JSON
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          
          if (jsonData.length < 2) {
            throw new Error('El archivo debe contener al menos una fila de encabezados y una fila de datos');
          }

          // Mapear los datos del Excel a nuestro formato
          const headers = jsonData[0];
          const rows = jsonData.slice(1);
          
          const clientsToImport = [];
          
          for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            
            // Verificar que la fila no esté vacía
            if (!row || row.every(cell => !cell || cell.toString().trim() === '')) {
              continue;
            }

            const clientData = {
              empresaResponsable: row[0]?.toString()?.trim() || '',
              dependencia: row[1]?.toString()?.trim() || '',
              hospital: row[2]?.toString()?.trim() || '',
              estado: row[3]?.toString()?.trim() || '',
              ciudad: row[4]?.toString()?.trim() || '',
              codigoPostal: row[5]?.toString()?.trim() || '',
              direccion: row[6]?.toString()?.trim() || '',
              contrato: row[7]?.toString()?.trim() || '',
              equipo: row[8]?.toString()?.trim() || '',
              marca: row[9]?.toString()?.trim() || '',
              modelo: row[10]?.toString()?.trim() || '',
              numeroSerie: row[11]?.toString()?.trim() || '',
              fechaInstalacion: row[12] ? formatExcelDate(row[12]) : '',
              ultimoMantenimiento: row[13] ? formatExcelDate(row[13]) : '',
              estatusAbril2025: row[14]?.toString()?.trim() || '',
              estatusInicio26: row[15]?.toString()?.trim() || ''
            };

            // Validar campos requeridos
            const requiredFields = [
              'empresaResponsable', 'dependencia', 'hospital', 'estado', 
              'ciudad', 'codigoPostal', 'direccion', 'equipo', 'marca', 
              'modelo', 'numeroSerie'
            ];

            const missingFields = requiredFields.filter(field => !clientData[field]);
            
            if (missingFields.length > 0) {
              console.warn(`Fila ${i + 2}: Faltan campos requeridos: ${missingFields.join(', ')}`);
              continue;
            }

            clientsToImport.push(clientData);
          }

          if (clientsToImport.length === 0) {
            throw new Error('No se encontraron filas válidas para importar');
          }

          // Confirmar importación
          const confirmImport = window.confirm(
            `Se importarán ${clientsToImport.length} clientes. ¿Deseas continuar?`
          );

          if (!confirmImport) {
            setImportLoading(false);
            return;
          }

          // Importar clientes uno por uno con delay para evitar rate limiting
          let successCount = 0;
          let errorCount = 0;
          const errors = [];

          for (let i = 0; i < clientsToImport.length; i++) {
            try {
              console.log(`Importando cliente ${i + 1}/${clientsToImport.length}...`);
              await onSave(clientsToImport[i]);
              successCount++;
              
              // Agregar un pequeño delay entre peticiones para evitar rate limiting
              if (i < clientsToImport.length - 1) {
                await new Promise(resolve => setTimeout(resolve, 500)); // 500ms de delay
              }
            } catch (error) {
              console.error(`Error importando cliente ${i + 1}:`, error);
              errorCount++;
              errors.push(`Cliente ${i + 1} (${clientsToImport[i].empresaResponsable}): ${error.message}`);
              
              // Si es error de rate limiting, esperar más tiempo
              if (error.message.includes('429') || error.message.includes('Too Many Requests')) {
                console.log('Rate limit detectado, esperando 2 segundos...');
                await new Promise(resolve => setTimeout(resolve, 2000));
              }
            }
          }

          // Mostrar resultado
          let message = `Importación completada:\n`;
          message += `✅ ${successCount} clientes importados exitosamente\n`;
          if (errorCount > 0) {
            message += `❌ ${errorCount} clientes con errores\n\n`;
            message += `Errores:\n${errors.slice(0, 5).join('\n')}`;
            if (errors.length > 5) {
              message += `\n... y ${errors.length - 5} errores más`;
            }
          }

          alert(message);

        } catch (error) {
          console.error('Error procesando Excel:', error);
          alert(`Error al procesar el archivo: ${error.message}`);
        } finally {
          setImportLoading(false);
          event.target.value = '';
        }
      };

      reader.readAsArrayBuffer(file);

    } catch (error) {
      console.error('Error importando Excel:', error);
      alert(`Error al importar: ${error.message}`);
      setImportLoading(false);
      event.target.value = '';
    }
  };

  // Función auxiliar para formatear fechas de Excel
  const formatExcelDate = (excelDate) => {
    if (!excelDate) return '';
    
    try {
      // Si ya es una fecha string válida, devolverla
      if (typeof excelDate === 'string' && excelDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
        return excelDate;
      }
      
      // Si es un número de Excel, convertirlo
      if (typeof excelDate === 'number') {
        const date = new Date((excelDate - 25569) * 86400 * 1000);
        return date.toISOString().split('T')[0];
      }
      
      // Intentar parsearlo como fecha
      const parsedDate = new Date(excelDate);
      if (!isNaN(parsedDate.getTime())) {
        return parsedDate.toISOString().split('T')[0];
      }
      
      return '';
    } catch (error) {
      console.warn('Error formateando fecha:', excelDate, error);
      return '';
    }
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
          
          {/* Input oculto para importar Excel */}
          <input
            type="file"
            id="excel-import"
            accept=".xlsx,.xls"
            onChange={handleImportExcel}
            style={{ display: 'none' }}
            disabled={importLoading}
          />
          
          <Button
            variant="secondary"
            onClick={() => document.getElementById('excel-import').click()}
            disabled={importLoading}
            className="flex items-center space-x-2"
          >
            {importLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span>Importando...</span>
              </>
            ) : (
              <>
                <Upload size={20} />
                <span>Importar Excel</span>
              </>
            )}
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
            placeholder="Buscar por empresa, hospital, equipo, marca, modelo o número de serie..."
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
                  onClick={() => handleViewEquipmentDetails(client)}
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

      {/* Modal de detalles del equipo biomédico */}
      {showDetailModal && selectedClientForDetail && (
        <ClientEquipmentModal
          client={selectedClientForDetail}
          isOpen={showDetailModal}
          onClose={handleCloseDetailModal}
        />
      )}
    </div>
  );
};

export default ClientManager;
