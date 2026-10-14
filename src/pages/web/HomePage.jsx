import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import ProductCard from '../../components/common/ProductCard';
import LurikDivider from '../../components/common/LurikDivider';
import { 
  Search, 
  ArrowRight, 
  Utensils, 
  Sprout, 
  Palette, 
  HeartPulse, 
  Shirt, 
  LayoutGrid,
  ChevronLeft,
  ChevronRight,
  Smartphone,
  ShieldCheck,
  TrendingUp,
  Users,
  Package,
  Award,
  Sparkles,
  CheckCircle2,
  MapPin,
  ExternalLink
} from 'lucide-react';

// Animated Counter Component for Statistics
function Counter({ value, suffix = '' }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1600; // ms
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
    setCurrentView 
  } = useApp();

  const [heroSearch, setHeroSearch] = useState('');
  const [carouselIndex, setCarouselIndex] = useState(0);

  // Icon mapping for categories
  const getCategoryIcon = (iconName) => {
    switch(iconName) {
      case 'Utensils': return <Utensils className="w-6 h-6 text-desa-accent" />;
      case 'Sprout': return <Sprout className="w-6 h-6 text-desa-highlight" />;
      case 'Palette': return <Palette className="w-6 h-6 text-desa-accent" />;
      case 'HeartPulse': return <HeartPulse className="w-6 h-6 text-rose-600" />;
      case 'Shirt': return <Shirt className="w-6 h-6 text-amber-700" />;
      default: return <LayoutGrid className="w-6 h-6 text-desa-primary" />;
    }
  };

  const handleHeroSearchSubmit = (e) => {
    e.preventDefault();
    setSearchQuery(heroSearch);
    setWebPage('catalog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    setWebPage('catalog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Filter products for sections
  const featuredProducts = products.filter(p => p.isFeatured || p.isPopular);
  const newUmkmShops = shops.slice(0, 4);

  const nextCarousel = () => {
    setCarouselIndex((prev) => (prev + 1) % Math.max(1, featuredProducts.length - 2));
  };

  const prevCarousel = () => {
    setCarouselIndex((prev) => (prev - 1 + Math.max(1, featuredProducts.length - 2)) % Math.max(1, featuredProducts.length - 2));
  };

  return (
    <div className="space-y-20">
      
      {/* 1. HERO SECTION WITH STAGGERED ENTRANCES */}
      <section className="relative overflow-hidden pt-8 pb-16 lg:py-20 bg-gradient-to-b from-desa-bg via-white/50 to-desa-bg border-b border-desa-primary/10">
        {/* Subtle decorative lurik lines on background borders */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-[repeating-linear-gradient(90deg,#3A3A38_0px,#3A3A38_2px,transparent_2px,transparent_8px)] opacity-30" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content with Framer Motion Stagger */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="lg:col-span-7 space-y-6"
            >
              
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-desa-primary/5 border border-desa-primary/15 text-xs font-semibold text-desa-primary"
              >
                <Sparkles className="w-3.5 h-3.5 text-desa-accent animate-spin" style={{ animationDuration: '6s' }} />
                <span>Pemberdayaan Ekonomi Desa Berbasis Digital</span>
              </motion.div>

              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-desa-primary leading-[1.15]"
              >
                Karya Autentik Warga, <br />
                <span className="text-desa-accent italic font-serif">Kualitas Luhur</span> Pasar Desa.
              </motion.h1>

              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="text-base sm:text-lg text-desa-text/80 max-w-2xl font-light leading-relaxed"
              >
                Jelajahi keindahan kain tenun lurik asli, kelezatan kuliner tradisional dusun, 
                hasil bumi segar langsung dari petani, dan ragam kerajinan tangan khas desa kami.
              </motion.p>

              {/* Product Search Bar */}
              <motion.form 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                onSubmit={handleHeroSearchSubmit} 
                className="pt-2"
              >
                <div className="flex flex-col sm:flex-row items-stretch gap-2 p-2 bg-white rounded-2xl shadow-lg border border-desa-primary/20 focus-within:border-desa-primary focus-within:ring-2 focus-within:ring-desa-accent/20 transition-all">
                  <div className="flex items-center gap-3 px-3 py-2 flex-1">
                    <Search className="w-5 h-5 text-desa-accent shrink-0" />
                    <input
                      type="text"
                      placeholder="Cari kain lurik, kripik tempe, gula aren, madu..."
                      value={heroSearch}
                      onChange={(e) => setHeroSearch(e.target.value)}
                      className="w-full bg-transparent text-sm text-desa-text placeholder:text-desa-text/40 focus:outline-none"
                    />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="px-6 py-3 rounded-xl bg-desa-highlight hover:bg-desa-highlight/90 text-white font-semibold text-sm shadow transition-all flex items-center justify-center gap-2 shimmer-shine"
                  >
                    <span>Cari Produk</span>
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </div>

                {/* Popular Keywords Tags */}
                <div className="flex flex-wrap items-center gap-2 mt-3 text-xs text-desa-text/60">
                  <span className="font-medium text-desa-primary">Pencarian populer:</span>
                  {['Kain Lurik ATBM', 'Kripik Tempe Dusun', 'Madu Hutan Murni', 'Anyaman Bambu'].map((tag) => (
                    <motion.button
                      key={tag}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={() => {
                        setSearchQuery(tag);
                        setWebPage('catalog');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="px-2.5 py-1 rounded-md bg-white/80 border border-desa-primary/15 hover:border-desa-accent hover:text-desa-accent transition-colors"
                    >
                      {tag}
                    </motion.button>
                  ))}
                </div>
              </motion.form>

              {/* Trust Badges */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="pt-4 grid grid-cols-3 gap-4 border-t border-desa-primary/10"
              >
                <div className="flex items-center gap-2 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-desa-highlight shrink-0" />
                  <span className="text-desa-text/80 font-medium">100% Produk Warga</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-desa-highlight shrink-0" />
                  <span className="text-desa-text/80 font-medium">Beli Langsung ke UMKM</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-desa-highlight shrink-0" />
                  <span className="text-desa-text/80 font-medium">Order Cepat WhatsApp</span>
                </div>
              </motion.div>

            </motion.div>

            {/* Right Hero Card Showcase with Floating Dynamics */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="lg:col-span-5 relative"
            >
              <div className="relative mx-auto max-w-md bg-white p-5 rounded-3xl shadow-2xl border border-desa-primary/20 animate-float">
                {/* Decorative traditional lurik badge header */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-desa-primary/15">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-desa-accent animate-ping" />
                    <span className="font-heading font-semibold text-xs tracking-wider text-desa-primary uppercase">
                      Produk Sorotan Hari Ini
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold text-desa-highlight">Terverifikasi Desa</span>
                </div>

                {/* Hero featured product image */}
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-4 bg-desa-primary/5 group">
                  <img
                    src="kain-lurik.jpg"
                    alt="Kain Tenun Lurik"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-lg bg-desa-primary/85 backdrop-blur-md text-desa-light text-xs font-medium">
                    Kain Lurik Telupat - Ibu Sumarsih
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <h4 className="font-heading font-bold text-lg text-desa-primary">
                        Tenun Tradisional ATBM
                      </h4>
                      <p className="text-xs text-desa-text/70">Dusun Krajan RT 02 / RW 01</p>
                    </div>
                    <span className="font-heading text-lg font-bold text-desa-accent">
                      Rp 185.000
                    </span>
                  </div>

                  <p className="text-xs text-desa-text/70 line-clamp-2">
                    Ditenun secara telaten dengan benang katun 100% adem dan motif lurik bersejarah.
                  </p>

                  <div className="pt-2 flex items-center gap-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setWebPage('catalog');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="flex-1 py-2.5 px-4 rounded-xl bg-desa-primary text-desa-light text-xs font-semibold hover:bg-desa-primary/90 transition-all text-center"
                    >
                      Lihat di Katalog
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setCurrentView('mobile')}
                      className="py-2.5 px-4 rounded-xl bg-desa-highlight text-white text-xs font-semibold hover:bg-desa-highlight/90 transition-all flex items-center gap-1.5 shadow-md shimmer-shine"
                      title="Buka versi PWA"
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                      <span>Versi Mobile</span>
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 2. SECTION KATEGORI POPULER WITH INTERACTIVE HOVER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-1.5 h-5 bg-desa-accent rounded-full" />
              <span className="text-xs font-bold uppercase tracking-wider text-desa-accent">
                Eksplorasi Desa
              </span>
            </div>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-desa-primary">
              Kategori Produk Populer
            </h2>
          </div>
          <button
            onClick={() => {
              setSelectedCategory('semua');
              setWebPage('catalog');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-xs font-semibold text-desa-accent hover:text-desa-primary transition-colors flex items-center gap-1 self-start sm:self-auto group"
          >
            <span>Semua Kategori ({categories.reduce((acc, c) => acc + c.count, 0)})</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat, idx) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.06 }}
              whileHover={{ y: -8, scale: 1.04, transition: { duration: 0.2 } }}
              whileTap={{ scale: 0.96 }}
              onClick={() => handleCategorySelect(cat.id)}
              className="group bg-white p-5 rounded-2xl border border-desa-primary/15 hover:border-desa-primary/50 hover:shadow-xl cursor-pointer transition-all text-center flex flex-col items-center justify-between relative overflow-hidden"
            >
              <div className="w-14 h-14 rounded-2xl bg-desa-bg flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-desa-accent/15 transition-all duration-300">
                {getCategoryIcon(cat.icon)}
              </div>
              <h3 className="font-medium text-desa-primary text-sm mb-1 group-hover:text-desa-accent transition-colors">
                {cat.name}
              </h3>
              <span className="text-[11px] text-desa-text/50">
                {cat.count} Produk
              </span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 3. SECTION PRODUK UNGGULAN & TERLARIS (Dynamic Animated Carousel) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-1.5 h-5 bg-desa-highlight rounded-full" />
              <span className="text-xs font-bold uppercase tracking-wider text-desa-highlight">
                Pilihan Terbaik
              </span>
            </div>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-desa-primary">
              Produk Unggulan & Terlaris
            </h2>
            <p className="text-xs sm:text-sm text-desa-text/70 mt-1">
              Produk paling diminati dengan ulasan tertinggi dari pembeli warga maupun luar kota.
            </p>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={prevCarousel}
              className="p-2 rounded-xl bg-white border border-desa-primary/20 hover:bg-desa-primary hover:text-desa-light transition-all text-desa-primary shadow-sm"
              aria-label="Previous"
            >
              <ChevronLeft className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={nextCarousel}
              className="p-2 rounded-xl bg-white border border-desa-primary/20 hover:bg-desa-primary hover:text-desa-light transition-all text-desa-primary shadow-sm"
              aria-label="Next"
            >
              <ChevronRight className="w-4 h-4" />
            </motion.button>
          </div>
        </div>

        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {featuredProducts.slice(carouselIndex, carouselIndex + 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* 4. SECTION UMKM BARU BERGABUNG */}
      <section className="bg-white/70 border-y border-desa-primary/10 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-1.5 h-5 bg-desa-accent rounded-full" />
                <span className="text-xs font-bold uppercase tracking-wider text-desa-accent">
                  Komunitas Usaha
                </span>
              </div>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-desa-primary">
                UMKM Baru Bergabung
              </h2>
              <p className="text-xs sm:text-sm text-desa-text/70 mt-1">
                Dukung wirausaha mandiri di dusun-dusun binaan desa kami.
              </p>
            </div>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                setWebPage('auth');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-4 py-2 rounded-xl bg-desa-primary text-desa-light text-xs font-medium hover:bg-desa-primary/90 transition-all flex items-center gap-2 self-start sm:self-auto shadow-sm"
            >
              <span>Daftarkan Usaha Anda</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </motion.button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {newUmkmShops.map((shop, i) => (
              <motion.div
                key={shop.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                onClick={() => viewShop(shop.id)}
                className="group bg-desa-bg/80 rounded-2xl overflow-hidden border border-desa-primary/15 hover:border-desa-primary/40 hover:shadow-xl cursor-pointer transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="h-28 overflow-hidden relative bg-desa-primary/10">
                    <img
                      src={shop.banner}
                      alt={shop.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-white/90 text-desa-primary text-[10px] font-semibold shadow-xs">
                      {shop.category}
                    </div>
                  </div>

                  <div className="p-4 pt-0 relative">
                    <div className="-mt-7 mb-3 flex items-end justify-between">
                      <img
                        src={shop.avatar}
                        alt={shop.owner}
                        className="w-14 h-14 rounded-2xl border-2 border-white object-cover shadow-md group-hover:scale-105 transition-transform"
                      />
                      <span className="text-[11px] text-desa-text/60">
                        {shop.joinDate}
                      </span>
                    </div>

                    <h3 className="font-heading font-semibold text-desa-primary text-base mb-1 group-hover:text-desa-accent transition-colors line-clamp-1">
                      {shop.name}
                    </h3>
                    <p className="text-xs text-desa-text/60 mb-2 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-desa-accent shrink-0" />
                      <span className="truncate">{shop.dusun}</span>
                    </p>
                    <p className="text-xs text-desa-text/75 line-clamp-2 font-light">
                      {shop.description}
                    </p>
                  </div>
                </div>

                <div className="p-4 pt-2 border-t border-desa-primary/10 flex items-center justify-between text-xs">
                  <span className="text-desa-primary font-medium">Pemilik: {shop.owner}</span>
                  <span className="text-desa-accent font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    Kunjungi <ExternalLink className="w-3 h-3" />
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. SECTION STATISTIK DESA (WITH DYNAMIC ANIMATED COUNTERS) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-desa-primary text-desa-light rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-2xl">
          {/* Traditional Lurik background motif watermark with slow scan */}
          <div className="absolute inset-0 bg-lurik-stripes-light opacity-15 pointer-events-none animate-lurik-scan" />
          
          <div className="relative z-10">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="text-xs uppercase font-bold tracking-widest text-desa-highlight bg-white/10 px-3 py-1 rounded-full">
                Transparansi & Dampak Ekonomi
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-desa-light mt-3">
                Statistik Ekosistem Pasar Desa
              </h2>
              <p className="text-xs sm:text-sm text-desa-light/75 mt-2">
                Kolaborasi warga desa dan pemerintah dalam memajukan kemandirian ekonomi lokal.
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 text-center">
              <motion.div 
                whileHover={{ y: -4, scale: 1.02 }}
                className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm shadow-md"
              >
                <Users className="w-8 h-8 text-desa-highlight mx-auto mb-3" />
                <div className="font-heading text-3xl sm:text-4xl font-bold text-desa-light">
                  <Counter value={stats.totalUmkm} suffix="+" />
                </div>
                <p className="text-xs text-desa-light/70 mt-1 uppercase tracking-wider font-medium">
                  UMKM Aktif Terdaftar
                </p>
              </motion.div>

              <motion.div 
                whileHover={{ y: -4, scale: 1.02 }}
                className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm shadow-md"
              >
                <Package className="w-8 h-8 text-desa-accent mx-auto mb-3" />
                <div className="font-heading text-3xl sm:text-4xl font-bold text-desa-light">
                  <Counter value={stats.totalProducts} suffix="+" />
                </div>
                <p className="text-xs text-desa-light/70 mt-1 uppercase tracking-wider font-medium">
                  Produk Terkurasi
                </p>
              </motion.div>

              <motion.div 
                whileHover={{ y: -4, scale: 1.02 }}
                className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm shadow-md"
              >
                <TrendingUp className="w-8 h-8 text-desa-highlight mx-auto mb-3" />
                <div className="font-heading text-3xl sm:text-4xl font-bold text-desa-light">
                  <Counter value={stats.totalTransactions} />
                </div>
                <p className="text-xs text-desa-light/70 mt-1 uppercase tracking-wider font-medium">
                  Transaksi Terlayani
                </p>
              </motion.div>

              <motion.div 
                whileHover={{ y: -4, scale: 1.02 }}
                className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm shadow-md"
              >
                <Award className="w-8 h-8 text-amber-400 mx-auto mb-3" />
                <div className="font-heading text-3xl sm:text-4xl font-bold text-desa-light">
                  5 Dusun
                </div>
                <p className="text-xs text-desa-light/70 mt-1 uppercase tracking-wider font-medium">
                  Sentra Pengrajin
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. SECTION PASANG APLIKASI (Download PWA & Mockup HP dengan Animasi Floating) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-desa-primary to-[#2F2F2D] text-desa-light rounded-3xl p-8 sm:p-14 overflow-hidden relative shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs uppercase font-bold tracking-wider text-desa-highlight px-3 py-1 rounded-full bg-white/10 inline-block">
                Aplikasi Mobile PWA
              </span>
              
              <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-desa-light">
                Pasang Pasar Desa di HP, <br />
                <span className="text-desa-accent">Ringan & Tanpa Install Play Store.</span>
              </h2>

              <p className="text-sm sm:text-base text-desa-light/80 leading-relaxed font-light">
                Teknologi Progressive Web App (PWA) memungkinkan aplikasi dipasang langsung ke layar utama 
                ponsel Anda. Hemat kuota, bisa dibuka cepat, dan mendukung notifikasi pesanan secara real-time.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-desa-highlight/30 text-desa-highlight flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    1
                  </span>
                  <p className="text-xs sm:text-sm text-desa-light/90">
                    Buka situs Pasar Desa di browser HP (Chrome / Safari).
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-desa-highlight/30 text-desa-highlight flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    2
                  </span>
                  <p className="text-xs sm:text-sm text-desa-light/90">
                    Klik menu browser (titik tiga) lalu pilih <strong>"Tambahkan ke Layar Utama" (Add to Home Screen)</strong>.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-desa-highlight/30 text-desa-highlight flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    3
                  </span>
                  <p className="text-xs sm:text-sm text-desa-light/90">
                    Aplikasi langsung siap dipakai untuk belanja maupun mengelola toko Anda!
                  </p>
                </div>
              </div>

              {/* Action Buttons with Spring Hover */}
              <div className="pt-4 flex flex-wrap items-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setCurrentView('mobile')}
                  className="px-6 py-3.5 rounded-xl bg-desa-highlight hover:bg-desa-highlight/90 text-white font-bold text-sm shadow-xl transition-all flex items-center gap-2 group shimmer-shine"
                >
                  <Smartphone className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span>Uji Coba Versi Mobile PWA Sekarang</span>
                </motion.button>
              </div>
            </div>

            {/* Right Phone Mockup with Gentle Floating Animation */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-64 sm:w-72 rounded-[40px] bg-black p-3.5 shadow-2xl border-4 border-white/20 relative animate-float">
                {/* Speaker pill notch */}
                <div className="w-24 h-4 bg-black rounded-full mx-auto mb-2" />

                {/* Inner Screen */}
                <div className="rounded-[26px] bg-desa-bg text-desa-text overflow-hidden aspect-[9/18] p-3 flex flex-col justify-between border border-desa-primary/20">
                  {/* Top bar inside mockup */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[10px] text-desa-text/60">
                      <span className="font-bold text-desa-primary">Pasar Desa PWA</span>
                      <span>09:41</span>
                    </div>
                    <div className="p-2 rounded-xl bg-white shadow-sm border border-desa-primary/10 flex items-center gap-2 text-[11px] text-desa-text/60">
                      <Search className="w-3.5 h-3.5 text-desa-accent" />
                      <span>Cari produk lurik...</span>
                    </div>
                    {/* Mockup banner */}
                    <div className="h-16 rounded-xl bg-desa-primary text-desa-light p-2 text-[10px] flex flex-col justify-between relative overflow-hidden">
                      <div className="absolute inset-0 bg-lurik-stripes-light opacity-20" />
                      <span className="font-bold z-10">Bazar UMKM Dusun</span>
                      <span className="text-[9px] text-desa-highlight font-medium z-10">Diskon Produk Lokal</span>
                    </div>
                    {/* 2 mock products */}
                    <div className="grid grid-cols-2 gap-1.5 pt-1">
                      <div className="bg-white rounded-lg p-1.5 border border-desa-primary/10">
                        <div className="aspect-square rounded bg-gray-100 overflow-hidden mb-1">
                          <img src="kain-lurik.jpg" alt="mock" className="w-full h-full object-cover" />
                        </div>
                        <div className="text-[9px] font-bold truncate">Kain Lurik Telupat</div>
                        <div className="text-[9px] text-desa-accent font-semibold">Rp 185.000</div>
                      </div>
                      <div className="bg-white rounded-lg p-1.5 border border-desa-primary/10">
                        <div className="aspect-square rounded bg-gray-100 overflow-hidden mb-1">
                          <img src="https://images.unsplash.com/photo-1599490659213-e2b9527bd087?auto=format&fit=crop&w=200&q=80" alt="mock" className="w-full h-full object-cover" />
                        </div>
                        <div className="text-[9px] font-bold truncate">Kripik Tempe Gurih</div>
                        <div className="text-[9px] text-desa-accent font-semibold">Rp 18.000</div>
                      </div>
                    </div>
                  </div>

                  {/* Mock bottom navigation inside mockup */}
                  <div className="pt-2 border-t border-desa-primary/10 flex justify-around text-[9px] text-desa-text/60">
                    <span className="text-desa-accent font-bold">Beranda</span>
                    <span>Katalog</span>
                    <span>Pesanan</span>
                    <span>Akun</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
