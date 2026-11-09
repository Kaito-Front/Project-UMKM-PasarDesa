import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Star, ShoppingBag, Eye, ArrowUpRight, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';

// Smooth numeric ease-out counter for the 4.9 rating
function RatingCounter({ target = 4.9 }) {
  const [val, setVal] = React.useState(3.5);
  const [hasStarted, setHasStarted] = React.useState(false);

  return (
    <motion.span
      viewport={{ once: true }}
      whileInView={() => {
        if (hasStarted) return {};
        setHasStarted(true);
        const start = 3.5;
        const duration = 1200;
        const startTime = performance.now();

        const tick = (now) => {
          const elapsed = now - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const ease = 1 - Math.pow(1 - progress, 3);
          const current = start + (target - start) * ease;
          setVal(current);
          if (progress < 1) {
            requestAnimationFrame(tick);
          } else {
            setVal(target);
          }
        };
        requestAnimationFrame(tick);
        return {};
      }}
    >
      {val.toFixed(1)}
    </motion.span>
  );
}

// 60-30-10 Card color themes: Sage Mist (Light), Deep Forest (Dark), Sunbeam Yellow (Accent)
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

function getInitials(name) {
  if (!name) return 'PD';
  const parts = name.split(' ');
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

// Individual Keffi-Style Product Card
function ProductKeffiCard({ product, themeIndex, onBuy, onDetail, onViewShop }) {
  const theme = cardThemes[themeIndex % cardThemes.length];
  const isDark = theme.type === 'dark';
  const isAccent = theme.type === 'accent';

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.015 }}
      transition={{ duration: 0.25 }}
      className={`w-[310px] sm:w-[370px] shrink-0 rounded-3xl p-5 sm:p-6 flex flex-col justify-between border select-none relative group ${theme.bg}`}
    >
      {/* Highlight Tag for Special Accent Card */}
      {isAccent && (
        <div className="absolute -top-3 right-5 px-3 py-0.5 rounded-full bg-desa-primary text-white text-[10px] font-bold tracking-wider uppercase flex items-center gap-1 shadow-xs">
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
                isDark 
                  ? 'fill-[#7C3AED] text-[#7C3AED]' 
                  : isAccent 
                  ? 'fill-desa-primary text-desa-primary' 
                  : 'fill-[#7C3AED] text-[#7C3AED]'
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
      <div className="space-y-1.5 mb-5 flex-1">
        <h3 
          onClick={() => onDetail(product.id)}
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
      <div className={`pt-3.5 border-t space-y-3 ${
        isDark 
          ? 'border-white/10' 
          : isAccent 
          ? 'border-desa-primary/15' 
          : 'border-desa-border/60'
      }`}>
        <div className="flex items-center justify-between gap-2">
          <div 
            onClick={() => onViewShop(product.shopId)}
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

          <div className="text-right shrink-0">
            <span className={`text-[9px] block uppercase font-mono ${
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

        <div className="flex items-center gap-2 pt-0.5">
          <button
            onClick={() => onBuy(product, 1)}
            className={`flex-1 py-1.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-2xs ${
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
            onClick={() => onDetail(product.id)}
            className={`p-1.5 rounded-xl border transition-colors flex items-center justify-center ${
              isDark
                ? 'border-white/20 text-white hover:bg-white/10'
                : isAccent
                ? 'border-desa-primary/30 text-desa-primary hover:bg-desa-primary/10'
                : 'border-desa-border text-desa-primary hover:bg-desa-surface'
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
  const { products, viewProduct, viewShop, openDirectCheckout, setWebPage } = useApp();
  const sectionRef = useRef(null);

  // Scroll Progress linked to the entire section for horizontal parallax
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  // Row 1 glides towards LEFT as you scroll down
  const xRow1 = useTransform(scrollYProgress, [0, 1], ["2%", "-22%"]);

  // Row 2 glides towards RIGHT as you scroll down
  const xRow2 = useTransform(scrollYProgress, [0, 1], ["-22%", "2%"]);

  // Distribute products into two continuous horizontal ribbons
  const allProducts = products && products.length > 0 ? products : [];
  const row1Products = allProducts.slice(0, 6);
  const row2Products = allProducts.length >= 12 
    ? allProducts.slice(6, 12) 
    : [...allProducts.slice(3), ...allProducts.slice(0, 3)].slice(0, 6);

  const handleDetail = (id) => {
    viewProduct(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section ref={sectionRef} className="w-full overflow-hidden py-4">
      
      {/* 1. Keffi Signature Editorial Header */}
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-desa-border/60">
        <div className="space-y-1">
          <p className="text-2xl sm:text-3xl lg:text-4xl font-light text-desa-muted tracking-tight">
            Terkurasi dari
          </p>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-heading text-desa-primary tracking-tight">
            40+ Pengrajin Desa
          </h2>
        </div>

        {/* Keffi Studio Authentic Unboxed Rating (Matching Video Reference) */}
        <motion.div 
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center gap-3.5 self-start md:self-end pb-1 select-none"
        >
          {/* Big 4.9 Number with Counter Animation */}
          <span className="font-heading text-6xl sm:text-7xl font-bold text-desa-primary tracking-tighter leading-none">
            <RatingCounter target={4.9} />
          </span>

          {/* Stars & Average label side-by-side */}
          <div className="flex flex-col justify-center">
            {/* 5 Sequentially Animated Stars in Royal Violet */}
            <div className="flex items-center gap-0.5">
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
                  <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-[#5B21B6] text-[#5B21B6] drop-shadow-[0_1px_3px_rgba(91,33,182,0.3)]" />
                </motion.div>
              ))}
            </div>

            {/* Subtitle Aligned with Stars */}
            <motion.span 
              initial={{ opacity: 0, x: -6 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0.65 }}
              className="text-xs text-desa-muted font-normal tracking-tight whitespace-nowrap mt-1"
            >
              Average across 40+ artisans
            </motion.span>
          </div>
        </motion.div>
      </div>

      {/* 2. Dual-Track Scroll Parallax Ribbons (Row 1 Left <-> Row 2 Right) */}
      <div className="mt-8 space-y-4 sm:space-y-5 overflow-hidden">
        
        {/* Row 1: Gliding towards LEFT on scroll */}
        <motion.div 
          style={{ x: xRow1 }}
          className="flex gap-4 sm:gap-5 will-change-transform pl-4 sm:pl-8 cursor-grab active:cursor-grabbing"
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

        {/* Row 2: Gliding towards RIGHT on scroll */}
        <motion.div 
          style={{ x: xRow2 }}
          className="flex gap-4 sm:gap-5 will-change-transform pl-4 sm:pl-8 cursor-grab active:cursor-grabbing"
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

      {/* View All Curated Products Button */}
      <div className="mt-10 text-center">
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
