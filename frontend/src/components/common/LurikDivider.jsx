import React from 'react';

export default function LurikDivider({ 
  className = '', 
  variant = 'dark',
  orientation = 'horizontal',
  height = '1.5px',
  animate = false
}) {
  const animClass = animate ? 'lurik-animate' : '';

  if (orientation === 'vertical') {
    return (
      <div 
        className={`w-[1.5px] h-full ${
          variant === 'accent' 
            ? 'bg-[repeating-linear-gradient(0deg,#F5B731_0px,#F5B731_1.5px,transparent_1.5px,transparent_7px)]' 
            : 'bg-[repeating-linear-gradient(0deg,#1C2D22_0px,#1C2D22_1.5px,transparent_1.5px,transparent_7px)]'
        } opacity-35 ${className}`} 
        aria-hidden="true"
      />
    );
  }

  if (variant === 'accent') {
    return (
      <div 
        style={{ height }}
        className={`w-full bg-[repeating-linear-gradient(90deg,#F5B731_0px,#F5B731_1.5px,transparent_1.5px,transparent_7px)] opacity-40 ${animClass} ${className}`} 
        aria-hidden="true"
      />
    );
  }

  if (variant === 'light') {
    return (
      <div 
        style={{ height }}
        className={`w-full bg-[repeating-linear-gradient(90deg,rgba(232,236,230,0.4)_0px,rgba(232,236,230,0.4)_1.5px,transparent_1.5px,transparent_8px)] ${animClass} ${className}`} 
        aria-hidden="true"
      />
    );
  }

  if (variant === 'double') {
    return (
      <div className={`w-full space-y-1 ${animClass} ${className}`} aria-hidden="true">
        <div className="w-full h-[1px] bg-desa-border" />
        <div className="w-full h-[1.5px] bg-[repeating-linear-gradient(90deg,#1C2D22_0px,#1C2D22_1.5px,transparent_1.5px,transparent_8px)] opacity-35" />
        <div className="w-full h-[1px] bg-desa-border" />
      </div>
    );
  }

  return (
    <div 
      style={{ height }}
      className={`w-full bg-[repeating-linear-gradient(90deg,#1C2D22_0px,#1C2D22_1.5px,transparent_1.5px,transparent_8px)] opacity-30 ${animClass} ${className}`} 
      aria-hidden="true"
    />
  );
}
