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
use RuntimeException;

class SlideshowController extends Controller
{
    private const SLIDESHOWS_KEY = 'slideshows.all';

    private const HOME_SLIDESHOWS_KEY = 'home.slideshows';

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

        return redirect()->back()
            ->with('success', 'Slideshow berhasil ditambahkan.');
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

        return redirect()->back()
            ->with('success', 'Slideshow berhasil diperbarui.');
    }

    public function destroy(Slideshow $slideshow): RedirectResponse
    {
        Gate::authorize('delete', $slideshow);

        $this->deleteStoredImage($slideshow);

        $slideshow->delete();

        $this->forgetSlideshowCaches();

        return redirect()->back()
            ->with('success', 'Slideshow berhasil dihapus.');
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
}
