import React from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import LurikDivider from '../../components/common/LurikDivider';
import { 
  ArrowRight,
  Sparkles,
  MapPin
} from 'lucide-react';

export default function AboutVillagePage() {
  const { setWebPage, setSelectedKecamatan } = useApp();

  const kecamatanCenters = [
    {
      name: 'Kecamatan Sumedang Utara',
      specialty: 'Sentra Tenun Lurik & Kerajinan Tekstil',
      desc: 'Pusat tradisi tenun tradisional dengan puluhan pengrajin wanita penjaga tradisi alat tenun bukan mesin (ATBM) sejak puluhan tahun.',
      image: 'https://images.unsplash.com/photo-1606744888344-498238f01769?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Kecamatan Cimalaka',
      specialty: 'Olahan Pangan & Keripik Tempe Renyah',
      desc: 'Kecamatan penghasil camilan renyah legendaris berpadu rempah aromatik daun jeruk asli yang telah dikirim ke berbagai kota di Indonesia.',
      image: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Kecamatan Tanjungsari',
      specialty: 'Madu Hutan Alami & Gula Aren Organik',
      desc: 'Kawasan lereng pegunungan berhawa sejuk dengan hutan lestari penghasil madu lebah liar murni dan nira aren tanpa campuran kimia.',
      image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Kecamatan Sumedang Selatan',
      specialty: 'Anyaman Bambu Apus & Gerabah Alami',
      desc: 'Pemanfaatan rumpun bambu desa menjadi perlengkapan saji alami, wadah ramah lingkungan, dan produk dekorasi rumah berkualitas ekspor.',
      image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Kecamatan Jatinangor',
      specialty: 'Biji Kopi Rakyat & Olahan Kreatif',
      desc: 'Hamparan kebun kopi rakyat di ketinggian pegunungan yang menghasilkan biji kopi petik merah beraroma rempah hangat nan khas.',
      image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=600&q=80',
    }
  ];

  return (
    <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-14 sm:space-y-18">
      
      {/* Hero Header */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/75 backdrop-blur-md border border-white/80 shadow-xs text-xs font-semibold text-desa-accent">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Kearifan Lokal BUMDes Sumedang</span>
        </div>

        <h1 className="font-heading text-3xl sm:text-5xl font-bold text-desa-primary leading-tight">
          Menjaga Warisan Leluhur, Menggerakkan Ekonomi Masa Depan
        </h1>

        <p className="text-base sm:text-lg text-desa-muted leading-relaxed">
          Pasar Desa lahir dari inisiatif warga desa bersama BUMDes untuk menghubungkan karya otentik 5 sentra pengrajin Sumedang langsung dengan para penikmat produk lokal bermutu tinggi.
        </p>

        <div className="pt-2">
          <LurikDivider variant="dark" height="1px" />
        </div>
      </div>

      {/* Philosophy Card with Liquid Glass look */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-white/75 backdrop-blur-xl rounded-3xl p-6 sm:p-10 border border-white/80 shadow-[0_12px_40px_rgb(0,0,0,0.04)]">
        <div className="space-y-4">
          <span className="text-xs font-bold tracking-wider uppercase text-desa-accent">
            Filosofi Budaya & Identitas Visual
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-desa-primary">
            Makna Garis-Garis Lurik
          </h2>
          <p className="text-sm sm:text-base text-desa-muted leading-relaxed">
            Kata <strong>"Lurik"</strong> berakar dari kata <em>lorek</em> yang bermakna garis-garis sejajar penuntun arah. Motif ini melambangkan kesederhanaan hidup, keteguhan hati, kejujuran dalam berdagang, dan kesetaraan derajat antar sesama warga.
          </p>
          <p className="text-sm sm:text-base text-desa-muted leading-relaxed">
            Dalam identitas visual kontemporer <strong>Pasar Desa</strong>, harmoni diwujudkan melalui perpaduan 60% kanvas <strong>Oatmilk</strong> yang hangat dan bersih, 30% keteduhan <strong>Forest Green</strong> pinus pegunungan Sumedang sebagai pilar struktural, serta 10% aksen <strong>Tomato Red</strong> sebagai lambang gairah dan daya tarik hasil panen lokal.
          </p>
        </div>

        <div className="h-72 sm:h-88 rounded-2xl overflow-hidden border border-white/80 relative bg-desa-bg shadow-sm">
          <img
            src="/kain-lurik.jpg"
            alt="Kain Tenun Lurik Asli Sumedang"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-desa-primary/90 via-desa-primary/50 to-transparent p-5 backdrop-blur-xs">
            <span className="text-xs text-[#FBF8F3] font-medium leading-relaxed block">
              Kain tenun lurik ATBM hasil karya tangan perajin desa Sumedang Utara.
            </span>
          </div>
        </div>
      </div>

      {/* Production Centers */}
      <div className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-bold tracking-wider uppercase text-desa-accent">
            Sentra Produksi Wilayah
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-desa-primary">
            5 Sentra Kecamatan Binaan BUMDes
          </h2>
          <p className="text-sm text-desa-muted">
            Setiap kecamatan memiliki keunikan alam dan keahlian kriya turun-temurun.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {kecamatanCenters.map((kecamatan, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.07, duration: 0.4 }}
              className="bg-white/75 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="h-48 overflow-hidden relative bg-desa-bg">
                  <img 
                    src={kecamatan.image} 
                    alt={kecamatan.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-desa-primary/80 backdrop-blur-md text-white text-[11px] font-semibold flex items-center gap-1 shadow-sm">
                    <MapPin className="w-3 h-3 text-desa-accent" />
                    <span>{kecamatan.name}</span>
                  </div>
                </div>

                <div className="p-5 space-y-2">
                  <h3 className="font-heading font-bold text-base text-desa-primary">
                    {kecamatan.specialty}
                  </h3>
                  <p className="text-sm text-desa-muted leading-relaxed">
                    {kecamatan.desc}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0">
                <button
                  onClick={() => {
                    setSelectedKecamatan(kecamatan.name);
                    setWebPage('catalog');
                    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
                  }}
                  className="w-full py-2.5 px-4 rounded-xl border border-desa-border bg-white/70 backdrop-blur-sm text-xs font-semibold text-desa-primary hover:bg-desa-accent hover:text-white hover:border-desa-accent transition-all flex items-center justify-center gap-2 group/btn shadow-2xs"
                >
                  <span>Lihat Produk {kecamatan.name.replace('Kecamatan ', '')}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-desa-accent group-hover/btn:text-white group-hover/btn:translate-x-0.5 transition-all" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

    </div>
  );
}
