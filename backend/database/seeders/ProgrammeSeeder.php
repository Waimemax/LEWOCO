<?php

namespace Database\Seeders;

use App\Models\Programme;
use Illuminate\Database\Seeder;

class ProgrammeSeeder extends Seeder
{
    /**
     * The programmes currently shown on the public website.
     * Safe to run more than once: existing titles are left alone.
     */
    public function run(): void
    {
        $programmes = [
            [
                'title' => 'Women-Led Enterprise',
                'description' => 'Supporting women to develop, manage and grow enterprises that promote economic independence and sustainable income opportunities.',
                'icon' => '📈',
            ],
            [
                'title' => 'Women & Youth Development',
                'description' => 'Promoting skills development, capacity building and opportunities that enable women and young people to participate in community development.',
                'icon' => '🤝',
            ],
            [
                'title' => 'Handmade Woven Crafts',
                'description' => 'Supporting women in developing their handmade weaving skills, preserving creative craftsmanship and creating livelihood opportunities.',
                'icon' => '🧺',
            ],
            [
                'title' => 'Youth Beading & Creative Skills',
                'description' => 'Encouraging young people to develop practical beading and creative skills that can support entrepreneurship and self-reliance.',
                'icon' => '📿',
            ],
            [
                'title' => 'Sustainable Livelihoods',
                'description' => 'Promoting sustainable economic opportunities that strengthen household incomes, improve living conditions and support community development.',
                'icon' => '🌱',
            ],
        ];

        foreach ($programmes as $index => $programme) {
            Programme::firstOrCreate(
                ['title' => $programme['title']],
                [
                    ...$programme,
                    'display_order' => $index + 1,
                    'status' => Programme::STATUS_PUBLISHED,
                ],
            );
        }
    }
}
