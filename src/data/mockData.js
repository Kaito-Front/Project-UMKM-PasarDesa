
export const CATEGORIES = [
  { id: 'semua', name: 'Semua Kategori', icon: 'LayoutGrid', count: 48 },
  { id: 'kuliner', name: 'Kuliner Tradisional', icon: 'Utensils', count: 18, desc: 'Oleh-oleh, jajanan pasar, bumbu racik desa' },
  { id: 'pertanian', name: 'Hasil Tani & Kebun', icon: 'Sprout', count: 12, desc: 'Sayur segar dan hasil tani dari Sumedang' },
  { id: 'kerajinan', name: 'Kerajinan Tangan', icon: 'Palette', count: 9, desc: 'Anyaman bambu, tenun lurik, gerabah tanah liat' },
  { id: 'kesehatan', name: 'Herbal & Jamu', icon: 'HeartPulse', count: 5, desc: 'Madu hutan murni, jamu rempah, minyak kelapa dara' },
  { id: 'fashion', name: 'Pakaian & Tenun', icon: 'Shirt', count: 4, desc: 'Kain lurik ATBM, selendang tenun, kaos desa' },
];

export const KECAMATAN_LIST = [
  'Semua Kecamatan',
  'Kecamatan Sumedang Utara',
  'Kecamatan Sumedang Selatan',
  'Kecamatan Cimalaka',
  'Kecamatan Tanjungsari',
  'Kecamatan Jatinangor',
];

export const SHOPS = [
  {
    id: 'toko-1',
    name: 'Griya Tenun Lurik Lestari',
    owner: 'Ibu Sumarsih',
    category: 'Kerajinan Tangan & Fashion',
    categorySlug: 'kerajinan',
    kecamatan: 'Kecamatan Sumedang Utara',
    address: 'Kecamatan Sumedang Utara, Kabupaten Sumedang, Jawa Barat',
    lat: -6.8293742,
    lng: 107.9116474,
    phone: '081234567890',
    whatsapp: '6281234567890',
    rating: 4.9,
    reviewCount: 142,
    joinDate: 'Januari 2024',
    operatingHours: '08.00 - 17.00 WIB (Senin - Sabtu)',
    description: 'Menjaga tradisi tenun lurik khas desa dengan alat tenun bukan mesin (ATBM). Pewarna alami dedaunan dan serat katun 100% berkualitas tinggi untuk kenyamanan harian.',
    avatar: 'kain-lurik.jpg',
    banner: 'kain-lurik.jpg',
    status: 'aktif',
    verified: true,
  },
  {
    id: 'toko-2',
    name: 'Kripik Tempe Bu Darmi',
    owner: 'Ibu Darmiyah',
    category: 'Kuliner Tradisional',
    categorySlug: 'kuliner',
    kecamatan: 'Kecamatan Cimalaka',
    address: 'Kecamatan Cimalaka, Kabupaten Sumedang, Jawa Barat',
    lat: -6.8025187,
    lng: 107.9413323,
    phone: '085678901234',
    whatsapp: '6285678901234',
    rating: 4.8,
    reviewCount: 98,
    joinDate: 'Maret 2024',
    operatingHours: '07.00 - 20.00 WIB (Setiap Hari)',
    description: 'Kripik tempe renyah gurih dengan daun jeruk asli dan racikan rempah warisan simbah. Tanpa bahan pengawet, dibuat fresh setiap pagi.',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    banner: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=1200&q=80',
    status: 'aktif',
    verified: true,
  },
  {
    id: 'toko-3',
    name: 'Madu Hutan & Gula Aren Tanjungsari',
    owner: 'Pak Joko Sukirno',
    category: 'Herbal & Jamu',
    categorySlug: 'kesehatan',
    kecamatan: 'Kecamatan Tanjungsari',
    address: 'Kecamatan Tanjungsari, Kabupaten Sumedang, Jawa Barat',
    lat: -6.8440915,
    lng: 107.7932319,
    phone: '087812345678',
    whatsapp: '6287812345678',
    rating: 5.0,
    reviewCount: 64,
    joinDate: 'Februari 2024',
    operatingHours: '08.00 - 18.00 WIB (Senin - Minggu)',
    description: 'Kelompok tani hutan memproduksi madu lebah liar murni tanpa campuran dan gula aren cetak murni dari pohon enau lereng bukit desa.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    banner: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=1200&q=80',
    status: 'aktif',
    verified: true,
  },
  {
    id: 'toko-4',
    name: 'Anyaman Bambu Berkah Jaya',
    owner: 'Pak Marto Wiyono',
    category: 'Kerajinan Tangan',
    categorySlug: 'kerajinan',
    kecamatan: 'Kecamatan Sumedang Selatan',
    address: 'Kecamatan Sumedang Selatan, Kabupaten Sumedang, Jawa Barat',
    lat: -6.859079,
    lng: 107.9202767,
    phone: '082198765432',
    whatsapp: '6282198765432',
    rating: 4.7,
    reviewCount: 53,
    joinDate: 'April 2024',
    operatingHours: '08.00 - 16.30 WIB (Senin - Sabtu)',
    description: 'Produsen keranjang, besek hampers, kap lampu, dan perabotan ramah lingkungan berbahan bambu apus pilihan yang diawetkan alami.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    banner: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&q=80',
    status: 'aktif',
    verified: true,
  },
  {
    id: 'toko-5',
    name: 'Kopi Robusta Jatinangor',
    owner: 'Mas Hendra Pratama',
    category: 'Kuliner Tradisional',
    categorySlug: 'kuliner',
    kecamatan: 'Kecamatan Jatinangor',
    address: 'Kecamatan Jatinangor, Kabupaten Sumedang, Jawa Barat',
    lat: -6.9370992,
    lng: 107.7813872,
    phone: '089533344455',
    whatsapp: '6289533344455',
    rating: 4.9,
    reviewCount: 110,
    joinDate: 'Mei 2024',
    operatingHours: '09.00 - 21.00 WIB (Setiap Hari)',
    description: 'Biji kopi robusta petik merah dengan aroma rempah khas tanah pegunungan desa. Roasting medium-dark dengan crema tebal dan gurih.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    banner: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=1200&q=80',
    status: 'menunggu',
    verified: false,
  }
];

export const PRODUCTS = [
  {
    id: 'prod-1',
    name: 'Kain Tenun Lurik Klasik Motif Telupat',
    price: 185000,
    originalPrice: 210000,
    category: 'kerajinan',
    categoryName: 'Kerajinan Tangan',
    shopId: 'toko-1',
    shopName: 'Griya Tenun Lurik Lestari',
    kecamatan: 'Kecamatan Sumedang Utara',
    stock: 24,
    rating: 4.9,
    sold: 168,
    isFeatured: true,
    isPopular: true,
    isNew: false,
    images: [
      'kain-lurik.jpg',
      'kain-lurik1.jpg',
      'kain-lurik-2.jpg'
    ],
    description: 'Kain tenun lurik asli dengan motif telupat hitam abu kontemporer. Ditenun secara telaten menggunakan ATBM (Alat Tenun Bukan Mesin) tradisional. Lembut, adem di kulit, tidak mudah pudar, dan sangat cocok untuk kemeja resmi, rompi etnik, maupun busana kasual.',
    specifications: [
      { label: 'Bahan', value: '100% Benang Katun Super' },
      { label: 'Ukuran', value: '200 cm x 105 cm' },
      { label: 'Teknik', value: 'ATBM (Tradisional Asli)' },
      { label: 'Pewarna', value: 'Sintetis ramah serat katun' },
    ],
    reviews: [
      { id: 'rev-1', user: 'Bambang Sudiro', rating: 5, date: '12 Okt 2026', comment: 'Bahan luriknya sangat mantap dan adem. Pengerjaan rapi sekali!' },
      { id: 'rev-2', user: 'Ratna Wulandari', rating: 5, date: '08 Okt 2026', comment: 'Warnanya elegan, cocok dipakai kerja atau seragam keluarga.' }
    ]
  },
  {
    id: 'prod-2',
    name: 'Kripik Tempe Renyah Gurih Daun Jeruk (250gr)',
    price: 18000,
    originalPrice: 20000,
    category: 'kuliner',
    categoryName: 'Kuliner Tradisional',
    shopId: 'toko-2',
    shopName: 'Kripik Tempe Bu Darmi',
    kecamatan: 'Kecamatan Cimalaka',
    stock: 50,
    rating: 4.8,
    sold: 430,
    isFeatured: true,
    isPopular: true,
    isNew: false,
    images: [
      'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Camilan khas desa yang selalu dirindukan. Dibuat dari kedelai pilihan berpadu bumbu rempah tradisional dan rajangan daun jeruk wangi. Renyah gurih tanpa rasa minyak berlebih, dikemas ziplock higienis kedap udara.',
    specifications: [
      { label: 'Berat Bersih', value: '250 gram' },
      { label: 'Masa Simpan', value: '3 bulan di wadah rapat' },
      { label: 'P-IRT', value: '2153308010452-26' },
      { label: 'Halal', value: 'ID3311000123991' }
    ],
    reviews: [
      { id: 'rev-3', user: 'Siti Aminah', rating: 5, date: '11 Okt 2026', comment: 'Renyah banget, daun jeruknya wangi dan gak serik di tenggorokan.' }
    ]
  },
  {
    id: 'prod-3',
    name: 'Madu Hutan Liar Murni Akasia Lereng (500ml)',
    price: 95000,
    originalPrice: 110000,
    category: 'kesehatan',
    categoryName: 'Herbal & Jamu',
    shopId: 'toko-3',
    shopName: 'Madu Hutan & Gula Aren Tanjungsari',
    kecamatan: 'Kecamatan Tanjungsari',
    stock: 18,
    rating: 5.0,
    sold: 89,
    isFeatured: true,
    isPopular: false,
    isNew: true,
    images: [
      'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Madu murni hasil panen kelompok petani lebah di wilayah Tanjungsari. Tanpa proses pasteurisasi berlebih sehingga kandungan alaminya tetap terjaga.',
    specifications: [
      { label: 'Volume', value: '500 ml' },
      { label: 'Kemasan', value: 'Botol kaca food-grade' },
      { label: 'Khasiat', value: 'Meningkatkan imunitas & energi' },
    ],
    reviews: [
      { id: 'rev-4', user: 'dr. Danang', rating: 5, date: '05 Okt 2026', comment: 'Kualitas madunya sangat murni, kental alami dan rasa manisnya pas.' }
    ]
  },
  {
    id: 'prod-4',
    name: 'Set Besek Anyaman Bambu Hampers Natural (Isi 3)',
    price: 45000,
    originalPrice: 50000,
    category: 'kerajinan',
    categoryName: 'Kerajinan Tangan',
    shopId: 'toko-4',
    shopName: 'Anyaman Bambu Berkah Jaya',
    kecamatan: 'Kecamatan Sumedang Selatan',
    stock: 35,
    rating: 4.7,
    sold: 120,
    isFeatured: false,
    isPopular: true,
    isNew: false,
    images: [
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Keranjang besek tradisional dengan sentuhan estetika minimalis. Dibuat dari bambu apus halus yang telah diasap agar anti-jamur dan awet bertahun-tahun. Cocok untuk wadah hantaran, bento desa, atau souvenir ramah lingkungan.',
    specifications: [
      { label: 'Isi Paket', value: '3 ukuran (Kecil, Sedang, Besar)' },
      { label: 'Material', value: 'Bambu Apus Lokal Pilihan' },
      { label: 'Finishing', value: 'Asap Alami & Anti Rayap' }
    ],
    reviews: []
  },
  {
    id: 'prod-5',
    name: 'Kopi Robusta Petik Merah Giling Medium (200gr)',
    price: 38000,
    originalPrice: 42000,
    category: 'kuliner',
    categoryName: 'Kuliner Tradisional',
    shopId: 'toko-5',
    shopName: 'Kopi Robusta Jatinangor',
    kecamatan: 'Kecamatan Jatinangor',
    stock: 40,
    rating: 4.9,
    sold: 95,
    isFeatured: false,
    isPopular: true,
    isNew: true,
    images: [
      'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Biji kopi pilihan yang dipetik hanya saat matang merah di perkebunan rakyat lereng desa. Profil sangrai medium roast menghasilkan cita rasa karamel dengan aftertaste rempah cengkeh yang hangat.',
    specifications: [
      { label: 'Varietas', value: 'Robusta Sumedang' },
      { label: 'Proses', value: 'Natural Process' },
      { label: 'Gilingan', value: 'Medium (cocok untuk tubruk & pour over)' }
    ],
    reviews: []
  },
  {
    id: 'prod-6',
    name: 'Gula Aren Semut Organik Asli Cetak Batang (1kg)',
    price: 32000,
    originalPrice: 35000,
    category: 'kuliner',
    categoryName: 'Kuliner Tradisional',
    shopId: 'toko-3',
    shopName: 'Madu Hutan & Gula Aren Tanjungsari',
    kecamatan: 'Kecamatan Tanjungsari',
    stock: 30,
    rating: 4.9,
    sold: 145,
    isFeatured: true,
    isPopular: true,
    isNew: false,
    images: [
      'https://images.unsplash.com/photo-1621996346565-e3d5d6281782?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Nira aren murni yang dimasak perlahan di atas tungku kayu bakar tradisional. Aroma wangi khas asap kayu dengan indeks glikemik lebih ramah dibanding gula pasir.',
    specifications: [
      { label: 'Komposisi', value: '100% Nira Aren Murni' },
      { label: 'Bentuk', value: 'Butiran Semut Kering' },
      { label: 'Kadar Air', value: '< 2%' }
    ],
    reviews: []
  }
];

export const VILLAGE_STATS = {
  totalUmkm: 42,
  totalProducts: 186,
  totalTransactions: 1240,
  turnoverThisMonth: 84500000,
  activeKecamatan: 5,
};

export const MOCK_ORDERS = [
  {
    id: 'ORD-2026-081',
    productName: 'Kain Tenun Lurik Klasik Motif Telupat',
    buyerName: 'Rudi Hartono',
    phone: '081399887766',
    date: '14 Okt 2026',
    total: 185000,
    qty: 1,
    status: 'diproses', // diproses, dikirim, selesai, ditolak
    shopName: 'Griya Tenun Lurik Lestari',
    kecamatan: 'Kecamatan Sumedang Utara',
    address: 'Kecamatan Sumedang Utara, Kabupaten Sumedang, Jawa Barat',
  },
  {
    id: 'ORD-2026-080',
    productName: 'Kripik Tempe Renyah Gurih Daun Jeruk (250gr)',
    buyerName: 'Dewi Lestari',
    phone: '082211445566',
    date: '13 Okt 2026',
    total: 36000,
    qty: 2,
    status: 'dikirim',
    shopName: 'Kripik Tempe Bu Darmi',
    kecamatan: 'Kecamatan Cimalaka',
    address: 'Komplek Balai Desa RT 01',
  },
  {
    id: 'ORD-2026-079',
    productName: 'Madu Hutan Liar Murni Akasia Lereng (500ml)',
    buyerName: 'Ahmad Fauzi',
    phone: '085733221100',
    date: '12 Okt 2026',
    total: 95000,
    qty: 1,
    status: 'selesai',
    shopName: 'Madu Hutan & Gula Aren Tanjungsari',
    kecamatan: 'Kecamatan Tanjungsari',
    address: 'Pondok Pesantren Nurul Huda',
  }
];

export const MOCK_ANNOUNCEMENTS = [
  {
    id: 'ann-1',
    title: 'Pelatihan Sertifikasi Halal Gratis untuk UMKM Desa',
    date: '12 Oktober 2026',
    target: 'Semua Penjual UMKM',
    excerpt: 'Dinas Koperasi dan Desa menyelenggarakan pendampingan sertifikasi halal gratis di Balai Desa hari Sabtu depan.',
    isUrgent: true,
  },
  {
    id: 'ann-2',
    title: 'Pekan Pasar Kuliner Desa Menyambut Hari Sumpah Pemuda',
    date: '08 Oktober 2026',
    target: 'Seluruh Warga & Pembeli',
    excerpt: 'Dapatkan diskon ongkir lokal dan voucher belanja produk unggulan desa mulai 25-28 Oktober 2026.',
    isUrgent: false,
  }
];

export const MOCK_USERS = [
  { id: 'usr-1', name: 'Ibu Sumarsih', email: 'sumarsih@pasardesa.id', phone: '081234567890', role: 'penjual', shopName: 'Griya Tenun Lurik Lestari', status: 'aktif' },
  { id: 'usr-2', name: 'Bambang Sudiro', email: 'bambang.s@gmail.com', phone: '081399887766', role: 'pembeli', shopName: '-', status: 'aktif' },
  { id: 'usr-3', name: 'Pak Joko Sukirno', email: 'joko.madu@pasardesa.id', phone: '087812345678', role: 'keduanya', shopName: 'Madu Hutan & Gula Aren', status: 'aktif' },
  { id: 'usr-4', name: 'Mas Hendra Pratama', email: 'hendra.kopi@pasardesa.id', phone: '089533344455', role: 'penjual', shopName: 'Kopi Robusta Jatinangor', status: 'menunggu_verifikasi' },
  { id: 'usr-5', name: 'Admin Perangkat Desa', email: 'admin@pasardesa.go.id', phone: '081122334455', role: 'admin', shopName: 'Pemerintah Desa', status: 'aktif' },
];
export const INITIAL_USER_ADDRESSES = [
  {
    id: 'addr-1',
    label: 'Rumah Utama (Kecamatan Sumedang Utara)',
    receiverName: 'Bambang Sudiro',
    phone: '0813-9988-7766',
    kecamatan: 'Kecamatan Sumedang Utara',
    rtRw: 'RT 03 / RW 01',
    fullAddress: 'Kecamatan Sumedang Utara, Kabupaten Sumedang, Jawa Barat',
    notes: 'Depan gapura bambu ukir khas desa, pagar cat cokelat kayu',
    lat: -6.8293742,
    lng: 107.9116474,
    isDefault: true
  },
  {
    id: 'addr-2',
    label: 'Kantor BUMDes & Workshop',
    receiverName: 'Bambang Sudiro',
    phone: '0813-9988-7766',
    kecamatan: 'Kecamatan Sumedang Selatan',
    rtRw: 'RT 02 / RW 03',
    fullAddress: 'Kecamatan Sumedang Selatan, Kabupaten Sumedang, Jawa Barat',
    notes: 'Gedung warna krem dekat lapangan voli desa',
    lat: -6.859079,
    lng: 107.9202767,
    isDefault: false
  }
];
export const KECAMATAN_LOCATIONS = {
  'Kecamatan Sumedang Utara': {
    lat: -6.8293742,
    lng: 107.9116474,
    name: 'Kecamatan Sumedang Utara',
    desc: 'Sentra Pemerintahan & Galeri Tenun Lurik'
  },
  'Kecamatan Sumedang Selatan': {
    lat: -6.859079,
    lng: 107.9202767,
    name: 'Kecamatan Sumedang Selatan',
    desc: 'Sentra Anyaman Bambu & Hasil Kebun'
  },
  'Kecamatan Cimalaka': {
    lat: -6.8025187,
    lng: 107.9413323,
    name: 'Kecamatan Cimalaka',
    desc: 'Sentra Olahan Pangan & Kripik Tempe Tradisional'
  },
  'Kecamatan Tanjungsari': {
    lat: -6.8440915,
    lng: 107.7932319,
    name: 'Kecamatan Tanjungsari',
    desc: 'Kawasan Lereng Hutan Madu & Gula Aren'
  },
  'Kecamatan Jatinangor': {
    lat: -6.9370992,
    lng: 107.7813872,
    name: 'Kecamatan Jatinangor',
    desc: 'Perkebunan Kopi Robusta Lereng Pegunungan'
  }
};
export const SHIPPING_METHODS = [
  {
    id: 'kurir-desa',
    name: 'Kurir Kilat Desa Mandiri',
    eta: 'Tiba Hari Ini (1-3 Jam)',
    price: 5000,
    desc: 'Diantar langsung oleh pemuda karang taruna desa ke depan pintu rumah.'
  },
  {
    id: 'ambil-sendiri',
    name: 'Ambil di Toko',
    eta: 'Bisa Diambil Kapan Saja',
    price: 0,
    desc: 'Gratis ongkir. Silakan ambil langsung di workshop penjual atau posko BUMDes.'
  },
  {
    id: 'reguler-ekspedisi',
    name: 'Ekspedisi Luar Kota (JNE / SiCepat)',
    eta: '2-3 Hari Kerja',
    price: 15000,
    desc: 'Khusus pesanan kirim ke luar area kecamatan/kota dengan resi otomatis.'
  }
];
export const PAYMENT_METHODS = [
  {
    id: 'qris-desa',
    name: 'QRIS Pasar Desa Mandiri',
    type: 'Instan & Bebas Biaya Admin',
    desc: 'Scan barcode menggunakan BCA, Mandiri, BRI, GoPay, OVO, atau DANA.'
  },
  {
    id: 'transfer-bank',
    name: 'Transfer Bank Rekening Desa (Bank Jateng / BRI)',
    type: 'Konfirmasi Manual / Otomatis',
    desc: 'No. Rekening 1029-3847-56 atas nama BUMDes Berkah Mandiri.'
  },
  {
    id: 'cod-desa',
    name: 'Bayar Tunai di Tempat (COD)',
    type: 'Tanpa Biaya Tambahan',
    desc: 'Bayar uang tunai pas saat kurir desa menyerahkan paket barang ke tangan Anda.'
  }
];
export const INITIAL_CHAT_THREADS = {
  'general-bot': [
    {
      id: 'bot-m1',
      sender: 'bot',
      text: 'Sugeng rawuh di Pasar Desa Mandiri. Saya adalah Asisten Virtual Desa yang siap membantu Anda 24 jam seputar produk lokal, cek ongkir kurir desa, ketersediaan barang, atau menyambungkan langsung ke Admin Toko.',
      time: 'Baru saja',
      quickOptions: [
        'Cek Ketersediaan Stok',
        'Tanya Ongkir & Kurir Sumedang',
        'Hubungkan ke Admin Toko',
        'Komplain atau Bantuan Pesanan'
      ]
    }
  ],
  'toko-1': [
    {
      id: 't1-m1',
      sender: 'bot',
      text: 'Anda sedang berada di ruang obrolan Toko Griya Tenun Lurik Lestari (Ibu Sumarsih). Ada produk yang ingin Anda tanyakan?',
      time: '09:15'
    },
    {
      id: 't1-m2',
      sender: 'seller',
      senderName: 'Ibu Sumarsih',
      text: 'Halo kak, salam hangat dari pengrajin tenun lurik Kecamatan Sumedang Utara. Kami siap melayani pemesanan kain lurik ATBM motif klasik maupun modern. Silakan tanyakan stok atau ukuran kustom.',
      time: '09:16'
    }
  ],
  'toko-2': [
    {
      id: 't2-m1',
      sender: 'seller',
      senderName: 'Ibu Darmiyah',
      text: 'Monggo kak! Kripik tempe kami selalu gorengan baru setiap pagi. Renyah dan gurih tanpa pengawet.',
      time: 'Kemarin'
    }
  ],
  'toko-3': [
    {
      id: 't3-m1',
      sender: 'seller',
      senderName: 'Pak Joko Sukirno',
      text: 'Madu murni dari petani Tanjungsari siap dikirim hari ini kak.',
      time: 'Kemarin'
    }
  ]
};


