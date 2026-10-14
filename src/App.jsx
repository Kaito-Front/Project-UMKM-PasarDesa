import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import CartDrawer from './components/common/CartDrawer';
import CheckoutModal from './components/common/CheckoutModal';
import AddressModal from './components/common/AddressModal';
import ChatWidget from './components/common/ChatWidget';

// Web Pages
import HomePage from './pages/web/HomePage';
import CatalogPage from './pages/web/CatalogPage';
import ProductDetailPage from './pages/web/ProductDetailPage';
import ShopDetailPage from './pages/web/ShopDetailPage';
import AuthPage from './pages/web/AuthPage';
import AboutVillagePage from './pages/web/AboutVillagePage';

// Mobile PWA App
import MobileAppView from './pages/mobile/MobileAppView';

// Admin Pengelola Desa
import AdminLayout from './pages/admin/AdminLayout';

function MainApp() {
  const { currentView, webPage } = useApp();

  return (
    <div className="min-h-screen bg-desa-bg text-desa-text font-sans flex flex-col justify-between selection:bg-desa-accent selection:text-white">
      {/* Top Navbar: Hanya tampil jika BUKAN mode admin */}
      {currentView !== 'admin' && <Navbar />}

      <main className="flex-1">
        {/* VIEW 1: WEBSITE PUBLIK */}
        {currentView === 'web' && (
          <>
            {webPage === 'home' && <HomePage />}
            {webPage === 'catalog' && <CatalogPage />}
            {webPage === 'product-detail' && <ProductDetailPage />}
            {webPage === 'shop-detail' && <ShopDetailPage />}
            {webPage === 'auth' && <AuthPage />}
            {webPage === 'about' && <AboutVillagePage />}
          </>
        )}

        {/* VIEW 2: APLIKASI MOBILE PWA */}
        {currentView === 'mobile' && <MobileAppView />}

        {/* VIEW 3: WEBSITE ADMIN DESA (Stand-alone dashboard tanpa navbar publik) */}
        {currentView === 'admin' && <AdminLayout />}
      </main>

      {/* Footer hanya tampil untuk web publik */}
      {currentView === 'web' && <Footer />}

      {/* Global Modals & Widgets untuk Keranjang, Checkout, Alamat Google Maps, dan Chatbox */}
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
      <MainApp />
    </AppProvider>
  );
}
