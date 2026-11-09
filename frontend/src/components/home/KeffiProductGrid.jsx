import React from 'react';
import { motion } from 'framer-motion';
import { Star, ShoppingBag, Eye, ArrowUpRight, Sparkles, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function KeffiProductGrid() {
  const { products, viewProduct, viewShop, openDirectCheckout, setWebPage } = useApp();

  // Curate products to feature in the Keffi-style multi-card grid
  const curatedProducts = products && products.length > 0 ? products.slice(0, 8) : [];

  // Card themes mapped to follow the 60% Sage Mist, 30% Deep Forest, 10% Sunbeam Yellow palette
  const cardThemes = [
    { type: 'dark', bg: 'bg-desa-primary text-white border-desa-primary/80', badgeBg: 'bg-desa-accent text-desa-primary' },
    { type: 'light', bg: 'bg-white text-desa-primary border-desa-border shadow-xs', badgeBg: 'bg-desa-surface text-desa-primary' },
    { type: 'light', bg: 'bg-[#F4F6F2] text-desa-primary border-desa-border/70 shadow-xs', badgeBg: 'bg-desa-primary text-white' },
    { type: 'accent', bg: 'bg-desa-accent text-desa-primary border-desa-accent shadow-sm', badgeBg: 'bg-desa-primary text-white', isSpecial: true },
    { type: 'light', bg: 'bg-white text-desa-primary border-desa-border shadow-xs', badgeBg: 'bg-desa-surface text-desa-primary' },
    { type: 'dark', bg: 'bg-[#15231a] text-white border-desa-primary/60', badgeBg: 'bg-desa-accent text-desa-primary' },
    { type: 'light', bg: 'bg-[#F4F6F2] text-desa-primary border-desa-border/70 shadow-xs', badgeBg: 'bg-desa-primary text-white' },
    { type: 'light', bg: 'bg-white text-desa-primary border-desa-border shadow-xs', badgeBg: 'bg-desa-surface text-desa-primary' },
  ];

  const getInitials = (name) => {
    if (!name) return 'PD';
    const parts = name.split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <section className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* 1. Keffi Signature Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-desa-border/60">
        <div className="space-y-1">
          <p className="text-2xl sm:text-3xl lg:text-4xl font-light text-desa-muted tracking-tight">
            Terkurasi dari
          </p>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-heading text-desa-primary tracking-tight">
            40+ Pengrajin Desa
          </h2>
        </div>

        {/* 4.9 Rating Badge (Matching Keffi Top-Right Indicator) */}
        <div className="flex items-center gap-4 bg-white/80 backdrop-blur-xs px-5 py-3 rounded-2xl border border-desa-border/80 shadow-2xs self-start md:self-auto">
          <span className="font-heading text-4xl sm:text-5xl font-black text-desa-primary tracking-tight leading-none">
            4.9
          </span>
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-0.5 text-desa-accent">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-desa-accent text-desa-accent" />
              ))}
            </div>
            <span className="text-xs text-desa-muted font-medium mt-0.5">
              Nilai kepuasan dari 2.400+ pembeli
            </span>
          </div>
        </div>
      </div>

      {/* 2. Multi-Card Aesthetic Grid (Keffi Layout with Real Products) */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {curatedProducts.map((product, idx) => {
          const theme = cardThemes[idx % cardThemes.length];
          const isDark = theme.type === 'dark';
          const isAccent = theme.type === 'accent';

          return (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: (idx % 4) * 0.08 }}
              className={`rounded-3xl p-5 sm:p-6 flex flex-col justify-between border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg relative group ${theme.bg}`}
            >
              {/* Highlight Tag for Special Accent Card */}
              {isAccent && (
                <div className="absolute -top-3 right-5 px-3 py-0.5 rounded-full bg-desa-primary text-white text-[10px] font-bold tracking-wider uppercase flex items-center gap-1 shadow-xs">
                  <Sparkles className="w-3 h-3 text-desa-accent" />
                  <span>Pilihan Kurator</span>
                </div>
              )}

              {/* Card Top: 5 Stars + Category Chip */}
              <div className="flex items-center justify-between gap-2 mb-4">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-3.5 h-3.5 ${
                        isDark 
                          ? 'fill-desa-accent text-desa-accent' 
                          : isAccent 
                          ? 'fill-desa-primary text-desa-primary' 
                          : 'fill-desa-accent text-desa-accent'
                      }`} 
                    />
                  ))}
                  <span className={`text-[11px] font-bold ml-1.5 ${isDark ? 'text-desa-border' : 'text-desa-primary'}`}>
                    {product.rating || '4.9'}
                  </span>
                </div>

                <span 
                  className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${
                    isDark 
                      ? 'bg-white/10 text-desa-border' 
                      : isAccent 
                      ? 'bg-desa-primary/10 text-desa-primary' 
                      : 'bg-desa-surface text-desa-muted border border-desa-border/60'
                  }`}
                >
                  {product.categoryName || 'Produk Desa'}
                </span>
              </div>

              {/* Card Middle: Product Name & Authentic Quote Description */}
              <div className="space-y-2 mb-6 flex-1">
                <h3 
                  onClick={() => viewProduct(product.id)}
                  className={`font-heading font-bold text-base sm:text-lg leading-snug cursor-pointer transition-colors line-clamp-2 ${
                    isDark 
                      ? 'hover:text-desa-accent' 
                      : isAccent 
                      ? 'text-desa-primary hover:opacity-80' 
                      : 'hover:text-desa-muted'
                  }`}
                >
                  “{product.name}”
                </h3>
                
                <p 
                  className={`text-xs leading-relaxed line-clamp-3 ${
                    isDark 
                      ? 'text-desa-border/80' 
                      : isAccent 
                      ? 'text-desa-primary/80 font-medium' 
                      : 'text-desa-muted'
                  }`}
                >
                  {product.description}
                </p>
              </div>

              {/* Card Bottom: Artisan Badge, Price Tag & Quick Action Buttons */}
              <div className={`pt-4 border-t space-y-3 ${
                isDark 
                  ? 'border-white/10' 
                  : isAccent 
                  ? 'border-desa-primary/15' 
                  : 'border-desa-border/60'
              }`}>
                {/* Artisan Profile Row */}
                <div className="flex items-center justify-between gap-2">
                  <div 
                    onClick={() => viewShop(product.shopId)}
                    className="flex items-center gap-2 cursor-pointer group/shop min-w-0"
                  >
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 shadow-2xs ${theme.badgeBg}`}>
                      {getInitials(product.shopName)}
                    </div>
                    <div className="min-w-0">
                      <p className={`text-xs font-semibold truncate ${
                        isDark ? 'text-white' : 'text-desa-primary'
                      }`}>
                        {product.shopName}
                      </p>
                      <p className={`text-[10px] truncate ${
                        isDark ? 'text-desa-border/70' : isAccent ? 'text-desa-primary/70' : 'text-desa-subtle'
                      }`}>
                        {product.kecamatan ? product.kecamatan.replace('Kecamatan ', '') : 'Sumedang'}
                      </p>
                    </div>
                  </div>

                  {/* Price Tag */}
                  <div className="text-right shrink-0">
                    <span className={`text-[10px] block uppercase font-mono ${
                      isDark ? 'text-desa-border/60' : isAccent ? 'text-desa-primary/60' : 'text-desa-subtle'
                    }`}>
                      Harga
                    </span>
                    <span className={`font-heading font-bold text-xs sm:text-sm ${
                      isDark ? 'text-desa-accent' : 'text-desa-primary'
                    }`}>
                      Rp {Number(product.price || 0).toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>

                {/* Quick Action Button Row */}
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => openDirectCheckout(product, 1)}
                    className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-2xs ${
                      isDark
                        ? 'bg-desa-accent hover:bg-desa-highlight text-desa-primary'
                        : isAccent
                        ? 'bg-desa-primary hover:bg-desa-primary/90 text-white'
                        : 'bg-desa-primary hover:bg-desa-primary/90 text-white'
                    }`}
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Beli</span>
                  </button>

                  <button
                    onClick={() => {
                      viewProduct(product.id);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`p-2 rounded-xl border transition-colors flex items-center justify-center ${
                      isDark
                        ? 'border-white/20 text-white hover:bg-white/10'
                        : isAccent
                        ? 'border-desa-primary/30 text-desa-primary hover:bg-desa-primary/10'
                        : 'border-desa-border text-desa-primary hover:bg-desa-surface'
                    }`}
                    title="Lihat Detail Produk"
                    aria-label={`Detail ${product.name}`}
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </motion.div>
          );
        })}
      </div>

      {/* View All Curated Products Link */}
      <div className="mt-8 text-center">
        <button
          onClick={() => {
            setWebPage('catalog');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white hover:bg-desa-primary hover:text-white text-xs font-bold text-desa-primary border border-desa-border shadow-xs transition-all group"
        >
          <span>Eksplorasi Semua 48+ Produk UMKM Desa</span>
          <ArrowUpRight className="w-4 h-4 text-desa-accent transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </button>
      </div>
    </section>
  );
}
