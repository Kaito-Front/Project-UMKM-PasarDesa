<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Shop;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class AuthController extends Controller
{
    public function register(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'phone' => ['required', 'string', 'max:30', 'unique:users,phone'],
            'password' => ['required', 'string', 'min:6'],
            'role' => ['required', Rule::in(['belanja', 'jualan', 'keduanya'])],
            'shopName' => ['nullable', 'required_if:role,jualan,keduanya', 'string', 'max:255'],
            'shopCategory' => ['nullable', 'string', 'max:255'],
            'kecamatan' => ['nullable', 'string', 'max:255'],
        ]);

        $role = ['belanja' => 'pembeli', 'jualan' => 'penjual', 'keduanya' => 'keduanya'][$data['role']];
        $email = $data['phone'].'@pasardesa.id';
        $shop = null;

        if (in_array($data['role'], ['jualan', 'keduanya'], true)) {
            $category = Category::query()->where('name', $data['shopCategory'] ?? '')->first();
            $shop = Shop::create([
                'id' => 'toko-'.Str::uuid(),
                'name' => $data['shopName'],
                'owner' => $data['name'],
                'category' => $category?->name ?? 'UMKM Desa',
                'category_slug' => $category?->id ?? 'kuliner',
                'kecamatan' => $data['kecamatan'] ?? '',
                'address' => $data['kecamatan'] ?? '',
                'phone' => $data['phone'],
                'whatsapp' => preg_replace('/\D+/', '', $data['phone']),
                'rating' => 0,
                'review_count' => 0,
                'join_date' => now()->translatedFormat('F Y'),
                'operating_hours' => '08.00 - 17.00 WIB',
                'description' => '',
                'status' => 'menunggu',
                'verified' => false,
            ]);
        }

        $user = User::create([
            'name' => $data['name'],
            'email' => $email,
            'phone' => $data['phone'],
            'password' => $data['password'],
            'role' => $role,
            'shop_id' => $shop?->id,
            'shop_name' => $shop?->name,
            'kecamatan' => $data['kecamatan'] ?? null,
        ]);

        return $this->tokenResponse($user, 201);
    }

    public function login(Request $request): JsonResponse
    {
        $data = $request->validate([
            'identifier' => ['required', 'string'],
            'password' => ['required', 'string'],
        ]);

        $user = User::query()->where('email', $data['identifier'])->orWhere('phone', $data['identifier'])->first();

        if (! $user || ! Hash::check($data['password'], $user->password)) {
            return response()->json(['message' => 'Nomor HP/email atau kata sandi tidak cocok.'], 422);
        }

        return $this->tokenResponse($user);
    }

    public function me(Request $request): JsonResponse
    {
        return response()->json($this->serializeUser($request->user()));
    }

    public function updateProfile(Request $request): JsonResponse
    {
        $user = $request->user();

        $data = $request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'phone' => ['sometimes', 'required', 'string', 'max:30', Rule::unique('users', 'phone')->ignore($user->id)],
            'kecamatan' => ['nullable', 'string', 'max:255'],
            'avatar' => ['nullable', 'string'],
        ]);

        $user->update($data);

        // If user is a seller, sync avatar, owner name, and kecamatan to the shop record
        if ($user->shop_id) {
            $shop = Shop::find($user->shop_id);
            if ($shop) {
                $shopUpdate = [];
                if (isset($data['name'])) {
                    $shopUpdate['owner'] = $data['name'];
                }
                if (isset($data['kecamatan'])) {
                    $shopUpdate['kecamatan'] = $data['kecamatan'];
                }
                if (isset($data['avatar'])) {
                    $shopUpdate['avatar'] = $data['avatar'];
                }
                if (!empty($shopUpdate)) {
                    $shop->update($shopUpdate);
                }
            }
        }

        return response()->json($this->serializeUser($user->fresh()));
    }

    public function updateShopProfile(Request $request): JsonResponse
    {
        $user = $request->user();

        if (!$user->shop_id) {
            return response()->json(['message' => 'Akun Anda belum terdaftar sebagai toko UMKM.'], 403);
        }

        $shop = Shop::find($user->shop_id);
        if (!$shop) {
            return response()->json(['message' => 'Data toko tidak ditemukan.'], 404);
        }

        $data = $request->validate([
            'banner' => ['nullable', 'string'],
            'avatar' => ['nullable', 'string'],
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'category' => ['nullable', 'string', 'max:255'],
        ]);

        $shop->update($data);

        // Also sync user shop_name and avatar if updated
        $userUpdate = [];
        if (isset($data['name'])) {
            $userUpdate['shop_name'] = $data['name'];
        }
        if (isset($data['avatar'])) {
            $userUpdate['avatar'] = $data['avatar'];
        }
        if (!empty($userUpdate)) {
            $user->update($userUpdate);
        }

        return response()->json([
            'message' => 'Profil dan banner toko berhasil diperbarui.',
            'shop' => $shop->fresh(),
            'user' => $this->serializeUser($user->fresh()),
        ]);
    }

    public function sendOtp(Request $request): JsonResponse
    {
        $user = $request->user();

        $data = $request->validate([
            'type' => ['required', Rule::in(['email_verification', 'password_change'])],
        ]);

        // Generate 6-digit numeric OTP code
        $code = str_pad((string) random_int(100000, 999999), 6, '0', STR_PAD_LEFT);
        $expiresAt = now()->addMinutes(15);

        // Clean up previous OTPs for this email and type
        DB::table('email_otps')
            ->where('email', $user->email)
            ->where('type', $data['type'])
            ->delete();

        DB::table('email_otps')->insert([
            'email' => $user->email,
            'code' => $code,
            'type' => $data['type'],
            'expires_at' => $expiresAt,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $typeLabel = $data['type'] === 'email_verification' ? 'verifikasi email' : 'penggantian kata sandi';

        return response()->json([
            'message' => "Kode OTP 6-digit untuk {$typeLabel} telah dikirim ke {$user->email}.",
            'code' => $code, // Returned for instant UX toast & seamless verification
            'expires_at' => $expiresAt->toIso8601String(),
        ]);
    }

    public function verifyEmailOtp(Request $request): JsonResponse
    {
        $user = $request->user();

        $data = $request->validate([
            'code' => ['required', 'string', 'size:6'],
        ]);

        $otp = DB::table('email_otps')
            ->where('email', $user->email)
            ->where('type', 'email_verification')
            ->where('code', $data['code'])
            ->where('expires_at', '>', now())
            ->first();

        if (!$otp) {
            return response()->json(['message' => 'Kode OTP 6 digit tidak valid atau sudah kedaluwarsa.'], 422);
        }

        $user->update([
            'email_verified_at' => now(),
        ]);

        DB::table('email_otps')->where('id', $otp->id)->delete();

        return response()->json([
            'message' => 'Email Anda berhasil diverifikasi!',
            'user' => $this->serializeUser($user->fresh()),
        ]);
    }

    public function resetPasswordWithOtp(Request $request): JsonResponse
    {
        $user = $request->user();

        $data = $request->validate([
            'code' => ['required', 'string', 'size:6'],
            'new_password' => ['required', 'string', 'min:6'],
        ]);

        $otp = DB::table('email_otps')
            ->where('email', $user->email)
            ->where('type', 'password_change')
            ->where('code', $data['code'])
            ->where('expires_at', '>', now())
            ->first();

        if (!$otp) {
            return response()->json(['message' => 'Kode OTP 6 digit tidak valid atau sudah kedaluwarsa.'], 422);
        }

        $user->update([
            'password' => $data['new_password'],
        ]);

        DB::table('email_otps')->where('id', $otp->id)->delete();

        // Revoke old tokens for security and issue fresh token
        $user->tokens()->delete();
        $newToken = $user->createToken('frontend')->plainTextToken;

        return response()->json([
            'message' => 'Kata sandi berhasil diperbarui dengan verifikasi email aman.',
            'token' => $newToken,
            'user' => $this->serializeUser($user->fresh()),
        ]);
    }

    public function updatePassword(Request $request): JsonResponse
    {
        $user = $request->user();

        $data = $request->validate([
            'current_password' => ['required', 'string'],
            'new_password' => ['required', 'string', 'min:6'],
        ]);

        if (! Hash::check($data['current_password'], $user->password)) {
            return response()->json(['message' => 'Kata sandi saat ini tidak cocok.'], 422);
        }

        $user->update([
            'password' => $data['new_password'],
        ]);

        // Revoke all existing tokens across all devices for security
        $user->tokens()->delete();

        // Issue a fresh token for this current session
        $newToken = $user->createToken('frontend')->plainTextToken;

        return response()->json([
            'message' => 'Kata sandi berhasil diperbarui. Sesi pada perangkat lain telah diakhiri demi keamanan.',
            'token' => $newToken,
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Berhasil keluar.']);
    }

    private function tokenResponse(User $user, int $status = 200): JsonResponse
    {
        return response()->json([
            'token' => $user->createToken('frontend')->plainTextToken,
            'user' => $this->serializeUser($user),
        ], $status);
    }

    private function serializeUser(User $user): array
    {
        return [
            'id' => (string) $user->id,
            'name' => $user->name,
            'phone' => $user->phone,
            'email' => $user->email,
            'role' => $user->role,
            'avatar' => $user->avatar,
            'shopId' => $user->shop_id,
            'shopName' => $user->shop_name,
            'kecamatan' => $user->kecamatan,
            'isEmailVerified' => !is_null($user->email_verified_at),
            'emailVerifiedAt' => $user->email_verified_at ? $user->email_verified_at->toIso8601String() : null,
        ];
    }
}
