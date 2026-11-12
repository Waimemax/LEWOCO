<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Announcement extends Model
{
    public const STATUS_DRAFT = 'draft';
    public const STATUS_PUBLISHED = 'published';

    protected $fillable = [
        'title',
        'category',
        'description',
        'image_url',
        'published_at',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'published_at' => 'date',
        ];
    }
}
