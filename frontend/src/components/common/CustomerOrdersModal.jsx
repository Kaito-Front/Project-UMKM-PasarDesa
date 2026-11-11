import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package, 
  X, 
  Clock, 
  Truck, 
  CheckCircle2, 
  AlertCircle, 
  Store, 
  MapPin, 
  ChevronRight, 
  Check, 
  FileText, 
  MessageSquare, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function CustomerOrdersModal() {
  const { 
    isOrdersModalOpen, 
    closeOrdersModal, 
    orders, 
    updateOrderStatus, 
    triggerNotification, 
    shootConfetti,
    setIsChatOpen,
    currentUser,
    setWebPage
  } = useApp();

  const [filterStatus, setFilterStatus] = useState('semua');
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [confirmingId, setConfirmingId] = useState(null);

  if (!isOrdersModalOpen) return null;

  // Filter orders for current user or display all customer orders
  const customerOrders = orders.filter(order => {
    if (!currentUser) return true;
    if (currentUser.role === 'admin') return true;
    // Match phone or buyer name
    return (
      (currentUser.phone && order.phone === currentUser.phone) ||
      (currentUser.name && order.buyerName?.toLowerCase().includes(currentUser.name.toLowerCase())) ||
      true // fallback to showing recent orders for smooth demo experience
    );
  });

  const filteredOrders = customerOrders.filter(order => {
    if (filterStatus === 'semua') return true;
    if (filterStatus === 'diproses') return order.status === 'diproses';
    if (filterStatus === 'dikirim') return order.status === 'dikirim';
    if (filterStatus === 'selesai') return ['selesai', 'diambil'].includes(order.status);
    if (filterStatus === 'ditolak') return order.status === 'ditolak';
    return true;
  });

  const countDiproses = customerOrders.filter(o => o.status === 'diproses').length;
  const countDikirim = customerOrders.filter(o => o.status === 'dikirim').length;
  const countSelesai = customerOrders.filter(o => ['selesai', 'diambil'].includes(o.status)).length;

  const handleConfirmReceived = async (orderId) => {
    setConfirmingId(orderId);
    try {
      await updateOrderStatus(orderId, 'selesai');
      shootConfetti();
      triggerNotification(
        'Pesanan Diterima!',
        `Terima kasih! Pesanan #${orderId} telah dikonfirmasi selesai diterima. Selamat menikmati produk desa.`
      );
    } finally {
      setConfirmingId(null);
    }
  };

  const getStepProgress = (status) => {
    switch (status) {
      case 'diproses':
        return 2;
      case 'dikirim':
        return 3;
      case 'selesai':
      case 'diambil':
        return 4;
      case 'ditolak':
        return 0;
      default:
        return 1;
    }
  };

  const trackingSteps = [
    { step: 1, title: 'Pesanan Diterima', desc: 'BUMDes mencatat pesanan' },
    { step: 2, title: 'Diproses Pengrajin', desc: 'Bahan disiapkan & dikemas' },
    { step: 3, title: 'Dalam Pengiriman', desc: 'Kurir desa menuju alamat' },
    { step: 4, title: 'Pesanan Selesai', desc: 'Barang diterima warga' },
  ];

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-[#163324]/40 backdrop-blur-md"
        onClick={closeOrdersModal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-orders-title"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 16 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-3xl max-h-[90vh] flex flex-col bg-[#FBF8F3]/92 backdrop-blur-2xl rounded-3xl border border-white/95 shadow-[0_24px_60px_rgba(22,51,36,0.18),inset_0_1px_2px_rgba(255,255,255,0.95)] overflow-hidden"
        >
          {/* Top Liquid Glass Highlight Bar */}
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-desa-accent via-desa-highlight to-desa-accent opacity-80" />

          {/* Modal Header */}
          <div className="p-5 sm:p-6 border-b border-desa-border/70 bg-white/60 backdrop-blur-md flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-desa-primary text-[#FBF8F3] flex items-center justify-center shadow-xs">
                <Package className="w-5 h-5 text-desa-accent" />
              </div>
              <div>
                <h2 id="modal-orders-title" className="font-heading font-black text-xl sm:text-2xl text-desa-primary tracking-tight">
                  Pesanan <span className="font-script font-normal text-2xl sm:text-3xl text-desa-accent">Saya</span>
                </h2>
                <p className="text-xs text-desa-muted mt-0.5">
                  Pantau proses pengerjaan pengrajin & pengiriman kurir desa secara real-time
                </p>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={closeOrdersModal}
              className="p-2 rounded-full hover:bg-black/5 text-desa-muted hover:text-desa-primary transition-colors cursor-pointer"
              aria-label="Tutup jendela pesanan"
            >
              <X className="w-5 h-5" />
            </motion.button>
          </div>

          {/* Filter Pills */}
          <div className="px-5 sm:px-6 py-3 border-b border-desa-border/50 bg-white/40 backdrop-blur-sm flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
            {[
              { id: 'semua', label: 'Semua', count: customerOrders.length },
              { id: 'diproses', label: 'Diproses', count: countDiproses, color: 'text-amber-800 bg-amber-500/15' },
              { id: 'dikirim', label: 'Dalam Pengiriman', count: countDikirim, color: 'text-blue-800 bg-blue-500/15' },
              { id: 'selesai', label: 'Selesai', count: countSelesai, color: 'text-emerald-800 bg-emerald-500/15' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilterStatus(tab.id)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  filterStatus === tab.id
                    ? 'bg-desa-primary text-white shadow-xs'
                    : 'bg-white/80 hover:bg-white text-desa-muted hover:text-desa-primary border border-desa-border/70'
                }`}
              >
                <span>{tab.label}</span>
                {tab.count > 0 && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                    filterStatus === tab.id ? 'bg-white/20 text-white' : (tab.color || 'bg-black/5 text-desa-muted')
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Orders Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {filteredOrders.length === 0 ? (
              <div className="py-16 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-desa-primary/10 text-desa-primary mx-auto flex items-center justify-center">
                  <Package className="w-8 h-8 text-desa-accent" />
                </div>
                <div className="max-w-xs mx-auto">
                  <h3 className="font-heading font-bold text-base text-desa-primary">Belum Ada Pesanan</h3>
                  <p className="text-xs text-desa-muted mt-1 leading-relaxed">
                    Pesanan produk UMKM desa yang Anda beli akan muncul dan dapat dipantau di sini secara real-time.
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    closeOrdersModal();
                    setWebPage('catalog');
                  }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-desa-accent text-white text-xs font-bold shadow-xs hover:bg-desa-accent/90 transition-all cursor-pointer"
                >
                  <span>Mulai Belanja Produk Desa</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </motion.button>
              </div>
            ) : (
              filteredOrders.map(order => {
                const currentStep = getStepProgress(order.status);
                const isExpanded = expandedOrderId === order.id;

                return (
                  <motion.div
                    key={order.id}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/95 shadow-[0_8px_24px_rgba(22,51,36,0.06),inset_0_1px_1px_rgba(255,255,255,0.9)] overflow-hidden transition-all hover:shadow-[0_12px_32px_rgba(22,51,36,0.1)]"
                  >
                    {/* Order Top Meta */}
                    <div className="p-4 sm:p-5 border-b border-desa-border/50 flex flex-wrap items-center justify-between gap-3 bg-white/40">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="font-mono font-bold text-xs bg-desa-primary/10 text-desa-primary px-2.5 py-1 rounded-lg">
                          #{order.id}
                        </span>
                        <div className="flex items-center gap-1.5 text-xs text-desa-muted font-medium">
                          <Store className="w-3.5 h-3.5 text-desa-accent" />
                          <span className="font-bold text-desa-primary">{order.shopName || 'Sentra UMKM Desa'}</span>
                          <span>•</span>
                          <span>{order.date || 'Hari ini'}</span>
                        </div>
                      </div>

                      {/* Status Badge */}
                      <div>
                        {order.status === 'diproses' && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-800 border border-amber-300/40">
                            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                            Diproses Pengrajin
                          </span>
                        )}
                        {order.status === 'dikirim' && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/15 text-blue-800 border border-blue-300/40">
                            <Truck className="w-3.5 h-3.5 animate-bounce" />
                            Dalam Pengiriman Kurir
                          </span>
                        )}
                        {['selesai', 'diambil'].includes(order.status) && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-800 border border-emerald-300/40">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Pesanan Selesai
                          </span>
                        )}
                        {order.status === 'ditolak' && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/15 text-rose-800 border border-rose-300/40">
                            <AlertCircle className="w-3.5 h-3.5" />
                            Pesanan Dibatalkan
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Progress Tracker (Apple-Minimal Timeline) */}
                    {order.status !== 'ditolak' && (
                      <div className="px-4 sm:px-6 py-4 bg-desa-bg/30 border-b border-desa-border/40">
                        <div className="relative flex items-center justify-between">
                          {/* Connecting Bar */}
                          <div className="absolute top-1/2 left-4 right-4 -translate-y-1/2 h-0.5 bg-gray-200 -z-0" />
                          <div 
                            className="absolute top-1/2 left-4 -translate-y-1/2 h-0.5 bg-desa-accent transition-all duration-500 -z-0"
                            style={{ 
                              width: `${((Math.max(1, currentStep) - 1) / (trackingSteps.length - 1)) * 100}%` 
                            }}
                          />

                          {trackingSteps.map((s) => {
                            const isDone = s.step < currentStep;
                            const isCurrent = s.step === currentStep;
                            return (
                              <div key={s.step} className="relative z-10 flex flex-col items-center">
                                <motion.div
                                  animate={isCurrent ? { scale: [1, 1.15, 1] } : { scale: 1 }}
                                  transition={{ repeat: isCurrent ? Infinity : 0, duration: 2.2 }}
                                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-xs ${
                                    isDone 
                                      ? 'bg-desa-accent text-white ring-2 ring-white' 
                                      : isCurrent 
                                      ? 'bg-desa-primary text-white ring-4 ring-desa-primary/20' 
                                      : 'bg-white text-desa-muted border border-desa-border'
                                  }`}
                                >
                                  {isDone ? <Check className="w-4 h-4 stroke-[3]" /> : s.step}
                                </motion.div>
                                <span className={`text-[10px] sm:text-[11px] font-bold mt-1.5 text-center transition-colors max-w-[70px] sm:max-w-[100px] leading-tight ${
                                  isCurrent ? 'text-desa-primary font-black' : isDone ? 'text-desa-accent' : 'text-desa-muted'
                                }`}>
                                  {s.title}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Order Item & Price Overview */}
                    <div className="p-4 sm:p-5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="space-y-1">
                          <h4 className="font-heading font-bold text-sm sm:text-base text-desa-primary">
                            {order.productName}
                          </h4>
                          <p className="text-xs text-desa-muted">
                            Jumlah: <span className="font-bold text-desa-primary">{order.qty} barang</span>
                            {order.shippingMethod && ` • Pengiriman: ${order.shippingMethod}`}
                          </p>
                        </div>
                        <div className="text-left sm:text-right shrink-0">
                          <span className="text-[10px] text-desa-muted font-medium block">Total Pembayaran</span>
                          <span className="font-heading font-black text-base sm:text-lg text-desa-primary">
                            Rp {order.total ? order.total.toLocaleString('id-ID') : '0'}
                          </span>
                        </div>
                      </div>

                      {/* Expandable Order Details */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="mt-4 pt-4 border-t border-desa-border/50 space-y-3 text-xs"
                          >
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white/70 p-3.5 rounded-xl border border-desa-border/50">
                              <div>
                                <span className="text-[11px] font-bold text-desa-muted block mb-1">
                                  Penerima & Alamat Tujuan:
                                </span>
                                <p className="font-bold text-desa-primary">{order.buyerName} ({order.phone})</p>
                                <p className="text-desa-muted mt-0.5 leading-relaxed">
                                  <MapPin className="w-3 h-3 inline mr-1 text-desa-accent" />
                                  {order.address || 'Alamat pembeli terdaftar'}
                                </p>
                                {order.kecamatan && (
                                  <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-desa-primary/10 text-desa-primary">
                                    {order.kecamatan}
                                  </span>
                                )}
                              </div>
                              <div>
                                <span className="text-[11px] font-bold text-desa-muted block mb-1">
                                  Metode & Logistik BUMDes:
                                </span>
                                <p className="font-medium text-desa-primary">
                                  Pembayaran: <span className="font-bold">{order.paymentMethod || 'Bayar di Tempat (COD)'}</span>
                                </p>
                                <p className="font-medium text-desa-primary mt-0.5">
                                  No. Surat Jalan: <span className="font-mono font-bold text-desa-accent">SMD-EXP-{order.id.replace('ORD-', '')}</span>
                                </p>
                                {order.notes && (
                                  <p className="text-desa-muted mt-1 italic">
                                    Catatan: "{order.notes}"
                                  </p>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Card Footer Actions */}
                      <div className="mt-4 pt-3 border-t border-desa-border/40 flex flex-wrap items-center justify-between gap-2">
                        <button
                          onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                          className="inline-flex items-center gap-1 text-xs font-bold text-desa-accent hover:underline cursor-pointer"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>{isExpanded ? 'Sembunyikan Rincian' : 'Lihat Rincian & Surat Jalan'}</span>
                          <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isExpanded ? '-rotate-90' : 'rotate-90'}`} />
                        </button>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              closeOrdersModal();
                              setIsChatOpen(true);
                            }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-desa-border bg-white text-xs font-semibold text-desa-primary hover:bg-black/5 transition-colors cursor-pointer"
                            title="Tanya Admin Desa tentang pesanan ini"
                          >
                            <MessageSquare className="w-3.5 h-3.5 text-desa-accent" />
                            <span>Tanya BUMDes</span>
                          </button>

                          {order.status === 'dikirim' && (
                            <motion.button
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.97 }}
                              disabled={confirmingId === order.id}
                              onClick={() => handleConfirmReceived(order.id)}
                              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>{confirmingId === order.id ? 'Memproses...' : 'Konfirmasi Pesanan Diterima'}</span>
                            </motion.button>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>

          {/* Modal Footer (Support Callout) */}
          <div className="p-3.5 sm:p-4 border-t border-desa-border/60 bg-white/70 backdrop-blur-md flex items-center justify-between text-xs text-desa-muted shrink-0">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-desa-accent" />
              <span>Status pesanan terhubung langsung dengan sistem admin & kurir desa Sumedang.</span>
            </div>
            <button
              onClick={closeOrdersModal}
              className="px-4 py-1.5 rounded-xl bg-desa-primary text-white text-xs font-bold hover:bg-desa-primary/90 transition-colors cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
