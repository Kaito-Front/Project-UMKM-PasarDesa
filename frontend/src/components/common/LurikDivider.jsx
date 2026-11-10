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
            ? 'bg-[repeating-linear-gradient(0deg,#E83D23_0px,#E83D23_1.5px,transparent_1.5px,transparent_7px)]' 
            : 'bg-[repeating-linear-gradient(0deg,#163324_0px,#163324_1.5px,transparent_1.5px,transparent_7px)]'
        } opacity-35 ${className}`} 
        aria-hidden="true"
      />
    );
  }

  if (variant === 'accent') {
    return (
      <div 
        style={{ height }}
        className={`w-full bg-[repeating-linear-gradient(90deg,#E83D23_0px,#E83D23_1.5px,transparent_1.5px,transparent_7px)] opacity-40 ${animClass} ${className}`} 
        aria-hidden="true"
      />
    );
  }

  if (variant === 'light') {
    return (
      <div 
        style={{ height }}
        className={`w-full bg-[repeating-linear-gradient(90deg,rgba(251,248,243,0.5)_0px,rgba(251,248,243,0.5)_1.5px,transparent_1.5px,transparent_8px)] ${animClass} ${className}`} 
        aria-hidden="true"
      />
    );
  }

  if (variant === 'double') {
    return (
      <div className={`w-full space-y-1 ${animClass} ${className}`} aria-hidden="true">
        <div className="w-full h-[1px] bg-desa-border" />
        <div className="w-full h-[1.5px] bg-[repeating-linear-gradient(90deg,#163324_0px,#163324_1.5px,transparent_1.5px,transparent_8px)] opacity-35" />
        <div className="w-full h-[1px] bg-desa-border" />
      </div>
    );
  }

  return (
    <div 
      style={{ height }}
      className={`w-full bg-[repeating-linear-gradient(90deg,#163324_0px,#163324_1.5px,transparent_1.5px,transparent_8px)] opacity-30 ${animClass} ${className}`} 
      aria-hidden="true"
    />
  );
}
