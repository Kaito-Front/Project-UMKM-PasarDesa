import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import LurikDivider from './LurikDivider';
import { 
  Store, 
  Search, 
  User, 
  Smartphone, 
  Menu, 
  X,
  ShoppingBag,
  ShoppingCart,
  MessageSquare,
  Bell
} from 'lucide-react';

export default function Navbar() {
  const { 
    setCurrentView,
    webPage, setWebPage, 
    currentUser, isLoggedIn, logout,
    searchQuery, setSearchQuery,
    cartCount, setIsCartOpen,
    setIsChatOpen
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (page) => {
    setWebPage(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 bg-desa-bg/95 backdrop-blur-md shadow-sm border-b border-desa-primary/10 transition-all">
      
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          
          <motion.div 
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3.5 cursor-pointer group select-none"
          >
            <div className="w-12 h-12 rounded-2xl bg-desa-primary text-desa-light flex items-center justify-center shadow-lg relative overflow-hidden group-hover:bg-[#2B2B2A] transition-colors">
              <Store className="w-6 h-6 text-desa-light relative z-10" />
              
              <div className="absolute inset-0 bg-lurik-stripes-light opacity-30" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading text-2xl font-bold tracking-tight text-desa-primary">
                  Pasar Desa
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-desa-accent/15 text-desa-accent tracking-wider uppercase">
                  Lurik
                </span>
              </div>
              <p className="text-xs text-desa-text/70 font-normal">
                Pusat Belanja & UMKM Warga Desa
              </p>
            </div>
          </motion.div>

          
          <nav className="hidden xl:flex items-center gap-8">
            <button
              onClick={() => handleNavClick('home')}
              className={`font-medium text-sm transition-colors py-1 relative ${
                webPage === 'home'
                  ? 'text-desa-accent font-semibold'
                  : 'text-desa-text hover:text-desa-accent'
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
              className={`font-medium text-sm transition-colors py-1 relative ${
                webPage === 'catalog'
                  ? 'text-desa-accent font-semibold'
                  : 'text-desa-text hover:text-desa-accent'
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
              className={`font-medium text-sm transition-colors py-1 relative ${
                webPage === 'about'
                  ? 'text-desa-accent font-semibold'
                  : 'text-desa-text hover:text-desa-accent'
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
              onClick={() => {
                alert('Pusat Bantuan Desa: Hubungi Balai Desa / WhatsApp Layanan Warga: 0812-3456-7890');
              }}
              className="font-medium text-sm text-desa-text hover:text-desa-accent transition-colors"
            >
              Bantuan
            </button>
          </nav>

          
          <div className="hidden xl:flex items-center gap-2.5">
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-xl border border-desa-primary/20 text-desa-primary hover:bg-white transition-all shadow-xs flex items-center justify-center group"
              title="Keranjang Belanja"
              aria-label="Keranjang Belanja"
            >
              <ShoppingCart className="w-5 h-5 text-desa-primary group-hover:text-desa-accent transition-colors" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-5 h-5 px-1 bg-desa-accent text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-md animate-scale">
                  {cartCount}
                </span>
              )}
            </motion.button>

            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsChatOpen(true)}
              className="relative p-2.5 rounded-xl border border-desa-primary/20 text-desa-primary hover:bg-white transition-all shadow-xs flex items-center justify-center group"
              title="Chat Asisten Desa & Toko"
              aria-label="Chat Desa"
            >
              <MessageSquare className="w-5 h-5 text-desa-primary group-hover:text-desa-accent transition-colors" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-desa-highlight rounded-full" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentView('mobile')}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-desa-highlight text-white hover:bg-desa-highlight/90 shadow-md transition-all"
            >
              <Smartphone className="w-4 h-4" />
              <span>Aplikasi PWA</span>
            </motion.button>

            
            {isLoggedIn ? (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => logout()}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-desa-primary/30 text-desa-primary text-xs font-semibold hover:bg-desa-primary hover:text-desa-light transition-all shadow-xs"
              >
                <User className="w-4 h-4 text-desa-accent" />
                <span>Keluar {currentUser ? currentUser.name.split(' ')[0] : ''}</span>
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  if (isLoggedIn) logout();
                  else handleNavClick('auth');
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-desa-primary text-desa-light text-xs font-semibold hover:bg-desa-primary/90 transition-all shadow-sm"
              >
                <User className="w-4 h-4" />
                <span>Masuk / Daftar</span>
              </motion.button>
            )}
          </div>

          
          <div className="flex xl:hidden items-center gap-2">
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-desa-primary hover:bg-desa-primary/10 rounded-lg transition-colors"
              aria-label="Buka Keranjang"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute 0 top-0.5 right-0.5 min-w-4 h-4 px-1 bg-desa-accent text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-desa-primary hover:bg-desa-primary/10 rounded-lg transition-colors"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      
      <LurikDivider variant="dark" height="2px" />

      
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="xl:hidden bg-desa-bg border-b border-desa-primary/20 px-4 pt-3 pb-6 space-y-3 overflow-hidden"
          >
            <div className="flex flex-col gap-2">
              <button
                onClick={() => handleNavClick('home')}
                className={`text-left px-3 py-2 rounded-xl font-medium text-sm ${
                  webPage === 'home' ? 'bg-desa-primary text-desa-light' : 'text-desa-text hover:bg-black/5'
                }`}
              >
                Beranda
              </button>
              <button
                onClick={() => handleNavClick('catalog')}
                className={`text-left px-3 py-2 rounded-xl font-medium text-sm ${
                  webPage === 'catalog' ? 'bg-desa-primary text-desa-light' : 'text-desa-text hover:bg-black/5'
                }`}
              >
                Katalog Produk
              </button>
              <button
                onClick={() => handleNavClick('about')}
                className={`text-left px-3 py-2 rounded-xl font-medium text-sm ${
                  webPage === 'about' ? 'bg-desa-primary text-desa-light' : 'text-desa-text hover:bg-black/5'
                }`}
              >
                Tentang Desa
              </button>
              <button
                onClick={() => {
                  alert('Pusat Bantuan Desa: 0812-3456-7890');
                  setMobileMenuOpen(false);
                }}
                className="text-left px-3 py-2 rounded-xl font-medium text-sm text-desa-text hover:bg-black/5"
              >
                Bantuan
              </button>
            </div>

            <div className="pt-2 border-t border-desa-primary/20 flex flex-col gap-2">
              <button
                onClick={() => {
                  setCurrentView('mobile');
                  setMobileMenuOpen(false);
                }}
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-semibold bg-desa-highlight text-white"
              >
                <Smartphone className="w-4 h-4" />
                <span>Buka Aplikasi PWA (Mobile)</span>
              </button>
              <button
                onClick={() => handleNavClick('auth')}
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-semibold bg-desa-primary text-desa-light"
              >
                <User className="w-4 h-4" />
                <span>{isLoggedIn ? 'Keluar dari Akun' : 'Masuk / Daftar'}</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
