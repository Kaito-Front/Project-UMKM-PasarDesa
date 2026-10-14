import React from 'react';


export default function LurikDivider({ 
  className = '', 
  variant = 'dark',
  orientation = 'horizontal',
  height = '3px'
}) {
  if (orientation === 'vertical') {
    return (
      <div 
        className={`w-[3px] h-full ${
          variant === 'accent' 
            ? 'bg-[repeating-linear-gradient(0deg,#A85C3C_0px,#A85C3C_2px,transparent_2px,transparent_7px)]' 
            : 'bg-[repeating-linear-gradient(0deg,#3A3A38_0px,#3A3A38_2px,transparent_2px,transparent_7px)]'
        } opacity-75 ${className}`} 
        aria-hidden="true"
      />
    );
  }

  if (variant === 'accent') {
    return (
      <div 
        style={{ height }}
        className={`w-full bg-[repeating-linear-gradient(90deg,#A85C3C_0px,#A85C3C_2px,#EFEDE6_2px,#EFEDE6_7px)] opacity-90 ${className}`} 
        aria-hidden="true"
      />
    );
  }

  if (variant === 'light') {
    return (
      <div 
        style={{ height }}
        className={`w-full bg-[repeating-linear-gradient(90deg,rgba(239,237,230,0.6)_0px,rgba(239,237,230,0.6)_2px,transparent_2px,transparent_8px)] ${className}`} 
        aria-hidden="true"
      />
    );
  }

  if (variant === 'double') {
    return (
      <div className={`w-full space-y-1 ${className}`} aria-hidden="true">
        <div className="w-full h-[1px] bg-desa-primary/40" />
        <div className="w-full h-[2px] bg-[repeating-linear-gradient(90deg,#3A3A38_0px,#3A3A38_2px,transparent_2px,transparent_8px)] opacity-80" />
        <div className="w-full h-[1px] bg-desa-primary/40" />
      </div>
    );
  }
  return (
    <div 
      style={{ height }}
      className={`w-full bg-[repeating-linear-gradient(90deg,#3A3A38_0px,#3A3A38_2px,transparent_2px,transparent_8px)] opacity-70 ${className}`} 
      aria-hidden="true"
    />
  );
}

