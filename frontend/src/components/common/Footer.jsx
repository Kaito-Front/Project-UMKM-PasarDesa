import React from 'react';
import { useApp } from '../../context/AppContext';
import LurikDivider from './LurikDivider';
import { 
  Store, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  ShieldCheck,
  ArrowRight
} from 'lucide-react';

export default function Footer() {
  const { setWebPage, setCurrentView, openAuth } = useApp();

  return (
    <footer className="bg-[#163324] text-[#FBF8F3] relative overflow-hidden mt-20 border-t border-[#2E5E45]">
      
      {/* 1. Luminous Liquid Glass Ambient Refraction Glow (Top Edge) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-28 bg-gradient-to-b from-white/10 via-[#2E5E45]/20 to-transparent blur-3xl pointer-events-none" />

      {/* 2. Monumental Liquid Glass Typographic Watermark: PASARDESA */}
      <div 
        aria-hidden="true" 
        className="absolute -bottom-4 sm:-bottom-8 left-1/2 -translate-x-1/2 w-full flex items-center justify-center pointer-events-none select-none overflow-hidden z-0 opacity-12 sm:opacity-15"
      >
        <span className="font-heading font-black tracking-widest text-[clamp(4.5rem,14vw,14rem)] uppercase leading-none text-transparent bg-clip-text bg-gradient-to-b from-white/45 via-white/15 to-transparent [-webkit-text-stroke:1.5px_rgba(255,255,255,0.35)] backdrop-blur-3xl drop-shadow-[0_10px_35px_rgba(255,255,255,0.08)]">
          PASARDESA
        </span>
      </div>

      <LurikDivider variant="light" height="2px" />

      {/* 3. Main Footer Content (Distilled & Cleaned of Bloat) */}
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-14 pb-14 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          
          {/* Brand Info (Distilled: No redundant filler) */}
          <div className="space-y-3.5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md text-desa-accent border border-white/15 flex items-center justify-center font-bold shadow-inner">
                <Store className="w-5 h-5 text-desa-accent" />
              </div>
              <div>
                <span className="font-heading text-xl font-bold tracking-tight text-white block">
                  Pasar Desa
                </span>
                <span className="text-[10px] tracking-widest uppercase font-semibold text-desa-accent">
                  Kabupaten Sumedang
                </span>
              </div>
            </div>
            
            <p className="text-xs sm:text-sm text-[#FBF8F3]/75 leading-relaxed">
              Pusat kurasi komoditas pangan, kerajinan tangan, dan karya asli wirausaha binaan BUMDes Sumedang.
            </p>
          </div>

          {/* Regional Service & Contact (Distilled & Scannable) */}
          <div className="space-y-3">
            <h4 className="font-heading text-sm sm:text-base font-semibold text-white">
              Sekretariat & Layanan
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-[#FBF8F3]/80">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-desa-accent shrink-0 mt-0.5" />
                <span>Kecamatan Sumedang Utara, Kab. Sumedang</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-desa-accent shrink-0" />
                <span>0819-1519-4171</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-desa-accent shrink-0" />
                <span>sekretariat@pasardesa.id</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-desa-accent shrink-0" />
                <span>Senin – Sabtu, 08.00 – 16.00 WIB</span>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-heading text-sm sm:text-base font-semibold text-white">
              Navigasi Cepat
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-[#FBF8F3]/80">
              <li>
                <button 
                  onClick={() => { setWebPage('home'); window.scrollTo({ top: 0, left: 0, behavior: 'instant' }); }}
                  className="hover:text-white hover:translate-x-1 transition-all inline-flex items-center gap-1.5"
                >
                  <ArrowRight className="w-3 h-3 text-desa-accent opacity-75" />
                  <span>Beranda Pasar</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setWebPage('catalog'); window.scrollTo({ top: 0, left: 0, behavior: 'instant' }); }}
                  className="hover:text-white hover:translate-x-1 transition-all inline-flex items-center gap-1.5"
                >
                  <ArrowRight className="w-3 h-3 text-desa-accent opacity-75" />
                  <span>Katalog Produk</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setWebPage('about'); window.scrollTo({ top: 0, left: 0, behavior: 'instant' }); }}
                  className="hover:text-white hover:translate-x-1 transition-all inline-flex items-center gap-1.5"
                >
                  <ArrowRight className="w-3 h-3 text-desa-accent opacity-75" />
                  <span>Tentang Desa & Sentra</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    if (openAuth) openAuth('daftar_umkm');
                    else { setWebPage('auth'); window.scrollTo({ top: 0, left: 0, behavior: 'instant' }); }
                  }}
                  className="hover:text-white hover:translate-x-1 transition-all inline-flex items-center gap-1.5"
                >
                  <ArrowRight className="w-3 h-3 text-desa-accent opacity-75" />
                  <span>Daftarkan Usaha UMKM</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Governance & Administrative link (Distilled: No nested card bloat) */}
          <div className="space-y-3">
            <h4 className="font-heading text-sm sm:text-base font-semibold text-white">
              Tata Kelola BUMDes
            </h4>
            <div className="space-y-2 text-xs sm:text-sm text-[#FBF8F3]/80">
              <div className="flex items-center gap-2 text-white font-medium">
                <ShieldCheck className="w-4 h-4 text-desa-accent shrink-0" />
                <span>Kurasi Resmi BUMDes</span>
              </div>
              <p className="text-xs text-[#FBF8F3]/70 leading-relaxed">
                Platform terverifikasi untuk menjamin mutu produk dan transparansi transaksi warga.
              </p>
              <div className="pt-1">
                <button
                  onClick={() => {
                    setCurrentView('admin');
                    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
                  }}
                  className="text-xs font-semibold text-desa-accent hover:text-white transition-colors inline-flex items-center gap-1.5 group"
                >
                  <span>Panel Pengelola Desa</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Clean Copyright Bar (Distilled: No filler slogans) */}
        <div className="mt-10 sm:mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-[#FBF8F3]/60 gap-2">
          <p>© 2026 Pasar Desa Mandiri Kabupaten Sumedang. Hak Cipta Dilindungi.</p>
          <div className="flex items-center gap-2 text-[11px] text-[#FBF8F3]/50">
            <span>Standar Digital BUMDes Jawa Barat</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
