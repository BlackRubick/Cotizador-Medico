import React, { useState } from 'react';
import { ArrowLeft, Send, Save, User } from 'lucide-react';
import CartSummary from '../../molecules/CartSummary';
import Button from '../../atoms/Button';
import Input from '../../atoms/Input';
import Card from '../../atoms/Card';
import { useCart } from '../../../context/CartContext';

const QuoteBuilder = ({ onBack }) => {
  const { cartItems, quoteInfo, setQuoteInfo, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    setQuoteInfo({
      ...quoteInfo,
      [e.target.name]: e.target.value
    });
  };

  const handleSaveQuote = () => {
    console.log('Guardando cotización:', { quoteInfo, cartItems });
    alert('Cotización guardada como borrador');
  };

  const handleSendQuote = async () => {
    if (!quoteInfo.clientName || !quoteInfo.email) {
      alert('Por favor completa la información del cliente');
      return;
    }

    setIsSubmitting(true);
    try {
      // Simular envío
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Enviando cotización:', { quoteInfo, cartItems });
      alert('Cotización enviada exitosamente');
      
      // Limpiar carrito y volver
      clearCart();
      onBack();
    } catch (error) {
      alert('Error al enviar la cotización');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="flex items-center space-x-2"
        >
          <ArrowLeft size={20} />
          <span>Volver al Carrito</span>
        </Button>
        <h1 className="text-2xl font-bold text-gray-800">Generar Cotización</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Client Information */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <div className="flex items-center space-x-3 mb-6">
              <User className="w-6 h-6 text-blue-600" />
              <h2 className="text-lg font-semibold">Información del Cliente</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Nombre del Cliente"
                name="clientName"
                value={quoteInfo.clientName}
                onChange={handleInputChange}
                placeholder="Nombre completo"
                required
              />
              <Input
                label="Empresa"
                name="company"
                value={quoteInfo.company}
                onChange={handleInputChange}
                placeholder="Nombre de la empresa"
              />
              <Input
                label="Email"
                name="email"
                type="email"
                value={quoteInfo.email}
                onChange={handleInputChange}
                placeholder="correo@empresa.com"
                required
              />
              <Input
                label="Teléfono"
                name="phone"
                value={quoteInfo.phone}
                onChange={handleInputChange}
                placeholder="+52 961 123 4567"
              />
            </div>
          </Card>

          {/* Quote Items */}
          <Card>
            <h2 className="text-lg font-semibold mb-4">Productos Cotizados</h2>
            <div className="space-y-3">
              {cartItems.map(item => (
                <div key={item.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">{item.code}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">Cant: {item.quantity}</p>
                    <p className="text-blue-600 font-bold">${item.totalPrice.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Summary and Actions */}
        <div className="space-y-4">
          <CartSummary />
          
          <div className="space-y-3">
            <Button 
              onClick={handleSendQuote}
              disabled={isSubmitting}
              className="w-full flex items-center justify-center space-x-2"
            >
              <Send size={20} />
              <span>{isSubmitting ? 'Enviando...' : 'Enviar Cotización'}</span>
            </Button>
            
            <Button 
              onClick={handleSaveQuote}
              variant="secondary"
              className="w-full flex items-center justify-center space-x-2"
            >
              <Save size={20} />
              <span>Guardar Borrador</span>
            </Button>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2">Información de Envío</h4>
            <p className="text-sm text-blue-600">
              La cotización será enviada por correo electrónico al cliente con todos los detalles y condiciones.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuoteBuilder;
