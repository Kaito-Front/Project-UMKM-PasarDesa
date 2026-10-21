import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
      whileHover={{ y: -4, transition: { duration: 0.2, ease: 'easeOut' } }}
      className="group bg-white rounded-xl overflow-hidden border border-desa-border hover:border-desa-primary/40 hover:shadow-md transition-shadow duration-200 flex flex-col justify-between"
    >
      <div>
        {/* Product Image Container */}
        <div 
          onClick={() => viewProduct(product.id)}
          className="relative aspect-square overflow-hidden bg-desa-bg cursor-pointer"
        >
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
            loading="lazy"
          />

          {/* Badge */}
          <div className="absolute top-2.5 left-2.5 z-10 flex gap-1">
            {discountPercent ? (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-desa-accent text-white shadow-xs">
                Hemat {discountPercent}%
              </span>
            ) : product.isFeatured ? (
              <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-desa-primary text-desa-light shadow-xs tracking-wide">
                Pilihan Desa
              </span>
            ) : null}
          </div>
        </div>

        {/* Product Details */}
        <div className={isCompact ? 'p-3' : 'p-4'}>
          
          {/* Shop & Region */}
          <div className="flex items-center justify-between text-xs text-desa-muted mb-1.5 gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                viewShop(product.shopId);
              }}
              className="hover:text-desa-accent truncate font-medium transition-colors text-left"
            >
              {product.shopName}
            </button>
            <span className="shrink-0 text-[11px] text-desa-subtle">
              {product.kecamatan.replace(/^Kecamatan /, '')}
            </span>
          </div>

          {/* Title */}
          <h3 
            onClick={() => viewProduct(product.id)}
            className="font-medium text-desa-primary text-sm line-clamp-2 leading-snug cursor-pointer group-hover:text-desa-accent transition-colors mb-2 min-h-[2.5rem]"
            title={product.name}
          >
            {product.name}
          </h3>

          {/* Rating & Sold Metadata */}
          <div className="flex items-center gap-1.5 text-xs mb-3 text-desa-muted">
            <div className="flex items-center text-amber-600 font-medium gap-0.5">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{product.rating.toFixed(1)}</span>
            </div>
            <span className="text-desa-subtle">•</span>
            <span className="text-[11px]">{product.sold} terjual</span>
          </div>

          {/* Pricing */}
          <div className="flex items-baseline gap-2 pt-1 border-t border-desa-border/60">
            <span className="font-heading font-bold text-base text-desa-primary">
              Rp {product.price.toLocaleString('id-ID')}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs text-desa-subtle line-through">
                Rp {product.originalPrice.toLocaleString('id-ID')}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="px-4 pb-4 pt-1 flex items-center gap-2">
        <motion.button
          whileTap={{ scale: 0.94 }}
          onClick={handleAddToCart}
          className={`flex-1 py-2 px-3 rounded-lg border text-xs font-semibold transition-all flex items-center justify-center gap-1.5 shadow-2xs ${
            justAdded 
              ? 'bg-desa-highlight text-white border-desa-highlight'
              : 'border-desa-border bg-white text-desa-primary hover:bg-desa-primary hover:text-white hover:border-desa-primary'
          }`}
          title="Tambah ke Keranjang"
        >
          <AnimatePresence mode="wait">
            {justAdded ? (
              <motion.span 
                key="added" 
                initial={{ scale: 0.7, opacity: 0 }} 
                animate={{ scale: 1, opacity: 1 }} 
                exit={{ scale: 0.7, opacity: 0 }}
                className="flex items-center gap-1"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Masuk Keranjang</span>
              </motion.span>
            ) : (
              <motion.span 
                key="add" 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                className="flex items-center gap-1.5"
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>+ Keranjang</span>
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>

        {showQuickOrder && (
          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={() => openDirectCheckout(product, 1)}
            className="py-2 px-3 rounded-lg bg-desa-accent hover:bg-desa-accent/90 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1 shadow-2xs shrink-0"
            title="Beli Langsung"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Beli</span>
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}
