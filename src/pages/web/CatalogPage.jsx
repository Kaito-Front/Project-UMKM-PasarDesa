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
      
      {/* Search and Sort Header */}
      <div className="bg-white rounded-xl p-4 sm:p-5 border border-desa-border shadow-xs">
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
              className="w-full pl-10 pr-16 py-2.5 bg-desa-bg/50 border border-desa-border rounded-lg text-sm text-desa-text placeholder:text-desa-subtle focus:outline-none focus:border-desa-primary focus:bg-white transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-desa-subtle hover:text-desa-text font-medium"
              >
                Hapus
              </button>
            )}
          </div>

          <div className="flex items-center gap-2.5 justify-between md:justify-end">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowMobileFilter(!showMobileFilter)}
              className="lg:hidden flex items-center gap-1.5 px-3 py-2 rounded-lg border border-desa-border bg-desa-bg text-desa-primary text-xs font-semibold"
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
                className="bg-desa-bg/70 border border-desa-border rounded-lg px-3 py-2 text-xs text-desa-primary font-semibold focus:outline-none focus:border-desa-primary cursor-pointer"
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

        {/* Active Filter Chips */}
        <AnimatePresence>
          {hasActiveFilter && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex flex-wrap items-center gap-2 pt-3.5 mt-3.5 border-t border-desa-border text-xs overflow-hidden"
            >
              <span className="text-desa-muted font-medium">Filter aktif:</span>
              {selectedCategory !== 'semua' && (
                <motion.span 
                  layout
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-desa-accent/10 text-desa-accent font-medium"
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
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-desa-primary/10 text-desa-primary font-medium"
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
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-amber-500/10 text-amber-700 font-medium"
                >
                  <Star className="w-3 h-3 fill-amber-500 text-amber-500 inline mr-0.5" />
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

      {/* Main Grid & Sidebar Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-7 items-start">
        
        {/* Left Filter Sidebar */}
        <aside className={`lg:col-span-1 bg-white rounded-xl p-5 border border-desa-border shadow-xs space-y-6 ${showMobileFilter ? 'block' : 'hidden lg:block'}`}>
          
          <div className="flex items-center justify-between pb-3">
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

          {/* Category Filter */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-desa-muted">
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
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                    selectedCategory === cat.id
                      ? 'bg-desa-primary text-white font-semibold'
                      : 'text-desa-text hover:bg-desa-bg'
                  }`}
                >
                  <span>{cat.name}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded ${
                    selectedCategory === cat.id ? 'bg-white/20 text-white' : 'text-desa-subtle'
                  }`}>
                    {cat.count}
                  </span>
                </motion.button>
              ))}
            </div>
          </div>

          <div className="h-3" />

          {/* Region Filter */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-desa-muted">
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
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                    selectedKecamatan === kecamatan
                      ? 'bg-desa-accent text-white font-semibold'
                      : 'text-desa-text hover:bg-desa-bg'
                  }`}
                >
                  <span className="truncate">{kecamatan}</span>
                  {selectedKecamatan === kecamatan && <Check className="w-3.5 h-3.5" />}
                </motion.button>
              ))}
            </div>
          </div>

          <div className="h-3" />

          {/* Price Range */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-desa-muted">
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

          <div className="h-3" />

          {/* Minimum Rating */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-desa-muted">
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
                  className={`px-2.5 py-1 rounded-md text-xs font-medium flex items-center gap-1 border transition-colors ${
                    minRating === star
                      ? 'bg-amber-500 text-white border-amber-600 font-semibold'
                      : 'bg-white text-desa-text border-desa-border hover:border-amber-400'
                  }`}
                >
                  <Star className="w-3 h-3 fill-current" />
                  <span>{star}+ Bintang</span>
                </motion.button>
              ))}
            </div>
          </div>

        </aside>

        {/* Right Product Grid with Spring Motion */}
        <main className="lg:col-span-3 space-y-6">
          
          <div className="flex items-center justify-between text-sm text-desa-muted">
            <span>
              Menampilkan <strong>{filteredProducts.length}</strong> produk lokal terkurasi
            </span>
            <span>Halaman {currentPage} dari {totalPages}</span>
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
            <div className="bg-white rounded-xl p-12 text-center border border-desa-border space-y-4">
              <div className="w-12 h-12 rounded-full bg-desa-bg flex items-center justify-center mx-auto text-desa-accent">
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
                className="px-4 py-2 rounded-lg bg-desa-primary text-white text-xs font-semibold hover:bg-desa-primary/90 transition-colors inline-flex items-center gap-2 shadow-2xs"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Filter</span>
              </button>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6">
              <motion.button
                whileTap={{ scale: 0.95 }}
                disabled={currentPage === 1}
                onClick={() => {
                  setCurrentPage(p => Math.max(1, p - 1));
                  window.scrollTo({ top: 180, behavior: 'smooth' });
                }}
                className="px-3.5 py-1.5 rounded-lg border border-desa-border text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-desa-bg transition-colors"
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
                  className={`w-8 h-8 rounded-lg text-xs font-bold transition-colors ${
                    currentPage === num
                      ? 'bg-desa-primary text-white shadow-xs'
                      : 'border border-desa-border text-desa-text hover:bg-desa-bg'
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
                className="px-3.5 py-1.5 rounded-lg border border-desa-border text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-desa-bg transition-colors"
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
