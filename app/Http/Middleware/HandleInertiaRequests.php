<?php

namespace App\Http\Middleware;

use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $settings = Setting::current();

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'site' => [
                'name' => $settings->site_name ?? config('app.name'),
                'logo_url' => $settings->logo_path
                    ? (Str::startsWith($settings->logo_path, '/')
                        ? asset($settings->logo_path)
                        : Storage::url($settings->logo_path))
                    : null,
            ],
            'auth' => [
                'user' => $request->user()
                    ? [
                        'id' => $request->user()->id,
                        'name' => $request->user()->name,
                        'email' => $request->user()->email,
                        'role' => $request->user()->role->value,
                        'status' => $request->user()->status->value,
                        'profile_picture_url' => $request->user()->profile_picture_url,
                    ]
                    : null,
            ],
            'flash' => [
                'success' => $request->session()->get('success'),
            ],
            'errors' => $request->session()->get('errors')
                ? $request->session()->get('errors')->getBag('default')->toArray()
                : [],
        ];
    }
}
