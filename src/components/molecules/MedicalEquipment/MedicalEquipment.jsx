import React from 'react';

const MedicalEquipment = () => (
  <div className="relative w-full max-w-md mx-auto">
    <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl p-8">
      {/* Medical Equipment Illustration */}
      <div className="flex items-center justify-center space-x-4">
        {/* Main Equipment - X-Ray Machine */}
        <div className="bg-white rounded-lg p-4 shadow-lg">
          <div className="w-16 h-12 bg-gray-800 rounded mb-2 relative">
            <div className="w-6 h-6 bg-blue-500 rounded-full absolute top-1 left-1"></div>
            <div className="w-8 h-2 bg-green-400 absolute bottom-1 right-1 rounded"></div>
          </div>
          <div className="w-12 h-8 bg-gray-600 rounded relative">
            <div className="w-2 h-2 bg-red-500 rounded-full absolute top-1 left-1"></div>
          </div>
        </div>
        
        {/* Secondary Equipment - Monitor */}
        <div className="bg-white rounded-lg p-3 shadow-lg">
          <div className="w-12 h-8 bg-gray-900 rounded mb-1 relative">
            <div className="w-8 h-4 bg-blue-400 rounded absolute top-1 left-2"></div>
          </div>
          <div className="w-8 h-6 bg-gray-700 rounded relative">
            <div className="w-4 h-2 bg-green-500 rounded absolute bottom-1 left-2"></div>
          </div>
        </div>
        
        {/* Monitoring Device */}
        <div className="bg-white rounded-lg p-3 shadow-lg">
          <div className="w-10 h-6 bg-gray-800 rounded mb-1 relative">
            <div className="w-6 h-3 bg-cyan-400 rounded absolute top-1 left-2"></div>
          </div>
          <div className="w-6 h-4 bg-gray-600 rounded relative">
            <div className="w-2 h-2 bg-red-500 rounded-full absolute top-1 left-2"></div>
          </div>
        </div>
      </div>
      
      {/* Control Panels */}
      <div className="flex justify-center mt-4 space-x-2">
        <div className="w-8 h-8 bg-white rounded-lg shadow-md flex items-center justify-center">
          <div className="w-4 h-4 bg-gray-800 rounded"></div>
        </div>
        <div className="w-8 h-8 bg-white rounded-lg shadow-md flex items-center justify-center">
          <div className="w-4 h-4 bg-blue-600 rounded"></div>
        </div>
        <div className="w-8 h-8 bg-white rounded-lg shadow-md flex items-center justify-center">
          <div className="w-4 h-4 bg-green-600 rounded"></div>
        </div>
      </div>
      
      {/* Base Equipment */}
      <div className="flex justify-center mt-4">
        <div className="w-24 h-6 bg-white rounded-lg shadow-md flex items-center justify-center space-x-1">
          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
          <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        </div>
      </div>
    </div>
  </div>
);

export default MedicalEquipment;
