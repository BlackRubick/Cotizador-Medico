import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import Button from '../../atoms/Button';
import Input from '../../atoms/Input';

const ForgotPasswordForm = ({ onSubmit, onBack, loading = false }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = () => {
    if (!email.trim()) {
      setError('El correo es requerido');
      return;
    }
    
    if (!validateEmail(email)) {
      setError('Ingresa un correo válido');
      return;
    }
    
    setError('');
    onSubmit({ email });
  };

  const handleChange = (e) => {
    setEmail(e.target.value);
    if (error) setError('');
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          ¿OLVIDASTE TU CONTRASEÑA?
        </h2>
        <p className="text-sm text-gray-600">
          Ingresa tu correo electrónico y te enviaremos instrucciones para restablecer tu contraseña.
        </p>
      </div>

      <Input
        label="Correo"
        type="email"
        name="email"
        placeholder="Ingresa tu correo electrónico"
        value={email}
        onChange={handleChange}
        error={error}
        disabled={loading}
        required
      />

      <Button 
        onClick={handleSubmit} 
        className="w-full"
        disabled={loading}
      >
        {loading ? 'ENVIANDO...' : 'ENVIAR'}
      </Button>

      <Button
        variant="ghost"
        onClick={onBack}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2"
      >
        <ArrowLeft size={16} />
        Volver al inicio de sesión
      </Button>
    </div>
  );
};

export default ForgotPasswordForm;
