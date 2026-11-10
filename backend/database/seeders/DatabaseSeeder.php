<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call(MarketplaceSeeder::class);

        $adminPassword = env('ADMIN_PASSWORD', 'DesaMandiri@2026!');
        $sellerPassword = env('DEMO_SELLER_PASSWORD', 'PasarLurik@2026!');

        User::updateOrCreate(['email' => 'admin@pasardesa.go.id'], [
            'name' => 'Admin Pasar Desa',
            'phone' => '081915194171',
            'password' => $adminPassword,
            'role' => 'admin',
        ]);

        User::updateOrCreate(['email' => 'sumarsih@pasardesa.id'], [
            'name' => 'Ibu Sumarsih',
            'phone' => '081234567890',
            'password' => $sellerPassword,
            'role' => 'keduanya',
            'shop_id' => 'toko-1',
            'shop_name' => 'Griya Tenun Lurik Lestari',
            'kecamatan' => 'Kecamatan Sumedang Utara',
        ]);

        User::updateOrCreate(['email' => 'darmiyah@pasardesa.id'], [
            'name' => 'Ibu Darmiyah',
            'phone' => '085678901234',
            'password' => $sellerPassword,
            'role' => 'jualan',
            'shop_id' => 'toko-2',
            'shop_name' => 'Kripik Tempe Bu Darmi',
            'kecamatan' => 'Kecamatan Cimalaka',
        ]);

        User::updateOrCreate(['email' => 'joko@pasardesa.id'], [
            'name' => 'Pak Joko Sukirno',
            'phone' => '087812345678',
            'password' => $sellerPassword,
            'role' => 'jualan',
            'shop_id' => 'toko-3',
            'shop_name' => 'Madu Hutan & Gula Aren Tanjungsari',
            'kecamatan' => 'Kecamatan Tanjungsari',
        ]);

        User::updateOrCreate(['email' => 'marto@pasardesa.id'], [
            'name' => 'Pak Marto Wiyono',
            'phone' => '082198765432',
            'password' => $sellerPassword,
            'role' => 'jualan',
            'shop_id' => 'toko-4',
            'shop_name' => 'Anyaman Bambu Berkah Jaya',
            'kecamatan' => 'Kecamatan Sumedang Selatan',
        ]);

        User::updateOrCreate(['email' => 'hendra@pasardesa.id'], [
            'name' => 'Mas Hendra Pratama',
            'phone' => '089533344455',
            'password' => $sellerPassword,
            'role' => 'jualan',
            'shop_id' => 'toko-5',
            'shop_name' => 'Kopi Robusta Jatinangor',
            'kecamatan' => 'Kecamatan Jatinangor',
        ]);

        // Pembeli Terdaftar (Warga Desa)
        $buyerPassword = env('DEMO_BUYER_PASSWORD', 'WargaDesa@2026!');

        User::updateOrCreate(['email' => 'bambang@pasardesa.id'], [
            'name' => 'Bambang Sudiro',
            'phone' => '081299887766',
            'password' => $buyerPassword,
            'role' => 'belanja',
            'kecamatan' => 'Kecamatan Sumedang Utara',
        ]);

        User::updateOrCreate(['email' => 'rudi@pasardesa.id'], [
            'name' => 'Rudi Hartono',
            'phone' => '081399887766',
            'password' => $buyerPassword,
            'role' => 'belanja',
            'kecamatan' => 'Kecamatan Sumedang Utara',
        ]);

        User::updateOrCreate(['email' => 'dewi@pasardesa.id'], [
            'name' => 'Dewi Lestari',
            'phone' => '082211445566',
            'password' => $buyerPassword,
            'role' => 'belanja',
            'kecamatan' => 'Kecamatan Cimalaka',
        ]);

        User::updateOrCreate(['email' => 'ahmad@pasardesa.id'], [
            'name' => 'Ahmad Fauzi',
            'phone' => '085733221100',
            'password' => $buyerPassword,
            'role' => 'belanja',
            'kecamatan' => 'Kecamatan Tanjungsari',
        ]);
    }
}
