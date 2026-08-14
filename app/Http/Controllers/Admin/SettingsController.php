<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateSettingsRequest;
use App\Models\Setting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use RuntimeException;

class SettingsController extends Controller
{
    /**
     * Update the site name and logo.
     */
    public function update(UpdateSettingsRequest $request): RedirectResponse
    {
        $settings = Setting::current();
        $settings->site_name = $request->string('site_name')->toString();
        $settings->hero_title = $request->input('hero_title');
        $settings->hero_subtitle = $request->input('hero_subtitle');

        if ($request->hasFile('logo')) {
            if ($settings->logo_path) {
                Storage::disk('public')->delete($settings->logo_path);
            }

            $settings->logo_path = $this->storeLogo($request->file('logo'));
        }

        $settings->save();

        Setting::flushCache();

        return redirect()->back()->with('success', 'Pengaturan situs berhasil diperbarui.');
    }

    private function storeLogo(UploadedFile $file): string
    {
        $path = $file->store('settings', 'public');

        if ($path === false) {
            throw new RuntimeException('Gagal menyimpan logo situs.');
        }

        return $path;
    }
}
