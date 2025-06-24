import React from 'react';

const Icon = ({ type, className = '', size = 'md' }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  const icons = {
    microsoft: (
      <svg viewBox="0 0 24 24" className={sizes[size]} fill="currentColor">
        <path d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zM24 11.4H12.6V0H24v11.4z"/>
      </svg>
    ),
    medical: (
      <svg viewBox="0 0 24 24" className={sizes[size]} fill="currentColor">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>
    ),
    shield: (
      <svg viewBox="0 0 24 24" className={sizes[size]} fill="currentColor">
        <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M12,7C13.4,7 14.8,8.6 14.8,10V11.5C15.4,11.5 16,12.1 16,12.7V16.2C16,16.8 15.4,17.5 14.7,17.5H9.2C8.6,17.5 8,16.9 8,16.2V12.8C8,12.2 8.6,11.5 9.2,11.5V10C9.2,8.6 10.6,7 12,7M12,8.2C11.2,8.2 10.5,8.7 10.5,10V11.5H13.5V10C13.5,8.7 12.8,8.2 12,8.2Z"/>
      </svg>
    )
  };

  const colors = {
    microsoft: 'text-blue-600',
    medical: 'text-red-600',
    shield: 'text-blue-600'
  };

  return (
    <div className={`${colors[type]} ${className}`}>
      {icons[type]}
    </div>
  );
};

export default Icon;
