import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../../context/AuthContext';
import AuthTemplate from '../../templates/AuthTemplate';
import LoginForm from '../../molecules/LoginForm';

const LoginPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, login } = useAuthContext();
  const [loading, setLoading] = useState(false);

  // Si ya está autenticado, redirigir al dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleLogin = async (formData) => {
    setLoading(true);
    try {
      const result = await login(formData);
      if (result.success) {
        navigate('/dashboard');
      } else {
        alert('Error: ' + result.error);
      }
    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    navigate('/forgot-password');
  };

  return (
    <AuthTemplate title="INICIO" showEquipment={true}>
      <LoginForm 
        onSubmit={handleLogin}
        onForgotPassword={handleForgotPassword}
        loading={loading}
      />
    </AuthTemplate>
  );
};

export default LoginPage;
