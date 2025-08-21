// src/components/molecules/ClientTable/ClientTable.jsx - ACTUALIZADO con modal
import React, { useState } from 'react';
import { Edit, Trash2, Eye } from 'lucide-react';
import ClientEquipmentModal from '../ClientEquipmentModal';

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
              <th className="text-left py-3 px-4 font-medium text-gray-600">Empresa</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">Contacto</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">Email</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">Teléfono</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">Tipo</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr key={client.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4 font-medium">{client.nombre || client.name}</td>
                <td className="py-3 px-4">{client.contacto || client.contact}</td>
                <td className="py-3 px-4">{client.email}</td>
                <td className="py-3 px-4">{client.telefono || client.phone}</td>
                <td className="py-3 px-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {client.tipo || client.clientType}
                  </span>
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
      <ClientEquipmentModal
        client={selectedClient}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
};

export default ClientTable;