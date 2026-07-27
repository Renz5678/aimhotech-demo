import React from 'react';

export default function Card({ children, className = '', noPadding = false, onClick }) {
  const Component = onClick ? 'button' : 'div';
  return (
    <Component 
      onClick={onClick}
      className={`bg-surface-container-lowest border border-outline-variant rounded-xl forest-card-shadow ${noPadding ? '' : 'p-md'} ${onClick ? 'text-left active:scale-[0.98] transition-transform' : ''} ${className}`}
    >
      {children}
    </Component>
  );
}
