import React from 'react';

const Modal = ({ open, onClose, title, children }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-xl shadow-lg max-w-lg w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl font-bold"
          aria-label="Cerrar"
        >
          ×
        </button>
        {title && <h2 className="text-xl font-bold mb-4 text-gray-800">{title}</h2>}
        {children}
      </div>
    </div>
  );
};

export default Modal;
