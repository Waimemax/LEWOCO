<?php

namespace Database\Seeders;

use App\Models\Announcement;
use Illuminate\Database\Seeder;

class AnnouncementSeeder extends Seeder
{
    /**
     * The three items currently shown in the News section of the public website.
     * Safe to run more than once: existing titles are left alone.
     */
    public function run(): void
    {
        $items = [
            [
                'title' => 'Creating Opportunities for Women Entrepreneurs',
                'category' => 'Women-Led Enterprise',
                'description' => 'Explore how women-led enterprises can strengthen economic independence, encourage entrepreneurship and create sustainable livelihood opportunities.',
                'image_url' => 'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=900&q=80',
            ],
            [
                'title' => 'Celebrating Handmade Woven Crafts',
                'category' => 'Handmade Woven Crafts',
                'description' => 'Discover the value of handmade woven crafts in promoting creativity, preserving craftsmanship and supporting women’s economic opportunities.',
                'image_url' => 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=900&q=80',
            ],
            [
                'title' => 'Developing Youth Through Beading and Creative Skills',
                'category' => 'Youth Development',
                'description' => 'Learn how beading and creative skills can encourage young people to explore entrepreneurship, creativity and sustainable livelihoods.',
                'image_url' => 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=900&q=80',
            ],
        ];

        foreach ($items as $item) {
            Announcement::firstOrCreate(
                ['title' => $item['title']],
                [
                    ...$item,
                    'published_at' => null,
                    'status' => Announcement::STATUS_PUBLISHED,
                ],
            );
        }
    }
}
