import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import MonthlyPerformanceChart from './MonthlyPerformanceChart';
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
    } finally {
      setUpdatingOrderId(null);
    }
  };
  const orderStatusLabel = {
    diproses: 'Perlu diproses',
    diambil: 'Sudah diambil',
    dikirim: 'Sedang dikirim',
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
    { id: 'pesan', label: 'Pusat Pesan & Komplain', icon: MessageSquare },
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
        setAdminError('Akun ini tidak memiliki akses admin.');
        return;
      }
      triggerNotification('Login Admin Berhasil', 'Selamat datang di Panel Pengelola Balai Desa.');
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
    alert('Laporan transaksi berformat CSV berhasil diunduh!');
  };
  if (!isAdminAuth) {
    return (
      <div className="font-ui flex min-h-screen items-center justify-center bg-[#F7F6F2] p-4">
        <div className="w-full max-w-md space-y-6 rounded-lg border border-[#D8D5CC] bg-white p-6 sm:p-8">
          <div className="space-y-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-[#EAE8E1] text-[#2F2F2D]">
              <Store className="h-4 w-4" aria-hidden="true" />
            </div>
            <h2 className="text-2xl font-semibold text-[#232220]">Masuk ke Pasar Desa</h2>
            <p className="text-sm text-[#65635D]">Gunakan akun admin untuk mengelola pesanan dan UMKM.</p>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-4">
            {adminError && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">{adminError}</p>}
            <div>
              <label className="mb-2 block text-sm font-medium text-[#2F2F2D]">
                Email petugas
              </label>
              <input
                type="text"
                required
                autoComplete="username"
                value={adminUsername}
                onChange={(e) => setAdminUsername(e.target.value)}
                className="min-h-10 w-full rounded-md border border-[#7c7b76] bg-white px-3 text-sm text-[#232220] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9E5335]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#2F2F2D]">
                Kata sandi
              </label>
              <input
                type="password"
                required
                autoComplete="current-password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="min-h-10 w-full rounded-md border border-[#7c7b76] bg-white px-3 text-sm text-[#232220] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9E5335]"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="min-h-10 w-full rounded-md bg-[#2F2F2D] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#232220] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9E5335]"
              >
                Masuk ke Dashboard Admin
              </button>
            </div>
          </form>

          <div className="border-t border-[#EAE8E1] pt-4">
            <button
              onClick={() => setCurrentView('web')}
              className="text-sm font-medium text-[#2F2F2D] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9E5335]"
            >
              ← Kembali ke Website Publik
            </button>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="admin-shell font-ui min-h-screen bg-[#F7F6F2] text-[#232220] flex flex-col xl:flex-row">
      <aside className="relative z-30 w-full shrink-0 border-b border-[#D8D5CC] bg-[#F7F6F2] xl:sticky xl:top-0 xl:h-screen xl:w-60 xl:border-b-0 xl:border-r">
        <div className="flex items-center justify-between px-4 py-3 xl:px-5 xl:py-5">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-[#EAE8E1] text-[#2F2F2D]">
              <Store className="h-4 w-4" aria-hidden="true" />
            </span>
            <div>
              <h3 className="text-sm font-semibold leading-5 text-[#232220]">Pasar Desa</h3>
              <span className="text-xs text-[#65635D]">Panel pengelola BUMDes</span>
            </div>
          </div>
          <button
            type="button"
            aria-expanded={mobileNavOpen}
            aria-controls="admin-navigation"
            onClick={() => setMobileNavOpen(value => !value)}
            className="rounded-md border border-[#D8D5CC] bg-white px-3 py-2 text-sm font-medium text-[#2F2F2D] hover:bg-[#e9e8e4] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9E5335] xl:hidden"
          >
            {mobileNavOpen ? 'Tutup menu' : 'Menu'}
          </button>
        </div>

        <nav
          id="admin-navigation"
          aria-label="Navigasi admin"
          className={`${mobileNavOpen ? 'grid' : 'hidden'} absolute left-0 right-0 top-full gap-1 border-b border-[#D8D5CC] bg-[#F7F6F2] p-3 text-sm xl:static xl:grid xl:border-0 xl:p-3`}
        >
          {adminNavItems.map(({ id, label, icon: Icon, count }) => (
            <button
              key={id}
              type="button"
              aria-current={adminTab === id ? 'page' : undefined}
              onClick={() => { setAdminTab(id); setMobileNavOpen(false); }}
              className={`flex min-h-9 w-full items-center justify-between gap-3 rounded-md px-3 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9E5335] ${adminTab === id ? 'bg-[#EAE8E1] font-semibold text-[#232220]' : 'text-[#52504A] hover:bg-[#EFECE5] hover:text-[#232220]'}`}
            >
              <span className="flex min-w-0 items-center gap-3">
                <Icon className="h-4 w-4 shrink-0 text-[#65635D]" aria-hidden="true" />
                <span className="truncate">{label}</span>
              </span>
              {count > 0 && <span className="min-w-5 rounded-sm bg-white px-1.5 py-0.5 text-center text-xs tabular-nums text-[#2F2F2D]">{count}</span>}
            </button>
          ))}
          <div className="grid grid-cols-2 gap-2 border-t border-[#D8D5CC] pt-3 xl:hidden">
            <button onClick={() => { setCurrentView('web'); setMobileNavOpen(false); }} className="min-h-10 rounded-md border border-[#D8D5CC] bg-white px-3 text-sm font-medium text-[#2F2F2D]">Website</button>
            <button onClick={() => { logout(); setMobileNavOpen(false); }} className="min-h-10 rounded-md px-3 text-sm font-medium text-[#9E5335]">Keluar admin</button>
          </div>
        </nav>

        <div className="hidden border-t border-[#D8D5CC] p-3 xl:absolute xl:bottom-0 xl:left-0 xl:right-0 xl:grid xl:gap-1">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => setCurrentView('web')}
            className="flex min-h-9 w-full items-center rounded-md px-3 text-sm font-medium text-[#52504A] hover:bg-[#EFECE5] hover:text-[#232220]"
          >
            <span>Buka website publik</span>
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => logout()}
            className="flex min-h-9 w-full items-center gap-2 rounded-md px-3 text-sm font-medium text-[#9E5335] hover:bg-[#EFECE5]"
          >
            <LogOut className="h-4 w-4" />
            <span>Keluar admin</span>
          </motion.button>
        </div>
      </aside>

      
      <div className="flex min-h-screen min-w-0 flex-1 flex-col xl:h-screen xl:overflow-hidden">
        
        
        <header className="z-20 flex min-h-12 shrink-0 flex-wrap items-center justify-between gap-3 border-b border-[#D8D5CC] bg-white px-4 py-2 sm:px-6 xl:px-8">
          <div className="flex min-w-0 flex-wrap items-center gap-3">
            <span className="text-sm font-semibold text-[#232220]">
              Pengelolaan pasar desa
            </span>
            <span className="text-desa-text/30 hidden sm:inline">•</span>
            <span className="hidden text-sm text-[#65635D] sm:inline">
              Sumedang
            </span>
          </div>

          <div className="flex max-w-full flex-wrap items-center justify-end gap-2 sm:gap-3">
            
            <div className="hidden items-center gap-1 sm:flex">
              <span className="text-[10px] uppercase font-bold text-desa-text/50 px-2 hidden lg:inline">
                Lihat Pratinjau:
              </span>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setCurrentView('web')}
                className="flex min-h-8 items-center gap-1.5 rounded-md px-2.5 text-sm font-medium text-[#52504A] transition-colors hover:bg-[#EFECE5] hover:text-[#232220]"
                title="Buka Website Publik Pembeli"
              >
                <Globe className="h-4 w-4 text-[#65635D]" />
                <span>Web Publik</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setCurrentView('mobile')}
                className="flex min-h-8 items-center gap-1.5 rounded-md px-2.5 text-sm font-medium text-[#52504A] transition-colors hover:bg-[#EFECE5] hover:text-[#232220]"
                title="Buka Versi Aplikasi Mobile PWA"
              >
                <Smartphone className="h-4 w-4 text-[#65635D]" />
                <span>Mobile PWA</span>
              </motion.button>
            </div>

            
            <div className="flex items-center gap-2 border-l border-[#D8D5CC] pl-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#EAE8E1] text-xs font-semibold text-[#2F2F2D]" aria-hidden="true">
                {(currentUser?.name || 'Admin Desa').split(' ').map(part => part[0]).slice(0, 2).join('')}
              </div>
              <div className="hidden text-left text-xs leading-tight sm:block">
                <span className="block font-semibold text-[#232220]">{currentUser?.name || 'Admin Desa'}</span>
                <span className="text-[#65635D]">
                  {dataSource === 'demo' ? 'Data contoh' : 'Backend tersambung'}
                </span>
              </div>
            </div>
          </div>
        </header>

        
        <main className="min-w-0 flex-1 space-y-8 overflow-y-auto bg-[#F7F6F2] p-4 sm:p-6 xl:p-9">

        
        {adminTab === 'dashboard' && (
          <div className="space-y-5">
            <div>
              <h1 className="text-2xl font-semibold leading-tight text-[#232220]">
                Ringkasan pasar desa
              </h1>
              <p className="mt-1 text-sm text-[#65635D]">
                Transaksi, omzet, dan pekerjaan yang perlu ditindaklanjuti.
              </p>
              {dataSource === 'demo' && (
                <p className="mt-2 text-sm text-[#65635D]">
                  Data contoh · data operasional tampil saat backend tersambung.
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 overflow-hidden rounded-lg border border-[#D8D5CC] bg-white divide-y sm:divide-y-0 sm:divide-x divide-[#EAE8E1]">
              {[
                {
                  label: 'Total omzet selesai',
                  value: `Rp ${Number(totalCompletedOmzet).toLocaleString('id-ID')}`,
                  subtext: 'Pesanan tuntas & diambil',
                  highlight: true,
                },
                {
                  label: 'Pesanan warga',
                  value: `${orders.filter(o => ['diambil', 'selesai'].includes(o.status)).length} / ${orders.length}`,
                  subtext: `${pendingOrders.length} perlu tindakan`,
                },
                {
                  label: 'UMKM aktif',
                  value: shops.filter(shop => shop.status === 'aktif').length,
                  subtext: 'Toko terverifikasi',
                },
                {
                  label: 'Produk tayang',
                  value: products.filter(product => !product.isHidden).length,
                  subtext: 'Katalog aktif desa',
                },
              ].map(({ label, value, subtext, highlight }) => (
                <div key={label} className={`min-w-0 px-3 py-3 sm:px-5 sm:py-4 ${highlight ? 'bg-[#FAF8F5]' : ''}`}>
                  <p className="text-xs leading-4 text-[#65635D] sm:text-sm font-medium">{label}</p>
                  <p className={`mt-1 text-xl sm:text-2xl font-semibold tabular-nums truncate ${highlight ? 'text-emerald-800' : 'text-[#232220]'}`}>{value}</p>
                  {subtext && <p className="mt-1 text-xs text-[#8A8780]">{subtext}</p>}
                </div>
              ))}
            </div>

            <MonthlyPerformanceChart stats={stats} orders={orders} dataSource={dataSource} />


            <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-2">
              <section className="space-y-4 rounded-lg border border-[#D8D5CC] bg-white p-4 sm:p-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-base font-semibold text-[#232220]">Pesanan perlu diproses</h3>
                    <p className="mt-1 text-sm text-[#65635D]">Pesanan yang menunggu tindakan.</p>
                  </div>
                  <button onClick={() => setAdminTab('pesanan')} className="shrink-0 rounded-md px-2 py-1.5 text-sm font-medium text-[#2F2F2D] hover:bg-[#EFECE5] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9E5335]">
                    Lihat semua
                  </button>
                </div>
                {pendingOrders.length ? (
                  <ul className="divide-y divide-[#EAE8E1]">
                    {pendingOrders.map((order) => (
                      <li key={order.id} className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-[#232220]">{order.productName}</p>
                          <p className="mt-1 text-sm text-[#65635D]">{order.id} · {order.buyerName}</p>
                        </div>
                        <div className="flex shrink-0 flex-col items-end gap-2">
                          <span className="text-sm font-semibold tabular-nums text-[#232220]">Rp {Number(order.total || 0).toLocaleString('id-ID')}</span>
                          <div className="flex gap-2">
                            <button
                              disabled={updatingOrderId === order.id}
                              onClick={() => handleOrderStatus(order, 'selesai')}
                              className="rounded-md border border-emerald-600/40 bg-emerald-50 px-2.5 py-1.5 text-xs font-semibold text-emerald-800 hover:bg-emerald-100 disabled:opacity-50 transition-colors"
                              title="Tandai diambil & langsung selesaikan pesanan agar masuk ke omzet"
                            >
                              {updatingOrderId === order.id ? 'Memproses...' : 'Tandai diambil'}
                            </button>
                            <button
                              disabled={updatingOrderId === order.id}
                              onClick={() => handleOrderStatus(order, 'dikirim')}
                              className="rounded-md bg-[#2F2F2D] px-2.5 py-1.5 text-xs font-medium text-white hover:bg-[#232220] disabled:opacity-50 transition-colors"
                            >
                              Dikirim
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="rounded-md bg-[#F7F6F2] px-4 py-5 text-sm text-[#65635D]">Tidak ada pesanan yang perlu diproses.</p>
                )}
              </section>

              <section className="space-y-4 rounded-lg border border-[#D8D5CC] bg-white p-4 sm:p-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-base font-semibold text-[#232220]">Pendaftaran UMKM</h3>
                    <p className="mt-1 text-sm text-[#65635D]">Toko yang perlu diverifikasi.</p>
                  </div>
                  <button onClick={() => { setUmkmFilter('menunggu'); setAdminTab('umkm'); }} className="shrink-0 rounded-md px-2 py-1.5 text-sm font-medium text-[#2F2F2D] hover:bg-[#EFECE5] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9E5335]">
                    Lihat semua
                  </button>
                </div>
                {pendingShops.length ? (
                  <ul className="divide-y divide-[#EAE8E1]">
                    {pendingShops.map((shop) => (
                      <li key={shop.id} className="py-3 first:pt-0 last:pb-0">
                        <p className="text-sm font-semibold text-desa-primary">{shop.name}</p>
                        <p className="mt-1 text-sm text-desa-text/75">{shop.owner} · {shop.kecamatan}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="rounded-md bg-[#F7F6F2] px-4 py-5 text-sm text-[#65635D]">Tidak ada pendaftaran yang menunggu pemeriksaan.</p>
                )}
              </section>
            </div>
          </div>
        )}

        {adminTab === 'pesanan' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="font-heading text-2xl font-bold text-desa-primary">Pesanan Warga</h2>
                <p className="mt-1 text-sm text-desa-text/75">Perbarui status saat pesanan diambil atau mulai dikirim. Perubahan tersimpan ke database.</p>
              </div>
              <div className="flex flex-wrap gap-2" aria-label="Filter status pesanan">
                {[
                  ['aktif', 'Perlu tindakan'], ['semua', 'Semua'], ['diproses', 'Diproses'],
                  ['diambil', 'Diambil'], ['dikirim', 'Dikirim'], ['selesai', 'Selesai'], ['ditolak', 'Ditolak'],
                ].map(([value, label]) => (
                  <button key={value} onClick={() => setOrderFilter(value)} className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${orderFilter === value ? 'bg-desa-primary text-white' : 'border border-desa-primary/20 bg-white text-desa-text/75'}`}>
                    {label}{value === 'diproses' ? ` (${orders.filter(order => order.status === 'diproses').length})` : ''}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              {orders
                .filter(order => orderFilter === 'semua' || (orderFilter === 'aktif' ? ['diproses', 'dikirim'].includes(order.status) : order.status === orderFilter))
                .map(order => (
                  <article key={order.id} className="rounded-2xl border border-desa-primary/15 bg-white p-4 sm:p-5">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div className="min-w-0 space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-semibold text-desa-primary">{order.productName}</h3>
                          <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${order.status === 'diproses' ? 'bg-amber-100 text-amber-900' : order.status === 'dikirim' ? 'bg-sky-100 text-sky-900' : order.status === 'ditolak' ? 'bg-rose-100 text-rose-900' : 'bg-emerald-100 text-emerald-900'}`}>
                            {orderStatusLabel[order.status] || order.status}
                          </span>
                        </div>
                        <p className="text-sm text-desa-text/75">{order.id} · {order.date} · {order.qty || 1} barang</p>
                        <p className="text-sm text-desa-text/75">{order.buyerName} · {order.phone}</p>
                        <p className="text-sm text-desa-text/75">{order.shopName}{order.shippingMethod ? ` · ${order.shippingMethod}` : ''}</p>
                        <p className="max-w-2xl text-sm text-desa-text/75">{order.address}</p>
                        {order.notes && <p className="text-sm text-desa-text/75">Catatan: {order.notes}</p>}
                      </div>
                      <div className="flex shrink-0 flex-col items-start gap-3 lg:items-end">
                        <strong className="text-base text-desa-primary">Rp {Number(order.total || 0).toLocaleString('id-ID')}</strong>
                        <div className="flex flex-wrap items-center gap-2">
                          {order.status === 'diproses' && <>
                            <button
                              disabled={updatingOrderId === order.id}
                              onClick={() => handleOrderStatus(order, 'selesai')}
                              className="rounded-lg border border-emerald-600/40 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-800 hover:bg-emerald-100 disabled:opacity-50 transition-colors shadow-xs"
                              title="Tandai pesanan sudah diambil dan langsung selesaikan (masuk omzet)"
                            >
                              {updatingOrderId === order.id ? 'Memproses...' : '✓ Tandai diambil'}
                            </button>
                            <button
                              disabled={updatingOrderId === order.id}
                              onClick={() => handleOrderStatus(order, 'dikirim')}
                              className="rounded-lg bg-desa-primary px-3 py-2 text-xs font-semibold text-white hover:bg-desa-primary/90 disabled:opacity-50 transition-colors"
                            >
                              Tandai dikirim
                            </button>
                          </>}
                          {order.status === 'dikirim' && (
                            <button
                              disabled={updatingOrderId === order.id}
                              onClick={() => handleOrderStatus(order, 'selesai')}
                              className="rounded-lg bg-emerald-700 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-800 disabled:opacity-50 transition-colors"
                            >
                              {updatingOrderId === order.id ? 'Memproses...' : '✓ Tandai selesai'}
                            </button>
                          )}
                          {order.status === 'diambil' && (
                            <button
                              disabled={updatingOrderId === order.id}
                              onClick={() => handleOrderStatus(order, 'selesai')}
                              className="rounded-lg bg-emerald-700 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-800 disabled:opacity-50 transition-colors"
                            >
                              {updatingOrderId === order.id ? 'Memproses...' : '✓ Selesaikan pesanan'}
                            </button>
                          )}
                          {order.status === 'selesai' && (
                            <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800 border border-emerald-200">
                              ✓ Selesai & Masuk Omzet
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              {orders.filter(order => orderFilter === 'semua' || (orderFilter === 'aktif' ? ['diproses', 'dikirim'].includes(order.status) : order.status === orderFilter)).length === 0 && (
                <p className="rounded-2xl border border-desa-primary/15 bg-white px-5 py-8 text-center text-sm text-desa-text/75">Belum ada pesanan pada status ini.</p>
              )}
            </div>
          </div>
        )}

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
                      .filter((shop) => umkmFilter === 'semua' || (umkmFilter === 'menunggu'
                        ? ['menunggu', 'menunggu_verifikasi'].includes(shop.status)
                        : shop.status === umkmFilter))
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
                            <span className="text-[10px] text-desa-accent font-semibold">{shop.kecamatan}</span>
                          </td>
                          <td className="p-3.5">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold capitalize ${
                              shop.status === 'aktif' ? 'bg-emerald-100 text-emerald-800' :
                              ['menunggu', 'menunggu_verifikasi'].includes(shop.status) ? 'bg-amber-100 text-amber-800' :
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
                      <th className="p-3.5">Stok</th>
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
                          {editingProduct?.id === prod.id ? (
                            <input aria-label={`Harga ${prod.name}`} type="number" min="0" value={editingProduct.price} onChange={e => setEditingProduct(prev => ({ ...prev, price: e.target.value }))} className="w-28 rounded border px-2 py-1 text-xs" />
                          ) : `Rp ${Number(prod.price).toLocaleString('id-ID')}`}
                        </td>
                        <td className="p-3.5">
                          {editingProduct?.id === prod.id ? (
                            <input aria-label={`Stok ${prod.name}`} type="number" min="0" value={editingProduct.stock} onChange={e => setEditingProduct(prev => ({ ...prev, stock: e.target.value }))} className="w-20 rounded border px-2 py-1 text-xs" />
                          ) : prod.stock}
                        </td>
                        <td className="p-3.5">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            prod.isHidden ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {prod.isHidden ? 'Disembunyikan (Melanggar)' : 'Tayang Publik'}
                          </span>
                        </td>
                        <td className="p-3.5 text-right">
                          {editingProduct?.id === prod.id ? (
                            <div className="flex justify-end gap-2">
                              <button onClick={async () => { if (await updateProductNumbers(prod.id, { price: Number(editingProduct.price), stock: Number(editingProduct.stock) })) setEditingProduct(null); }} className="rounded-lg bg-desa-primary px-3 py-1 text-xs font-semibold text-white">Simpan</button>
                              <button onClick={() => setEditingProduct(null)} className="rounded-lg px-3 py-1 text-xs font-semibold text-desa-text">Batal</button>
                            </div>
                          ) : <button onClick={() => setEditingProduct({ id: prod.id, price: prod.price, stock: prod.stock })} className="mr-2 rounded-lg border border-desa-primary/20 px-3 py-1 text-xs font-semibold text-desa-primary">Ubah angka</button>}
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

              
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleExportReport}
                className="px-4 py-2.5 rounded-xl bg-desa-highlight hover:bg-desa-highlight/90 text-white font-bold text-xs shadow-md flex items-center gap-2 self-start sm:self-auto"
              >
                <Download className="w-4 h-4" />
                <span>Ekspor Laporan CSV</span>
              </motion.button>
            </div>

            
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
                    placeholder="Contoh: Bazar Kuliner Sumedang Minggu Depan..."
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
                      <option value="Warga Kecamatan Sumedang Utara">Warga Kecamatan Sumedang Utara</option>
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
              
              <div className="lg:col-span-4 border-r border-desa-primary/10 flex flex-col h-full bg-desa-bg/30">
                <div className="p-4 border-b border-desa-primary/10 bg-white">
                  <h3 className="text-sm font-medium text-desa-primary">
                    Ruang Pesan Aktif ({Object.keys(chatThreads).length})
                  </h3>
                </div>

                <div className="flex-1 overflow-y-auto divide-y divide-desa-primary/10">
                  
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
                        <p className="text-[10px] text-desa-text/60 mb-0.5">{s.owner} • {s.kecamatan}</p>
                        <p className="text-[11px] text-desa-text/75 line-clamp-1 italic">
                          {lastMsg ? lastMsg.text : 'Belum ada obrolan baru'}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              
              <div className="lg:col-span-8 flex flex-col h-full bg-white">
                
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
