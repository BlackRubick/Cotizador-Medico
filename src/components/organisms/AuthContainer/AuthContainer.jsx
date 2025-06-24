import React from 'react';
import MedicalEquipment from '../../molecules/MedicalEquipment';

const AuthContainer = ({ children, showEquipment = true }) => (
  <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
    {showEquipment && (
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-50 to-indigo-100 items-center justify-center p-8">
        <MedicalEquipment />
      </div>
    )}
    
    <div className={`flex-1 ${showEquipment ? 'lg:w-1/2' : 'w-full'} flex items-center justify-center p-6`}>
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  </div>
);

export default AuthContainer;
