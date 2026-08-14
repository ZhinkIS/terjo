<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use RuntimeException;

/**
 * Handles avatar uploads to the public disk, respecting the rule that
 * seeded absolute-path images ('/images/...') must never be deleted.
 */
class AvatarService
{
    public function store(UploadedFile $file): string
    {
        $path = $file->store('avatars', 'public');

        if ($path === false) {
            throw new RuntimeException('Gagal menyimpan foto profil.');
        }

        return $path;
    }

    /**
     * Delete a previously uploaded avatar, leaving seeded absolute paths
     * (e.g. '/images/...') untouched.
     */
    public function deleteExisting(?string $url): void
    {
        if ($url === null || Str::startsWith($url, '/images/')) {
            return;
        }

        Storage::disk('public')->delete(Str::after($url, '/storage/'));
    }
}
