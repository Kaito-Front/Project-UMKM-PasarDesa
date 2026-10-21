import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import LurikDivider from './LurikDivider';
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
  ShieldCheck
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

  const handleNavClick = (page) => {
    setWebPage(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-desa-bg/95 backdrop-blur-md border-b border-desa-border transition-colors">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18">
            
            {/* Brand Logo */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleNavClick('home')}
              className="flex items-center gap-3 cursor-pointer group select-none"
            >
              <div className="w-10 h-10 rounded-xl bg-desa-primary text-desa-light flex items-center justify-center shadow-xs group-hover:bg-desa-accent transition-colors duration-200">
                <Store className="w-5 h-5 text-desa-light" />
              </div>
              <div className="flex flex-col">
                <span className="font-heading text-xl font-bold tracking-tight text-desa-primary leading-tight">
                  Pasar Desa
                </span>
                <span className="text-[10px] tracking-wider uppercase text-desa-muted font-medium">
                  Sumedang Mandiri
                </span>
              </div>
            </motion.div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-8">
              <button
                onClick={() => handleNavClick('home')}
                className={`text-sm tracking-tight transition-colors py-1 relative ${
                  webPage === 'home'
                    ? 'text-desa-accent font-semibold'
                    : 'text-desa-text hover:text-desa-accent font-medium'
                }`}
              >
                Beranda
                {webPage === 'home' && (
                  <motion.span 
                    layoutId="activeNavUnderline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-desa-accent rounded-full"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </button>

              <button
                onClick={() => handleNavClick('catalog')}
                className={`text-sm tracking-tight transition-colors py-1 relative ${
                  webPage === 'catalog'
                    ? 'text-desa-accent font-semibold'
                    : 'text-desa-text hover:text-desa-accent font-medium'
                }`}
              >
                Katalog Produk
                {webPage === 'catalog' && (
                  <motion.span 
                    layoutId="activeNavUnderline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-desa-accent rounded-full"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </button>

              <button
                onClick={() => handleNavClick('about')}
                className={`text-sm tracking-tight transition-colors py-1 relative ${
                  webPage === 'about'
                    ? 'text-desa-accent font-semibold'
                    : 'text-desa-text hover:text-desa-accent font-medium'
                }`}
              >
                Tentang Desa
                {webPage === 'about' && (
                  <motion.span 
                    layoutId="activeNavUnderline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-desa-accent rounded-full"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </button>

              <button
                onClick={() => setHelpModalOpen(true)}
                className="text-sm font-medium text-desa-muted hover:text-desa-accent transition-colors"
              >
                Bantuan & Layanan
              </button>
            </nav>

            {/* Right Action Icons & Controls */}
            <div className="hidden lg:flex items-center gap-3">
              
              {/* PWA Mode Trigger */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setCurrentView('mobile')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-desa-muted hover:text-desa-primary hover:bg-black/5 transition-all"
                title="Buka Pratinjau Mobile PWA"
              >
                <Smartphone className="w-3.5 h-3.5 text-desa-highlight" />
                <span>Versi Mobile</span>
              </motion.button>

              <div className="h-4 w-px bg-desa-border" />

              {/* Chat Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.94 }}
                onClick={() => setIsChatOpen(true)}
                className="relative p-2 rounded-lg text-desa-primary hover:bg-black/5 transition-colors"
                title="Chat Layanan Desa & Toko"
                aria-label="Chat Layanan Desa"
              >
                <MessageSquare className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-desa-accent rounded-full animate-pulse" />
              </motion.button>

              {/* Cart Button with Animated Bounce Pop on Count Change */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.94 }}
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 rounded-lg text-desa-primary hover:bg-black/5 transition-colors"
                title="Keranjang Belanja"
                aria-label="Keranjang Belanja"
              >
                <ShoppingCart className="w-4 h-4" />
                {cartCount > 0 && (
                  <motion.span 
                    key={cartCount}
                    initial={{ scale: 0.6 }}
                    animate={{ scale: [1.25, 1] }}
                    transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                    className="absolute top-0.5 right-0.5 min-w-4 h-4 px-1 bg-desa-accent text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-xs"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </motion.button>

              {/* User Account / Auth Button */}
              {isLoggedIn ? (
                <div className="flex items-center gap-2">
                  {currentUser?.role === 'admin' && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => setCurrentView('admin')}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-desa-primary text-white text-xs font-semibold shadow-xs hover:bg-desa-accent transition-colors"
                      title="Buka Dashboard Admin"
                    >
                      <Store className="w-3.5 h-3.5 text-desa-accent" />
                      <span>Panel Admin</span>
                    </motion.button>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => logout()}
                    className="flex items-center gap-2 pl-3 pr-3.5 py-1.5 rounded-lg border border-desa-border bg-white text-desa-primary text-xs font-semibold hover:border-desa-primary/40 transition-colors shadow-2xs"
                  >
                    <User className="w-3.5 h-3.5 text-desa-accent" />
                    <span>{currentUser ? currentUser.name.split(' ')[0] : 'Akun'} (Keluar)</span>
                  </motion.button>
                </div>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => handleNavClick('auth')}
                  className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-desa-primary text-desa-light text-xs font-semibold hover:bg-desa-primary/90 transition-all shadow-xs"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Masuk / Daftar</span>
                </motion.button>
              )}
            </div>

            {/* Mobile Header Controls */}
            <div className="flex lg:hidden items-center gap-1.5">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 text-desa-primary hover:bg-black/5 rounded-lg transition-colors"
                aria-label="Buka Keranjang"
              >
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <motion.span 
                    key={cartCount}
                    initial={{ scale: 0.6 }}
                    animate={{ scale: [1.2, 1] }}
                    className="absolute top-0.5 right-0.5 min-w-4 h-4 px-1 bg-desa-accent text-white text-[9px] font-bold rounded-full flex items-center justify-center"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-desa-primary hover:bg-black/5 rounded-lg transition-colors"
                aria-label="Toggle Menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </motion.button>
            </div>
          </div>
        </div>

        <LurikDivider variant="dark" height="1px" />

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="lg:hidden bg-desa-bg border-b border-desa-border px-4 pt-3 pb-6 space-y-3 overflow-hidden"
            >
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => handleNavClick('home')}
                  className={`text-left px-3 py-2.5 rounded-lg font-medium text-sm ${
                    webPage === 'home' ? 'bg-desa-primary text-desa-light' : 'text-desa-text hover:bg-black/5'
                  }`}
                >
                  Beranda
                </button>
                <button
                  onClick={() => handleNavClick('catalog')}
                  className={`text-left px-3 py-2.5 rounded-lg font-medium text-sm ${
                    webPage === 'catalog' ? 'bg-desa-primary text-desa-light' : 'text-desa-text hover:bg-black/5'
                  }`}
                >
                  Katalog Produk
                </button>
                <button
                  onClick={() => handleNavClick('about')}
                  className={`text-left px-3 py-2.5 rounded-lg font-medium text-sm ${
                    webPage === 'about' ? 'bg-desa-primary text-desa-light' : 'text-desa-text hover:bg-black/5'
                  }`}
                >
                  Tentang Desa
                </button>
                <button
                  onClick={() => {
                    setHelpModalOpen(true);
                    setMobileMenuOpen(false);
                  }}
                  className="text-left px-3 py-2.5 rounded-lg font-medium text-sm text-desa-muted hover:bg-black/5"
                >
                  Bantuan & Layanan
                </button>
              </div>

              <div className="pt-3 border-t border-desa-border flex flex-col gap-2">
                {currentUser?.role === 'admin' && (
                  <button
                    onClick={() => {
                      setCurrentView('admin');
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-xs font-semibold bg-desa-primary text-white shadow-xs"
                  >
                    <Store className="w-4 h-4 text-desa-accent" />
                    <span>Buka Panel Admin BUMDes</span>
                  </button>
                )}
                <button
                  onClick={() => {
                    setCurrentView('mobile');
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-xs font-semibold border border-desa-border bg-white text-desa-primary"
                >
                  <Smartphone className="w-4 h-4 text-desa-highlight" />
                  <span>Buka Mode Aplikasi Mobile (PWA)</span>
                </button>

                <button
                  onClick={() => handleNavClick('auth')}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-xs font-semibold bg-desa-primary text-desa-light shadow-xs"
                >
                  <User className="w-4 h-4" />
                  <span>{isLoggedIn ? 'Keluar dari Akun' : 'Masuk / Daftar Akun'}</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Clean Help Modal */}
      <AnimatePresence>
        {helpModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setHelpModalOpen(false)}
              className="fixed inset-0 bg-desa-primary/50 backdrop-blur-xs"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: 'spring', stiffness: 400, damping: 28 }}
              className="relative w-full max-w-md bg-white rounded-2xl p-6 border border-desa-border shadow-xl z-10 space-y-5"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-desa-bg flex items-center justify-center text-desa-accent">
                    <HelpCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-heading text-lg font-bold text-desa-primary">
                      Pusat Bantuan Desa
                    </h3>
                    <p className="text-xs text-desa-muted">Layanan administrasi & pengaduan transaksi</p>
                  </div>
                </div>
                <button
                  onClick={() => setHelpModalOpen(false)}
                  className="p-1 rounded-md text-desa-muted hover:text-desa-primary hover:bg-desa-bg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs text-desa-text">
                <div className="p-3.5 rounded-xl bg-desa-bg/70 border border-desa-border space-y-2">
                  <div className="flex items-center gap-2 font-medium text-desa-primary">
                    <Phone className="w-4 h-4 text-desa-accent shrink-0" />
                    <span>WhatsApp Layanan Warga: <strong>0812-3456-7890</strong></span>
                  </div>
                  <div className="flex items-center gap-2 font-medium text-desa-primary">
                    <Clock className="w-4 h-4 text-desa-highlight shrink-0" />
                    <span>Jam Operasional: Senin – Sabtu (08.00 – 16.00 WIB)</span>
                  </div>
                  <div className="flex items-center gap-2 text-desa-muted">
                    <ShieldCheck className="w-4 h-4 text-desa-muted shrink-0" />
                    <span>Sekretariat BUMDes Mandiri Kabupaten Sumedang</span>
                  </div>
                </div>
                <p className="text-desa-muted leading-relaxed">
                  Untuk pertanyaan produk, Anda juga dapat menggunakan tombol <strong>Chat Asisten & Toko</strong> di pojok kanan bawah.
                </p>
              </div>

              <div className="pt-2 flex justify-end">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setHelpModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-desa-primary text-white text-xs font-semibold hover:bg-desa-primary/90 transition-colors"
                >
                  Tutup
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
