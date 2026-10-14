import React from 'react';
import { useApp } from '../../context/AppContext';
import LurikDivider from './LurikDivider';
import { 
  Store, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Smartphone,
  ShieldCheck,
  Heart,
  Globe,
  Share2
} from 'lucide-react';

export default function Footer() {
  const { setWebPage, setCurrentView } = useApp();

  return (
    <footer className="bg-desa-primary text-desa-light relative overflow-hidden mt-20">
      
      <LurikDivider variant="light" height="3px" />

      
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-desa-light text-desa-primary flex items-center justify-center font-bold">
                <Store className="w-5 h-5 text-desa-primary" />
              </div>
              <span className="font-heading text-2xl font-bold tracking-tight text-desa-light">
                Pasar Desa
              </span>
            </div>
            
            <p className="text-sm text-desa-light/80 leading-relaxed font-light">
              Pusat digitalisasi ekonomi desa yang memberdayakan pengrajin, petani, dan pelaku UMKM lokal 
              berbasis kearifan budaya dan teknologi modern.
            </p>

            
            <div className="flex items-center gap-3 pt-2">
              <a 
                href="#instagram" 
                onClick={(e) => { e.preventDefault(); alert('Instagram Pasar Desa: @pasardesa.official'); }}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-desa-accent flex items-center justify-center transition-colors text-desa-light"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a 
                href="#facebook" 
                onClick={(e) => { e.preventDefault(); alert('Facebook: Komunitas Pasar Desa Mandiri'); }}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-desa-accent flex items-center justify-center transition-colors text-desa-light"
                aria-label="Facebook"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.5 5H18V0h-3.808C10.592 0 9 1.583 9 4.615V8z"/>
                </svg>
              </a>
              <a 
                href="#youtube" 
                onClick={(e) => { e.preventDefault(); alert('YouTube: Channel Resmi Desa Mandiri'); }}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-desa-accent flex items-center justify-center transition-colors text-desa-light"
                aria-label="YouTube"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
          </div>

          
          <div className="space-y-4">
            <h4 className="font-heading text-lg font-semibold text-desa-light border-b border-white/20 pb-2 inline-block">
              Wilayah layanan
            </h4>
            <ul className="space-y-3 text-sm text-desa-light/85">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-desa-accent shrink-0 mt-1" />
                <span>
                  Kecamatan Sumedang Utara, Kabupaten Sumedang, Jawa Barat
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-desa-accent shrink-0" />
                <span>(0261) 890-123 / 0812-3456-7890</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-desa-accent shrink-0" />
                <span>sekretariat@pasardesa.id</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-desa-accent shrink-0" />
                <span>Pelayanan: Sen - Jum (08.00 - 15.30 WIB)</span>
              </li>
            </ul>
          </div>

          
          <div className="space-y-4">
            <h4 className="font-heading text-lg font-semibold text-desa-light border-b border-white/20 pb-2 inline-block">
              Navigasi Cepat
            </h4>
            <ul className="space-y-2.5 text-sm text-desa-light/80">
              <li>
                <button 
                  onClick={() => { setWebPage('catalog'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-desa-accent transition-colors flex items-center gap-2"
                >
                  <span className="text-desa-accent">›</span> Katalog Seluruh Produk
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setWebPage('auth'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-desa-accent transition-colors flex items-center gap-2"
                >
                  <span className="text-desa-accent">›</span> Pendaftaran Toko UMKM
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setCurrentView('mobile'); }}
                  className="hover:text-desa-accent transition-colors flex items-center gap-2"
                >
                  <span className="text-desa-accent">›</span> Download Aplikasi PWA
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setCurrentView('admin'); }}
                  className="hover:text-desa-accent transition-colors flex items-center gap-2"
                >
                  <span className="text-desa-accent">›</span> Portal Admin Pengelola
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setWebPage('about'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-desa-accent transition-colors flex items-center gap-2"
                >
                  <span className="text-desa-accent">›</span> UMKM di 5 Kecamatan
                </button>
              </li>
            </ul>
          </div>

          
          <div className="space-y-4">
            <h4 className="font-heading text-lg font-semibold text-desa-light border-b border-white/20 pb-2 inline-block">
              Pasang Aplikasi Mobile
            </h4>
            <p className="text-xs text-desa-light/80 leading-relaxed">
              Dapatkan pengalaman belanja & jualan lebih mudah langsung dari layar HP tanpa unduh di Play Store.
            </p>

            <button
              onClick={() => setCurrentView('mobile')}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-desa-highlight hover:bg-desa-highlight/90 text-white font-medium text-sm shadow-md transition-all group"
            >
              <Smartphone className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <div className="text-left">
                <span className="text-[10px] block opacity-80 leading-none">Tersedia via PWA</span>
                <span className="font-semibold text-xs">Pasang ke Layar Utama HP</span>
              </div>
            </button>

            <div className="pt-2 text-[11px] text-desa-light/60 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-desa-highlight" />
              <span>Dikelola resmi oleh Pemerintah Desa & BUMDes</span>
            </div>
          </div>

        </div>

        
        <div className="my-10">
          <LurikDivider variant="light" height="1px" />
        </div>

        
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-desa-light/70 gap-4">
          <p>© 2026 Pasar Desa Mandiri. Palet Lurik Kontemporer.</p>
          <div className="flex items-center gap-1">
            <span>Dibuat dengan</span>
            <Heart className="w-3.5 h-3.5 text-desa-accent fill-desa-accent inline" />
            <span>untuk Uji Kompetensi Keahlian (Ujikom)</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

