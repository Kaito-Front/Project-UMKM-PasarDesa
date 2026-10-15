# 🌾 Pasar Desa — Frontend (React.js + Tailwind CSS)

Aplikasi Web & Mobile PWA Pasar Desa dengan konsep **Palet: Lurik Kontemporer** untuk digitalisasi UMKM, petani, pengrajin dusun, dan pengelola desa. Dibuat khusus untuk kebutuhan **Project Ujikom (Uji Kompetensi Keahlian)**.

---

## 🎨 Design System: Lurik Kontemporer

| Peran Warna | Kode HEX | Kegunaan dalam UI |
| :--- | :---: | :--- |
| **Latar (Background)** | `#EFEDE6` | Warna dasar seluruh halaman (warm linen/gading) |
| **Primer** | `#3A3A38` | Header, navbar, teks judul, tombol utama (charcoal lurik) |
| **Aksen** | `#A85C3C` | Badge unggulan, status toko, link aktif, ikon (terakota klasik) |
| **Sorot (CTA)** | `#7C8C6B` | Tombol aksi utama: "Pesan WhatsApp", "Pasang Aplikasi", "Simpan" (hijau sage) |
| **Teks Body** | `#232220` | Teks body di atas latar terang |
| **Teks di Atas Gelap** | `#EFEDE6` | Teks putih-gading di atas latar primer/sorot |

- **Tipografi:**
  - **Judul / Heading:** Serif berkarakter `Fraunces` (Google Fonts)
  - **Body Text:** Sans-serif netral `Work Sans` (Google Fonts)
- **Motif Budaya:** Elemen dekoratif garis tipis ala lurik monokrom (`LurikDivider.jsx` dan border pinstripe) pada header, banner, footer, serta tepi kartu produk.

---

## 🚀 Fitur & Modul Sesuai Dokumen Spesifikasi

Proyek ini telah mencakup ketiga komponen utama spesifikasi dengan **Mode Switcher** di bagian paling atas navbar untuk memudahkan penguji/guru melihat semua tampilan:

### 1. Website Publik (Diakses Lewat Browser Desktop / Pembeli Umum)
- **1.1 Halaman Login & Daftar (`AuthPage.jsx`):**
  - Logo "Pasar Desa" + tagline
  - Tab switch: *Masuk* / *Daftar*
  - Form Masuk dengan No. HP / Email & Kata Sandi
  - Form Daftar dengan pilihan peran: *"Saya ingin belanja"*, *"Saya ingin jualan"*, atau *"Keduanya"*
  - Kolom otomatis bersyarat untuk penjual: Nama Usaha, Kategori Usaha, Alamat Dusun
  - Syarat & Ketentuan dan Banner mini ajakan pasang PWA
- **1.2 Halaman Beranda (`HomePage.jsx`):**
  - Navbar dengan link aktif & mode switcher
  - Hero Section dengan judul besar Fraunces, subteks, search bar produk, dan kata kunci populer
  - Section Kategori Populer (kartu ikon kuliner, kerajinan, pertanian, herbal, fashion)
  - Section Produk Unggulan & Terlaris dengan kontrol navigasi
  - Section UMKM Baru Bergabung dengan profil perajin desa
  - Section Statistik Desa (UMKM aktif, produk, transaksi, 5 dusun sentra)
  - Section Pasang Aplikasi (PWA) lengkap dengan mockup ponsel
  - Footer dengan kontak Balai Desa, media sosial, dan tautan cepat
- **1.3 Halaman Katalog (`CatalogPage.jsx`):**
  - Search bar interaktif tetap di atas
  - Sidebar filter: kategori, rentang harga (slider), dusun/lokasi, rating minimal
  - Sorting: terbaru, termurah, termahal, terlaris, rating tertinggi
  - Grid produk responsif dengan informasi toko, dusun, harga, rating, dan stok
  - Navigasi pagination halaman
- **1.4 Halaman Detail Produk (`ProductDetailPage.jsx`):**
  - Galeri multi-gambar dengan thumbnail switcher
  - Nama produk, harga diskon, stok tersedia
  - Selector kuantitas dan catatan khusus untuk penjual
  - Tombol aksi: *"Pesan via WhatsApp Langsung"* dan *"Pesan Sekarang"*
  - Kartu profil UMKM/penjual dengan tombol *"Lihat Toko"*
  - Deskripsi lengkap produk dan tabel spesifikasi bahan
  - Section Ulasan Pembeli (bintang rating + form tambah ulasan)
  - Produk lain dari toko yang sama
- **1.5 Halaman Toko / UMKM (`ShopDetailPage.jsx`):**
  - Foto profil & sampul toko
  - Nama usaha, badge verifikasi resmi BUMDes, kategori usaha
  - Peta lokasi dusun interaktif
  - Jam operasional dan kontak WhatsApp
  - Tab navigasi: *Daftar Produk Toko*, *Profil & Kisah Usaha*, *Peta Lokasi Dusun*

---

### 2. Aplikasi Mobile (PWA — Role-based Pembeli & Penjual)
Tersedia dalam simulator ponsel interaktif (`MobileAppView.jsx`):
- **2.1 Splash Screen & Onboarding:**
  - Animasi Splash Screen 1–2 detik saat aplikasi pertama dibuka
  - Onboarding 3 slide interaktif pengenalan fitur
- **2.2 Mode Pembeli — Beranda:**
  - Search bar produk di bagian teratas
  - Scroll horizontal kategori ikon
  - Banner pengumuman desa
  - Grid 2 kolom produk rekomendasi
  - Bottom navigation: *Beranda*, *Katalog*, *Pesanan*, *Akun*
  - Floating button *"Ke Mode Jual"* untuk akun ganda
- **2.3 Mode Pembeli — Detail & Pesanan:**
  - Lembar detail produk ringkas
  - Tombol besar *"Pesan via WhatsApp"* ramah ibu jari
  - Halaman *"Pesanan Saya"* dengan filter status: *Diproses*, *Dikirim*, *Selesai*
  - Simpan favorit dengan ikon hati
- **2.4 Mode Penjual — Dashboard Toko:**
  - Kartu KPI ringkas: pesanan baru, produk aktif, omset minggu ini
  - Bottom navigation khusus penjual: *Dashboard*, *Produk*, *Pesanan*, *Toko Saya*
  - Floating button `+` untuk tambah produk cepat
- **2.5 Mode Penjual — Kelola Produk & Pesanan:**
  - List produk dengan toggle aktif/nonaktif
  - Modal form tambah produk baru
  - List pesanan masuk dengan tombol ubah status (*Tandai Dikirim*, *Tandai Selesai*)
  - Simulasi push notifikasi real-time di layar atas
- **2.6 Halaman Profil / Pengaturan:**
  - Info akun, ganti kata sandi, status versi PWA terpasang

---

### 3. Website Admin (Dashboard Pengelola Desa)
Panel khusus perangkat desa / pengurus BUMDes (`AdminLayout.jsx`):
- **3.1 Halaman Login Admin:** Form login khusus petugas tanpa opsi daftar
- **3.2 Dashboard Utama:** Statistik total UMKM, produk, transaksi, grafik bar transaksi mingguan, dan log aktivitas terbaru
- **3.3 Manajemen UMKM:** Tabel seluruh UMKM dengan tombol verifikasi pendaftaran baru (*Approve* / *Reject*) dan tombol nonaktifkan/blokir
- **3.4 Manajemen Produk & Kategori:** Tabel produk lintas toko dengan fitur moderasi (sembunyikan produk yang melanggar aturan) dan form tambah kategori desa
- **3.5 Manajemen Pengguna:** Tabel akun pembeli & penjual, filter peran, tombol reset kata sandi, dan blokir akun
- **3.6 Laporan & Pengumuman:** Fitur unduh laporan transaksi berformat `.CSV` dan form broadcast pengumuman serentak ke aplikasi warga

---

## 📁 Struktur Direktori

```text
frontend/
├── index.html                   # Entry point HTML dengan font Fraunces & Work Sans
├── package.json                 # Konfigurasi dependensi React, Vite, Tailwind, Lucide
├── tailwind.config.js           # Definisi palet warna Lurik Kontemporer & lurik background
├── postcss.config.js            # PostCSS plugin
├── vite.config.js               # Konfigurasi build Vite
├── src/
│   ├── App.jsx                  # Root component dengan routing view
│   ├── index.css                # CSS Tailwind dan utility garis motif lurik
│   ├── main.jsx                 # Entry point React
│   ├── context/
│   │   └── AppContext.jsx       # State management global multi-peran & data toko
│   ├── data/
│   │   └── mockData.js          # Mock data autentik desa (5 Dusun, UMKM, Produk)
│   ├── components/
│   │   └── common/
│   │       ├── Navbar.jsx       # Navbar utama + Mode Switcher (Web/Mobile/Admin)
│   │       ├── Footer.jsx       # Footer informatif dengan motif lurik
│   │       ├── ProductCard.jsx  # Kartu produk serbaguna
│   │       └── LurikDivider.jsx # Elemen dekoratif garis tipis ala tenun lurik
│   └── pages/
│       ├── web/
│       │   ├── HomePage.jsx          # Beranda website publik
│       │   ├── CatalogPage.jsx       # Katalog lengkap dengan sidebar filter & pagination
│       │   ├── ProductDetailPage.jsx # Detail produk & galeri multi-foto
│       │   ├── ShopDetailPage.jsx    # Halaman profil toko & peta lokasi
│       │   ├── AuthPage.jsx          # Login & daftar multi-peran
│       │   └── AboutVillagePage.jsx  # Profil desa & filosofi tenun lurik
│       ├── mobile/
│       │   └── MobileAppView.jsx     # Simulator PWA Mobile (Pembeli & Penjual)
│       └── admin/
│           └── AdminLayout.jsx       # Dashboard admin desa, verifikasi, moderasi, laporan
```

---

## 💻 Cara Menjalankan Proyek

### Backend Laravel dengan Laragon

Jalankan perintah PHP dan Composer dari Laragon Terminal agar keduanya tersedia di `PATH`.

1. Buat database MySQL bernama `pasar_desa` dari Laragon atau phpMyAdmin.
2. Masuk ke folder `backend`, salin `.env.example` menjadi `.env`, lalu sesuaikan kredensial MySQL Laragon.
3. Jalankan migrasi dan isi katalog awal:
   ```bash
   composer install
   php artisan key:generate
   php artisan migrate --seed
   ```
4. Nyalakan API:
   ```bash
   php artisan serve
   ```
   API tersedia di `http://127.0.0.1:8000/api`.
5. Frontend memakai proxy `/api` yang meneruskan request ke Laravel di komputer yang sama. URL bisa diubah melalui `VITE_API_URL` di `frontend/.env` jika API ditempatkan di host lain.

Frontend mengambil kategori, toko, produk, dan pesanan dari API. Produk dapat dibuat dengan `POST /api/products`, status tayangnya diubah melalui `PATCH /api/products/{id}/visibility`, dan checkout menyimpan pesanan lewat `POST /api/orders`.

1. **Buka terminal di dalam folder `frontend`:**
   ```bash
   cd frontend
   ```

2. **Jalankan server pengembangan (Development Server):**
   ```bash
   npm run dev
   ```
   Untuk membuka aplikasi dari HP/perangkat lain di Wi-Fi yang sama, jalankan:
   ```bash
   npm run dev -- --host 0.0.0.0
   ```
   Dari HP buka `http://IP-KOMPUTER:5173` (cek alamat IPv4 komputer dengan `ipconfig`). Vite meneruskan request `/api` ke Laravel di komputer yang sama, jadi alamat API tidak perlu diubah. Kedua perangkat harus tersambung ke jaringan yang sama dan firewall Windows perlu mengizinkan Node.js pada jaringan Private.

3. **Membangun versi produksi (Build Production):**
   ```bash
   npm run build
   ```
   File hasil build yang siap dipublikasikan akan berada di folder `dist/`.

---

## 🎯 Panduan Demonstrasi saat Ujikom

Di bagian bilah paling atas aplikasi, terdapat **Mode Pratinjau**:
1. Klik **Web Publik** untuk menampilkan pengalaman belanja di layar laptop/komputer.
2. Klik **Mobile PWA** untuk melihat tampilan aplikasi ponsel dengan simulasi bingkai HP, splash screen, onboarding, serta peralihan peran Pembeli vs Penjual.
3. Klik **Admin Desa** untuk menampilkan panel pengelola BUMDes (grafik transaksi, persetujuan toko, moderasi, dan ekspor laporan).
