import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Store, 
  Sparkles, 
  FastForward, 
  MousePointerClick
} from 'lucide-react';

export default function MarketIntroPortal({ onComplete }) {
  const [mounted, setMounted] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setMounted(true);

    // Total duration: 2400ms for a clear, cinematic 3-frame sequence
    const duration = 2400;
    const intervalTime = 25;
    const step = 100 / (duration / intervalTime);

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + step;
        if (next >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            onComplete();
          }, 350);
          return 100;
        }
        return next;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [onComplete]);

  // Derive sequence states deterministically from progress
  const frame = progress < 35 ? 1 : progress < 65 ? 2 : 3;
  const isClicked = progress >= 46;

  const handleSkip = () => {
    onComplete();
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      <motion.div
        key="market-intro-portal-overlay"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 1.05 }}
        transition={{ duration: 0.45, ease: "easeInOut" }}
        className="fixed inset-0 z-[9999] overflow-hidden bg-desa-primary text-white flex flex-col justify-between select-none"
        style={{ backgroundColor: '#163324' }}
      >
        {/* Ambient Warm Golden Glow in Center */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(232,61,35,0.14)_0%,_transparent_70%)] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-desa-accent/15 rounded-full blur-[130px] pointer-events-none" />

        {/* Top Header Bar inside Intro */}
        <div className="relative z-30 px-6 sm:px-10 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-desa-accent text-desa-primary flex items-center justify-center font-bold shadow-lg">
              <Store className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-bold text-sm sm:text-base tracking-tight text-white leading-tight">
                Pasar Desa Sumedang
              </span>
              <span className="text-[11px] text-desa-border/75 font-mono">
                Sentra Komoditas & UMKM Warga
              </span>
            </div>
          </div>

          {/* Quick Skip Button */}
          <button
            onClick={handleSkip}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-xs font-semibold tracking-wide text-desa-border transition-all border border-white/20 backdrop-blur-md cursor-pointer hover:scale-105 active:scale-95"
          >
            <span>Lewati</span>
            <FastForward className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Central Stage: 3-Frame Animated Market Icon */}
        <div className="relative z-30 max-w-lg mx-auto px-6 text-center my-auto flex flex-col items-center justify-center">
          
          <div className="relative w-44 h-44 sm:w-52 sm:h-52 flex items-center justify-center">
            
            {/* Ripple Pulse Wave on Click (Frame 2) */}
            {isClicked && (
              <>
                <motion.div
                  initial={{ scale: 0.8, opacity: 1 }}
                  animate={{ scale: 2.4, opacity: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="absolute inset-0 rounded-full border-2 border-desa-accent pointer-events-none"
                />
                <motion.div
                  initial={{ scale: 0.5, opacity: 0.8 }}
                  animate={{ scale: 3.2, opacity: 0 }}
                  transition={{ duration: 1.0, ease: "easeOut", delay: 0.1 }}
                  className="absolute inset-0 rounded-full bg-desa-accent/25 pointer-events-none"
                />
              </>
            )}

            {/* Simulated Animated Cursor (Frame 2: Appears, moves to center, clicks) */}
            <AnimatePresence>
              {frame === 2 && (
                <motion.div
                  initial={{ x: 70, y: 75, opacity: 0, scale: 1.4 }}
                  animate={
                    isClicked
                      ? { x: 10, y: 12, scale: 0.9, opacity: 1 }
                      : { x: 18, y: 22, scale: 1.2, opacity: 1 }
                  }
                  exit={{ opacity: 0, scale: 0.4 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="absolute z-40 pointer-events-none text-desa-accent drop-shadow-[0_4px_16px_rgba(245,183,49,0.7)]"
                >
                  <div className="relative">
                    <MousePointerClick className="w-10 h-10 fill-desa-accent stroke-desa-primary stroke-[1.5]" />
                    {isClicked && (
                      <motion.span 
                        initial={{ scale: 0, opacity: 1 }}
                        animate={{ scale: 2.2, opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full pointer-events-none"
                      />
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* The Market Icon */}
            <motion.div
              animate={
                frame === 3
                  ? { 
                      scale: [1, 3.8, 16], 
                      opacity: [1, 0.7, 0], 
                      filter: ['blur(0px)', 'blur(4px)', 'blur(16px)'],
                      rotate: [0, -1, 3]
                    }
                  : isClicked
                  ? { scale: [1, 0.92, 1.06], rotate: [0, -2, 0] }
                  : { scale: [0.92, 1], y: [0, -5, 0] }
              }
              transition={
                frame === 3
                  ? { duration: 0.85, ease: [0.25, 1, 0.5, 1] }
                  : isClicked
                  ? { duration: 0.35, ease: "easeOut" }
                  : { duration: 1.6, repeat: Infinity, ease: "easeInOut" }
              }
              className={`relative z-20 w-32 h-32 sm:w-40 sm:h-40 rounded-3xl p-7 sm:p-8 flex items-center justify-center transition-all duration-300 shadow-2xl ${
                isClicked 
                  ? 'bg-gradient-to-br from-desa-accent via-amber-400 to-amber-500 text-desa-primary shadow-[0_0_60px_rgba(245,183,49,0.7)] scale-105' 
                  : 'bg-white/10 text-desa-accent border border-white/20 backdrop-blur-2xl'
              }`}
            >
              {/* Market Traditional Village Gate / Store SVG Icon */}
              <svg 
                viewBox="0 0 64 64" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full drop-shadow-md"
              >
                {/* Traditional Gate Roof / Canopy */}
                <path 
                  d="M6 26L32 10L58 26L54 32H10L6 26Z" 
                  fill="currentColor" 
                  opacity="0.95"
                />
                {/* Roof Ornamental Crown */}
                <path 
                  d="M32 6L35 10H29L32 6Z" 
                  fill="currentColor" 
                />
                {/* Pillars */}
                <rect x="14" y="32" width="6" height="24" rx="2" fill="currentColor" opacity="0.85" />
                <rect x="44" y="32" width="6" height="24" rx="2" fill="currentColor" opacity="0.85" />
                {/* Center Gateway / Market Doorway */}
                <path 
                  d="M24 56V38C24 35.7909 25.7909 34 28 34H36C38.2091 34 40 35.7909 40 38V56H24Z" 
                  fill={isClicked ? "#1C2D22" : "#F5B731"} 
                />
                {/* Base Step */}
                <rect x="10" y="56" width="44" height="4" rx="2" fill="currentColor" opacity="0.9" />
              </svg>

              {/* Sparkle badge */}
              <div className="absolute -top-2.5 -right-2.5 w-8 h-8 rounded-full bg-desa-accent text-desa-primary flex items-center justify-center shadow-lg">
                <Sparkles className="w-4 h-4" />
              </div>
            </motion.div>

          </div>

          {/* Sequence Status Text */}
          <div className="mt-8 space-y-1.5 h-14">
            <motion.p 
              key={frame}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="font-heading text-xl sm:text-2xl font-bold tracking-tight text-white"
            >
              {frame === 1 && "Menyiapkan Pasar Desa..."}
              {frame === 2 && "Membuka Gerbang UMKM..."}
              {frame === 3 && "Memasuki Sentra Desa Sumedang!"}
            </motion.p>
            <p className="text-xs sm:text-sm text-desa-border/75 font-sans">
              Kurasi 40+ Pengrajin & Komoditas Otentik Desa
            </p>
          </div>

        </div>

        {/* Bottom Loading Progress Bar */}
        <div className="relative z-30 px-6 sm:px-10 py-8 flex flex-col items-center justify-center gap-3">
          
          <div className="w-full max-w-sm space-y-2.5">
            <div className="flex items-center justify-between text-xs sm:text-sm text-desa-border/90 font-mono">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-desa-accent animate-ping" />
                <span>Memuat Komoditas Pasar</span>
              </span>
              <span className="font-bold text-desa-accent text-sm">
                {Math.floor(progress)}%
              </span>
            </div>

            {/* The Progress Track and Bar */}
            <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden border border-white/15 backdrop-blur-md">
              <motion.div 
                className="h-full bg-gradient-to-r from-amber-400 to-desa-accent rounded-full shadow-[0_0_14px_rgba(245,183,49,0.8)]"
                style={{ width: `${progress}%` }}
                transition={{ ease: "linear" }}
              />
            </div>
          </div>

          <p className="text-xs text-desa-border/50">
            Didukung BUMDes Mandiri & Pemerintah Desa Kabupaten Sumedang
          </p>
        </div>

      </motion.div>
    </AnimatePresence>,
    document.body
  );
}
