import React from 'react';
import { User } from 'lucide-react';

const Avatar = ({ src, alt, size = 'md', className = '' }) => {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20'
  };

  return (
    <div className={`${sizes[size]} rounded-full overflow-hidden bg-blue-500 flex items-center justify-center ${className}`}>
      {src ? (
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      ) : (
        <User className="w-2/3 h-2/3 text-white" />
      )}
    </div>
  );
};

export default Avatar;
