import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { KECAMATAN_LIST } from '../../data/mockData';
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
  Smartphone
} from 'lucide-react';

export default function AuthPage() {
  const { 
    login,
    register,
    setWebPage, 
    setCurrentView,
    triggerNotification 
  } = useApp();

  const [activeTab, setActiveTab] = useState('masuk');
  const [showPassword, setShowPassword] = useState(false);
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regRole, setRegRole] = useState('belanja');
  const [regShopName, setRegShopName] = useState('');
  const [regShopCategory, setRegShopCategory] = useState('Kerajinan Tangan');
  const [regKecamatan, setRegKecamatan] = useState('Kecamatan Sumedang Utara');
  const [agreedTerms, setAgreedTerms] = useState(true);

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
        shopName: regShopName, shopCategory: regShopCategory, kecamatan: regKecamatan,
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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Form Container */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-8 border border-desa-border shadow-xs">
          
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-desa-primary text-white flex items-center justify-center">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <span className="font-heading text-xl font-bold tracking-tight text-desa-primary">
                Pasar Desa
              </span>
              <p className="text-xs text-desa-muted">
                Ekosistem Digital UMKM Mandiri
              </p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-desa-border mb-6">
            <button
              type="button"
              onClick={() => { setActiveTab('masuk'); setFormError(''); }}
              className={`flex-1 py-2.5 text-center text-xs font-bold transition-colors relative ${
                activeTab === 'masuk'
                  ? 'text-desa-primary'
                  : 'text-desa-muted hover:text-desa-primary'
              }`}
            >
              Masuk ke Akun
              {activeTab === 'masuk' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-desa-accent rounded-full" />
              )}
            </button>

            <button
              type="button"
              onClick={() => { setActiveTab('daftar'); setFormError(''); }}
              className={`flex-1 py-2.5 text-center text-xs font-bold transition-colors relative ${
                activeTab === 'daftar'
                  ? 'text-desa-primary'
                  : 'text-desa-muted hover:text-desa-primary'
              }`}
            >
              Daftar Akun Baru
              {activeTab === 'daftar' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-desa-accent rounded-full" />
              )}
            </button>
          </div>

          {formError && (
            <p role="alert" className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
              {formError}
            </p>
          )}

          {/* Login Form */}
          {activeTab === 'masuk' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-desa-primary mb-1">
                  Nomor HP atau Email
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-desa-subtle absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    required
                    placeholder="Contoh: 081234567890 atau email@desa.id"
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-desa-bg/40 border border-desa-border rounded-lg text-sm text-desa-text focus:outline-none focus:border-desa-primary focus:bg-white"
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
                <div className="relative">
                  <Lock className="w-4 h-4 text-desa-subtle absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Masukkan kata sandi akun"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full pl-9 pr-10 py-2.5 bg-desa-bg/40 border border-desa-border rounded-lg text-sm text-desa-text focus:outline-none focus:border-desa-primary focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-desa-subtle hover:text-desa-primary"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 rounded-lg bg-desa-primary hover:bg-desa-primary/90 text-white font-semibold text-sm shadow-xs transition-colors flex items-center justify-center gap-2"
                >
                  <span>{isSubmitting ? 'Memproses...' : 'Masuk ke Pasar Desa'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="pt-3 border-t border-desa-border flex items-center justify-between text-xs text-desa-muted">
                <span>Petugas pengelola BUMDes?</span>
                <button
                  type="button"
                  onClick={() => setCurrentView('admin')}
                  className="font-semibold text-desa-accent hover:underline flex items-center gap-1"
                >
                  <span>Login Panel Admin →</span>
                </button>
              </div>
            </form>
          )}

          {/* Register Form */}
          {activeTab === 'daftar' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
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
                  className="w-full px-3 py-2 bg-desa-bg/40 border border-desa-border rounded-lg text-sm text-desa-text focus:outline-none focus:border-desa-primary focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-desa-primary mb-1">
                  Nomor WhatsApp Aktif
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-desa-subtle absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="tel"
                    required
                    placeholder="08xxxxxxxxxx"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-desa-bg/40 border border-desa-border rounded-lg text-sm text-desa-text focus:outline-none focus:border-desa-primary focus:bg-white"
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
                    className="w-full px-3 py-2 bg-desa-bg/40 border border-desa-border rounded-lg text-sm text-desa-text focus:outline-none focus:border-desa-primary focus:bg-white"
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
                    className="w-full px-3 py-2 bg-desa-bg/40 border border-desa-border rounded-lg text-sm text-desa-text focus:outline-none focus:border-desa-primary focus:bg-white"
                  />
                </div>
              </div>

              {/* Role Selection */}
              <div>
                <label className="block text-xs font-semibold text-desa-primary mb-1.5">
                  Tujuan Pendaftaran Akun:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRegRole('belanja')}
                    className={`p-2.5 rounded-lg border text-xs font-medium text-left transition-colors ${
                      regRole === 'belanja'
                        ? 'border-desa-primary bg-desa-primary text-white'
                        : 'border-desa-border bg-white text-desa-text hover:bg-desa-bg'
                    }`}
                  >
                    <span>Pembeli Warga</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRegRole('jualan')}
                    className={`p-2.5 rounded-lg border text-xs font-medium text-left transition-colors ${
                      regRole === 'jualan'
                        ? 'border-desa-accent bg-desa-accent text-white'
                        : 'border-desa-border bg-white text-desa-text hover:bg-desa-bg'
                    }`}
                  >
                    <span>Penjual / UMKM Desa</span>
                  </button>
                </div>
              </div>

              {/* Additional Merchant Inputs if Seller */}
              {regRole === 'jualan' && (
                <div className="p-3.5 rounded-lg bg-desa-bg/60 border border-desa-border space-y-3">
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
                      className="w-full px-3 py-2 bg-white border border-desa-border rounded-lg text-sm text-desa-text focus:outline-none focus:border-desa-primary"
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
                        className="w-full px-2.5 py-1.5 bg-white border border-desa-border rounded-lg text-sm text-desa-primary"
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
                        onChange={(e) => setRegKecamatan(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white border border-desa-border rounded-lg text-sm text-desa-primary"
                      >
                        {KECAMATAN_LIST.filter(k => k !== 'Semua Kecamatan').map(k => (
                          <option key={k} value={k}>{k}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 rounded-lg bg-desa-primary hover:bg-desa-primary/90 text-white font-semibold text-sm shadow-xs transition-colors flex items-center justify-center gap-2"
                >
                  <span>{isSubmitting ? 'Memproses...' : 'Daftarkan Akun Sekarang'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

        </div>

        {/* Right Info Column */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-desa-primary text-white rounded-2xl p-6 shadow-xs space-y-4">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-desa-accent text-white inline-block">
              Keunggulan Ekosistem
            </span>

            <h3 className="font-heading text-xl font-bold leading-snug">
              Kemandirian Ekonomi Warga Berbasis Digital
            </h3>

            <p className="text-sm text-desa-light/80 leading-relaxed">
              Pasar Desa memfasilitasi transaksi jujur langsung antara pengrajin dan pembeli dengan verifikasi resmi dari BUMDes.
            </p>

            <div className="space-y-2.5 pt-1 text-sm text-desa-light/90">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-desa-highlight shrink-0" />
                <span>Tanpa potongan komisi perantara luar</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-desa-highlight shrink-0" />
                <span>Langsung terhubung dengan WhatsApp penjual</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-desa-highlight shrink-0" />
                <span>Mendukung pengiriman antar kecamatan dan nasional</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 border border-desa-border text-xs space-y-1.5">
            <h4 className="font-heading font-bold text-desa-primary text-sm flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-desa-highlight" />
              <span>Pendampingan Balai Desa</span>
            </h4>
            <p className="text-sm text-desa-muted leading-relaxed">
              Petugas BUMDes siap mendampingi pendaftaran izin usaha mikro dan verifikasi produk di kantor Balai Desa.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
