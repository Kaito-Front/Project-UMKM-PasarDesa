import React from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { Star, MapPin, Store, ShoppingCart, MessageSquare, ArrowRight, ShoppingBag } from 'lucide-react';
import LurikDivider from './LurikDivider';

export default function ProductCard({ product, showQuickOrder = true, isCompact = false }) {
  const { viewProduct, addToCart, openDirectCheckout, openChatWithShop, viewShop } = useApp();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      whileHover={{ y: -3, transition: { duration: 0.2, ease: 'easeOut' } }}
      className="group bg-white rounded-2xl overflow-hidden border border-desa-primary/15 hover:border-desa-primary/40 hover:shadow-md transition-all duration-300 flex flex-col justify-between relative"
    >

      <div>
        
        <div 
          onClick={() => viewProduct(product.id)}
          className="relative aspect-square overflow-hidden bg-desa-primary/5 cursor-pointer"
        >
          <motion.img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover object-center"
            whileHover={{ scale: 1.08 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            loading="lazy"
          />

          
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
            {product.isFeatured && (
              <motion.span 
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-desa-accent text-white shadow-md tracking-wider uppercase"
              >
                Unggulan
              </motion.span>
            )}
            {product.isNew && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-desa-highlight text-white shadow-md">
                Baru
              </span>
            )}
          </div>

          
          {product.originalPrice && product.originalPrice > product.price && (
            <div className="absolute top-2.5 right-2.5">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-desa-primary text-desa-light shadow-md">
                -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
              </span>
            </div>
          )}

          
          <button
            onClick={(e) => {
              e.stopPropagation();
              openChatWithShop(product.shopId, product);
            }}
            className="absolute bottom-2.5 right-2.5 p-2 rounded-xl bg-white/90 hover:bg-white text-desa-primary shadow-md hover:text-desa-accent transition-all opacity-0 group-hover:opacity-100 z-10 flex items-center gap-1 text-[10px] font-bold backdrop-blur-xs"
            title="Chat Admin Toko untuk cek stok & barang"
          >
            <MessageSquare className="w-3.5 h-3.5 text-desa-accent" />
            <span>Chat Toko</span>
          </button>
        </div>

        
        <div className={`p-4 ${isCompact ? 'p-3' : 'p-4'}`}>
          
          <div className="flex items-center justify-between text-xs text-desa-text/60 mb-1.5 gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                viewShop(product.shopId);
              }}
              className="flex items-center gap-1 hover:text-desa-accent truncate font-medium transition-colors"
            >
              <Store className="w-3 h-3 text-desa-accent shrink-0" />
              <span className="truncate">{product.shopName}</span>
            </button>
            <div className="flex items-center gap-0.5 shrink-0 text-[11px]">
              <MapPin className="w-3 h-3 text-desa-primary/60" />
              <span className="truncate">{product.kecamatan.replace(/^Kecamatan /, '')}</span>
            </div>
          </div>

          
          <h3 
            onClick={() => viewProduct(product.id)}
            className="font-medium text-desa-primary text-sm line-clamp-2 leading-snug cursor-pointer group-hover:text-desa-accent transition-colors mb-2"
            title={product.name}
          >
            {product.name}
          </h3>

          
          <div className="flex items-center gap-2 text-xs mb-3">
            <div className="flex items-center text-amber-500 font-semibold gap-0.5">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{product.rating.toFixed(1)}</span>
            </div>
            <span className="text-desa-text/30">•</span>
            <span className="text-desa-text/60 text-[11px]">
              {product.sold} terjual
            </span>
            <span className="text-desa-text/30">•</span>
            <span className="text-desa-highlight text-[11px] font-medium">
              Stok {product.stock}
            </span>
          </div>

          
          <div className="flex items-baseline gap-2">
            <span className="font-heading font-bold text-base text-desa-primary">
              Rp {product.price.toLocaleString('id-ID')}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs text-desa-text/40 line-through">
                Rp {product.originalPrice.toLocaleString('id-ID')}
              </span>
            )}
          </div>
        </div>
      </div>

      
      <div className="px-4 pb-4 pt-1 flex items-center gap-2 border-t border-desa-primary/10">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => addToCart(product, 1)}
          className="flex-1 py-2 px-3 rounded-xl border border-desa-primary/25 text-desa-primary hover:bg-desa-primary hover:text-desa-light text-xs font-semibold transition-all text-center flex items-center justify-center gap-1.5 shadow-xs"
          title="Tambah ke Keranjang Belanja"
        >
          <ShoppingCart className="w-3.5 h-3.5 text-desa-accent group-hover:text-white" />
          <span>+ Keranjang</span>
        </motion.button>

        {showQuickOrder && (
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.94 }}
            onClick={() => openDirectCheckout(product, 1)}
            className="py-2 px-3.5 rounded-xl bg-desa-accent hover:bg-desa-accent/90 text-white text-xs font-bold transition-all flex items-center justify-center gap-1 shadow-md shrink-0"
            title="Beli Langsung / Checkout Cepat"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Beli</span>
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}
