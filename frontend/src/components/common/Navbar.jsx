import React, { useState, useEffect } from 'react';
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
    setIsChatOpen
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [helpModalOpen, setHelpModalOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (page) => {
    setWebPage(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Floating Pill Header Bar (Reference: Shoe Product Showcase Hero) */}
      <header className="sticky top-0 z-40 transition-all duration-300 py-3 px-4 sm:px-6 lg:px-8">
        <div className="max-w-screen-2xl mx-auto">
          <nav 
            className={`transition-all duration-300 rounded-full px-4 sm:px-6 py-2.5 flex items-center justify-between border ${
              isScrolled 
                ? 'bg-white/90 backdrop-blur-md border-desa-border shadow-md' 
                : 'bg-white/75 backdrop-blur-sm border-desa-border/70 shadow-xs'
            }`}
          >
            {/* Brand Pill (Left) */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleNavClick('home')}
              className="flex items-center gap-2.5 cursor-pointer group select-none"
            >
              <div className="w-9 h-9 rounded-full bg-desa-primary text-white flex items-center justify-center shadow-xs transition-colors duration-200 group-hover:bg-desa-accent group-hover:text-desa-primary">
                <Store className="w-4 h-4 transition-transform group-hover:scale-110" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-heading text-base font-bold tracking-tight text-desa-primary leading-none">
                    Pasar Desa
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-desa-accent hidden sm:inline-block" />
                </div>
                <span className="text-[10px] text-desa-muted font-medium tracking-wide leading-tight">
                  Sumedang Mandiri
                </span>
              </div>
            </motion.div>

            {/* Desktop Navigation Links (Center Capsule) */}
            <div className="hidden lg:flex items-center bg-desa-surface/80 rounded-full p-1 border border-desa-border/60">
              <button
                onClick={() => handleNavClick('home')}
                className={`relative px-4 py-1.5 rounded-full text-xs font-semibold tracking-tight transition-all ${
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
                className={`relative px-4 py-1.5 rounded-full text-xs font-semibold tracking-tight transition-all ${
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
                className={`relative px-4 py-1.5 rounded-full text-xs font-semibold tracking-tight transition-all ${
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
                className="px-3.5 py-1.5 rounded-full text-xs font-medium text-desa-muted hover:text-desa-primary transition-colors"
              >
                Bantuan
              </button>
            </div>

            {/* Right Action Icons & Controls (Right Pill Group) */}
            <div className="hidden lg:flex items-center gap-2">
              
              {/* PWA Mode Trigger */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setCurrentView('mobile')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-desa-muted hover:text-desa-primary hover:bg-desa-surface transition-all border border-transparent hover:border-desa-border/70"
                title="Buka Pratinjau Mobile PWA"
              >
                <Smartphone className="w-3.5 h-3.5 text-desa-primary" />
                <span>PWA Mobile</span>
              </motion.button>

              <div className="h-4 w-px bg-desa-border/80 mx-1" />

              {/* Chat Button */}
              <motion.button
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.94 }}
                onClick={() => setIsChatOpen(true)}
                className="relative p-2 rounded-full text-desa-primary hover:bg-desa-surface transition-colors border border-transparent hover:border-desa-border/70"
                title="Chat Asisten Desa & Toko"
                aria-label="Chat Asisten Desa"
              >
                <MessageSquare className="w-4 h-4" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-desa-accent rounded-full ring-2 ring-white" />
              </motion.button>

              {/* Cart Button with Sunbeam Yellow Count Badge */}
              <motion.button
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.94 }}
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 rounded-full text-desa-primary hover:bg-desa-surface transition-colors border border-transparent hover:border-desa-border/70"
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
                    className="absolute -top-1 -right-1 min-w-4.5 h-4.5 px-1 bg-desa-accent text-desa-primary text-[10px] font-bold rounded-full flex items-center justify-center shadow-xs ring-2 ring-white"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </motion.button>

              {/* User Account / Auth Button */}
              {isLoggedIn ? (
                <div className="flex items-center gap-1.5 ml-1">
                  {currentUser?.role === 'admin' && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => setCurrentView('admin')}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-desa-primary text-white text-xs font-semibold shadow-xs hover:bg-desa-primary/90 transition-colors"
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
                    className="flex items-center gap-1.5 pl-3 pr-3.5 py-1.5 rounded-full border border-desa-border bg-desa-surface text-desa-primary text-xs font-semibold hover:border-desa-primary/40 transition-colors shadow-2xs"
                  >
                    <User className="w-3.5 h-3.5 text-desa-muted" />
                    <span>{currentUser ? currentUser.name.split(' ')[0] : 'Akun'}</span>
                  </motion.button>
                </div>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => handleNavClick('auth')}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-desa-primary text-white text-xs font-semibold hover:bg-desa-primary/90 transition-all shadow-xs ml-1"
                >
                  <User className="w-3.5 h-3.5 text-desa-accent" />
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
                    className="absolute top-0 right-0 min-w-4 h-4 px-1 bg-desa-accent text-desa-primary text-[9px] font-bold rounded-full flex items-center justify-center ring-2 ring-white"
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
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </motion.button>
            </div>
          </nav>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden mt-2 bg-white/95 backdrop-blur-md border border-desa-border rounded-2xl px-4 pt-3 pb-5 space-y-3 shadow-lg overflow-hidden"
            >
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => handleNavClick('home')}
                  className={`text-left px-3 py-2 rounded-xl font-medium text-xs ${
                    webPage === 'home' ? 'bg-desa-primary text-white font-semibold' : 'text-desa-text hover:bg-desa-surface'
                  }`}
                >
                  Beranda
                </button>
                <button
                  onClick={() => handleNavClick('catalog')}
                  className={`text-left px-3 py-2 rounded-xl font-medium text-xs ${
                    webPage === 'catalog' ? 'bg-desa-primary text-white font-semibold' : 'text-desa-text hover:bg-desa-surface'
                  }`}
                >
                  Katalog Produk
                </button>
                <button
                  onClick={() => handleNavClick('about')}
                  className={`text-left px-3 py-2 rounded-xl font-medium text-xs ${
                    webPage === 'about' ? 'bg-desa-primary text-white font-semibold' : 'text-desa-text hover:bg-desa-surface'
                  }`}
                >
                  Tentang Desa
                </button>
                <button
                  onClick={() => {
                    setHelpModalOpen(true);
                    setMobileMenuOpen(false);
                  }}
                  className="text-left px-3 py-2 rounded-xl font-medium text-xs text-desa-muted hover:bg-desa-surface"
                >
                  Bantuan & Layanan
                </button>
              </div>

              <div className="pt-2 border-t border-desa-border flex flex-col gap-2">
                <button
                  onClick={() => {
                    setCurrentView('mobile');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-desa-surface text-desa-primary text-xs font-semibold border border-desa-border"
                >
                  <Smartphone className="w-4 h-4 text-desa-primary" />
                  <span>Buka Mode Mobile PWA</span>
                </button>

                <button
                  onClick={() => {
                    setIsChatOpen(true);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-desa-surface text-desa-primary text-xs font-semibold border border-desa-border"
                >
                  <MessageSquare className="w-4 h-4 text-desa-accent" />
                  <span>Chat Asisten Virtual Desa</span>
                </button>

                {isLoggedIn ? (
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full py-2 rounded-xl bg-desa-surface text-desa-muted text-xs font-semibold border border-desa-border hover:text-desa-primary"
                  >
                    Keluar ({currentUser?.name.split(' ')[0]})
                  </button>
                ) : (
                  <button
                    onClick={() => handleNavClick('auth')}
                    className="w-full py-2.5 rounded-xl bg-desa-primary text-white text-xs font-semibold hover:bg-desa-primary/90 flex items-center justify-center gap-2 shadow-xs"
                  >
                    <User className="w-3.5 h-3.5 text-desa-accent" />
                    <span>Masuk / Daftar Akun</span>
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Help Modal */}
      <AnimatePresence>
        {helpModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-desa-primary/60 backdrop-blur-xs">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-desa-border space-y-5"
            >
              <div className="flex items-center justify-between pb-3 border-b border-desa-border">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-desa-surface flex items-center justify-center text-desa-primary">
                    <HelpCircle className="w-4 h-4 text-desa-primary" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-desa-primary text-base">
                      Pusat Informasi & Bantuan
                    </h3>
                    <p className="text-xs text-desa-muted">
                      Layanan resmi BUMDes Pasar Desa Sumedang
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setHelpModalOpen(false)}
                  className="p-1 rounded-full text-desa-muted hover:bg-desa-surface transition-colors"
                  aria-label="Tutup Modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs text-desa-muted">
                <div className="p-3.5 rounded-xl bg-desa-surface border border-desa-border/70 space-y-1.5">
                  <div className="flex items-center gap-2 font-semibold text-desa-primary">
                    <Clock className="w-3.5 h-3.5 text-desa-accent" />
                    <span>Jam Operasional Pelayanan</span>
                  </div>
                  <p>Senin – Sabtu: 08.00 – 16.30 WIB. Pesanan di luar jam kerja diproses hari berikutnya.</p>
                </div>

                <div className="p-3.5 rounded-xl bg-desa-surface border border-desa-border/70 space-y-1.5">
                  <div className="flex items-center gap-2 font-semibold text-desa-primary">
                    <Phone className="w-3.5 h-3.5 text-desa-accent" />
                    <span>Kontak Helpdesk Desa</span>
                  </div>
                  <p>WhatsApp BUMDes: +62 821-1234-5678 • Email: bumdes@pasardesa.sumedangkab.go.id</p>
                </div>

                <div className="p-3.5 rounded-xl bg-desa-surface border border-desa-border/70 space-y-1.5">
                  <div className="flex items-center gap-2 font-semibold text-desa-primary">
                    <ShieldCheck className="w-3.5 h-3.5 text-desa-primary" />
                    <span>Jaminan Keaslian Produk</span>
                  </div>
                  <p>Setiap produk diproduksi langsung oleh pengrajin & petani terverifikasi dari 5 sentra kecamatan di Sumedang.</p>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setHelpModalOpen(false)}
                  className="px-4 py-2 rounded-full bg-desa-primary text-white text-xs font-semibold hover:bg-desa-primary/90 transition-colors"
                >
                  Tutup Informasi
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
