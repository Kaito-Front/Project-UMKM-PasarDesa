import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import ProductCard from '../../components/common/ProductCard';
import { KECAMATAN_LOCATIONS } from '../../data/mockData';
import { 
  MapPin, 
  Star, 
  MessageSquare, 
  ShieldCheck, 
  ArrowLeft,
  Navigation,
  ExternalLink
} from 'lucide-react';

export default function ShopDetailPage() {
  const { shops, products, selectedShopId, setWebPage, openChatWithShop } = useApp();

  const shop = shops.find(s => s.id === selectedShopId) || shops[0];
  const shopProducts = products.filter(p => p.shopId === shop.id && !p.isHidden);
  const fallbackLocation = KECAMATAN_LOCATIONS[shop.kecamatan] || KECAMATAN_LOCATIONS['Kecamatan Sumedang Utara'];
  const shopLat = shop.lat ?? fallbackLocation.lat;
  const shopLng = shop.lng ?? fallbackLocation.lng;

  const [activeTab, setActiveTab] = useState('produk');
  const handleOpenMap = () => {
    window.open(`https://www.google.com/maps?q=${shopLat},${shopLng}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Back button */}
      <motion.button
        whileHover={{ x: -2 }}
        whileTap={{ scale: 0.96 }}
        onClick={() => setWebPage('catalog')}
        className="inline-flex items-center gap-2 text-xs font-semibold text-desa-muted hover:text-desa-accent transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Kembali ke Katalog</span>
      </motion.button>

      {/* Shop Profile Header Banner */}
      <div className="bg-white rounded-2xl overflow-hidden border border-desa-border shadow-xs">
        
        {/* Banner */}
        <div className="h-44 sm:h-56 lg:h-64 relative overflow-hidden bg-desa-bg">
          <img
            src={shop.banner}
            alt={shop.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        </div>

        {/* Profile Card Body */}
        <div className="p-5 sm:p-7 pt-0 relative">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 -mt-12 sm:-mt-14">
            
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
              <img
                src={shop.avatar}
                alt={shop.owner}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl object-cover border-4 border-white shadow-md bg-white shrink-0"
              />
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="font-heading text-2xl sm:text-3xl font-bold text-desa-primary">
                    {shop.name}
                  </h1>
                  {shop.verified && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded bg-desa-highlight text-white shadow-2xs">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      UMKM Resmi BUMDes
                    </span>
                  )}
                </div>

                <p className="text-xs text-desa-muted flex items-center gap-1 font-medium">
                  <span>Pengrajin: <strong className="text-desa-primary">{shop.owner}</strong></span>
                  <span className="text-desa-border">•</span>
                  <span className="text-desa-accent font-semibold">{shop.category}</span>
                </p>

                <p className="text-xs text-desa-muted flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-desa-accent shrink-0" />
                  <span>{shop.address}</span>
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => openChatWithShop(shop.id)}
                className="px-4 py-2 rounded-lg bg-desa-primary hover:bg-desa-primary/90 text-white font-semibold text-xs shadow-xs transition-colors flex items-center gap-2"
              >
                <MessageSquare className="w-3.5 h-3.5 text-desa-accent" />
                <span>Chat Admin Toko</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                onClick={handleOpenMap}
                className="px-3.5 py-2 rounded-lg border border-desa-border text-desa-primary hover:bg-desa-bg font-semibold text-xs transition-colors flex items-center gap-1.5"
              >
                <Navigation className="w-3.5 h-3.5 text-desa-muted" />
                <span>Buka Peta</span>
              </motion.button>
            </div>

          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-desa-border text-center">
            <div className="p-3 rounded-lg bg-desa-surface border border-desa-border/50">
              <span className="text-[11px] text-desa-muted block">Rating Toko</span>
              <div className="font-heading font-bold text-base text-desa-primary flex items-center justify-center gap-1 mt-0.5">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{shop.rating}</span>
                <span className="text-xs font-normal text-desa-muted">({shop.reviewCount})</span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-desa-surface border border-desa-border/50">
              <span className="text-[11px] text-desa-muted block">Total Produk</span>
              <div className="font-heading font-bold text-base text-desa-primary mt-0.5">
                {shopProducts.length} Produk
              </div>
            </div>

            <div className="p-3 rounded-lg bg-desa-surface border border-desa-border/50">
              <span className="text-[11px] text-desa-muted block">Jam Pelayanan</span>
              <div className="text-xs font-semibold text-desa-primary mt-1 truncate">
                {shop.operatingHours.split('(')[0]}
              </div>
            </div>

            <div className="p-3 rounded-lg bg-desa-surface border border-desa-border/50">
              <span className="text-[11px] text-desa-muted block">Bergabung Sejak</span>
              <div className="text-xs font-semibold text-desa-primary mt-1">
                {shop.joinDate}
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Tabs with layoutId underline indicator */}
      <div className="flex border-b border-desa-border gap-6 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('produk')}
          className={`pb-3 relative transition-colors ${
            activeTab === 'produk' ? 'text-desa-accent font-bold' : 'text-desa-muted hover:text-desa-primary'
          }`}
        >
          Daftar Produk ({shopProducts.length})
          {activeTab === 'produk' && (
            <motion.span 
              layoutId="shopActiveTabIndicator"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-desa-accent rounded-full"
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          )}
        </button>

        <button
          onClick={() => setActiveTab('tentang')}
          className={`pb-3 relative transition-colors ${
            activeTab === 'tentang' ? 'text-desa-accent font-bold' : 'text-desa-muted hover:text-desa-primary'
          }`}
        >
          Profil & Kisah Usaha
          {activeTab === 'tentang' && (
            <motion.span 
              layoutId="shopActiveTabIndicator"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-desa-accent rounded-full"
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          )}
        </button>

        <button
          onClick={() => setActiveTab('lokasi')}
          className={`pb-3 relative transition-colors ${
            activeTab === 'lokasi' ? 'text-desa-accent font-bold' : 'text-desa-muted hover:text-desa-primary'
          }`}
        >
          Peta & Lokasi Sentra
          {activeTab === 'lokasi' && (
            <motion.span 
              layoutId="shopActiveTabIndicator"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-desa-accent rounded-full"
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          )}
        </button>
      </div>

      {/* Tab Content with AnimatePresence */}
      <AnimatePresence mode="wait">
        {activeTab === 'produk' && (
          <motion.div
            key="tab-produk"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {shopProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {shopProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl p-12 text-center border border-desa-border">
                <p className="text-xs text-desa-muted">
                  Belum ada produk aktif yang ditampilkan untuk toko ini.
                </p>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'tentang' && (
          <motion.div
            key="tab-tentang"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-xl p-6 sm:p-8 border border-desa-border shadow-xs space-y-6"
          >
            <div>
              <h3 className="font-heading font-bold text-lg text-desa-primary mb-2">
                Kisah & Komitmen {shop.name}
              </h3>
              <p className="text-sm text-desa-muted leading-relaxed font-normal">
                {shop.description}
              </p>
            </div>

            <div className="pt-4 border-t border-desa-border grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="font-bold text-desa-primary block mb-1">Kategori Sentra:</span>
                <p className="text-desa-muted">{shop.category}</p>
              </div>
              <div>
                <span className="font-bold text-desa-primary block mb-1">Pengrajin / Penanggung Jawab:</span>
                <p className="text-desa-muted">{shop.owner}</p>
              </div>
              <div>
                <span className="font-bold text-desa-primary block mb-1">Status Legalitas BUMDes:</span>
                <p className="text-desa-highlight font-semibold">Telah lulus verifikasi mutu & standar otentik desa</p>
              </div>
              <div>
                <span className="font-bold text-desa-primary block mb-1">Kontak WhatsApp:</span>
                <p className="text-desa-muted">{shop.phone}</p>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'lokasi' && (
          <motion.div
            key="tab-lokasi"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-xl p-6 sm:p-8 border border-desa-border shadow-xs space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-heading font-bold text-lg text-desa-primary">
                  Lokasi Sentra Produksi
                </h3>
                <p className="text-xs text-desa-muted mt-0.5">
                  {shop.address}
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                onClick={handleOpenMap}
                className="px-3.5 py-2 rounded-lg bg-desa-primary text-white text-xs font-semibold hover:bg-desa-primary/90 transition-colors flex items-center gap-1.5 self-start sm:self-auto"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Buka di Google Maps</span>
              </motion.button>
            </div>

            <div className="relative h-72 overflow-hidden rounded-xl border border-desa-border bg-desa-bg sm:h-96">
              <iframe
                title={`Peta ${shop.name} di ${shop.kecamatan}`}
                src={`https://maps.google.com/maps?q=${shopLat},${shopLng}&hl=id&z=15&output=embed`}
                className="h-full w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
