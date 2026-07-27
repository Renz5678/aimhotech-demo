import React from 'react';

export default function Button({ 
  children, 
  variant = 'primary', 
  className = '', 
  icon,
  iconRight,
  ...props 
}) {
  const baseStyle = "w-full font-label-sm text-label-sm py-md rounded-lg flex items-center justify-center gap-sm transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 uppercase";
  
  const variants = {
    primary: "bg-primary text-white hover:bg-primary-container",
    secondary: "border-2 border-primary text-primary bg-transparent hover:bg-surface-container-low",
    surface: "bg-surface-bright text-primary hover:bg-surface-container-lowest",
  };

  return (
    <button 
      className={`${baseStyle} ${variants[variant]} ${className}`}
      {...props}
    >
      {icon && <span className="material-symbols-outlined text-[18px]">{icon}</span>}
      {children}
      {iconRight && <span className="material-symbols-outlined text-[18px]">{iconRight}</span>}
    </button>
  );
}
