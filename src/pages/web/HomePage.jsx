import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import ProductCard from '../../components/common/ProductCard';
import { 
  Search, 
  ArrowRight, 
  ChevronLeft,
  ChevronRight,
  Smartphone,
  TrendingUp,
  Users,
  Package,
  Award
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
    setCurrentView 
  } = useApp();

  const [heroSearch, setHeroSearch] = useState('');
  const [carouselIndex, setCarouselIndex] = useState(0);

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

  const featuredProducts = products.filter(p => p.isFeatured || p.isPopular);
  const newUmkmShops = shops.slice(0, 4);
  const spotlightProduct = products.find((product) => product.isFeatured) || products[0];

  const nextCarousel = () => {
    setCarouselIndex((prev) => (prev + 1) % Math.max(1, featuredProducts.length - 3));
  };

  const prevCarousel = () => {
    setCarouselIndex((prev) => (prev - 1 + Math.max(1, featuredProducts.length - 3)) % Math.max(1, featuredProducts.length - 3));
  };

  const heroContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.05 }
    }
  };

  const heroItem = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
  };

  return (
    <div className="space-y-20 lg:space-y-28 overflow-hidden">
      
      {/* 1. Hero Section - Dynamic Staggered Reveal */}
      <section className="relative pt-8 pb-12 lg:pt-16 lg:pb-20">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* Left Content Column */}
            <motion.div 
              variants={heroContainer}
              initial="hidden"
              animate="visible"
              className="lg:col-span-7 space-y-6"
            >
              <motion.h1 
                variants={heroItem}
                className="font-heading text-4xl sm:text-5xl lg:text-[3.8rem] xl:text-[4.2rem] font-bold tracking-[-0.03em] text-desa-primary leading-[1.08]"
              >
                Karya Asli Pengrajin & Hasil Bumi Sumedang
              </motion.h1>

              <motion.p 
                variants={heroItem}
                className="text-base sm:text-lg text-desa-muted max-w-xl font-normal leading-relaxed"
              >
                Belanja langsung dari sentra tenun lurik ATBM, perajin anyaman bambu, produsen madu liar, dan olahan pangan desa terpercaya.
              </motion.p>

              {/* Search Form */}
              <motion.form variants={heroItem} onSubmit={handleHeroSearchSubmit} className="pt-2 max-w-xl">
                <div className="flex flex-col sm:flex-row items-stretch gap-2 p-1.5 bg-white rounded-xl shadow-xs border border-desa-border focus-within:border-desa-primary focus-within:ring-2 focus-within:ring-desa-primary/10 transition-all">
                  <div className="flex items-center gap-3 px-3 py-2 flex-1">
                    <Search className="w-5 h-5 text-desa-accent shrink-0" />
                    <input
                      type="text"
                      placeholder="Cari kain lurik, kripik tempe, madu hutan..."
                      value={heroSearch}
                      onChange={(e) => setHeroSearch(e.target.value)}
                      className="w-full bg-transparent text-sm text-desa-text placeholder:text-desa-subtle focus:outline-none"
                    />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    type="submit"
                    className="px-6 py-2.5 rounded-lg bg-desa-primary hover:bg-desa-primary/90 text-white font-semibold text-xs tracking-wide shadow-xs transition-colors flex items-center justify-center gap-2 shrink-0"
                  >
                    <span>Cari Produk</span>
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </div>

                {/* Popular Keywords */}
                <div className="flex flex-wrap items-center gap-2 mt-3 text-xs text-desa-muted">
                  <span className="font-medium text-desa-primary">Pencarian populer:</span>
                  {['Kain Lurik ATBM', 'Kripik Tempe', 'Madu Hutan', 'Anyaman Bambu'].map((tag) => (
                    <motion.button
                      key={tag}
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      type="button"
                      onClick={() => {
                        setSearchQuery(tag);
                        setWebPage('catalog');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="hover:text-desa-accent transition-colors underline decoration-desa-border hover:decoration-desa-accent"
                    >
                      {tag}
                    </motion.button>
                  ))}
                </div>
              </motion.form>
            </motion.div>

            {/* Right Showcase Column */}
            <motion.div 
              initial={{ opacity: 0, x: 24, scale: 0.97 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.65, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="lg:col-span-5"
            >
              {spotlightProduct ? (
                <div className="bg-white rounded-2xl p-5 border border-desa-border shadow-md space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-desa-border text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-desa-accent" />
                      <span className="font-semibold text-desa-primary tracking-wide">
                        Karya Unggulan Hari Ini
                      </span>
                    </div>
                    <span className="text-desa-muted">{spotlightProduct.categoryName}</span>
                  </div>

                  <motion.div 
                    whileHover={{ scale: 1.01 }}
                    onClick={() => viewProduct(spotlightProduct.id)}
                    className="relative aspect-4/3 rounded-xl overflow-hidden bg-desa-bg cursor-pointer group"
                  >
                    <img
                      src={spotlightProduct.images?.[0] || '/kain-lurik.jpg'}
                      alt={spotlightProduct.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                    <div className="absolute bottom-2.5 left-2.5 px-3 py-1 rounded bg-black/75 backdrop-blur-xs text-white text-xs font-medium">
                      {spotlightProduct.shopName} • {spotlightProduct.kecamatan.replace('Kecamatan ', '')}
                    </div>
                  </motion.div>

                  <div className="space-y-2">
                    <div className="flex items-baseline justify-between gap-3">
                      <h3 
                        onClick={() => viewProduct(spotlightProduct.id)}
                        className="font-heading font-bold text-lg text-desa-primary hover:text-desa-accent cursor-pointer transition-colors line-clamp-1"
                      >
                        {spotlightProduct.name}
                      </h3>
                      <span className="font-heading text-lg font-bold text-desa-accent shrink-0">
                        Rp {Number(spotlightProduct.price || 0).toLocaleString('id-ID')}
                      </span>
                    </div>

                    <p className="text-xs text-desa-muted line-clamp-2 leading-relaxed">
                      {spotlightProduct.description}
                    </p>

                    <div className="pt-2 flex items-center gap-3">
                      <motion.button
                        whileTap={{ scale: 0.96 }}
                        whileHover={{ scale: 1.01 }}
                        onClick={() => {
                          viewProduct(spotlightProduct.id);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="flex-1 py-2.5 px-4 rounded-lg bg-desa-primary text-white text-xs font-semibold hover:bg-desa-primary/90 transition-colors text-center"
                      >
                        Lihat Detail Produk
                      </motion.button>
                      <motion.button
                        whileTap={{ scale: 0.96 }}
                        whileHover={{ scale: 1.01 }}
                        onClick={() => {
                          setWebPage('catalog');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="py-2.5 px-4 rounded-lg border border-desa-border text-desa-primary text-xs font-semibold hover:bg-desa-bg transition-colors"
                      >
                        Semua Katalog
                      </motion.button>
                    </div>
                  </div>
                </div>
              ) : null}
            </motion.div>

          </div>
        </div>
      </section>

      {/* 2. Categories Section */}
      <section className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-desa-primary">
              Kategori Produk
            </h2>
            <p className="text-sm text-desa-muted mt-1">
              Jelajahi komoditas unggulan menurut rumpun kerajinan dan pangan
            </p>
          </div>
          <button
            onClick={() => {
              setSelectedCategory('semua');
              setWebPage('catalog');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-xs font-semibold text-desa-accent hover:text-desa-primary transition-colors flex items-center gap-1 group"
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
              transition={{ delay: idx * 0.04, duration: 0.35 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleCategorySelect(cat.id)}
              className="px-4 py-2.5 rounded-lg bg-white hover:bg-desa-primary hover:text-white text-sm font-medium text-desa-primary cursor-pointer transition-all duration-200 group shadow-2xs border border-desa-border/70 hover:border-desa-primary"
            >
              <span>{cat.name}</span>
              <span className="ml-1.5 text-desa-subtle group-hover:text-white/70 text-xs font-normal">({cat.count})</span>
            </motion.button>
          ))}
        </div>
      </section>

      {/* 3. Featured Products with Animated Spring Carousel */}
      <section className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-4">
          <div>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-desa-primary">
              Produk Pilihan & Terlaris
            </h2>
            <p className="text-sm text-desa-muted mt-1">
              Produk berkualitas tinggi yang terkurasi langsung dari sentra pengrajin
            </p>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={prevCarousel}
              className="p-2 rounded-lg bg-white border border-desa-border hover:border-desa-primary text-desa-primary transition-colors shadow-2xs"
              aria-label="Sebelumnya"
            >
              <ChevronLeft className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={nextCarousel}
              className="p-2 rounded-lg bg-white border border-desa-border hover:border-desa-primary text-desa-primary transition-colors shadow-2xs"
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
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 300, damping: 28 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* 4. UMKM Baru Bergabung Section */}
      <section className="bg-white/80 border-y border-desa-border py-14">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-desa-primary">
                Wirausaha & Pengrajin Desa
              </h2>
              <p className="text-sm text-desa-muted mt-1">
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
              className="px-4 py-2 rounded-lg bg-desa-primary text-white text-xs font-semibold hover:bg-desa-primary/90 transition-colors flex items-center gap-2 self-start sm:self-auto shadow-2xs"
            >
              <span>Daftarkan Usaha Anda</span>
              <ArrowRight className="w-3.5 h-3.5" />
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
                className="group bg-desa-surface rounded-xl overflow-hidden border border-desa-border hover:border-desa-primary/40 cursor-pointer transition-all shadow-2xs flex flex-col justify-between"
              >
                <div>
                  <div className="h-32 overflow-hidden relative bg-desa-bg">
                    <img
                      src={shop.banner}
                      alt={shop.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                    <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded bg-white/95 text-desa-primary text-[10px] font-semibold shadow-xs">
                      {shop.category}
                    </div>
                  </div>

                  <div className="p-4 space-y-2">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={shop.avatar}
                        alt={shop.owner}
                        className="w-9 h-9 rounded-lg border border-desa-border object-cover"
                      />
                      <div className="overflow-hidden">
                        <h3 className="font-heading font-semibold text-desa-primary text-sm truncate group-hover:text-desa-accent transition-colors">
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
                  <span className="text-desa-accent font-semibold flex items-center gap-1 group-hover:underline">
                    Kunjungi Toko
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Statistik Ekosistem Pasar Desa */}
      <section className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-desa-primary text-desa-light rounded-2xl p-8 sm:p-12 relative overflow-hidden shadow-sm">
          <div className="absolute inset-0 bg-lurik-stripes-light opacity-5 pointer-events-none" />
          
          <div className="relative z-10">
            <div className="text-center max-w-xl mx-auto mb-10">
              <span className="text-sm font-medium text-desa-accent">
                Dampak nyata bagi warga
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white mt-1.5">
                Statistik Ekosistem Pasar Desa
              </h2>
              <p className="text-sm text-desa-light/75 mt-2">
                Kolaborasi warga desa dan pemerintah dalam memajukan kemandirian ekonomi lokal
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 text-center">
              <div 
                className="p-5 rounded-xl bg-white/5 border border-white/10"
              >
                <Users className="w-6 h-6 text-desa-highlight mx-auto mb-2" />
                <div className="font-heading text-2xl sm:text-3xl font-bold text-white">
                  <Counter value={stats.totalUmkm} suffix="+" />
                </div>
                <p className="text-sm text-desa-light/70 mt-1 font-medium">
                  UMKM Binaan
                </p>
              </div>

              <div 
                className="p-5 rounded-xl bg-white/5 border border-white/10"
              >
                <Package className="w-6 h-6 text-desa-accent mx-auto mb-2" />
                <div className="font-heading text-2xl sm:text-3xl font-bold text-white">
                  <Counter value={stats.totalProducts} suffix="+" />
                </div>
                <p className="text-sm text-desa-light/70 mt-1 font-medium">
                  Produk Terkurasi
                </p>
              </div>

              <div 
                className="p-5 rounded-xl bg-white/5 border border-white/10"
              >
                <TrendingUp className="w-6 h-6 text-desa-highlight mx-auto mb-2" />
                <div className="font-heading text-2xl sm:text-3xl font-bold text-white">
                  <Counter value={stats.totalTransactions} />
                </div>
                <p className="text-sm text-desa-light/70 mt-1 font-medium">
                  Pesanan Terlayani
                </p>
              </div>

              <div 
                className="p-5 rounded-xl bg-white/5 border border-white/10"
              >
                <Award className="w-6 h-6 text-amber-400 mx-auto mb-2" />
                <div className="font-heading text-2xl sm:text-3xl font-bold text-white">
                  5 Sentra
                </div>
                <p className="text-sm text-desa-light/70 mt-1 font-medium">
                  Kecamatan Pengrajin
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Clean PWA Feature Spotlight */}
      <section className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="bg-white rounded-2xl border border-desa-border p-8 sm:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-8 space-y-4">
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-desa-primary">
                Akses Cepat di Layar Utama HP Anda
              </h2>

              <p className="text-sm text-desa-muted leading-relaxed max-w-2xl">
                Pasar Desa dirancang agar dapat diinstal langsung ke ponsel Anda tanpa perlu download dari Play Store atau App Store. Sangat hemat kuota, cepat dibuka, dan siap digunakan untuk belanja produk desa kapan saja.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-3.5 rounded-xl bg-desa-bg/70 space-y-1">
                  <span className="text-sm font-bold text-desa-primary">Buka di Browser</span>
                  <p className="text-sm text-desa-muted">Buka website Pasar Desa melalui Chrome atau Safari di HP Anda.</p>
                </div>
                <div className="p-3.5 rounded-xl bg-desa-bg/70 space-y-1">
                  <span className="text-sm font-bold text-desa-primary">Tambahkan ke Layar</span>
                  <p className="text-sm text-desa-muted">Ketuk menu browser dan pilih "Tambahkan ke Layar Utama".</p>
                </div>
                <div className="p-3.5 rounded-xl bg-desa-bg/70 space-y-1">
                  <span className="text-sm font-bold text-desa-primary">Siap Dipakai</span>
                  <p className="text-sm text-desa-muted">Ikon Pasar Desa langsung muncul di HP seperti aplikasi resmi.</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 bg-desa-surface rounded-xl border border-desa-border space-y-4 text-center">
              <div className="w-12 h-12 rounded-xl bg-desa-primary text-white flex items-center justify-center">
                <Smartphone className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-heading font-bold text-desa-primary text-base">Uji Coba Tampilan Mobile</h4>
                <p className="text-sm text-desa-muted mt-1">Rasakan pengalaman belanja responsif dalam simulasi PWA langsung di browser Anda.</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setCurrentView('mobile')}
                className="w-full py-2.5 px-4 rounded-lg bg-desa-highlight hover:bg-desa-highlight/90 text-white font-semibold text-sm transition-colors shadow-2xs"
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
