import React, { useState } from 'react';
import Button from '../../atoms/Button';
import Input from '../../atoms/Input';

const LoginForm = ({ onSubmit, onForgotPassword, loading = false }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.username.trim()) {
      newErrors.username = 'El usuario es requerido';
    }
    
    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  return (
    <div className="space-y-6">
      <Input
        label="Usuario"
        name="username"
        placeholder="Ingresa tu usuario"
        value={formData.username}
        onChange={handleChange}
        error={errors.username}
        disabled={loading}
        required
      />
      
      <Input
        label="Contraseña"
        name="password"
        placeholder="Ingresa tu contraseña"
        value={formData.password}
        onChange={handleChange}
        showPasswordToggle={true}
        error={errors.password}
        disabled={loading}
        required
      />

      <div className="text-right">
        <button
          type="button"
          onClick={onForgotPassword}
          disabled={loading}
          className="text-sm text-blue-600 hover:text-blue-800 transition-colors cursor-pointer disabled:text-gray-400 disabled:cursor-not-allowed"
        >
          ¿Olvidaste tu contraseña?
        </button>
      </div>

      <Button 
        onClick={handleSubmit} 
        className="w-full"
        disabled={loading}
      >
        {loading ? 'INICIANDO...' : 'INICIAR'}
      </Button>
    </div>
  );
};

export default LoginForm;
