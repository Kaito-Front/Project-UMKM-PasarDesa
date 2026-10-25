# Pasar Desa API

Backend Laravel 13 untuk aplikasi React di folder `frontend`. PHP Laragon 8.3 dan MySQL Laragon dipakai sebagai runtime lokal.

## Menjalankan di Laragon

Jalankan perintah PHP dan Composer dari Laragon Terminal agar keduanya tersedia di `PATH`.

1. Pastikan MySQL berjalan di Laragon.
2. Buat database `pasar_desa` di phpMyAdmin jika belum ada.
3. Salin `.env.example` menjadi `.env`, lalu sesuaikan host, port, nama database, dan kredensial MySQL.
4. Dari folder ini jalankan:

   ```bash
   composer install
   php artisan key:generate
   php artisan migrate --seed
   php artisan serve
   ```

API berjalan di `http://127.0.0.1:8000/api`. Frontend sudah memakai alamat tersebut secara default. Atur `VITE_API_URL` di `frontend/.env` bila alamat API berbeda.

## Endpoint Utama

- `POST /api/auth/register` (Throttle: 10 req/menit)
- `POST /api/auth/login` (Throttle: 10 req/menit)
- `POST /api/orders` (Throttle: 5 req/menit)
- `POST /api/chat/ai` (Asisten AI Desa - Google Gemini, Throttle: 15 req/menit)
- `GET /api/categories`
- `GET /api/shops`
- `GET /api/products`
- `GET /api/products/{id}`
- `GET /api/stats`

### Endpoint Terproteksi (Bearer Token - Laravel Sanctum)

- `GET /api/auth/me`
- `PATCH /api/auth/profile`
- `PATCH /api/auth/password` (Otomatis mencabut seluruh sesi lain)
- `POST /api/auth/logout`
- `POST /api/products` (Seller/Admin)
- `PUT/PATCH /api/products/{id}` (Seller/Admin)
- `PATCH /api/products/{id}/visibility` (Seller/Admin)
- `DELETE /api/products/{id}` (Seller/Admin)
- `PATCH /api/shops/{id}` (Owner/Admin)
- `GET /api/orders` (Role filtered - bebas IDOR)
- `GET /api/orders/{id}` (Strict owner/buyer validation)
- `PATCH /api/orders/{id}/status` (Seller/Admin)

## Akun Bawaan (Database Seeder)

| Peran | Identifier (Email / No HP) | Kata Sandi Default | Sumber Konfigurasi |
| :--- | :--- | :--- | :--- |
| **Admin Desa** | `admin@pasardesa.go.id` / `081122334455` | `DesaMandiri@2026!` | `ADMIN_PASSWORD` di `.env` |
| **Penjual (Demo)** | `sumarsih@pasardesa.id` / `081234567890` | `PasarLurik@2026!` | `DEMO_SELLER_PASSWORD` di `.env` |
