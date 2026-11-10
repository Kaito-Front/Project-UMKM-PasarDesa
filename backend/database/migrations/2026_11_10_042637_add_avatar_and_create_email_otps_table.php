<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->text('avatar')->nullable()->after('name');
        });

        Schema::create('email_otps', function (Blueprint $table) {
            $table->id();
            $table->string('email')->index();
            $table->string('code', 10);
            $table->string('type', 30)->default('email_verification'); // 'email_verification' | 'password_change'
            $table->timestamp('expires_at');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('email_otps');
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['avatar']);
        });
    }
};
