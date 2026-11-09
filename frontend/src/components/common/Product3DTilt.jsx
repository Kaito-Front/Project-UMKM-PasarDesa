import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Sparkles, CheckCircle2 } from 'lucide-react';

export default function Product3DTilt({ product, onClick, className = '' }) {
  const cardRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  // Raw mouse coordinates normalized from -0.5 to 0.5
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for fluid, physical inertia
  const springConfig = { damping: 22, stiffness: 180, mass: 0.6 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  // 3D rotation angles (up to 16 degrees tilt)
  const rotateX = useTransform(smoothMouseY, [-0.5, 0.5], [14, -14]);
  const rotateY = useTransform(smoothMouseX, [-0.5, 0.5], [-16, 16]);
  
  // Parallax displacement for depth layers
  const imageTranslateZ = useTransform(smoothMouseX, [-0.5, 0.5], [35, 45]);
  const badgeTranslateZ = useTransform(smoothMouseX, [-0.5, 0.5], [60, 70]);

  // Dynamic floor shadow position (shifts opposite to tilt)
  const shadowTranslateX = useTransform(smoothMouseX, [-0.5, 0.5], [-20, 20]);
  const shadowTranslateY = useTransform(smoothMouseY, [-0.5, 0.5], [-10, 10]);
  const shadowBlur = useTransform(smoothMouseY, [-0.5, 0.5], ['28px', '38px']);

  // Specular light sheen gradient position
  const glareX = useTransform(smoothMouseX, [-0.5, 0.5], [0, 100]);
  const glareY = useTransform(smoothMouseY, [-0.5, 0.5], [0, 100]);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{ perspective: 1200 }}
      className={`relative cursor-pointer select-none py-6 px-4 flex flex-col items-center justify-center ${className}`}
    >
      {/* 3D Motion Container */}
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        animate={{
          scale: isHovered ? 1.05 : 1,
        }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-72 h-72 sm:w-88 sm:h-88 lg:w-[410px] lg:h-[410px] flex items-center justify-center"
      >
        {/* Floating Authenticity Badge (Parallax Layer +65px) */}
        <motion.div
          style={{
            transform: 'translateZ(65px)',
          }}
          className="absolute top-2 right-2 sm:right-6 z-30 px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-desa-border shadow-md flex items-center gap-1.5 text-xs font-bold text-desa-primary pointer-events-none"
        >
          <Sparkles className="w-3.5 h-3.5 text-desa-accent" />
          <span>100% Produk Lokal</span>
        </motion.div>

        {/* Centerpiece 3D Product Image (Layer +40px with natural drop shadow) */}
        <motion.div
          style={{
            transform: 'translateZ(40px)',
          }}
          className="relative w-full h-full flex items-center justify-center"
        >
          <img
            src={product.images?.[0] || '/kain-lurik.jpg'}
            alt={product.name}
            className="w-full h-full object-contain filter drop-shadow-[0_20px_35px_rgba(28,45,34,0.22)] transition-transform duration-300"
          />

          {/* Interactive Specular Glare / Sheen Overlay (Makes it feel like real physical material) */}
          <motion.div
            style={{
              background: useTransform(
                [glareX, glareY],
                ([gx, gy]) =>
                  `radial-gradient(circle at ${gx}% ${gy}%, rgba(255,255,255,0.42) 0%, rgba(245,183,49,0.12) 28%, transparent 68%)`
              ),
              opacity: isHovered ? 1 : 0,
            }}
            transition={{ opacity: { duration: 0.3 } }}
            className="absolute inset-0 rounded-3xl pointer-events-none mix-blend-overlay"
          />
        </motion.div>

        {/* Dynamic Floor Shadow (Layer -10px, shifts realistically) */}
        <motion.div
          style={{
            x: shadowTranslateX,
            y: shadowTranslateY,
            transform: 'translateZ(-20px)',
            boxShadow: useTransform(
              shadowBlur,
              (b) => `0 24px ${b} rgba(28, 45, 34, ${isHovered ? 0.32 : 0.22})`
            ),
          }}
          className="absolute -bottom-2 w-56 sm:w-72 lg:w-84 h-5 rounded-full bg-desa-primary/25 blur-lg pointer-events-none transition-all duration-300"
        />
      </motion.div>

      {/* Micro Interactive Hint */}
      <div className="mt-3 flex items-center gap-1.5 text-[11px] font-semibold text-desa-muted/80 bg-white/60 backdrop-blur-xs px-3 py-1 rounded-full border border-desa-border/50">
        <CheckCircle2 className="w-3.5 h-3.5 text-desa-accent" />
        <span>Gerakkan kursor untuk rotasi 3D real-time</span>
      </div>
    </div>
  );
}
