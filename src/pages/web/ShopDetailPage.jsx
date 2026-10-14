import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import ProductCard from '../../components/common/ProductCard';
import LurikDivider from '../../components/common/LurikDivider';
import { KECAMATAN_LOCATIONS } from '../../data/mockData';
import { 
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
  const fallbackLocation = KECAMATAN_LOCATIONS[shop.kecamatan] || KECAMATAN_LOCATIONS['Kecamatan Sumedang Utara'];
  const shopLat = shop.lat ?? fallbackLocation.lat;
  const shopLng = shop.lng ?? fallbackLocation.lng;

  const [activeTab, setActiveTab] = useState('produk');
  const handleOpenMap = () => {
    window.open(`https://www.google.com/maps?q=${shopLat},${shopLng}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      
      <button
        onClick={() => setWebPage('catalog')}
        className="inline-flex items-center gap-2 text-xs font-semibold text-desa-primary hover:text-desa-accent transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Kembali ke Katalog</span>
      </button>

      
      <div className="bg-white rounded-3xl overflow-hidden border border-desa-primary/20 shadow-md">
        
        
        <div className="h-48 sm:h-64 lg:h-80 relative overflow-hidden bg-desa-primary/10">
          <img
            src={shop.banner}
            alt={shop.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          
          
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-[repeating-linear-gradient(90deg,#EFEDE6_0px,#EFEDE6_2px,transparent_2px,transparent_8px)] opacity-80" />
        </div>

        
        <div className="p-6 sm:p-8 pt-0 relative">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 -mt-16 sm:-mt-20">
            
            
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
          Lokasi & Kontak Kecamatan
          {activeTab === 'lokasi' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-desa-accent rounded-full" />
          )}
        </button>
      </div>

      
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

      
      {activeTab === 'lokasi' && (
        <div className="bg-white rounded-2xl p-8 border border-desa-primary/15 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-heading font-bold text-xl text-desa-primary">
                Peta lokasi toko di kecamatan
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

          
          <div className="relative h-72 overflow-hidden rounded-2xl border border-desa-primary/20 bg-desa-bg sm:h-96">
            <iframe
              title={`Peta ${shop.name} di ${shop.kecamatan}`}
              src={`https://maps.google.com/maps?q=${shopLat},${shopLng}&hl=id&z=15&output=embed`}
              className="h-full w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      )}

    </div>
  );
}

