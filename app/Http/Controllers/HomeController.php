<?php

namespace App\Http\Controllers;

use App\Enums\UserStatus;
use App\Models\Setting;
use App\Models\Slideshow;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    private const SLIDESHOWS_KEY = 'home.slideshows';

    private const DIRECTORY_KEY = 'members.directory';

    private const CACHE_TTL = 300;

    /**
     * Render the community home page. The member directory is only shared
     * with approved, authenticated members to protect member privacy.
     */
    public function __invoke(Request $request): Response
    {
        $slideshows = $this->activeSlideshows();

        $user = $request->user();

        $settings = Setting::current();

        $props = [
            'slideshows' => $slideshows,
            'heroTitle' => $settings->heroTitle(),
            'heroSubtitle' => $settings->heroSubtitle(),
        ];

        if ($user instanceof User && $user->isApproved()) {
            $version = (int) Cache::get(User::DIRECTORY_VERSION_KEY, 0);

            $props['members'] = Cache::remember(
                self::DIRECTORY_KEY.'.v'.$version,
                self::CACHE_TTL,
                fn (): array => $this->directory(),
            );
        }

        return Inertia::render('welcome', $props);
    }

    /**
     * The active hero slideshow, cached so repeated visits skip the query.
     *
     * @return array<int, array<string, mixed>>
     */
    private function activeSlideshows(): array
    {
        /** @var array<int, array<string, mixed>> $slideshows */
        $slideshows = Cache::remember(self::SLIDESHOWS_KEY, self::CACHE_TTL, function (): array {
            return Slideshow::query()
                ->where('is_active', true)
                ->orderBy('position')
                ->latest()
                ->get()
                ->map(fn (Slideshow $slideshow): array => [
                    'id' => $slideshow->id,
                    'image_url' => Str::startsWith($slideshow->image_path, '/')
                        ? asset($slideshow->image_path)
                        : Storage::url($slideshow->image_path),
                ])
                ->values()
                ->all();
        });

        return $slideshows;
    }

    /**
     * The approved member directory, ordered by name.
     *
     * @return array<int, array<string, mixed>>
     */
    private function directory(): array
    {
        return User::query()
            ->where('status', UserStatus::Approved)
            ->orderBy('name')
            ->get()
            ->map(fn (User $user): array => [
                'id' => $user->id,
                'name' => $user->name,
                'role' => $user->role->value,
                'location' => $user->location,
                'age' => $user->age,
                'bio' => $user->bio,
                'profile_picture_url' => $user->profile_picture_url,
            ])
            ->values()
            ->all();
    }
}
