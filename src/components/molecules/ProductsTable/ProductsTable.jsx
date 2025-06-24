import React from 'react';
import ProductRow from '../../atoms/ProductRow';

const ProductsTable = ({ products, editable = false, onProductsChange }) => {
  const handleQuantityChange = (index, newQuantity) => {
    if (editable && onProductsChange) {
      const updatedProducts = [...products];
      updatedProducts[index] = {
        ...updatedProducts[index],
        cantidad: newQuantity
      };
      onProductsChange(updatedProducts);
    }
  };

  const handlePriceChange = (index, newPrice) => {
    if (editable && onProductsChange) {
      const updatedProducts = [...products];
      updatedProducts[index] = {
        ...updatedProducts[index],
        precioUnitario: newPrice
      };
      onProductsChange(updatedProducts);
    }
  };

  const subtotal = products.reduce((sum, product) => sum + (product.cantidad * product.precioUnitario), 0);
  const iva = subtotal * 0.16;
  const total = subtotal + iva;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="font-semibold text-gray-800 mb-4">PRODUCTOS</h3>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-gray-200">
              <th className="py-3 px-4 text-left">No. de catálogo</th>
              <th className="py-3 px-4 text-left">Código</th>
              <th className="py-3 px-4 text-left">Equipo</th>
              <th className="py-3 px-4 text-left">Marca</th>
              <th className="py-3 px-4 text-left">Descripción</th>
              <th className="py-3 px-4 text-center">Cantidad</th>
              <th className="py-3 px-4 text-right">Precio Unitario</th>
              <th className="py-3 px-4 text-right">Precio Total</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <ProductRow
                key={index}
                product={product}
                index={index}
                editable={editable}
                onQuantityChange={handleQuantityChange}
                onPriceChange={handlePriceChange}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Totales */}
      <div className="mt-6 border-t pt-4">
        <div className="flex justify-end">
          <div className="w-64 space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">SUBTOTAL:</span>
              <span className="font-medium">${subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">IVA:</span>
              <span className="font-medium">${iva.toLocaleString()}</span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t pt-2">
              <span>TOTAL:</span>
              <span>${total.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsTable;
