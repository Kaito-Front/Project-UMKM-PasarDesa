import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import LurikDivider from '../../components/common/LurikDivider';
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
  TrendingUp,
  MapPin,
  Calendar,
  DollarSign,
  ChevronRight,
  Filter,
  Globe,
  Smartphone,
  MessageSquare
} from 'lucide-react';

export default function AdminLayout() {
  const { 
    shops, 
    products, 
    orders, 
    users, 
    announcements, 
    categories, 
    stats,
    verifyShop,
    toggleProductStatus,
    broadcastAnnouncement,
    triggerNotification,
    setProducts,
    setCategories,
    setUsers,
    setCurrentView,
    chatThreads,
    sendChatMessage
  } = useApp();

  const [selectedAdminThread, setSelectedAdminThread] = useState('general-bot');
  const [adminReplyText, setAdminReplyText] = useState('');

  // Admin Auth State (3.1 Login Admin)
  const [isAdminAuth, setIsAdminAuth] = useState(true);
  const [adminUsername, setAdminUsername] = useState('admin@pasardesa.go.id');
  const [adminPassword, setAdminPassword] = useState('admin123');

  // Sidebar Menu Tabs (3.2)
  const [adminTab, setAdminTab] = useState('dashboard');

  // Search & Filter States
  const [umkmFilter, setUmkmFilter] = useState('semua');
  const [userRoleFilter, setUserRoleFilter] = useState('semua');
  const [userSearch, setUserSearch] = useState('');
  const [selectedUmkmDetail, setSelectedUmkmDetail] = useState(null);

  // New Category form
  const [newCategoryName, setNewCategoryName] = useState('');

  // New Broadcast announcement form (3.6)
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastTarget, setBroadcastTarget] = useState('Semua Pengguna');
  const [isUrgent, setIsUrgent] = useState(false);

  // Handle Admin Login
  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (adminUsername && adminPassword) {
      setIsAdminAuth(true);
      triggerNotification('Login Admin Berhasil', 'Selamat datang di Panel Pengelola Balai Desa.');
    }
  };

  // Handle Broadcast submit
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
  };

  // Add Category
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

  // Export Report Simulation
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
    alert('Laporan transaksi berformat CSV berhasil diunduh!');
  };

  // ---------------------------------------------------------------------------
  // 3.1 FORM LOGIN ADMIN KHUSUS
  // ---------------------------------------------------------------------------
  if (!isAdminAuth) {
    return (
      <div className="min-h-screen bg-desa-bg flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white rounded-3xl p-8 border border-desa-primary/20 shadow-2xl space-y-6"
        >
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-desa-primary text-desa-light flex items-center justify-center mx-auto shadow-md">
              <ShieldCheck className="w-8 h-8 text-desa-highlight" />
            </div>
            <h2 className="font-heading text-2xl font-bold text-desa-primary">
              Portal Admin Pengelola
            </h2>
            <p className="text-xs text-desa-text/60">
              Pemerintah Balai Desa & BUMDes Mandiri
            </p>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-desa-primary mb-1">
                Username / Email Petugas
              </label>
              <input
                type="text"
                required
                value={adminUsername}
                onChange={(e) => setAdminUsername(e.target.value)}
                className="w-full p-2.5 bg-desa-bg/40 border border-desa-primary/20 rounded-xl text-xs text-desa-primary focus:outline-none focus:border-desa-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-desa-primary mb-1">
                Kata Sandi Admin
              </label>
              <input
                type="password"
                required
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="w-full p-2.5 bg-desa-bg/40 border border-desa-primary/20 rounded-xl text-xs text-desa-primary focus:outline-none focus:border-desa-primary"
              />
            </div>

            <div className="pt-2">
              <motion.button
                whileTap={{ scale: 0.97 }}
                type="submit"
                className="w-full py-3 rounded-xl bg-desa-primary text-desa-light font-bold text-xs shadow-md hover:bg-desa-primary/90 transition-all"
              >
                Masuk ke Dashboard Admin
              </motion.button>
            </div>
          </form>

          <div className="text-center pt-2 border-t border-desa-primary/10">
            <button
              onClick={() => setCurrentView('web')}
              className="text-xs text-desa-accent font-semibold hover:underline"
            >
              ← Kembali ke Website Publik
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // ADMIN DASHBOARD MAIN LAYOUT (Sidebar + Content)
  // ---------------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-desa-bg flex flex-col md:flex-row">
      
      {/* 3.2 SIDEBAR ADMIN */}
      <aside className="w-full md:w-64 bg-desa-primary text-desa-light flex flex-col justify-between shrink-0 border-r border-black/20">
        <div>
          {/* Admin Header & Logo */}
          <div className="p-6 pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-desa-light text-desa-primary flex items-center justify-center font-bold shadow">
                <ShieldCheck className="w-6 h-6 text-desa-highlight" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-base text-desa-light">
                  Admin Desa
                </h3>
                <span className="text-[10px] text-desa-highlight font-semibold uppercase tracking-wider block">
                  Panel BUMDes
                </span>
              </div>
            </div>
          </div>

          {/* Sidebar Nav Links with Smooth Transitions */}
          <nav className="p-4 space-y-1.5 text-xs font-medium">
            <button
              onClick={() => setAdminTab('dashboard')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all ${
                adminTab === 'dashboard'
                  ? 'bg-white/15 text-white font-bold shadow-sm'
                  : 'text-desa-light/70 hover:bg-white/5 hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-desa-highlight" />
              <span>Dashboard Utama</span>
            </button>

            <button
              onClick={() => setAdminTab('umkm')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all ${
                adminTab === 'umkm'
                  ? 'bg-white/15 text-white font-bold shadow-sm'
                  : 'text-desa-light/70 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Store className="w-4 h-4 text-desa-accent" />
                <span>Manajemen UMKM</span>
              </div>
              {shops.filter(s => s.status === 'menunggu').length > 0 && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500 text-black font-bold animate-pulse">
                  {shops.filter(s => s.status === 'menunggu').length}
                </span>
              )}
            </button>

            <button
              onClick={() => setAdminTab('produk')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all ${
                adminTab === 'produk'
                  ? 'bg-white/15 text-white font-bold shadow-sm'
                  : 'text-desa-light/70 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Package className="w-4 h-4 text-desa-highlight" />
              <span>Produk & Kategori</span>
            </button>

            <button
              onClick={() => setAdminTab('pesanan')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all ${
                adminTab === 'pesanan'
                  ? 'bg-white/15 text-white font-bold shadow-sm'
                  : 'text-desa-light/70 hover:bg-white/5 hover:text-white'
              }`}
            >
              <ShoppingBag className="w-4 h-4 text-desa-accent" />
              <span>Pesanan Warga</span>
            </button>

            <button
              onClick={() => setAdminTab('pengguna')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all ${
                adminTab === 'pengguna'
                  ? 'bg-white/15 text-white font-bold shadow-sm'
                  : 'text-desa-light/70 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Users className="w-4 h-4 text-desa-highlight" />
              <span>Manajemen Pengguna</span>
            </button>

            <button
              onClick={() => setAdminTab('laporan')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all ${
                adminTab === 'laporan'
                  ? 'bg-white/15 text-white font-bold shadow-sm'
                  : 'text-desa-light/70 hover:bg-white/5 hover:text-white'
              }`}
            >
              <FileText className="w-4 h-4 text-desa-accent" />
              <span>Laporan & Siaran</span>
            </button>

            <button
              onClick={() => setAdminTab('pesan')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all ${
                adminTab === 'pesan'
                  ? 'bg-white/15 text-white font-bold shadow-sm'
                  : 'text-desa-light/70 hover:bg-white/5 hover:text-white'
              }`}
            >
              <MessageSquare className="w-4 h-4 text-desa-highlight" />
              <span>Pusat Pesan & Komplain</span>
            </button>
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-white/10 space-y-2">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => setCurrentView('web')}
            className="w-full py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-desa-light text-xs font-semibold flex items-center justify-center gap-2 transition-all"
          >
            <span>Buka Website Publik</span>
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => setIsAdminAuth(false)}
            className="w-full py-2 px-3 rounded-xl text-rose-300 hover:bg-rose-900/30 text-xs font-semibold flex items-center justify-center gap-2 transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Keluar Admin</span>
          </motion.button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA WITH PROFESSIONAL ADMIN TOP BAR */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        
        {/* Dedicated Admin Top Navigation Header (Menggantikan Navbar Publik) */}
        <header className="bg-white border-b border-desa-primary/15 px-6 sm:px-8 py-3.5 flex items-center justify-between shadow-xs shrink-0 z-20">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-desa-accent bg-desa-accent/10 px-2.5 py-1 rounded-md">
              Panel Pengelola BUMDes
            </span>
            <span className="text-desa-text/30 hidden sm:inline">•</span>
            <span className="text-xs font-semibold text-desa-text/70 hidden sm:inline">
              Pemerintah Balai Desa Mandiri
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Pratinjau Pengguna (Switch Mode) Buttons */}
            <div className="flex items-center gap-1.5 bg-desa-bg p-1 rounded-xl border border-desa-primary/15 text-xs">
              <span className="text-[10px] uppercase font-bold text-desa-text/50 px-2 hidden lg:inline">
                Lihat Pratinjau:
              </span>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setCurrentView('web')}
                className="px-3 py-1 rounded-lg bg-white text-desa-primary hover:text-desa-accent text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-all"
                title="Buka Website Publik Pembeli"
              >
                <Globe className="w-3.5 h-3.5 text-desa-primary" />
                <span>Web Publik</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setCurrentView('mobile')}
                className="px-3 py-1 rounded-lg bg-white text-desa-primary hover:text-desa-accent text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-all"
                title="Buka Versi Aplikasi Mobile PWA"
              >
                <Smartphone className="w-3.5 h-3.5 text-desa-accent" />
                <span>Mobile PWA</span>
              </motion.button>
            </div>

            {/* Admin Profile & Status */}
            <div className="flex items-center gap-2.5 pl-2 border-l border-desa-primary/15">
              <div className="w-8 h-8 rounded-full bg-desa-primary text-desa-light flex items-center justify-center font-bold text-xs shadow-xs">
                AD
              </div>
              <div className="hidden sm:block text-left text-xs leading-tight">
                <span className="font-bold text-desa-primary block">Admin Desa</span>
                <span className="text-[10px] text-desa-highlight font-semibold">● Terhubung</span>
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Admin Content Body */}
        <main className="flex-1 p-6 sm:p-10 overflow-y-auto space-y-8 bg-desa-bg/60">

        {/* 3.2 TAB: DASHBOARD UTAMA */}
        {adminTab === 'dashboard' && (
          <div className="space-y-8 animate-fadeIn">
            <div>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-desa-primary">
                Ringkasan Ekosistem Desa
              </h2>
              <p className="text-xs sm:text-sm text-desa-text/60 mt-1">
                Data real-time aktivitas UMKM, transaksi warga, dan perkembangan pasar desa.
              </p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <motion.div whileHover={{ y: -4 }} className="bg-white p-5 rounded-2xl border border-desa-primary/15 shadow-sm space-y-2">
                <span className="text-xs text-desa-text/60 block font-medium">Total UMKM Aktif</span>
                <div className="font-heading text-3xl font-bold text-desa-primary">
                  {shops.filter(s => s.status === 'aktif').length}
                </div>
                <span className="text-[11px] text-desa-highlight font-semibold">
                  +2 menunggu verifikasi
                </span>
              </motion.div>

              <motion.div whileHover={{ y: -4 }} className="bg-white p-5 rounded-2xl border border-desa-primary/15 shadow-sm space-y-2">
                <span className="text-xs text-desa-text/60 block font-medium">Total Produk Tayang</span>
                <div className="font-heading text-3xl font-bold text-desa-primary">
                  {products.filter(p => !p.isHidden).length}
                </div>
                <span className="text-[11px] text-desa-accent font-semibold">
                  5 kategori unggulan
                </span>
              </motion.div>

              <motion.div whileHover={{ y: -4 }} className="bg-white p-5 rounded-2xl border border-desa-primary/15 shadow-sm space-y-2">
                <span className="text-xs text-desa-text/60 block font-medium">Total Transaksi</span>
                <div className="font-heading text-3xl font-bold text-desa-primary">
                  {orders.length}
                </div>
                <span className="text-[11px] text-emerald-600 font-semibold">
                  100% diproses langsung
                </span>
              </motion.div>

              <motion.div whileHover={{ y: -4 }} className="bg-white p-5 rounded-2xl border border-desa-primary/15 shadow-sm space-y-2">
                <span className="text-xs text-desa-text/60 block font-medium">Omset Terfasilitasi</span>
                <div className="font-heading text-2xl font-bold text-desa-highlight">
                  Rp 84,5 Juta
                </div>
                <span className="text-[11px] text-desa-text/60 font-semibold">
                  Bulan Oktober 2026
                </span>
              </motion.div>
            </div>

            {/* Grafik Sederhana Tren Transaksi & Aktivitas Terbaru */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Tren Transaksi Mingguan with Dynamic Animated Height Bars */}
              <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-desa-primary/15 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading font-bold text-base text-desa-primary">
                    Tren Transaksi Mingguan
                  </h3>
                  <span className="text-xs font-semibold text-desa-highlight bg-desa-highlight/10 px-2 py-0.5 rounded-full">
                    Oktober 2026
                  </span>
                </div>

                <p className="text-xs text-desa-text/60">
                  Volume transaksi produk lurik dan kuliner menunjukkan kenaikan stabil setiap akhir pekan.
                </p>

                {/* Animated Growing Bars */}
                <div className="pt-6 pb-2 flex items-end justify-between gap-3 h-48 border-b border-desa-primary/10">
                  {[
                    { label: 'Sen', val: 35, count: '14 order' },
                    { label: 'Sel', val: 42, count: '18 order' },
                    { label: 'Rab', val: 50, count: '22 order' },
                    { label: 'Kam', val: 65, count: '29 order' },
                    { label: 'Jum', val: 80, count: '38 order' },
                    { label: 'Sab', val: 95, count: '52 order' },
                    { label: 'Min', val: 88, count: '46 order' },
                  ].map((bar, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                      <span className="text-[10px] font-bold text-desa-primary opacity-0 group-hover:opacity-100 transition-opacity">
                        {bar.count}
                      </span>
                      <motion.div 
                        initial={{ height: 0 }}
                        animate={{ height: `${bar.val}%` }}
                        transition={{ duration: 0.8, delay: i * 0.08, ease: 'easeOut' }}
                        className="w-full bg-desa-primary group-hover:bg-desa-highlight rounded-t-lg transition-colors relative overflow-hidden shadow-xs"
                      >
                        <div className="absolute inset-0 bg-lurik-stripes-light opacity-30" />
                      </motion.div>
                      <span className="text-[11px] font-semibold text-desa-text/70">{bar.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Daftar Aktivitas Terbaru */}
              <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-desa-primary/15 shadow-sm space-y-4">
                <h3 className="font-heading font-bold text-base text-desa-primary">
                  Aktivitas Terbaru
                </h3>

                <div className="space-y-3 divide-y divide-desa-primary/10 text-xs">
                  <div className="pt-3 first:pt-0 flex items-start gap-3">
                    <span className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0 animate-ping" />
                    <div>
                      <p className="font-semibold text-desa-primary">
                        Pendaftaran UMKM Baru: <strong>Kopi Robusta Sukamaju</strong>
                      </p>
                      <span className="text-[10px] text-desa-text/50">10 menit yang lalu</span>
                    </div>
                  </div>

                  <div className="pt-3 flex items-start gap-3">
                    <span className="w-2 h-2 rounded-full bg-desa-highlight mt-1.5 shrink-0" />
                    <div>
                      <p className="font-semibold text-desa-primary">
                        Pesanan baru: <strong>ORD-2026-081</strong> (Kain Tenun Lurik)
                      </p>
                      <span className="text-[10px] text-desa-text/50">25 menit yang lalu</span>
                    </div>
                  </div>

                  <div className="pt-3 flex items-start gap-3">
                    <span className="w-2 h-2 rounded-full bg-desa-accent mt-1.5 shrink-0" />
                    <div>
                      <p className="font-semibold text-desa-primary">
                        Broadcast pengumuman pelatihan sertifikasi halal terkirim
                      </p>
                      <span className="text-[10px] text-desa-text/50">2 jam yang lalu</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* 3.3 TAB: MANAJEMEN UMKM */}
        {adminTab === 'umkm' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-heading text-2xl font-bold text-desa-primary">
                  Manajemen Toko & UMKM Desa
                </h2>
                <p className="text-xs text-desa-text/60">
                  Verifikasi pendaftaran toko baru, inspeksi dokumen, dan kelola status UMKM.
                </p>
              </div>

              {/* Filter Status */}
              <div className="flex items-center gap-2">
                {['semua', 'menunggu', 'aktif', 'ditolak'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setUmkmFilter(st)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                      umkmFilter === st
                        ? 'bg-desa-primary text-desa-light shadow'
                        : 'bg-white border border-desa-primary/20 text-desa-text/70'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* UMKM Table */}
            <div className="bg-white rounded-2xl border border-desa-primary/15 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-desa-bg/70 text-desa-primary font-bold border-b border-desa-primary/10">
                    <tr>
                      <th className="p-3.5">Nama Usaha</th>
                      <th className="p-3.5">Pemilik</th>
                      <th className="p-3.5">Kategori & Lokasi</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 text-right">Aksi Verifikasi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-desa-primary/10">
                    {shops
                      .filter(s => umkmFilter === 'semua' || s.status === umkmFilter)
                      .map((shop) => (
                        <tr key={shop.id} className="hover:bg-desa-bg/30 transition-colors">
                          <td className="p-3.5 font-bold text-desa-primary">
                            <div className="flex items-center gap-2.5">
                              <img src={shop.avatar} alt={shop.name} className="w-8 h-8 rounded-lg object-cover" />
                              <span>{shop.name}</span>
                            </div>
                          </td>
                          <td className="p-3.5 text-desa-text/80">{shop.owner}</td>
                          <td className="p-3.5 text-desa-text/70">
                            <div>{shop.category}</div>
                            <span className="text-[10px] text-desa-accent font-semibold">{shop.dusun}</span>
                          </td>
                          <td className="p-3.5">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold capitalize ${
                              shop.status === 'aktif' ? 'bg-emerald-100 text-emerald-800' :
                              shop.status === 'menunggu' ? 'bg-amber-100 text-amber-800 animate-pulse' :
                              'bg-rose-100 text-rose-800'
                            }`}>
                              {shop.status}
                            </span>
                          </td>
                          <td className="p-3.5 text-right space-x-2">
                            {shop.status === 'menunggu' ? (
                              <>
                                <motion.button
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => verifyShop(shop.id, 'aktif')}
                                  className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-[11px] font-bold hover:bg-emerald-700 shadow-sm"
                                >
                                  Setujui (Approve)
                                </motion.button>
                                <motion.button
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => verifyShop(shop.id, 'ditolak')}
                                  className="px-2.5 py-1 rounded-lg bg-rose-600 text-white text-[11px] font-bold hover:bg-rose-700 shadow-sm"
                                >
                                  Tolak (Reject)
                                </motion.button>
                              </>
                            ) : (
                              <motion.button
                                whileTap={{ scale: 0.95 }}
                                onClick={() => verifyShop(shop.id, shop.status === 'aktif' ? 'ditolak' : 'aktif')}
                                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border ${
                                  shop.status === 'aktif'
                                    ? 'border-rose-300 text-rose-600 hover:bg-rose-50'
                                    : 'border-emerald-300 text-emerald-600 hover:bg-emerald-50'
                                }`}
                              >
                                {shop.status === 'aktif' ? 'Nonaktifkan / Blokir' : 'Aktifkan Kembali'}
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

        {/* 3.4 TAB: PRODUK & KATEGORI */}
        {adminTab === 'produk' && (
          <div className="space-y-8 animate-fadeIn">
            <div>
              <h2 className="font-heading text-2xl font-bold text-desa-primary">
                Manajemen Produk & Kategori
              </h2>
              <p className="text-xs text-desa-text/60">
                Moderasi konten produk lintas toko desa dan manajemen taksonomi kategori.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-desa-primary/15 shadow-sm space-y-3">
              <h3 className="font-heading font-bold text-sm text-desa-primary">
                Kelola Daftar Kategori Desa
              </h3>
              <form onSubmit={handleAddCategory} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Nama kategori baru (mis. Gerabah, Olahan Susu Kambing)..."
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="flex-1 p-2 bg-desa-bg/50 border border-desa-primary/20 rounded-xl text-xs"
                />
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="px-4 py-2 bg-desa-primary text-desa-light rounded-xl text-xs font-bold shadow"
                >
                  + Tambah Kategori
                </motion.button>
              </form>

              <div className="flex flex-wrap gap-2 pt-2">
                {categories.map((c) => (
                  <motion.span 
                    key={c.id} 
                    whileHover={{ scale: 1.05 }}
                    className="px-3 py-1 rounded-full bg-desa-bg border border-desa-primary/15 text-xs font-medium flex items-center gap-1.5 shadow-xs"
                  >
                    <span>{c.name} ({c.count})</span>
                  </motion.span>
                ))}
              </div>
            </div>

            {/* Tabel Moderasi */}
            <div className="bg-white rounded-2xl border border-desa-primary/15 overflow-hidden shadow-sm">
              <div className="p-4 border-b border-desa-primary/10">
                <h3 className="font-heading font-bold text-sm text-desa-primary">
                  Semua Produk UMKM Lintas Toko
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-desa-bg/70 text-desa-primary font-bold">
                    <tr>
                      <th className="p-3.5">Produk</th>
                      <th className="p-3.5">Toko / UMKM</th>
                      <th className="p-3.5">Harga</th>
                      <th className="p-3.5">Status Moderasi</th>
                      <th className="p-3.5 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-desa-primary/10">
                    {products.map((prod) => (
                      <tr key={prod.id} className="hover:bg-desa-bg/30">
                        <td className="p-3.5 font-semibold text-desa-primary">
                          <div className="flex items-center gap-2.5">
                            <img src={prod.images[0]} alt={prod.name} className="w-9 h-9 rounded-lg object-cover" />
                            <span className="line-clamp-1">{prod.name}</span>
                          </div>
                        </td>
                        <td className="p-3.5 text-desa-text/75">{prod.shopName}</td>
                        <td className="p-3.5 font-bold text-desa-primary">
                          Rp {prod.price.toLocaleString('id-ID')}
                        </td>
                        <td className="p-3.5">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            prod.isHidden ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {prod.isHidden ? 'Disembunyikan (Melanggar)' : 'Tayang Publik'}
                          </span>
                        </td>
                        <td className="p-3.5 text-right">
                          <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => toggleProductStatus(prod.id)}
                            className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                              prod.isHidden
                                ? 'bg-emerald-600 text-white'
                                : 'bg-rose-100 text-rose-700 hover:bg-rose-200'
                            }`}
                          >
                            {prod.isHidden ? 'Pulihkan' : 'Sembunyikan'}
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

        {/* 3.5 TAB: MANAJEMEN PENGGUNA */}
        {adminTab === 'pengguna' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-heading text-2xl font-bold text-desa-primary">
                  Manajemen Akun Pengguna
                </h2>
                <p className="text-xs text-desa-text/60">
                  Daftar seluruh akun warga pembeli dan pengrajin penjual.
                </p>
              </div>

              {/* Filter Role */}
              <div className="flex items-center gap-2">
                {['semua', 'pembeli', 'penjual', 'keduanya', 'admin'].map((role) => (
                  <button
                    key={role}
                    onClick={() => setUserRoleFilter(role)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                      userRoleFilter === role
                        ? 'bg-desa-primary text-desa-light shadow'
                        : 'bg-white border border-desa-primary/20 text-desa-text/70'
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-2xl border border-desa-primary/15 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-desa-bg/70 text-desa-primary font-bold">
                    <tr>
                      <th className="p-3.5">Nama</th>
                      <th className="p-3.5">Kontak</th>
                      <th className="p-3.5">Peran</th>
                      <th className="p-3.5">Toko Terkait</th>
                      <th className="p-3.5 text-right">Aksi Admin</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-desa-primary/10">
                    {users
                      .filter(u => userRoleFilter === 'semua' || u.role === userRoleFilter)
                      .map((u) => (
                        <tr key={u.id} className="hover:bg-desa-bg/30">
                          <td className="p-3.5 font-bold text-desa-primary">{u.name}</td>
                          <td className="p-3.5 text-desa-text/70">
                            <div>{u.phone}</div>
                            <span className="text-[10px] text-desa-text/50">{u.email}</span>
                          </td>
                          <td className="p-3.5">
                            <span className="px-2.5 py-0.5 rounded-full bg-desa-primary/10 text-desa-primary font-bold uppercase text-[10px]">
                              {u.role}
                            </span>
                          </td>
                          <td className="p-3.5 text-desa-text/80">{u.shopName}</td>
                          <td className="p-3.5 text-right space-x-2">
                            <motion.button
                              whileTap={{ scale: 0.95 }}
                              onClick={() => alert(`Kata sandi untuk ${u.name} telah direset ke: DesaMandiri2026!`)}
                              className="px-2.5 py-1 rounded-lg border border-desa-primary/30 text-[11px] font-semibold text-desa-primary hover:bg-black/5"
                            >
                              Reset Sandi
                            </motion.button>
                            <motion.button
                              whileTap={{ scale: 0.95 }}
                              onClick={() => {
                                setUsers(prev => prev.map(usr => usr.id === u.id ? { ...usr, status: usr.status === 'diblokir' ? 'aktif' : 'diblokir' } : usr));
                                alert(`Status akun ${u.name} diperbarui!`);
                              }}
                              className="px-2.5 py-1 rounded-lg bg-rose-100 text-rose-700 text-[11px] font-semibold hover:bg-rose-200"
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

        {/* 3.6 TAB: LAPORAN & PENGUMUMAN */}
        {adminTab === 'laporan' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-heading text-2xl font-bold text-desa-primary">
                  Laporan Transaksi & Siaran Broadcast
                </h2>
                <p className="text-xs text-desa-text/60">
                  Unduh data performa dan kirim pesan serentak ke aplikasi warga desa.
                </p>
              </div>

              {/* Tombol Ekspor with Tap Animation */}
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleExportReport}
                className="px-4 py-2.5 rounded-xl bg-desa-highlight hover:bg-desa-highlight/90 text-white font-bold text-xs shadow-md flex items-center gap-2 self-start sm:self-auto shimmer-shine"
              >
                <Download className="w-4 h-4" />
                <span>Ekspor Laporan CSV</span>
              </motion.button>
            </div>

            {/* Form Buat Pengumuman Baru */}
            <div className="bg-white p-6 rounded-2xl border border-desa-primary/15 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-desa-accent" />
                <h3 className="font-heading font-bold text-base text-desa-primary">
                  Buat Pengumuman / Broadcast Baru
                </h3>
              </div>

              <form onSubmit={handleSendBroadcast} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-desa-primary mb-1">
                    Judul Pengumuman
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Bazar Pasar Kuliner Dusun Minggu Depan..."
                    value={broadcastTitle}
                    onChange={(e) => setBroadcastTitle(e.target.value)}
                    className="w-full p-2.5 bg-desa-bg/50 border border-desa-primary/20 rounded-xl text-xs"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-desa-primary mb-1">
                      Sasaran Penerima
                    </label>
                    <select
                      value={broadcastTarget}
                      onChange={(e) => setBroadcastTarget(e.target.value)}
                      className="w-full p-2.5 bg-desa-bg/50 border border-desa-primary/20 rounded-xl text-xs"
                    >
                      <option value="Semua Pengguna">Semua Pengguna (Pembeli & Penjual)</option>
                      <option value="Khusus Penjual UMKM">Khusus Penjual UMKM</option>
                      <option value="Warga Dusun Krajan">Warga Dusun Krajan</option>
                    </select>
                  </div>

                  <div className="flex items-center pt-5">
                    <label className="flex items-center gap-2 text-xs font-semibold text-desa-primary cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isUrgent}
                        onChange={(e) => setIsUrgent(e.target.checked)}
                        className="accent-desa-accent"
                      />
                      <span>Tandai Sebagai Pengumuman Mendesak (Urgent)</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-desa-primary mb-1">
                    Isi Pesan Broadcast
                  </label>
                  <textarea
                    rows="3"
                    required
                    placeholder="Tuliskan rincian pengumuman yang akan muncul di notifikasi aplikasi HP warga..."
                    value={broadcastMessage}
                    onChange={(e) => setBroadcastMessage(e.target.value)}
                    className="w-full p-2.5 bg-desa-bg/50 border border-desa-primary/20 rounded-xl text-xs"
                  />
                </div>

                <motion.button
                  whileTap={{ scale: 0.96 }}
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-desa-primary text-desa-light text-xs font-bold shadow hover:bg-desa-primary/90 transition-all"
                >
                  Kirim Broadcast Sekarang
                </motion.button>
              </form>
            </div>

            {/* Riwayat Pengumuman */}
            <div className="bg-white rounded-2xl border border-desa-primary/15 overflow-hidden shadow-sm">
              <div className="p-4 border-b border-desa-primary/10">
                <h3 className="font-heading font-bold text-sm text-desa-primary">
                  Riwayat Pengumuman Terkirim
                </h3>
              </div>
              <div className="divide-y divide-desa-primary/10 text-xs">
                {announcements.map((ann) => (
                  <div key={ann.id} className="p-4 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-desa-primary text-sm">{ann.title}</span>
                      <span className="text-[11px] text-desa-text/50">{ann.date}</span>
                    </div>
                    <p className="text-desa-text/75">{ann.excerpt}</p>
                    <span className="text-[10px] text-desa-accent font-semibold block pt-1">
                      Target: {ann.target}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 3.7 TAB: PUSAT PESAN & KOMPLAIN WARGA */}
        {adminTab === 'pesan' && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h2 className="font-heading text-2xl font-bold text-desa-primary">
                Pusat Pesan, Konsultasi Stok & Komplain Warga
              </h2>
              <p className="text-xs text-desa-text/60">
                Pantau percakapan antara pembeli, chatbot cerdas desa, dan admin toko katalog UMKM.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white rounded-3xl border border-desa-primary/15 shadow-sm overflow-hidden h-[620px]">
              {/* Kolom Kiri: Daftar Saluran Obrolan */}
              <div className="lg:col-span-4 border-r border-desa-primary/10 flex flex-col h-full bg-desa-bg/30">
                <div className="p-4 border-b border-desa-primary/10 bg-white">
                  <h3 className="text-xs font-bold text-desa-primary uppercase tracking-wider">
                    Ruang Pesan Aktif ({Object.keys(chatThreads).length})
                  </h3>
                </div>

                <div className="flex-1 overflow-y-auto divide-y divide-desa-primary/10">
                  {/* General Bot */}
                  <div
                    onClick={() => setSelectedAdminThread('general-bot')}
                    className={`p-4 cursor-pointer transition-colors ${
                      selectedAdminThread === 'general-bot'
                        ? 'bg-desa-accent/10 border-l-4 border-desa-accent'
                        : 'hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-desa-primary">Asisten Virtual Desa (Bot)</span>
                      <span className="text-[10px] text-desa-text/50">Umum</span>
                    </div>
                    <p className="text-[11px] text-desa-text/70 line-clamp-1">
                      {chatThreads['general-bot']?.[chatThreads['general-bot'].length - 1]?.text || 'Percakapan bot'}
                    </p>
                  </div>

                  {/* Threads per Toko */}
                  {shops.map((s) => {
                    const thread = chatThreads[s.id] || [];
                    const lastMsg = thread[thread.length - 1];
                    const isSelected = selectedAdminThread === s.id;

                    return (
                      <div
                        key={s.id}
                        onClick={() => setSelectedAdminThread(s.id)}
                        className={`p-4 cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-desa-accent/10 border-l-4 border-desa-accent'
                            : 'hover:bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-desa-primary truncate max-w-[170px]">
                            {s.name}
                          </span>
                          <span className="text-[10px] text-desa-highlight font-medium shrink-0">
                            {thread.length} pesan
                          </span>
                        </div>
                        <p className="text-[10px] text-desa-text/60 mb-0.5">{s.owner} • {s.dusun}</p>
                        <p className="text-[11px] text-desa-text/75 line-clamp-1 italic">
                          {lastMsg ? lastMsg.text : 'Belum ada obrolan baru'}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Kolom Kanan: Isi Percakapan & Form Balas */}
              <div className="lg:col-span-8 flex flex-col h-full bg-white">
                {/* Header Percakapan */}
                <div className="p-4 border-b border-desa-primary/10 flex items-center justify-between bg-desa-bg/20">
                  <div>
                    <h4 className="text-xs font-bold text-desa-primary">
                      {selectedAdminThread === 'general-bot' 
                        ? 'Saluran Asisten Virtual Desa' 
                        : shops.find(s => s.id === selectedAdminThread)?.name || 'Admin Toko'}
                    </h4>
                    <p className="text-[11px] text-desa-text/60">
                      Mode Pemantauan & Balasan Resmi Pengelola BUMDes / Pemilik Katalog
                    </p>
                  </div>

                  <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-desa-highlight/15 text-desa-highlight">
                    Status: Aktif Memantau
                  </span>
                </div>

                {/* List Pesan */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-desa-bg/10">
                  {(chatThreads[selectedAdminThread] || []).map((msg) => {
                    const isUser = msg.sender === 'user';
                    const isSeller = msg.sender === 'seller';

                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${isUser ? 'items-start' : 'items-end'}`}
                      >
                        <span className="text-[10px] font-semibold text-desa-text/60 mb-0.5 px-1">
                          {isUser ? 'Pembeli / Warga' : isSeller ? `${msg.senderName || 'Admin Toko'}` : 'Bot Sistem'}
                        </span>
                        <div
                          className={`max-w-[75%] p-3 rounded-2xl text-xs shadow-xs ${
                            isUser
                              ? 'bg-white border border-desa-primary/15 text-desa-primary'
                              : 'bg-desa-primary text-desa-light'
                          }`}
                        >
                          <p>{msg.text}</p>
                          <span
                            className={`text-[9px] block text-right mt-1 ${
                              isUser ? 'text-desa-text/50' : 'text-desa-light/60'
                            }`}
                          >
                            {msg.time}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Form Kirim Balasan Admin */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!adminReplyText.trim()) return;
                    sendChatMessage(adminReplyText, selectedAdminThread);
                    setAdminReplyText('');
                    triggerNotification('Pesan Terkirim', 'Balasan admin berhasil disampaikan ke ruang obrolan.');
                  }}
                  className="p-3 border-t border-desa-primary/10 flex items-center gap-2 bg-white"
                >
                  <input
                    type="text"
                    placeholder="Tulis balasan resmi admin (misal konfirmasi stok atau solusi komplain)..."
                    value={adminReplyText}
                    onChange={(e) => setAdminReplyText(e.target.value)}
                    className="flex-1 px-3.5 py-2.5 text-xs rounded-xl border border-desa-primary/20 bg-desa-bg/30 text-desa-text focus:outline-none focus:ring-1 focus:ring-desa-accent"
                  />
                  <button
                    type="submit"
                    disabled={!adminReplyText.trim()}
                    className="px-5 py-2.5 rounded-xl bg-desa-accent text-white text-xs font-bold hover:bg-desa-accent/90 disabled:opacity-40 transition-all shadow-sm"
                  >
                    Kirim Balasan
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        </main>
      </div>
    </div>
  );
}
