// src/components/ui/Card.jsx
import React from 'react';

function Card({ children, className = '', ...props }) {
  const baseStyles = 'bg-white rounded-lg shadow-md overflow-hidden';

  return (
    <div
      className={`${baseStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export default Card;