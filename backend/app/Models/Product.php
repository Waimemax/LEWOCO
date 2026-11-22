<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    public const STATUS_DRAFT = 'draft';
    public const STATUS_PUBLISHED = 'published';

    protected $fillable = [
        'name',
        'category',
        'description',
        'price',
        'unit',
        'icon',
        'in_stock',
        'display_order',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'price' => 'integer',
            'in_stock' => 'boolean',
            'display_order' => 'integer',
        ];
    }
}
