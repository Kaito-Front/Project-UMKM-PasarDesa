import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import LurikDivider from '../../components/common/LurikDivider';
import { DUSUN_LIST } from '../../data/mockData';
import { 
  Store, 
  User, 
  Lock, 
  Phone, 
  Mail, 
  Smartphone, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  Building2,
  Tag,
  MapPin,
  Eye,
  EyeOff
} from 'lucide-react';

export default function AuthPage() {
  const { 
    setIsLoggedIn, 
    setCurrentUser, 
    setWebPage, 
    setCurrentView,
    triggerNotification 
  } = useApp();

  const [activeTab, setActiveTab] = useState('masuk'); // 'masuk' or 'daftar'
  const [showPassword, setShowPassword] = useState(false);

  // Form Masuk States
  const [loginIdentifier, setLoginIdentifier] = useState('081234567890');
  const [loginPassword, setLoginPassword] = useState('password123');

  // Form Daftar States
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regRole, setRegRole] = useState('belanja'); // 'belanja', 'jualan', 'keduanya'
  
  // Conditional seller fields
  const [regShopName, setRegShopName] = useState('');
  const [regShopCategory, setRegShopCategory] = useState('Kerajinan Tangan');
  const [regDusun, setRegDusun] = useState('Dusun Krajan (Pusat)');
  const [agreedTerms, setAgreedTerms] = useState(true);

  // Handle Login
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!loginIdentifier || !loginPassword) {
      alert('Mohon isi nomor HP / Email dan Kata Sandi.');
      return;
    }

    const dummyUser = {
      id: 'usr-' + Date.now(),
      name: loginIdentifier.includes('@') ? loginIdentifier.split('@')[0] : 'Ibu Sumarsih',
      phone: loginIdentifier,
      email: loginIdentifier.includes('@') ? loginIdentifier : 'user@pasardesa.id',
      role: 'keduanya',
      shopId: 'toko-1',
      shopName: 'Griya Tenun Lurik Lestari',
      dusun: 'Dusun Krajan (Pusat)'
    };

    setIsLoggedIn(true);
    setCurrentUser(dummyUser);
    triggerNotification('Berhasil Masuk', `Selamat datang kembali, ${dummyUser.name}!`);
    setWebPage('home');
  };

  // Handle Register
  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (!regName || !regPhone || !regPassword) {
      alert('Mohon lengkapi formulir pendaftaran.');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      alert('Konfirmasi kata sandi tidak cocok.');
      return;
    }
    if ((regRole === 'jualan' || regRole === 'keduanya') && !regShopName) {
      alert('Mohon isi nama usaha/toko Anda.');
      return;
    }

    const newUser = {
      id: 'usr-' + Date.now(),
      name: regName,
      phone: regPhone,
      email: `${regPhone}@pasardesa.id`,
      role: regRole,
      shopId: (regRole === 'jualan' || regRole === 'keduanya') ? `toko-${Date.now()}` : null,
      shopName: regShopName || null,
      dusun: regDusun
    };

    setIsLoggedIn(true);
    setCurrentUser(newUser);
    triggerNotification('Akun Berhasil Dibuat', `Selamat datang di Pasar Desa, ${regName}!`);
    setWebPage('home');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      
      {/* Decorative Traditional Lurik Line at Top */}
      <div className="mb-8">
        <LurikDivider variant="dark" height="2px" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Main Auth Form Container */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-10 border border-desa-primary/20 shadow-xl relative overflow-hidden">
          
          {/* Logo & Tagline Header */}
          <div className="flex items-center gap-3.5 mb-8">
            <div className="w-12 h-12 rounded-xl bg-desa-primary text-desa-light flex items-center justify-center shadow">
              <Store className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading text-2xl font-bold tracking-tight text-desa-primary">
                  Pasar Desa
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-desa-accent/15 text-desa-accent tracking-wider uppercase">
                  Lurik
                </span>
              </div>
              <p className="text-xs text-desa-text/70">
                Pusat Belanja & UMKM Warga Desa Mandiri
              </p>
            </div>
          </div>

          {/* Tab Switcher: Masuk / Daftar */}
          <div className="flex border-b border-desa-primary/15 mb-6">
            <button
              type="button"
              onClick={() => setActiveTab('masuk')}
              className={`flex-1 py-3 text-center text-sm font-bold transition-all relative ${
                activeTab === 'masuk'
                  ? 'text-desa-primary'
                  : 'text-desa-text/50 hover:text-desa-text'
              }`}
            >
              Masuk ke Akun
              {activeTab === 'masuk' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-desa-accent rounded-full" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('daftar')}
              className={`flex-1 py-3 text-center text-sm font-bold transition-all relative ${
                activeTab === 'daftar'
                  ? 'text-desa-primary'
                  : 'text-desa-text/50 hover:text-desa-text'
              }`}
            >
              Daftar Akun Baru
              {activeTab === 'daftar' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-desa-accent rounded-full" />
              )}
            </button>
          </div>

          {/* TAB 1: FORM MASUK */}
          {activeTab === 'masuk' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-desa-primary mb-1.5">
                  Nomor HP atau Email
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-desa-text/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="Contoh: 081234567890 atau email@desa.id"
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-desa-bg/40 border border-desa-primary/20 rounded-xl text-xs sm:text-sm text-desa-text focus:outline-none focus:border-desa-primary focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-desa-primary">
                    Kata Sandi
                  </label>
                  <button
                    type="button"
                    onClick={() => alert('Fitur reset kata sandi: Silakan hubungi admin Balai Desa via WhatsApp di 0812-3456-7890.')}
                    className="text-xs text-desa-accent hover:underline font-medium"
                  >
                    Lupa kata sandi?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-desa-text/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Masukkan kata sandi akun Anda"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 bg-desa-bg/40 border border-desa-primary/20 rounded-xl text-xs sm:text-sm text-desa-text focus:outline-none focus:border-desa-primary focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-desa-text/40 hover:text-desa-text"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-desa-primary hover:bg-desa-primary/90 text-desa-light font-bold text-sm shadow transition-all flex items-center justify-center gap-2"
                >
                  <span>Masuk ke Pasar Desa</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Demo Quick Account Helper */}
              <div className="mt-4 p-3 bg-desa-bg/70 rounded-xl border border-desa-primary/10 text-xs text-desa-text/70">
                <span className="font-bold text-desa-primary block mb-0.5">Akun Demo Pengujian Ujikom:</span>
                <span>Klik langsung tombol Masuk di atas (data default akun penjual Ibu Sumarsih sudah terisi).</span>
              </div>
            </form>
          )}

          {/* TAB 2: FORM DAFTAR */}
          {activeTab === 'daftar' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-desa-primary mb-1">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  required
                  placeholder="Nama lengkap sesuai KTP"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-desa-bg/40 border border-desa-primary/20 rounded-xl text-xs text-desa-text focus:outline-none focus:border-desa-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-desa-primary mb-1">
                  Nomor HP (WhatsApp Aktif)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-desa-text/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    placeholder="Contoh: 081234567890"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-desa-bg/40 border border-desa-primary/20 rounded-xl text-xs text-desa-text focus:outline-none focus:border-desa-primary"
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
                    className="w-full px-3.5 py-2.5 bg-desa-bg/40 border border-desa-primary/20 rounded-xl text-xs text-desa-text focus:outline-none focus:border-desa-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-desa-primary mb-1">
                    Konfirmasi Kata Sandi
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Ulangi kata sandi"
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-desa-bg/40 border border-desa-primary/20 rounded-xl text-xs text-desa-text focus:outline-none focus:border-desa-primary"
                  />
                </div>
              </div>

              {/* Pilihan Peran: Belanja / Jualan / Keduanya */}
              <div className="pt-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-desa-primary mb-2">
                  Pilihan Peran Akun:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setRegRole('belanja')}
                    className={`py-2 px-2 rounded-xl text-xs font-semibold border transition-all text-center ${
                      regRole === 'belanja'
                        ? 'bg-desa-primary text-desa-light border-desa-primary shadow'
                        : 'border-desa-primary/20 text-desa-text hover:bg-desa-bg'
                    }`}
                  >
                    Saya Ingin Belanja
                  </button>

                  <button
                    type="button"
                    onClick={() => setRegRole('jualan')}
                    className={`py-2 px-2 rounded-xl text-xs font-semibold border transition-all text-center ${
                      regRole === 'jualan'
                        ? 'bg-desa-accent text-white border-desa-accent shadow'
                        : 'border-desa-primary/20 text-desa-text hover:bg-desa-bg'
                    }`}
                  >
                    Saya Ingin Jualan
                  </button>

                  <button
                    type="button"
                    onClick={() => setRegRole('keduanya')}
                    className={`py-2 px-2 rounded-xl text-xs font-semibold border transition-all text-center ${
                      regRole === 'keduanya'
                        ? 'bg-desa-highlight text-white border-desa-highlight shadow'
                        : 'border-desa-primary/20 text-desa-text hover:bg-desa-bg'
                    }`}
                  >
                    Keduanya
                  </button>
                </div>
              </div>

              {/* Field Tambahan Khusus Jualan / Keduanya */}
              {(regRole === 'jualan' || regRole === 'keduanya') && (
                <div className="p-4 bg-desa-bg/60 rounded-2xl border border-desa-primary/15 space-y-3 animate-fadeIn">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-desa-accent">
                    <Building2 className="w-4 h-4" />
                    <span>Data Usaha & Toko UMKM:</span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-desa-primary mb-1">
                      Nama Usaha / Merek
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Griya Tenun Berkah, Kripik Barokah"
                      value={regShopName}
                      onChange={(e) => setRegShopName(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-desa-primary/20 rounded-xl text-xs focus:outline-none focus:border-desa-primary"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-desa-primary mb-1">
                        Kategori Usaha
                      </label>
                      <select
                        value={regShopCategory}
                        onChange={(e) => setRegShopCategory(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-desa-primary/20 rounded-xl text-xs focus:outline-none focus:border-desa-primary"
                      >
                        <option value="Kerajinan Tangan">Kerajinan Tangan</option>
                        <option value="Kuliner Tradisional">Kuliner Tradisional</option>
                        <option value="Hasil Tani & Kebun">Hasil Tani & Kebun</option>
                        <option value="Herbal & Jamu">Herbal & Jamu</option>
                        <option value="Pakaian & Tenun">Pakaian & Tenun</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-desa-primary mb-1">
                        Dusun / Lokasi Sentra
                      </label>
                      <select
                        value={regDusun}
                        onChange={(e) => setRegDusun(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-desa-primary/20 rounded-xl text-xs focus:outline-none focus:border-desa-primary"
                      >
                        {DUSUN_LIST.filter(d => d !== 'Semua Dusun').map((d) => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Syarat & Ketentuan Checkbox */}
              <div className="flex items-start gap-2 pt-1">
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreedTerms}
                  onChange={(e) => setAgreedTerms(e.target.checked)}
                  className="mt-1 accent-desa-accent rounded cursor-pointer"
                  required
                />
                <label htmlFor="terms" className="text-[11px] text-desa-text/80 cursor-pointer">
                  Saya menyetujui{' '}
                  <span 
                    onClick={() => alert('Syarat & Ketentuan: Pengguna wajib menjunjung tinggi kejujuran mutu produk desa dan etika transaksi yang amanah.')}
                    className="text-desa-accent underline font-semibold"
                  >
                    Syarat & Ketentuan
                  </span>{' '}
                  serta kebijakan privasi Pasar Desa Mandiri.
                </label>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-desa-highlight hover:bg-desa-highlight/90 text-white font-bold text-sm shadow transition-all flex items-center justify-center gap-2"
                >
                  <span>Daftar Akun Sekarang</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

        </div>

        {/* Right Mini Sidebar: Banner Ajakan Pasang Aplikasi PWA */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-gradient-to-br from-desa-primary to-[#2C2C2A] text-desa-light rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
            {/* Lurik watermark */}
            <div className="absolute inset-0 bg-lurik-stripes-light opacity-15 pointer-events-none" />

            <div className="relative z-10 space-y-4">
              <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-desa-highlight text-white inline-block">
                PWA Siap Pakai
              </span>

              <h3 className="font-heading text-xl sm:text-2xl font-bold text-desa-light leading-snug">
                Pasang Aplikasi Pasar Desa di Layar HP Anda!
              </h3>

              <p className="text-xs text-desa-light/80 leading-relaxed font-light">
                Belanja dan kelola toko lebih praktis langsung dari ponsel. Notifikasi pesanan cepat, 
                mudah diakses tanpa buka browser berulang kali.
              </p>

              <div className="space-y-2 pt-1 text-xs text-desa-light/90">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-desa-highlight shrink-0" />
                  <span>Ukuran sangat ringan (&lt; 2 MB)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-desa-highlight shrink-0" />
                  <span>Mode ganda: Pembeli & Penjual</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-desa-highlight shrink-0" />
                  <span>Langsung terhubung dengan WhatsApp UMKM</span>
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={() => setCurrentView('mobile')}
                  className="w-full py-3 px-4 rounded-xl bg-white text-desa-primary hover:bg-desa-light font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Smartphone className="w-4 h-4 text-desa-accent" />
                  <span>Buka Tampilan Aplikasi Mobile (PWA)</span>
                </button>
              </div>
            </div>
          </div>

          {/* Quick Help Card */}
          <div className="bg-white rounded-2xl p-5 border border-desa-primary/15 text-xs space-y-2">
            <h4 className="font-heading font-bold text-desa-primary text-sm flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-desa-highlight" />
              <span>Butuh Bantuan Pendaftaran UMKM?</span>
            </h4>
            <p className="text-desa-text/70 leading-relaxed">
              Petugas pendamping BUMDes siap membantu proses foto produk dan kurasi toko di Balai Desa.
            </p>
            <p className="text-desa-accent font-semibold">
              WhatsApp Layanan: 0812-3456-7890
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}

