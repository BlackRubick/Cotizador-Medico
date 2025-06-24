import React, { useState } from 'react';
import { Filter, Check } from 'lucide-react';
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
    <Card className="space-y-6 bg-blue-600 text-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Filter size={20} />
          <h3 className="font-semibold">FILTRADO</h3>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Estado</label>
          <select
            name="estado"
            value={filters.estado}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-white text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            <option value="">Todos</option>
            <option value="pendiente">Pendiente</option>
            <option value="confirmado">Confirmado</option>
            <option value="cancelado">Cancelado</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Mes:</label>
          <select
            name="mes"
            value={filters.mes}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-white text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            <option value="">Todos</option>
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
          <label className="block text-sm font-medium mb-2">AÑO:</label>
          <Input
            name="año"
            value={filters.año}
            onChange={handleChange}
            placeholder="2024"
            className="bg-white text-gray-900"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">MARCA:</label>
          <Input
            name="marca"
            value={filters.marca}
            onChange={handleChange}
            placeholder="Marca del producto"
            className="bg-white text-gray-900"
          />
        </div>
      </div>

      <div className="flex items-center justify-center pt-4">
        <button
          onClick={handleApplyFilters}
          className="w-16 h-16 bg-white text-blue-600 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors"
        >
          <Check size={24} />
        </button>
      </div>

      <div className="flex space-x-2">
        <Button
          onClick={handleClear}
          variant="ghost"
          className="flex-1 bg-white bg-opacity-20 text-white hover:bg-opacity-30"
        >
          Limpiar
        </Button>
        <Button
          onClick={onClose}
          variant="ghost"
          className="flex-1 bg-white bg-opacity-20 text-white hover:bg-opacity-30"
        >
          Cerrar
        </Button>
      </div>
    </Card>
  );
};

export default FilterPanel;
