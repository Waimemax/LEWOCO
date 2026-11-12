<?php

namespace Database\Seeders;

use App\Models\Resource;
use Illuminate\Database\Seeder;

class ResourceSeeder extends Seeder
{
    /**
     * The resources currently shown on the public website.
     * Safe to run more than once: existing titles are left alone.
     */
    public function run(): void
    {
        $resources = [
            [
                'title' => 'About LEWOCO',
                'category' => 'Organizational Information',
                'description' => 'Learn about Lower Eastern Women Cooperative Society Ltd, its mission and commitment to empowering women and youth in Lower Eastern Kenya.',
                'icon' => '🏢',
            ],
            [
                'title' => 'Women Entrepreneurship',
                'category' => 'Women-Led Enterprise',
                'description' => 'Explore the importance of women-led enterprises, business development and economic independence in strengthening livelihoods.',
                'icon' => '📈',
            ],
            [
                'title' => 'Woven Crafts & Creative Skills',
                'category' => 'Handmade Crafts',
                'description' => 'Discover handmade woven crafts, creative craftsmanship and opportunities for women to develop practical skills.',
                'icon' => '🧺',
            ],
            [
                'title' => 'Youth Beading & Skills Development',
                'category' => 'Youth Development',
                'description' => 'Explore beading, creativity and practical skills that can encourage entrepreneurship and sustainable livelihoods among young people.',
                'icon' => '📿',
            ],
            [
                'title' => 'Building Sustainable Livelihoods',
                'category' => 'Sustainable Livelihoods',
                'description' => 'Understand how skills development, enterprise opportunities and community participation can support lasting economic independence.',
                'icon' => '🌱',
            ],
        ];

        foreach ($resources as $index => $resource) {
            Resource::firstOrCreate(
                ['title' => $resource['title']],
                [
                    ...$resource,
                    'display_order' => $index + 1,
                    'status' => Resource::STATUS_PUBLISHED,
                ],
            );
        }
    }
}
