import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  MapPin, 
  Truck, 
  CreditCard, 
  CheckCircle2, 
  ChevronRight, 
  Plus, 
  ShieldCheck, 
  Store,
  ExternalLink,
  ShoppingBag
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SHIPPING_METHODS, PAYMENT_METHODS } from '../../data/mockData';
import LurikDivider from './LurikDivider';

export default function CheckoutModal() {
  const { 
    isCheckoutOpen, 
    setIsCheckoutOpen, 
    cart, 
    checkoutDirectItem, 
    addresses, 
    selectedAddressId, 
    setSelectedAddressId, 
    selectedAddress,
    setIsAddressModalOpen,
    setEditingAddress,
    processCheckout
  } = useApp();

  const [selectedShippingId, setSelectedShippingId] = useState(SHIPPING_METHODS[0].id);
  const [selectedPaymentId, setSelectedPaymentId] = useState(PAYMENT_METHODS[0].id);
  const [orderNotes, setOrderNotes] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isPersisted, setIsPersisted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState(null);

  if (!isCheckoutOpen) return null;
  const checkoutItems = checkoutDirectItem ? [checkoutDirectItem] : cart;

  const subtotal = checkoutItems.reduce((sum, item) => sum + (item.product.price * item.qty), 0);
  const selectedShipping = SHIPPING_METHODS.find(s => s.id === selectedShippingId) || SHIPPING_METHODS[0];
  const selectedPayment = PAYMENT_METHODS.find(p => p.id === selectedPaymentId) || PAYMENT_METHODS[0];
  const grandTotal = subtotal + selectedShipping.price;

  const handleConfirmOrder = async () => {
    if (isSubmitting) return;
    if (!selectedAddress) {
      alert('Mohon pilih atau tambahkan alamat pengiriman terlebih dahulu.');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await processCheckout({
        items: checkoutItems,
        address: selectedAddress,
        shippingMethod: selectedShipping,
        paymentMethod: selectedPayment,
        notes: orderNotes
      });

      if (!result.orderId) return;

      setCreatedOrderId(result.orderId);
      setIsPersisted(result.persisted);
      setIsSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsCheckoutOpen(false);
    setIsSuccess(false);
    setIsPersisted(false);
    setIsSubmitting(false);
    setCreatedOrderId(null);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-6">
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        />

        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-3xl bg-desa-bg rounded-3xl shadow-2xl overflow-hidden border border-desa-primary/20 z-10 flex flex-col max-h-[92vh]"
        >
          
          <div className="px-6 py-4 bg-desa-primary text-desa-light flex items-center justify-between relative overflow-hidden">
            <div className="absolute inset-0 bg-lurik-stripes-light opacity-10" />
            <div className="flex items-center gap-3 relative z-10">
              <div className="w-10 h-10 rounded-xl bg-desa-accent/30 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-heading text-lg font-bold">
                  {isSuccess ? (isPersisted ? 'Pesanan Berhasil Diajukan' : 'Pesanan Disimpan Sementara') : 'Checkout & Pembayaran'}
                </h3>
                <p className="text-xs text-desa-light/70">
                  {isSuccess ? (isPersisted ? 'Transaksi tercatat di database Pasar Desa' : 'Nyalakan backend untuk menyimpan transaksi ke database') : 'Periksa alamat, kurir kecamatan, dan metode pembayaran'}
                </p>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-desa-light transition-colors relative z-10"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <LurikDivider variant="accent" />

          
          {isSuccess ? (
            <div className="p-8 text-center space-y-6 overflow-y-auto" aria-live="polite">
              <div className="w-20 h-20 rounded-full bg-desa-highlight/20 text-desa-highlight flex items-center justify-center mx-auto border-2 border-desa-highlight/30">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-desa-primary/10 text-desa-primary uppercase tracking-wider">
                  No. Pesanan: #{createdOrderId}
                </span>
                <h2 className="font-heading text-2xl font-bold text-desa-primary mt-2">
                  Matur Nuwun! Pesanan Diterima
                </h2>
                <p className="text-xs text-desa-text/70 max-w-md mx-auto mt-1">
                  {isPersisted ? 'Pesanan Anda telah diteruskan ke pihak pengrajin dan tersimpan untuk dipantau.' : 'Pesanan ini hanya ada di sesi demo dan akan hilang saat halaman dimuat ulang.'}
                </p>
              </div>

              
              <div className="max-w-md mx-auto bg-white rounded-2xl p-4 border border-desa-primary/10 text-left text-xs space-y-2.5">
                <div className="flex justify-between pb-2 border-b border-desa-primary/10">
                  <span className="text-desa-text/60">Penerima</span>
                  <span className="font-bold text-desa-primary">{selectedAddress?.receiverName}</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-desa-primary/10">
                  <span className="text-desa-text/60">Alamat Kirim</span>
                  <span className="font-semibold text-right text-desa-primary truncate max-w-[200px]">
                    {selectedAddress?.fullAddress}
                  </span>
                </div>
                <div className="flex justify-between pb-2 border-b border-desa-primary/10">
                  <span className="text-desa-text/60">Metode Pengiriman</span>
                  <span className="font-semibold text-desa-primary">{selectedShipping.name}</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-desa-primary/10">
                  <span className="text-desa-text/60">Pembayaran</span>
                  <span className="font-semibold text-desa-primary">{selectedPayment.name}</span>
                </div>
                <div className="flex justify-between pt-1 text-sm font-bold text-desa-accent">
                  <span>Total Bayar</span>
                  <span>Rp {grandTotal.toLocaleString('id-ID')}</span>
                </div>
              </div>

              <div className="flex justify-center gap-3 pt-2">
                <button
                  onClick={handleClose}
                  className="px-6 py-3 rounded-xl bg-desa-primary text-white text-xs font-bold hover:bg-desa-accent transition-colors shadow-md"
                >
                  Selesai & Lanjut Belanja
                </button>
              </div>
            </div>
          ) : (
            
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              <div className="bg-white rounded-2xl p-4 sm:p-5 border border-desa-primary/10 shadow-xs">
                <div className="flex items-center justify-between pb-3 border-b border-desa-primary/10 mb-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-desa-accent" />
                    <h4 className="text-xs font-bold text-desa-primary uppercase tracking-wider">
                      Alamat Pengiriman (Titik Google Maps)
                    </h4>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingAddress(null);
                      setIsAddressModalOpen(true);
                    }}
                    className="flex items-center gap-1 text-[11px] font-semibold text-desa-accent hover:underline"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah Alamat Baru</span>
                  </button>
                </div>

                
                <div className="space-y-3">
                  {addresses.map((addr) => {
                    const isSelected = addr.id === selectedAddressId;
                    return (
                      <div
                        key={addr.id}
                        onClick={() => setSelectedAddressId(addr.id)}
                        className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                          isSelected
                            ? 'bg-desa-accent/5 border-desa-accent shadow-xs'
                            : 'bg-desa-bg/30 border-desa-primary/10 hover:border-desa-primary/30'
                        }`}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-desa-primary">{addr.label}</span>
                            {addr.isDefault && (
                              <span className="text-[10px] px-2 py-0.5 rounded-md bg-desa-highlight/15 text-desa-highlight font-semibold">
                                Utama
                              </span>
                            )}
                            <span className="text-[11px] text-desa-text/60">({addr.kecamatan})</span>
                          </div>
                          <p className="text-xs font-semibold text-desa-text mt-1">
                            {addr.receiverName} <span className="font-normal text-desa-text/70">• {addr.phone}</span>
                          </p>
                          <p className="text-xs text-desa-text/80 mt-0.5 line-clamp-1">
                            {addr.fullAddress} {addr.rtRw && `(${addr.rtRw})`}
                          </p>
                          {addr.notes && (
                            <p className="text-[11px] text-desa-text/60 italic mt-0.5">
                              Patokan: {addr.notes}
                            </p>
                          )}
                        </div>

                        
                        <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-desa-primary/5">
                          <a
                            href={`https://www.google.com/maps?q=${addr.lat},${addr.lng}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-desa-primary/10 text-desa-primary hover:bg-desa-accent hover:text-white text-[10px] font-semibold transition-colors"
                          >
                            <MapPin className="w-3 h-3 text-desa-accent" />
                            <span>Titik Peta ({addr.lat}, {addr.lng})</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingAddress(addr);
                              setIsAddressModalOpen(true);
                            }}
                            className="text-[11px] text-desa-accent hover:underline font-medium"
                          >
                            Ubah Detail
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              
              <div className="bg-white rounded-2xl p-4 sm:p-5 border border-desa-primary/10 shadow-xs">
                <div className="flex items-center gap-2 pb-3 border-b border-desa-primary/10 mb-3">
                  <Store className="w-4 h-4 text-desa-accent" />
                  <h4 className="text-xs font-bold text-desa-primary uppercase tracking-wider">
                    Ringkasan Produk Belanja ({checkoutItems.length} Produk)
                  </h4>
                </div>

                <div className="space-y-3">
                  {checkoutItems.map((item) => (
                    <div key={item.productId} className="flex items-center gap-3 pb-3 border-b border-desa-primary/5 last:border-0 last:pb-0">
                      <img
                        src={item.product.images?.[0] || 'https://images.unsplash.com/photo-1606744888344-498238f01769?auto=format&fit=crop&w=200&q=80'}
                        alt={item.product.name}
                        className="w-14 h-14 object-cover rounded-xl border border-desa-primary/10"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="text-[11px] text-desa-text/60">{item.product.shopName}</span>
                        <h5 className="text-xs font-bold text-desa-primary truncate">{item.product.name}</h5>
                        <p className="text-xs text-desa-text/70 mt-0.5">
                          {item.qty} x Rp {item.product.price.toLocaleString('id-ID')}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold text-desa-accent">
                          Rp {(item.product.price * item.qty).toLocaleString('id-ID')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-3 pt-3 border-t border-desa-primary/10">
                  <label className="block text-[11px] font-semibold text-desa-primary mb-1">
                    Catatan Pesanan Tambahan (Opsional)
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Tolong bungkus besek untuk oleh-oleh atau ukuran khusus"
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-desa-primary/20 bg-desa-bg/30 text-xs text-desa-text focus:outline-none focus:ring-1 focus:ring-desa-accent"
                  />
                </div>
              </div>

              
              <div className="bg-white rounded-2xl p-4 sm:p-5 border border-desa-primary/10 shadow-xs">
                <div className="flex items-center gap-2 pb-3 border-b border-desa-primary/10 mb-3">
                  <Truck className="w-4 h-4 text-desa-accent" />
                  <h4 className="text-xs font-bold text-desa-primary uppercase tracking-wider">
                    Metode Pengiriman
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {SHIPPING_METHODS.map((sm) => {
                    const isSelected = sm.id === selectedShippingId;
                    return (
                      <div
                        key={sm.id}
                        onClick={() => setSelectedShippingId(sm.id)}
                        className={`p-3 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                          isSelected
                            ? 'bg-desa-accent/5 border-desa-accent shadow-xs'
                            : 'bg-desa-bg/20 border-desa-primary/10 hover:border-desa-primary/30'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-desa-primary">{sm.name}</span>
                          </div>
                          <p className="text-[10px] text-desa-highlight font-semibold mt-0.5">{sm.eta}</p>
                          <p className="text-[10px] text-desa-text/60 mt-1 leading-snug">{sm.desc}</p>
                        </div>
                        <div className="mt-2 pt-2 border-t border-desa-primary/5 flex items-center justify-between">
                          <span className="text-[10px] text-desa-text/60">Ongkir:</span>
                          <span className="text-xs font-bold text-desa-primary">
                            {sm.price === 0 ? 'Gratis' : `Rp ${sm.price.toLocaleString('id-ID')}`}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              
              <div className="bg-white rounded-2xl p-4 sm:p-5 border border-desa-primary/10 shadow-xs">
                <div className="flex items-center gap-2 pb-3 border-b border-desa-primary/10 mb-3">
                  <CreditCard className="w-4 h-4 text-desa-accent" />
                  <h4 className="text-xs font-bold text-desa-primary uppercase tracking-wider">
                    Metode Pembayaran
                  </h4>
                </div>

                <div className="space-y-2.5">
                  {PAYMENT_METHODS.map((pm) => {
                    const isSelected = pm.id === selectedPaymentId;
                    return (
                      <div
                        key={pm.id}
                        onClick={() => setSelectedPaymentId(pm.id)}
                        className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                          isSelected
                            ? 'bg-desa-accent/5 border-desa-accent shadow-xs'
                            : 'bg-desa-bg/20 border-desa-primary/10 hover:border-desa-primary/30'
                        }`}
                      >
                        <div>
                          <span className="text-xs font-bold text-desa-primary">{pm.name}</span>
                          <p className="text-[11px] text-desa-text/70 mt-0.5">{pm.desc}</p>
                        </div>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-desa-primary/10 text-desa-primary shrink-0">
                          {pm.type}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              
              <div className="p-4 bg-desa-primary/5 rounded-2xl border border-desa-primary/10 space-y-2 text-xs">
                <div className="flex justify-between text-desa-text/70">
                  <span>Subtotal Produk ({checkoutItems.reduce((acc, i) => acc + i.qty, 0)} item)</span>
                  <span className="font-semibold text-desa-primary">Rp {subtotal.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-desa-text/70">
                  <span>Biaya Pengiriman ({selectedShipping.name})</span>
                  <span className="font-semibold text-desa-primary">
                    {selectedShipping.price === 0 ? 'Gratis' : `Rp ${selectedShipping.price.toLocaleString('id-ID')}`}
                  </span>
                </div>
                <div className="flex justify-between text-desa-text/70">
                  <span>Biaya Layanan BUMDes</span>
                  <span className="font-semibold text-desa-highlight">Rp 0 (Didukung Kas Desa)</span>
                </div>
                <div className="pt-2 border-t border-desa-primary/15 flex justify-between items-center text-sm font-bold text-desa-primary">
                  <span>Total Pembayaran</span>
                  <span className="text-base text-desa-accent">Rp {grandTotal.toLocaleString('id-ID')}</span>
                </div>
              </div>
            </div>
          )}

          
          {!isSuccess && (
            <div className="p-5 bg-white border-t border-desa-primary/10 flex items-center justify-between gap-4">
              <div className="hidden sm:block">
                <span className="text-[11px] text-desa-text/60">Total yang harus dibayar:</span>
                <p className="font-heading text-lg font-bold text-desa-accent">
                  Rp {grandTotal.toLocaleString('id-ID')}
                </p>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 sm:flex-initial px-5 py-3 rounded-xl border border-desa-primary/20 text-xs font-semibold text-desa-primary hover:bg-desa-bg transition-colors"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleConfirmOrder}
                  disabled={isSubmitting}
                  aria-busy={isSubmitting}
                  className="flex-2 sm:flex-initial px-7 py-3 rounded-xl bg-desa-accent text-white text-xs font-bold hover:bg-desa-accent/90 transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{isSubmitting ? 'Menyimpan Pesanan…' : 'Konfirmasi & Bayar Sekarang'}</span>
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

