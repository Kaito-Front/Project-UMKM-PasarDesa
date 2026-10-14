import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  Store,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import LurikDivider from './LurikDivider';

export default function CartDrawer() {
  const { 
    isCartOpen, 
    setIsCartOpen, 
    cart, 
    cartCount, 
    cartSubtotal, 
    updateCartQty, 
    removeFromCart, 
    clearCart,
    openCartCheckout,
    viewProduct
  } = useApp();

  if (!isCartOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsCartOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        />

        <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 240 }}
            className="w-screen max-w-md bg-desa-bg shadow-2xl flex flex-col border-l border-desa-primary/15"
          >
            {/* Header Drawer */}
            <div className="px-6 py-5 bg-desa-primary text-desa-light flex items-center justify-between relative overflow-hidden">
              <div className="absolute inset-0 bg-lurik-stripes-light opacity-10" />
              <div className="flex items-center gap-3 relative z-10">
                <div className="w-10 h-10 rounded-xl bg-desa-accent/30 flex items-center justify-center text-desa-accent">
                  <ShoppingBag className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-heading text-lg font-bold">Keranjang Belanja</h3>
                  <p className="text-xs text-desa-light/70">{cartCount} produk terpilih dari UMKM desa</p>
                </div>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-desa-light transition-colors relative z-10"
                aria-label="Tutup Keranjang"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <LurikDivider variant="accent" />

            {/* List Item Keranjang */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12 text-desa-text/60">
                  <div className="w-20 h-20 rounded-full bg-desa-primary/5 border border-desa-primary/10 flex items-center justify-center mb-4">
                    <ShoppingBag className="w-8 h-8 text-desa-accent/60" />
                  </div>
                  <h4 className="font-heading text-base font-bold text-desa-primary">Keranjang Belanja Kosong</h4>
                  <p className="text-xs max-w-xs mt-1.5 mb-6 text-desa-text/70">
                    Belum ada produk yang dimasukkan. Silakan jelajahi katalog unggulan desa kami.
                  </p>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="px-5 py-2.5 rounded-xl bg-desa-primary text-desa-light text-xs font-semibold hover:bg-desa-accent transition-all shadow-sm"
                  >
                    Mulai Belanja Produk Desa
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between pb-2 border-b border-desa-primary/10 text-xs">
                    <span className="font-semibold text-desa-primary">Daftar Produk ({cart.length})</span>
                    <button
                      onClick={clearCart}
                      className="text-red-600 hover:text-red-700 font-medium flex items-center gap-1 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Kosongkan</span>
                    </button>
                  </div>

                  {cart.map((item) => (
                    <div
                      key={item.productId}
                      className="p-3.5 rounded-2xl bg-white border border-desa-primary/10 shadow-xs flex gap-3 hover:border-desa-accent/40 transition-all"
                    >
                      {/* Gambar Produk */}
                      <img
                        src={item.product.images?.[0] || 'https://images.unsplash.com/photo-1606744888344-498238f01769?auto=format&fit=crop&w=200&q=80'}
                        alt={item.product.name}
                        onClick={() => {
                          viewProduct(item.productId);
                          setIsCartOpen(false);
                        }}
                        className="w-18 h-18 object-cover rounded-xl border border-desa-primary/10 cursor-pointer hover:opacity-90 transition-opacity"
                      />

                      {/* Detail Produk */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-1 text-[11px] text-desa-text/60 truncate">
                            <Store className="w-3 h-3 text-desa-accent shrink-0" />
                            <span className="truncate">{item.product.shopName}</span>
                          </div>
                          <h4 
                            onClick={() => {
                              viewProduct(item.productId);
                              setIsCartOpen(false);
                            }}
                            className="text-xs font-semibold text-desa-primary line-clamp-1 cursor-pointer hover:text-desa-accent mt-0.5"
                          >
                            {item.product.name}
                          </h4>
                          {item.note && (
                            <p className="text-[10px] text-desa-text/60 italic truncate mt-0.5">
                              Catatan: {item.note}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-desa-primary/5">
                          <span className="text-xs font-bold text-desa-accent">
                            Rp {(item.product.price * item.qty).toLocaleString('id-ID')}
                          </span>

                          {/* Kuantitas Selector */}
                          <div className="flex items-center border border-desa-primary/20 rounded-lg bg-desa-bg/50 overflow-hidden">
                            <button
                              onClick={() => updateCartQty(item.productId, -1)}
                              className="w-6 h-6 flex items-center justify-center text-desa-primary hover:bg-desa-primary/10 transition-colors"
                              aria-label="Kurangi kuantitas"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-7 text-center text-xs font-bold text-desa-primary">
                              {item.qty}
                            </span>
                            <button
                              onClick={() => updateCartQty(item.productId, 1)}
                              className="w-6 h-6 flex items-center justify-center text-desa-primary hover:bg-desa-primary/10 transition-colors"
                              aria-label="Tambah kuantitas"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Tombol Hapus */}
                      <button
                        onClick={() => removeFromCart(item.productId)}
                        className="text-desa-text/40 hover:text-red-500 self-start p-1 transition-colors"
                        aria-label="Hapus item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </>
              )}
            </div>

            {/* Footer Summary & Tombol Checkout */}
            {cart.length > 0 && (
              <div className="p-6 bg-white border-t border-desa-primary/10 shadow-lg space-y-4">
                <div className="flex items-center justify-between text-xs text-desa-text/80">
                  <span>Subtotal Belanja</span>
                  <span className="font-bold text-sm text-desa-primary">
                    Rp {cartSubtotal.toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-desa-highlight/10 text-desa-highlight text-[11px] font-medium border border-desa-highlight/20">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span>Garansi keaslian 100% langsung dari pengrajin & UMKM desa.</span>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="flex-1 py-3 px-4 rounded-xl border border-desa-primary/20 text-desa-primary text-xs font-semibold hover:bg-desa-bg transition-colors text-center"
                  >
                    Lanjut Belanja
                  </button>
                  <button
                    onClick={openCartCheckout}
                    className="flex-2 py-3 px-5 rounded-xl bg-desa-primary text-white text-xs font-bold hover:bg-desa-accent flex items-center justify-center gap-2 transition-all shadow-md"
                  >
                    <span>Lanjut Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}

