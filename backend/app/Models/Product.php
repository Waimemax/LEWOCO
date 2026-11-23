<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
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
        'image_path',
        'in_stock',
        'display_order',
        'status',
    ];

    /** Added to every JSON response so the website never needs to know about storage paths. */
    protected $appends = ['image_url'];

    protected function casts(): array
    {
        return [
            'price' => 'integer',
            'in_stock' => 'boolean',
            'display_order' => 'integer',
        ];
    }

    protected function imageUrl(): Attribute
    {
        return Attribute::get(
            fn () => $this->image_path ? '/api/media/'.$this->image_path : null
        );
    }
}
