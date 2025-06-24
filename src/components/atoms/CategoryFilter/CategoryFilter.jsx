import React from 'react';

const CategoryFilter = ({ label, active = false, onClick, className = '' }) => {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 rounded-full text-sm transition-colors ${
        active 
          ? 'bg-blue-600 text-white' 
          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
      } ${className}`}
    >
      {label}
    </button>
  );
};

export default CategoryFilter;
