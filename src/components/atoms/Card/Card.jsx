import React from 'react';

const Card = ({ children, className = '', padding = 'p-6', shadow = 'shadow-lg' }) => {
  return (
    <div className={`bg-white rounded-xl ${shadow} ${padding} ${className}`}>
      {children}
    </div>
  );
};

export default Card;
