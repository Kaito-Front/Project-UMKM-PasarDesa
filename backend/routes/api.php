<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\MarketplaceController;
use Illuminate\Support\Facades\Route;

Route::get('/categories', [MarketplaceController::class, 'categories']);
Route::get('/shops', [MarketplaceController::class, 'shops']);
Route::get('/shops/{shop}', [MarketplaceController::class, 'showShop']);
Route::get('/stats', [MarketplaceController::class, 'stats']);
Route::get('/products', [MarketplaceController::class, 'products']);
Route::get('/products/{product}', [MarketplaceController::class, 'showProduct']);

Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/orders', [MarketplaceController::class, 'storeOrder']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::patch('/auth/profile', [AuthController::class, 'updateProfile']);
    Route::patch('/auth/password', [AuthController::class, 'updatePassword']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);

    Route::get('/orders', [MarketplaceController::class, 'orders']);
    Route::get('/orders/{order}', [MarketplaceController::class, 'showOrder']);
    Route::patch('/orders/{order}/status', [MarketplaceController::class, 'updateOrderStatus']);
    Route::delete('/orders/{order}', [MarketplaceController::class, 'destroyOrder']);

    Route::post('/products', [MarketplaceController::class, 'storeProduct']);
    Route::put('/products/{product}', [MarketplaceController::class, 'updateProduct']);
    Route::patch('/products/{product}', [MarketplaceController::class, 'updateProductNumbers']);
    Route::patch('/products/{product}/visibility', [MarketplaceController::class, 'updateVisibility']);
    Route::delete('/products/{product}', [MarketplaceController::class, 'destroyProduct']);

    Route::post('/shops', [MarketplaceController::class, 'storeShop']);
    Route::put('/shops/{shop}', [MarketplaceController::class, 'updateShop']);
    Route::patch('/shops/{shop}', [MarketplaceController::class, 'updateShop']);
    Route::delete('/shops/{shop}', [MarketplaceController::class, 'destroyShop']);

    Route::post('/categories', [MarketplaceController::class, 'storeCategory']);
    Route::put('/categories/{category}', [MarketplaceController::class, 'updateCategory']);
    Route::patch('/categories/{category}', [MarketplaceController::class, 'updateCategory']);
    Route::delete('/categories/{category}', [MarketplaceController::class, 'destroyCategory']);
});
