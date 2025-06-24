import React from 'react';

const Logo = ({ className = '', size = 'md' }) => {
  const sizes = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-20 h-20'
  };

  const iconSizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10'
  };

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className={`${sizes[size]} bg-blue-100 rounded-full flex items-center justify-center mb-2`}>
        <svg viewBox="0 0 24 24" className={`${iconSizes[size]} text-blue-600`} fill="currentColor">
          <path d="M19 8l-4 4h3c0 3.31-2.69 6-6 6a5.87 5.87 0 0 1-2.8-.7l-1.46 1.46A7.93 7.93 0 0 0 12 20c4.42 0 8-3.58 8-8h3l-4-4zM6 12c0-3.31 2.69-6 6-6 1.01 0 1.97.25 2.8.7l1.46-1.46A7.93 7.93 0 0 0 12 4c-4.42 0-8 3.58-8 8H1l4 4 4-4H6z"/>
        </svg>
      </div>
      <div className="text-center">
        <div className="text-xs text-gray-500 leading-tight">
          Cotizador
        </div>
      </div>
    </div>
  );
};

export default Logo;
