<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Order extends Model
{
    use SoftDeletes;

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'id', 'user_id', 'product_name', 'buyer_name', 'phone', 'total', 'qty', 'status',
        'shop_id', 'shop_name', 'kecamatan', 'address', 'items', 'shipping_method',
        'payment_method', 'notes',
    ];

    protected function casts(): array
    {
        return [
            'total' => 'float',
            'qty' => 'integer',
            'items' => 'array',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function shop(): BelongsTo
    {
        return $this->belongsTo(Shop::class);
    }
}
