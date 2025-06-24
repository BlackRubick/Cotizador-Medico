import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthTemplate from '../../templates/AuthTemplate';
import ForgotPasswordForm from '../../molecules/ForgotPasswordForm';

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async (formData) => {
    setLoading(true);
    try {
      // Simular envío de email
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Se han enviado las instrucciones a tu correo electrónico');
      navigate('/login');
    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/login');
  };

  return (
    <AuthTemplate showEquipment={false}>
      <ForgotPasswordForm 
        onSubmit={handleForgotPassword}
        onBack={handleBack}
        loading={loading}
      />
    </AuthTemplate>
  );
};

export default ForgotPasswordPage;
