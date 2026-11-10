import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import ProductCard from '../../components/common/ProductCard';
import Product3DTilt from '../../components/common/Product3DTilt';
import LurikCloth3D from '../../components/common/LurikCloth3D';
import Chips3D from '../../components/common/Chips3D';
import Honey3D from '../../components/common/Honey3D';
import Besek3D from '../../components/common/Besek3D';
import MarketIntroPortal from '../../components/common/MarketIntroPortal';
import KeffiProductGrid from '../../components/home/KeffiProductGrid';
import { 
  Search, 
  ArrowRight, 
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Smartphone,
  TrendingUp,
  Users,
  Package,
  Award,
  Sparkles,
  ShoppingBag,
  Eye
} from 'lucide-react';

function Counter({ value, suffix = '' }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1400;
    const stepTime = 20;
    const steps = duration / stepTime;
    const increment = value / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [value]);

  return <span>{count.toLocaleString('id-ID')}{suffix}</span>;
}

export default function HomePage() {
  const { 
    products, 
    categories, 
    shops, 
    stats, 
    setWebPage, 
    setSelectedCategory, 
    setSearchQuery,
    viewShop,
    viewProduct,
    setCurrentView,
    openDirectCheckout,
    hasSeenIntro,
    setHasSeenIntro,
    openAuth
  } = useApp();

  // Show intro only on fresh load/refresh; do not show when clicking "Beranda" or navigating in-app
  const [showIntro, setShowIntro] = useState(!hasSeenIntro);

  const handleIntroComplete = () => {
    setHasSeenIntro(true);
    setShowIntro(false);
  };

  const [heroSearch, setHeroSearch] = useState('');
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [activeHeroIndex, setActiveHeroIndex] = useState(0);

  const featuredProducts = products.filter(p => p.isFeatured || p.isPopular);
  const heroShowcaseList = featuredProducts.slice(0, 4);
  const activeHeroProduct = heroShowcaseList[activeHeroIndex] || products[0];
  const newUmkmShops = shops.slice(0, 4);

  // Auto rotate hero showcase smoothly every 8 seconds
  useEffect(() => {
    if (heroShowcaseList.length <= 1) return;
    const interval = setInterval(() => {
      setActiveHeroIndex((prev) => (prev + 1) % heroShowcaseList.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [heroShowcaseList.length]);

  const handleHeroSearchSubmit = (e) => {
    e.preventDefault();
    if (!heroSearch.trim()) return;
    setSearchQuery(heroSearch);
    setWebPage('catalog');
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  };

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    setWebPage('catalog');
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  };

  const scrollToContent = () => {
    const el = document.getElementById('pasar-content');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const nextCarousel = () => {
    setCarouselIndex((prev) => (prev + 1) % Math.max(1, featuredProducts.length - 3));
  };

  const prevCarousel = () => {
    setCarouselIndex((prev) => (prev - 1 + Math.max(1, featuredProducts.length - 3)) % Math.max(1, featuredProducts.length - 3));
  };

  return (
    <>
      {/* 0. INTRO PORTAL: Gerbang Pasar Desa (Sebelum Masuk Web) */}
      {showIntro && (
        <MarketIntroPortal onComplete={handleIntroComplete} />
      )}

      {/* Whole Landing Page Smooth Fade-in from Bottom */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="overflow-hidden pb-16 relative"
      >
        {/* Subtle Ambient Liquid Glass Lighting Mesh across Landing Page */}
        <div className="fixed inset-0 pointer-events-none -z-20 overflow-hidden">
          <div className="absolute top-[20%] left-[-10%] w-[45rem] h-[45rem] rounded-full bg-gradient-to-br from-amber-200/25 via-emerald-100/15 to-transparent blur-[140px]" />
          <div className="absolute top-[60%] right-[-10%] w-[50rem] h-[50rem] rounded-full bg-gradient-to-tl from-[#163324]/8 via-[#E83D23]/6 to-transparent blur-[150px]" />
        </div>
        
        {/* =========================================================================
            FASE 1: PRE-SCROLL FULLSCREEN 100vh SHOWCASE (EDGE-TO-EDGE LIQUID GLASS)
            True edge-to-edge fullscreen hero stage, distinct from the marketplace page below
           ========================================================================= */}
        <section className="relative w-full min-h-[100dvh] lg:h-[100dvh] flex flex-col justify-between overflow-hidden bg-gradient-to-b from-[#FBF8F3] via-white/50 to-[#F4EFE6]/90 border-b border-[#E8E0D5]">
          
          {/* Full-Bleed Multi-tier Ambient Liquid Light Beams */}
          <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[42rem] h-[42rem] bg-gradient-to-br from-amber-200/35 via-emerald-100/25 to-transparent rounded-full blur-[130px] pointer-events-none -z-10" />
          <div className="absolute bottom-1/4 right-1/4 translate-x-1/3 translate-y-1/3 w-[45rem] h-[45rem] bg-gradient-to-tl from-[#163324]/12 via-[#E83D23]/8 to-transparent rounded-full blur-[140px] pointer-events-none -z-10" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4/5 h-4/5 bg-radial from-white/75 via-[#FBF8F3]/35 to-transparent rounded-full blur-[95px] pointer-events-none -z-10" />

          {/* Full-Width Specular Rim Light */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent pointer-events-none" />

          {/* Constrained Inner Content Area for Clean Layout & Alignment */}
          <div className="max-w-screen-2xl mx-auto w-full h-full flex flex-col justify-between px-4 sm:px-8 lg:px-12 pt-3 pb-4 sm:pt-4 sm:pb-6 lg:py-6 flex-1 relative z-10">
            
            {/* Top Stage Header (Subtle & Quiet) */}
            <div className="flex items-center justify-between pb-2.5 sm:pb-3 border-b border-[#E8E0D5]/70 text-xs text-desa-muted relative z-10">
              <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-wider text-desa-accent font-black">
                0{activeHeroIndex + 1} / 0{heroShowcaseList.length}
              </span>
              <span className="text-[10px] sm:text-[11px] text-[#163324] font-bold truncate ml-2">
                Katalog Unggulan Pengrajin Sumedang
              </span>
            </div>

            {/* Middle Grid: Left Rail on desktop / stacked on mobile, Center 3D Tactile Product, Right Title & CTA */}
            <div className="relative z-10 py-2 sm:py-4 lg:py-6 grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 items-center flex-1 my-auto">
              
              {/* 1. LEFT RAIL (DESKTOP ONLY): Vertical Slider 01-04 (Liquid Glass Capsule) */}
              <div className="hidden lg:flex lg:col-span-2 flex-col justify-start items-start gap-3 order-1">
                <div className="flex flex-col items-center gap-2 p-1.5 rounded-full bg-white/50 backdrop-blur-2xl border border-white/90 shadow-[0_4px_20px_rgba(0,0,0,0.04),inset_0_1px_1px_rgba(255,255,255,0.9)]">
                  {heroShowcaseList.map((item, idx) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveHeroIndex(idx)}
                      className={`relative transition-all duration-300 rounded-full flex items-center justify-center ${
                        activeHeroIndex === idx 
                          ? 'w-7 h-9 bg-desa-primary text-white shadow-xs' 
                          : 'w-7 h-7 text-desa-muted hover:text-desa-primary hover:bg-black/5'
                      }`}
                      title={item.name}
                      aria-label={`Pilih produk ${item.name}`}
                    >
                      <span className="text-[11px] font-bold">0{idx + 1}</span>
                      {activeHeroIndex === idx && (
                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-desa-accent rounded-full ring-2 ring-white" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. CENTERPIECE: 4 Dynamic Three.js 3D Models with Adaptive Mobile Sizing */}
              <div className="lg:col-span-6 relative flex flex-col items-center justify-center order-1 lg:order-2">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeHeroProduct.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4 }}
                    className="w-full flex items-center justify-center"
                  >
                    {activeHeroProduct.id === 'prod-1' && (
                      <LurikCloth3D onInteract={() => {}} />
                    )}
                    {activeHeroProduct.id === 'prod-2' && (
                      <Chips3D onInteract={() => {}} />
                    )}
                    {activeHeroProduct.id === 'prod-3' && (
                      <Honey3D onInteract={() => {}} />
                    )}
                    {activeHeroProduct.id === 'prod-4' && (
                      <Besek3D onInteract={() => {}} />
                    )}
                    {!['prod-1', 'prod-2', 'prod-3', 'prod-4'].includes(activeHeroProduct.id) && (
                      <Product3DTilt 
                        product={activeHeroProduct}
                        onClick={() => viewProduct(activeHeroProduct.id)}
                      />
                    )}
                  </motion.div>
                </AnimatePresence>

                {/* MOBILE-ONLY HORIZONTAL SLIDER PILL (Centered below 3D model) */}
                <div className="flex lg:hidden items-center justify-center mt-2 select-none">
                  <div className="flex items-center gap-1.5 p-1 rounded-full bg-white/75 backdrop-blur-xl border border-white/90 shadow-xs">
                    {heroShowcaseList.map((item, idx) => (
                      <button
                        key={`m-hero-${item.id}`}
                        onClick={() => setActiveHeroIndex(idx)}
                        className={`relative transition-all duration-300 rounded-full flex items-center justify-center text-xs font-bold ${
                          activeHeroIndex === idx 
                            ? 'px-3 py-1 bg-desa-primary text-white shadow-xs' 
                            : 'px-2.5 py-1 text-desa-muted hover:text-desa-primary'
                        }`}
                        title={item.name}
                        aria-label={`Pilih produk ${item.name}`}
                      >
                        <span>0{idx + 1}</span>
                        {activeHeroIndex === idx && (
                          <span className="w-1.5 h-1.5 ml-1 bg-desa-accent rounded-full" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 3. RIGHT COLUMN: Apple Minimal - Strong Type, Clean Mobile/Desktop Actions */}
              <div className="lg:col-span-4 flex flex-col justify-between h-full space-y-4 sm:space-y-6 order-2 lg:order-3 text-center lg:text-left">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`title-${activeHeroProduct.id}`}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-1.5 sm:space-y-2.5"
                  >
                    <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-desa-muted block">
                      {activeHeroProduct.categoryName} • {activeHeroProduct.shopName}
                    </span>

                    <h1 
                      onClick={() => viewProduct(activeHeroProduct.id)}
                      className="font-heading text-2xl xs:text-3xl sm:text-4xl lg:text-[2.75rem] font-black text-desa-primary leading-tight hover:text-desa-muted cursor-pointer transition-colors tracking-tight line-clamp-2"
                    >
                      {activeHeroProduct.name}
                    </h1>
                  </motion.div>
                </AnimatePresence>

                {/* Compact Action Cluster (Harga, Beli Sekarang, Detail) */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`act-${activeHeroProduct.id}`}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 12 }}
                    transition={{ duration: 0.3 }}
                    className="pt-1 sm:pt-2 flex flex-col items-center lg:items-end gap-3 self-center lg:self-end w-full lg:w-auto"
                  >
                    <div className="flex items-baseline gap-2">
                      <span className="text-[10px] font-mono uppercase text-[#163324] font-bold tracking-wider">
                        Harga
                      </span>
                      <span className="font-heading font-black text-2xl sm:text-3xl text-desa-primary tracking-tight">
                        Rp {Number(activeHeroProduct.price || 0).toLocaleString('id-ID')}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto max-w-sm mx-auto lg:mx-0">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => openDirectCheckout(activeHeroProduct, 1)}
                        className="flex-1 sm:flex-initial px-5 py-2.5 sm:py-3 rounded-full bg-desa-accent hover:bg-desa-highlight text-white font-bold text-xs sm:text-sm tracking-wide transition-colors flex items-center justify-center gap-2 shadow-sm min-h-[44px]"
                      >
                        <ShoppingBag className="w-4 h-4" />
                        <span>Beli Sekarang</span>
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          viewProduct(activeHeroProduct.id);
                          window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
                        }}
                        className="px-4 sm:px-5 py-2.5 sm:py-3 rounded-full bg-white/70 hover:bg-white/95 backdrop-blur-2xl text-desa-primary border border-white/90 font-bold text-xs sm:text-sm transition-colors flex items-center justify-center gap-1.5 shadow-2xs min-h-[44px]"
                        title="Lihat Rincian Produk"
                      >
                        <Eye className="w-4 h-4 text-desa-muted" />
                        <span>Detail</span>
                      </motion.button>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

            </div>

            {/* Bottom Animated Scroll Cue Indicator (Guide to Stage 2) */}
            <div className="pt-2 sm:pt-3 border-t border-[#E8E0D5]/70 flex items-center justify-center">
              <button
                onClick={scrollToContent}
                className="group flex items-center gap-1.5 text-xs text-desa-muted hover:text-desa-primary transition-colors cursor-pointer select-none py-1"
              >
                <span className="text-xs font-bold text-[#163324]">Eksplorasi Pasar</span>
                <ChevronDown className="w-3.5 h-3.5 text-desa-accent transition-transform group-hover:translate-y-0.5 animate-bounce" />
              </button>
            </div>

          </div>
        </section>

        {/* =========================================================================
            FASE 2: HERO PAGE & KONTEN LENGKAP (SETELAH SCROLL)
            Muncul di bawah fold layar fullscreen pertama
           ========================================================================= */}
        <div id="pasar-content" className="space-y-16 lg:space-y-24 scroll-mt-20 pt-8 sm:pt-12">
          
          {/* 1. Hero Section Multi-Card Grid (Sesuai Referensi Foto 2 - Studio Keffi) */}
          <KeffiProductGrid />

          {/* 2. Section Pencarian Terpadu (Liquid Glass Search Pill) */}
          <section className="max-w-3xl mx-auto px-4 sm:px-6">
            <form onSubmit={handleHeroSearchSubmit} className="space-y-3">
              <div className="flex items-center gap-2 p-1.5 sm:p-2 bg-white/85 backdrop-blur-xl rounded-full border border-white/90 shadow-[0_4px_25px_rgba(22,51,36,0.06)] focus-within:border-desa-accent transition-all">
                <div className="flex items-center gap-2.5 px-3 sm:px-4 py-1.5 sm:py-2 flex-1 min-w-0">
                  <Search className="w-4 h-4 text-desa-accent shrink-0" />
                  <input
                    type="text"
                    placeholder="Cari produk tenun, kripik, madu, anyaman..."
                    value={heroSearch}
                    onChange={(e) => setHeroSearch(e.target.value)}
                    className="w-full bg-transparent text-xs sm:text-sm text-desa-text placeholder:text-desa-subtle focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="px-5 sm:px-6 py-2.5 rounded-full bg-desa-accent hover:bg-desa-highlight text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 shrink-0 shadow-xs min-h-[40px]"
                >
                  <span className="hidden xs:inline">Cari</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Popular Search Tags - Glass Badges */}
              <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 text-xs text-desa-muted pt-1">
                <span className="text-[11px] text-desa-subtle">Populer:</span>
                {['Kain Lurik ATBM', 'Kripik Tempe', 'Madu Hutan', 'Anyaman Bambu'].map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => {
                      setSearchQuery(tag);
                      setWebPage('catalog');
                      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
                    }}
                    className="px-3 py-1 rounded-full bg-white/75 backdrop-blur-sm text-[#163324] hover:bg-desa-primary hover:text-white transition-colors text-[11px] font-bold border border-white/80 shadow-2xs"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </form>
          </section>

          {/* 3. Section Kategori Produk (Glassy Chips with Mobile Touch Swipe) */}
          <section className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-4 sm:mb-6">
              <div>
                <h2 className="font-heading text-2xl sm:text-3xl font-black text-[#163324] tracking-tight">
                  Kategori Produk Desa
                </h2>
                <p className="text-xs sm:text-sm font-medium text-[#4A6B59] mt-1">
                  Komoditas pangan, kerajinan tangan, dan herbal asli Sumedang
                </p>
              </div>
              <button
                onClick={() => {
                  setSelectedCategory('semua');
                  setWebPage('catalog');
                  window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
                }}
                className="text-xs font-bold text-desa-accent hover:underline transition-colors flex items-center gap-1 group shrink-0"
              >
                <span>Semua Kategori</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar sm:flex-wrap pb-1">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategorySelect(cat.id)}
                  className="shrink-0 px-4 py-2 rounded-full bg-white/80 backdrop-blur-md hover:bg-desa-primary hover:text-white text-xs sm:text-sm font-bold text-[#163324] cursor-pointer transition-colors border border-white/90 hover:border-desa-primary flex items-center gap-1.5 shadow-2xs min-h-[40px]"
                >
                  <span>{cat.name}</span>
                  <span className="text-desa-subtle text-[11px] font-mono font-medium">
                    {cat.count}
                  </span>
                </button>
              ))}
            </div>
          </section>

          {/* 4. Section Produk Pilihan & Terlaris (Carousel) */}
          <section className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-4">
              <div>
                <h2 className="font-heading text-2xl sm:text-3xl font-bold text-desa-primary tracking-tight">
                  Produk Pilihan & Terlaris
                </h2>
                <p className="text-sm text-desa-muted mt-1">
                  Karya asli bermutu tinggi buatan tangan pengrajin dan petani desa
                </p>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button
                  onClick={prevCarousel}
                  className="p-2.5 rounded-full bg-white/75 backdrop-blur-sm border border-white/80 hover:border-desa-primary text-desa-primary transition-colors shadow-2xs"
                  aria-label="Sebelumnya"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={nextCarousel}
                  className="p-2.5 rounded-full bg-white/75 backdrop-blur-sm border border-white/80 hover:border-desa-primary text-desa-primary transition-colors shadow-2xs"
                  aria-label="Selanjutnya"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <AnimatePresence mode="popLayout">
                {featuredProducts.slice(carouselIndex, carouselIndex + 4).map((product) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ type: 'spring', stiffness: 320, damping: 28 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </section>

          {/* 5. Section Wirausaha & Pengrajin Desa (Glassy Shop Cards) */}
          <section className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-4">
              <div>
                <h2 className="font-heading text-2xl sm:text-3xl font-bold text-desa-primary tracking-tight">
                  Wirausaha & Pengrajin Desa
                </h2>
                <p className="text-sm text-desa-muted mt-1">
                  Pelaku usaha mandiri binaan BUMDes Kabupaten Sumedang
                </p>
              </div>

              <button
                onClick={() => openAuth('daftar_umkm')}
                className="px-4 py-2 rounded-full bg-desa-accent text-white text-xs font-bold hover:bg-desa-highlight transition-colors flex items-center gap-2 self-start sm:self-auto shadow-sm"
              >
                <span>Daftarkan Usaha Anda</span>
                <ArrowRight className="w-3.5 h-3.5 text-white" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {newUmkmShops.map((shop) => (
                <div
                  key={shop.id}
                  onClick={() => viewShop(shop.id)}
                  className="group bg-white rounded-2xl overflow-hidden border border-[#E8E0D5] hover:border-desa-accent hover:shadow-[0_14px_35px_rgba(22,51,36,0.1)] cursor-pointer transition-all flex flex-col justify-between shadow-[0_4px_16px_rgba(22,51,36,0.05)]"
                >
                  <div>
                    <div className="h-32 overflow-hidden relative bg-desa-surface">
                      <img
                        src={shop.banner}
                        alt={shop.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      />
                      <div className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full bg-white text-[#163324] text-[10px] font-black border border-[#E8E0D5] shadow-xs">
                        {shop.category}
                      </div>
                    </div>

                    <div className="p-4 space-y-2.5">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={shop.avatar}
                          alt={shop.owner}
                          className="w-10 h-10 rounded-full border border-[#E8E0D5] object-cover"
                        />
                        <div className="overflow-hidden">
                          <h3 className="font-heading font-black text-[#163324] text-base truncate group-hover:text-desa-accent transition-colors">
                            {shop.name}
                          </h3>
                          <p className="text-xs font-bold text-[#163324] truncate">
                            {shop.kecamatan.replace('Kecamatan ', '')}
                          </p>
                        </div>
                      </div>

                      <p className="text-xs text-[#163324]/85 line-clamp-2 font-medium leading-relaxed">
                        {shop.description}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 pt-2.5 border-t border-[#E8E0D5] flex items-center justify-between text-xs">
                    <span className="text-[#163324] text-xs font-bold">Pengelola: {shop.owner}</span>
                    <span className="text-desa-accent font-black flex items-center gap-1 group-hover:underline">
                      Kunjungi Toko
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 6. Section Statistik Ekosistem Pasar Desa (30% Forest Green Dominant with Glass Metrics) */}
          <section className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-[#163324] text-[#FBF8F3] rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-xl">
              <div className="text-center max-w-xl mx-auto mb-10">
                <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#FBF8F3] tracking-tight">
                  Statistik Ekosistem Pasar Desa
                </h2>
                <p className="text-xs sm:text-sm text-[#FBF8F3]/75 mt-2 font-normal">
                  Sinergi aktif pengrajin, petani mandiri, dan warga dalam membangun ekonomi lokal
                </p>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 text-center">
                <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
                  <Users className="w-5 h-5 text-desa-accent mx-auto mb-2" />
                  <div className="font-heading text-2xl sm:text-3xl font-bold text-white">
                    <Counter value={stats.totalUmkm} suffix="+" />
                  </div>
                  <p className="text-xs text-[#FBF8F3]/80 mt-1 font-medium">
                    UMKM Binaan
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
                  <Package className="w-5 h-5 text-desa-accent mx-auto mb-2" />
                  <div className="font-heading text-2xl sm:text-3xl font-bold text-white">
                    <Counter value={stats.totalProducts} suffix="+" />
                  </div>
                  <p className="text-xs text-[#FBF8F3]/80 mt-1 font-medium">
                    Produk Terkurasi
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
                  <TrendingUp className="w-5 h-5 text-desa-accent mx-auto mb-2" />
                  <div className="font-heading text-2xl sm:text-3xl font-bold text-white">
                    <Counter value={stats.totalTransactions} />
                  </div>
                  <p className="text-xs text-[#FBF8F3]/80 mt-1 font-medium">
                    Pesanan Terlayani
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
                  <Award className="w-5 h-5 text-desa-accent mx-auto mb-2" />
                  <div className="font-heading text-2xl sm:text-3xl font-bold text-white">
                    5 Sentra
                  </div>
                  <p className="text-xs text-[#FBF8F3]/80 mt-1 font-medium">
                    Kecamatan Pengrajin
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 7. Section Akses Mobile PWA (Glass Enclosure) */}
          <section className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/80 p-8 sm:p-12 shadow-[0_10px_40px_rgba(22,51,36,0.05)]">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                
                <div className="lg:col-span-8 space-y-3">
                  <span className="text-xs font-mono uppercase tracking-wider text-desa-accent font-semibold block">
                    Progressive Web App
                  </span>

                  <h2 className="font-heading text-2xl sm:text-3xl font-bold text-desa-primary tracking-tight">
                    Akses Langsung di Layar Ponsel
                  </h2>

                  <p className="text-sm text-desa-muted leading-relaxed max-w-2xl">
                    Pasar Desa dapat diinstal langsung ke ponsel Anda tanpa perlu download dari toko aplikasi. Cepat dibuka, hemat memori, dan siap digunakan belanja kapan saja.
                  </p>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-3 text-xs text-desa-muted">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-desa-surface border border-desa-border flex items-center justify-center font-bold text-desa-primary text-[10px]">1</span>
                      <span className="text-desa-text font-medium">Buka di Browser</span>
                    </div>
                    <span className="hidden sm:inline text-desa-border">•</span>
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-desa-surface border border-desa-border flex items-center justify-center font-bold text-desa-primary text-[10px]">2</span>
                      <span className="text-desa-text font-medium">Tambahkan ke Layar Utama</span>
                    </div>
                    <span className="hidden sm:inline text-desa-border">•</span>
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-desa-surface border border-desa-border flex items-center justify-center font-bold text-desa-primary text-[10px]">3</span>
                      <span className="text-desa-text font-medium">Ikon Siap Digunakan</span>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 bg-white/80 backdrop-blur-md rounded-2xl border border-desa-border/70 space-y-3 text-center shadow-xs">
                  <Smartphone className="w-6 h-6 text-desa-primary" />
                  <div>
                    <h4 className="font-heading font-bold text-desa-primary text-sm">Simulasi Tampilan HP</h4>
                    <p className="text-xs text-desa-muted mt-0.5">Uji coba tampilan mobile responsif langsung di browser.</p>
                  </div>
                  <button
                    onClick={() => setCurrentView('mobile')}
                    className="w-full py-2.5 px-4 rounded-full bg-desa-accent hover:bg-desa-highlight text-white font-bold text-xs transition-colors shadow-xs"
                  >
                    Buka Pratinjau Mobile
                  </button>
                </div>

              </div>
            </div>
          </section>

        </div>

      </motion.div>
    </>
  );
}
