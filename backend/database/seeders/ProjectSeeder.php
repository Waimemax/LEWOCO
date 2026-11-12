<?php

namespace Database\Seeders;

use App\Models\Project;
use Illuminate\Database\Seeder;

class ProjectSeeder extends Seeder
{
    /**
     * The projects currently shown on the public website.
     * Safe to run more than once: existing titles are left alone.
     */
    public function run(): void
    {
        $projects = [
            [
                'title' => 'Women Enterprise Development',
                'category' => 'Women-Led Enterprise',
                'description' => 'Supporting women in building and growing sustainable enterprises through practical skills, entrepreneurship and opportunities for economic independence.',
                'icon' => '📈',
            ],
            [
                'title' => 'Women in Woven Crafts',
                'category' => 'Handmade Crafts',
                'description' => 'Promoting handmade woven crafts by women through creative skills development, craftsmanship and opportunities to generate sustainable income.',
                'icon' => '🧺',
            ],
            [
                'title' => 'Youth Beading & Creative Skills',
                'category' => 'Youth Development',
                'description' => 'Encouraging young people to develop beading and other creative skills that can support self-reliance, entrepreneurship and sustainable livelihoods.',
                'icon' => '📿',
            ],
        ];

        foreach ($projects as $index => $project) {
            Project::firstOrCreate(
                ['title' => $project['title']],
                [
                    ...$project,
                    'display_order' => $index + 1,
                    'status' => Project::STATUS_PUBLISHED,
                ],
            );
        }
    }
}
