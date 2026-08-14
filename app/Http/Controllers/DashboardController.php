<?php

namespace App\Http\Controllers;

use App\Enums\UserRole;
use App\Enums\UserStatus;
use App\Models\Setting;
use App\Models\Slideshow;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    private const SLIDESHOWS_KEY = 'slideshows.all';

    private const MEMBERS_KEY = 'dashboard.members';

    private const PENDING_KEY = 'dashboard.pending';

    private const CACHE_TTL = 300;

    /**
     * Render the role-aware dashboard panel.
     */
    public function __invoke(): Response
    {
        $user = Auth::user();

        if (! $user instanceof User) {
            abort(403);
        }

        $members = [];
        $pendingRegistrations = [];
        $slideshows = [];

        if ($user->role->canManageSettings()) {
            $version = (int) Cache::get(User::DIRECTORY_VERSION_KEY, 0);

            $slideshows = $this->slideshows();
            $members = $this->membersDirectory($user, $version);
            $pendingRegistrations = $this->pendingRegistrations($version);
        }

        $settings = Setting::current();

        return Inertia::render('dashboard', [
            'members' => $members,
            'pendingRegistrations' => $pendingRegistrations,
            'slideshows' => $slideshows,
            'settings' => [
                'site_name' => $settings->site_name ?? config('app.name'),
                'hero_title' => $settings->heroTitle(),
                'hero_subtitle' => $settings->heroSubtitle(),
                'logo_url' => $settings->logo_path
                    ? (Str::startsWith($settings->logo_path, '/')
                        ? asset($settings->logo_path)
                        : Storage::url($settings->logo_path))
                    : null,
            ],
        ]);
    }

    /**
     * Every slideshow for the management panels, shared with the admin
     * slideshow pages via the same cache key.
     *
     * @return array<int, array<string, mixed>>
     */
    private function slideshows(): array
    {
        /** @var array<int, array<string, mixed>> $slideshows */
        $slideshows = Cache::remember(self::SLIDESHOWS_KEY, self::CACHE_TTL, function (): array {
            return Slideshow::query()
                ->orderBy('position')
                ->latest()
                ->get()
                ->map(fn (Slideshow $slideshow): array => [
                    'id' => $slideshow->id,
                    'image_path' => $slideshow->image_path,
                    'image_url' => Str::startsWith($slideshow->image_path, '/')
                        ? asset($slideshow->image_path)
                        : Storage::url($slideshow->image_path),
                    'is_active' => $slideshow->is_active,
                    'position' => $slideshow->position,
                    'created_at' => $slideshow->created_at?->toDateTimeString(),
                ])
                ->values()
                ->all();
        });

        return $slideshows;
    }

    /**
     * The manage list for the current viewer, cached per user so the
     * self-exclusion and role filter stay correct.
     *
     * @return array<int, array<string, mixed>>
     */
    private function membersDirectory(User $user, int $version): array
    {
        /** @var array<int, array<string, mixed>> $members */
        $members = Cache::remember(
            self::MEMBERS_KEY.'.v'.$version.'.'.$user->id,
            self::CACHE_TTL,
            function () use ($user): array {
                return User::query()
                    ->where('status', UserStatus::Approved)
                    ->whereKeyNot($user->id)
                    ->when($user->isAdmin(), fn ($query) => $query->where('role', UserRole::Member))
                    ->orderBy('name')
                    ->get()
                    ->map(fn (User $member): array => [
                        'id' => $member->id,
                        'name' => $member->name,
                        'email' => $member->email,
                        'role' => $member->role->value,
                        'bio' => $member->bio,
                        'age' => $member->age,
                        'location' => $member->location,
                        'profile_picture_url' => $member->profile_picture_url,
                    ])
                    ->values()
                    ->all();
            },
        );

        return $members;
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function pendingRegistrations(int $version): array
    {
        /** @var array<int, array<string, mixed>> $pendingRegistrations */
        $pendingRegistrations = Cache::remember(
            self::PENDING_KEY.'.v'.$version,
            self::CACHE_TTL,
            function (): array {
                return User::query()
                    ->where('status', UserStatus::Pending)
                    ->latest()
                    ->get()
                    ->map(fn (User $user): array => [
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email,
                        'bio' => $user->bio,
                        'age' => $user->age,
                        'location' => $user->location,
                        'profile_picture_url' => $user->profile_picture_url,
                        'created_at' => $user->created_at?->toDateTimeString(),
                    ])
                    ->values()
                    ->all();
            },
        );

        return $pendingRegistrations;
    }
}
