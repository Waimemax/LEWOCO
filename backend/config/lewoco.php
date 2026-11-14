<?php

return [
    /*
    | Where new website enquiries are emailed. Leave empty to turn emails off
    | (enquiries are still saved and shown in the admin area).
    | Read through config so it keeps working when `php artisan config:cache` is used.
    */
    'enquiry_notify_email' => env('ENQUIRY_NOTIFY_EMAIL'),
];
