import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { Star, ShoppingCart, ShoppingBag, Check } from 'lucide-react';

export default function ProductCard({ product, showQuickOrder = true, isCompact = false }) {
  const { viewProduct, addToCart, openDirectCheckout, viewShop } = useApp();
  const [justAdded, setJustAdded] = useState(false);

  const discountPercent = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      className="group bg-white rounded-2xl overflow-hidden border border-[#E8E0D5] hover:border-desa-accent hover:shadow-[0_14px_35px_rgba(22,51,36,0.1)] transition-all duration-300 flex flex-col justify-between shadow-[0_4px_16px_rgba(22,51,36,0.05)]"
    >
      <div>
        {/* Product Image Container */}
        <div 
          onClick={() => viewProduct(product.id)}
          className="relative aspect-square overflow-hidden bg-desa-surface/50 cursor-pointer"
        >
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
            loading="lazy"
          />

          {/* Badges */}
          <div className="absolute top-2.5 left-2.5 z-10 flex gap-1">
            {discountPercent ? (
              <span className="text-[11px] font-black px-2.5 py-0.5 rounded-full bg-desa-accent text-white shadow-xs">
                Hemat {discountPercent}%
              </span>
            ) : product.isFeatured ? (
              <span className="text-[11px] font-black px-2.5 py-0.5 rounded-full bg-[#163324] text-white shadow-xs tracking-wide">
                Pilihan Desa
              </span>
            ) : null}
          </div>
        </div>

        {/* Product Details - All in Bold Forest Green */}
        <div className={isCompact ? 'p-3' : 'p-4'}>
          
          {/* Shop & Region */}
          <div className="flex items-center justify-between text-xs mb-1.5 gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                viewShop(product.shopId);
              }}
              className="text-xs font-bold text-[#163324] hover:text-desa-accent truncate transition-colors text-left"
            >
              {product.shopName}
            </button>
            <span className="shrink-0 text-xs font-bold text-[#163324]">
              {product.kecamatan.replace(/^Kecamatan /, '')}
            </span>
          </div>

          {/* Title - Bold Forest Green, High Contrast */}
          <h3 
            onClick={() => viewProduct(product.id)}
            className="font-heading font-black text-base text-[#163324] line-clamp-2 leading-snug cursor-pointer group-hover:text-desa-accent transition-colors mb-2.5 min-h-[2.6rem]"
            title={product.name}
          >
            {product.name}
          </h3>

          {/* Rating & Sold Metadata - Forest Green & Crisp Accent */}
          <div className="flex items-center gap-2 mb-3">
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-[#E83D23]/10 border border-[#E83D23]/25 text-[#E83D23] font-black text-xs">
              <Star className="w-3.5 h-3.5 fill-[#E83D23] text-[#E83D23]" />
              <span className="text-[#163324] font-black">{product.rating.toFixed(1)}</span>
            </div>
            <span className="text-[#163324] text-xs font-black">•</span>
            <span className="text-xs font-bold text-[#163324]">{product.sold} terjual</span>
          </div>

          {/* Pricing - Solid Forest Green */}
          <div className="flex items-baseline gap-2 pt-1 border-t border-[#E8E0D5]">
            <span className="font-heading font-black text-lg text-[#163324]">
              Rp {product.price.toLocaleString('id-ID')}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs font-bold text-[#163324]/75 line-through">
                Rp {product.originalPrice.toLocaleString('id-ID')}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="px-3.5 sm:px-4 pb-4 pt-1 flex items-center gap-2">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleAddToCart}
          className={`flex-1 py-2.5 px-2.5 sm:px-3 rounded-xl border-2 text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-2xs min-h-[42px] ${
            justAdded 
              ? 'bg-[#163324] text-white border-[#163324]' 
              : 'border-[#163324] bg-white text-[#163324] hover:bg-[#163324] hover:text-white'
          }`}
          title="Tambah ke Keranjang"
        >
          {justAdded ? (
            <span className="flex items-center gap-1 text-white font-bold">
              <Check className="w-3.5 h-3.5 text-white shrink-0" />
              <span className="truncate">Masuk Keranjang</span>
            </span>
          ) : (
            <span className="flex items-center gap-1.5 font-bold text-[#163324] hover:text-white">
              <ShoppingCart className="w-3.5 h-3.5 text-inherit shrink-0" />
              <span className="truncate">+ Keranjang</span>
            </span>
          )}
        </motion.button>

        {showQuickOrder && (
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={() => openDirectCheckout(product, 1)}
            className="py-2.5 px-3.5 sm:px-4 rounded-xl bg-desa-accent hover:bg-desa-highlight text-white text-xs font-bold transition-colors flex items-center justify-center gap-1 shadow-2xs shrink-0 min-h-[42px]"
            title="Beli Langsung"
          >
            <ShoppingBag className="w-3.5 h-3.5 shrink-0" />
            <span>Beli</span>
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}
