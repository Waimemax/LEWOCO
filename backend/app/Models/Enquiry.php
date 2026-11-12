<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Enquiry extends Model
{
    public const STATUS_NEW = 'new';
    public const STATUS_READ = 'read';
    public const STATUS_RESPONDED = 'responded';

    public const STATUSES = [self::STATUS_NEW, self::STATUS_READ, self::STATUS_RESPONDED];

    /** Must match the options in the public contact form. */
    public const SUBJECTS = [
        'General Enquiry',
        'Membership',
        'Women-Led Enterprise',
        'Handmade Woven Crafts',
        'Youth Beading',
        'Sustainable Livelihoods',
        'Partnership',
        'Other',
    ];

    protected $fillable = [
        'full_name',
        'email',
        'phone',
        'subject',
        'message',
        'status',
        'notes',
    ];
}
