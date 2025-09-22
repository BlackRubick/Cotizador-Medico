import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../../context/AuthContext';
import Button from '../../atoms/Button';
import Input from '../../atoms/Input';

const LoginForm = () => {
  const navigate = useNavigate();
  const { login } = useAuthContext(); 
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);

    try {
      const result = await login(formData);
      
      if (result.success) {
        console.log('Login exitoso!');
        navigate('/dashboard');
      } else {
        setErrors({ general: result.error });
      }
    } catch (error) {
      setErrors({ general: 'Error inesperado' });
    } finally {
      setLoading(false);
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
      {errors.general && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-sm text-red-700">{errors.general}</p>
        </div>
      )}

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