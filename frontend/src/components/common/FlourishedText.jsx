import React from 'react';

/**
 * FlourishedText
 * 
 * Kombinasi artistik: Huruf Kapital menggunakan Sloop Script (kaligrafi mengalir),
 * dan seluruh huruf kecil menggunakan Aileron (modern neo-grotesque).
 *
 * @param {string} text - Teks yang akan ditampilkan
 * @param {React.ReactNode} children - Teks jika dimasukkan sebagai children
 * @param {boolean} accentCap - Menjadikan huruf kapital berwarna aksen Tomato Red
 * @param {string} className - Kelas tambahan untuk wrapper
 * @param {string} capClassName - Kelas khusus untuk huruf kapital (misal: text-desa-accent)
 * @param {string} bodyClassName - Kelas khusus untuk huruf kecil
 */
export default function FlourishedText({ 
  text, 
  children, 
  accentCap = false, 
  className = '',
  capClassName = '',
  bodyClassName = ''
}) {
  const content = text || (typeof children === 'string' ? children : null);
  
  if (!content) {
    return <span className={`font-combo ${className}`}>{children}</span>;
  }

  // Memisahkan setiap huruf kapital (A-Z) dan karakter lainnya
  const parts = content.split(/([A-ZÀ-Ý])/g);

  return (
    <span className={`inline-block tracking-tight ${className}`}>
      {parts.map((part, index) => {
        if (!part) return null;
        const isUpper = /^[A-ZÀ-Ý]$/.test(part);
        if (isUpper) {
          return (
            <span
              key={index}
              className={`font-script font-normal inline-block text-[1.15em] leading-none align-baseline mr-[0.02em] ${
                accentCap ? 'text-desa-accent' : ''
              } ${capClassName}`}
            >
              {part}
            </span>
          );
        }
        return (
          <span key={index} className={`font-sans ${bodyClassName}`}>
            {part}
          </span>
        );
      })}
    </span>
  );
}
