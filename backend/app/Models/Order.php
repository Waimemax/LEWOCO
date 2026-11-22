<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    public const STATUS_PENDING = 'pending';     // placed and paid, waiting for staff to check the payment
    public const STATUS_APPROVED = 'approved';   // payment verified, order accepted
    public const STATUS_DELIVERED = 'delivered';
    public const STATUS_REJECTED = 'rejected';

    public const STATUSES = [
        self::STATUS_PENDING,
        self::STATUS_APPROVED,
        self::STATUS_DELIVERED,
        self::STATUS_REJECTED,
    ];

    public const STATUS_LABELS = [
        self::STATUS_PENDING => 'Received, awaiting confirmation',
        self::STATUS_APPROVED => 'Approved, being prepared',
        self::STATUS_DELIVERED => 'Delivered',
        self::STATUS_REJECTED => 'Not accepted',
    ];

    protected $fillable = [
        'reference',
        'customer_name',
        'email',
        'phone',
        'delivery_details',
        'customer_notes',
        'total',
        'mpesa_code',
        'status',
        'rejection_reason',
        'admin_notes',
        'approved_at',
        'delivered_at',
    ];

    protected function casts(): array
    {
        return [
            'total' => 'integer',
            'approved_at' => 'datetime',
            'delivered_at' => 'datetime',
        ];
    }

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    /** A short reference without look-alike characters (no 0/O, 1/I/L). */
    public static function newReference(): string
    {
        $alphabet = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';

        do {
            $code = '';
            for ($i = 0; $i < 6; $i++) {
                $code .= $alphabet[random_int(0, strlen($alphabet) - 1)];
            }
            $reference = 'LW-'.$code;
        } while (static::where('reference', $reference)->exists());

        return $reference;
    }

    /** Digits only, so "0712 345 678" and "+254712345678" can be compared by their last 9 digits. */
    public static function phoneKey(string $phone): string
    {
        return substr(preg_replace('/\D+/', '', $phone), -9);
    }

    public function statusLabel(): string
    {
        return self::STATUS_LABELS[$this->status] ?? $this->status;
    }

    public static function money(int $amount): string
    {
        return 'KES '.number_format($amount);
    }

}
