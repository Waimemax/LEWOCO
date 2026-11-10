<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        $email = env('ADMIN_EMAIL');
        $password = env('ADMIN_PASSWORD');

        if (! $email || ! $password) {
            $this->command?->error('Set ADMIN_EMAIL and ADMIN_PASSWORD in .env first.');
            return;
        }

        // Super administrator. 'password' is cast to hashed on the model.
        User::updateOrCreate(
            ['email' => $email],
            [
                'name' => env('ADMIN_NAME', 'LEWOCO Super Administrator'),
                'password' => $password,
                'role' => User::ROLE_SUPER_ADMIN,
            ],
        );

        // Optional content administrator
        $contentEmail = env('CONTENT_ADMIN_EMAIL');
        $contentPassword = env('CONTENT_ADMIN_PASSWORD');

        if ($contentEmail && $contentPassword) {
            User::updateOrCreate(
                ['email' => $contentEmail],
                [
                    'name' => env('CONTENT_ADMIN_NAME', 'LEWOCO Content Administrator'),
                    'password' => $contentPassword,
                    'role' => User::ROLE_CONTENT_ADMIN,
                ],
            );
        }
    }
}
