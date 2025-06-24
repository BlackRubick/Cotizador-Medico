import React from 'react';

const ProductRow = ({ product, index, onQuantityChange, onPriceChange, editable = false }) => {
  return (
    <tr className="border-b border-gray-200">
      <td className="py-3 px-4 text-center">{index + 1}</td>
      <td className="py-3 px-4">{product.codigo}</td>
      <td className="py-3 px-4">{product.equipo}</td>
      <td className="py-3 px-4">{product.marca}</td>
      <td className="py-3 px-4">{product.descripcion}</td>
      <td className="py-3 px-4 text-center">
        {editable ? (
          <input
            type="number"
            value={product.cantidad}
            onChange={(e) => onQuantityChange(index, parseInt(e.target.value) || 1)}
            className="w-16 px-2 py-1 border rounded text-center"
            min="1"
          />
        ) : (
          product.cantidad
        )}
      </td>
      <td className="py-3 px-4 text-right">
        {editable ? (
          <input
            type="number"
            value={product.precioUnitario}
            onChange={(e) => onPriceChange(index, parseFloat(e.target.value) || 0)}
            className="w-24 px-2 py-1 border rounded text-right"
            min="0"
            step="0.01"
          />
        ) : (
          `$${product.precioUnitario?.toLocaleString()}`
        )}
      </td>
      <td className="py-3 px-4 text-right font-medium">
        ${(product.cantidad * product.precioUnitario)?.toLocaleString()}
      </td>
    </tr>
  );
};

export default ProductRow;
