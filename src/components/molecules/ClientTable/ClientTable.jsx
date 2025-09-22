// src/components/molecules/ClientTable/ClientTable.jsx - ACTUALIZADO con modal
import React, { useState } from 'react';
import { Edit, Trash2, Eye } from 'lucide-react';
import ClientEquipmentModal from '../ClientEquipmentModal/ClientEquipmentModal';

const ClientTable = ({ clients, onEdit, onDelete, onView }) => {
  const [selectedClient, setSelectedClient] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewEquipments = (client) => {
    setSelectedClient(client);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedClient(null);
  };

  if (!clients || clients.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No hay clientes registrados
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-medium text-gray-600">Empresa Responsable</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">Hospital</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">Equipo</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">Marca</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">Modelo</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">N. Serie</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">Estado</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr key={client.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4 font-medium">
                  <div className="font-medium text-gray-900">{client.empresaResponsable}</div>
                  <div className="text-sm text-gray-500">{client.dependencia}</div>
                </td>
                <td className="py-3 px-4">
                  <div className="text-sm font-medium">{client.hospital}</div>
                  <div className="text-xs text-gray-500">{client.ciudad}, {client.estado}</div>
                </td>
                <td className="py-3 px-4">
                  <span className="font-medium">{client.equipo}</span>
                </td>
                <td className="py-3 px-4">
                  <span className="text-sm">{client.marca}</span>
                </td>
                <td className="py-3 px-4">
                  <span className="text-sm font-mono">{client.modelo}</span>
                </td>
                <td className="py-3 px-4">
                  <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">{client.numeroSerie}</span>
                </td>
                <td className="py-3 px-4">
                  <div className="space-y-1">
                    {client.estatusAbril2025 && (
                      <div className="text-xs">
                        <span className="text-gray-500">Abr 25:</span> 
                        <span className={`ml-1 px-1.5 py-0.5 rounded-full text-xs ${
                          client.estatusAbril2025?.toLowerCase() === 'activo' ? 'bg-green-100 text-green-800' :
                          client.estatusAbril2025?.toLowerCase() === 'pendiente' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {client.estatusAbril2025}
                        </span>
                      </div>
                    )}
                    {client.estatusInicio26 && (
                      <div className="text-xs">
                        <span className="text-gray-500">Ini 26:</span>
                        <span className={`ml-1 px-1.5 py-0.5 rounded-full text-xs ${
                          client.estatusInicio26?.toLowerCase() === 'terminado' ? 'bg-green-100 text-green-800' :
                          client.estatusInicio26?.toLowerCase() === 'pendiente' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {client.estatusInicio26}
                        </span>
                      </div>
                    )}
                  </div>
                </td>
                                <td className="py-3 px-4">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleViewEquipments(client)}
                      className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                      title="Ver equipos biomédicos"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => onEdit(client)}
                      className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                      title="Editar"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => onDelete(client)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de equipos */}
      {isModalOpen && selectedClient && (
        <ClientEquipmentModal
          client={selectedClient}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
};

export default ClientTable;