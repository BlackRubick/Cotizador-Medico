import React from 'react';
import Card from '../../atoms/Card';

const ProfileTemplate = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <Card>
          {children}
        </Card>
      </div>
    </div>
  );
};

export default ProfileTemplate;
