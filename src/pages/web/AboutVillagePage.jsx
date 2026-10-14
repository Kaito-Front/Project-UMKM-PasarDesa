import React from 'react';
import { useApp } from '../../context/AppContext';
import LurikDivider from '../../components/common/LurikDivider';
import { 
  Building2, 
  MapPin, 
  Sparkles, 
  Users, 
  Award, 
  ShieldCheck, 
  ArrowRight,
  Heart,
  Landmark
} from 'lucide-react';

export default function AboutVillagePage() {
  const { setWebPage, setSelectedKecamatan } = useApp();

  const kecamatanCenters = [
    {
      name: 'Kecamatan Sumedang Utara',
      specialty: 'Sumedang Utara · sentra tenun lurik dan kerajinan',
      desc: 'Pusat kebudayaan tenun tradisional dengan puluhan pengrajin wanita penjaga tradisi alat tenun bukan mesin sejak zaman kolonial.',
      image: 'https://images.unsplash.com/photo-1606744888344-498238f01769?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Kecamatan Cimalaka',
      specialty: 'Cimalaka · olahan pangan dan keripik tempe',
      desc: 'Kecamatan penghasil camilan renyah legendaris berpadu rempah aromatik daun jeruk yang telah dikirim ke berbagai kota di Indonesia.',
      image: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Kecamatan Tanjungsari',
      specialty: 'Tanjungsari · madu dan gula aren',
      desc: 'Terletak di lereng pegunungan berhawa sejuk dengan kawasan hutan lestari penghasil madu akasia murni dan nira aren organik.',
      image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Kecamatan Sumedang Selatan',
      specialty: 'Sumedang Selatan · anyaman bambu dan gerabah',
      desc: 'Pemanfaatan rumpun bambu apus desa menjadi produk hias rumah, wadah hampers ramah lingkungan, dan perlengkapan saji alami.',
      image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Kecamatan Jatinangor',
      specialty: 'Jatinangor · produk kopi dan olahan lokal',
      desc: 'Hamparan kebun kopi rakyat di ketinggian 800 MDPL yang menghasilkan biji kopi petik merah beraroma rempah hangat nan khas.',
      image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=600&q=80',
    }
  ];

  return (
    <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12 sm:space-y-16">
      
      
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-desa-primary/5 border border-desa-primary/15 text-xs font-semibold text-desa-primary">
          <Landmark className="w-4 h-4 text-desa-accent" />
          <span>Profil Desa & Filosofi Lurik Kontemporer</span>
        </div>

        <h1 className="font-heading text-3xl sm:text-5xl font-bold text-desa-primary leading-tight">
          Menjaga Warisan Leluhur, Menggerakkan Ekonomi Masa Depan.
        </h1>

        <p className="text-sm sm:text-base text-desa-text/80 leading-relaxed font-light">
          Pasar Desa Mandiri lahir dari inisiatif warga desa bersama BUMDes untuk menghubungkan karya 
          otentik 5 kecamatan pengrajin langsung dengan para penikmat produk lokal bermutu tinggi.
        </p>

        <div className="pt-2">
          <LurikDivider variant="dark" height="2px" />
        </div>
      </div>

      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-center bg-white rounded-3xl p-5 sm:p-12 border border-desa-primary/15 shadow-sm">
        <div className="space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-desa-accent">
            Filosofi Budaya
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-desa-primary">
            Makna Garis Garis Lurik
          </h2>
          <p className="text-xs sm:text-sm text-desa-text/80 leading-relaxed font-light">
            Kata <strong>"Lurik"</strong> berasal dari bahasa Jawa kuno <em>lorek</em> yang bermakna garis-garis sejajar. 
            Motif ini melambangkan kesederhanaan, keteguhan hati, kejujuran, dan kesetaraan derajat antar sesama warga.
          </p>
          <p className="text-xs sm:text-sm text-desa-text/80 leading-relaxed font-light">
            Dalam platform <strong>Pasar Desa</strong>, palet warna <em>Lurik Kontemporer</em> menggabungkan arang primer (`#3A3A38`), 
            terakota aksen (`#A85C3C`), dan hijau lumut daun (`#7C8C6B`) sebagai simbol harmoni alam dan manusia.
          </p>
        </div>

        <div className="h-64 sm:h-80 rounded-2xl overflow-hidden border border-desa-primary/20 relative">
          <img
            src="kain-lurik.jpg"
            alt="Kain Tenun Lurik"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
            <span className="text-xs font-medium text-desa-light">
              Pengrajin tenun ATBM Kecamatan Sumedang Utara dengan benang katun super.
            </span>
          </div>
        </div>
      </div>

      
      <div className="space-y-8">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-desa-highlight">
            Peta Potensi Kecamatan
          </span>
          <h2 className="font-heading text-3xl font-bold text-desa-primary mt-1">
            5 kecamatan tempat UMKM warga beroperasi
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {kecamatanCenters.map((kecamatan, idx) => (
            <div 
              key={idx}
              className="bg-white rounded-2xl overflow-hidden border border-desa-primary/15 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="h-44 overflow-hidden relative">
                  <img src={kecamatan.image} alt={kecamatan.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded bg-desa-primary/80 backdrop-blur-sm text-white text-[11px] font-semibold">
                    {kecamatan.name}
                  </div>
                </div>

                <div className="p-5 space-y-2">
                  <h3 className="font-heading font-bold text-base text-desa-primary">
                    {kecamatan.specialty}
                  </h3>
                  <p className="text-xs text-desa-text/75 leading-relaxed font-light">
                    {kecamatan.desc}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0">
                <button
                  onClick={() => {
                    setSelectedKecamatan(kecamatan.name);
                    setWebPage('catalog');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="w-full py-2 px-3 rounded-xl border border-desa-primary/20 text-xs font-semibold text-desa-primary hover:bg-desa-primary hover:text-desa-light transition-all flex items-center justify-center gap-1.5"
                >
                  <span>Lihat Produk {kecamatan.name.split(' ')[1]}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

