<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\ReorderSlideshowsRequest;
use App\Http\Requests\StoreSlideshowRequest;
use App\Http\Requests\UpdateSlideshowRequest;
use App\Models\Slideshow;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use RuntimeException;

class SlideshowController extends Controller
{
    private const SLIDESHOWS_KEY = 'slideshows.all';

    private const HOME_SLIDESHOWS_KEY = 'home.slideshows';

    private const CACHE_TTL = 300;

    public function index(): Response
    {
        Gate::authorize('viewAny', Slideshow::class);

        return Inertia::render('admin/slideshows/index', [
            'slideshows' => $this->cachedSlideshows(),
        ]);
    }

    /**
     * Persist the new display order from an ordered list of ids.
     */
    public function reorder(ReorderSlideshowsRequest $request): RedirectResponse
    {
        Gate::authorize('update', Slideshow::class);

        foreach (array_values($request->validated('ids')) as $position => $id) {
            Slideshow::whereKey($id)->update(['position' => $position]);
        }

        $this->forgetSlideshowCaches();

        return redirect()->back()
            ->with('success', 'Urutan slideshow berhasil diperbarui.');
    }

    public function create(): Response
    {
        Gate::authorize('create', Slideshow::class);

        return Inertia::render('admin/slideshows/create');
    }

    public function store(StoreSlideshowRequest $request): RedirectResponse
    {
        Gate::authorize('create', Slideshow::class);

        $path = $this->storeImage($request->file('image'));

        Slideshow::create([
            'image_path' => $path,
            'is_active' => $request->boolean('is_active'),
            'position' => (int) Slideshow::max('position') + 1,
        ]);

        $this->forgetSlideshowCaches();

        return redirect()->route('admin.slideshows.index')
            ->with('success', 'Slideshow berhasil ditambahkan.');
    }

    public function edit(Slideshow $slideshow): Response
    {
        Gate::authorize('update', $slideshow);

        return Inertia::render('admin/slideshows/edit', ['slideshow' => $this->present($slideshow)]);
    }

    public function update(UpdateSlideshowRequest $request, Slideshow $slideshow): RedirectResponse
    {
        Gate::authorize('update', $slideshow);

        if ($request->hasFile('image')) {
            $this->deleteStoredImage($slideshow);

            $slideshow->image_path = $this->storeImage($request->file('image'));
        }

        $slideshow->is_active = $request->boolean('is_active');
        $slideshow->save();

        $this->forgetSlideshowCaches();

        return redirect()->route('admin.slideshows.index')
            ->with('success', 'Slideshow berhasil diperbarui.');
    }

    public function destroy(Slideshow $slideshow): RedirectResponse
    {
        Gate::authorize('delete', $slideshow);

        $this->deleteStoredImage($slideshow);

        $slideshow->delete();

        $this->forgetSlideshowCaches();

        return redirect()->route('admin.slideshows.index')
            ->with('success', 'Slideshow berhasil dihapus.');
    }

    /**
     * The cached full slideshow list shared with the dashboard settings tab.
     *
     * @return array<int, array<string, mixed>>
     */
    private function cachedSlideshows(): array
    {
        /** @var array<int, array<string, mixed>> $slideshows */
        $slideshows = Cache::remember(self::SLIDESHOWS_KEY, self::CACHE_TTL, function (): array {
            return Slideshow::orderBy('position')
                ->latest()
                ->get()
                ->map(fn (Slideshow $slideshow): array => $this->present($slideshow))
                ->values()
                ->all();
        });

        return $slideshows;
    }

    private function forgetSlideshowCaches(): void
    {
        Cache::forget(self::SLIDESHOWS_KEY);
        Cache::forget(self::HOME_SLIDESHOWS_KEY);
    }

    private function storeImage(UploadedFile $file): string
    {
        $path = $file->store('slideshows', 'public');

        if ($path === false) {
            throw new RuntimeException('Gagal menyimpan gambar slideshow.');
        }

        return $path;
    }

    private function deleteStoredImage(Slideshow $slideshow): void
    {
        if (! Str::startsWith($slideshow->image_path, '/')) {
            Storage::disk('public')->delete($slideshow->image_path);
        }
    }

    /**
     * @return array{id: int, image_path: string, image_url: string, is_active: bool, position: int, created_at: ?string}
     */
    private function present(Slideshow $slideshow): array
    {
        return [
            'id' => $slideshow->id,
            'image_path' => $slideshow->image_path,
            'image_url' => Str::startsWith($slideshow->image_path, '/')
                ? asset($slideshow->image_path)
                : Storage::url($slideshow->image_path),
            'is_active' => $slideshow->is_active,
            'position' => $slideshow->position,
            'created_at' => $slideshow->created_at?->toDateTimeString(),
        ];
    }
}
