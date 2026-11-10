import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { 
  Store, 
  User, 
  Smartphone, 
  Menu, 
  X,
  ShoppingCart,
  MessageSquare,
  HelpCircle,
  Phone,
  Clock,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

export default function Navbar() {
  const { 
    setCurrentView,
    webPage, setWebPage, 
    currentUser, isLoggedIn, logout,
    cartCount, setIsCartOpen,
    setIsChatOpen,
    openAuth
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [helpModalOpen, setHelpModalOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const isNavigatingRef = useRef(false);

  // Instantly reset scroll state and lock scroll events during page transitions to prevent navbar oscillation
  useEffect(() => {
    isNavigatingRef.current = true;
    setIsScrolled(false);
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

    if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    // Keep scroll handler locked until exit/enter transitions (AnimatePresence) and page DOM fully settle
    const timer = setTimeout(() => {
      isNavigatingRef.current = false;
      const y = window.scrollY || 0;
      setIsScrolled(y > 80);
    }, 450);

    return () => clearTimeout(timer);
  }, [webPage]);

  // Robust scroll listener with hysteresis: shrink past 80px, expand only near top (< 30px)
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (isNavigatingRef.current) return;

      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (isNavigatingRef.current) {
            ticking = false;
            return;
          }
          const y = window.scrollY || 0;
          setIsScrolled((prev) => {
            if (y > 80) return true;
            if (y < 30) return false;
            return prev;
          });
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (page) => {
    setWebPage(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  };

  return (
    <>
      {/* Dynamic Floating Capsule Navbar with Smooth Shrink on Scroll */}
      <motion.header 
        className="sticky top-0 z-40 transition-colors py-2 sm:py-2.5"
        layout={false}
      >
        <motion.div 
          className="mx-auto px-3 sm:px-6"
          animate={{
            // Smooth transition from full-width 2xl (96rem / 1536px) to sleek compact capsule (58rem / 928px)
            maxWidth: isScrolled ? '58rem' : '96rem',
          }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        >
          <nav 
            className={`rounded-full flex items-center justify-between border transition-all px-3 sm:px-5 lg:px-6 py-1.5 sm:py-2.5 ${
              isScrolled 
                ? 'bg-[#FBF8F3]/90 backdrop-blur-2xl border-white/95 shadow-[0_16px_40px_rgba(22,51,36,0.1),inset_0_1px_1.5px_rgba(255,255,255,0.95)]' 
                : 'bg-[#FBF8F3]/75 backdrop-blur-xl border-white/80 shadow-[0_4px_25px_rgba(22,51,36,0.04),inset_0_1px_1px_rgba(255,255,255,0.85)]'
            }`}
          >
            {/* Brand Pill (Left) */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleNavClick('home')}
              className="flex items-center gap-2.5 cursor-pointer group select-none shrink-0"
            >
              <div className="w-8.5 h-8.5 rounded-full bg-desa-primary text-[#FBF8F3] flex items-center justify-center shadow-xs transition-colors duration-300 group-hover:bg-desa-accent group-hover:text-white shrink-0">
                <Store className="w-4 h-4 transition-transform group-hover:scale-110" />
              </div>
              <div className="flex flex-col justify-center min-h-[32px]">
                <div className="flex items-center gap-1.5">
                  <span className="font-heading font-black tracking-tight text-desa-primary text-sm sm:text-base leading-none">
                    Pasar Desa
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-desa-accent hidden sm:inline-block" />
                </div>
                <span className="text-[10px] text-desa-muted font-medium tracking-wide leading-tight hidden sm:block">
                  Sumedang Mandiri
                </span>
              </div>
            </motion.div>

            {/* Desktop Navigation Links (Center Capsule - Liquid Glass) */}
            <div className={`hidden lg:flex items-center bg-white/60 backdrop-blur-md rounded-full border border-white/80 shadow-2xs transition-all ${
              isScrolled ? 'p-0.5' : 'p-1'
            }`}>
              <button
                onClick={() => handleNavClick('home')}
                className={`relative rounded-full text-xs font-bold tracking-tight transition-all ${
                  isScrolled ? 'px-3.5 py-1' : 'px-4 py-1.5'
                } ${
                  webPage === 'home'
                    ? 'text-white'
                    : 'text-desa-muted hover:text-desa-primary'
                }`}
              >
                {webPage === 'home' && (
                  <motion.div 
                    layoutId="activeNavPill"
                    className="absolute inset-0 bg-desa-primary rounded-full shadow-xs"
                    transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                  />
                )}
                <span className="relative z-10">Beranda</span>
              </button>

              <button
                onClick={() => handleNavClick('catalog')}
                className={`relative rounded-full text-xs font-bold tracking-tight transition-all ${
                  isScrolled ? 'px-3.5 py-1' : 'px-4 py-1.5'
                } ${
                  webPage === 'catalog'
                    ? 'text-white'
                    : 'text-desa-muted hover:text-desa-primary'
                }`}
              >
                {webPage === 'catalog' && (
                  <motion.div 
                    layoutId="activeNavPill"
                    className="absolute inset-0 bg-desa-primary rounded-full shadow-xs"
                    transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                  />
                )}
                <span className="relative z-10">Katalog Produk</span>
              </button>

              <button
                onClick={() => handleNavClick('about')}
                className={`relative rounded-full text-xs font-bold tracking-tight transition-all ${
                  isScrolled ? 'px-3.5 py-1' : 'px-4 py-1.5'
                } ${
                  webPage === 'about'
                    ? 'text-white'
                    : 'text-desa-muted hover:text-desa-primary'
                }`}
              >
                {webPage === 'about' && (
                  <motion.div 
                    layoutId="activeNavPill"
                    className="absolute inset-0 bg-desa-primary rounded-full shadow-xs"
                    transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                  />
                )}
                <span className="relative z-10">Tentang Desa</span>
              </button>

              <button
                onClick={() => setHelpModalOpen(true)}
                className={`rounded-full text-xs font-semibold text-desa-muted hover:text-desa-primary transition-colors ${
                  isScrolled ? 'px-3 py-1' : 'px-3.5 py-1.5'
                }`}
              >
                Bantuan
              </button>
            </div>

            {/* Right Action Icons & Controls (Right Pill Group) */}
            <div className="hidden lg:flex items-center gap-1.5 shrink-0">
              
              {/* PWA Mode Trigger */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setCurrentView('mobile')}
                className={`flex items-center gap-1.5 rounded-full text-xs font-bold text-desa-muted hover:text-desa-primary hover:bg-white/60 transition-all border border-transparent hover:border-desa-border/70 ${
                  isScrolled ? 'px-2.5 py-1' : 'px-3 py-1.5'
                }`}
                title="Buka Pratinjau Mobile PWA"
              >
                <Smartphone className="w-3.5 h-3.5 text-desa-primary" />
                <span className="hidden xl:inline">PWA Mobile</span>
              </motion.button>

              <div className="h-3.5 w-px bg-desa-border/80 mx-0.5" />

              {/* Chat Button */}
              <motion.button
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.94 }}
                onClick={() => setIsChatOpen(true)}
                className="relative p-1.5 sm:p-2 rounded-full text-desa-primary hover:bg-white/60 transition-colors border border-transparent hover:border-desa-border/70"
                title="Chat Asisten Desa & Toko"
                aria-label="Chat Asisten Desa"
              >
                <MessageSquare className="w-4 h-4" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-desa-accent rounded-full ring-2 ring-white" />
              </motion.button>

              {/* Cart Button with Tomato Red Count Badge */}
              <motion.button
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.94 }}
                onClick={() => setIsCartOpen(true)}
                className="relative p-1.5 sm:p-2 rounded-full text-desa-primary hover:bg-white/60 transition-colors border border-transparent hover:border-desa-border/70"
                title="Keranjang Belanja"
                aria-label="Keranjang Belanja"
              >
                <ShoppingCart className="w-4 h-4" />
                {cartCount > 0 && (
                  <motion.span 
                    key={cartCount}
                    initial={{ scale: 0.4 }}
                    animate={{ scale: [1, 1.25, 1] }}
                    transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                    className="absolute -top-1 -right-1 min-w-4.5 h-4.5 px-1 bg-desa-accent text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-xs ring-2 ring-[#FBF8F3]"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </motion.button>

              {/* User Account / Auth Button */}
              {isLoggedIn ? (
                <div className="flex items-center gap-1.5 ml-0.5">
                  {currentUser?.role === 'admin' && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => setCurrentView('admin')}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-desa-primary text-white text-xs font-bold shadow-xs hover:bg-desa-primary/90 transition-colors"
                      title="Buka Dashboard Admin"
                    >
                      <Store className="w-3.5 h-3.5 text-desa-accent" />
                      <span>Admin</span>
                    </motion.button>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => logout()}
                    className="flex items-center gap-1.5 pl-3 pr-3.5 py-1.5 rounded-full border border-desa-border bg-white/70 backdrop-blur-sm text-desa-primary text-xs font-bold hover:border-desa-primary/40 transition-colors shadow-2xs"
                  >
                    <User className="w-3.5 h-3.5 text-desa-muted" />
                    <span>{currentUser ? currentUser.name.split(' ')[0] : 'Akun'}</span>
                  </motion.button>
                </div>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => openAuth('masuk')}
                  className={`flex items-center gap-1.5 rounded-full bg-desa-accent text-white text-xs font-bold hover:bg-desa-highlight transition-all shadow-xs ml-0.5 ${
                    isScrolled ? 'px-3.5 py-1.5' : 'px-4 py-1.5'
                  }`}
                >
                  <User className="w-3.5 h-3.5 text-white" />
                  <span>Masuk</span>
                </motion.button>
              )}
            </div>

            {/* Mobile Header Controls */}
            <div className="flex lg:hidden items-center gap-1.5">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 text-desa-primary hover:bg-black/5 rounded-full transition-colors"
                aria-label="Buka Keranjang"
              >
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <motion.span 
                    key={cartCount}
                    initial={{ scale: 0.4 }}
                    animate={{ scale: [1, 1.25, 1] }}
                    className="absolute top-0 right-0 min-w-4 h-4 px-1 bg-desa-accent text-white text-[9px] font-bold rounded-full flex items-center justify-center ring-2 ring-white"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-desa-primary hover:bg-black/5 rounded-full transition-colors"
                aria-label="Toggle Menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5 text-desa-accent" /> : <Menu className="w-5 h-5" />}
              </motion.button>
            </div>
          </nav>
        </motion.div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden mt-2 mx-4 bg-[#FBF8F3]/95 backdrop-blur-xl border border-white/80 rounded-2xl px-4 pt-3 pb-5 space-y-3 shadow-xl overflow-hidden"
            >
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => handleNavClick('home')}
                  className={`text-left px-3 py-2 rounded-xl text-sm font-semibold ${
                    webPage === 'home' ? 'bg-desa-primary text-white' : 'text-desa-text hover:bg-black/5'
                  }`}
                >
                  Beranda Pasar
                </button>
                <button
                  onClick={() => handleNavClick('catalog')}
                  className={`text-left px-3 py-2 rounded-xl text-sm font-semibold ${
                    webPage === 'catalog' ? 'bg-desa-primary text-white' : 'text-desa-text hover:bg-black/5'
                  }`}
                >
                  Katalog Semua Produk
                </button>
                <button
                  onClick={() => handleNavClick('about')}
                  className={`text-left px-3 py-2 rounded-xl text-sm font-semibold ${
                    webPage === 'about' ? 'bg-desa-primary text-white' : 'text-desa-text hover:bg-black/5'
                  }`}
                >
                  Tentang Desa & Sentra
                </button>
                <button
                  onClick={() => { setHelpModalOpen(true); setMobileMenuOpen(false); }}
                  className="text-left px-3 py-2 rounded-xl text-sm font-semibold text-desa-text hover:bg-black/5 flex items-center justify-between"
                >
                  <span>Bantuan & Panduan</span>
                  <HelpCircle className="w-4 h-4 text-desa-muted" />
                </button>
              </div>

              <div className="pt-2 border-t border-desa-border/50 flex flex-col gap-2">
                <button
                  onClick={() => { setCurrentView('mobile'); setMobileMenuOpen(false); }}
                  className="w-full py-2 px-3 rounded-xl border border-desa-border text-xs font-semibold text-desa-primary flex items-center justify-center gap-2 hover:bg-black/5"
                >
                  <Smartphone className="w-4 h-4" />
                  <span>Buka Mode Mobile PWA</span>
                </button>

                {isLoggedIn ? (
                  <div className="space-y-1.5 pt-1">
                    {currentUser?.role === 'admin' && (
                      <button
                        onClick={() => { setCurrentView('admin'); setMobileMenuOpen(false); }}
                        className="w-full py-2 px-3 rounded-xl bg-desa-primary text-white text-xs font-semibold flex items-center justify-center gap-1.5"
                      >
                        <Store className="w-3.5 h-3.5 text-desa-accent" />
                        <span>Panel Admin Desa</span>
                      </button>
                    )}
                    <button
                      onClick={() => { logout(); setMobileMenuOpen(false); }}
                      className="w-full py-2 px-3 rounded-xl border border-red-200 text-red-600 text-xs font-semibold hover:bg-red-50"
                    >
                      Keluar ({currentUser?.name})
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => { openAuth('masuk'); setMobileMenuOpen(false); }}
                    className="w-full py-2.5 px-3 rounded-xl bg-desa-accent text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <User className="w-3.5 h-3.5 text-white" />
                    <span>Masuk ke Akun</span>
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Help Modal */}
      <AnimatePresence>
        {helpModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full border border-desa-border shadow-2xl space-y-5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-desa-accent/15 text-desa-accent flex items-center justify-center">
                    <HelpCircle className="w-4 h-4 text-desa-accent" />
                  </div>
                  <h3 className="font-heading font-bold text-lg text-desa-primary">
                    Pusat Bantuan Warga
                  </h3>
                </div>
                <button
                  onClick={() => setHelpModalOpen(false)}
                  className="p-1 rounded-full text-desa-muted hover:text-desa-primary hover:bg-black/5"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs text-desa-muted leading-relaxed">
                <div className="p-3 rounded-xl bg-desa-bg/70 border border-desa-border space-y-1">
                  <div className="font-semibold text-desa-primary flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-desa-accent" />
                    <span>Platform Resmi BUMDes</span>
                  </div>
                  <p className="text-[11px]">
                    Semua transaksi belanja terhubung langsung ke pengrajin lokal tanpa potongan komisi perantara.
                  </p>
                </div>

                <div className="space-y-2 pt-1 text-desa-text font-medium">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-desa-accent shrink-0" />
                    <span>Sekretariat: 0819-1519-4171</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-desa-accent shrink-0" />
                    <span>Layanan: Senin - Sabtu (08.00 - 16.00 WIB)</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  onClick={() => {
                    setHelpModalOpen(false);
                    setIsChatOpen(true);
                  }}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-desa-primary text-white text-xs font-semibold hover:bg-desa-primary/90 flex items-center justify-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Tanya Asisten AI</span>
                </button>
                <button
                  onClick={() => setHelpModalOpen(false)}
                  className="py-2.5 px-4 rounded-xl border border-desa-border text-xs font-semibold text-desa-muted hover:text-desa-primary"
                >
                  Tutup
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
