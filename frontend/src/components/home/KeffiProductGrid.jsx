import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { 
  Star, 
  ShoppingBag, 
  Eye, 
  Sparkles, 
  ArrowUpRight 
} from 'lucide-react';

// Numeric counter animation component
function RatingCounter({ target = 4.9 }) {
  const [val, setVal] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1200;
    const stepTime = 16;
    const steps = duration / stepTime;
    const increment = target / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setVal(target);
        clearInterval(timer);
      } else {
        setVal(start);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [target]);

  return <span>{val.toFixed(1)}</span>;
}

// 60-30-10 High Contrast Card color themes: Oatmilk Solid/Glass (60%), Forest Green Solid (30%), Tomato Red (10%)
const cardThemes = [
  { type: 'glass', bg: 'bg-white/95 backdrop-blur-md text-[#163324] border border-[#E8E0D5] shadow-[0_10px_30px_rgba(22,51,36,0.08)] hover:border-desa-accent', badgeBg: 'bg-desa-surface text-[#163324] border border-[#E8E0D5]' },
  { type: 'dark', bg: 'bg-[#163324] text-[#FBF8F3] border border-[#2E5E45] shadow-[0_10px_30px_rgba(0,0,0,0.18)] hover:border-white/40', badgeBg: 'bg-desa-accent text-white' },
  { type: 'glass', bg: 'bg-white/95 backdrop-blur-md text-[#163324] border border-[#E8E0D5] shadow-[0_10px_30px_rgba(22,51,36,0.08)] hover:border-desa-accent', badgeBg: 'bg-desa-surface text-[#163324] border border-[#E8E0D5]' },
  { type: 'accent', bg: 'bg-desa-accent text-white border border-[#FF6B55] shadow-[0_12px_35px_rgba(232,61,35,0.28)] hover:border-white/50', badgeBg: 'bg-[#163324] text-white', isSpecial: true },
  { type: 'glass', bg: 'bg-white/95 backdrop-blur-md text-[#163324] border border-[#E8E0D5] shadow-[0_10px_30px_rgba(22,51,36,0.08)] hover:border-desa-accent', badgeBg: 'bg-desa-surface text-[#163324] border border-[#E8E0D5]' },
  { type: 'dark', bg: 'bg-[#163324] text-[#FBF8F3] border border-[#2E5E45] shadow-[0_10px_30px_rgba(0,0,0,0.18)] hover:border-white/40', badgeBg: 'bg-desa-accent text-white' },
  { type: 'glass', bg: 'bg-white/95 backdrop-blur-md text-[#163324] border border-[#E8E0D5] shadow-[0_10px_30px_rgba(22,51,36,0.08)] hover:border-desa-accent', badgeBg: 'bg-desa-surface text-[#163324] border border-[#E8E0D5]' },
  { type: 'glass', bg: 'bg-white/95 backdrop-blur-md text-[#163324] border border-[#E8E0D5] shadow-[0_10px_30px_rgba(22,51,36,0.08)] hover:border-desa-accent', badgeBg: 'bg-desa-surface text-[#163324] border border-[#E8E0D5]' },
];

function getInitials(name) {
  if (!name) return 'PD';
  const parts = name.split(' ');
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

// Individual Keffi-Style High-Contrast Card (No Blurry Text)
function ProductKeffiCard({ product, themeIndex, onBuy, onDetail, onViewShop }) {
  const theme = cardThemes[themeIndex % cardThemes.length];
  const isDark = theme.type === 'dark';
  const isAccent = theme.type === 'accent';

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.015 }}
      transition={{ duration: 0.25 }}
      className={`w-[275px] xs:w-[315px] sm:w-[370px] shrink-0 rounded-3xl p-4 sm:p-6 flex flex-col justify-between select-none relative group transition-all ${theme.bg}`}
    >
      {/* Highlight Tag for Special Accent Card */}
      {isAccent && (
        <div className="absolute -top-3 right-5 px-3 py-0.5 rounded-full bg-[#163324] text-white text-[10px] font-bold tracking-wider uppercase flex items-center gap-1 shadow-xs border border-white/20">
          <Sparkles className="w-3 h-3 text-desa-accent" />
          <span>Pilihan Kurator</span>
        </div>
      )}

      {/* Card Top: 5 Stars + Category Chip */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-0.5">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              className={`w-3.5 h-3.5 ${
                isAccent 
                  ? 'fill-white text-white' 
                  : 'fill-desa-accent text-desa-accent'
              }`} 
            />
          ))}
          <span className={`text-xs font-black ml-1.5 ${isDark ? 'text-white' : isAccent ? 'text-white' : 'text-[#163324]'}`}>
            {product.rating || '4.9'}
          </span>
        </div>

        <span 
          className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full ${
            isDark 
              ? 'bg-white/15 text-white font-bold border border-white/25' 
              : isAccent 
              ? 'bg-black/25 text-white font-bold border border-white/25' 
              : 'bg-[#163324]/10 text-[#163324] font-bold border border-[#163324]/20'
          }`}
        >
          {product.categoryName || 'Produk Desa'}
        </span>
      </div>

      {/* Card Middle: Product Name & Authentic Quote Description */}
      <div className="space-y-2 mb-5 flex-1">
        <h3 
          onClick={() => onDetail(product.id)}
          className={`font-heading font-extrabold text-base sm:text-lg leading-snug cursor-pointer transition-colors line-clamp-2 ${
            isDark 
              ? 'hover:text-desa-accent text-white' 
              : isAccent 
              ? 'text-white hover:opacity-90' 
              : 'text-[#163324] hover:text-desa-accent'
          }`}
        >
          “{product.name}”
        </h3>
        
        <p 
          className={`text-xs leading-relaxed line-clamp-3 ${
            isDark 
              ? 'text-[#FBF8F3] font-normal' 
              : isAccent 
              ? 'text-white/95 font-medium' 
              : 'text-[#163324]/85 font-medium'
          }`}
        >
          {product.description}
        </p>
      </div>

      {/* Card Bottom: Artisan Badge, Price Tag & Quick Action Buttons */}
      <div className={`pt-3.5 border-t space-y-3 ${
        isDark 
          ? 'border-white/15' 
          : isAccent 
          ? 'border-white/20' 
          : 'border-[#E8E0D5]'
      }`}>
        <div className="flex items-center justify-between gap-2">
          <div 
            onClick={() => onViewShop(product.shopId)}
            className="flex items-center gap-2 cursor-pointer group/shop min-w-0"
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs ${theme.badgeBg}`}>
              {getInitials(product.shopName)}
            </div>
            <div className="min-w-0">
              <p className={`text-xs font-bold truncate ${
                isDark ? 'text-white' : isAccent ? 'text-white' : 'text-[#163324]'
              }`}>
                {product.shopName}
              </p>
              <p className={`text-[11px] font-semibold truncate ${
                isDark ? 'text-[#F4EFE6]/90' : isAccent ? 'text-white/90' : 'text-[#4A6B59]'
              }`}>
                {product.kecamatan ? product.kecamatan.replace('Kecamatan ', '') : 'Sumedang'}
              </p>
            </div>
          </div>

          <div className="text-right shrink-0">
            <span className={`text-[10px] block uppercase font-mono font-bold tracking-wider ${
              isDark ? 'text-[#E83D23]' : isAccent ? 'text-white/80' : 'text-[#4A6B59]'
            }`}>
              Harga
            </span>
            <span className={`font-heading font-black text-sm sm:text-base ${
              isDark ? 'text-white' : isAccent ? 'text-white' : 'text-[#163324]'
            }`}>
              Rp {Number(product.price || 0).toLocaleString('id-ID')}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-0.5">
          <button
            onClick={() => onBuy(product, 1)}
            className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-2xs min-h-[42px] ${
              isDark
                ? 'bg-desa-accent hover:bg-desa-highlight text-white'
                : isAccent
                ? 'bg-[#163324] hover:bg-[#0E2117] text-white'
                : 'bg-desa-accent hover:bg-desa-highlight text-white'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Beli</span>
          </button>

          <button
            onClick={() => onDetail(product.id)}
            className={`p-2.5 rounded-xl border transition-colors flex items-center justify-center min-w-[42px] min-h-[42px] ${
              isDark
                ? 'border-white/20 text-white hover:bg-white/10'
                : isAccent
                ? 'border-white/30 text-white hover:bg-white/15'
                : 'border-[#163324]/30 text-[#163324] hover:bg-white'
            }`}
            title="Lihat Detail Produk"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function KeffiProductGrid() {
  const { products, viewProduct, openDirectCheckout, viewShop, setWebPage } = useApp();
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start']
  });

  // Smooth parallax translation centered around the viewport
  const xRow1 = useTransform(scrollYProgress, [0, 1], ['120px', '-280px']);
  const xRow2 = useTransform(scrollYProgress, [0, 1], ['-280px', '120px']);

  const handleDetail = (id) => {
    viewProduct(id);
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  };

  // Provide a rich continuous sequence of cards so the track is centered and never has empty gaps
  const baseProducts = products && products.length > 0 ? products : [];
  const row1Products = [...baseProducts, ...baseProducts, ...baseProducts].slice(0, 12);
  const row2Products = [...baseProducts.slice(2), ...baseProducts, ...baseProducts, ...baseProducts].slice(0, 12);

  return (
    <section ref={sectionRef} className="relative py-6 sm:py-10 overflow-hidden">
      
      {/* 1. Header Section: Title & High-Contrast Authentic Keffi Rating */}
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-8">
        <div>
          <span className="text-xs uppercase tracking-widest text-desa-accent font-bold flex items-center gap-1 mb-2 font-heading">
            <span>Kurasi Asli BUMDes Sumedang</span>
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black text-[#163324] tracking-tight">
            <span className="font-script text-4xl sm:text-5xl lg:text-6xl text-desa-accent font-normal mr-0.5 inline-block align-baseline">K</span>arya Sentra Terpilih
          </h2>
          <p className="text-sm font-medium text-[#4A6B59] mt-2 max-w-xl leading-relaxed">
            Jelajahi karya anyaman, kain tenun, olahan madu, dan rempah binaan pengrajin desa secara langsung.
          </p>
        </div>

        {/* Keffi Studio High-Contrast Rating Block */}
        <motion.div 
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center gap-4 self-start md:self-end pb-1 select-none"
        >
          {/* Big 4.9 Number with Counter Animation - Ultra Crisp Forest Green */}
          <span className="font-heading text-6xl sm:text-7xl font-black text-[#163324] tracking-tighter leading-none">
            <RatingCounter target={4.9} />
          </span>

          {/* Stars & Average label side-by-side */}
          <div className="flex flex-col justify-center">
            {/* 5 Sequentially Animated Stars in Tomato Red */}
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, opacity: 0, rotate: -25 }}
                  whileInView={{ scale: 1, opacity: 1, rotate: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    type: "spring",
                    stiffness: 420,
                    damping: 16,
                    delay: 0.2 + i * 0.08
                  }}
                >
                  <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-[#E83D23] text-[#E83D23] drop-shadow-[0_2px_6px_rgba(232,61,35,0.4)]" />
                </motion.div>
              ))}
            </div>

            {/* Subtitle Aligned with Stars - Crisp & Readable */}
            <motion.span 
              initial={{ opacity: 0, x: -6 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0.65 }}
              className="text-xs text-[#163324] font-bold tracking-tight whitespace-nowrap mt-1.5"
            >
              Rating 4.9 • 40+ Pengrajin BUMDes
            </motion.span>
          </div>
        </motion.div>
      </div>

      {/* 2. Dual-Track Scroll Parallax Ribbons (Centered across screen) */}
      <div className="mt-8 space-y-4 sm:space-y-5 overflow-hidden w-full">
        
        {/* Row 1: Gliding towards LEFT on scroll */}
        <div className="flex justify-center w-full overflow-hidden">
          <motion.div 
            style={{ x: xRow1 }}
            className="flex gap-4 sm:gap-5 shrink-0 will-change-transform cursor-grab active:cursor-grabbing"
          >
            {row1Products.map((product, idx) => (
              <ProductKeffiCard
                key={`r1-${product.id}-${idx}`}
                product={product}
                themeIndex={idx}
                onBuy={openDirectCheckout}
                onDetail={handleDetail}
                onViewShop={viewShop}
              />
            ))}
          </motion.div>
        </div>

        {/* Row 2: Gliding towards RIGHT on scroll */}
        <div className="flex justify-center w-full overflow-hidden">
          <motion.div 
            style={{ x: xRow2 }}
            className="flex gap-4 sm:gap-5 shrink-0 will-change-transform cursor-grab active:cursor-grabbing"
          >
            {row2Products.map((product, idx) => (
              <ProductKeffiCard
                key={`r2-${product.id}-${idx}`}
                product={product}
                themeIndex={idx + 4}
                onBuy={openDirectCheckout}
                onDetail={handleDetail}
                onViewShop={viewShop}
              />
            ))}
          </motion.div>
        </div>

      </div>

      {/* View All Curated Products Button */}
      <div className="mt-10 text-center">
        <button
          onClick={() => {
            setWebPage('catalog');
            window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
          }}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#163324] hover:bg-[#0E2117] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all group"
        >
          <span>Eksplorasi Semua 48+ Produk UMKM Desa</span>
          <ArrowUpRight className="w-4 h-4 text-desa-accent transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </button>
      </div>

    </section>
  );
}
