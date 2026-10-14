import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import LurikDivider from '../../components/common/LurikDivider';
import { 
  Store, 
  Search, 
  Home, 
  ShoppingBag, 
  Package, 
  User, 
  Heart, 
  Plus, 
  Repeat, 
  MessageCircle, 
  Bell, 
  Settings, 
  CheckCircle, 
  Clock, 
  Truck, 
  Sparkles, 
  SlidersHorizontal,
  ChevronRight,
  ChevronLeft,
  X,
  Smartphone,
  Maximize2,
  Minimize2,
  DollarSign,
  TrendingUp,
  ToggleLeft,
  ToggleRight,
  Edit3,
  LogOut,
  Star,
  ExternalLink
} from 'lucide-react';

export default function MobileAppView() {
  const { 
    products, 
    categories, 
    orders, 
    shops, 
    announcements, 
    currentUser, 
    isLoggedIn,
    savedFavorites, 
    toggleFavorite,
    orderViaWhatsApp,
    addProduct,
    toggleProductStatus,
    updateOrderStatus,
    pushNotification,
    triggerNotification,
    setCurrentView 
  } = useApp();
  const [deviceFrameMode, setDeviceFrameMode] = useState(true); // phone frame vs full screen
  const [splashActive, setSplashActive] = useState(true);
  const [onboardingOpen, setOnboardingOpen] = useState(false);
  const [onboardingSlide, setOnboardingSlide] = useState(0);
  const [mobileRole, setMobileRole] = useState(currentUser?.role === 'penjual' ? 'penjual' : 'pembeli');
  const [currentTab, setCurrentTab] = useState('beranda');
  const [mobileSearch, setMobileSearch] = useState('');
  const [mobileSelectedProduct, setMobileSelectedProduct] = useState(null);
  const [orderStatusFilter, setOrderStatusFilter] = useState('semua');
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdStock, setNewProdStock] = useState('10');
  const [newProdCategory, setNewProdCategory] = useState('kuliner');
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdImage, setNewProdImage] = useState('https://images.unsplash.com/photo-1606744888344-498238f01769?auto=format&fit=crop&w=600&q=80');
  useEffect(() => {
    const timer = setTimeout(() => {
      setSplashActive(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);
  const displayedProducts = products.filter(p => {
    if (p.isHidden) return false;
    if (mobileSearch.trim()) {
      return p.name.toLowerCase().includes(mobileSearch.toLowerCase());
    }
    return true;
  });
  const sellerProducts = products.filter(p => p.shopId === (currentUser?.shopId || 'toko-1'));
  const sellerOrders = orders.filter(o => o.shopName === (currentUser?.shopName || 'Griya Tenun Lurik Lestari'));
  const handleAddProductSubmit = (e) => {
    e.preventDefault();
    if (!newProdName || !newProdPrice) return;
    addProduct({
      name: newProdName,
      price: Number(newProdPrice),
      stock: Number(newProdStock),
      category: newProdCategory,
      categoryName: categories.find(c => c.id === newProdCategory)?.name || 'Kuliner',
      description: newProdDesc || 'Produk unggulan hasil karya warga desa dengan bahan berkualitas alami.',
      images: [newProdImage],
      originalPrice: Number(newProdPrice) + 15000,
    });
    setShowAddProductModal(false);
    setNewProdName('');
    setNewProdPrice('');
    setNewProdDesc('');
  };

  return (
    <div className="py-6 px-4 bg-desa-bg/70 min-h-screen relative z-10 isolate">
      
      
      <div className="max-w-md mx-auto mb-4 bg-white p-3 rounded-2xl border border-desa-primary/20 shadow-sm flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-desa-highlight animate-ping" />
          <span className="font-bold text-desa-primary">PWA Simulasi Mobile</span>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setSplashActive(true)}
            className="px-2 py-1 bg-desa-bg text-desa-primary rounded-lg font-medium hover:bg-black/5"
            title="Tampilkan Splash Screen"
          >
            Splash
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setOnboardingOpen(true)}
            className="px-2 py-1 bg-desa-bg text-desa-primary rounded-lg font-medium hover:bg-black/5"
            title="Buka Onboarding"
          >
            Onboarding
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setDeviceFrameMode(!deviceFrameMode)}
            className="p-1.5 bg-desa-bg text-desa-primary rounded-lg font-medium hover:bg-black/5"
            title={deviceFrameMode ? 'Layar Penuh' : 'Bingkai Ponsel'}
          >
            {deviceFrameMode ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
          </motion.button>
        </div>
      </div>

      
      <div className={`mx-auto transition-all ${
        deviceFrameMode 
          ? 'max-w-[390px] h-[810px] rounded-[48px] border-[8px] border-desa-primary shadow-2xl relative overflow-hidden bg-desa-bg flex flex-col' 
          : 'max-w-md min-h-[700px] rounded-3xl border border-desa-primary/20 shadow-xl relative overflow-hidden bg-desa-bg flex flex-col'
      }`}>

        
        {deviceFrameMode && (
          <div className="bg-desa-bg px-6 pt-3 pb-1 flex items-center justify-between text-[11px] font-semibold text-desa-primary shrink-0 select-none border-b border-black/5">
            <span>09:41</span>
            <div className="w-20 h-4 bg-black rounded-full" />
            <div className="flex items-center gap-1.5">
              <span>5G</span>
              <div className="w-4 h-2 border border-black rounded-sm p-0.5">
                <div className="w-full h-full bg-black rounded-xs" />
              </div>
            </div>
          </div>
        )}

        
        <AnimatePresence>
          {splashActive && (
            <motion.div 
              initial={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.4 } }}
              onClick={() => setSplashActive(false)}
              className="absolute inset-0 z-50 bg-desa-primary text-desa-light flex flex-col items-center justify-center p-6 text-center cursor-pointer select-none"
            >
              <div className="absolute inset-0 bg-lurik-stripes-light opacity-15 pointer-events-none animate-lurik-scan" />

              <motion.div 
                initial={{ scale: 0.5, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className="w-20 h-20 rounded-2xl bg-white text-desa-primary flex items-center justify-center shadow-2xl mb-4 relative z-10"
              >
                <Store className="w-10 h-10 text-desa-accent" />
              </motion.div>

              <motion.h2 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="font-heading text-3xl font-bold text-desa-light relative z-10"
              >
                Pasar Desa
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-xs text-desa-light/70 tracking-widest uppercase mt-1 relative z-10"
              >
                Palet Lurik Kontemporer
              </motion.p>

              <div className="mt-8 flex items-center gap-1.5 relative z-10 text-[11px] text-desa-highlight font-semibold">
                <span className="w-2 h-2 rounded-full bg-desa-highlight animate-ping" />
                <span>Memuat Aplikasi Desa...</span>
              </div>
              <span className="text-[10px] text-desa-light/40 mt-4">Ketuk di mana saja untuk melanjutkan</span>
            </motion.div>
          )}
        </AnimatePresence>

        
        <AnimatePresence>
          {onboardingOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-40 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-3"
            >
              <motion.div 
                initial={{ y: 50, scale: 0.95 }}
                animate={{ y: 0, scale: 1 }}
                exit={{ y: 50, scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                className="w-full bg-white rounded-3xl p-6 text-center space-y-4 shadow-2xl border border-desa-primary/20"
              >
                <motion.div 
                  key={onboardingSlide}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="w-16 h-16 rounded-2xl bg-desa-bg mx-auto flex items-center justify-center text-desa-accent"
                >
                  {onboardingSlide === 0 && <ShoppingBag className="w-8 h-8" />}
                  {onboardingSlide === 1 && <MessageCircle className="w-8 h-8 text-desa-highlight" />}
                  {onboardingSlide === 2 && <Store className="w-8 h-8 text-desa-primary" />}
                </motion.div>

                <div>
                  <h3 className="font-heading font-bold text-lg text-desa-primary">
                    {onboardingSlide === 0 && 'Belanja Produk Asli Desa'}
                    {onboardingSlide === 1 && 'Pesan Mudah via WhatsApp'}
                    {onboardingSlide === 2 && 'Buka Toko UMKM Anda'}
                  </h3>
                  <p className="text-xs text-desa-text/70 mt-1 leading-relaxed">
                    {onboardingSlide === 0 && 'Dapatkan kain lurik, olahan pangan, dan kerajinan langsung dari UMKM Kabupaten Sumedang.'}
                    {onboardingSlide === 1 && 'Konfirmasi pesanan dan pembayaran langsung ke nomor WhatsApp penjual dengan aman.'}
                    {onboardingSlide === 2 && 'Warga desa dapat beralih ke mode penjual untuk memajang produk dan menerima pesanan masuk.'}
                  </p>
                </div>

                
                <div className="flex justify-center gap-1.5">
                  {[0, 1, 2].map((s) => (
                    <motion.span
                      key={s}
                      animate={{ width: onboardingSlide === s ? 24 : 8 }}
                      className={`h-1.5 rounded-full ${
                        onboardingSlide === s ? 'bg-desa-accent' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>

                <div className="pt-2 flex items-center gap-2">
                  {onboardingSlide > 0 && (
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setOnboardingSlide(s => s - 1)}
                      className="flex-1 py-2.5 rounded-xl border border-desa-primary/20 text-xs font-semibold text-desa-primary"
                    >
                      Sebelumnya
                    </motion.button>
                  )}
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      if (onboardingSlide < 2) {
                        setOnboardingSlide(s => s + 1);
                      } else {
                        setOnboardingOpen(false);
                        setOnboardingSlide(0);
                      }
                    }}
                    className="flex-1 py-2.5 rounded-xl bg-desa-primary text-white text-xs font-semibold shadow-md"
                  >
                    {onboardingSlide === 2 ? 'Mulai Sekarang' : 'Lanjut'}
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        
        <AnimatePresence>
          {pushNotification && (
            <motion.div 
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="absolute top-14 left-4 right-4 z-30 bg-desa-primary text-desa-light p-3 rounded-2xl shadow-xl border border-desa-light/20 flex items-start gap-3 pointer-events-none"
            >
              <Bell className="w-5 h-5 text-desa-highlight shrink-0 mt-0.5 animate-bounce" />
              <div className="flex-1 text-left">
                <span className="font-bold text-xs block text-white">{pushNotification.title}</span>
                <span className="text-[11px] text-desa-light/80 leading-tight block">{pushNotification.message}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        
        <div className="px-4 py-2.5 bg-white border-b border-desa-primary/10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-desa-primary text-desa-light flex items-center justify-center font-bold text-xs">
              <Store className="w-4 h-4" />
            </div>
            <div>
              <span className="font-heading font-bold text-sm text-desa-primary">Pasar Desa</span>
              <span className="text-[9px] block text-desa-text/50 uppercase leading-none font-medium">
                {mobileRole === 'pembeli' ? 'Mode Pembeli' : 'Mode Toko Penjual'}
              </span>
            </div>
          </div>

          
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={() => {
              const nextRole = mobileRole === 'pembeli' ? 'penjual' : 'pembeli';
              setMobileRole(nextRole);
              setCurrentTab(nextRole === 'penjual' ? 'dashboard' : 'beranda');
              triggerNotification('Beralih Mode', `Sekarang Anda berada di ${nextRole === 'penjual' ? 'Mode Penjual UMKM' : 'Mode Pembeli'}`);
            }}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-desa-bg border border-desa-primary/20 text-desa-primary hover:bg-desa-accent hover:text-white transition-all shadow-xs"
          >
            <Repeat className="w-3 h-3 text-desa-accent" />
            <span>{mobileRole === 'pembeli' ? 'Ke Mode Jual' : 'Ke Mode Beli'}</span>
          </motion.button>
        </div>

        
        <div className="flex-1 overflow-y-auto no-scrollbar pb-24">

          
          {mobileRole === 'pembeli' && (
            <div className="p-4 space-y-4">
              
              
              {currentTab === 'beranda' && (
                <>
                  <div className="relative">
                    <Search className="w-4 h-4 text-desa-accent absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Cari kain lurik, kripik, madu..."
                      value={mobileSearch}
                      onChange={(e) => setMobileSearch(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-white border border-desa-primary/20 rounded-xl text-xs text-desa-text focus:outline-none focus:border-desa-primary shadow-sm"
                    />
                  </div>

                  
                  {announcements.length > 0 && (
                    <motion.div 
                      initial={{ scale: 0.96, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="p-3.5 rounded-2xl bg-gradient-to-r from-desa-primary to-[#2C2C2A] text-desa-light shadow-md relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-lurik-stripes-light opacity-15" />
                      <div className="relative z-10 flex items-center justify-between">
                        <div>
                          <span className="text-[9px] font-bold uppercase tracking-wider text-desa-highlight bg-white/10 px-2 py-0.5 rounded">
                            Info Desa
                          </span>
                          <h4 className="font-heading font-semibold text-xs text-desa-light mt-1 line-clamp-1">
                            {announcements[0].title}
                          </h4>
                          <p className="text-[10px] text-desa-light/75 line-clamp-1 mt-0.5">
                            {announcements[0].excerpt}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-desa-primary">Kategori Produk</span>
                      <button 
                        onClick={() => setCurrentTab('katalog')} 
                        className="text-[11px] text-desa-accent font-semibold"
                      >
                        Lihat Semua
                      </button>
                    </div>

                    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                      {categories.map((c) => (
                        <motion.button
                          key={c.id}
                          whileTap={{ scale: 0.94 }}
                          onClick={() => setMobileSearch(c.id === 'semua' ? '' : c.name.split(' ')[0])}
                          className="px-3 py-2 rounded-xl bg-white border border-desa-primary/15 text-xs text-desa-primary font-medium shrink-0 flex items-center gap-1.5 shadow-xs hover:border-desa-accent transition-all"
                        >
                          <span className="w-2 h-2 rounded-full bg-desa-accent" />
                          <span>{c.name}</span>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-desa-primary">Rekomendasi Warga</span>
                      <span className="text-[10px] text-desa-text/50">{displayedProducts.length} Produk</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {displayedProducts.map((p) => (
                        <motion.div
                          key={p.id}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => setMobileSelectedProduct(p)}
                          className="bg-white rounded-2xl overflow-hidden border border-desa-primary/15 shadow-sm flex flex-col justify-between"
                        >
                          <div>
                            <div className="aspect-square relative overflow-hidden bg-desa-bg">
                              <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleFavorite(p.id);
                                }}
                                className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 text-desa-primary"
                              >
                                <Heart className={`w-3.5 h-3.5 ${savedFavorites.includes(p.id) ? 'fill-rose-500 text-rose-500' : ''}`} />
                              </button>
                            </div>
                            <div className="p-2.5">
                              <span className="text-[10px] text-desa-accent block truncate">{p.shopName}</span>
                              <h4 className="font-medium text-xs text-desa-primary line-clamp-2 leading-snug mt-0.5">
                                {p.name}
                              </h4>
                              <div className="font-heading font-bold text-xs text-desa-primary mt-1.5">
                                Rp {p.price.toLocaleString('id-ID')}
                              </div>
                            </div>
                          </div>
                          
                          <div className="p-2.5 pt-0">
                            <motion.button
                              whileTap={{ scale: 0.92 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                orderViaWhatsApp(p, 1);
                              }}
                              className="w-full py-1.5 px-2 rounded-lg bg-desa-highlight text-white text-[10px] font-bold flex items-center justify-center gap-1 shadow-sm"
                            >
                              <MessageCircle className="w-3 h-3" />
                              <span>Pesan WA</span>
                            </motion.button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              
              {currentTab === 'katalog' && (
                <div className="space-y-3">
                  <h3 className="font-heading font-bold text-base text-desa-primary">
                    Katalog Lengkap Desa
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {products.map((p) => (
                      <motion.div
                        key={p.id}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setMobileSelectedProduct(p)}
                        className="bg-white rounded-2xl p-2.5 border border-desa-primary/15 space-y-2 shadow-sm"
                      >
                        <div className="aspect-square rounded-xl overflow-hidden bg-desa-bg">
                          <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <span className="text-[10px] text-desa-accent font-semibold block">{p.kecamatan}</span>
                          <h4 className="font-medium text-xs text-desa-primary line-clamp-1">{p.name}</h4>
                          <span className="font-heading font-bold text-xs text-desa-primary block mt-1">
                            Rp {p.price.toLocaleString('id-ID')}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              
              {currentTab === 'pesanan' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-heading font-bold text-base text-desa-primary">
                      Pesanan Saya
                    </h3>
                    <span className="text-xs text-desa-text/60">{orders.length} Transaksi</span>
                  </div>

                  
                  <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
                    {['semua', 'diproses', 'dikirim', 'selesai'].map((st) => (
                      <button
                        key={st}
                        onClick={() => setOrderStatusFilter(st)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold capitalize shrink-0 transition-all ${
                          orderStatusFilter === st
                            ? 'bg-desa-primary text-desa-light shadow-sm'
                            : 'bg-white border border-desa-primary/20 text-desa-text/70'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>

                  
                  <div className="space-y-3">
                    {orders
                      .filter(o => orderStatusFilter === 'semua' || o.status === orderStatusFilter)
                      .map((ord) => (
                        <motion.div 
                          key={ord.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-white rounded-2xl p-4 border border-desa-primary/15 space-y-2.5 shadow-sm"
                        >
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-mono font-bold text-desa-primary">#{ord.id}</span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                              ord.status === 'selesai' ? 'bg-emerald-100 text-emerald-800' :
                              ord.status === 'dikirim' ? 'bg-blue-100 text-blue-800' :
                              'bg-amber-100 text-amber-800'
                            }`}>
                              {ord.status}
                            </span>
                          </div>

                          <div className="text-xs">
                            <h4 className="font-semibold text-desa-primary">{ord.productName}</h4>
                            <p className="text-desa-text/60 text-[11px] mt-0.5">{ord.shopName} • {ord.qty} pcs</p>
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-desa-primary/10 text-xs">
                            <span className="text-desa-text/60">Total Pesanan:</span>
                            <span className="font-heading font-bold text-desa-primary">
                              Rp {ord.total.toLocaleString('id-ID')}
                            </span>
                          </div>
                        </motion.div>
                    ))}
                  </div>
                </div>
              )}

              
              {currentTab === 'akun' && (
                <div className="space-y-4">
                  <div className="bg-white rounded-2xl p-4 border border-desa-primary/15 flex items-center gap-3 shadow-sm">
                    <div className="w-12 h-12 rounded-xl bg-desa-primary text-white flex items-center justify-center font-bold text-lg">
                      {currentUser?.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-heading font-bold text-sm text-desa-primary">{currentUser?.name}</h4>
                      <p className="text-xs text-desa-text/60">{currentUser?.phone}</p>
                      <span className="text-[10px] bg-desa-highlight/15 text-desa-highlight font-semibold px-2 py-0.2 rounded-full">
                        Warga Terverifikasi
                      </span>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl border border-desa-primary/15 divide-y divide-desa-primary/10 text-xs font-medium shadow-sm">
                    <button 
                      onClick={() => alert('Fitur Ganti Sandi: Tautan telah dikirim ke nomor WhatsApp Anda.')}
                      className="w-full p-3.5 flex items-center justify-between hover:bg-black/5"
                    >
                      <span>Ganti Kata Sandi</span>
                      <ChevronRight className="w-4 h-4 text-desa-text/40" />
                    </button>
                    <button 
                      onClick={() => alert('Aplikasi PWA Pasar Desa telah terinstal di peramban ini (Versi v1.2.0-Lurik).')}
                      className="w-full p-3.5 flex items-center justify-between hover:bg-black/5"
                    >
                      <span>Status PWA & Versi Aplikasi</span>
                      <span className="text-desa-highlight font-bold">Terpasang (v1.2.0)</span>
                    </button>
                    <button 
                      onClick={() => {
                        setMobileRole('penjual');
                        setCurrentTab('dashboard');
                      }}
                      className="w-full p-3.5 flex items-center justify-between text-desa-accent hover:bg-black/5"
                    >
                      <span>Buka Dashboard Toko Penjual</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => {
                        setCurrentView('web');
                      }}
                      className="w-full p-3.5 flex items-center justify-between text-desa-primary hover:bg-black/5"
                    >
                      <span>Beralih ke Tampilan Website Desktop</span>
                      <ExternalLink className="w-4 h-4 text-desa-text/40" />
                    </button>
                  </div>
                </div>
              )}

            </div>
          )}

          
          {mobileRole === 'penjual' && (
            <div className="p-4 space-y-4">
              
              
              {currentTab === 'dashboard' && (
                <>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-heading font-bold text-base text-desa-primary">
                        {currentUser?.shopName || 'Griya Tenun Lurik Lestari'}
                      </h3>
                      <p className="text-[11px] text-desa-text/60">Kelola operasional UMKM Sumedang</p>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-desa-highlight text-white">
                      Toko Aktif
                    </span>
                  </div>

                  
                  <div className="grid grid-cols-3 gap-2">
                    <motion.div whileHover={{ y: -2 }} className="bg-white p-3 rounded-2xl border border-desa-primary/15 text-center shadow-xs">
                      <span className="text-[10px] text-desa-text/60 block">Pesanan Baru</span>
                      <span className="font-heading font-bold text-lg text-desa-accent">
                        {sellerOrders.filter(o => o.status === 'diproses').length}
                      </span>
                    </motion.div>

                    <motion.div whileHover={{ y: -2 }} className="bg-white p-3 rounded-2xl border border-desa-primary/15 text-center shadow-xs">
                      <span className="text-[10px] text-desa-text/60 block">Produk Aktif</span>
                      <span className="font-heading font-bold text-lg text-desa-primary">
                        {sellerProducts.length}
                      </span>
                    </motion.div>

                    <motion.div whileHover={{ y: -2 }} className="bg-white p-3 rounded-2xl border border-desa-primary/15 text-center shadow-xs">
                      <span className="text-[10px] text-desa-text/60 block">Omset Minggu Ini</span>
                      <span className="font-heading font-bold text-xs text-desa-highlight mt-1 block">
                        Rp 2.450.000
                      </span>
                    </motion.div>
                  </div>

                  
                  <div className="p-4 bg-desa-primary text-desa-light rounded-2xl flex items-center justify-between shadow-md relative overflow-hidden">
                    <div className="absolute inset-0 bg-lurik-stripes-light opacity-15" />
                    <div className="relative z-10">
                      <h4 className="font-heading font-bold text-sm text-desa-light">Punya Produk Baru?</h4>
                      <p className="text-[11px] text-desa-light/75">Pasang foto dan jual ke warga desa</p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowAddProductModal(true)}
                      className="px-3 py-1.5 rounded-xl bg-desa-highlight text-white text-xs font-bold relative z-10 shadow-sm"
                    >
                      + Tambah
                    </motion.button>
                  </div>

                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-desa-primary">Pesanan Masuk Terbaru</span>
                      <button onClick={() => setCurrentTab('pesanan')} className="text-desa-accent font-semibold">
                        Lihat Semua
                      </button>
                    </div>

                    {sellerOrders.slice(0, 2).map((ord) => (
                      <div key={ord.id} className="bg-white p-3 rounded-xl border border-desa-primary/15 space-y-1.5 shadow-xs">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-desa-primary">{ord.buyerName}</span>
                          <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full capitalize">
                            {ord.status}
                          </span>
                        </div>
                        <p className="text-xs text-desa-text/70">{ord.productName} ({ord.qty} pcs)</p>
                      </div>
                    ))}
                  </div>
                </>
              )}

              
              {currentTab === 'produk' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-heading font-bold text-base text-desa-primary">
                      Kelola Produk Toko ({sellerProducts.length})
                    </h3>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowAddProductModal(true)}
                      className="px-3 py-1.5 rounded-xl bg-desa-highlight text-white text-xs font-bold flex items-center gap-1 shadow"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Tambah</span>
                    </motion.button>
                  </div>

                  <div className="space-y-2.5">
                    {sellerProducts.map((p) => (
                      <div key={p.id} className="bg-white p-3 rounded-2xl border border-desa-primary/15 flex items-center justify-between gap-3 shadow-xs">
                        <div className="flex items-center gap-3">
                          <img src={p.images[0]} alt={p.name} className="w-14 h-14 rounded-xl object-cover shrink-0 bg-desa-bg" />
                          <div className="text-xs">
                            <h4 className="font-bold text-desa-primary line-clamp-1">{p.name}</h4>
                            <span className="text-desa-accent font-semibold">Rp {p.price.toLocaleString('id-ID')}</span>
                            <span className="text-desa-text/50 block text-[10px]">Stok: {p.stock} pcs</span>
                          </div>
                        </div>

                        
                        <div className="flex flex-col items-end gap-1.5">
                          <button
                            onClick={() => toggleProductStatus(p.id)}
                            className="text-xs font-semibold"
                            title="Aktifkan / Sembunyikan Produk"
                          >
                            {p.isHidden ? (
                              <ToggleLeft className="w-6 h-6 text-gray-400" />
                            ) : (
                              <ToggleRight className="w-6 h-6 text-desa-highlight" />
                            )}
                          </button>
                          <span className="text-[10px] text-desa-text/60">
                            {p.isHidden ? 'Nonaktif' : 'Aktif'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              
              {currentTab === 'pesanan' && (
                <div className="space-y-3">
                  <h3 className="font-heading font-bold text-base text-desa-primary">
                    Daftar Pesanan Masuk
                  </h3>

                  {sellerOrders.map((ord) => (
                    <div key={ord.id} className="bg-white p-4 rounded-2xl border border-desa-primary/15 space-y-3 shadow-xs">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-mono font-bold text-desa-primary">#{ord.id}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                          ord.status === 'selesai' ? 'bg-emerald-100 text-emerald-800' :
                          ord.status === 'dikirim' ? 'bg-blue-100 text-blue-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {ord.status}
                        </span>
                      </div>

                      <div className="text-xs">
                        <h4 className="font-bold text-desa-primary">{ord.buyerName}</h4>
                        <p className="text-desa-text/60 text-[11px]">{ord.address} • {ord.phone}</p>
                        <p className="text-desa-primary font-medium mt-1">{ord.productName} ({ord.qty}x)</p>
                      </div>

                      <div className="pt-2 border-t border-desa-primary/10 flex items-center gap-2">
                        {ord.status === 'diproses' && (
                          <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => updateOrderStatus(ord.id, 'dikirim')}
                            className="flex-1 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold shadow-xs"
                          >
                            Tandai Dikirim
                          </motion.button>
                        )}
                        {ord.status === 'dikirim' && (
                          <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => updateOrderStatus(ord.id, 'selesai')}
                            className="flex-1 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold shadow-xs"
                          >
                            Tandai Selesai
                          </motion.button>
                        )}
                        <a
                          href={`https://wa.me/${ord.phone.replace(/^0/, '62')}?text=${encodeURIComponent(`Halo ${ord.buyerName}, pesanan #${ord.id} Anda sedang kami proses.`)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 rounded-lg bg-desa-highlight text-white text-xs font-semibold flex items-center gap-1 shadow-xs"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>Hubungi</span>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              
              {currentTab === 'toko' && (
                <div className="space-y-4">
                  <div className="bg-white rounded-2xl p-4 border border-desa-primary/15 text-xs space-y-3 shadow-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-desa-accent text-white flex items-center justify-center font-bold text-lg">
                        <Store className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-heading font-bold text-sm text-desa-primary">
                          {currentUser?.shopName || 'Griya Tenun Lurik Lestari'}
                        </h4>
                        <p className="text-desa-text/60">{currentUser?.kecamatan}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl border border-desa-primary/15 divide-y divide-desa-primary/10 text-xs font-medium shadow-xs">
                    <button 
                      onClick={() => alert('Kelola Data Toko: Anda dapat mengubah jam buka, alamat toko di Sumedang, dan rekening pencairan.')}
                      className="w-full p-3.5 flex items-center justify-between hover:bg-black/5"
                    >
                      <span>Kelola Data Toko</span>
                      <ChevronRight className="w-4 h-4 text-desa-text/40" />
                    </button>
                    <button 
                      onClick={() => {
                        setMobileRole('pembeli');
                        setCurrentTab('beranda');
                      }}
                      className="w-full p-3.5 flex items-center justify-between text-desa-accent hover:bg-black/5"
                    >
                      <span>Ganti ke Mode Pembeli</span>
                      <Repeat className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

            </div>
          )}

        </div>

        
        {mobileRole === 'pembeli' && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setMobileRole('penjual');
              setCurrentTab('dashboard');
              triggerNotification('Beralih Mode', 'Sekarang Anda mengelola Toko Penjual.');
            }}
            className="absolute bottom-20 right-4 px-4 py-2.5 rounded-full bg-desa-accent text-white shadow-2xl text-xs font-bold flex items-center gap-1.5 z-20 border border-white/30"
          >
            <Repeat className="w-3.5 h-3.5" />
            <span>Mode Jual</span>
          </motion.button>
        )}

        {mobileRole === 'penjual' && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowAddProductModal(true)}
            className="absolute bottom-20 right-4 w-12 h-12 rounded-full bg-desa-highlight text-white shadow-2xl flex items-center justify-center z-20 border border-white/40"
            title="Tambah Produk Baru"
          >
            <Plus className="w-6 h-6" />
          </motion.button>
        )}

        
        <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-desa-primary/15 py-2 px-3 flex items-center justify-around z-30 select-none">
          {mobileRole === 'pembeli' ? (
            <>
              <button
                onClick={() => setCurrentTab('beranda')}
                className={`relative flex flex-col items-center gap-1 text-[10px] font-semibold transition-colors ${
                  currentTab === 'beranda' ? 'text-desa-accent' : 'text-desa-text/50'
                }`}
              >
                <Home className="w-5 h-5" />
                <span>Beranda</span>
                {currentTab === 'beranda' && (
                  <motion.div layoutId="mobileNavIndicator" className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-desa-accent" />
                )}
              </button>

              <button
                onClick={() => setCurrentTab('katalog')}
                className={`relative flex flex-col items-center gap-1 text-[10px] font-semibold transition-colors ${
                  currentTab === 'katalog' ? 'text-desa-accent' : 'text-desa-text/50'
                }`}
              >
                <ShoppingBag className="w-5 h-5" />
                <span>Katalog</span>
                {currentTab === 'katalog' && (
                  <motion.div layoutId="mobileNavIndicator" className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-desa-accent" />
                )}
              </button>

              <button
                onClick={() => setCurrentTab('pesanan')}
                className={`relative flex flex-col items-center gap-1 text-[10px] font-semibold transition-colors ${
                  currentTab === 'pesanan' ? 'text-desa-accent' : 'text-desa-text/50'
                }`}
              >
                <Package className="w-5 h-5" />
                <span>Pesanan</span>
                {currentTab === 'pesanan' && (
                  <motion.div layoutId="mobileNavIndicator" className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-desa-accent" />
                )}
              </button>

              <button
                onClick={() => setCurrentTab('akun')}
                className={`relative flex flex-col items-center gap-1 text-[10px] font-semibold transition-colors ${
                  currentTab === 'akun' ? 'text-desa-accent' : 'text-desa-text/50'
                }`}
              >
                <User className="w-5 h-5" />
                <span>Akun</span>
                {currentTab === 'akun' && (
                  <motion.div layoutId="mobileNavIndicator" className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-desa-accent" />
                )}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setCurrentTab('dashboard')}
                className={`relative flex flex-col items-center gap-1 text-[10px] font-semibold transition-colors ${
                  currentTab === 'dashboard' ? 'text-desa-accent' : 'text-desa-text/50'
                }`}
              >
                <TrendingUp className="w-5 h-5" />
                <span>Dashboard</span>
                {currentTab === 'dashboard' && (
                  <motion.div layoutId="mobileNavIndicator" className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-desa-accent" />
                )}
              </button>

              <button
                onClick={() => setCurrentTab('produk')}
                className={`relative flex flex-col items-center gap-1 text-[10px] font-semibold transition-colors ${
                  currentTab === 'produk' ? 'text-desa-accent' : 'text-desa-text/50'
                }`}
              >
                <Package className="w-5 h-5" />
                <span>Produk</span>
                {currentTab === 'produk' && (
                  <motion.div layoutId="mobileNavIndicator" className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-desa-accent" />
                )}
              </button>

              <button
                onClick={() => setCurrentTab('pesanan')}
                className={`relative flex flex-col items-center gap-1 text-[10px] font-semibold transition-colors ${
                  currentTab === 'pesanan' ? 'text-desa-accent' : 'text-desa-text/50'
                }`}
              >
                <ShoppingBag className="w-5 h-5" />
                <span>Pesanan</span>
                {currentTab === 'pesanan' && (
                  <motion.div layoutId="mobileNavIndicator" className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-desa-accent" />
                )}
              </button>

              <button
                onClick={() => setCurrentTab('toko')}
                className={`relative flex flex-col items-center gap-1 text-[10px] font-semibold transition-colors ${
                  currentTab === 'toko' ? 'text-desa-accent' : 'text-desa-text/50'
                }`}
              >
                <Store className="w-5 h-5" />
                <span>Toko Saya</span>
                {currentTab === 'toko' && (
                  <motion.div layoutId="mobileNavIndicator" className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-desa-accent" />
                )}
              </button>
            </>
          )}
        </div>

        
        <AnimatePresence>
          {mobileSelectedProduct && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-40 bg-black/60 backdrop-blur-sm flex flex-col justify-end"
            >
              <motion.div 
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 28, stiffness: 350 }}
                className="bg-white rounded-t-3xl max-h-[85%] overflow-y-auto p-5 space-y-4 shadow-2xl"
              >
                <div className="flex items-center justify-between pb-2 border-b border-desa-primary/10">
                  <span className="text-xs font-bold text-desa-accent">{mobileSelectedProduct.categoryName}</span>
                  <button
                    onClick={() => setMobileSelectedProduct(null)}
                    className="p-1 rounded-full bg-desa-bg text-desa-primary"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="aspect-video rounded-2xl overflow-hidden bg-desa-bg">
                  <img src={mobileSelectedProduct.images[0]} alt={mobileSelectedProduct.name} className="w-full h-full object-cover" />
                </div>

                <div>
                  <h3 className="font-heading font-bold text-base text-desa-primary">
                    {mobileSelectedProduct.name}
                  </h3>
                  <span className="font-heading font-bold text-lg text-desa-accent block mt-1">
                    Rp {mobileSelectedProduct.price.toLocaleString('id-ID')}
                  </span>
                  <p className="text-xs text-desa-text/75 mt-2 leading-relaxed">
                    {mobileSelectedProduct.description}
                  </p>
                </div>

                <div className="pt-2">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      orderViaWhatsApp(mobileSelectedProduct, 1);
                      setMobileSelectedProduct(null);
                    }}
                    className="w-full py-3.5 px-4 rounded-xl bg-desa-highlight text-white font-bold text-sm shadow-md flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span>Pesan Langsung via WhatsApp</span>
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        
        <AnimatePresence>
          {showAddProductModal && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-40 bg-black/60 backdrop-blur-sm flex flex-col justify-end"
            >
              <motion.form 
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 28, stiffness: 350 }}
                onSubmit={handleAddProductSubmit} 
                className="bg-white rounded-t-3xl max-h-[90%] overflow-y-auto p-5 space-y-3.5 shadow-2xl"
              >
                <div className="flex items-center justify-between pb-2 border-b border-desa-primary/10">
                  <h3 className="font-heading font-bold text-sm text-desa-primary">Tambah Produk Toko Baru</h3>
                  <button
                    type="button"
                    onClick={() => setShowAddProductModal(false)}
                    className="p-1 rounded-full bg-desa-bg text-desa-primary"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-desa-primary mb-1">Nama Produk</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Keripik Singkong Sumedang"
                    value={newProdName}
                    onChange={(e) => setNewProdName(e.target.value)}
                    className="w-full p-2 bg-desa-bg/50 border border-desa-primary/20 rounded-xl text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-desa-primary mb-1">Harga (Rp)</label>
                    <input
                      type="number"
                      required
                      placeholder="25000"
                      value={newProdPrice}
                      onChange={(e) => setNewProdPrice(e.target.value)}
                      className="w-full p-2 bg-desa-bg/50 border border-desa-primary/20 rounded-xl text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-desa-primary mb-1">Stok Unit</label>
                    <input
                      type="number"
                      required
                      value={newProdStock}
                      onChange={(e) => setNewProdStock(e.target.value)}
                      className="w-full p-2 bg-desa-bg/50 border border-desa-primary/20 rounded-xl text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-desa-primary mb-1">Kategori</label>
                  <select
                    value={newProdCategory}
                    onChange={(e) => setNewProdCategory(e.target.value)}
                    className="w-full p-2 bg-desa-bg/50 border border-desa-primary/20 rounded-xl text-xs"
                  >
                    <option value="kuliner">Kuliner Tradisional</option>
                    <option value="kerajinan">Kerajinan Tangan</option>
                    <option value="pertanian">Hasil Tani & Kebun</option>
                    <option value="kesehatan">Herbal & Jamu</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-desa-primary mb-1">Deskripsi Singkat</label>
                  <textarea
                    rows="2"
                    placeholder="Ceritakan keistimewaan bahan dan proses pembuatan..."
                    value={newProdDesc}
                    onChange={(e) => setNewProdDesc(e.target.value)}
                    className="w-full p-2 bg-desa-bg/50 border border-desa-primary/20 rounded-xl text-xs"
                  />
                </div>

                <div className="pt-2">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="w-full py-3 rounded-xl bg-desa-primary text-desa-light font-bold text-xs shadow-md"
                  >
                    Publikasikan ke Pasar Desa
                  </motion.button>
                </div>
              </motion.form>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
