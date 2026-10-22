import React from 'react';
import { motion, AnimatePresence, MotionConfig } from 'framer-motion';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import CartDrawer from './components/common/CartDrawer';
import CheckoutModal from './components/common/CheckoutModal';
import AddressModal from './components/common/AddressModal';
import ChatWidget from './components/common/ChatWidget';
import HomePage from './pages/web/HomePage';
import CatalogPage from './pages/web/CatalogPage';
import ProductDetailPage from './pages/web/ProductDetailPage';
import ShopDetailPage from './pages/web/ShopDetailPage';
import AuthPage from './pages/web/AuthPage';
import AboutVillagePage from './pages/web/AboutVillagePage';
import MobileAppView from './pages/mobile/MobileAppView';
import AdminLayout from './pages/admin/AdminLayout';

function MainApp() {
  const { currentView, webPage, dataSource } = useApp();

  return (
    <div className="min-h-screen bg-desa-bg text-desa-text font-sans flex flex-col justify-between selection:bg-desa-accent selection:text-white">
      
      {currentView === 'web' && <Navbar />}

      {dataSource === 'demo' && currentView !== 'admin' && (
        <motion.div 
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          role="status" 
          className="border-b border-desa-border bg-white px-4 py-2 text-center text-xs text-desa-muted"
        >
          Mode pratinjau: produk, ulasan, dan angka yang tampil adalah data kurasi desa.
        </motion.div>
      )}

      <main className="flex-1">
        {currentView === 'web' && (
          <AnimatePresence mode="wait">
            <motion.div
              key={webPage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
            >
              {webPage === 'home' && <HomePage />}
              {webPage === 'catalog' && <CatalogPage />}
              {webPage === 'product-detail' && <ProductDetailPage />}
              {webPage === 'shop-detail' && <ShopDetailPage />}
              {webPage === 'auth' && <AuthPage />}
              {webPage === 'about' && <AboutVillagePage />}
            </motion.div>
          </AnimatePresence>
        )}

        {currentView === 'mobile' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <MobileAppView />
          </motion.div>
        )}

        {currentView === 'admin' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25 }}
          >
            <AdminLayout />
          </motion.div>
        )}
      </main>

      {currentView === 'web' && <Footer />}

      <CartDrawer />
      <CheckoutModal />
      <AddressModal />
      {currentView === 'web' && <ChatWidget />}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MotionConfig reducedMotion="user">
        <MainApp />
      </MotionConfig>
    </AppProvider>
  );
}
