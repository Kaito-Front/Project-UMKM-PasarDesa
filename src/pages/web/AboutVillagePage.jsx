import React from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import LurikDivider from '../../components/common/LurikDivider';
import { 
  ArrowRight
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
      
      {/* Editorial Header */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
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

      {/* Cultural Heritage & Philosophy */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-white rounded-2xl p-6 sm:p-10 border border-desa-border shadow-xs">
        <div className="space-y-4">
          <span className="text-sm font-semibold text-desa-accent">
            Filosofi Budaya
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-desa-primary">
            Makna Garis Garis Lurik
          </h2>
          <p className="text-sm sm:text-base text-desa-muted leading-relaxed">
            Kata <strong>"Lurik"</strong> berakar dari kata <em>lorek</em> yang bermakna garis-garis sejajar penuntun arah. Motif ini melambangkan kesederhanaan hidup, keteguhan hati, kejujuran dalam berdagang, dan kesetaraan derajat antar sesama warga.
          </p>
          <p className="text-sm sm:text-base text-desa-muted leading-relaxed">
            Dalam identitas visual <strong>Pasar Desa</strong>, harmoni diwujudkan melalui perpaduan warna arang kayu alami, terakota tanah liat perajin, serta hijau lumut dedaunan sebagai lambang keselarasan antara alam dan karya tangan manusia.
          </p>
        </div>

        <div className="h-64 sm:h-80 rounded-xl overflow-hidden border border-desa-border relative bg-desa-bg">
          <img
            src="/kain-lurik.jpg"
            alt="Kain Tenun Lurik Asli Sumedang"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-x-0 bottom-0 bg-desa-primary/80 flex items-end p-5">
            <span className="text-xs text-desa-light font-medium">
              Kain tenun lurik ATBM hasil karya tangan perajin desa Sumedang Utara
            </span>
          </div>
        </div>
      </div>

      {/* 5 Kecamatan Craft Centers */}
      <div className="space-y-6">
        <div className="text-center max-w-xl mx-auto">
          <span className="text-sm font-semibold text-desa-highlight">
            Sentra Produksi Wilayah
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-desa-primary mt-1">
            5 Sentra Kecamatan Binaan BUMDes
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {kecamatanCenters.map((kecamatan, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.07, duration: 0.4 }}
              className="bg-white rounded-xl overflow-hidden border border-desa-border hover:border-desa-primary/40 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="h-44 overflow-hidden relative bg-desa-bg">
                  <img src={kecamatan.image} alt={kecamatan.name} className="w-full h-full object-cover" />
                  <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded bg-black/75 text-white text-[11px] font-medium">
                    {kecamatan.name}
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <h3 className="font-heading font-bold text-base text-desa-primary">
                    {kecamatan.specialty}
                  </h3>
                  <p className="text-sm text-desa-muted leading-relaxed">
                    {kecamatan.desc}
                  </p>
                </div>
              </div>

              <div className="p-4 pt-0">
                <button
                  onClick={() => {
                    setSelectedKecamatan(kecamatan.name);
                    setWebPage('catalog');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="w-full py-2 px-3 rounded-lg border border-desa-border text-xs font-semibold text-desa-primary hover:bg-desa-bg transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>Lihat Produk {kecamatan.name.replace('Kecamatan ', '')}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-desa-accent" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

    </div>
  );
}
