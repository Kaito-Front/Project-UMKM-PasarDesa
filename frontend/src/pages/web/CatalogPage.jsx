import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import ProductCard from '../../components/common/ProductCard';
import { KECAMATAN_LIST } from '../../data/mockData';
import { 
  Search, 
  SlidersHorizontal, 
  Filter, 
  RotateCcw, 
  Star, 
  Check,
  X
} from 'lucide-react';

export default function CatalogPage() {
  const { 
    products, 
    categories, 
    searchQuery, 
    setSearchQuery,
    selectedCategory, 
    setSelectedCategory,
    selectedKecamatan, 
    setSelectedKecamatan,
    priceRange, 
    setPriceRange,
    sortBy, 
    setSortBy 
  } = useApp();

  const [minRating, setMinRating] = useState(0);
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (p.isHidden) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = p.name.toLowerCase().includes(q);
        const matchShop = p.shopName.toLowerCase().includes(q);
        const matchDesc = p.description.toLowerCase().includes(q);
        if (!matchName && !matchShop && !matchDesc) return false;
      }
      if (selectedCategory !== 'semua' && p.category !== selectedCategory) {
        return false;
      }
      if (selectedKecamatan !== 'Semua Kecamatan' && p.kecamatan !== selectedKecamatan) {
        return false;
      }
      if (p.price < priceRange[0] || p.price > priceRange[1]) {
        return false;
      }
      if (minRating > 0 && p.rating < minRating) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'termurah') return a.price - b.price;
      if (sortBy === 'termahal') return b.price - a.price;
      if (sortBy === 'terlaris') return b.sold - a.sold;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0;
    });
  }, [products, searchQuery, selectedCategory, selectedKecamatan, priceRange, minRating, sortBy]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('semua');
    setSelectedKecamatan('Semua Kecamatan');
    setPriceRange([0, 300000]);
    setMinRating(0);
    setSortBy('terbaru');
    setCurrentPage(1);
  };

  const hasActiveFilter = selectedCategory !== 'semua' || selectedKecamatan !== 'Semua Kecamatan' || searchQuery || minRating > 0 || priceRange[1] < 300000;

  return (
    <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Search & Filter Bar with Liquid Glass */}
      <div className="bg-white/75 backdrop-blur-xl rounded-2xl p-4 sm:p-5 border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-desa-accent absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Cari produk lurik, kuliner, madu, dan kerajinan..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-16 py-2.5 bg-white/60 border border-desa-border rounded-xl text-sm text-desa-text placeholder:text-desa-subtle focus:outline-none focus:border-desa-accent focus:ring-2 focus:ring-desa-accent/20 focus:bg-white transition-all shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-desa-subtle hover:text-desa-accent font-medium px-1.5 py-0.5 rounded bg-desa-bg/80"
              >
                Hapus
              </button>
            )}
          </div>

          <div className="flex items-center gap-2.5 justify-between md:justify-end">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowMobileFilter(!showMobileFilter)}
              className="lg:hidden flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-white/80 bg-white/80 backdrop-blur-md text-desa-primary text-xs font-semibold shadow-xs"
            >
              <Filter className="w-3.5 h-3.5 text-desa-accent" />
              <span>Filter {hasActiveFilter ? 'Aktif' : ''}</span>
            </motion.button>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-desa-muted font-medium hidden sm:inline">Urutkan:</span>
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-white/80 backdrop-blur-md border border-desa-border rounded-xl px-3 py-2 text-xs text-desa-primary font-semibold focus:outline-none focus:border-desa-accent cursor-pointer shadow-2xs"
              >
                <option value="terbaru">Terbaru</option>
                <option value="termurah">Harga Terendah</option>
                <option value="termahal">Harga Tertinggi</option>
                <option value="terlaris">Paling Laris</option>
                <option value="rating">Rating Tertinggi</option>
              </select>
            </div>
          </div>

        </div>

        <AnimatePresence>
          {hasActiveFilter && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex flex-wrap items-center gap-2 pt-3.5 mt-3.5 border-t border-desa-border/50 text-xs overflow-hidden"
            >
              <span className="text-desa-muted font-medium">Filter aktif:</span>
              {selectedCategory !== 'semua' && (
                <motion.span 
                  layout
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-desa-accent/10 border border-desa-accent/20 text-desa-accent font-semibold"
                >
                  {categories.find(c => c.id === selectedCategory)?.name || selectedCategory}
                  <button onClick={() => setSelectedCategory('semua')} className="hover:text-desa-primary ml-0.5"><X className="w-3 h-3" /></button>
                </motion.span>
              )}
              {selectedKecamatan !== 'Semua Kecamatan' && (
                <motion.span 
                  layout
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-desa-primary/10 border border-desa-primary/20 text-desa-primary font-semibold"
                >
                  {selectedKecamatan}
                  <button onClick={() => setSelectedKecamatan('Semua Kecamatan')} className="hover:text-desa-accent ml-0.5"><X className="w-3 h-3" /></button>
                </motion.span>
              )}
              {minRating > 0 && (
                <motion.span 
                  layout
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-desa-accent/10 border border-desa-accent/20 text-desa-accent font-semibold"
                >
                  <Star className="w-3 h-3 fill-desa-accent text-desa-accent inline mr-0.5" />
                  <span>{minRating}+ Bintang</span>
                  <button onClick={() => setMinRating(0)} className="hover:text-desa-primary ml-0.5"><X className="w-3 h-3" /></button>
                </motion.span>
              )}
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={resetFilters}
                className="text-desa-accent hover:underline flex items-center gap-1 ml-auto font-medium"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Semua</span>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-7 items-start">
        
        {/* Sidebar Filter with Liquid Glass */}
        <aside className={`lg:col-span-1 bg-white/75 backdrop-blur-xl rounded-2xl p-5 border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-6 ${showMobileFilter ? 'block' : 'hidden lg:block'}`}>
          
          <div className="flex items-center justify-between pb-3 border-b border-desa-border/50">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-desa-accent" />
              <h3 className="font-heading font-bold text-sm text-desa-primary">
                Filter Produk
              </h3>
            </div>
            {hasActiveFilter && (
              <button
                onClick={resetFilters}
                className="text-xs text-desa-muted hover:text-desa-accent transition-colors"
              >
                Reset
              </button>
            )}
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-bold text-desa-muted uppercase tracking-wider">
              Kategori
            </h4>
            <div className="space-y-1">
              {categories.map((cat) => (
                <motion.button
                  key={cat.id}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    setCurrentPage(1);
                  }}
                  className={`relative w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-all flex items-center justify-between ${
                    selectedCategory === cat.id
                      ? 'text-white font-semibold shadow-xs'
                      : 'text-desa-text hover:bg-white/80'
                  }`}
                >
                  {selectedCategory === cat.id && (
                    <motion.div
                      layoutId="catalogCategoryActivePill"
                      className="absolute inset-0 bg-desa-primary rounded-xl z-0"
                      transition={{ type: 'spring', stiffness: 500, damping: 32 }}
                    />
                  )}
                  <span className="relative z-10">{cat.name}</span>
                  <span className={`relative z-10 text-[10px] px-1.5 py-0.5 rounded-full ${
                    selectedCategory === cat.id ? 'bg-white/20 text-white' : 'bg-desa-bg text-desa-muted'
                  }`}>
                    {cat.count}
                  </span>
                </motion.button>
              ))}
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-desa-border/40">
            <h4 className="text-xs font-bold text-desa-muted uppercase tracking-wider">
              Wilayah Kecamatan
            </h4>
            <div className="space-y-1">
              {KECAMATAN_LIST.map((kecamatan) => (
                <motion.button
                  key={kecamatan}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setSelectedKecamatan(kecamatan);
                    setCurrentPage(1);
                  }}
                  className={`relative w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-all flex items-center justify-between ${
                    selectedKecamatan === kecamatan
                      ? 'text-white font-semibold shadow-xs'
                      : 'text-desa-text hover:bg-white/80'
                  }`}
                >
                  {selectedKecamatan === kecamatan && (
                    <motion.div
                      layoutId="catalogKecamatanActivePill"
                      className="absolute inset-0 bg-desa-accent rounded-xl z-0 shadow-sm"
                      transition={{ type: 'spring', stiffness: 500, damping: 32 }}
                    />
                  )}
                  <span className="relative z-10 truncate">{kecamatan}</span>
                  {selectedKecamatan === kecamatan && <Check className="relative z-10 w-3.5 h-3.5" />}
                </motion.button>
              ))}
            </div>
          </div>

          <div className="space-y-2.5 pt-2 border-t border-desa-border/40">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-desa-muted uppercase tracking-wider">
                Batas Harga
              </h4>
              <span className="text-xs font-semibold text-desa-accent">
                Maks. Rp {priceRange[1].toLocaleString('id-ID')}
              </span>
            </div>
            <input
              type="range"
              min="10000"
              max="300000"
              step="10000"
              value={priceRange[1]}
              onChange={(e) => {
                setPriceRange([priceRange[0], Number(e.target.value)]);
                setCurrentPage(1);
              }}
              className="w-full accent-desa-accent cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-desa-subtle">
              <span>Rp 10.000</span>
              <span>Rp 300.000+</span>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-desa-border/40">
            <h4 className="text-xs font-bold text-desa-muted uppercase tracking-wider">
              Rating Pembeli
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {[4, 4.5, 4.8].map((star) => (
                <motion.button
                  key={star}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setMinRating(minRating === star ? 0 : star);
                    setCurrentPage(1);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 border transition-all ${
                    minRating === star
                      ? 'bg-desa-accent text-white border-desa-accent font-semibold shadow-xs'
                      : 'bg-white/80 text-desa-text border-desa-border hover:border-desa-accent/40'
                  }`}
                >
                  <Star className="w-3 h-3 fill-current" />
                  <span>{star}+ Bintang</span>
                </motion.button>
              ))}
            </div>
          </div>

        </aside>

        {/* Product Cards Grid with Liquid Glass cards */}
        <main className="lg:col-span-3 space-y-6">
          
          <div className="flex items-center justify-between text-sm text-desa-muted">
            <span>
              Menampilkan <strong className="text-desa-primary">{filteredProducts.length}</strong> produk lokal terkurasi
            </span>
            <span className="text-xs font-medium">Halaman {currentPage} dari {totalPages}</span>
          </div>

          {paginatedProducts.length > 0 ? (
            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              <AnimatePresence mode="popLayout">
                {paginatedProducts.map((product) => (
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
          ) : (
            <div className="bg-white/75 backdrop-blur-xl rounded-2xl p-12 text-center border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-desa-accent/10 border border-desa-accent/20 flex items-center justify-center mx-auto text-desa-accent">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-bold text-base text-desa-primary">
                Tidak ada produk yang cocok
              </h3>
              <p className="text-xs text-desa-muted max-w-sm mx-auto leading-relaxed">
                Kombinasi kata kunci atau filter saat ini tidak menemukan produk. Silakan ubah filter atau klik tombol di bawah untuk melihat semua katalog.
              </p>
              <button
                onClick={resetFilters}
                className="px-5 py-2.5 rounded-xl bg-desa-primary text-white text-xs font-semibold hover:bg-forest-surface transition-all inline-flex items-center gap-2 shadow-sm"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Filter</span>
              </button>
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6">
              <motion.button
                whileTap={{ scale: 0.95 }}
                disabled={currentPage === 1}
                onClick={() => {
                  setCurrentPage(p => Math.max(1, p - 1));
                  window.scrollTo({ top: 180, behavior: 'smooth' });
                }}
                className="px-3.5 py-1.5 rounded-xl border border-desa-border bg-white/70 backdrop-blur-md text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white transition-colors shadow-2xs"
              >
                Sebelumnya
              </motion.button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                <motion.button
                  key={num}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setCurrentPage(num);
                    window.scrollTo({ top: 180, behavior: 'smooth' });
                  }}
                  className={`w-8 h-8 rounded-xl text-xs font-bold transition-all ${
                    currentPage === num
                      ? 'bg-desa-accent text-white shadow-xs'
                      : 'border border-desa-border bg-white/70 backdrop-blur-md text-desa-text hover:bg-white'
                  }`}
                >
                  {num}
                </motion.button>
              ))}

              <motion.button
                whileTap={{ scale: 0.95 }}
                disabled={currentPage === totalPages}
                onClick={() => {
                  setCurrentPage(p => Math.min(totalPages, p + 1));
                  window.scrollTo({ top: 180, behavior: 'smooth' });
                }}
                className="px-3.5 py-1.5 rounded-xl border border-desa-border bg-white/70 backdrop-blur-md text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white transition-colors shadow-2xs"
              >
                Selanjutnya
              </motion.button>
            </div>
          )}

        </main>

      </div>

    </div>
  );
}
