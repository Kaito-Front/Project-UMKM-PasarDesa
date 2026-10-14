import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import ProductCard from '../../components/common/ProductCard';
import LurikDivider from '../../components/common/LurikDivider';
import { 
  Store, 
  MapPin, 
  Phone, 
  Clock, 
  Star, 
  MessageCircle, 
  Calendar, 
  ShieldCheck, 
  ArrowLeft,
  Share2,
  Navigation,
  ExternalLink
} from 'lucide-react';

export default function ShopDetailPage() {
  const { shops, products, selectedShopId, setWebPage, openChatWithShop } = useApp();

  const shop = shops.find(s => s.id === selectedShopId) || shops[0];
  const shopProducts = products.filter(p => p.shopId === shop.id && !p.isHidden);

  const [activeTab, setActiveTab] = useState('produk'); // 'produk', 'tentang', 'lokasi'

  const handleOpenMap = () => {
    const query = encodeURIComponent(`${shop.name}, ${shop.address}`);
    window.open(`https://maps.google.com/?q=${query}`, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Back button */}
      <button
        onClick={() => setWebPage('catalog')}
        className="inline-flex items-center gap-2 text-xs font-semibold text-desa-primary hover:text-desa-accent transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Kembali ke Katalog</span>
      </button>

      {/* Shop Hero Banner & Profile Header */}
      <div className="bg-white rounded-3xl overflow-hidden border border-desa-primary/20 shadow-md">
        
        {/* Cover / Sampul Toko */}
        <div className="h-48 sm:h-64 lg:h-80 relative overflow-hidden bg-desa-primary/10">
          <img
            src={shop.banner}
            alt={shop.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          
          {/* Traditional Lurik bottom line on cover */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-[repeating-linear-gradient(90deg,#EFEDE6_0px,#EFEDE6_2px,transparent_2px,transparent_8px)] opacity-80" />
        </div>

        {/* Profile Info Overlay Box */}
        <div className="p-6 sm:p-8 pt-0 relative">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 -mt-16 sm:-mt-20">
            
            {/* Avatar & Title */}
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5">
              <img
                src={shop.avatar}
                alt={shop.owner}
                className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl object-cover border-4 border-white shadow-xl bg-white"
              />
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="font-heading text-2xl sm:text-3xl font-bold text-desa-primary">
                    {shop.name}
                  </h1>
                  {shop.verified && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-desa-highlight text-white">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      UMKM Resmi Desa
                    </span>
                  )}
                </div>

                <p className="text-xs text-desa-text/70 flex items-center gap-1 font-medium">
                  <span>Pemilik: <strong>{shop.owner}</strong></span>
                  <span>•</span>
                  <span className="text-desa-accent font-semibold">{shop.category}</span>
                </p>

                <p className="text-xs text-desa-text/60 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-desa-accent shrink-0" />
                  <span>{shop.address}</span>
                </p>
              </div>
            </div>

            {/* Quick Actions (Chat Toko, WhatsApp & Map) */}
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={() => openChatWithShop(shop.id)}
                className="px-5 py-2.5 rounded-xl bg-desa-primary hover:bg-desa-primary/90 text-white font-semibold text-xs shadow-md transition-all flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4 text-desa-accent" />
                <span>Chat Admin Toko</span>
              </button>

              <button
                onClick={handleOpenMap}
                className="px-4 py-2.5 rounded-xl border border-desa-primary/30 text-desa-primary hover:bg-desa-bg font-semibold text-xs transition-all flex items-center gap-1.5"
              >
                <Navigation className="w-4 h-4 text-desa-accent" />
                <span>Peta Google Maps</span>
              </button>
            </div>

          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-desa-primary/10 text-center">
            <div className="p-3 rounded-xl bg-desa-bg/60">
              <span className="text-[11px] text-desa-text/60 block">Rating Toko</span>
              <div className="font-heading font-bold text-lg text-desa-primary flex items-center justify-center gap-1 mt-0.5">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{shop.rating}</span>
                <span className="text-xs font-normal text-desa-text/50">({shop.reviewCount})</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-desa-bg/60">
              <span className="text-[11px] text-desa-text/60 block">Total Produk</span>
              <div className="font-heading font-bold text-lg text-desa-primary mt-0.5">
                {shopProducts.length} Produk
              </div>
            </div>

            <div className="p-3 rounded-xl bg-desa-bg/60">
              <span className="text-[11px] text-desa-text/60 block">Jam Operasional</span>
              <div className="text-xs font-semibold text-desa-primary mt-1 truncate">
                {shop.operatingHours.split('(')[0]}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-desa-bg/60">
              <span className="text-[11px] text-desa-text/60 block">Bergabung Sejak</span>
              <div className="text-xs font-semibold text-desa-primary mt-1">
                {shop.joinDate}
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-desa-primary/20 gap-6 text-sm font-semibold">
        <button
          onClick={() => setActiveTab('produk')}
          className={`pb-3 relative transition-colors ${
            activeTab === 'produk' ? 'text-desa-accent' : 'text-desa-text/60 hover:text-desa-primary'
          }`}
        >
          Daftar Produk ({shopProducts.length})
          {activeTab === 'produk' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-desa-accent rounded-full" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('tentang')}
          className={`pb-3 relative transition-colors ${
            activeTab === 'tentang' ? 'text-desa-accent' : 'text-desa-text/60 hover:text-desa-primary'
          }`}
        >
          Profil & Kisah Usaha
          {activeTab === 'tentang' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-desa-accent rounded-full" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('lokasi')}
          className={`pb-3 relative transition-colors ${
            activeTab === 'lokasi' ? 'text-desa-accent' : 'text-desa-text/60 hover:text-desa-primary'
          }`}
        >
          Lokasi & Kontak Dusun
          {activeTab === 'lokasi' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-desa-accent rounded-full" />
          )}
        </button>
      </div>

      {/* TAB 1: DAFTAR PRODUK */}
      {activeTab === 'produk' && (
        <div className="space-y-6">
          {shopProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {shopProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-12 text-center border border-desa-primary/10">
              <p className="text-sm text-desa-text/60">
                Toko ini belum memiliki produk aktif yang ditampilkan.
              </p>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: TENTANG USAHA */}
      {activeTab === 'tentang' && (
        <div className="bg-white rounded-2xl p-8 border border-desa-primary/15 shadow-sm space-y-6">
          <div>
            <h3 className="font-heading font-bold text-xl text-desa-primary mb-3">
              Kisah & Komitmen {shop.name}
            </h3>
            <p className="text-sm text-desa-text/80 leading-relaxed font-light">
              {shop.description}
            </p>
          </div>

          <div className="pt-4 border-t border-desa-primary/10 grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
            <div>
              <span className="font-bold text-desa-primary block mb-1">Kategori Usaha:</span>
              <p className="text-desa-text/70">{shop.category}</p>
            </div>
            <div>
              <span className="font-bold text-desa-primary block mb-1">Pengrajin / Penanggung Jawab:</span>
              <p className="text-desa-text/70">{shop.owner}</p>
            </div>
            <div>
              <span className="font-bold text-desa-primary block mb-1">Status Verifikasi BUMDes:</span>
              <p className="text-desa-highlight font-semibold">Telah lulus kurasi mutu & standar keaslian produk desa</p>
            </div>
            <div>
              <span className="font-bold text-desa-primary block mb-1">Nomor Telepon / WhatsApp:</span>
              <p className="text-desa-text/70">{shop.phone}</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: LOKASI & PETA EMBED MOCK */}
      {activeTab === 'lokasi' && (
        <div className="bg-white rounded-2xl p-8 border border-desa-primary/15 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-heading font-bold text-xl text-desa-primary">
                Peta Lokasi Toko di Dusun
              </h3>
              <p className="text-xs text-desa-text/60 mt-0.5">
                {shop.address}
              </p>
            </div>
            <button
              onClick={handleOpenMap}
              className="px-4 py-2 rounded-xl bg-desa-primary text-desa-light text-xs font-semibold hover:bg-desa-primary/90 transition-all flex items-center gap-1.5 self-start sm:self-auto"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Buka di Google Maps</span>
            </button>
          </div>

          {/* Interactive Map Mockup Representation */}
          <div className="relative h-72 sm:h-96 rounded-2xl overflow-hidden bg-desa-bg border border-desa-primary/20 flex items-center justify-center">
            {/* Map styling grid mock */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#3A3A38_1px,transparent_1px)] [background-size:16px_16px]" />
            
            {/* Road lines simulation */}
            <div className="absolute w-full h-8 bg-desa-primary/15 top-1/2 -translate-y-1/2 rotate-6" />
            <div className="absolute h-full w-8 bg-desa-primary/15 left-1/3 rotate-12" />

            {/* Pin Center */}
            <div className="relative z-10 flex flex-col items-center animate-bounce">
              <div className="p-3 rounded-full bg-desa-accent text-white shadow-xl">
                <Store className="w-6 h-6" />
              </div>
              <div className="bg-white px-3 py-1.5 rounded-lg shadow-lg border border-desa-primary/20 text-xs font-bold text-desa-primary mt-2 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-desa-accent" />
                <span>{shop.name}</span>
              </div>
            </div>

            <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg text-[10px] text-desa-text/70 border border-desa-primary/10">
              Peta Sentra UMKM Dusun Terintegrasi
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

