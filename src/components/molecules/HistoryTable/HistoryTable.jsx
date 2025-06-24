import React from 'react';
import { Edit, Mail } from 'lucide-react';
import StatusBadge from '../../atoms/StatusBadge';

const HistoryTable = ({ quotes, onEdit, onSendEmail }) => {
  if (!quotes || quotes.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No hay cotizaciones disponibles
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 font-medium text-gray-600">Razón social</th>
            <th className="text-left py-3 px-4 font-medium text-gray-600">Fecha</th>
            <th className="text-left py-3 px-4 font-medium text-gray-600">Precio</th>
            <th className="text-left py-3 px-4 font-medium text-gray-600">Estado</th>
            <th className="text-left py-3 px-4 font-medium text-gray-600">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {quotes.map((quote) => (
            <tr key={quote.id} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="py-3 px-4">{quote.razonSocial}</td>
              <td className="py-3 px-4">{quote.fecha}</td>
              <td className="py-3 px-4 font-semibold">${quote.precio}</td>
              <td className="py-3 px-4">
                <StatusBadge status={quote.estado} />
              </td>
              <td className="py-3 px-4">
                <div className="flex space-x-2">
                  <button
                    onClick={() => onEdit(quote)}
                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => onSendEmail(quote)}
                    className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                  >
                    <Mail size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HistoryTable;
