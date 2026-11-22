<?php

return [
    /*
    | Where new website enquiries are emailed. Leave empty to turn emails off
    | (enquiries are still saved and shown in the admin area).
    | Read through config so it keeps working when `php artisan config:cache` is used.
    */
    'enquiry_notify_email' => env('ENQUIRY_NOTIFY_EMAIL'),

    /*
    | Where new shop orders are emailed. Falls back to the enquiry address.
    */
    'order_notify_email' => env('ORDER_NOTIFY_EMAIL', env('ENQUIRY_NOTIFY_EMAIL')),

    /*
    | M-Pesa details shown to customers at checkout (they pay from their own phone).
    | MPESA_METHOD: "till" (Buy Goods) or "paybill".
    */
    'mpesa' => [
        'method' => env('MPESA_METHOD', 'till'),
        'number' => env('MPESA_NUMBER'),
        'account_name' => env('MPESA_ACCOUNT_NAME', 'LEWOCO'),
    ],
];
