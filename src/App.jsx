import React from 'react';
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
  const { currentView, webPage } = useApp();

  return (
    <div className="min-h-screen bg-desa-bg text-desa-text font-sans flex flex-col justify-between selection:bg-desa-accent selection:text-white">
      
      {currentView !== 'admin' && <Navbar />}

      <main className="flex-1">
        
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

        
        {currentView === 'mobile' && <MobileAppView />}

        
        {currentView === 'admin' && <AdminLayout />}
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
      <MainApp />
    </AppProvider>
  );
}
