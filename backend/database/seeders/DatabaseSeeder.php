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
            'phone' => '081122334455',
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
    }
}
