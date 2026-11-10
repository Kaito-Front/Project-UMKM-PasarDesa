import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import MonthlyPerformanceChart from './MonthlyPerformanceChart';
import LurikDivider from '../../components/common/LurikDivider';
import { LiquidGlassContainer, LiquidGlassButton } from '../../components/common/LiquidGlass';
import { 
  LayoutDashboard, 
  Store, 
  Package, 
  ShoppingBag, 
  Users, 
  FileText, 
  Bell, 
  ShieldCheck, 
  Lock, 
  LogOut, 
  CheckCircle2, 
  XCircle, 
  Eye, 
  EyeOff, 
  Search, 
  Download, 
  Plus, 
  Trash2, 
  AlertTriangle,
  Globe,
  Smartphone,
  MessageSquare,
  Printer,
  Truck,
  ExternalLink,
  Award,
  Sparkles,
  Send,
  Check,
  Clock,
  ArrowUpRight,
  Share2,
  CheckCheck,
  ChevronRight,
  Filter
} from 'lucide-react';

function AnimatedNumber({ value }) {
  const [displayed, setDisplayed] = useState(value);

  useEffect(() => {
    let startTimestamp = null;
    const startValue = typeof displayed === 'number' ? displayed : 0;
    const endValue = Number(value) || 0;
    const duration = 500;

    if (startValue === endValue) return;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setDisplayed(Math.round(startValue + (endValue - startValue) * ease));
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    const animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, [value]);

  return <>{displayed.toLocaleString('id-ID')}</>;
}

export default function AdminLayout() {
  const { 
    shops, 
    products, 
    orders, 
    users, 
    announcements, 
    categories, 
    stats,
    dataSource,
    verifyShop,
    toggleProductStatus,
    updateProductNumbers,
    broadcastAnnouncement,
    triggerNotification,
    setProducts,
    setCategories,
    setUsers,
    setCurrentView,
    currentUser,
    login,
    logout,
    chatThreads,
    sendChatMessage,
    updateOrderStatus
  } = useApp();

  const [selectedAdminThread, setSelectedAdminThread] = useState('general-bot');
  const [adminReplyText, setAdminReplyText] = useState('');
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminError, setAdminError] = useState('');
  const isAdminAuth = currentUser?.role === 'admin';
  const [adminTab, setAdminTab] = useState('dashboard');
  const [umkmFilter, setUmkmFilter] = useState('semua');
  const [userRoleFilter, setUserRoleFilter] = useState('semua');
  const [userSearch, setUserSearch] = useState('');
  const [selectedUmkmDetail, setSelectedUmkmDetail] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastTarget, setBroadcastTarget] = useState('Semua Pengguna');
  const [isUrgent, setIsUrgent] = useState(false);
  const [orderFilter, setOrderFilter] = useState('aktif');
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // New Seller-Buyer Hub State: Surat Jalan & Kurasi BUMDes
  const [selectedOrderForDispatch, setSelectedOrderForDispatch] = useState(null);
  const [curatedProductIds, setCuratedProductIds] = useState(new Set(['1', '2', '3']));
  const [approvedChatThreads, setApprovedChatThreads] = useState(new Set(['general-bot']));

  const pendingOrders = orders.filter((order) => order.status === 'diproses').slice(0, 5);

  const totalCompletedOmzet = useMemo(() => {
    const fromOrders = orders
      .filter((o) => ['diambil', 'selesai'].includes(o.status))
      .reduce((sum, o) => sum + (Number(o.total) || 0), 0);
    if (stats?.turnoverThisMonth && stats.turnoverThisMonth > fromOrders) {
      return stats.turnoverThisMonth;
    }
    return fromOrders;
  }, [stats?.turnoverThisMonth, orders]);

  const handleOrderStatus = async (order, status) => {
    setUpdatingOrderId(order.id);
    try {
      await updateOrderStatus(order.id, status);
      triggerNotification('Status Pesanan Diperbarui', `Pesanan #${order.id} kini berstatus "${orderStatusLabel[status] || status}".`);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const toggleProductCuration = (productId) => {
    setCuratedProductIds(prev => {
      const next = new Set(prev);
      if (next.has(productId)) {
        next.delete(productId);
        triggerNotification('Kurasi Dibatalkan', 'Badge "Lolos Kurasi BUMDes" telah dicabut dari produk ini.');
      } else {
        next.add(productId);
        triggerNotification('Lolos Kurasi BUMDes! ⭐', 'Produk berhasil diverifikasi & diberi sematan jaminan mutu BUMDes.');
      }
      return next;
    });
  };

  const toggleApproveChat = (threadId) => {
    setApprovedChatThreads(prev => {
      const next = new Set(prev);
      if (next.has(threadId)) {
        next.delete(threadId);
        triggerNotification('Izin Chat Dicabut', 'Akses konsultasi langsung dialihkan kembali ke moderasi bot.');
      } else {
        next.add(threadId);
        triggerNotification('Chat Disetujui! 💬', 'Pembeli kini dapat berdialog langsung tanpa hambatan.');
      }
      return next;
    });
  };

  const orderStatusLabel = {
    diproses: 'Perlu Diproses',
    diambil: 'Sudah Diambil',
    dikirim: 'Sedang Dikirim',
    selesai: 'Selesai (Beres)',
    ditolak: 'Ditolak',
  };

  const adminNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'umkm', label: 'Manajemen UMKM', icon: Store, count: shops.filter(shop => ['menunggu', 'menunggu_verifikasi'].includes(shop.status)).length },
    { id: 'produk', label: 'Produk & Kategori', icon: Package },
    { id: 'pesanan', label: 'Pesanan Warga', icon: ShoppingBag, count: orders.filter(order => order.status === 'diproses').length },
    { id: 'pengguna', label: 'Manajemen Pengguna', icon: Users },
    { id: 'laporan', label: 'Laporan & Siaran', icon: FileText },
    { id: 'pesan', label: 'Pusat Pesan & Chat', icon: MessageSquare, count: 0 },
  ];

  const pendingShops = shops
    .filter((shop) => ['menunggu', 'menunggu_verifikasi'].includes(shop.status))
    .slice(0, 5);

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setAdminError('');
    try {
      const user = await login(adminUsername, adminPassword);
      if (user.role !== 'admin') {
        await logout();
        setAdminError('Akun ini tidak memiliki akses admin pengelola BUMDes.');
        return;
      }
      triggerNotification('Login Admin Berhasil', 'Selamat datang di Panel Pengelola Balai Desa Mandiri.');
    } catch (error) {
      setAdminError(error.message);
    }
  };

  const handleSendBroadcast = (e) => {
    e.preventDefault();
    if (!broadcastTitle || !broadcastMessage) return;
    broadcastAnnouncement({
      title: broadcastTitle,
      excerpt: broadcastMessage,
      target: broadcastTarget,
      isUrgent: isUrgent,
    });
    setBroadcastTitle('');
    setBroadcastMessage('');
    triggerNotification('Siaran Terkirim 📢', 'Pengumuman telah disebarkan ke dashboard dan gawai warga.');
  };

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    const newCat = {
      id: newCategoryName.toLowerCase().replace(/\s+/g, '-'),
      name: newCategoryName,
      icon: 'LayoutGrid',
      count: 0,
      desc: 'Kategori baru binaan UMKM desa',
    };
    setCategories(prev => [...prev, newCat]);
    setNewCategoryName('');
    triggerNotification('Kategori Ditambahkan', `Kategori "${newCat.name}" berhasil dibuat.`);
  };

  const handleExportReport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "ID_Pesanan,Produk,Pembeli,UMKM,Total,Status,Tanggal\n"
      + orders.map(o => `${o.id},"${o.productName}","${o.buyerName}","${o.shopName}",${o.total},${o.status},${o.date}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `laporan_transaksi_pasar_desa_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerNotification('Ekspor Berhasil', 'Laporan transaksi berformat CSV berhasil diunduh.');
  };

  // Login Gate with Liquid Glass Aesthetic
  if (!isAdminAuth) {
    return (
      <div className="font-ui relative min-h-screen flex items-center justify-center p-4 bg-[#FBF8F3] overflow-hidden">
        {/* Ambient Refraction Blobs */}
        <div className="absolute top-1/4 -left-20 w-80 h-80 rounded-full bg-emerald-200/35 blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 rounded-full bg-amber-200/30 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 left-1/3 w-72 h-72 rounded-full bg-[#9E5335]/15 blur-3xl pointer-events-none" />

        <motion.div 
          initial={{ opacity: 0, y: 25, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: 'spring', damping: 25, stiffness: 280 }}
          className="relative z-10 w-full max-w-md"
        >
          <div className="bg-white/80 backdrop-blur-2xl rounded-3xl border border-white/90 p-7 sm:p-9 shadow-[0_20px_50px_rgba(22,51,36,0.08),inset_0_1px_1px_rgba(255,255,255,0.95)] space-y-6">
            <div className="text-center space-y-2">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#163324] to-[#0d2217] text-white shadow-lg ring-4 ring-white/60">
                <Store className="h-7 w-7" aria-hidden="true" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-[#163324]">Balai Pengelola BUMDes</h2>
              <p className="text-xs text-[#2F2F2D]/70 max-w-xs mx-auto">
                Masuk ke konsol administrasi terpadu Pasar Desa Sumedang untuk mengelola transaksi & toko mitra.
              </p>
            </div>

            <form onSubmit={handleAdminLogin} className="space-y-4">
              {adminError && (
                <motion.p 
                  initial={{ opacity: 0, y: -5 }} 
                  animate={{ opacity: 1, y: 0 }}
                  role="alert" 
                  className="rounded-xl border border-rose-200/80 bg-rose-50/90 backdrop-blur-md px-3.5 py-2.5 text-xs font-semibold text-rose-800"
                >
                  {adminError}
                </motion.p>
              )}
              
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[#163324]">
                  Email Petugas BUMDes
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    autoComplete="username"
                    value={adminUsername}
                    onChange={(e) => setAdminUsername(e.target.value)}
                    placeholder="admin@pasardesa.id"
                    className="w-full h-11 rounded-xl border border-desa-primary/20 bg-white/70 backdrop-blur-md px-3.5 text-xs text-[#163324] placeholder-[#2F2F2D]/40 transition-all focus:border-[#163324] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#163324]/20"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[#163324]">
                  Kata Sandi Petugas
                </label>
                <input
                  type="password"
                  required
                  autoComplete="current-password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-11 rounded-xl border border-desa-primary/20 bg-white/70 backdrop-blur-md px-3.5 text-xs text-[#163324] placeholder-[#2F2F2D]/40 transition-all focus:border-[#163324] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#163324]/20"
                />
              </div>

              <div className="pt-2">
                <motion.button
                  whileHover={{ scale: 1.015 }}
                  whileTap={{ scale: 0.985 }}
                  type="submit"
                  className="w-full h-11 rounded-xl bg-gradient-to-r from-[#163324] to-[#1e4632] text-white text-xs font-bold tracking-wide shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  <span>Masuk ke Konsol Pengelola</span>
                </motion.button>
              </div>
            </form>

            <div className="border-t border-[#163324]/10 pt-4 text-center">
              <button
                type="button"
                onClick={() => setCurrentView('web')}
                className="text-xs font-semibold text-[#163324]/80 hover:text-[#163324] hover:underline"
              >
                ← Kembali ke Halaman Publik Pasar Desa
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="admin-shell font-ui min-h-screen bg-[#FBF8F3] text-[#163324] flex flex-col xl:flex-row relative selection:bg-emerald-200">
      
      {/* Ambient Liquid Glass Backdrop Lighting */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-emerald-200/25 blur-3xl" />
        <div className="absolute top-1/3 -left-32 w-80 h-80 rounded-full bg-amber-200/20 blur-3xl" />
        <div className="absolute -bottom-32 right-1/4 w-96 h-96 rounded-full bg-[#9E5335]/10 blur-3xl" />
      </div>

      {/* Translucent Liquid Glass Sidebar */}
      <aside className="relative z-30 w-full shrink-0 border-b border-white/80 bg-white/75 backdrop-blur-2xl shadow-[4px_0_30px_rgba(22,51,36,0.03)] xl:sticky xl:top-0 xl:h-screen xl:w-64 xl:border-b-0 xl:border-r">
        
        {/* Logo & Header Info */}
        <div className="flex items-center justify-between px-5 py-4 xl:py-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#163324] to-[#0f241a] text-white shadow-md">
              <Store className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-bold leading-5 text-[#163324]">
                  <span className="font-script text-base text-desa-accent font-normal mr-0.5 inline-block align-baseline">P</span>asar <span className="font-script text-base text-desa-accent font-normal mr-0.5 inline-block align-baseline">D</span>esa
                </h3>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-100 text-emerald-800">
                  BUMDes
                </span>
              </div>
              <span className="text-[11px] text-[#2F2F2D]/60">Konsol Pengelola Terpadu</span>
            </div>
          </div>

          <button
            type="button"
            aria-expanded={mobileNavOpen}
            aria-controls="admin-navigation"
            onClick={() => setMobileNavOpen(v => !v)}
            className="rounded-xl border border-white/80 bg-white/80 backdrop-blur-md px-3 py-2 text-xs font-semibold text-[#163324] shadow-xs hover:bg-white xl:hidden"
          >
            {mobileNavOpen ? 'Tutup Menu' : 'Menu Navigasi'}
          </button>
        </div>

        {/* Navigation Item List */}
        <nav
          id="admin-navigation"
          aria-label="Navigasi admin"
          className={`${mobileNavOpen ? 'grid' : 'hidden'} absolute left-0 right-0 top-full gap-1.5 border-b border-white/80 bg-white/95 backdrop-blur-2xl p-3 text-xs shadow-xl xl:static xl:grid xl:border-0 xl:bg-transparent xl:p-4 xl:shadow-none`}
        >
          {adminNavItems.map(({ id, label, icon: Icon, count }) => {
            const isActive = adminTab === id;
            return (
              <button
                key={id}
                type="button"
                aria-current={isActive ? 'page' : undefined}
                onClick={() => { setAdminTab(id); setMobileNavOpen(false); }}
                className={`relative flex min-h-10 w-full items-center justify-between gap-3 rounded-xl px-3.5 text-left font-medium transition-all ${
                  isActive ? 'text-white font-bold shadow-md' : 'text-[#2F2F2D]/75 hover:bg-white/70 hover:text-[#163324]'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="adminNavActiveIndicator"
                    className="absolute inset-0 bg-gradient-to-r from-[#163324] to-[#1c3f2d] rounded-xl z-0"
                    transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                  />
                )}
                <span className="relative z-10 flex min-w-0 items-center gap-3">
                  <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-white' : 'text-[#2F2F2D]/60'}`} aria-hidden="true" />
                  <span className="truncate">{label}</span>
                </span>
                {count > 0 && (
                  <span className={`relative z-10 rounded-full px-2 py-0.5 text-center text-[10px] font-bold tabular-nums ${
                    isActive ? 'bg-[#DE3B22] text-white shadow-xs' : 'bg-[#DE3B22]/15 text-[#DE3B22]'
                  }`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}

          <div className="grid grid-cols-2 gap-2 border-t border-[#163324]/10 pt-3 xl:hidden">
            <button onClick={() => { setCurrentView('web'); setMobileNavOpen(false); }} className="min-h-10 rounded-xl border border-white/80 bg-white/80 px-3 text-xs font-semibold text-[#163324]">Website Publik</button>
            <button onClick={() => { logout(); setMobileNavOpen(false); }} className="min-h-10 rounded-xl bg-rose-50 px-3 text-xs font-semibold text-[#DE3B22]">Keluar Admin</button>
          </div>
        </nav>

        {/* Sidebar Footer Controls */}
        <div className="hidden border-t border-white/80 p-4 xl:absolute xl:bottom-0 xl:left-0 xl:right-0 xl:grid xl:gap-2 bg-white/40 backdrop-blur-md">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => setCurrentView('web')}
            className="flex min-h-9 w-full items-center gap-2.5 rounded-xl px-3 text-xs font-semibold text-[#163324]/80 hover:bg-white/80 hover:text-[#163324] transition-colors"
          >
            <Globe className="h-4 w-4 text-[#163324]/60" />
            <span>Lihat Website Publik</span>
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => logout()}
            className="flex min-h-9 w-full items-center gap-2.5 rounded-xl px-3 text-xs font-semibold text-[#DE3B22] hover:bg-rose-50 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span>Keluar Akun Admin</span>
          </motion.button>
        </div>
      </aside>

      {/* Main Content Workspace Area */}
      <div className="flex min-h-screen min-w-0 flex-1 flex-col xl:h-screen xl:overflow-hidden">
        
        {/* Floating Liquid Glass Top Header */}
        <header className="z-20 flex min-h-14 shrink-0 flex-wrap items-center justify-between gap-3 border-b border-white/80 bg-white/75 backdrop-blur-xl px-4 py-2.5 sm:px-6 xl:px-8 shadow-[0_4px_20px_rgba(22,51,36,0.02)]">
          <div className="flex min-w-0 flex-wrap items-center gap-2 sm:gap-3 text-xs">
            <span className="font-bold text-[#163324]">
              Balai Pengelola BUMDes
            </span>
            <span className="text-[#163324]/30">•</span>
            <span className="text-[#2F2F2D]/60 hidden sm:inline">
              Kab. Sumedang
            </span>
            <span className="text-[#163324]/30 hidden sm:inline">•</span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100/80 text-emerald-800 text-[11px] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Sistem Aktif Terhubung
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setCurrentView('web')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/80 border border-white/90 text-xs font-semibold text-[#163324] shadow-xs hover:bg-white"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-700" />
              <span className="hidden sm:inline">Katalog Publik</span>
            </motion.button>

            <div className="h-8 w-px bg-white/80" />

            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-xl bg-[#163324] text-white flex items-center justify-center text-xs font-bold shadow-xs">
                {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'A'}
              </div>
              <div className="hidden sm:block text-left text-xs">
                <p className="font-bold text-[#163324] leading-tight">{currentUser?.name || 'Admin BUMDes'}</p>
                <p className="text-[10px] text-[#2F2F2D]/60">Pengelola Wilayah</p>
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable View Container */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 xl:p-8">
          <AnimatePresence mode="wait">
            <motion.div 
              key={adminTab} 
              initial={{ opacity: 0, y: 8 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -8 }} 
              transition={{ duration: 0.18 }} 
              className="space-y-7 max-w-7xl mx-auto"
            >

              {/* TAB 1: DASHBOARD */}
              {adminTab === 'dashboard' && (
                <div className="space-y-6">
                  <div>
                    <h1 className="font-heading text-2xl font-bold tracking-tight text-[#163324]">
                      Ringkasan Kinerja BUMDes
                    </h1>
                    <p className="mt-1 text-xs text-[#2F2F2D]/70">
                      Pantau transaksi warga, perputaran omzet desa, dan tindakan operasional toko mitra.
                    </p>
                  </div>

                  {/* 4 Liquid Glass Stat Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      {
                        label: 'Total Omzet Selesai',
                        value: `Rp ${Number(totalCompletedOmzet).toLocaleString('id-ID')}`,
                        subtext: 'Pesanan tuntas & diambil',
                        icon: ShoppingBag,
                        accent: 'from-emerald-600/10 to-emerald-600/5',
                        textColor: 'text-emerald-800'
                      },
                      {
                        label: 'Pesanan Warga',
                        value: `${orders.filter(o => ['diambil', 'selesai'].includes(o.status)).length} / ${orders.length}`,
                        subtext: `${pendingOrders.length} butuh tindakan`,
                        icon: Package,
                        accent: 'from-amber-600/10 to-amber-600/5',
                        textColor: 'text-amber-900'
                      },
                      {
                        label: 'UMKM Terverifikasi',
                        value: shops.filter(shop => shop.status === 'aktif').length,
                        subtext: 'Mitra binaan desa',
                        icon: Store,
                        accent: 'from-sky-600/10 to-sky-600/5',
                        textColor: 'text-sky-900'
                      },
                      {
                        label: 'Produk Tayang',
                        value: products.filter(product => !product.isHidden).length,
                        subtext: `${curatedProductIds.size} lolos kurasi BUMDes`,
                        icon: Award,
                        accent: 'from-purple-600/10 to-purple-600/5',
                        textColor: 'text-purple-900'
                      },
                    ].map(({ label, value, subtext, icon: StatIcon, accent, textColor }) => (
                      <motion.div
                        key={label}
                        whileHover={{ y: -4, scale: 1.015 }}
                        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                        className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/90 p-5 shadow-[0_8px_32px_rgba(22,51,36,0.04),inset_0_1px_1px_rgba(255,255,255,0.95)] flex flex-col justify-between"
                      >
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-semibold text-[#2F2F2D]/70">{label}</p>
                          <div className={`p-2.5 rounded-xl bg-gradient-to-br ${accent} border border-white/80 shadow-xs`}>
                            <StatIcon className={`w-4 h-4 ${textColor}`} />
                          </div>
                        </div>
                        <div className="mt-3">
                          <p className={`text-2xl font-bold tracking-tight ${textColor} tabular-nums`}>
                            {value}
                          </p>
                          {subtext && <p className="mt-1 text-[11px] text-[#2F2F2D]/55 font-medium">{subtext}</p>}
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Monthly Performance Chart in Liquid Glass Panel */}
                  <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/90 p-5 sm:p-6 shadow-[0_8px_32px_rgba(22,51,36,0.04),inset_0_1px_1px_rgba(255,255,255,0.95)]">
                    <MonthlyPerformanceChart stats={stats} orders={orders} dataSource={dataSource} />
                  </div>

                  {/* Operational Quick Sections */}
                  <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-2">
                    
                    {/* Pending Orders with Seller-Buyer Fast Dispatch */}
                    <section className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/90 p-5 shadow-[0_8px_32px_rgba(22,51,36,0.04),inset_0_1px_1px_rgba(255,255,255,0.95)] space-y-4">
                      <div className="flex items-center justify-between gap-3 border-b border-[#163324]/10 pb-3">
                        <div>
                          <h3 className="text-sm font-bold text-[#163324]">Pesanan Perlu Diproses</h3>
                          <p className="text-[11px] text-[#2F2F2D]/60">Segera disposisikan ke kurir kilat desa.</p>
                        </div>
                        <button 
                          onClick={() => setAdminTab('pesanan')} 
                          className="px-2.5 py-1 rounded-lg text-xs font-semibold text-[#163324] hover:bg-white/90 transition-colors"
                        >
                          Lihat Semua →
                        </button>
                      </div>

                      {pendingOrders.length ? (
                        <div className="space-y-3">
                          {pendingOrders.map((order) => (
                            <div key={order.id} className="p-3 rounded-xl bg-white/60 border border-white/80 flex items-center justify-between gap-3">
                              <div className="min-w-0">
                                <p className="truncate text-xs font-bold text-[#163324]">{order.productName}</p>
                                <p className="text-[11px] text-[#2F2F2D]/60 mt-0.5">#{order.id} · {order.buyerName} ({order.shopName})</p>
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                <button
                                  onClick={() => setSelectedOrderForDispatch(order)}
                                  className="px-2.5 py-1.5 rounded-lg border border-emerald-600/30 bg-emerald-50 text-[10px] font-bold text-emerald-800 hover:bg-emerald-100 flex items-center gap-1"
                                >
                                  <Truck className="w-3 h-3" />
                                  <span>Surat Jalan</span>
                                </button>
                                <button
                                  disabled={updatingOrderId === order.id}
                                  onClick={() => handleOrderStatus(order, 'dikirim')}
                                  className="px-2.5 py-1.5 rounded-lg bg-[#163324] text-white text-[10px] font-bold hover:bg-[#1f4732] disabled:opacity-50"
                                >
                                  Kirim
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="rounded-xl bg-white/40 p-4 text-center text-xs text-[#2F2F2D]/60">Semua pesanan warga telah diproses tuntas.</p>
                      )}
                    </section>

                    {/* Pending UMKM Verifications */}
                    <section className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/90 p-5 shadow-[0_8px_32px_rgba(22,51,36,0.04),inset_0_1px_1px_rgba(255,255,255,0.95)] space-y-4">
                      <div className="flex items-center justify-between gap-3 border-b border-[#163324]/10 pb-3">
                        <div>
                          <h3 className="text-sm font-bold text-[#163324]">Pendaftaran UMKM Baru</h3>
                          <p className="text-[11px] text-[#2F2F2D]/60">Toko warga yang menunggu persetujuan balai.</p>
                        </div>
                        <button 
                          onClick={() => { setUmkmFilter('menunggu'); setAdminTab('umkm'); }} 
                          className="px-2.5 py-1 rounded-lg text-xs font-semibold text-[#163324] hover:bg-white/90 transition-colors"
                        >
                          Lihat Semua →
                        </button>
                      </div>

                      {pendingShops.length ? (
                        <div className="space-y-3">
                          {pendingShops.map((shop) => (
                            <div key={shop.id} className="p-3 rounded-xl bg-white/60 border border-white/80 flex items-center justify-between gap-3">
                              <div className="flex items-center gap-2.5 min-w-0">
                                <img src={shop.avatar} alt={shop.name} className="w-9 h-9 rounded-lg object-cover" />
                                <div className="min-w-0">
                                  <p className="truncate text-xs font-bold text-[#163324]">{shop.name}</p>
                                  <p className="text-[10px] text-[#2F2F2D]/60">{shop.owner} · {shop.kecamatan}</p>
                                </div>
                              </div>
                              <motion.button
                                whileTap={{ scale: 0.95 }}
                                onClick={() => verifyShop(shop.id, 'aktif')}
                                className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-[10px] font-bold hover:bg-emerald-700 shadow-xs"
                              >
                                Setujui
                              </motion.button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="rounded-xl bg-white/40 p-4 text-center text-xs text-[#2F2F2D]/60">Tidak ada pengajuan toko yang tertunda.</p>
                      )}
                    </section>
                  </div>
                </div>
              )}

              {/* TAB 2: PESANAN WARGA + SELLER-BUYER DISPATCH HUB */}
              {adminTab === 'pesanan' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-bold text-[#163324]">Hub Logistik & Pesanan Warga</h2>
                      <p className="mt-1 text-xs text-[#2F2F2D]/70">
                        Disposisikan kurir kilat desa, pantau serah terima barang dari toko pengrajin ke pembeli.
                      </p>
                    </div>

                    {/* Filter Status Glass Pills */}
                    <div className="flex flex-wrap gap-1.5 p-1 rounded-xl bg-white/70 backdrop-blur-md border border-white/80">
                      {[
                        ['aktif', 'Perlu Tindakan'], 
                        ['semua', 'Semua'], 
                        ['diproses', 'Diproses'],
                        ['dikirim', 'Dikirim'], 
                        ['diambil', 'Diambil'], 
                        ['selesai', 'Selesai'], 
                        ['ditolak', 'Ditolak'],
                      ].map(([val, lbl]) => (
                        <button
                          key={val}
                          onClick={() => setOrderFilter(val)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                            orderFilter === val
                              ? 'bg-[#163324] text-white shadow-xs'
                              : 'text-[#2F2F2D]/70 hover:bg-white/80'
                          }`}
                        >
                          {lbl}{val === 'diproses' ? ` (${orders.filter(o => o.status === 'diproses').length})` : ''}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Orders List */}
                  <div className="space-y-3.5">
                    {orders
                      .filter(o => orderFilter === 'semua' || (orderFilter === 'aktif' ? ['diproses', 'dikirim'].includes(o.status) : o.status === orderFilter))
                      .map((order) => {
                        const matchingShop = shops.find(s => s.name === order.shopName);
                        return (
                          <article 
                            key={order.id} 
                            className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/90 p-5 shadow-[0_8px_32px_rgba(22,51,36,0.04),inset_0_1px_1px_rgba(255,255,255,0.95)] space-y-4"
                          >
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                              <div className="space-y-1.5 min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                                    #{order.id}
                                  </span>
                                  <h3 className="font-bold text-sm text-[#163324]">{order.productName}</h3>
                                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                    order.status === 'diproses' ? 'bg-amber-100 text-amber-900 border border-amber-200' :
                                    order.status === 'dikirim' ? 'bg-sky-100 text-sky-900 border border-sky-200' :
                                    order.status === 'ditolak' ? 'bg-rose-100 text-rose-900 border border-rose-200' :
                                    'bg-emerald-100 text-emerald-900 border border-emerald-200'
                                  }`}>
                                    {orderStatusLabel[order.status] || order.status}
                                  </span>
                                </div>

                                <div className="text-xs text-[#2F2F2D]/75 flex flex-wrap gap-x-4 gap-y-1">
                                  <span>📅 {order.date}</span>
                                  <span>📦 {order.qty || 1} barang</span>
                                  <span>👤 {order.buyerName} ({order.phone})</span>
                                  <span>🏪 Mitra: <strong>{order.shopName}</strong></span>
                                </div>

                                <p className="text-xs text-[#2F2F2D]/70 bg-white/50 p-2.5 rounded-xl border border-white/80 max-w-2xl">
                                  📍 <strong>Alamat Kirim:</strong> {order.address}
                                  {order.notes && <span className="block mt-0.5 text-amber-900">📝 Catatan: {order.notes}</span>}
                                </p>
                              </div>

                              <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end gap-3 shrink-0">
                                <div className="text-left lg:text-right">
                                  <p className="text-[11px] text-[#2F2F2D]/60">Total Transaksi</p>
                                  <p className="text-lg font-bold text-[#163324] tabular-nums">
                                    Rp {Number(order.total || 0).toLocaleString('id-ID')}
                                  </p>
                                </div>

                                <div className="flex flex-wrap items-center gap-2">
                                  {/* Print Waybill Modal Trigger */}
                                  <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setSelectedOrderForDispatch(order)}
                                    className="px-3 py-1.5 rounded-xl bg-white border border-[#163324]/20 text-xs font-semibold text-[#163324] hover:bg-emerald-50 flex items-center gap-1.5 shadow-2xs"
                                    title="Cetak surat jalan dan label penempelan paket kurir desa"
                                  >
                                    <Printer className="w-3.5 h-3.5 text-emerald-800" />
                                    <span>Surat Jalan & Resi</span>
                                  </motion.button>

                                  {order.status === 'diproses' && (
                                    <>
                                      <motion.button
                                        whileTap={{ scale: 0.96 }}
                                        disabled={updatingOrderId === order.id}
                                        onClick={() => handleOrderStatus(order, 'dikirim')}
                                        className="px-3 py-1.5 rounded-xl bg-[#163324] text-white text-xs font-bold hover:bg-[#1e4632] disabled:opacity-50 flex items-center gap-1.5 shadow-xs"
                                      >
                                        <Truck className="w-3.5 h-3.5" />
                                        <span>Kirim Kurir</span>
                                      </motion.button>
                                      <motion.button
                                        whileTap={{ scale: 0.96 }}
                                        disabled={updatingOrderId === order.id}
                                        onClick={() => handleOrderStatus(order, 'selesai')}
                                        className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 disabled:opacity-50"
                                      >
                                        ✓ Sudah Diambil
                                      </motion.button>
                                    </>
                                  )}

                                  {order.status === 'dikirim' && (
                                    <motion.button
                                      whileTap={{ scale: 0.96 }}
                                      disabled={updatingOrderId === order.id}
                                      onClick={() => handleOrderStatus(order, 'selesai')}
                                      className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 disabled:opacity-50"
                                    >
                                      ✓ Tandai Diterima Warga
                                    </motion.button>
                                  )}

                                  {order.status === 'selesai' && (
                                    <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold">
                                      ✓ Tuntas & Masuk Kas
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </article>
                        );
                      })}

                    {orders.filter(o => orderFilter === 'semua' || (orderFilter === 'aktif' ? ['diproses', 'dikirim'].includes(o.status) : o.status === orderFilter)).length === 0 && (
                      <div className="bg-white/60 backdrop-blur-md rounded-2xl border border-white/80 p-8 text-center text-xs text-[#2F2F2D]/60">
                        Tidak ada transaksi pada status filter ini.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 3: MANAJEMEN UMKM */}
              {adminTab === 'umkm' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-bold text-[#163324]">Manajemen Toko & UMKM Binaan</h2>
                      <p className="mt-1 text-xs text-[#2F2F2D]/70">
                        Verifikasi toko baru, periksa kelayakan pengrajin, dan inspeksi profil usaha warga.
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/70 backdrop-blur-md border border-white/80">
                      {['semua', 'menunggu', 'aktif', 'ditolak'].map((st) => (
                        <button
                          key={st}
                          onClick={() => setUmkmFilter(st)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                            umkmFilter === st
                              ? 'bg-[#163324] text-white shadow-xs'
                              : 'text-[#2F2F2D]/70 hover:bg-white/80'
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/90 shadow-[0_8px_32px_rgba(22,51,36,0.04),inset_0_1px_1px_rgba(255,255,255,0.95)] overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-[#163324]/5 text-[#163324] font-bold border-b border-[#163324]/10">
                          <tr>
                            <th className="p-4">Nama Usaha / Toko</th>
                            <th className="p-4">Pengrajin / Pemilik</th>
                            <th className="p-4">Kategori & Kecamatan</th>
                            <th className="p-4">Status BUMDes</th>
                            <th className="p-4 text-right">Aksi Verifikasi</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#163324]/10">
                          {shops
                            .filter((s) => umkmFilter === 'semua' || (umkmFilter === 'menunggu' ? ['menunggu', 'menunggu_verifikasi'].includes(s.status) : s.status === umkmFilter))
                            .map((shop) => (
                              <tr key={shop.id} className="hover:bg-white/80 transition-colors">
                                <td className="p-4">
                                  <div className="flex items-center gap-3">
                                    <img src={shop.avatar} alt={shop.name} className="w-10 h-10 rounded-xl object-cover border border-white shadow-2xs" />
                                    <div>
                                      <p className="font-bold text-sm text-[#163324]">{shop.name}</p>
                                      <p className="text-[11px] text-[#2F2F2D]/60">{shop.description?.slice(0, 45)}...</p>
                                    </div>
                                  </div>
                                </td>
                                <td className="p-4 font-medium text-[#2F2F2D]">
                                  {shop.owner}
                                  <span className="block text-[10px] text-[#2F2F2D]/60">{shop.phone || '0819-xxxx'}</span>
                                </td>
                                <td className="p-4">
                                  <span className="font-semibold text-[#163324]">{shop.category}</span>
                                  <span className="block text-[10px] text-emerald-800 font-medium">{shop.kecamatan}</span>
                                </td>
                                <td className="p-4">
                                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold capitalize ${
                                    shop.status === 'aktif' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                                    ['menunggu', 'menunggu_verifikasi'].includes(shop.status) ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                                    'bg-rose-100 text-rose-800 border border-rose-200'
                                  }`}>
                                    {shop.status}
                                  </span>
                                </td>
                                <td className="p-4 text-right space-x-2">
                                  {shop.status === 'menunggu' ? (
                                    <>
                                      <motion.button
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => verifyShop(shop.id, 'aktif')}
                                        className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 shadow-xs"
                                      >
                                        Setujui Toko
                                      </motion.button>
                                      <motion.button
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => verifyShop(shop.id, 'ditolak')}
                                        className="px-3 py-1.5 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 shadow-xs"
                                      >
                                        Tolak
                                      </motion.button>
                                    </>
                                  ) : (
                                    <motion.button
                                      whileTap={{ scale: 0.95 }}
                                      onClick={() => verifyShop(shop.id, shop.status === 'aktif' ? 'ditolak' : 'aktif')}
                                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors ${
                                        shop.status === 'aktif'
                                          ? 'border-rose-300 bg-rose-50 text-rose-700 hover:bg-rose-100'
                                          : 'border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                                      }`}
                                    >
                                      {shop.status === 'aktif' ? 'Nonaktifkan' : 'Aktifkan Kembali'}
                                    </motion.button>
                                  )}
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: PRODUK & KATEGORI + KURASI MUTU BUMDES */}
              {adminTab === 'produk' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-[#163324]">Kurasi Produk & Taksonomi Desa</h2>
                    <p className="mt-1 text-xs text-[#2F2F2D]/70">
                      Sematkan jaminan mutu "Lolos Kurasi BUMDes", atur ketersediaan stok, dan kelola kategori produk.
                    </p>
                  </div>

                  {/* Category Creator Liquid Glass Card */}
                  <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/90 p-5 shadow-[0_8px_32px_rgba(22,51,36,0.04),inset_0_1px_1px_rgba(255,255,255,0.95)] space-y-4">
                    <h3 className="text-xs font-bold text-[#163324] uppercase tracking-wider">
                      Tambah Taksonomi / Kategori Binaan
                    </h3>
                    <form onSubmit={handleAddCategory} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Nama kategori baru (mis. Gerabah, Olahan Susu, Anyaman Bambu)..."
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        className="flex-1 h-10 px-3.5 bg-white/70 backdrop-blur-md border border-[#163324]/20 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#163324]/20"
                      />
                      <motion.button
                        whileTap={{ scale: 0.96 }}
                        type="submit"
                        className="px-4 py-2 bg-[#163324] text-white rounded-xl text-xs font-bold shadow-xs hover:bg-[#1e4632]"
                      >
                        + Tambah Kategori
                      </motion.button>
                    </form>

                    <div className="flex flex-wrap gap-2 pt-1">
                      {categories.map((c) => (
                        <span 
                          key={c.id} 
                          className="px-3 py-1 rounded-full bg-white/70 border border-[#163324]/10 text-xs font-semibold text-[#163324] shadow-2xs"
                        >
                          {c.name} ({c.count})
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Products Catalog Table with Curation Badge */}
                  <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/90 shadow-[0_8px_32px_rgba(22,51,36,0.04),inset_0_1px_1px_rgba(255,255,255,0.95)] overflow-hidden">
                    <div className="p-4 border-b border-[#163324]/10 flex items-center justify-between">
                      <h3 className="font-bold text-sm text-[#163324]">Katalog Seluruh Produk Mitra</h3>
                      <span className="text-xs text-[#2F2F2D]/60">{products.length} produk terdaftar</span>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-[#163324]/5 text-[#163324] font-bold">
                          <tr>
                            <th className="p-3.5">Produk & Visual</th>
                            <th className="p-3.5">Toko / UMKM</th>
                            <th className="p-3.5">Harga</th>
                            <th className="p-3.5">Stok</th>
                            <th className="p-3.5">Jaminan Mutu</th>
                            <th className="p-3.5 text-right">Aksi Kelola</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#163324]/10">
                          {products.map((prod) => {
                            const isCurated = curatedProductIds.has(String(prod.id));
                            return (
                              <tr key={prod.id} className="hover:bg-white/80 transition-colors">
                                <td className="p-3.5">
                                  <div className="flex items-center gap-3">
                                    <img src={prod.images?.[0] || prod.image} alt={prod.name} className="w-10 h-10 rounded-xl object-cover border border-white shadow-2xs" />
                                    <div>
                                      <span className="font-bold text-sm text-[#163324] line-clamp-1">{prod.name}</span>
                                      <span className="text-[10px] text-[#2F2F2D]/60 capitalize">{prod.category}</span>
                                    </div>
                                  </div>
                                </td>
                                <td className="p-3.5 text-[#2F2F2D]/80 font-medium">{prod.shopName}</td>
                                <td className="p-3.5 font-bold text-[#163324]">
                                  {editingProduct?.id === prod.id ? (
                                    <input 
                                      type="number" 
                                      min="0" 
                                      value={editingProduct.price} 
                                      onChange={e => setEditingProduct(p => ({ ...p, price: e.target.value }))} 
                                      className="w-28 rounded-lg border px-2 py-1 text-xs" 
                                    />
                                  ) : (
                                    `Rp ${Number(prod.price).toLocaleString('id-ID')}`
                                  )}
                                </td>
                                <td className="p-3.5">
                                  {editingProduct?.id === prod.id ? (
                                    <input 
                                      type="number" 
                                      min="0" 
                                      value={editingProduct.stock} 
                                      onChange={e => setEditingProduct(p => ({ ...p, stock: e.target.value }))} 
                                      className="w-20 rounded-lg border px-2 py-1 text-xs" 
                                    />
                                  ) : (
                                    <span className="font-semibold">{prod.stock}</span>
                                  )}
                                </td>
                                <td className="p-3.5">
                                  <motion.button
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => toggleProductCuration(String(prod.id))}
                                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 transition-all ${
                                      isCurated
                                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-2xs'
                                        : 'bg-white/70 border border-[#163324]/20 text-[#2F2F2D]/60 hover:text-emerald-800'
                                    }`}
                                    title="Klik untuk mengubah sematan kurasi mutu BUMDes"
                                  >
                                    <Award className={`w-3 h-3 ${isCurated ? 'text-emerald-600' : 'text-gray-400'}`} />
                                    <span>{isCurated ? 'Lolos Kurasi BUMDes ⭐' : 'Belum Dikurasi'}</span>
                                  </motion.button>
                                </td>
                                <td className="p-3.5 text-right space-x-2">
                                  {editingProduct?.id === prod.id ? (
                                    <div className="inline-flex gap-1.5">
                                      <button 
                                        onClick={async () => {
                                          if (await updateProductNumbers(prod.id, { price: Number(editingProduct.price), stock: Number(editingProduct.stock) })) {
                                            setEditingProduct(null);
                                          }
                                        }} 
                                        className="rounded-lg bg-[#163324] px-2.5 py-1 text-xs font-semibold text-white"
                                      >
                                        Simpan
                                      </button>
                                      <button 
                                        onClick={() => setEditingProduct(null)} 
                                        className="rounded-lg px-2.5 py-1 text-xs text-[#2F2F2D]"
                                      >
                                        Batal
                                      </button>
                                    </div>
                                  ) : (
                                    <button 
                                      onClick={() => setEditingProduct({ id: prod.id, price: prod.price, stock: prod.stock })} 
                                      className="rounded-lg border border-[#163324]/20 px-2.5 py-1 text-xs font-semibold text-[#163324] hover:bg-white"
                                    >
                                      Ubah
                                    </button>
                                  )}

                                  <motion.button
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => toggleProductStatus(prod.id)}
                                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                                      prod.isHidden
                                        ? 'bg-emerald-600 text-white'
                                        : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                                    }`}
                                  >
                                    {prod.isHidden ? 'Pulihkan' : 'Sembunyikan'}
                                  </motion.button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: MANAJEMEN PENGGUNA */}
              {adminTab === 'pengguna' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-bold text-[#163324]">Manajemen Akun Warga & Toko</h2>
                      <p className="mt-1 text-xs text-[#2F2F2D]/70">
                        Kelola akun terdaftar di database pasar desa, atur status peranan, dan reset akses.
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/70 backdrop-blur-md border border-white/80">
                      {['semua', 'pembeli', 'penjual', 'keduanya', 'admin'].map((role) => (
                        <button
                          key={role}
                          onClick={() => setUserRoleFilter(role)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                            userRoleFilter === role
                              ? 'bg-[#163324] text-white shadow-xs'
                              : 'text-[#2F2F2D]/70 hover:bg-white/80'
                          }`}
                        >
                          {role}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/90 shadow-[0_8px_32px_rgba(22,51,36,0.04),inset_0_1px_1px_rgba(255,255,255,0.95)] overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-[#163324]/5 text-[#163324] font-bold">
                          <tr>
                            <th className="p-4">Nama Pengguna</th>
                            <th className="p-4">Kontak (HP & Email)</th>
                            <th className="p-4">Peranan Akun</th>
                            <th className="p-4">Toko Terkait</th>
                            <th className="p-4 text-right">Tindakan Admin</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#163324]/10">
                          {users
                            .filter(u => userRoleFilter === 'semua' || u.role === userRoleFilter)
                            .map((u) => (
                              <tr key={u.id} className="hover:bg-white/80 transition-colors">
                                <td className="p-4 font-bold text-sm text-[#163324]">{u.name}</td>
                                <td className="p-4 text-[#2F2F2D]/75">
                                  <div>{u.phone}</div>
                                  <span className="text-[10px] text-[#2F2F2D]/50">{u.email}</span>
                                </td>
                                <td className="p-4">
                                  <span className="px-2.5 py-0.5 rounded-full bg-[#163324]/10 text-[#163324] font-bold uppercase text-[10px]">
                                    {u.role}
                                  </span>
                                </td>
                                <td className="p-4 text-[#2F2F2D]/80 font-medium">{u.shopName || '-'}</td>
                                <td className="p-4 text-right space-x-2">
                                  <motion.button
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => {
                                      triggerNotification('Sandi Direset', `Kata sandi akun ${u.name} telah diatur ulang ke: DesaMandiri2026!`);
                                    }}
                                    className="px-2.5 py-1.5 rounded-xl border border-[#163324]/30 text-xs font-semibold text-[#163324] hover:bg-white"
                                  >
                                    Reset Sandi
                                  </motion.button>
                                  <motion.button
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => {
                                      setUsers(prev => prev.map(usr => usr.id === u.id ? { ...usr, status: usr.status === 'diblokir' ? 'aktif' : 'diblokir' } : usr));
                                      triggerNotification('Status Diperbarui', `Status akun ${u.name} telah diubah.`);
                                    }}
                                    className="px-2.5 py-1.5 rounded-xl bg-rose-50 text-rose-700 text-xs font-semibold hover:bg-rose-100 border border-rose-200"
                                  >
                                    {u.status === 'diblokir' ? 'Buka Blokir' : 'Blokir'}
                                  </motion.button>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 6: LAPORAN & SIARAN BROADCAST */}
              {adminTab === 'laporan' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-bold text-[#163324]">Laporan Keuangan & Siaran Desa</h2>
                      <p className="mt-1 text-xs text-[#2F2F2D]/70">
                        Unduh laporan transaksi pasar desa dan kirim pengumuman serentak ke warga.
                      </p>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleExportReport}
                      className="px-4 py-2.5 rounded-xl bg-[#163324] text-white font-bold text-xs shadow-md flex items-center gap-2 hover:bg-[#1e4632]"
                    >
                      <Download className="w-4 h-4" />
                      <span>Unduh Laporan CSV</span>
                    </motion.button>
                  </div>

                  {/* Broadcast Composer */}
                  <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/90 p-6 shadow-[0_8px_32px_rgba(22,51,36,0.04),inset_0_1px_1px_rgba(255,255,255,0.95)] space-y-4">
                    <div className="flex items-center gap-2">
                      <Bell className="w-5 h-5 text-amber-600" />
                      <h3 className="font-bold text-sm text-[#163324]">
                        Buat Pengumuman / Broadcast Serentak
                      </h3>
                    </div>

                    <form onSubmit={handleSendBroadcast} className="space-y-3.5">
                      <div>
                        <label className="block text-xs font-semibold text-[#163324] mb-1">
                          Judul Pengumuman
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Contoh: Bazar Kuliner & Kerajinan Bambu Sumedang..."
                          value={broadcastTitle}
                          onChange={(e) => setBroadcastTitle(e.target.value)}
                          className="w-full h-10 px-3.5 bg-white/70 backdrop-blur-md border border-[#163324]/20 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#163324]/20"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <div>
                          <label className="block text-xs font-semibold text-[#163324] mb-1">
                            Sasaran Penerima
                          </label>
                          <select
                            value={broadcastTarget}
                            onChange={(e) => setBroadcastTarget(e.target.value)}
                            className="w-full h-10 px-3.5 bg-white/70 backdrop-blur-md border border-[#163324]/20 rounded-xl text-xs focus:bg-white focus:outline-none"
                          >
                            <option value="Semua Pengguna">Semua Pengguna (Pembeli & Penjual)</option>
                            <option value="Khusus Penjual UMKM">Khusus Mitra Penjual UMKM</option>
                            <option value="Warga Kecamatan Sumedang Utara">Warga Kecamatan Sumedang Utara</option>
                          </select>
                        </div>

                        <div className="flex items-center pt-5">
                          <label className="flex items-center gap-2 text-xs font-semibold text-[#163324] cursor-pointer">
                            <input
                              type="checkbox"
                              checked={isUrgent}
                              onChange={(e) => setIsUrgent(e.target.checked)}
                              className="w-4 h-4 rounded text-emerald-700"
                            />
                            <span>Tandai Sebagai Pengumuman Mendesak (Urgent)</span>
                          </label>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#163324] mb-1">
                          Isi Pesan Broadcast
                        </label>
                        <textarea
                          rows="3"
                          required
                          placeholder="Tuliskan isi pesan yang akan muncul di aplikasi hp warga..."
                          value={broadcastMessage}
                          onChange={(e) => setBroadcastMessage(e.target.value)}
                          className="w-full p-3 bg-white/70 backdrop-blur-md border border-[#163324]/20 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#163324]/20"
                        />
                      </div>

                      <motion.button
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className="px-5 py-2.5 rounded-xl bg-[#163324] text-white text-xs font-bold shadow-md hover:bg-[#1e4632] flex items-center gap-2"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Kirim Siaran Sekarang</span>
                      </motion.button>
                    </form>
                  </div>

                  {/* Broadcast History */}
                  <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/90 shadow-[0_8px_32px_rgba(22,51,36,0.04),inset_0_1px_1px_rgba(255,255,255,0.95)] overflow-hidden">
                    <div className="p-4 border-b border-[#163324]/10">
                      <h3 className="font-bold text-sm text-[#163324]">Riwayat Siaran Terkirim</h3>
                    </div>
                    <div className="divide-y divide-[#163324]/10 text-xs">
                      {announcements.map((ann) => (
                        <div key={ann.id} className="p-4 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-sm text-[#163324]">{ann.title}</span>
                            <span className="text-[10px] text-[#2F2F2D]/50">{ann.date}</span>
                          </div>
                          <p className="text-[#2F2F2D]/75">{ann.excerpt}</p>
                          <span className="text-[10px] font-semibold text-emerald-800 block pt-1">
                            🎯 Sasaran: {ann.target}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 7: PUSAT PESAN & MODERASI CHAT (SELLER-BUYER CONNECTION) */}
              {adminTab === 'pesan' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-[#163324]">
                      Pusat Moderasi & Obrolan Desa
                    </h2>
                    <p className="mt-1 text-xs text-[#2F2F2D]/70">
                      Pantau perbincangan antara pembeli, bot AI desa, dan admin toko pengrajin. Berikan izin konsultasi langsung atau transfer ke WhatsApp.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 bg-white/80 backdrop-blur-2xl rounded-3xl border border-white/90 shadow-[0_12px_40px_rgba(22,51,36,0.06),inset_0_1px_1px_rgba(255,255,255,0.95)] overflow-hidden h-[640px]">
                    
                    {/* Left Column: Channels / Threads */}
                    <div className="lg:col-span-4 border-r border-[#163324]/10 flex flex-col h-full bg-white/40">
                      <div className="p-4 border-b border-[#163324]/10 bg-white/60 flex items-center justify-between">
                        <h3 className="text-xs font-bold text-[#163324] uppercase tracking-wider">
                          Saluran Percakapan ({Object.keys(chatThreads).length})
                        </h3>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                          Live
                        </span>
                      </div>

                      <div className="flex-1 overflow-y-auto divide-y divide-[#163324]/10">
                        {/* General Village Bot */}
                        <div
                          onClick={() => setSelectedAdminThread('general-bot')}
                          className={`p-3.5 cursor-pointer transition-all ${
                            selectedAdminThread === 'general-bot'
                              ? 'bg-emerald-50/80 border-l-4 border-emerald-700 shadow-2xs'
                              : 'hover:bg-white/60'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-bold text-[#163324] flex items-center gap-1.5">
                              <span>🤖 Asisten AI Desa</span>
                            </span>
                            <span className="text-[10px] text-[#2F2F2D]/50 font-medium">Umum</span>
                          </div>
                          <p className="text-[11px] text-[#2F2F2D]/70 line-clamp-1">
                            {chatThreads['general-bot']?.[chatThreads['general-bot'].length - 1]?.text || 'Percakapan bot desa...'}
                          </p>
                        </div>

                        {/* Store Threads */}
                        {shops.map((s) => {
                          const thread = chatThreads[s.id] || [];
                          const lastMsg = thread[thread.length - 1];
                          const isSelected = selectedAdminThread === s.id;
                          const isApproved = approvedChatThreads.has(s.id);

                          return (
                            <div
                              key={s.id}
                              onClick={() => setSelectedAdminThread(s.id)}
                              className={`p-3.5 cursor-pointer transition-all ${
                                isSelected
                                  ? 'bg-emerald-50/80 border-l-4 border-emerald-700 shadow-2xs'
                                  : 'hover:bg-white/60'
                              }`}
                            >
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs font-bold text-[#163324] truncate max-w-[160px]">
                                  {s.name}
                                </span>
                                <div className="flex items-center gap-1">
                                  {isApproved && (
                                    <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
                                      Disetujui
                                    </span>
                                  )}
                                  <span className="text-[10px] text-emerald-800 font-bold">
                                    {thread.length} pesan
                                  </span>
                                </div>
                              </div>
                              <p className="text-[10px] text-[#2F2F2D]/60 mb-0.5">{s.owner} · {s.kecamatan}</p>
                              <p className="text-[11px] text-[#2F2F2D]/75 line-clamp-1 italic">
                                {lastMsg ? lastMsg.text : 'Belum ada obrolan baru'}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Right Column: Live Chat View & Moderate */}
                    <div className="lg:col-span-8 flex flex-col h-full bg-white/60">
                      
                      {/* Chat Stream Header */}
                      <div className="p-4 border-b border-[#163324]/10 flex flex-wrap items-center justify-between gap-3 bg-white/70">
                        <div>
                          <h4 className="text-xs font-bold text-[#163324] flex items-center gap-2">
                            <span>
                              {selectedAdminThread === 'general-bot' 
                                ? 'Saluran Asisten AI Desa' 
                                : shops.find(s => s.id === selectedAdminThread)?.name || 'Admin Toko'}
                            </span>
                            {selectedAdminThread !== 'general-bot' && (
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                                {approvedChatThreads.has(selectedAdminThread) ? 'Obrolan Bebas Aktif' : 'Perlu Approval'}
                              </span>
                            )}
                          </h4>
                          <p className="text-[10px] text-[#2F2F2D]/60">
                            Konsol Balai Pengelola BUMDes · Terhubung ke Sistem Notifikasi Warga
                          </p>
                        </div>

                        {/* Action Buttons for Seller-Buyer Moderation */}
                        <div className="flex items-center gap-2">
                          {selectedAdminThread !== 'general-bot' && (
                            <>
                              {/* Direct WhatsApp Transfer */}
                              {(() => {
                                const shop = shops.find(s => s.id === selectedAdminThread);
                                const phone = (shop?.phone || '6281915194171').replace(/\D/g, '');
                                const cleanPhone = phone.startsWith('0') ? '62' + phone.slice(1) : phone;
                                const waUrl = `https://wa.me/${cleanPhone}?text=Halo%20${encodeURIComponent(shop?.owner || 'Pengrajin')},%20saya%20pengelola%20BUMDes%20Pasar%20Desa%20Sumedang%20meneruskan%20pertanyaan%20dari%20calon%20pembeli%20katalog%20Anda.`;
                                return (
                                  <a
                                    href={waUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-[11px] font-bold hover:bg-emerald-700 shadow-2xs flex items-center gap-1.5"
                                  >
                                    <Share2 className="w-3.5 h-3.5" />
                                    <span>WhatsApp Toko</span>
                                  </a>
                                );
                              })()}

                              {/* Toggle Approval for Buyer-Seller Direct Consultation */}
                              <button
                                onClick={() => toggleApproveChat(selectedAdminThread)}
                                className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all flex items-center gap-1.5 ${
                                  approvedChatThreads.has(selectedAdminThread)
                                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                    : 'bg-[#163324] text-white hover:bg-[#1e4632]'
                                }`}
                              >
                                <CheckCheck className="w-3.5 h-3.5" />
                                <span>{approvedChatThreads.has(selectedAdminThread) ? 'Chat Disetujui ✓' : 'Approve Chat'}</span>
                              </button>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Chat Messages Stream */}
                      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#FBF8F3]/50">
                        {(chatThreads[selectedAdminThread] || []).map((msg) => {
                          const isUser = msg.sender === 'user';
                          const isSeller = msg.sender === 'seller';

                          return (
                            <div
                              key={msg.id}
                              className={`flex flex-col ${isUser ? 'items-start' : 'items-end'}`}
                            >
                              <span className="text-[10px] font-semibold text-[#2F2F2D]/60 mb-0.5 px-1">
                                {isUser ? 'Pembeli / Warga' : isSeller ? `${msg.senderName || 'Admin Toko'}` : 'Bot Sistem'}
                              </span>
                              <div
                                className={`max-w-[80%] p-3.5 rounded-2xl text-xs shadow-xs ${
                                  isUser
                                    ? 'bg-white/90 backdrop-blur-md border border-white/90 text-[#163324] rounded-tl-sm'
                                    : 'bg-gradient-to-r from-[#163324] to-[#1c3f2d] text-white rounded-tr-sm shadow-md'
                                }`}
                              >
                                <p className="leading-relaxed">{msg.text}</p>
                                <span className={`text-[9px] block text-right mt-1.5 ${isUser ? 'text-[#2F2F2D]/50' : 'text-white/60'}`}>
                                  {msg.time}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Admin Message Reply Composer */}
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          if (!adminReplyText.trim()) return;
                          sendChatMessage(adminReplyText, selectedAdminThread);
                          setAdminReplyText('');
                          triggerNotification('Balasan Terkirim 💬', 'Pesan resmi admin telah dikirimkan ke ruang obrolan.');
                        }}
                        className="p-3 bg-white/80 backdrop-blur-md border-t border-[#163324]/10 flex items-center gap-2"
                      >
                        <input
                          type="text"
                          placeholder="Tulis tanggapan atau instruksi kurir/toko sebagai admin..."
                          value={adminReplyText}
                          onChange={(e) => setAdminReplyText(e.target.value)}
                          className="flex-1 h-10 px-3.5 text-xs rounded-xl border border-[#163324]/20 bg-white/70 text-[#163324] focus:outline-none focus:ring-2 focus:ring-[#163324]/20"
                        />
                        <button
                          type="submit"
                          disabled={!adminReplyText.trim()}
                          className="h-10 px-4 rounded-xl bg-[#163324] text-white text-xs font-bold hover:bg-[#1e4632] disabled:opacity-40 transition-all shadow-xs flex items-center gap-1.5"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Kirim</span>
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* MODAL SURAT JALAN & DISPOSISI LOGISTIK KURIR KILAT BUMDES (SELLER-BUYER HUB) */}
      <AnimatePresence>
        {selectedOrderForDispatch && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.93, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.93, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-white/95 backdrop-blur-2xl rounded-3xl border border-white/90 shadow-[0_25px_60px_rgba(22,51,36,0.15)] w-full max-w-2xl overflow-hidden"
            >
              {/* Header Surat Jalan */}
              <div className="p-6 bg-gradient-to-r from-[#163324] to-[#1c3f2d] text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
                    <Truck className="w-5 h-5 text-emerald-300" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm">SURAT JALAN & LABEL KURIR KILAT BUMDES</h3>
                    <p className="text-[11px] text-emerald-200">
                      Disposisi Logistik Serah Terima Barang Pasar Desa Sumedang
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedOrderForDispatch(null)}
                  className="p-1.5 rounded-xl hover:bg-white/10 text-white/80 hover:text-white"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              {/* Waybill Body Content */}
              <div className="p-6 space-y-5 text-xs text-[#163324]">
                {/* Resi Header & Barcode simulation */}
                <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-[#FBF8F3] border border-[#163324]/10">
                  <div>
                    <span className="text-[10px] text-[#2F2F2D]/60 uppercase font-semibold">Nomor Resi / Surat Jalan</span>
                    <p className="text-base font-mono font-bold text-emerald-900">
                      SJ-SMD-202611-{selectedOrderForDispatch.id}
                    </p>
                    <span className="text-[10px] text-[#2F2F2D]/60">Diterbitkan: {selectedOrderForDispatch.date}</span>
                  </div>
                  <div className="text-right">
                    <div className="inline-flex gap-1 items-end h-8">
                      {[3, 6, 2, 8, 4, 7, 5, 3, 9, 2, 5, 8, 4, 6].map((h, i) => (
                        <div key={i} className="w-1 bg-[#163324] rounded-xs" style={{ height: `${h * 3}px` }} />
                      ))}
                    </div>
                    <span className="block font-mono text-[9px] text-[#2F2F2D]/50">SMD-LOG-EXP</span>
                  </div>
                </div>

                {/* Seller & Buyer Columns */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Seller Box */}
                  <div className="p-4 rounded-2xl bg-white border border-[#163324]/15 shadow-2xs space-y-1.5">
                    <span className="text-[10px] uppercase font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                      PENGIRIM (MITRA TOKO UMKM)
                    </span>
                    <p className="font-bold text-sm text-[#163324] pt-1">
                      {selectedOrderForDispatch.shopName}
                    </p>
                    <p className="text-[#2F2F2D]/70 text-[11px]">
                      Kecamatan Sumedang · Mitra BUMDes Mandiri
                    </p>
                    <p className="text-[11px] text-[#2F2F2D]/60">
                      Kontak Toko: {shops.find(s => s.name === selectedOrderForDispatch.shopName)?.phone || '0819-1519-4171'}
                    </p>
                  </div>

                  {/* Buyer Box */}
                  <div className="p-4 rounded-2xl bg-white border border-[#163324]/15 shadow-2xs space-y-1.5">
                    <span className="text-[10px] uppercase font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded">
                      PENERIMA (WARGA PEMBELI)
                    </span>
                    <p className="font-bold text-sm text-[#163324] pt-1">
                      {selectedOrderForDispatch.buyerName}
                    </p>
                    <p className="text-[#2F2F2D]/70 text-[11px]">
                      📞 {selectedOrderForDispatch.phone}
                    </p>
                    <p className="text-[#2F2F2D]/80 text-[11px] font-medium leading-relaxed">
                      📍 {selectedOrderForDispatch.address}
                    </p>
                    {selectedOrderForDispatch.notes && (
                      <p className="text-[10px] text-amber-900 bg-amber-50/60 p-1.5 rounded-lg border border-amber-200/50">
                        Catatan: {selectedOrderForDispatch.notes}
                      </p>
                    )}
                  </div>
                </div>

                {/* Package Items Table */}
                <div className="rounded-2xl border border-[#163324]/15 overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#163324]/5 text-[#163324] font-bold">
                      <tr>
                        <th className="p-3">Rincian Barang</th>
                        <th className="p-3">Jumlah</th>
                        <th className="p-3 text-right">Nilai Barang</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#163324]/10 bg-white">
                      <tr>
                        <td className="p-3 font-semibold text-[#163324]">
                          {selectedOrderForDispatch.productName}
                        </td>
                        <td className="p-3">{selectedOrderForDispatch.qty || 1} Unit</td>
                        <td className="p-3 text-right font-bold text-[#163324]">
                          Rp {Number(selectedOrderForDispatch.total || 0).toLocaleString('id-ID')}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Checklist Handover */}
                <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200/80 text-[11px] text-emerald-900 flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-700" />
                    <span>Barang sudah dicek fisik & siap diantar kurir kilat antar-desa.</span>
                  </span>
                  <span className="font-bold text-xs">Biaya Antar: Rp 0 (Disubsidi Desa)</span>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="p-4 bg-[#FBF8F3] border-t border-[#163324]/10 flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedOrderForDispatch(null)}
                  className="px-4 py-2 rounded-xl border border-[#163324]/20 text-xs font-semibold text-[#163324] hover:bg-white"
                >
                  Tutup
                </button>

                <div className="flex items-center gap-2">
                  <motion.button
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      window.print();
                    }}
                    className="px-4 py-2 rounded-xl bg-white border border-[#163324]/20 text-xs font-bold text-[#163324] hover:bg-emerald-50 shadow-2xs flex items-center gap-1.5"
                  >
                    <Printer className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Cetak Surat Jalan (Print)</span>
                  </motion.button>

                  {selectedOrderForDispatch.status === 'diproses' && (
                    <motion.button
                      whileTap={{ scale: 0.96 }}
                      onClick={async () => {
                        await handleOrderStatus(selectedOrderForDispatch, 'dikirim');
                        setSelectedOrderForDispatch(null);
                      }}
                      className="px-4 py-2 rounded-xl bg-[#163324] text-white text-xs font-bold hover:bg-[#1e4632] shadow-xs flex items-center gap-1.5"
                    >
                      <Truck className="w-3.5 h-3.5" />
                      <span>Disposisikan ke Kurir Sekarang</span>
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
