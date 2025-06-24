import React from 'react';

const FilterButton = ({ children, active = false, onClick, className = '' }) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg transition-all duration-200 ${
        active 
          ? 'bg-blue-600 text-white shadow-md' 
          : 'bg-white text-gray-600 hover:bg-gray-50 shadow-sm'
      } ${className}`}
    >
      {children}
    </button>
  );
};

export default FilterButton;
