import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import ProductCard from '../../components/common/ProductCard';
import LurikDivider from '../../components/common/LurikDivider';
import { KECAMATAN_LIST } from '../../data/mockData';
import { 
  Search, 
  SlidersHorizontal, 
  Filter, 
  RotateCcw, 
  Star, 
  ChevronDown, 
  Grid3X3,
  Check
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
  const itemsPerPage = 6;
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

  return (
    <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      
      <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-desa-primary/15">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          
          
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-desa-accent absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Cari produk lurik, kuliner, dan kerajinan Sumedang..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-11 pr-4 py-3 bg-desa-bg/50 border border-desa-primary/20 rounded-xl text-sm text-desa-text placeholder:text-desa-text/50 focus:outline-none focus:border-desa-primary focus:bg-white transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-desa-text/40 hover:text-desa-text"
              >
                Hapus
              </button>
            )}
          </div>

          
          <div className="flex items-center gap-3 justify-between md:justify-end">
            
            <button
              onClick={() => setShowMobileFilter(!showMobileFilter)}
              className="lg:hidden flex items-center gap-2 px-4 py-2.5 rounded-xl border border-desa-primary/25 bg-desa-bg text-desa-primary text-xs font-semibold"
            >
              <Filter className="w-4 h-4 text-desa-accent" />
              <span>Filter ({selectedCategory !== 'semua' ? '1+' : '0'})</span>
            </button>

            
            <div className="flex items-center gap-2 text-xs">
              <span className="text-desa-text/60 font-medium hidden sm:inline">Urutkan:</span>
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-desa-bg/70 border border-desa-primary/25 rounded-xl px-3 py-2.5 text-xs text-desa-primary font-semibold focus:outline-none focus:border-desa-primary cursor-pointer"
              >
                <option value="terbaru">Terbaru</option>
                <option value="termurah">Harga: Termurah</option>
                <option value="termahal">Harga: Termahal</option>
                <option value="terlaris">Paling Laris</option>
                <option value="rating">Rating Tertinggi</option>
              </select>
            </div>
          </div>

        </div>

        
        {(selectedCategory !== 'semua' || selectedKecamatan !== 'Semua Kecamatan' || searchQuery || minRating > 0) && (
          <div className="flex flex-wrap items-center gap-2 pt-4 mt-4 border-t border-desa-primary/10 text-xs">
            <span className="text-desa-text/60 font-medium">Filter aktif:</span>
            {selectedCategory !== 'semua' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-desa-accent/15 text-desa-accent font-medium">
                Kategori: {categories.find(c => c.id === selectedCategory)?.name || selectedCategory}
                <button onClick={() => setSelectedCategory('semua')}>×</button>
              </span>
            )}
            {selectedKecamatan !== 'Semua Kecamatan' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-desa-primary/10 text-desa-primary font-medium">
                Kecamatan: {selectedKecamatan}
                <button onClick={() => setSelectedKecamatan('Semua Kecamatan')}>×</button>
              </span>
            )}
            {minRating > 0 && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 text-amber-700 font-medium">
                <Star className="w-3 h-3 fill-amber-500 text-amber-500 inline mr-0.5" />
                <span>{minRating}+ Bintang</span>
                <button onClick={() => setMinRating(0)}>×</button>
              </span>
            )}
            <button
              onClick={resetFilters}
              className="text-desa-accent hover:underline flex items-center gap-1 ml-auto font-medium"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Semua</span>
            </button>
          </div>
        )}
      </div>

      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        
        
        <aside className={`lg:col-span-1 bg-white rounded-2xl p-6 border border-desa-primary/15 shadow-sm space-y-6 ${showMobileFilter ? 'block' : 'hidden lg:block'}`}>
          
          <div className="flex items-center justify-between pb-4 border-b border-desa-primary/15">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-desa-accent" />
              <h3 className="font-heading font-bold text-base text-desa-primary">
                Filter Katalog
              </h3>
            </div>
            <button
              onClick={resetFilters}
              className="text-[11px] text-desa-text/60 hover:text-desa-accent transition-colors"
            >
              Reset
            </button>
          </div>

          
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-desa-primary">
              Kategori Produk
            </h4>
            <div className="space-y-1.5">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    setCurrentPage(1);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-all flex items-center justify-between ${
                    selectedCategory === cat.id
                      ? 'bg-desa-primary text-desa-light font-semibold shadow-sm'
                      : 'text-desa-text/80 hover:bg-desa-bg'
                  }`}
                >
                  <span>{cat.name}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                    selectedCategory === cat.id ? 'bg-white/20 text-white' : 'bg-desa-primary/5 text-desa-text/60'
                  }`}>
                    {cat.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <LurikDivider height="1px" />

          
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-desa-primary">
              Kecamatan / Lokasi Sentra
            </h4>
            <div className="space-y-1.5">
              {KECAMATAN_LIST.map((kecamatan) => (
                <button
                  key={kecamatan}
                  onClick={() => {
                    setSelectedKecamatan(kecamatan);
                    setCurrentPage(1);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-all flex items-center justify-between ${
                    selectedKecamatan === kecamatan
                      ? 'bg-desa-accent text-white font-semibold shadow-sm'
                      : 'text-desa-text/80 hover:bg-desa-bg'
                  }`}
                >
                  <span className="truncate">{kecamatan}</span>
                  {selectedKecamatan === kecamatan && <Check className="w-3.5 h-3.5" />}
                </button>
              ))}
            </div>
          </div>

          <LurikDivider height="1px" />

          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-desa-primary">
                Rentang Harga
              </h4>
              <span className="text-[11px] font-semibold text-desa-accent">
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
            <div className="flex justify-between text-[11px] text-desa-text/60">
              <span>Rp 10.000</span>
              <span>Rp 300.000+</span>
            </div>
          </div>

          <LurikDivider height="1px" />

          
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-desa-primary">
              Rating Pembeli
            </h4>
            <div className="flex flex-wrap gap-2">
              {[4, 4.5, 4.8].map((star) => (
                <button
                  key={star}
                  onClick={() => {
                    setMinRating(minRating === star ? 0 : star);
                    setCurrentPage(1);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 border transition-all ${
                    minRating === star
                      ? 'bg-amber-500 text-white border-amber-600'
                      : 'bg-white text-desa-text/80 border-desa-primary/20 hover:border-amber-400'
                  }`}
                >
                  <Star className="w-3 h-3 fill-current" />
                  <span>{star}+ Bintang</span>
                </button>
              ))}
            </div>
          </div>

        </aside>

        
        <main className="lg:col-span-3 space-y-6">
          
          
          <div className="flex items-center justify-between text-xs text-desa-text/70">
            <span>
              Menampilkan <strong>{filteredProducts.length}</strong> produk lokal desa
            </span>
            <span className="text-[11px]">Halaman {currentPage} dari {totalPages}</span>
          </div>

          
          {paginatedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {paginatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-12 text-center border border-desa-primary/15 space-y-4">
              <div className="w-16 h-16 rounded-full bg-desa-bg flex items-center justify-center mx-auto text-desa-accent">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="font-heading font-bold text-lg text-desa-primary">
                Produk Tidak Ditemukan
              </h3>
              <p className="text-xs sm:text-sm text-desa-text/60 max-w-md mx-auto">
                Maaf, tidak ada produk yang cocok dengan kombinasi filter atau kata kunci Anda. 
                Coba sesuaikan pencarian atau klik tombol di bawah untuk mereset.
              </p>
              <button
                onClick={resetFilters}
                className="px-5 py-2.5 rounded-xl bg-desa-primary text-desa-light text-xs font-semibold hover:bg-desa-primary/90 transition-all inline-flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset Semua Filter</span>
              </button>
            </div>
          )}

          
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                className="px-4 py-2 rounded-xl border border-desa-primary/20 text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-desa-primary hover:text-desa-light transition-all"
              >
                Sebelumnya
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                <button
                  key={num}
                  onClick={() => setCurrentPage(num)}
                  className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${
                    currentPage === num
                      ? 'bg-desa-primary text-desa-light shadow'
                      : 'border border-desa-primary/20 text-desa-text hover:bg-desa-bg'
                  }`}
                >
                  {num}
                </button>
              ))}

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                className="px-4 py-2 rounded-xl border border-desa-primary/20 text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-desa-primary hover:text-desa-light transition-all"
              >
                Selanjutnya
              </button>
            </div>
          )}

        </main>

      </div>

    </div>
  );
}

