import React from 'react';
import { useApp } from '../../context/AppContext';
import LurikDivider from './LurikDivider';
import { 
  Store, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  ShieldCheck
} from 'lucide-react';

export default function Footer() {
  const { setWebPage, setCurrentView } = useApp();

  return (
    <footer className="bg-desa-primary text-desa-light relative overflow-hidden mt-20">
      <LurikDivider variant="light" height="2px" />

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-desa-light text-desa-primary flex items-center justify-center font-bold">
                <Store className="w-5 h-5 text-desa-primary" />
              </div>
              <span className="font-heading text-xl font-bold tracking-tight text-white">
                Pasar Desa
              </span>
            </div>
            
            <p className="text-xs text-desa-light/75 leading-relaxed font-normal">
              Platform digitalisasi ekonomi BUMDes yang menghubungkan perajin tenun, petani madu, dan pelaku usaha lokal Kabupaten Sumedang dengan penikmat karya nusantara.
            </p>
          </div>

          {/* Regional Service Office */}
          <div className="space-y-3">
            <h4 className="font-heading text-sm font-semibold text-white border-b border-white/10 pb-2">
              Sekretariat & Wilayah Layanan
            </h4>
            <ul className="space-y-2.5 text-xs text-desa-light/80">
              <li className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-desa-accent shrink-0 mt-0.5" />
                <span>Kecamatan Sumedang Utara, Kabupaten Sumedang, Jawa Barat</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-desa-accent shrink-0" />
                <span>(0261) 890-123 / 0812-3456-7890</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-desa-accent shrink-0" />
                <span>sekretariat@pasardesa.id</span>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-desa-accent shrink-0" />
                <span>Senin – Sabtu, 08.00 – 16.00 WIB</span>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-heading text-sm font-semibold text-white border-b border-white/10 pb-2">
              Navigasi Cepat
            </h4>
            <ul className="space-y-2 text-xs text-desa-light/80">
              <li>
                <button 
                  onClick={() => { setWebPage('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-white transition-colors"
                >
                  Beranda Pasar
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setWebPage('catalog'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-white transition-colors"
                >
                  Katalog Semua Produk
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setWebPage('about'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-white transition-colors"
                >
                  Tentang Desa & Sentra
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setWebPage('auth'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-white transition-colors"
                >
                  Daftarkan Usaha UMKM
                </button>
              </li>
            </ul>
          </div>

          {/* Governance & Administrative link */}
          <div className="space-y-3">
            <h4 className="font-heading text-sm font-semibold text-white border-b border-white/10 pb-2">
              Tata Kelola BUMDes
            </h4>
            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-xs space-y-2">
              <div className="flex items-center gap-1.5 text-white font-medium">
                <ShieldCheck className="w-4 h-4 text-desa-highlight" />
                <span>Produk Terverifikasi</span>
              </div>
              <p className="text-[11px] text-desa-light/70 leading-relaxed">
                Seluruh produk telah melewati verifikasi mutu dan keaslian bahan lokal oleh pengelola desa.
              </p>
              <button
                onClick={() => {
                  setCurrentView('admin');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="text-[11px] font-semibold text-desa-accent hover:underline block pt-1"
              >
                Panel Petugas Pengelola →
              </button>
            </div>
          </div>

        </div>

        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-[11px] text-desa-light/60 gap-3">
          <p>© 2026 Pasar Desa Mandiri Kabupaten Sumedang. Hak Cipta Dilindungi.</p>
          <p>Karya Nyata Membangun Ekonomi Desa Berbasis Kebudayaan.</p>
        </div>
      </div>
    </footer>
  );
}
