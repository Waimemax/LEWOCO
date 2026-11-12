<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TrainingEvent extends Model
{
    public const STATUS_DRAFT = 'draft';
    public const STATUS_PUBLISHED = 'published';

    public const TYPES = ['training', 'workshop', 'meeting', 'event', 'other'];

    protected $fillable = [
        'title',
        'type',
        'description',
        'venue',
        'start_date',
        'end_date',
        'start_time',
        'end_time',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'start_date' => 'date',
            'end_date' => 'date',
        ];
    }
}
