import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  MapPin, 
  Truck, 
  CreditCard, 
  CheckCircle2, 
  Plus, 
  ShieldCheck, 
  Store,
  ExternalLink,
  ShoppingBag,
  QrCode,
  Copy,
  Check,
  Printer,
  Sparkles,
  Database,
  Building2,
  Banknote,
  FileText
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SHIPPING_METHODS, PAYMENT_METHODS } from '../../data/mockData';
import LurikDivider from './LurikDivider';

// Komponen Dummy QR Code SVG yang otentik dan tajam
function DummyQrSvg({ amount, size = 180 }) {
  return (
    <div className="relative bg-white p-3 rounded-2xl shadow-inner border border-desa-primary/15 inline-block">
      <svg
        width={size}
        height={size}
        viewBox="0 0 160 160"
        className="w-full h-auto max-w-[180px] select-none"
        aria-label={`QRIS Pembayaran Pasar Desa Rp ${amount.toLocaleString('id-ID')}`}
        role="img"
      >
        <rect width="160" height="160" fill="#FFFFFF" />
        
        {/* Top-Left Finder Pattern */}
        <rect x="10" y="10" width="40" height="40" fill="#2D2D2B" rx="4" />
        <rect x="16" y="16" width="28" height="28" fill="#FFFFFF" rx="2" />
        <rect x="22" y="22" width="16" height="16" fill="#A85C3C" rx="2" />

        {/* Top-Right Finder Pattern */}
        <rect x="110" y="10" width="40" height="40" fill="#2D2D2B" rx="4" />
        <rect x="116" y="16" width="28" height="28" fill="#FFFFFF" rx="2" />
        <rect x="122" y="22" width="16" height="16" fill="#A85C3C" rx="2" />

        {/* Bottom-Left Finder Pattern */}
        <rect x="10" y="110" width="40" height="40" fill="#2D2D2B" rx="4" />
        <rect x="16" y="116" width="28" height="28" fill="#FFFFFF" rx="2" />
        <rect x="22" y="122" width="16" height="16" fill="#A85C3C" rx="2" />

        {/* Timing Pattern Lines */}
        <line x1="55" y1="28" x2="105" y2="28" stroke="#2D2D2B" strokeWidth="4" strokeDasharray="5 5" />
        <line x1="28" y1="55" x2="28" y2="105" stroke="#2D2D2B" strokeWidth="4" strokeDasharray="5 5" />

        {/* Alignment Pattern */}
        <rect x="116" y="116" width="24" height="24" fill="#2D2D2B" rx="2" />
        <rect x="122" y="122" width="12" height="12" fill="#FFFFFF" rx="1" />
        <rect x="126" y="126" width="4" height="4" fill="#7C8C6B" />

        {/* Authentic Data Matrix Blocks */}
        <g fill="#3A3A38">
          <rect x="58" y="12" width="8" height="8" />
          <rect x="74" y="12" width="6" height="6" />
          <rect x="90" y="14" width="8" height="6" />
          <rect x="62" y="36" width="10" height="6" />
          <rect x="80" y="38" width="6" height="8" />
          <rect x="94" y="36" width="8" height="8" />

          <rect x="12" y="58" width="6" height="8" />
          <rect x="36" y="62" width="8" height="6" />
          <rect x="14" y="76" width="8" height="8" />
          <rect x="34" y="82" width="6" height="8" />
          <rect x="12" y="94" width="8" height="6" />

          <rect x="54" y="54" width="8" height="8" />
          <rect x="68" y="56" width="6" height="6" />
          <rect x="84" y="54" width="8" height="6" />
          <rect x="98" y="58" width="8" height="8" />

          <rect x="56" y="70" width="6" height="8" />
          <rect x="70" y="68" width="8" height="8" />
          <rect x="86" y="70" width="6" height="6" />
          <rect x="98" y="72" width="6" height="8" />

          <rect x="52" y="86" width="8" height="6" />
          <rect x="66" y="84" width="6" height="8" />
          <rect x="80" y="86" width="8" height="8" />
          <rect x="96" y="86" width="6" height="6" />

          <rect x="114" y="58" width="8" height="8" />
          <rect x="130" y="62" width="6" height="6" />
          <rect x="142" y="58" width="8" height="8" />
          <rect x="116" y="76" width="8" height="6" />
          <rect x="132" y="78" width="6" height="8" />
          <rect x="140" y="88" width="10" height="6" />

          <rect x="56" y="114" width="8" height="8" />
          <rect x="72" y="118" width="6" height="6" />
          <rect x="86" y="112" width="8" height="8" />
          <rect x="98" y="116" width="8" height="6" />

          <rect x="58" y="132" width="8" height="6" />
          <rect x="74" y="130" width="6" height="8" />
          <rect x="88" y="132" width="8" height="8" />
          <rect x="100" y="130" width="6" height="6" />
        </g>

        {/* Center QRIS Badge */}
        <rect x="60" y="60" width="40" height="40" fill="#FFFFFF" rx="8" stroke="#A85C3C" strokeWidth="2.5" />
        <rect x="65" y="68" width="30" height="12" fill="#A85C3C" rx="3" />
        <text x="80" y="77" fill="#FFFFFF" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
          QRIS
        </text>
        <text x="80" y="92" fill="#3A3A38" fontSize="6.5" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
          DESA
        </text>
      </svg>
      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-desa-primary text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-xs whitespace-nowrap">
        Scan Demo
      </div>
    </div>
  );
}

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
  const [isCopiedRek, setIsCopiedRek] = useState(false);
  
  // State snapshot pesanan permanen untuk struk nota (tidak terpengaruh clearCart)
  const [completedOrder, setCompletedOrder] = useState(null);

  if (!isCheckoutOpen) return null;
  const checkoutItems = checkoutDirectItem ? [checkoutDirectItem] : cart;

  // Kalkulasi harga belanja sebelum checkout
  const subtotal = checkoutItems.reduce((sum, item) => {
    const itemPrice = Number(item.product?.price || 0);
    const itemQty = Number(item.qty || 1);
    return sum + (itemPrice * itemQty);
  }, 0);

  const selectedShipping = SHIPPING_METHODS.find(s => s.id === selectedShippingId) || SHIPPING_METHODS[0];
  const selectedPayment = PAYMENT_METHODS.find(p => p.id === selectedPaymentId) || PAYMENT_METHODS[0];
  const shippingPrice = Number(selectedShipping?.price || 0);
  const grandTotal = subtotal + shippingPrice;

  const copyRekening = (nomor) => {
    navigator.clipboard?.writeText(nomor);
    setIsCopiedRek(true);
    setTimeout(() => setIsCopiedRek(false), 2000);
  };

  const handleConfirmOrder = async () => {
    if (isSubmitting) return;
    if (!selectedAddress) {
      alert('Mohon pilih atau tambahkan alamat pengiriman terlebih dahulu.');
      return;
    }

    // Buat snapshot pesanan lengkap sebelum proses checkout (agar tidak hilang saat cart dikosongkan)
    const itemsSnapshot = checkoutItems.map(item => ({
      productId: item.productId || item.product?.id,
      productName: item.product?.name || 'Produk Desa',
      productImage: item.product?.images?.[0] || '/kain-lurik.jpg',
      shopName: item.product?.shopName || 'Toko UMKM Desa',
      price: Number(item.product?.price || 0),
      qty: Number(item.qty || 1),
      note: item.note || '',
      itemTotal: Number(item.product?.price || 0) * Number(item.qty || 1)
    }));

    const finalSubtotal = itemsSnapshot.reduce((acc, curr) => acc + curr.itemTotal, 0);
    const finalShippingPrice = Number(selectedShipping?.price || 0);
    const finalGrandTotal = finalSubtotal + finalShippingPrice;

    const orderSnapshot = {
      items: itemsSnapshot,
      subtotal: finalSubtotal,
      shipping: { ...selectedShipping, price: finalShippingPrice },
      payment: { ...selectedPayment },
      address: { ...selectedAddress },
      grandTotal: finalGrandTotal,
      notes: orderNotes,
      dateFormatted: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
      timeFormatted: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    };

    setIsSubmitting(true);
    try {
      const result = await processCheckout({
        items: checkoutItems,
        address: selectedAddress,
        shippingMethod: selectedShipping,
        paymentMethod: selectedPayment,
        notes: orderNotes
      });

      if (!result?.orderId) return;

      const orderId = result.orderId;
      const isPersist = result.persisted;
      
      setCreatedOrderId(orderId);
      setIsPersisted(isPersist);
      
      // Simpan ke state nota
      setCompletedOrder({
        ...orderSnapshot,
        orderId,
        persisted: isPersist,
        grandTotal: finalGrandTotal // Selalu harga barang + harga jasa pengiriman
      });

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
    setCompletedOrder(null);
  };

  // Gunakan data snapshot jika sudah beres pembayaran, atau data aktif saat proses checkout
  const displayItems = isSuccess && completedOrder ? completedOrder.items : checkoutItems;
  const displaySubtotal = isSuccess && completedOrder ? completedOrder.subtotal : subtotal;
  const displayShipping = isSuccess && completedOrder ? completedOrder.shipping : selectedShipping;
  const displayPayment = isSuccess && completedOrder ? completedOrder.payment : selectedPayment;
  const displayGrandTotal = isSuccess && completedOrder ? completedOrder.grandTotal : grandTotal;
  const displayAddress = isSuccess && completedOrder ? completedOrder.address : selectedAddress;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-6 print:p-0 print:static print:overflow-visible">
        
        {/* Backdrop (disembunyikan saat print) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity no-print"
        />

        {/* Modal Window Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-3xl bg-desa-bg rounded-3xl shadow-2xl overflow-hidden border border-desa-primary/20 z-10 flex flex-col max-h-[92vh] print:max-h-none print:shadow-none print:border-none print:rounded-none print:bg-white print:p-0 print:static"
        >
          {/* Header Modal (disembunyikan saat print) */}
          <div className="px-6 py-4 bg-desa-primary text-desa-light flex items-center justify-between relative overflow-hidden no-print">
            <div className="absolute inset-0 bg-lurik-stripes-light opacity-10" />
            <div className="flex items-center gap-3 relative z-10">
              <div className="w-10 h-10 rounded-xl bg-desa-accent/30 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-heading text-lg font-bold text-white">
                  {isSuccess ? 'Bukti Pemesanan Pasar Desa' : 'Checkout & Pembayaran'}
                </h3>
                <p className="text-xs text-desa-light/75">
                  {isSuccess 
                    ? (isPersisted ? '✓ Transaksi resmi terverifikasi dan masuk ke database' : 'Simulasi Pesanan Mode Demo') 
                    : 'Pilih alamat pengiriman, kurir kecamatan, dan metode pembayaran'}
                </p>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-desa-light transition-colors relative z-10 focus-visible:ring-2 focus-visible:ring-desa-accent focus-visible:outline-none"
              aria-label="Tutup jendela checkout"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="no-print">
            <LurikDivider variant="accent" />
          </div>

          {/* MAIN CONTENT AREA */}
          <AnimatePresence mode="wait">
          {isSuccess ? (
            <motion.div key="success-receipt" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }} className="flex-1 flex flex-col overflow-y-auto">
            {/* HASIL PEMBAYARAN / STRUK BUKTI RESMI */}
            <div className="p-6 sm:p-8 space-y-6 overflow-y-auto print:p-0 print:space-y-4 print:overflow-visible" aria-live="polite">
              
              {/* Header Sukses (hanya di layar aplikasi, disembunyikan saat cetak fisik) */}
              <div className="text-center space-y-2 no-print">
                <div className="w-16 h-16 rounded-full bg-desa-highlight/20 text-desa-highlight flex items-center justify-center mx-auto border-2 border-desa-highlight/30 shadow-xs">
                  <CheckCircle2 className="w-9 h-9" />
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-desa-highlight/15 text-desa-highlight border border-desa-highlight/30">
                  <Database className="w-3.5 h-3.5" />
                  <span>{isPersisted ? 'Tersimpan Resmi di Database Pasar Desa (MySQL)' : 'Tersimpan di Sesi Lokal'}</span>
                </div>

                <h2 className="font-heading text-2xl font-bold text-desa-primary">
                  Matur Nuwun! Pembayaran Berhasil Diterima
                </h2>
                <p className="text-xs text-desa-text/75 max-w-md mx-auto">
                  {isPersisted
                    ? 'Pesanan Anda telah dicatat ke database BUMDes dan diteruskan ke toko pengrajin desa untuk dipersiapkan.'
                    : 'Pesanan tersimpan di memori sesi demo.'}
                </p>
              </div>

              {/* DOKUMEN BUKTI NOTA PEMBAYARAN (Hanya elemen ini yang dicetak saat print) */}
              <div 
                id="printable-receipt" 
                className="max-w-xl mx-auto bg-white rounded-2xl p-6 sm:p-7 border border-desa-primary/20 shadow-sm space-y-5 print:max-w-none print:w-full print:border-none print:p-0"
              >
                
                {/* Kop / Header Nota Resmi Pasar Desa */}
                <div className="border-b-2 border-desa-primary/20 pb-4 text-center space-y-1">
                  <div className="flex items-center justify-center gap-2">
                    <Store className="w-5 h-5 text-desa-accent" />
                    <h3 className="font-heading text-lg font-bold text-desa-primary tracking-wide uppercase">
                      Pasar Desa Mandiri
                    </h3>
                  </div>
                  <p className="text-[11px] text-desa-text/70">
                    BUMDes Berkah Mandiri • Wilayah Desa Kabupaten Sumedang, Jawa Barat
                  </p>
                  <div className="pt-2">
                    <span className="inline-block px-3 py-0.5 rounded-full bg-desa-highlight/15 text-desa-highlight text-xs font-bold uppercase tracking-wider border border-desa-highlight/30">
                      Bukti Transaksi & Pembayaran Sah
                    </span>
                  </div>
                </div>

                {/* Metadata Pesanan */}
                <div className="grid grid-cols-2 gap-3 py-2 text-xs border-b border-dashed border-desa-primary/20">
                  <div>
                    <span className="text-[11px] text-desa-text/60 uppercase tracking-wider block font-medium">Nomor Pesanan</span>
                    <span className="font-mono font-bold text-sm text-desa-accent">#{completedOrder?.orderId || createdOrderId}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] text-desa-text/60 uppercase tracking-wider block font-medium">Waktu Transaksi</span>
                    <span className="font-semibold text-desa-primary">
                      {completedOrder?.dateFormatted || 'Hari ini'}, {completedOrder?.timeFormatted || ''} WIB
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] text-desa-text/60 uppercase tracking-wider block font-medium">Metode Pembayaran</span>
                    <span className="font-bold text-desa-primary">{displayPayment.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] text-desa-text/60 uppercase tracking-wider block font-medium">Status Pembayaran</span>
                    <span className="font-bold text-desa-highlight">LUNAS / TERVERIFIKASI</span>
                  </div>
                </div>

                {/* Data Pembeli & Alamat Pengiriman */}
                <div className="py-2 text-xs border-b border-dashed border-desa-primary/20 space-y-1">
                  <span className="text-[11px] text-desa-text/60 uppercase tracking-wider font-semibold block">Tujuan Pengiriman</span>
                  <p className="font-bold text-desa-primary">
                    {displayAddress?.receiverName} <span className="font-normal text-desa-text/70">({displayAddress?.phone})</span>
                  </p>
                  <p className="text-desa-text/80 text-[11px] leading-snug">
                    {displayAddress?.fullAddress} {displayAddress?.notes ? `(Patokan: ${displayAddress.notes})` : ''}
                  </p>
                  <p className="text-[11px] text-desa-text/70 pt-0.5">
                    Kurir: <strong className="text-desa-primary">{displayShipping.name}</strong> • Estimasi: {displayShipping.eta}
                  </p>
                </div>

                {/* Rincian Produk Belanja */}
                <div className="py-2 space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-desa-text/60 block">
                    Daftar Barang Belanja ({displayItems.length} Produk)
                  </span>
                  
                  <div className="space-y-2">
                    {displayItems.map((item, idx) => {
                      const itemName = item.productName || item.product?.name || 'Produk Desa';
                      const itemPrice = Number(item.price || item.product?.price || 0);
                      const itemQty = Number(item.qty || 1);
                      const itemTotal = Number(item.itemTotal || (itemPrice * itemQty));
                      const itemShop = item.shopName || item.product?.shopName || 'UMKM Desa';

                      return (
                        <div key={idx} className="flex items-center justify-between text-xs py-1.5 border-b border-desa-primary/5 last:border-0">
                          <div className="pr-2 min-w-0">
                            <span className="font-bold text-desa-primary block truncate">{itemName}</span>
                            <span className="text-[11px] text-desa-text/60">
                              {itemQty} x Rp {itemPrice.toLocaleString('id-ID')} • Toko: {itemShop}
                            </span>
                          </div>
                          <span className="font-bold text-desa-primary shrink-0">
                            Rp {itemTotal.toLocaleString('id-ID')}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Ringkasan Keuangan (Subtotal + Ongkir = Total) */}
                <div className="pt-3 border-t-2 border-desa-primary/20 space-y-1.5 text-xs bg-desa-bg/40 p-3.5 rounded-xl print:bg-white print:border print:border-black/20">
                  <div className="flex justify-between text-desa-text">
                    <span>Total Harga Barang (Subtotal)</span>
                    <span className="font-bold text-desa-primary">Rp {displaySubtotal.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between text-desa-text">
                    <span>Biaya Jasa Pengiriman ({displayShipping.name})</span>
                    <span className="font-bold text-desa-primary">
                      {Number(displayShipping.price) === 0 ? 'Gratis' : `Rp ${Number(displayShipping.price).toLocaleString('id-ID')}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-desa-text/70">
                    <span>Biaya Layanan BUMDes</span>
                    <span className="font-semibold text-desa-highlight">Rp 0 (Kas Desa)</span>
                  </div>
                  
                  {/* TOTAL AKHIR TRANSAKSI (HARGA BARANG + ONGKIR) */}
                  <div className="pt-2 mt-1 border-t-2 border-dashed border-desa-primary/20 flex justify-between items-center text-sm font-bold text-desa-primary">
                    <span className="font-heading text-sm">TOTAL PEMBAYARAN</span>
                    <span className="font-mono text-base text-desa-accent">
                      Rp {displayGrandTotal.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>

                {/* Footer Keterangan Nota */}
                <div className="pt-2 text-center text-[10px] text-desa-text/60 border-t border-desa-primary/10">
                  <p>Matur nuwun telah berbelanja di Pasar Desa Mandiri.</p>
                  <p>Transaksi ini sah dan tercatat pada pembukuan BUMDes Berkah Mandiri.</p>
                </div>
              </div>

              {/* Action Buttons (disembunyikan saat dicetak) */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2 no-print">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-5 py-2.5 rounded-xl border border-desa-primary/20 bg-white hover:bg-desa-bg text-desa-primary text-xs font-semibold transition-colors flex items-center gap-2 shadow-xs focus-visible:ring-2 focus-visible:ring-desa-accent focus-visible:outline-none"
                >
                  <Printer className="w-4 h-4 text-desa-accent" />
                  <span>Cetak / Simpan Nota</span>
                </button>

                <button
                  type="button"
                  onClick={handleClose}
                  className="px-7 py-2.5 rounded-xl bg-desa-primary text-white text-xs font-bold hover:bg-desa-accent transition-colors shadow-md focus-visible:ring-2 focus-visible:ring-desa-accent focus-visible:outline-none"
                >
                  Selesai & Lanjut Belanja
                </button>
              </div>
            </div>
            </motion.div>
          ) : (
            <motion.div key="checkout-form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="flex-1 flex flex-col overflow-hidden">
            {/* FORM CHECKOUT */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
              
              {/* 1. Alamat Pengiriman */}
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
                    className="flex items-center gap-1 text-[11px] font-semibold text-desa-accent hover:underline focus-visible:ring-2 focus-visible:ring-desa-accent focus-visible:outline-none rounded-md px-1"
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
                        className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 focus-visible:ring-2 focus-visible:ring-desa-accent focus-visible:outline-none ${
                          isSelected
                            ? 'bg-desa-accent/5 border-desa-accent shadow-xs'
                            : 'bg-desa-bg/30 border-desa-primary/10 hover:border-desa-primary/30'
                        }`}
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            setSelectedAddressId(addr.id);
                          }
                        }}
                        role="radio"
                        aria-checked={isSelected}
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
                            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-desa-primary/10 text-desa-primary hover:bg-desa-accent hover:text-white text-[10px] font-semibold transition-colors focus-visible:ring-1 focus-visible:ring-desa-accent"
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

              {/* 2. Ringkasan Produk */}
              <div className="bg-white rounded-2xl p-4 sm:p-5 border border-desa-primary/10 shadow-xs">
                <div className="flex items-center gap-2 pb-3 border-b border-desa-primary/10 mb-3">
                  <Store className="w-4 h-4 text-desa-accent" />
                  <h4 className="text-xs font-bold text-desa-primary uppercase tracking-wider">
                    Ringkasan Produk Belanja ({checkoutItems.length} Produk)
                  </h4>
                </div>

                <div className="space-y-3">
                  {checkoutItems.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 pb-3 border-b border-desa-primary/5 last:border-0 last:pb-0">
                      <img
                        src={item.product?.images?.[0] || '/kain-lurik.jpg'}
                        alt={item.product?.name}
                        className="w-14 h-14 object-cover rounded-xl border border-desa-primary/10"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="text-[11px] text-desa-text/60">{item.product?.shopName}</span>
                        <h5 className="text-xs font-bold text-desa-primary truncate">{item.product?.name}</h5>
                        <p className="text-xs text-desa-text/70 mt-0.5">
                          {item.qty} x Rp {item.product?.price?.toLocaleString('id-ID')}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold text-desa-accent">
                          Rp {(item.product?.price * item.qty).toLocaleString('id-ID')}
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

              {/* 3. Metode Pengiriman */}
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
                        className={`p-3 rounded-xl border cursor-pointer transition-all flex flex-col justify-between focus-visible:ring-2 focus-visible:ring-desa-accent focus-visible:outline-none ${
                          isSelected
                            ? 'bg-desa-accent/5 border-desa-accent shadow-xs'
                            : 'bg-desa-bg/20 border-desa-primary/10 hover:border-desa-primary/30'
                        }`}
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            setSelectedShippingId(sm.id);
                          }
                        }}
                        role="radio"
                        aria-checked={isSelected}
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

              {/* 4. METODE PEMBAYARAN + DUMMY QRIS DEMO */}
              <div className="bg-white rounded-2xl p-4 sm:p-5 border border-desa-primary/10 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-desa-primary/10">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-desa-accent" />
                    <h4 className="text-xs font-bold text-desa-primary uppercase tracking-wider">
                      Pilihan Metode Pembayaran
                    </h4>
                  </div>
                  <span className="text-[10px] font-semibold text-desa-highlight bg-desa-highlight/10 px-2 py-0.5 rounded-full">
                    Aman & Terintegrasi
                  </span>
                </div>

                {/* List Radio Pilihan Pembayaran */}
                <div className="space-y-2.5">
                  {PAYMENT_METHODS.map((pm) => {
                    const isSelected = pm.id === selectedPaymentId;
                    return (
                      <div
                        key={pm.id}
                        onClick={() => setSelectedPaymentId(pm.id)}
                        className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between gap-3 focus-visible:ring-2 focus-visible:ring-desa-accent focus-visible:outline-none ${
                          isSelected
                            ? 'bg-desa-accent/5 border-desa-accent shadow-xs'
                            : 'bg-desa-bg/20 border-desa-primary/10 hover:border-desa-primary/30'
                        }`}
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            setSelectedPaymentId(pm.id);
                          }
                        }}
                        role="radio"
                        aria-checked={isSelected}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                            isSelected ? 'border-desa-accent' : 'border-desa-primary/30'
                          }`}>
                            {isSelected && <div className="w-2 h-2 rounded-full bg-desa-accent" />}
                          </div>
                          <div>
                            <span className="text-xs font-bold text-desa-primary">{pm.name}</span>
                            <p className="text-[11px] text-desa-text/70 mt-0.5">{pm.desc}</p>
                          </div>
                        </div>

                        <span className="text-[10px] font-semibold px-2.5 py-1 rounded-md bg-desa-primary/10 text-desa-primary shrink-0">
                          {pm.type}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* PANEL KHUSUS: DUMMY QRIS DEMO */}
                {selectedPaymentId === 'qris-desa' && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-white to-desa-bg/40 border-2 border-desa-accent/30 shadow-sm"
                  >
                    <div className="flex flex-col sm:flex-row items-center gap-5 justify-between">
                      {/* Sisi Kiri: Visual Dummy QR Code */}
                      <div className="flex flex-col items-center text-center shrink-0">
                        <DummyQrSvg amount={grandTotal} size={170} />
                        <span className="text-[10px] text-desa-text/60 mt-3 font-mono">
                          NMID: ID1020268899120
                        </span>
                      </div>

                      {/* Sisi Kanan: Detail Merchant & Instruksi Demo */}
                      <div className="flex-1 space-y-3 text-xs text-left">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-desa-accent text-white uppercase tracking-wider">
                            QRIS Nasional
                          </span>
                          <span className="text-[10px] font-semibold text-desa-highlight bg-desa-highlight/15 px-2 py-0.5 rounded-full">
                            Demo Simulasi
                          </span>
                        </div>

                        <div>
                          <h5 className="font-bold text-sm text-desa-primary">BUMDes Pasar Desa Mandiri</h5>
                          <p className="text-[11px] text-desa-text/70">Kabupaten Sumedang, Jawa Barat</p>
                        </div>

                        <div className="p-2.5 rounded-xl bg-desa-accent/5 border border-desa-accent/20 space-y-1">
                          <div className="flex justify-between items-center text-desa-text">
                            <span className="text-[11px]">Total Tagihan:</span>
                            <span className="text-sm font-bold text-desa-accent">Rp {grandTotal.toLocaleString('id-ID')}</span>
                          </div>
                          <p className="text-[10px] text-desa-text/60 leading-snug">
                            Harga barang (Rp {subtotal.toLocaleString('id-ID')}) + Ongkir (Rp {shippingPrice.toLocaleString('id-ID')})
                          </p>
                        </div>

                        <div className="text-[11px] text-desa-text/80 space-y-1">
                          <p className="font-semibold text-desa-primary flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-desa-accent" />
                            <span>Cara Kerja Demo:</span>
                          </p>
                          <p className="text-[10px] text-desa-text/70 leading-relaxed">
                            Barcode di atas adalah simulasi QRIS. Cukup klik tombol <strong>"Konfirmasi & Bayar Sekarang"</strong> di bawah untuk mensimulasikan pembayaran lunas dan langsung mencatat pesanan ke database MySQL backend!
                          </p>
                        </div>

                        <div className="pt-2 flex flex-wrap gap-1.5 opacity-80">
                          {['BCA', 'Mandiri', 'BRI', 'GoPay', 'OVO', 'DANA', 'ShopeePay'].map((app) => (
                            <span key={app} className="text-[9px] px-1.5 py-0.5 rounded bg-desa-primary/5 text-desa-primary font-medium border border-desa-primary/10">
                              {app}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* PANEL KHUSUS: TRANSFER BANK */}
                {selectedPaymentId === 'transfer-bank' && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-xl bg-desa-primary/5 border border-desa-primary/20 space-y-3 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-desa-accent" />
                        <span className="font-bold text-desa-primary">Rekening Resmi BUMDes Mandiri</span>
                      </div>
                      <span className="text-[10px] font-semibold text-desa-highlight bg-desa-highlight/15 px-2 py-0.5 rounded-full">
                        Bank BRI / Bank Jateng
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-white rounded-xl border border-desa-primary/10">
                      <div>
                        <span className="text-[10px] text-desa-text/60 block">Nomor Rekening:</span>
                        <span className="font-mono text-base font-bold text-desa-primary">1029-3847-5678-001</span>
                        <p className="text-[11px] text-desa-text/70 mt-0.5">a/n BUMDes Berkah Mandiri Pasar Desa</p>
                      </div>

                      <button
                        type="button"
                        onClick={() => copyRekening('102938475678001')}
                        className="px-3 py-1.5 rounded-lg bg-desa-primary text-white text-[11px] font-semibold hover:bg-desa-accent transition-colors flex items-center justify-center gap-1.5 self-start sm:self-auto shrink-0"
                      >
                        {isCopiedRek ? <Check className="w-3.5 h-3.5 text-desa-highlight" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{isCopiedRek ? 'Tersalin!' : 'Salin Rekening'}</span>
                      </button>
                    </div>

                    <p className="text-[11px] text-desa-text/70 leading-snug">
                      Transfer tepat sejumlah <strong>Rp {grandTotal.toLocaleString('id-ID')}</strong> (Barang: Rp {subtotal.toLocaleString('id-ID')} + Ongkir: Rp {shippingPrice.toLocaleString('id-ID')}).
                    </p>
                  </motion.div>
                )}

                {/* PANEL KHUSUS: COD (BAYAR DI TEMPAT) */}
                {selectedPaymentId === 'cod-desa' && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-xl bg-desa-bg border border-desa-primary/15 space-y-2 text-xs"
                  >
                    <div className="flex items-center gap-2 text-desa-primary font-bold">
                      <Banknote className="w-4 h-4 text-desa-accent" />
                      <span>Bayar Tunai ke Kurir Desa</span>
                    </div>
                    <p className="text-[11px] text-desa-text/80 leading-relaxed">
                      Siapkan uang tunai pas sebesar <strong>Rp {grandTotal.toLocaleString('id-ID')}</strong> (Barang: Rp {subtotal.toLocaleString('id-ID')} + Ongkir: Rp {shippingPrice.toLocaleString('id-ID')}) saat Kurir Kilat Desa Mandiri tiba di alamat Anda.
                    </p>
                  </motion.div>
                )}
              </div>

              {/* 5. Rincian Biaya Final */}
              <div className="p-4 bg-desa-primary/5 rounded-2xl border border-desa-primary/10 space-y-2 text-xs">
                <div className="flex justify-between text-desa-text/70">
                  <span>Subtotal Produk ({checkoutItems.reduce((acc, i) => acc + (Number(i.qty) || 1), 0)} item)</span>
                  <span className="font-semibold text-desa-primary">Rp {subtotal.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-desa-text/70">
                  <span>Biaya Pengiriman ({selectedShipping.name})</span>
                  <span className="font-semibold text-desa-primary">
                    {shippingPrice === 0 ? 'Gratis' : `Rp ${shippingPrice.toLocaleString('id-ID')}`}
                  </span>
                </div>
                <div className="flex justify-between text-desa-text/70">
                  <span>Biaya Layanan BUMDes</span>
                  <span className="font-semibold text-desa-highlight">Rp 0 (Didukung Kas Desa)</span>
                </div>
                <div className="pt-2 border-t border-desa-primary/15 flex justify-between items-center text-sm font-bold text-desa-primary">
                  <span>Total Tagihan Akhir</span>
                  <span className="text-base text-desa-accent">Rp {grandTotal.toLocaleString('id-ID')}</span>
                </div>
              </div>
            </div>

            {/* FOOTER ACTIONS (disembunyikan saat cetak) */}
            <div className="p-4 sm:p-5 bg-white border-t border-desa-primary/10 flex items-center justify-between gap-4 no-print">
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
                  className="flex-1 sm:flex-initial px-5 py-3 rounded-xl border border-desa-primary/20 text-xs font-semibold text-desa-primary hover:bg-desa-bg transition-colors focus-visible:ring-2 focus-visible:ring-desa-accent focus-visible:outline-none"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleConfirmOrder}
                  disabled={isSubmitting}
                  aria-busy={isSubmitting}
                  className="flex-2 sm:flex-initial px-7 py-3 rounded-xl bg-desa-accent text-white text-xs font-bold hover:bg-desa-accent/90 transition-all shadow-md flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-desa-accent focus-visible:outline-none disabled:opacity-60"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{isSubmitting ? 'Menyimpan Pesanan…' : 'Konfirmasi & Bayar Sekarang'}</span>
                </button>
              </div>
            </div>
            </motion.div>
          )}
          </AnimatePresence>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
