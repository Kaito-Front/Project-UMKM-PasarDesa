<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Order;
use App\Models\Product;
use App\Models\Shop;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class MarketplaceController extends Controller
{
    public function categories(): JsonResponse
    {
        return response()->json(Category::query()->withCount('products')->orderBy('name')->get());
    }

    public function storeCategory(Request $request): JsonResponse
    {
        abort_unless($request->user()->role === 'admin', 403, 'Hanya admin yang dapat menambahkan kategori.');

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:categories,name'],
            'icon' => ['nullable', 'string', 'max:100'],
            'description' => ['nullable', 'string'],
        ]);

        $id = Str::slug($validated['name']);
        if (Category::where('id', $id)->exists()) {
            $id .= '-'.Str::lower(Str::random(4));
        }

        $category = Category::create([
            'id' => $id,
            'name' => $validated['name'],
            'icon' => $validated['icon'] ?? 'Package',
            'description' => $validated['description'] ?? '',
        ]);

        return response()->json($category, 201);
    }

    public function updateCategory(Request $request, Category $category): JsonResponse
    {
        abort_unless($request->user()->role === 'admin', 403, 'Hanya admin yang dapat mengubah kategori.');

        $validated = $request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:255', Rule::unique('categories', 'name')->ignore($category->id)],
            'icon' => ['nullable', 'string', 'max:100'],
            'description' => ['nullable', 'string'],
        ]);

        $category->update($validated);

        return response()->json($category);
    }

    public function destroyCategory(Request $request, Category $category): JsonResponse
    {
        abort_unless($request->user()->role === 'admin', 403, 'Hanya admin yang dapat menghapus kategori.');

        if ($category->products()->count() > 0) {
            return response()->json([
                'message' => 'Kategori ini tidak dapat dihapus karena masih digunakan oleh produk aktif.',
            ], 422);
        }

        $category->delete();

        return response()->json(status: 204);
    }

    public function shops(): JsonResponse
    {
        return response()->json(Shop::query()->withCount('products')->orderBy('name')->get());
    }

    public function showShop(Shop $shop): JsonResponse
    {
        $shop->load(['products' => fn ($q) => $q->where('is_hidden', false)->latest()]);

        return response()->json([
            'id' => $shop->id,
            'name' => $shop->name,
            'owner' => $shop->owner,
            'category' => $shop->category,
            'categorySlug' => $shop->category_slug,
            'kecamatan' => $shop->kecamatan,
            'address' => $shop->address,
            'lat' => $shop->lat,
            'lng' => $shop->lng,
            'phone' => $shop->phone,
            'whatsapp' => $shop->whatsapp,
            'rating' => $shop->rating,
            'reviewCount' => $shop->review_count,
            'joinDate' => $shop->join_date,
            'operatingHours' => $shop->operating_hours,
            'description' => $shop->description,
            'avatar' => $shop->avatar,
            'banner' => $shop->banner,
            'status' => $shop->status,
            'verified' => $shop->verified,
            'productsCount' => $shop->products()->where('is_hidden', false)->count(),
            'products' => $shop->products->map(fn (Product $p) => $this->serializeProduct($p)),
        ]);
    }

    public function storeShop(Request $request): JsonResponse
    {
        $user = $request->user();
        abort_if($user->shop_id, 422, 'Akun ini sudah memiliki toko.');

        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'category' => ['required', 'string', 'max:255'],
            'kecamatan' => ['nullable', 'string', 'max:255'],
            'address' => ['nullable', 'string'],
            'phone' => ['nullable', 'string', 'max:30'],
            'whatsapp' => ['nullable', 'string', 'max:30'],
            'description' => ['nullable', 'string'],
        ]);

        $category = Category::query()->where('name', $data['category'])->orWhere('id', $data['category'])->first();

        $shop = Shop::create([
            'id' => 'toko-'.Str::uuid(),
            'name' => $data['name'],
            'owner' => $user->name,
            'category' => $category?->name ?? $data['category'],
            'category_slug' => $category?->id ?? 'kuliner',
            'kecamatan' => $data['kecamatan'] ?? $user->kecamatan ?? '',
            'address' => $data['address'] ?? '',
            'phone' => $data['phone'] ?? $user->phone ?? '',
            'whatsapp' => preg_replace('/\D+/', '', $data['whatsapp'] ?? $data['phone'] ?? $user->phone ?? ''),
            'rating' => 0,
            'review_count' => 0,
            'join_date' => now()->translatedFormat('F Y'),
            'operating_hours' => '08.00 - 17.00 WIB',
            'description' => $data['description'] ?? '',
            'status' => 'menunggu',
            'verified' => false,
        ]);

        $newRole = $user->role === 'admin' ? 'admin' : 'keduanya';
        $user->update([
            'role' => $newRole,
            'shop_id' => $shop->id,
            'shop_name' => $shop->name,
            'kecamatan' => $shop->kecamatan,
        ]);

        return response()->json($shop, 201);
    }

    public function updateShop(Request $request, Shop $shop): JsonResponse
    {
        $user = $request->user();
        abort_unless($user->role === 'admin' || $shop->id === $user->shop_id, 403, 'Hanya admin atau pemilik toko yang dapat mengubah data toko ini.');

        $validated = $request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'owner' => ['sometimes', 'string', 'max:255'],
            'category' => ['sometimes', 'string', 'max:255'],
            'categorySlug' => ['sometimes', 'string', 'max:255'],
            'kecamatan' => ['nullable', 'string', 'max:255'],
            'address' => ['nullable', 'string'],
            'phone' => ['nullable', 'string', 'max:30'],
            'whatsapp' => ['nullable', 'string', 'max:30'],
            'operatingHours' => ['nullable', 'string', 'max:100'],
            'description' => ['nullable', 'string'],
            'avatar' => ['nullable', 'string'],
            'banner' => ['nullable', 'string'],
            'status' => ['sometimes', Rule::in(['aktif', 'nonaktif', 'menunggu'])],
            'verified' => ['sometimes', 'boolean'],
        ]);

        if ($user->role !== 'admin') {
            unset($validated['status'], $validated['verified']);
        }

        $updateData = [];
        if (isset($validated['name'])) $updateData['name'] = $validated['name'];
        if (isset($validated['owner'])) $updateData['owner'] = $validated['owner'];
        if (isset($validated['category'])) $updateData['category'] = $validated['category'];
        if (isset($validated['categorySlug'])) $updateData['category_slug'] = $validated['categorySlug'];
        if (array_key_exists('kecamatan', $validated)) $updateData['kecamatan'] = $validated['kecamatan'];
        if (array_key_exists('address', $validated)) $updateData['address'] = $validated['address'];
        if (array_key_exists('phone', $validated)) $updateData['phone'] = $validated['phone'];
        if (array_key_exists('whatsapp', $validated)) $updateData['whatsapp'] = preg_replace('/\D+/', '', (string) $validated['whatsapp']);
        if (array_key_exists('operatingHours', $validated)) $updateData['operating_hours'] = $validated['operatingHours'];
        if (array_key_exists('description', $validated)) $updateData['description'] = $validated['description'];
        if (array_key_exists('avatar', $validated)) $updateData['avatar'] = $validated['avatar'];
        if (array_key_exists('banner', $validated)) $updateData['banner'] = $validated['banner'];
        if (isset($validated['status'])) $updateData['status'] = $validated['status'];
        if (isset($validated['verified'])) $updateData['verified'] = $validated['verified'];

        $shop->update($updateData);

        if (isset($updateData['name']) && $user->shop_id === $shop->id) {
            $user->update(['shop_name' => $updateData['name']]);
        }

        return response()->json($shop);
    }

    public function destroyShop(Request $request, Shop $shop): JsonResponse
    {
        abort_unless($request->user()->role === 'admin', 403, 'Hanya admin yang dapat menghapus toko.');
        $shop->delete();

        return response()->json(status: 204);
    }

    public function stats(): JsonResponse
    {
        $months = collect(range(5, 0))->map(fn (int $monthsAgo) => now()->startOfMonth()->subMonths($monthsAgo));
        $completedOrders = Order::query()
            ->whereIn('status', ['diambil', 'selesai'])
            ->where('created_at', '>=', $months->first())
            ->get(['total', 'created_at']);
        $monthlyPerformance = $months->map(function ($month) use ($completedOrders) {
            $orders = $completedOrders->filter(fn (Order $order) => $order->created_at?->format('Y-m') === $month->format('Y-m'));

            return [
                'period' => $month->format('Y-m'),
                'transactions' => $orders->count(),
                'turnover' => (float) $orders->sum('total'),
            ];
        })->values();

        return response()->json([
            'totalUmkm' => Shop::query()->where('status', 'aktif')->count(),
            'totalProducts' => Product::query()->where('is_hidden', false)->count(),
            'totalTransactions' => Order::query()->count(),
            'turnoverThisMonth' => (float) Order::query()->whereIn('status', ['diambil', 'selesai'])->whereMonth('created_at', now()->month)->whereYear('created_at', now()->year)->sum('total'),
            'activeKecamatan' => Shop::query()->where('status', 'aktif')->distinct()->count('kecamatan'),
            'monthlyPerformance' => $monthlyPerformance,
        ]);
    }

    public function products(Request $request): JsonResponse
    {
        $user = $request->user('sanctum');

        $products = Product::query()
            ->with(['category', 'shop'])
            ->when(! ($request->boolean('include_hidden') && ($user?->role === 'admin' || in_array($user?->role, ['penjual', 'keduanya'], true))), function ($query) use ($user, $request) {
                if ($request->boolean('include_hidden') && $user?->shop_id) {
                    $query->where(function ($q) use ($user) {
                        $q->where('is_hidden', false)->orWhere('shop_id', $user->shop_id);
                    });
                } else {
                    $query->where('is_hidden', false);
                }
            })
            ->when($request->filled('category') && $request->string('category') !== 'semua', fn ($query) => $query->where('category_id', $request->string('category')))
            ->when($request->filled('shop_id'), fn ($query) => $query->where('shop_id', $request->string('shop_id')))
            ->when($request->filled('search'), fn ($query) => $query->where(function ($q) use ($request) {
                $term = '%'.$request->string('search').'%';
                $q->where('name', 'like', $term)->orWhere('description', 'like', $term);
            }))
            ->latest()
            ->get()
            ->map(fn (Product $product) => $this->serializeProduct($product));

        return response()->json($products);
    }

    public function showProduct(Product $product): JsonResponse
    {
        return response()->json($this->serializeProduct($product->load(['category', 'shop'])));
    }

    public function storeProduct(Request $request): JsonResponse
    {
        abort_unless(in_array($request->user()->role, ['admin', 'penjual', 'keduanya'], true), 403, 'Akun ini tidak memiliki toko penjual.');
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'price' => ['required', 'numeric', 'min:0'],
            'originalPrice' => ['nullable', 'numeric', 'min:0'],
            'category' => ['required', 'string', Rule::exists('categories', 'id')],
            'shopId' => ['required', 'string', Rule::exists('shops', 'id')],
            'kecamatan' => ['nullable', 'string', 'max:255'],
            'stock' => ['required', 'integer', 'min:0'],
            'images' => ['nullable', 'array'],
            'images.*' => ['string', 'max:2048'],
            'description' => ['nullable', 'string'],
            'specifications' => ['nullable', 'array'],
            'reviews' => ['nullable', 'array'],
        ]);
        abort_unless($request->user()->role === 'admin' || $validated['shopId'] === $request->user()->shop_id, 403, 'Produk hanya dapat ditambahkan ke toko milik akun ini.');

        $product = Product::create([
            'id' => 'prod-'.Str::uuid(),
            'name' => $validated['name'],
            'price' => $validated['price'],
            'original_price' => $validated['originalPrice'] ?? null,
            'category_id' => $validated['category'],
            'shop_id' => $validated['shopId'],
            'kecamatan' => $validated['kecamatan'] ?? null,
            'stock' => $validated['stock'],
            'images' => $validated['images'] ?? [],
            'description' => $validated['description'] ?? '',
            'specifications' => $validated['specifications'] ?? [],
            'reviews' => $validated['reviews'] ?? [],
            'rating' => 5,
            'sold' => 0,
            'is_new' => true,
        ]);

        return response()->json($this->serializeProduct($product->load(['category', 'shop'])), 201);
    }

    public function updateProduct(Request $request, Product $product): JsonResponse
    {
        $user = $request->user();
        abort_unless($user->role === 'admin' || $product->shop_id === $user->shop_id, 403, 'Produk ini bukan milik toko akun ini.');

        $validated = $request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'price' => ['sometimes', 'required', 'numeric', 'min:0'],
            'originalPrice' => ['nullable', 'numeric', 'min:0'],
            'category' => ['sometimes', 'required', 'string', Rule::exists('categories', 'id')],
            'stock' => ['sometimes', 'required', 'integer', 'min:0'],
            'kecamatan' => ['nullable', 'string', 'max:255'],
            'images' => ['nullable', 'array'],
            'images.*' => ['string'],
            'description' => ['nullable', 'string'],
            'specifications' => ['nullable', 'array'],
            'reviews' => ['nullable', 'array'],
        ]);

        $data = [];
        if (isset($validated['name'])) $data['name'] = $validated['name'];
        if (isset($validated['price'])) $data['price'] = $validated['price'];
        if (array_key_exists('originalPrice', $validated)) $data['original_price'] = $validated['originalPrice'];
        if (isset($validated['category'])) $data['category_id'] = $validated['category'];
        if (isset($validated['stock'])) $data['stock'] = $validated['stock'];
        if (array_key_exists('kecamatan', $validated)) $data['kecamatan'] = $validated['kecamatan'];
        if (isset($validated['images'])) $data['images'] = $validated['images'];
        if (array_key_exists('description', $validated)) $data['description'] = $validated['description'] ?? '';
        if (isset($validated['specifications'])) $data['specifications'] = $validated['specifications'];
        if (isset($validated['reviews'])) $data['reviews'] = $validated['reviews'];

        $product->update($data);

        return response()->json($this->serializeProduct($product->fresh(['category', 'shop'])));
    }

    public function updateProductNumbers(Request $request, Product $product): JsonResponse
    {
        return $this->updateProduct($request, $product);
    }

    public function updateVisibility(Request $request, Product $product): JsonResponse
    {
        abort_unless($request->user()->role === 'admin' || $product->shop_id === $request->user()->shop_id, 403, 'Produk ini bukan milik toko akun ini.');
        $validated = $request->validate(['isHidden' => ['required', 'boolean']]);
        $product->update(['is_hidden' => $validated['isHidden']]);

        return response()->json($this->serializeProduct($product->load(['category', 'shop'])));
    }

    public function destroyProduct(Request $request, Product $product): JsonResponse
    {
        abort_unless($request->user()->role === 'admin' || $product->shop_id === $request->user()->shop_id, 403, 'Produk ini bukan milik toko akun ini.');
        $product->delete();

        return response()->json(status: 204);
    }

    public function orders(Request $request): JsonResponse
    {
        $user = $request->user();
        $query = Order::query()->latest();

        if ($user->role === 'admin') {
        } elseif (in_array($user->role, ['penjual', 'keduanya'], true) && ($user->shop_name || $user->shop_id)) {
            $query->where(function ($q) use ($user) {
                if ($user->shop_id) {
                    $q->where('shop_id', $user->shop_id)
                        ->orWhere('items', 'like', '%"shopId":"'.$user->shop_id.'"%')
                        ->orWhere('items', 'like', '%"shop_id":"'.$user->shop_id.'"%');
                }
                if ($user->shop_name) {
                    $q->orWhere('shop_name', 'like', '%'.$user->shop_name.'%');
                }
            });
        } else {
            $query->where(function ($q) use ($user) {
                $q->where('user_id', $user->id)
                    ->orWhere('phone', $user->phone)
                    ->orWhere('buyer_name', $user->name);
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->string('status'));
        }

        return response()->json($query->get()->map(fn (Order $order) => $this->serializeOrder($order)));
    }

    public function showOrder(Request $request, Order $order): JsonResponse
    {
        $user = $request->user();
        $isOwnerSeller = ($user->shop_id && $order->shop_id === $user->shop_id)
            || ($user->shop_name && str_contains($order->shop_name, $user->shop_name))
            || ($user->shop_id && str_contains(json_encode($order->items), (string) $user->shop_id));
        $isBuyer = ($order->user_id && $order->user_id === $user->id)
            || $order->phone === $user->phone
            || $order->buyer_name === $user->name;

        abort_unless($user->role === 'admin' || $isOwnerSeller || $isBuyer, 403, 'Anda tidak memiliki hak akses melihat pesanan ini.');

        return response()->json($this->serializeOrder($order));
    }

    public function storeOrder(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'buyerName' => ['required', 'string', 'max:255'],
            'phone' => ['required', 'string', 'max:30'],
            'kecamatan' => ['nullable', 'string', 'max:255'],
            'address' => ['required', 'string'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.productId' => ['required', 'string', Rule::exists('products', 'id')],
            'items.*.qty' => ['required', 'integer', 'min:1'],
            'items.*.note' => ['nullable', 'string', 'max:1000'],
            'shippingMethod.name' => ['required', 'string', 'max:255'],
            'shippingMethod.price' => ['required', 'numeric', 'min:0'],
            'paymentMethod.name' => ['required', 'string', 'max:255'],
            'notes' => ['nullable', 'string', 'max:1000'],
        ]);

        $authUser = $request->user('sanctum');

        $order = DB::transaction(function () use ($validated, $authUser) {
            $productIds = collect($validated['items'])->pluck('productId')->unique();
            $products = Product::query()->with(['category', 'shop'])->whereIn('id', $productIds)->lockForUpdate()->get()->keyBy('id');
            $items = collect($validated['items'])->map(function (array $item) use ($products) {
                $product = $products->get($item['productId']);
                abort_if(! $product || $product->is_hidden, 422, 'Produk ini tidak tersedia untuk dipesan.');

                return [
                    'id' => 'cart-'.Str::uuid(),
                    'productId' => $product->id,
                    'product' => $this->serializeProduct($product),
                    'qty' => (int) $item['qty'],
                    'note' => $item['note'] ?? '',
                ];
            });
            $quantities = $items->groupBy('productId')->map(fn ($productItems) => $productItems->sum('qty'));

            foreach ($quantities as $productId => $quantity) {
                $product = $products->get($productId);
                abort_if($quantity > $product->stock, 422, "Jumlah pesanan untuk {$product->name} melebihi stok yang tersedia.");
                $product->decrement('stock', $quantity);
                $product->increment('sold', $quantity);
            }

            $totalItems = $items->sum('qty');
            $subtotal = $items->sum(fn (array $item) => $item['product']['price'] * $item['qty']);
            $shippingCost = (float) $validated['shippingMethod']['price'];
            $firstProduct = $items->first()['product'];

            $allShopNames = $items->pluck('product.shopName')->filter()->unique()->values();
            $shopDisplayName = $allShopNames->count() > 1
                ? $allShopNames->first().' (+'.($allShopNames->count() - 1).' toko lain)'
                : ($firstProduct['shopName'] ?? 'Toko Desa');

            return Order::create([
                'id' => 'ORD-'.now()->format('Y').'-'.Str::upper(Str::random(6)),
                'user_id' => $authUser?->id,
                'product_name' => count($items) === 1 ? $firstProduct['name'] : $firstProduct['name'].' (+'.(count($items) - 1).' produk lainnya)',
                'buyer_name' => $validated['buyerName'],
                'phone' => $validated['phone'],
                'total' => $subtotal + $shippingCost,
                'qty' => $totalItems,
                'status' => 'diproses',
                'shop_id' => $firstProduct['shopId'] ?? null,
                'shop_name' => $shopDisplayName,
                'kecamatan' => $validated['kecamatan'] ?? $firstProduct['kecamatan'],
                'address' => $validated['address'],
                'items' => $items->all(),
                'shipping_method' => $validated['shippingMethod']['name'],
                'payment_method' => $validated['paymentMethod']['name'],
                'notes' => $validated['notes'] ?? '',
            ]);
        });

        return response()->json($this->serializeOrder($order), 201);
    }

    public function updateOrderStatus(Request $request, Order $order): JsonResponse
    {
        $user = $request->user();
        $isOwnerSeller = ($user->shop_id && $order->shop_id === $user->shop_id)
            || ($user->shop_name && str_contains($order->shop_name, $user->shop_name))
            || ($user->shop_id && str_contains(json_encode($order->items), (string) $user->shop_id));

        abort_unless(
            $user->role === 'admin' || $isOwnerSeller,
            403,
            'Hanya admin atau pemilik toko yang dapat mengubah status pesanan ini.'
        );

        $validated = $request->validate(['status' => ['required', Rule::in(['diproses', 'diambil', 'dikirim', 'selesai', 'ditolak'])]]);

        $previousStatus = $order->status;
        $newStatus = $validated['status'];

        if ($previousStatus !== $newStatus) {
            DB::transaction(function () use ($order, $previousStatus, $newStatus) {
                $order->update(['status' => $newStatus]);

                // Jika pesanan ditolak/dibatalkan, kembalikan stok & kurangi angka terjual
                if ($newStatus === 'ditolak' && $previousStatus !== 'ditolak') {
                    foreach ($order->items ?? [] as $item) {
                        $productId = $item['productId'] ?? $item['product']['id'] ?? null;
                        $qty = (int) ($item['qty'] ?? 0);
                        if ($productId && $qty > 0) {
                            $product = Product::withTrashed()->find($productId);
                            if ($product) {
                                $product->increment('stock', $qty);
                                $product->decrement('sold', min($qty, $product->sold));
                            }
                        }
                    }
                }

                // Jika sebelumnya ditolak lalu dipulihkan kembali ke aktif, potong kembali stoknya
                if ($previousStatus === 'ditolak' && $newStatus !== 'ditolak') {
                    foreach ($order->items ?? [] as $item) {
                        $productId = $item['productId'] ?? $item['product']['id'] ?? null;
                        $qty = (int) ($item['qty'] ?? 0);
                        if ($productId && $qty > 0) {
                            $product = Product::withTrashed()->find($productId);
                            if ($product) {
                                abort_if($qty > $product->stock, 422, "Stok produk {$product->name} tidak mencukupi untuk memulihkan pesanan.");
                                $product->decrement('stock', $qty);
                                $product->increment('sold', $qty);
                            }
                        }
                    }
                }
            });
        }

        return response()->json($this->serializeOrder($order));
    }

    public function destroyOrder(Request $request, Order $order): JsonResponse
    {
        $user = $request->user();
        $isBuyer = ($order->user_id && $order->user_id === $user->id) || $order->phone === $user->phone;
        $isAdmin = $user->role === 'admin';

        abort_unless($isAdmin || ($isBuyer && in_array($order->status, ['diproses', 'ditolak'], true)), 403, 'Pesanan tidak dapat dibatalkan atau dihapus.');

        DB::transaction(function () use ($order) {
            if ($order->status !== 'ditolak') {
                foreach ($order->items ?? [] as $item) {
                    $productId = $item['productId'] ?? $item['product']['id'] ?? null;
                    $qty = (int) ($item['qty'] ?? 0);
                    if ($productId && $qty > 0) {
                        $product = Product::withTrashed()->find($productId);
                        if ($product) {
                            $product->increment('stock', $qty);
                            $product->decrement('sold', min($qty, $product->sold));
                        }
                    }
                }
            }
            $order->delete();
        });

        return response()->json(status: 204);
    }

    private function serializeProduct(Product $product): array
    {
        return [
            'id' => $product->id,
            'name' => $product->name,
            'price' => $product->price,
            'originalPrice' => $product->original_price,
            'category' => $product->category_id,
            'categoryName' => $product->category?->name,
            'shopId' => $product->shop_id,
            'shopName' => $product->shop?->name,
            'kecamatan' => $product->kecamatan ?? $product->shop?->kecamatan,
            'stock' => $product->stock,
            'rating' => $product->rating,
            'sold' => $product->sold,
            'isFeatured' => $product->is_featured,
            'isPopular' => $product->is_popular,
            'isNew' => $product->is_new,
            'isHidden' => $product->is_hidden,
            'images' => $product->images ?? [],
            'description' => $product->description,
            'specifications' => $product->specifications ?? [],
            'reviews' => $product->reviews ?? [],
        ];
    }

    private function serializeOrder(Order $order): array
    {
        return [
            'id' => $order->id,
            'userId' => $order->user_id,
            'productName' => $order->product_name,
            'buyerName' => $order->buyer_name,
            'phone' => $order->phone,
            'date' => $order->created_at?->format('d M Y'),
            'createdAt' => $order->created_at?->toIso8601String(),
            'total' => $order->total,
            'qty' => $order->qty,
            'status' => $order->status,
            'shopId' => $order->shop_id,
            'shopName' => $order->shop_name,
            'kecamatan' => $order->kecamatan,
            'address' => $order->address,
            'items' => $order->items ?? [],
            'shippingMethod' => $order->shipping_method,
            'paymentMethod' => $order->payment_method,
            'notes' => $order->notes,
        ];
    }
}
