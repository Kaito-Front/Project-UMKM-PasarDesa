# Pasar Desa - Web & Mobile PWA

Aplikasi platform e-commerce dan manajemen UMKM tingkat desa, dibangun untuk memenuhi kebutuhan Project Ujikom (Uji Kompetensi Keahlian). Proyek ini mendukung digitalisasi produk lokal, UMKM, dan pengrajin dusun dengan tiga antarmuka utama: Website Publik (Pembeli), PWA Mobile (Pembeli & Penjual), dan Dashboard Admin.

Desain UI mengusung tema "Lurik Kontemporer" dengan warna dasar gading (`#EFEDE6`) dan aksen terakota/hijau sage untuk menonjolkan kesan budaya lokal yang modern.

## Fitur Utama

Aplikasi ini dibagi menjadi tiga modul (Role-based):

1. **Website Publik (Browser/Desktop)**
   - Autentikasi multi-peran (Pembeli & Penjual).
   - Katalog produk dengan filter kategori, harga, dan lokasi dusun.
   - Detail produk dengan checkout langsung via WhatsApp.
   - Halaman profil toko UMKM dan peta dusun.

2. **Aplikasi Mobile (PWA)**
   - Mode Pembeli: Katalog produk ringkas, pencarian, dan manajemen pesanan.
   - Mode Penjual: Dashboard UMKM, kelola produk aktif/nonaktif, dan update status pesanan.
   - Mendukung instalasi PWA di smartphone.

3. **Dashboard Admin (Pengelola Desa/BUMDes)**
   - Verifikasi pendaftaran UMKM baru (Approve/Reject).
   - Moderasi produk dan manajemen kategori.
   - Laporan transaksi (Export CSV) dan broadcast pengumuman.

## Tech Stack
- **Frontend:** React, Vite, Tailwind CSS (dengan custom PostCSS untuk pattern lurik)
- **Backend:** Laravel 11, MySQL
- **Lainnya:** Context API untuk state management, PWA Manifest

## Cara Menjalankan Proyek (Local Development)

Pastikan di komputer Anda sudah terinstall PHP, Composer, Node.js, dan Laragon/XAMPP.

### 1. Setup Backend (Laravel)
Buka terminal dan arahkan ke folder `backend`.

```bash
# Install dependensi PHP
composer install

# Setup environment database
cp .env.example .env
# Buka file .env dan sesuaikan konfigurasi DB (nama DB: pasar_desa)

# Generate app key & jalankan migrasi beserta dummy data
php artisan key:generate
php artisan migrate --seed

# Jalankan local server backend
php artisan serve
