import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  Store
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

  const panelRef = useRef(null);
  const closeButtonRef = useRef(null);
  const previousFocusRef = useRef(null);

  useEffect(() => {
    if (!isCartOpen) return undefined;

    previousFocusRef.current = document.activeElement;
    const focusFrame = window.requestAnimationFrame(() => closeButtonRef.current?.focus());

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsCartOpen(false);
        return;
      }

      if (event.key !== 'Tab' || !panelRef.current) return;

      const focusableItems = panelRef.current.querySelectorAll(
        'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
      );
      if (focusableItems.length === 0) return;

      const firstItem = focusableItems[0];
      const lastItem = focusableItems[focusableItems.length - 1];

      if (event.shiftKey && document.activeElement === firstItem) {
        event.preventDefault();
        lastItem.focus();
      } else if (!event.shiftKey && document.activeElement === lastItem) {
        event.preventDefault();
        firstItem.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.removeEventListener('keydown', handleKeyDown);
      previousFocusRef.current?.focus?.();
    };
  }, [isCartOpen, setIsCartOpen]);

  const handleViewProduct = (productId) => {
    viewProduct(productId);
    setIsCartOpen(false);
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <motion.div
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-desa-primary/60 backdrop-blur-[3px]"
          />

          <motion.aside
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-title"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 260 }}
            className="fixed inset-y-0 right-0 flex w-full flex-col border-l border-white/50 bg-[#f7f5ef] shadow-[-18px_0_60px_rgba(35,34,32,0.16)] sm:max-w-[34rem]"
          >
            <header className="relative shrink-0 overflow-hidden px-5 pb-5 pt-6 sm:px-8 sm:pb-6 sm:pt-8">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-lurik-stripes opacity-70"
              />
              <div className="flex items-start justify-between gap-4">
                <div className="flex min-w-0 items-center gap-4">
                  <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-[1.2rem] bg-desa-primary text-desa-light shadow-[0_8px_20px_rgba(58,58,56,0.16)]">
                    <ShoppingBag className="h-[1.35rem] w-[1.35rem]" strokeWidth={1.7} aria-hidden="true" />
                    <span className="absolute -right-1.5 -top-1.5 flex h-6 min-w-6 items-center justify-center rounded-full border-2 border-[#f7f5ef] bg-desa-accent px-1 text-[10px] font-bold tabular-nums text-white">
                      {cartCount}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-desa-accent">
                      Pasar desa · belanja lokal
                    </p>
                    <h2 id="cart-title" className="font-heading text-[1.7rem] font-bold leading-[1.05] tracking-[-0.035em] text-desa-primary sm:text-[2rem]">
                      Keranjang
                    </h2>
                    <p className="mt-1.5 text-xs text-desa-text/70" aria-live="polite">
                      {cartCount} barang dari pilihanmu
                    </p>
                  </div>
                </div>
                <button
                  ref={closeButtonRef}
                  type="button"
                  onClick={() => setIsCartOpen(false)}
                  className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-desa-primary/10 bg-white/80 text-desa-primary transition duration-200 hover:-rotate-3 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-desa-accent focus-visible:ring-offset-2 active:scale-95"
                  aria-label="Tutup keranjang"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </header>

            <LurikDivider variant="accent" height="2px" />

            <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-8 sm:py-6">
              {cart.length === 0 ? (
                <div className="flex min-h-full flex-col items-start justify-center px-3 py-12 text-left sm:px-8">
                  <div className="relative mb-7 flex h-[5.5rem] w-[5.5rem] items-center justify-center rounded-[1.7rem] bg-[#e9e5d9] text-desa-primary">
                    <ShoppingBag className="h-9 w-9" strokeWidth={1.5} aria-hidden="true" />
                    <span aria-hidden="true" className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-[3px] border-[#f7f5ef] bg-desa-accent" />
                  </div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-desa-accent">
                    Masih ada ruang
                  </p>
                  <h3 className="mt-2 font-heading text-2xl font-bold tracking-[-0.03em] text-desa-primary sm:text-[1.8rem]">
                    Keranjang masih kosong
                  </h3>
                  <p className="mt-3 max-w-[19rem] text-sm leading-6 text-desa-text/70">
                    Temukan hasil karya dan pangan dari usaha warga desa. Pilihanmu akan muncul di sini.
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsCartOpen(false)}
                    className="mt-7 inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-desa-primary px-6 text-sm font-semibold text-desa-light transition duration-200 hover:gap-4 hover:bg-desa-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-desa-accent focus-visible:ring-offset-2 active:scale-[0.98]"
                  >
                    Mulai belanja
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              ) : (
                <>
                  <div className="mb-2 flex items-end justify-between gap-3 border-b border-desa-primary/15 pb-4">
                    <div>
                      <h3 className="font-heading text-lg font-bold tracking-[-0.02em] text-desa-primary">Pilihan belanjamu</h3>
                      <p className="mt-1 text-xs text-desa-text/65">{cart.length} jenis produk · {cartCount} barang</p>
                    </div>
                    <button
                      type="button"
                      onClick={clearCart}
                      className="inline-flex min-h-11 items-center gap-2 rounded-lg px-2 text-xs font-semibold text-desa-text/70 transition-colors hover:bg-red-50 hover:text-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-desa-accent focus-visible:ring-offset-2"
                    >
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                      Kosongkan
                    </button>
                  </div>

                  <ul className="divide-y divide-desa-primary/10">
                    <AnimatePresence mode="popLayout">
                    {cart.map((item) => (
                      <motion.li layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -24, height: 0, overflow: 'hidden', transition: { duration: 0.22, ease: 'easeOut' } }} key={item.productId} className="group flex gap-3.5 py-5 first:pt-5 sm:gap-4">
                        <button
                          type="button"
                          onClick={() => handleViewProduct(item.productId)}
                          className="h-[5.25rem] w-[5.25rem] shrink-0 overflow-hidden rounded-[1.15rem] bg-[#e9e5d9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-desa-accent focus-visible:ring-offset-2 sm:h-[5.75rem] sm:w-[5.75rem]"
                          aria-label={`Lihat ${item.product.name}`}
                        >
                          <img
                            src={item.product.images?.[0] || 'https://images.unsplash.com/photo-1606744888344-498238f01769?auto=format&fit=crop&w=200&q=80'}
                            alt=""
                            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                          />
                        </button>

                        <div className="flex min-w-0 flex-1 flex-col justify-between py-0.5">
                          <div className="min-w-0">
                            <p className="flex min-w-0 items-center gap-1.5 text-[10px] font-medium tracking-[0.02em] text-desa-text/65">
                              <Store className="h-3 w-3 shrink-0 text-desa-accent" strokeWidth={1.8} aria-hidden="true" />
                              <span className="truncate">{item.product.shopName}</span>
                            </p>
                            <button
                              type="button"
                              onClick={() => handleViewProduct(item.productId)}
                              className="mt-1.5 block max-w-full truncate text-left text-[15px] font-semibold leading-tight text-desa-primary transition-colors hover:text-desa-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-desa-accent"
                            >
                              {item.product.name}
                            </button>
                            {item.note && (
                              <p className="mt-1.5 truncate text-[11px] leading-4 text-desa-text/65">
                                Catatan: {item.note}
                              </p>
                            )}
                          </div>

                          <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                            <span className="text-[13px] font-bold tabular-nums text-desa-accent">
                              Rp {(item.product.price * item.qty).toLocaleString('id-ID')}
                            </span>
                            <div className="inline-flex items-center rounded-full border border-desa-primary/10 bg-white/80 p-0.5 shadow-sm shadow-desa-primary/5">
                              <button
                                type="button"
                                onClick={() => updateCartQty(item.productId, -1)}
                                className="inline-flex h-9 w-9 items-center justify-center rounded-full text-desa-primary transition-colors hover:bg-[#e9e5d9] focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-desa-accent active:bg-desa-primary/10"
                                aria-label={`Kurangi jumlah ${item.product.name}`}
                              >
                                <Minus className="h-3.5 w-3.5" aria-hidden="true" />
                              </button>
                              <span className="min-w-7 text-center text-xs font-semibold tabular-nums text-desa-primary" aria-live="polite">
                                {item.qty}
                              </span>
                              <button
                                type="button"
                                onClick={() => updateCartQty(item.productId, 1)}
                                className="inline-flex h-9 w-9 items-center justify-center rounded-full text-desa-primary transition-colors hover:bg-[#e9e5d9] focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-desa-accent active:bg-desa-primary/10"
                                aria-label={`Tambah jumlah ${item.product.name}`}
                              >
                                <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                              </button>
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeFromCart(item.productId)}
                          className="inline-flex h-10 w-10 shrink-0 items-center justify-center self-start rounded-full text-desa-text/50 transition duration-200 hover:bg-red-50 hover:text-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-desa-accent focus-visible:ring-offset-1 sm:opacity-70 sm:group-hover:opacity-100"
                          aria-label={`Hapus ${item.product.name} dari keranjang`}
                        >
                          <Trash2 className="h-4 w-4" aria-hidden="true" />
                        </button>
                      </motion.li>
                    ))}
                    </AnimatePresence>
                  </ul>
                </>
              )}
            </div>

            {cart.length > 0 && (
              <footer className="shrink-0 border-t border-desa-primary/10 bg-[#fbfaf6] px-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] pt-5 sm:px-8 sm:pt-5">
                <div className="mb-4 flex items-end justify-between gap-4">
                  <div>
                    <p className="text-xs font-medium text-desa-text/75">Subtotal belanja</p>
                    <p className="mt-1 text-[11px] text-desa-text/55">Ongkir dihitung saat checkout</p>
                  </div>
                  <p className="font-heading text-[1.65rem] font-bold tracking-[-0.03em] tabular-nums text-desa-primary">
                    Rp {cartSubtotal.toLocaleString('id-ID')}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={openCartCheckout}
                  className="group inline-flex min-h-[3.35rem] w-full items-center justify-center gap-3 rounded-full bg-desa-primary px-5 text-sm font-semibold text-desa-light shadow-[0_8px_20px_rgba(58,58,56,0.15)] transition duration-200 hover:gap-4 hover:bg-desa-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-desa-accent focus-visible:ring-offset-2 active:scale-[0.99]"
                >
                  Lanjut ke checkout
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsCartOpen(false)}
                  className="mt-2 inline-flex min-h-11 w-full items-center justify-center text-[13px] font-medium text-desa-text/70 transition-colors hover:text-desa-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-desa-accent"
                >
                  Lanjut belanja
                </button>
              </footer>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
