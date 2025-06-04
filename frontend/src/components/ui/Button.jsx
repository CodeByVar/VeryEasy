// src/components/ui/Button.jsx
import React from 'react';

function Button({ children, onClick, type = 'button', variant = 'primary', className = '', ...props }) {
  // Define estilos base y variantes con Tailwind CSS
  const baseStyles = 'font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-200 ease-in-out';

  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white shadow-md',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800 border border-gray-400',
    danger: 'bg-red-600 hover:bg-red-700 text-white shadow-md',
    success: 'bg-green-600 hover:bg-green-700 text-white shadow-md',
    outline: 'bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent',
  };

  const selectedVariantStyles = variants[variant] || variants.primary; // Usa el primario por defecto si la variante no existe

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseStyles} ${selectedVariantStyles} ${className}`}
      {...props} // Permite pasar otras props de HTML (e.g., disabled)
    >
      {children}
    </button>
  );
}

export default Button;