import React from 'react';

const HistoryTemplate = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {children}
      </div>
    </div>
  );
};

export default HistoryTemplate;
