<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

class MediaController extends Controller
{
    /**
     * Serve an uploaded product photo. Going through Laravel means no storage:link,
     * no extra web-server rules and no separate proxy setting are needed.
     * The route only accepts plain file names (letters, numbers, dashes) with an image extension.
     */
    public function product(string $filename): StreamedResponse
    {
        $path = 'products/'.$filename;
        $disk = Storage::disk('public');

        abort_unless($disk->exists($path), 404);

        return $disk->response($path, null, [
            // File names are random and never reused, so browsers can keep them for a week
            'Cache-Control' => 'public, max-age=604800',
            'X-Content-Type-Options' => 'nosniff',
        ]);
    }
}
