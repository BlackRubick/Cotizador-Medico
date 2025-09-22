import React, { useState } from 'react';
import { Filter, Check, X, RotateCcw } from 'lucide-react';
import Card from '../../atoms/Card';
import Button from '../../atoms/Button';
import Input from '../../atoms/Input';

const FilterPanel = ({ onFilter, onClose }) => {
  const [filters, setFilters] = useState({
    estado: '',
    mes: '',
    año: '',
    marca: ''
  });

  const handleChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const handleApplyFilters = () => {
    onFilter(filters);
    onClose();
  };

  const handleClear = () => {
    setFilters({
      estado: '',
      mes: '',
      año: '',
      marca: ''
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-white bg-opacity-20 rounded-lg p-2">
              <Filter size={20} />
            </div>
            <h3 className="text-xl font-bold">Filtrar Cotizaciones</h3>
          </div>
          <button
            onClick={onClose}
            className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg p-2 transition-all duration-200"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Estado de la Cotización</label>
            <select
              name="estado"
              value={filters.estado}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 hover:bg-white transition-all duration-200"
            >
              <option value="">Todos los estados</option>
              <option value="pendiente">Pendiente</option>
              <option value="confirmado">Confirmado</option>
              <option value="cancelado">Cancelado</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Mes</label>
            <select
              name="mes"
              value={filters.mes}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 hover:bg-white transition-all duration-200"
            >
              <option value="">Todos los meses</option>
              <option value="01">Enero</option>
              <option value="02">Febrero</option>
              <option value="03">Marzo</option>
              <option value="04">Abril</option>
              <option value="05">Mayo</option>
              <option value="06">Junio</option>
              <option value="07">Julio</option>
              <option value="08">Agosto</option>
              <option value="09">Septiembre</option>
              <option value="10">Octubre</option>
              <option value="11">Noviembre</option>
              <option value="12">Diciembre</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Año</label>
            <Input
              name="año"
              value={filters.año}
              onChange={handleChange}
              placeholder="Ej: 2024"
              className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 hover:bg-white transition-all duration-200"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Marca</label>
            <Input
              name="marca"
              value={filters.marca}
              onChange={handleChange}
              placeholder="Filtrar por marca del producto"
              className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 hover:bg-white transition-all duration-200"
            />
          </div>
        </div>

        {/* Footer con botones */}
        <div className="border-t border-gray-100 p-6 bg-gray-50 flex space-x-4">
          <Button
            onClick={handleClear}
            variant="secondary"
            className="flex-1 flex items-center justify-center space-x-2 bg-white border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl py-3"
          >
            <RotateCcw size={18} />
            <span>Limpiar</span>
          </Button>
          <Button
            onClick={handleApplyFilters}
            className="flex-1 flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl py-3 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Check size={18} />
            <span>Aplicar Filtros</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
