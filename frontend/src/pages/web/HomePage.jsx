import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import ProductCard from '../../components/common/ProductCard';
import { 
  Search, 
  ArrowRight, 
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Smartphone,
  TrendingUp,
  Users,
  Package,
  Award,
  Sparkles,
  ShoppingBag,
  Eye,
  Play,
  ShieldCheck,
  CheckCircle2
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
    openDirectCheckout
  } = useApp();

  const [heroSearch, setHeroSearch] = useState('');
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [activeHeroIndex, setActiveHeroIndex] = useState(0);

  const featuredProducts = products.filter(p => p.isFeatured || p.isPopular);
  const heroShowcaseList = featuredProducts.slice(0, 4);
  const activeHeroProduct = heroShowcaseList[activeHeroIndex] || products[0];
  const newUmkmShops = shops.slice(0, 4);

  // Auto rotate hero showcase smoothly every 7 seconds
  useEffect(() => {
    if (heroShowcaseList.length <= 1) return;
    const interval = setInterval(() => {
      setActiveHeroIndex((prev) => (prev + 1) % heroShowcaseList.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [heroShowcaseList.length]);

  const handleHeroSearchSubmit = (e) => {
    e.preventDefault();
    if (!heroSearch.trim()) return;
    setSearchQuery(heroSearch);
    setWebPage('catalog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    setWebPage('catalog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const nextCarousel = () => {
    setCarouselIndex((prev) => (prev + 1) % Math.max(1, featuredProducts.length - 3));
  };

  const prevCarousel = () => {
    setCarouselIndex((prev) => (prev - 1 + Math.max(1, featuredProducts.length - 3)) % Math.max(1, featuredProducts.length - 3));
  };

  return (
    <div className="space-y-16 lg:space-y-24 overflow-hidden pb-16">
      
      {/* =========================================================================
          HERO SECTION: PRODUCT SHOWCASE LAYOUT (Reference: Adidas Yeezy Showcase)
          Palet: 60% Sage Mist (#E8ECE6), 30% Deep Forest (#1C2D22), 10% Sunbeam Yellow (#F5B731)
         ========================================================================= */}
      <section className="relative pt-4 pb-8 lg:pt-8 lg:pb-14">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Main Showcase Stage */}
          <div className="relative rounded-3xl bg-white/70 backdrop-blur-sm border border-desa-border/80 shadow-md p-6 sm:p-8 lg:p-12 overflow-hidden min-h-[580px] lg:min-h-[620px] flex flex-col justify-between">
            
            {/* Ambient Background Aura */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[500px] lg:w-[640px] h-[340px] sm:h-[500px] lg:h-[640px] bg-desa-accent/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute top-10 right-10 w-72 h-72 bg-desa-primary/5 rounded-full blur-2xl pointer-events-none" />

            {/* Top Brand Tag / Stage Meta */}
            <div className="relative z-10 flex items-center justify-between pb-4 border-b border-desa-border/50">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-desa-accent animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider text-desa-primary">
                  Kurasi Unggulan Pengrajin Sumedang
                </span>
              </div>
              <div className="hidden sm:flex items-center gap-2 text-xs text-desa-muted font-medium">
                <span>Sentra Terdaftar:</span>
                <span className="px-2 py-0.5 rounded-full bg-desa-surface border border-desa-border text-desa-primary font-semibold">
                  5 Kecamatan
                </span>
              </div>
            </div>

            {/* Middle Grid: Left Slider & Media, Center Floating Product, Right Title & CTA */}
            <div className="relative z-10 py-6 lg:py-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center">
              
              {/* 1. LEFT COLUMN: Vertical Slider Indicator + Artisan Media Card */}
              <div className="lg:col-span-3 flex flex-row lg:flex-col justify-between items-start lg:items-start gap-6 order-2 lg:order-1">
                
                {/* Vertical Slider Rail (Switch between featured products) */}
                <div className="flex flex-row lg:flex-col items-center gap-2.5 bg-desa-surface/90 backdrop-blur-xs p-1.5 rounded-full border border-desa-border/70 shadow-2xs">
                  {heroShowcaseList.map((item, idx) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveHeroIndex(idx)}
                      className={`relative transition-all duration-300 rounded-full flex items-center justify-center ${
                        activeHeroIndex === idx 
                          ? 'w-8 h-8 lg:w-7 lg:h-9 bg-desa-primary text-white shadow-xs' 
                          : 'w-7 h-7 lg:w-7 lg:h-7 text-desa-muted hover:text-desa-primary hover:bg-black/5'
                      }`}
                      title={item.name}
                      aria-label={`Pilih produk ${item.name}`}
                    >
                      <span className="text-[11px] font-bold">0{idx + 1}</span>
                      {activeHeroIndex === idx && (
                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-desa-accent rounded-full" />
                      )}
                    </button>
                  ))}
                </div>

                {/* Artisan Craft / Media Card (Bottom-Left) */}
                {activeHeroProduct && (
                  <motion.div 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={`media-${activeHeroProduct.id}`}
                    transition={{ duration: 0.4 }}
                    onClick={() => viewShop(activeHeroProduct.shopId)}
                    className="group bg-white/95 rounded-2xl p-3 border border-desa-border/80 shadow-xs hover:border-desa-primary/40 hover:shadow-md transition-all cursor-pointer max-w-[240px] sm:max-w-[260px]"
                  >
                    <div className="relative aspect-16/10 rounded-xl overflow-hidden bg-desa-bg mb-2.5">
                      <img
                        src={activeHeroProduct.images?.[1] || activeHeroProduct.images?.[0] || '/kain-lurik.jpg'}
                        alt={activeHeroProduct.shopName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      />
                      <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
                        <div className="w-8 h-8 rounded-full bg-desa-primary/85 text-desa-accent flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
                          <Play className="w-3.5 h-3.5 fill-desa-accent ml-0.5" />
                        </div>
                      </div>
                      <div className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-xs text-[10px] text-white font-medium">
                        Profil Pengrajin
                      </div>
                    </div>
                    
                    <div className="space-y-0.5">
                      <div className="flex items-center justify-between text-[11px] text-desa-muted">
                        <span className="truncate font-semibold text-desa-primary">{activeHeroProduct.shopName}</span>
                        <ArrowUpRight className="w-3 h-3 text-desa-muted group-hover:text-desa-accent transition-colors" />
                      </div>
                      <p className="text-[10px] text-desa-subtle truncate">
                        {activeHeroProduct.kecamatan.replace('Kecamatan ', '')} • Sentra UMKM Desa
                      </p>
                    </div>
                  </motion.div>
                )}

              </div>

              {/* 2. CENTER COLUMN: Floating 3D Product Focal Point (The "Shoe Showcase" Centerpiece) */}
              <div className="lg:col-span-5 relative flex flex-col items-center justify-center order-1 lg:order-2 py-4 sm:py-6">
                
                {/* 360° / Authenticity Floating Badge */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  key={`badge-${activeHeroProduct.id}`}
                  className="absolute top-2 right-4 sm:right-10 z-20 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-desa-border shadow-xs flex items-center gap-1.5 text-xs font-semibold text-desa-primary"
                >
                  <Sparkles className="w-3.5 h-3.5 text-desa-accent" />
                  <span>100% Produk Lokal</span>
                </motion.div>

                {/* Floating Product Image with Depth Shadow */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeHeroProduct.id}
                    initial={{ opacity: 0, scale: 0.9, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -15 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    onClick={() => viewProduct(activeHeroProduct.id)}
                    className="relative cursor-pointer group select-none"
                  >
                    <div className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 flex items-center justify-center">
                      <img
                        src={activeHeroProduct.images?.[0] || '/kain-lurik.jpg'}
                        alt={activeHeroProduct.name}
                        className="w-full h-full object-contain filter drop-shadow-2xl transition-transform duration-500 ease-out group-hover:scale-105 animate-product-float"
                      />
                    </div>

                    {/* Soft Dynamic Floor Shadow */}
                    <div className="w-48 sm:w-64 h-4 bg-desa-primary/20 rounded-full blur-md mx-auto -mt-4 transition-transform group-hover:scale-90" />
                  </motion.div>
                </AnimatePresence>

              </div>

              {/* 3. RIGHT COLUMN: Big Title, Details, Price Box & Solid CTA */}
              <div className="lg:col-span-4 space-y-5 order-3">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`desc-${activeHeroProduct.id}`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.4 }}
                    className="space-y-4"
                  >
                    {/* Category Label */}
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-desa-surface border border-desa-border text-[11px] font-bold uppercase tracking-wider text-desa-muted">
                        {activeHeroProduct.categoryName}
                      </span>
                      <span className="text-xs text-desa-subtle">
                        Kode Produk #{activeHeroProduct.id}
                      </span>
                    </div>

                    {/* Big Display Title with Diagonal Arrow */}
                    <h1 
                      onClick={() => viewProduct(activeHeroProduct.id)}
                      className="font-heading text-3xl sm:text-4xl lg:text-[2.6rem] font-bold text-desa-primary leading-tight hover:text-desa-muted cursor-pointer transition-colors flex items-start gap-2 group"
                    >
                      <span className="line-clamp-2">{activeHeroProduct.name}</span>
                      <ArrowUpRight className="w-7 h-7 text-desa-accent shrink-0 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </h1>

                    <p className="text-sm text-desa-muted leading-relaxed line-clamp-3 font-normal">
                      {activeHeroProduct.description}
                    </p>

                    {/* Price Box + Solid Sunbeam CTA Pill (Matching Reference Box Layout) */}
                    <div className="pt-2 flex flex-col sm:flex-row items-stretch gap-3">
                      
                      {/* Price Box */}
                      <div className="px-4 py-2.5 rounded-2xl bg-white border border-desa-border shadow-2xs flex flex-col justify-center min-w-[130px]">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-desa-subtle">
                          Harga Satuan
                        </span>
                        <span className="font-heading text-lg font-bold text-desa-primary">
                          Rp {Number(activeHeroProduct.price || 0).toLocaleString('id-ID')}
                        </span>
                      </div>

                      {/* Primary Sunbeam Yellow CTA Button */}
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => openDirectCheckout(activeHeroProduct, 1)}
                        className="flex-1 px-5 py-3 rounded-2xl bg-desa-accent hover:bg-desa-highlight text-desa-primary font-bold text-xs tracking-wide shadow-sm transition-all flex items-center justify-center gap-2"
                      >
                        <ShoppingBag className="w-4 h-4" />
                        <span>Beli Sekarang</span>
                      </motion.button>

                      {/* Detail Link Button */}
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => {
                          viewProduct(activeHeroProduct.id);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="px-4 py-3 rounded-2xl bg-desa-primary hover:bg-desa-primary/90 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
                        title="Lihat Rincian Produk"
                      >
                        <Eye className="w-4 h-4" />
                        <span>Detail</span>
                      </motion.button>
                    </div>

                    {/* Micro Trust Guarantee */}
                    <div className="flex items-center gap-2 text-xs text-desa-muted pt-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-desa-primary" />
                      <span>Garansi uang kembali & pengiriman aman langsung dari desa</span>
                    </div>

                  </motion.div>
                </AnimatePresence>
              </div>

            </div>

            {/* Bottom Integrated Search Capsule (Feature Parity: Search Bar & Popular Tags) */}
            <div className="relative z-10 pt-4 border-t border-desa-border/60">
              <form onSubmit={handleHeroSearchSubmit} className="max-w-2xl mx-auto">
                <div className="flex flex-col sm:flex-row items-stretch gap-2 p-1.5 bg-white rounded-full shadow-xs border border-desa-border focus-within:border-desa-primary focus-within:ring-2 focus-within:ring-desa-accent/20 transition-all">
                  <div className="flex items-center gap-3 px-4 py-1.5 flex-1">
                    <Search className="w-4 h-4 text-desa-accent shrink-0" />
                    <input
                      type="text"
                      placeholder="Cari kain tenun lurik, kripik tempe, madu hutan, anyaman bambu..."
                      value={heroSearch}
                      onChange={(e) => setHeroSearch(e.target.value)}
                      className="w-full bg-transparent text-xs sm:text-sm text-desa-text placeholder:text-desa-subtle focus:outline-none"
                    />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    type="submit"
                    className="px-5 py-2 rounded-full bg-desa-primary hover:bg-desa-primary/90 text-white font-semibold text-xs tracking-wide shadow-xs transition-colors flex items-center justify-center gap-2 shrink-0"
                  >
                    <span>Cari Produk</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </motion.button>
                </div>

                {/* Popular Tags */}
                <div className="flex flex-wrap items-center justify-center gap-2 mt-2.5 text-xs text-desa-muted">
                  <span className="font-semibold text-desa-primary text-[11px]">Pencarian populer:</span>
                  {['Kain Lurik ATBM', 'Kripik Tempe', 'Madu Hutan', 'Anyaman Bambu'].map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => {
                        setSearchQuery(tag);
                        setWebPage('catalog');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="px-2.5 py-0.5 rounded-full bg-white/80 hover:bg-desa-primary hover:text-white transition-colors text-[11px] font-medium border border-desa-border/70"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </form>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION: KATEGORI PRODUK (Capsule Grid Layout)
         ========================================================================= */}
      <section className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-desa-accent uppercase tracking-wider mb-1">
              <span>Rumpun Komoditas</span>
            </div>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-desa-primary">
              Kategori Produk Desa
            </h2>
            <p className="text-sm text-desa-muted mt-0.5">
              Jelajahi komoditas unggulan menurut rumpun kerajinan dan pangan khas Sumedang
            </p>
          </div>
          <button
            onClick={() => {
              setSelectedCategory('semua');
              setWebPage('catalog');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-xs font-semibold text-desa-primary hover:text-desa-accent transition-colors flex items-center gap-1 group"
          >
            <span>Semua Kategori</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="flex flex-wrap gap-2.5">
          {categories.map((cat, idx) => (
            <motion.button
              key={cat.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.03, duration: 0.3 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => handleCategorySelect(cat.id)}
              className="relative px-4 py-2.5 rounded-full bg-white hover:bg-desa-primary hover:text-white text-xs sm:text-sm font-medium text-desa-primary cursor-pointer transition-colors duration-180 group shadow-2xs border border-desa-border/80 hover:border-desa-primary flex items-center gap-1.5"
            >
              <span className="relative z-10">{cat.name}</span>
              <span className="relative z-10 px-1.5 py-0.2 rounded-full bg-desa-surface group-hover:bg-white/20 text-desa-muted group-hover:text-white text-[11px] font-semibold">
                {cat.count}
              </span>
            </motion.button>
          ))}
        </div>
      </section>

      {/* =========================================================================
          SECTION: PRODUK PILIHAN & TERLARIS (Carousel Slider)
         ========================================================================= */}
      <section className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-desa-accent uppercase tracking-wider mb-1">
              <span>Kurasi Terpercaya</span>
            </div>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-desa-primary">
              Produk Pilihan & Terlaris
            </h2>
            <p className="text-sm text-desa-muted mt-0.5">
              Karya asli bermutu tinggi yang dibuat dan dipanen langsung oleh warga desa
            </p>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={prevCarousel}
              className="p-2.5 rounded-full bg-white border border-desa-border hover:border-desa-primary text-desa-primary transition-colors shadow-2xs"
              aria-label="Sebelumnya"
            >
              <ChevronLeft className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={nextCarousel}
              className="p-2.5 rounded-full bg-white border border-desa-border hover:border-desa-primary text-desa-primary transition-colors shadow-2xs"
              aria-label="Selanjutnya"
            >
              <ChevronRight className="w-4 h-4" />
            </motion.button>
          </div>
        </div>

        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
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
        </motion.div>
      </section>

      {/* =========================================================================
          SECTION: WIRAUSAHA & PENGRAJIN DESA (UMKM Showcase)
         ========================================================================= */}
      <section className="bg-white/60 border-y border-desa-border/80 py-14">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-desa-accent uppercase tracking-wider mb-1">
                <span>Sentra Produksi</span>
              </div>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-desa-primary">
                Wirausaha & Pengrajin Desa
              </h2>
              <p className="text-sm text-desa-muted mt-0.5">
                Dukung kemandirian pelaku usaha mandiri dari berbagai kecamatan Kabupaten Sumedang
              </p>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                setWebPage('auth');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-4 py-2.5 rounded-full bg-desa-primary text-white text-xs font-semibold hover:bg-desa-primary/90 transition-colors flex items-center gap-2 self-start sm:self-auto shadow-2xs"
            >
              <span>Daftarkan Usaha Anda</span>
              <ArrowRight className="w-3.5 h-3.5 text-desa-accent" />
            </motion.button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {newUmkmShops.map((shop, i) => (
              <motion.div
                key={shop.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.35 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                onClick={() => viewShop(shop.id)}
                className="group bg-white rounded-2xl overflow-hidden border border-desa-border hover:border-desa-primary/40 cursor-pointer transition-all shadow-2xs flex flex-col justify-between"
              >
                <div>
                  <div className="h-32 overflow-hidden relative bg-desa-bg">
                    <img
                      src={shop.banner}
                      alt={shop.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                    <div className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full bg-white/95 text-desa-primary text-[10px] font-bold shadow-xs">
                      {shop.category}
                    </div>
                  </div>

                  <div className="p-4 space-y-2">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={shop.avatar}
                        alt={shop.owner}
                        className="w-9 h-9 rounded-full border border-desa-border object-cover"
                      />
                      <div className="overflow-hidden">
                        <h3 className="font-heading font-semibold text-desa-primary text-sm truncate group-hover:text-desa-muted transition-colors">
                          {shop.name}
                        </h3>
                        <p className="text-[11px] text-desa-muted truncate">
                          {shop.kecamatan.replace('Kecamatan ', '')}
                        </p>
                      </div>
                    </div>

                    <p className="text-xs text-desa-muted line-clamp-2 font-normal leading-relaxed">
                      {shop.description}
                    </p>
                  </div>
                </div>

                <div className="p-4 pt-2 border-t border-desa-border/70 flex items-center justify-between text-xs">
                  <span className="text-desa-muted text-[11px]">Pengelola: {shop.owner}</span>
                  <span className="text-desa-primary font-bold flex items-center gap-1 group-hover:underline">
                    Kunjungi Toko
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION: STATISTIK EKOSISTEM PASAR DESA (Deep Forest Dark Card)
         ========================================================================= */}
      <section className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-desa-primary text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-md">
          
          {/* Subtle Accent Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-desa-accent/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10">
            <div className="text-center max-w-xl mx-auto mb-10">
              <span className="text-xs font-bold uppercase tracking-wider text-desa-accent">
                Dampak Nyata Kemandirian Desa
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white mt-1.5">
                Statistik Ekosistem Pasar Desa
              </h2>
              <p className="text-xs sm:text-sm text-desa-border mt-2 font-normal">
                Sinergi aktif pengrajin, petani mandiri, dan warga dalam membangun ekonomi lokal
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 text-center">
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
                <Users className="w-6 h-6 text-desa-accent mx-auto mb-2" />
                <div className="font-heading text-2xl sm:text-3xl font-bold text-white">
                  <Counter value={stats.totalUmkm} suffix="+" />
                </div>
                <p className="text-xs sm:text-sm text-desa-border mt-1 font-medium">
                  UMKM Binaan
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
                <Package className="w-6 h-6 text-desa-accent mx-auto mb-2" />
                <div className="font-heading text-2xl sm:text-3xl font-bold text-white">
                  <Counter value={stats.totalProducts} suffix="+" />
                </div>
                <p className="text-xs sm:text-sm text-desa-border mt-1 font-medium">
                  Produk Terkurasi
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
                <TrendingUp className="w-6 h-6 text-desa-accent mx-auto mb-2" />
                <div className="font-heading text-2xl sm:text-3xl font-bold text-white">
                  <Counter value={stats.totalTransactions} />
                </div>
                <p className="text-xs sm:text-sm text-desa-border mt-1 font-medium">
                  Pesanan Terlayani
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
                <Award className="w-6 h-6 text-desa-accent mx-auto mb-2" />
                <div className="font-heading text-2xl sm:text-3xl font-bold text-white">
                  5 Sentra
                </div>
                <p className="text-xs sm:text-sm text-desa-border mt-1 font-medium">
                  Kecamatan Pengrajin
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION: AKSES MOBILE PWA
         ========================================================================= */}
      <section className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-desa-border p-8 sm:p-12 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-desa-accent uppercase tracking-wider">
                <Smartphone className="w-4 h-4 text-desa-primary" />
                <span>Progressive Web App</span>
              </div>

              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-desa-primary">
                Akses Cepat di Layar Utama HP Anda
              </h2>

              <p className="text-sm text-desa-muted leading-relaxed max-w-2xl">
                Pasar Desa dirancang agar dapat diinstal langsung ke ponsel Anda tanpa perlu download dari toko aplikasi. Sangat hemat kuota, cepat dibuka, dan siap digunakan untuk belanja produk desa kapan saja.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-4 rounded-2xl bg-desa-surface border border-desa-border/70 space-y-1">
                  <span className="text-xs font-bold text-desa-primary">1. Buka di Browser</span>
                  <p className="text-xs text-desa-muted">Buka link Pasar Desa melalui Chrome atau Safari di HP Anda.</p>
                </div>
                <div className="p-4 rounded-2xl bg-desa-surface border border-desa-border/70 space-y-1">
                  <span className="text-xs font-bold text-desa-primary">2. Tambahkan ke Layar</span>
                  <p className="text-xs text-desa-muted">Ketuk menu browser dan pilih "Tambahkan ke Layar Utama".</p>
                </div>
                <div className="p-4 rounded-2xl bg-desa-surface border border-desa-border/70 space-y-1">
                  <span className="text-xs font-bold text-desa-primary">3. Siap Dipakai</span>
                  <p className="text-xs text-desa-muted">Ikon Pasar Desa langsung muncul di HP seperti aplikasi resmi.</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 bg-desa-surface rounded-2xl border border-desa-border space-y-4 text-center">
              <div className="w-12 h-12 rounded-2xl bg-desa-primary text-desa-accent flex items-center justify-center shadow-xs">
                <Smartphone className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-heading font-bold text-desa-primary text-base">Uji Coba Tampilan Mobile</h4>
                <p className="text-xs text-desa-muted mt-1">Rasakan pengalaman belanja responsif dalam simulasi PWA langsung di browser Anda.</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setCurrentView('mobile')}
                className="w-full py-2.5 px-4 rounded-full bg-desa-accent hover:bg-desa-highlight text-desa-primary font-bold text-xs transition-colors shadow-xs"
              >
                Buka Pratinjau Mobile
              </motion.button>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
