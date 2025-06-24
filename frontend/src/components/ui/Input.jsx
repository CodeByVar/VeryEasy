// src/components/ui/Input.jsx
import React from 'react';

function Input({ type = 'text', placeholder = '', value, onChange, className = '', ...props }) {
  const baseStyles = 'shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline';

  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`${baseStyles} ${className}`}
      {...props}
    />
  );
}

export default Input;