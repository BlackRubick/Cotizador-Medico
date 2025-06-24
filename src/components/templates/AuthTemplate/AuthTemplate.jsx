import React from 'react';
import AuthContainer from '../../organisms/AuthContainer';
import Logo from '../../atoms/Logo';
import SocialButtons from '../../molecules/SocialButtons';

const AuthTemplate = ({ children, title, showEquipment = true }) => (
  <AuthContainer showEquipment={showEquipment}>
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <div className="text-center mb-8">
        <Logo />
        {title && (
          <h1 className="text-2xl font-bold text-gray-800 mt-6">
            {title}
          </h1>
        )}
      </div>
      
      {children}
      
      <SocialButtons />
    </div>
  </AuthContainer>
);

export default AuthTemplate;
