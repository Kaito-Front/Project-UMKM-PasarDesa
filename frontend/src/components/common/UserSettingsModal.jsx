import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { KECAMATAN_LIST } from '../../data/mockData';
import { getDesaByKecamatan } from '../../data/sumedangWilayah';
import { 
  User, 
  Store, 
  ShieldCheck, 
  ShieldAlert,
  Camera, 
  Image as ImageIcon,
  KeyRound, 
  Mail, 
  CheckCircle2, 
  X, 
  Phone, 
  MapPin, 
  Save, 
  Loader2,
  RefreshCw,
  Sparkles,
  ArrowRight,
  Eye,
  EyeOff
} from 'lucide-react';

export default function UserSettingsModal() {
  const { 
    currentUser, 
    isSettingsOpen, 
    closeSettings, 
    updateUserProfile, 
    updateShopProfile, 
    sendEmailOtp, 
    verifyEmailOtp, 
    changePasswordWithOtp,
    shops
  } = useApp();

  const [activeTab, setActiveTab] = useState('profil'); // 'profil' | 'toko' | 'keamanan'
  const isSeller = currentUser?.role === 'jualan' || currentUser?.role === 'keduanya' || !!currentUser?.shopId;
  const userShop = shops.find(s => s.id === currentUser?.shopId) || null;

  // Form states - Profil
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [kecamatan, setKecamatan] = useState('Kecamatan Sumedang Utara');
  const [desa, setDesa] = useState('Kotakaler');
  const [avatar, setAvatar] = useState('');
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Form states - Toko UMKM
  const [shopName, setShopName] = useState('');
  const [shopBanner, setShopBanner] = useState('');
  const [shopDesc, setShopDesc] = useState('');
  const [shopCategory, setShopCategory] = useState('Kerajinan Tangan');
  const [isSavingShop, setIsSavingShop] = useState(false);

  // Form states - Keamanan & OTP
  const [isSendingVerifyOtp, setIsSendingVerifyOtp] = useState(false);
  const [verifyOtpCode, setVerifyOtpCode] = useState(['', '', '', '', '', '']);
  const [isVerifyingEmail, setIsVerifyingEmail] = useState(false);
  
  // Password change with OTP
  const [isSendingPasswordOtp, setIsSendingPasswordOtp] = useState(false);
  const [passwordOtpCode, setPasswordOtpCode] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  // OTP Input refs
  const verifyInputRefs = useRef([]);
  const passInputRefs = useRef([]);

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || '');
      setPhone(currentUser.phone || '');
      const userKec = currentUser.kecamatan || 'Kecamatan Sumedang Utara';
      setKecamatan(userKec);
      setDesa(currentUser.desa || (getDesaByKecamatan(userKec)[0]?.name || 'Kotakaler'));
      setAvatar(currentUser.avatar || userShop?.avatar || '');
    }
    if (userShop) {
      setShopName(userShop.name || currentUser?.shopName || '');
      setShopBanner(userShop.banner || '');
      setShopDesc(userShop.description || '');
      setShopCategory(userShop.category || 'Kerajinan Tangan');
    }
  }, [currentUser, userShop, isSettingsOpen]);

  if (!isSettingsOpen || !currentUser) return null;

  // Helper for 6-digit OTP input change & auto-advance
  const handleOtpDigitChange = (index, value, stateArray, setStateArray, refsArray) => {
    if (!/^\d*$/.test(value)) return;
    const newArr = [...stateArray];
    newArr[index] = value.slice(-1);
    setStateArray(newArr);

    // Auto-advance to next input
    if (value && index < 5 && refsArray.current[index + 1]) {
      refsArray.current[index + 1].focus();
    }
  };

  const handleOtpKeyDown = (index, e, stateArray, refsArray) => {
    if (e.key === 'Backspace' && !stateArray[index] && index > 0 && refsArray.current[index - 1]) {
      refsArray.current[index - 1].focus();
    }
  };

  const handleOtpPaste = (e, setStateArray, refsArray) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasteData) return;
    const newArr = pasteData.split('').concat(Array(6).fill('')).slice(0, 6);
    setStateArray(newArr);
    const lastFilled = Math.min(pasteData.length, 5);
    if (refsArray.current[lastFilled]) {
      refsArray.current[lastFilled].focus();
    }
  };

  // Submit handlers
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsSavingProfile(true);
    try {
      await updateUserProfile({
        name,
        phone,
        kecamatan,
        desa,
        avatar
      });
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleSaveShop = async (e) => {
    e.preventDefault();
    setIsSavingShop(true);
    try {
      await updateShopProfile({
        name: shopName,
        banner: shopBanner,
        avatar: avatar,
        description: shopDesc,
        category: shopCategory
      });
    } finally {
      setIsSavingShop(false);
    }
  };

  const handleRequestVerifyOtp = async () => {
    setIsSendingVerifyOtp(true);
    try {
      await sendEmailOtp('email_verification');
    } finally {
      setIsSendingVerifyOtp(false);
    }
  };

  const handleConfirmVerifyEmail = async () => {
    const code = verifyOtpCode.join('');
    if (code.length !== 6) return;
    setIsVerifyingEmail(true);
    try {
      await verifyEmailOtp(code);
      setVerifyOtpCode(['', '', '', '', '', '']);
    } finally {
      setIsVerifyingEmail(false);
    }
  };

  const handleRequestPasswordOtp = async () => {
    setIsSendingPasswordOtp(true);
    setPasswordError('');
    try {
      await sendEmailOtp('password_change');
    } finally {
      setIsSendingPasswordOtp(false);
    }
  };

  const handleChangePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');
    const code = passwordOtpCode.join('');
    if (code.length !== 6) {
      setPasswordError('Mohon masukkan 6 digit kode OTP verifikasi email.');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError('Kata sandi baru minimal 6 karakter.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Konfirmasi kata sandi baru tidak cocok.');
      return;
    }

    setIsChangingPassword(true);
    try {
      await changePasswordWithOtp({ code, newPassword });
      setPasswordOtpCode(['', '', '', '', '', '']);
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPasswordError(err.message || 'Gagal mengubah kata sandi.');
    } finally {
      setIsChangingPassword(false);
    }
  };

  // Avatar presets for quick picking
  const avatarPresets = [
    '/products/madu-hutan.jpg',
    '/products/besek-bambu.jpg',
    '/products/kripik-tempe.jpg',
    '/products/kopi-robusta.jpg',
    '/products/gula-aren.jpg'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto bg-black/45 backdrop-blur-md">
      
      {/* Liquid Glass Modal Card with Spring Reveal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ type: 'spring', damping: 28, stiffness: 350 }}
        className="w-full max-w-2xl bg-[#FBF8F3]/95 backdrop-blur-2xl rounded-3xl border border-white/95 shadow-[0_24px_60px_rgba(22,51,36,0.18),inset_0_1px_2px_rgba(255,255,255,0.9)] overflow-hidden my-auto relative"
      >
        {/* Subtle Ambient Liquid Light Glow */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-3/4 h-28 bg-gradient-to-b from-white/35 via-desa-accent/10 to-transparent blur-2xl pointer-events-none" />

        {/* Modal Header */}
        <div className="px-5 sm:px-7 pt-5 sm:pt-6 pb-4 border-b border-[#E8E0D5]/70 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-desa-primary text-white flex items-center justify-center shadow-xs">
              <User className="w-5 h-5 text-desa-accent" />
            </div>
            <div>
              <h3 className="font-heading font-black text-lg sm:text-xl text-desa-primary tracking-tight">
                Pengaturan Akun & Profil
              </h3>
              <p className="text-xs text-desa-muted">
                Kelola identitas, foto profil toko, verifikasi email & keamanan sandi
              </p>
            </div>
          </div>

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={closeSettings}
            className="p-2 rounded-full text-desa-muted hover:text-desa-primary hover:bg-black/5 transition-colors cursor-pointer"
            aria-label="Tutup Pengaturan"
          >
            <X className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Liquid Sliding Pill Navigation Tabs */}
        <div className="px-5 sm:px-7 pt-4 pb-2 relative z-10">
          <div className="flex items-center p-1 bg-white/70 backdrop-blur-md rounded-full border border-white/80 shadow-2xs">
            <button
              onClick={() => setActiveTab('profil')}
              className={`relative flex-1 py-1.5 sm:py-2 text-xs font-bold rounded-full transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'profil' ? 'text-white' : 'text-desa-muted hover:text-desa-primary'
              }`}
            >
              {activeTab === 'profil' && (
                <motion.div 
                  layoutId="activeSettingsTabPill"
                  className="absolute inset-0 bg-desa-primary rounded-full shadow-xs"
                  transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                />
              )}
              <User className="w-3.5 h-3.5 relative z-10" />
              <span className="relative z-10">Profil Saya</span>
            </button>

            {isSeller && (
              <button
                onClick={() => setActiveTab('toko')}
                className={`relative flex-1 py-1.5 sm:py-2 text-xs font-bold rounded-full transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeTab === 'toko' ? 'text-white' : 'text-desa-muted hover:text-desa-primary'
                }`}
              >
                {activeTab === 'toko' && (
                  <motion.div 
                    layoutId="activeSettingsTabPill"
                    className="absolute inset-0 bg-desa-primary rounded-full shadow-xs"
                    transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                  />
                )}
                <Store className="w-3.5 h-3.5 relative z-10" />
                <span className="relative z-10">Toko & Banner</span>
              </button>
            )}

            <button
              onClick={() => setActiveTab('keamanan')}
              className={`relative flex-1 py-1.5 sm:py-2 text-xs font-bold rounded-full transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'keamanan' ? 'text-white' : 'text-desa-muted hover:text-desa-primary'
              }`}
            >
              {activeTab === 'keamanan' && (
                <motion.div 
                  layoutId="activeSettingsTabPill"
                  className="absolute inset-0 bg-desa-primary rounded-full shadow-xs"
                  transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                />
              )}
              <KeyRound className="w-3.5 h-3.5 relative z-10" />
              <span className="relative z-10">Keamanan & Email</span>
            </button>
          </div>
        </div>

        {/* Tab Body Content */}
        <div className="px-5 sm:px-7 py-4 max-h-[68vh] overflow-y-auto relative z-10 space-y-4">
          <AnimatePresence mode="wait">
            
            {/* =============================================================
                TAB 1: PROFIL PENGGUNA (AVATAR & INFO)
               ============================================================= */}
            {activeTab === 'profil' && (
              <motion.form
                key="tab-profil"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.22 }}
                onSubmit={handleSaveProfile}
                className="space-y-4"
              >
                {/* Avatar Uploader / Synchronizer */}
                <div className="p-4 rounded-2xl bg-white/70 backdrop-blur-md border border-white/80 shadow-2xs space-y-3">
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="relative group shrink-0">
                      <div className="w-20 h-20 rounded-2xl overflow-hidden bg-desa-surface border-2 border-desa-primary/30 flex items-center justify-center shadow-md">
                        {avatar ? (
                          <img src={avatar} alt="Foto Profil" className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-10 h-10 text-desa-muted" />
                        )}
                      </div>
                      <div className="absolute inset-0 rounded-2xl bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                        <Camera className="w-6 h-6 text-white" />
                      </div>
                    </div>

                    <div className="flex-1 space-y-1.5 text-center sm:text-left">
                      <div className="flex items-center justify-center sm:justify-start gap-2">
                        <span className="text-xs font-bold text-desa-primary">Foto Profil Pengguna</span>
                        {isSeller && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-desa-accent/15 text-desa-accent font-semibold">
                            Sinkron ke Avatar Toko
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-desa-muted leading-relaxed">
                        {isSeller 
                          ? 'Perubahan foto profil ini otomatis mengubah logo/avatar toko UMKM Anda di seluruh marketplace.'
                          : 'Pilih foto profil atau tautan gambar untuk representasi akun belanja warga Anda.'}
                      </p>
                      
                      {/* Avatar URL Input */}
                      <input
                        type="url"
                        placeholder="Tempel link URL foto profil (https://...)"
                        value={avatar}
                        onChange={(e) => setAvatar(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs bg-white border border-desa-border rounded-xl text-desa-text focus:outline-none focus:border-desa-primary shadow-2xs"
                      />
                    </div>
                  </div>

                  {/* Quick Preset Avatars */}
                  <div className="pt-2 border-t border-desa-border/50 flex items-center gap-2 overflow-x-auto pb-1">
                    <span className="text-[10px] font-semibold text-desa-subtle shrink-0">Pilihan Cepat:</span>
                    {avatarPresets.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setAvatar(preset)}
                        className={`w-7 h-7 rounded-lg overflow-hidden border shrink-0 transition-transform hover:scale-110 cursor-pointer ${
                          avatar === preset ? 'border-desa-accent ring-2 ring-desa-accent/40' : 'border-desa-border'
                        }`}
                        title="Pilih avatar produk lokal"
                      >
                        <img src={preset} alt="preset" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Form Fields: Name, Phone, Kecamatan */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-desa-primary mb-1">
                      Nama Lengkap / Username
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Masukkan nama lengkap Anda"
                      className="w-full px-3.5 py-2.5 bg-white/80 border border-desa-border rounded-xl text-xs sm:text-sm text-desa-text focus:outline-none focus:border-desa-primary shadow-2xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-desa-primary mb-1">
                      Nomor WhatsApp
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-desa-subtle absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="08xxxxxxxxxx"
                        className="w-full pl-9 pr-3.5 py-2.5 bg-white/80 border border-desa-border rounded-xl text-xs sm:text-sm text-desa-text focus:outline-none focus:border-desa-primary shadow-2xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-desa-primary mb-1">
                      Kecamatan Domisili (26 Kecamatan)
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-desa-subtle absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <select
                        value={kecamatan}
                        onChange={(e) => {
                          const newKec = e.target.value;
                          setKecamatan(newKec);
                          const desas = getDesaByKecamatan(newKec);
                          if (desas.length > 0) setDesa(desas[0].name);
                        }}
                        className="w-full pl-9 pr-3.5 py-2.5 bg-white/80 border border-desa-border rounded-xl text-xs sm:text-sm text-desa-text focus:outline-none focus:border-desa-primary shadow-2xs"
                      >
                        {KECAMATAN_LIST.filter(k => k !== 'Semua Kecamatan').map(k => (
                          <option key={k} value={k}>{k}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-desa-primary mb-1">
                      Desa / Kelurahan
                    </label>
                    <div className="relative">
                      <Building2 className="w-4 h-4 text-desa-subtle absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <select
                        value={desa}
                        onChange={(e) => setDesa(e.target.value)}
                        className="w-full pl-9 pr-3.5 py-2.5 bg-white/80 border border-desa-border rounded-xl text-xs sm:text-sm text-desa-text focus:outline-none focus:border-desa-primary shadow-2xs"
                      >
                        {getDesaByKecamatan(kecamatan).map(d => (
                          <option key={d.name} value={d.name}>
                            {d.type === 'Kelurahan' ? 'Kel. ' : 'Desa '} {d.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isSavingProfile}
                    className="px-5 py-2.5 rounded-full bg-desa-primary hover:bg-desa-primary/90 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    {isSavingProfile ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                        <span>Menyimpan...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-3.5 h-3.5 text-desa-accent" />
                        <span>Simpan Perubahan Profil</span>
                      </>
                    )}
                  </motion.button>
                </div>
              </motion.form>
            )}

            {/* =============================================================
                TAB 2: TOKO & BANNER UMKM (KHUSUS PENJUAL)
               ============================================================= */}
            {activeTab === 'toko' && isSeller && (
              <motion.form
                key="tab-toko"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.22 }}
                onSubmit={handleSaveShop}
                className="space-y-4"
              >
                {/* Shop Banner Preview & URL Edit */}
                <div className="p-4 rounded-2xl bg-white/70 backdrop-blur-md border border-white/80 shadow-2xs space-y-3">
                  <span className="text-xs font-bold text-desa-primary block">
                    Banner Header Toko UMKM
                  </span>
                  
                  <div className="h-28 sm:h-32 w-full rounded-xl overflow-hidden bg-desa-surface border border-desa-border relative group">
                    {shopBanner ? (
                      <img src={shopBanner} alt="Banner Toko" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-desa-muted gap-1 bg-gradient-to-r from-desa-primary/10 to-desa-accent/10">
                        <ImageIcon className="w-7 h-7 text-desa-muted" />
                        <span className="text-xs">Belum ada banner toko</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                      <span className="text-xs font-bold text-white bg-black/50 px-3 py-1 rounded-full backdrop-blur-sm">
                        Pratinjau Banner Toko
                      </span>
                    </div>
                  </div>

                  <input
                    type="url"
                    placeholder="Masukkan URL banner toko (https://...)"
                    value={shopBanner}
                    onChange={(e) => setShopBanner(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-desa-border rounded-xl text-desa-text focus:outline-none focus:border-desa-primary shadow-2xs"
                  />
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-desa-primary mb-1">
                      Nama Toko / Usaha Kerajinan
                    </label>
                    <input
                      type="text"
                      required
                      value={shopName}
                      onChange={(e) => setShopName(e.target.value)}
                      placeholder="Nama toko UMKM Anda"
                      className="w-full px-3.5 py-2.5 bg-white/80 border border-desa-border rounded-xl text-xs sm:text-sm text-desa-text focus:outline-none focus:border-desa-primary shadow-2xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-desa-primary mb-1">
                      Kategori Produk Utama
                    </label>
                    <select
                      value={shopCategory}
                      onChange={(e) => setShopCategory(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white/80 border border-desa-border rounded-xl text-xs sm:text-sm text-desa-text focus:outline-none focus:border-desa-primary shadow-2xs"
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
                      Deskripsi Profil Usaha Desa
                    </label>
                    <textarea
                      rows={3}
                      value={shopDesc}
                      onChange={(e) => setShopDesc(e.target.value)}
                      placeholder="Ceritakan keunggulan bahan baku, nilai tradisi lokal, atau cara pembuatan produk Anda..."
                      className="w-full px-3.5 py-2.5 bg-white/80 border border-desa-border rounded-xl text-xs sm:text-sm text-desa-text focus:outline-none focus:border-desa-primary shadow-2xs resize-none"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isSavingShop}
                    className="px-5 py-2.5 rounded-full bg-desa-primary hover:bg-desa-primary/90 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    {isSavingShop ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                        <span>Menyimpan Toko...</span>
                      </>
                    ) : (
                      <>
                        <Store className="w-3.5 h-3.5 text-desa-accent" />
                        <span>Simpan Profil & Banner Toko</span>
                      </>
                    )}
                  </motion.button>
                </div>
              </motion.form>
            )}

            {/* =============================================================
                TAB 3: KEAMANAN, VERIFIKASI GMAIL & UBAH SANDI (OTP 6 DIGIT)
               ============================================================= */}
            {activeTab === 'keamanan' && (
              <motion.div
                key="tab-keamanan"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.22 }}
                className="space-y-5"
              >
                {/* 1. Email Verification Section */}
                <div className="p-4 sm:p-5 rounded-2xl bg-white/70 backdrop-blur-md border border-white/80 shadow-2xs space-y-3.5">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-desa-accent" />
                        <span className="text-xs font-bold text-desa-primary">Status Verifikasi Email Gmail</span>
                      </div>
                      <p className="text-xs text-desa-text font-medium">{currentUser.email}</p>
                    </div>

                    {currentUser.isEmailVerified ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Terverifikasi BUMDes</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold">
                        <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                        <span>Belum Terverifikasi</span>
                      </span>
                    )}
                  </div>

                  {!currentUser.isEmailVerified && (
                    <div className="pt-2 border-t border-desa-border/50 space-y-3">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                        <p className="text-[11px] text-desa-muted">
                          Dapatkan kode 6-digit untuk mengaktifkan tanda verifikasi resmi pengrajin/warga.
                        </p>
                        <motion.button
                          whileTap={{ scale: 0.96 }}
                          type="button"
                          onClick={handleRequestVerifyOtp}
                          disabled={isSendingVerifyOtp}
                          className="px-3.5 py-1.5 rounded-full bg-desa-accent text-white font-bold text-xs shadow-xs hover:bg-desa-highlight transition-colors shrink-0 cursor-pointer disabled:opacity-50"
                        >
                          {isSendingVerifyOtp ? 'Mengirim Kode...' : 'Kirim Kode OTP'}
                        </motion.button>
                      </div>

                      {/* 6-Digit OTP Boxes */}
                      <div className="flex items-center gap-2 justify-center py-1">
                        {verifyOtpCode.map((digit, i) => (
                          <input
                            key={i}
                            ref={el => verifyInputRefs.current[i] = el}
                            type="text"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleOtpDigitChange(i, e.target.value, verifyOtpCode, setVerifyOtpCode, verifyInputRefs)}
                            onKeyDown={(e) => handleOtpKeyDown(i, e, verifyOtpCode, verifyInputRefs)}
                            onPaste={(e) => handleOtpPaste(e, setVerifyOtpCode, verifyInputRefs)}
                            className="w-9 h-11 sm:w-11 sm:h-12 text-center font-heading font-black text-base sm:text-lg bg-white border-2 border-desa-border focus:border-desa-accent rounded-xl text-desa-primary focus:outline-none shadow-2xs transition-all"
                          />
                        ))}
                      </div>

                      <div className="flex justify-end">
                        <motion.button
                          whileTap={{ scale: 0.97 }}
                          type="button"
                          onClick={handleConfirmVerifyEmail}
                          disabled={isVerifyingEmail || verifyOtpCode.join('').length !== 6}
                          className="px-4 py-2 rounded-full bg-desa-primary text-white text-xs font-bold shadow-xs hover:bg-desa-primary/90 transition-colors disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
                        >
                          {isVerifyingEmail ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ShieldCheck className="w-3.5 h-3.5 text-desa-accent" />}
                          <span>Konfirmasi Verifikasi Email</span>
                        </motion.button>
                      </div>
                    </div>
                  )}
                </div>

                {/* 2. Change Password with OTP Section */}
                <form onSubmit={handleChangePasswordSubmit} className="p-4 sm:p-5 rounded-2xl bg-white/70 backdrop-blur-md border border-white/80 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-heading font-bold text-sm text-desa-primary">
                        Ubah Kata Sandi Akun
                      </h4>
                      <p className="text-[11px] text-desa-muted">
                        Demi keamanan, perubahan sandi mewajibkan verifikasi kode 6-digit ke email Anda.
                      </p>
                    </div>

                    <motion.button
                      whileTap={{ scale: 0.96 }}
                      type="button"
                      onClick={handleRequestPasswordOtp}
                      disabled={isSendingPasswordOtp}
                      className="px-3 py-1 rounded-full border border-desa-accent text-desa-accent hover:bg-desa-accent hover:text-white transition-colors text-xs font-bold cursor-pointer shrink-0 disabled:opacity-50"
                    >
                      {isSendingPasswordOtp ? 'Mengirim...' : 'Minta Kode OTP'}
                    </motion.button>
                  </div>

                  {passwordError && (
                    <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800">
                      {passwordError}
                    </div>
                  )}

                  {/* 6-Digit OTP for password */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-desa-primary">
                      Masukkan 6 Digit Kode OTP dari Email
                    </label>
                    <div className="flex items-center gap-2 justify-center py-1">
                      {passwordOtpCode.map((digit, i) => (
                        <input
                          key={i}
                          ref={el => passInputRefs.current[i] = el}
                          type="text"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpDigitChange(i, e.target.value, passwordOtpCode, setPasswordOtpCode, passInputRefs)}
                          onKeyDown={(e) => handleOtpKeyDown(i, e, passwordOtpCode, passInputRefs)}
                          onPaste={(e) => handleOtpPaste(e, setPasswordOtpCode, passInputRefs)}
                          className="w-9 h-11 sm:w-11 sm:h-12 text-center font-heading font-black text-base sm:text-lg bg-white border-2 border-desa-border focus:border-desa-accent rounded-xl text-desa-primary focus:outline-none shadow-2xs transition-all"
                        />
                      ))}
                    </div>
                  </div>

                  {/* New Password & Confirm Password */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-desa-primary mb-1">
                        Kata Sandi Baru
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Minimal 6 karakter"
                          className="w-full pl-3 pr-9 py-2 bg-white border border-desa-border rounded-xl text-xs text-desa-text focus:outline-none focus:border-desa-primary shadow-2xs"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-desa-subtle hover:text-desa-primary"
                        >
                          {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-desa-primary mb-1">
                        Ulangi Sandi Baru
                      </label>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Konfirmasi sandi"
                        className="w-full px-3 py-2 bg-white border border-desa-border rounded-xl text-xs text-desa-text focus:outline-none focus:border-desa-primary shadow-2xs"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={isChangingPassword || passwordOtpCode.join('').length !== 6}
                      className="px-5 py-2.5 rounded-full bg-desa-primary hover:bg-desa-primary/90 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {isChangingPassword ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                          <span>Menyimpan Sandi...</span>
                        </>
                      ) : (
                        <>
                          <KeyRound className="w-3.5 h-3.5 text-desa-accent" />
                          <span>Simpan Kata Sandi Baru</span>
                        </>
                      )}
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

      </motion.div>
    </div>
  );
}