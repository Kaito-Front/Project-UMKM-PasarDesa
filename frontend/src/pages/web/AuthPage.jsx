import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { KECAMATAN_LIST } from '../../data/mockData';
import { getDesaByKecamatan } from '../../data/sumedangWilayah';
import { 
  Store, 
  User, 
  Lock, 
  Phone, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  Tag,
  MapPin,
  Eye,
  EyeOff,
  Smartphone,
  Loader2,
  Sparkles
} from 'lucide-react';

export default function AuthPage() {
  const { 
    login,
    register,
    setWebPage, 
    setCurrentView,
    triggerNotification,
    authMode
  } = useApp();

  const [activeTab, setActiveTab] = useState(
    authMode === 'daftar_umkm' || authMode === 'daftar' ? 'daftar' : 'masuk'
  );
  const [showPassword, setShowPassword] = useState(false);
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regRole, setRegRole] = useState(
    authMode === 'daftar_umkm' ? 'jualan' : 'belanja'
  );
  const [regShopName, setRegShopName] = useState('');
  const [regShopCategory, setRegShopCategory] = useState('Kerajinan Tangan');
  const [regKecamatan, setRegKecamatan] = useState('Kecamatan Sumedang Utara');
  const [regDesa, setRegDesa] = useState('Kotakaler');
  const [agreedTerms, setAgreedTerms] = useState(true);

  // Synchronize tab and role whenever authMode changes
  useEffect(() => {
    if (authMode === 'daftar_umkm') {
      setActiveTab('daftar');
      setRegRole('jualan');
      setFormError('');
    } else if (authMode === 'daftar') {
      setActiveTab('daftar');
      setRegRole('belanja');
      setFormError('');
    } else if (authMode === 'masuk') {
      setActiveTab('masuk');
      setFormError('');
    }
  }, [authMode]);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setIsSubmitting(true);
    try {
      const user = await login(loginIdentifier, loginPassword);
      triggerNotification('Berhasil Masuk', `Selamat datang kembali, ${user.name}!`);
      if (user.role === 'admin') {
        setCurrentView('admin');
      } else {
        setWebPage('home');
      }
    } catch (error) {
      setFormError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (regPassword !== regConfirmPassword) {
      setFormError('Konfirmasi kata sandi tidak cocok.');
      return;
    }
    if ((regRole === 'jualan' || regRole === 'keduanya') && !regShopName) {
      setFormError('Mohon isi nama usaha/toko Anda.');
      return;
    }
    setFormError('');
    setIsSubmitting(true);
    try {
      const user = await register({
        name: regName, phone: regPhone, password: regPassword, role: regRole,
        shopName: regShopName, 
        shopCategory: regShopCategory, 
        kecamatan: regKecamatan,
        desa: regDesa,
      });
      triggerNotification('Akun Berhasil Dibuat', `Selamat datang di Pasar Desa, ${user.name}!`);
      setWebPage('home');
    } catch (error) {
      setFormError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Main Auth Form Container */}
        <div className="lg:col-span-7 bg-white/85 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/90 shadow-[0_12px_40px_rgb(0,0,0,0.04)] relative overflow-hidden">
          
          {/* Header Identity */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-desa-primary text-white flex items-center justify-center shadow-xs">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <span className="font-heading text-xl font-bold tracking-tight text-desa-primary">
                <span className="font-script text-2xl text-desa-accent font-normal mr-0.5 inline-block align-baseline">P</span>asar <span className="font-script text-2xl text-desa-accent font-normal mr-0.5 inline-block align-baseline">D</span>esa
              </span>
              <p className="text-xs text-desa-muted">
                Ekosistem Digital UMKM Mandiri
              </p>
            </div>
          </div>

          {/* Interactive Sliding Tabs */}
          <div className="flex border-b border-desa-border mb-6 relative">
            <button
              type="button"
              onClick={() => { setActiveTab('masuk'); setFormError(''); }}
              className={`flex-1 py-2.5 text-center text-xs font-bold transition-colors relative cursor-pointer ${
                activeTab === 'masuk'
                  ? 'text-desa-primary'
                  : 'text-desa-muted hover:text-desa-primary'
              }`}
            >
              <span className="relative z-10">Masuk ke Akun</span>
              {activeTab === 'masuk' && (
                <motion.div 
                  layoutId="activeAuthTabIndicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-desa-accent rounded-full shadow-xs"
                  transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                />
              )}
            </button>

            <button
              type="button"
              onClick={() => { setActiveTab('daftar'); setFormError(''); }}
              className={`flex-1 py-2.5 text-center text-xs font-bold transition-colors relative cursor-pointer ${
                activeTab === 'daftar'
                  ? 'text-desa-primary'
                  : 'text-desa-muted hover:text-desa-primary'
              }`}
            >
              <span className="relative z-10">Daftar Akun Baru</span>
              {activeTab === 'daftar' && (
                <motion.div 
                  layoutId="activeAuthTabIndicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-desa-accent rounded-full shadow-xs"
                  transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                />
              )}
            </button>
          </div>

          {/* Animated Form Error Banner */}
          <AnimatePresence>
            {formError && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                role="alert" 
                className="mb-4 rounded-xl border border-red-200 bg-red-50/90 backdrop-blur-sm px-3.5 py-2.5 text-xs text-red-800 shadow-2xs flex items-center justify-between"
              >
                <span>{formError}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Dynamic Form Crossfade & Slide Container */}
          <AnimatePresence mode="wait">
            {activeTab === 'masuk' ? (
              <motion.form 
                key="form-masuk"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                onSubmit={handleLoginSubmit} 
                className="space-y-4"
              >
                <div>
                  <label className="block text-xs font-semibold text-desa-primary mb-1">
                    Nomor HP atau Email
                  </label>
                  <div className="relative group">
                    <User className="w-4 h-4 text-desa-subtle group-focus-within:text-desa-primary transition-colors absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      required
                      placeholder="Contoh: 081915194171 atau email@desa.id"
                      value={loginIdentifier}
                      onChange={(e) => setLoginIdentifier(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 bg-desa-bg/40 border border-desa-border rounded-xl text-sm text-desa-text focus:outline-none focus:border-desa-primary focus:bg-white transition-all shadow-2xs"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-desa-primary">
                      Kata Sandi
                    </label>
                    <span className="text-xs text-desa-subtle">
                      Demo: 123456
                    </span>
                  </div>
                  <div className="relative group">
                    <Lock className="w-4 h-4 text-desa-subtle group-focus-within:text-desa-primary transition-colors absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Masukkan kata sandi akun"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full pl-9 pr-10 py-2.5 bg-desa-bg/40 border border-desa-border rounded-xl text-sm text-desa-text focus:outline-none focus:border-desa-primary focus:bg-white transition-all shadow-2xs"
                    />
                    <motion.button
                      whileTap={{ scale: 0.88 }}
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-desa-subtle hover:text-desa-primary transition-colors p-1"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </motion.button>
                  </div>
                </div>

                <div className="pt-2">
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-2.5 sm:py-3 rounded-xl bg-desa-primary hover:bg-desa-primary/95 text-white font-semibold text-sm shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                        <span>Memproses Masuk...</span>
                      </>
                    ) : (
                      <>
                        <span>Masuk ke Pasar Desa</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </motion.button>
                </div>

                <div className="pt-3 border-t border-desa-border flex items-center justify-between text-xs text-desa-muted">
                  <span>Petugas pengelola BUMDes?</span>
                  <button
                    type="button"
                    onClick={() => setCurrentView('admin')}
                    className="font-semibold text-desa-accent hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Login Panel Admin →</span>
                  </button>
                </div>
              </motion.form>
            ) : (
              <motion.form 
                key="form-daftar"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                onSubmit={handleRegisterSubmit} 
                className="space-y-4"
              >
                <div>
                  <label className="block text-xs font-semibold text-desa-primary mb-1">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Nama sesuai KTP"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    className="w-full px-3 py-2 bg-desa-bg/40 border border-desa-border rounded-xl text-sm text-desa-text focus:outline-none focus:border-desa-primary focus:bg-white transition-all shadow-2xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-desa-primary mb-1">
                    Nomor WhatsApp Aktif
                  </label>
                  <div className="relative group">
                    <Phone className="w-4 h-4 text-desa-subtle group-focus-within:text-desa-primary transition-colors absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="tel"
                      required
                      placeholder="08xxxxxxxxxx"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-desa-bg/40 border border-desa-border rounded-xl text-sm text-desa-text focus:outline-none focus:border-desa-primary focus:bg-white transition-all shadow-2xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-desa-primary mb-1">
                      Kata Sandi
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="Minimal 6 karakter"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      className="w-full px-3 py-2 bg-desa-bg/40 border border-desa-border rounded-xl text-sm text-desa-text focus:outline-none focus:border-desa-primary focus:bg-white transition-all shadow-2xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-desa-primary mb-1">
                      Ulangi Kata Sandi
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="Konfirmasi sandi"
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      className="w-full px-3 py-2 bg-desa-bg/40 border border-desa-border rounded-xl text-sm text-desa-text focus:outline-none focus:border-desa-primary focus:bg-white transition-all shadow-2xs"
                    />
                  </div>
                </div>

                {/* Animated Role Toggle */}
                <div>
                  <label className="block text-xs font-semibold text-desa-primary mb-1.5">
                    Tujuan Pendaftaran Akun:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      type="button"
                      onClick={() => setRegRole('belanja')}
                      className={`p-2.5 rounded-xl border text-xs font-medium text-left transition-all cursor-pointer ${
                        regRole === 'belanja'
                          ? 'border-desa-primary bg-desa-primary text-white shadow-xs'
                          : 'border-desa-border bg-white text-desa-text hover:bg-desa-bg/80'
                      }`}
                    >
                      <span className="font-semibold block">Pembeli Warga</span>
                      <span className={`text-[10px] ${regRole === 'belanja' ? 'text-white/80' : 'text-desa-muted'}`}>
                        Belanja produk desa
                      </span>
                    </motion.button>

                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      type="button"
                      onClick={() => setRegRole('jualan')}
                      className={`p-2.5 rounded-xl border text-xs font-medium text-left transition-all cursor-pointer ${
                        regRole === 'jualan'
                          ? 'border-desa-accent bg-desa-accent text-white shadow-xs'
                          : 'border-desa-border bg-white text-desa-text hover:bg-desa-bg/80'
                      }`}
                    >
                      <span className="font-semibold block">Penjual / UMKM Desa</span>
                      <span className={`text-[10px] ${regRole === 'jualan' ? 'text-white/80' : 'text-desa-muted'}`}>
                        Buka lapak & jualan
                      </span>
                    </motion.button>
                  </div>
                </div>

                {/* Smooth Animated Reveal for Shop Details */}
                <AnimatePresence>
                  {regRole === 'jualan' && (
                    <motion.div
                      key="shop-details-container"
                      initial={{ opacity: 0, height: 0, scale: 0.98 }}
                      animate={{ opacity: 1, height: 'auto', scale: 1 }}
                      exit={{ opacity: 0, height: 0, scale: 0.98 }}
                      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="p-3.5 rounded-xl bg-desa-bg/70 border border-desa-border space-y-3 shadow-2xs">
                        <div>
                          <label className="block text-xs font-semibold text-desa-primary mb-1">
                            Nama Toko / Usaha Kerajinan
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="Contoh: Griya Lurik Berkah"
                            value={regShopName}
                            onChange={(e) => setRegShopName(e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-desa-border rounded-lg text-sm text-desa-text focus:outline-none focus:border-desa-primary shadow-2xs"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-semibold text-desa-primary mb-1">
                              Kategori Produk
                            </label>
                            <select
                              value={regShopCategory}
                              onChange={(e) => setRegShopCategory(e.target.value)}
                              className="w-full px-2.5 py-1.5 bg-white border border-desa-border rounded-lg text-sm text-desa-primary shadow-2xs"
                            >
                              <option value="Kerajinan Tangan">Kerajinan Tangan</option>
                              <option value="Kuliner Tradisional">Kuliner Tradisional</option>
                              <option value="Herbal & Jamu">Herbal & Jamu</option>
                              <option value="Hasil Tani & Kebun">Hasil Tani & Kebun</option>
                              <option value="Pakaian & Tenun">Pakaian & Tenun</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-desa-primary mb-1">
                              Wilayah Kecamatan
                            </label>
                            <select
                              value={regKecamatan}
                              onChange={(e) => {
                                const newKec = e.target.value;
                                setRegKecamatan(newKec);
                                const desas = getDesaByKecamatan(newKec);
                                if (desas.length > 0) setRegDesa(desas[0].name);
                              }}
                              className="w-full px-2.5 py-1.5 bg-white border border-desa-border rounded-lg text-sm text-desa-primary shadow-2xs"
                            >
                              {KECAMATAN_LIST.filter(k => k !== 'Semua Kecamatan').map(k => (
                                <option key={k} value={k}>{k}</option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-desa-primary mb-1">
                              Desa / Kelurahan
                            </label>
                            <select
                              value={regDesa}
                              onChange={(e) => setRegDesa(e.target.value)}
                              className="w-full px-2.5 py-1.5 bg-white border border-desa-border rounded-lg text-sm text-desa-primary shadow-2xs"
                            >
                              {getDesaByKecamatan(regKecamatan).map(d => (
                                <option key={d.name} value={d.name}>
                                  {d.type === 'Kelurahan' ? 'Kel. ' : 'Desa '} {d.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="pt-2">
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-2.5 sm:py-3 rounded-xl bg-desa-primary hover:bg-desa-primary/95 text-white font-semibold text-sm shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                        <span>Mendaftarkan Akun...</span>
                      </>
                    ) : (
                      <>
                        <span>Daftarkan Akun Sekarang</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </motion.button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

        </div>

        {/* Right Side Showcase & Verification Banner */}
        <div className="lg:col-span-5 space-y-4">
          <motion.div 
            initial={{ opacity: 0, x: 14 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="bg-[#163324] text-white rounded-3xl p-6 sm:p-7 shadow-sm space-y-4 border border-[#2E5E45] relative overflow-hidden"
          >
            {/* Ambient Accent Glow */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-desa-accent/15 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-desa-accent text-white inline-flex items-center gap-1.5 shadow-2xs">
                <Sparkles className="w-3 h-3 text-white" />
                <span>Keunggulan Ekosistem</span>
              </span>
            </div>

            <h3 className="font-heading text-xl font-bold leading-snug">
              Kemandirian Ekonomi Warga Berbasis Digital
            </h3>

            <p className="text-sm text-[#FBF8F3]/80 leading-relaxed">
              Pasar Desa memfasilitasi transaksi jujur langsung antara pengrajin dan pembeli dengan verifikasi resmi dari BUMDes.
            </p>

            <div className="space-y-2.5 pt-1 text-sm text-[#FBF8F3]/90">
              {[
                'Tanpa potongan komisi perantara luar',
                'Langsung terhubung dengan WhatsApp penjual',
                'Mendukung pengiriman antar kecamatan dan nasional'
              ].map((item, index) => (
                <motion.div 
                  key={item}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.08 }}
                  className="flex items-center gap-2.5"
                >
                  <CheckCircle2 className="w-4 h-4 text-desa-accent shrink-0" />
                  <span>{item}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 14 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="bg-white/85 backdrop-blur-xl rounded-2xl p-5 border border-white/90 text-xs space-y-1.5 shadow-[0_4px_20px_rgb(0,0,0,0.03)]"
          >
            <h4 className="font-heading font-bold text-desa-primary text-sm flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-desa-accent" />
              <span>Pendampingan Balai Desa</span>
            </h4>
            <p className="text-sm text-desa-muted leading-relaxed">
              Petugas BUMDes siap mendampingi pendaftaran izin usaha mikro dan verifikasi produk di kantor Balai Desa.
            </p>
          </motion.div>
        </div>

      </div>
    </motion.div>
  );
}
