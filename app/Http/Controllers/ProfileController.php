<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateProfileRequest;
use App\Models\User;
use App\Services\AvatarService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;

class ProfileController extends Controller
{
    public function __construct(private readonly AvatarService $avatar) {}

    /**
     * Update the authenticated user's own profile.
     */
    public function update(UpdateProfileRequest $request): RedirectResponse
    {
        $user = $request->user();

        if (! $user instanceof User) {
            abort(403);
        }

        Gate::authorize('update', $user);

        $user->fill($request->validated());

        if ($request->hasFile('profile_picture')) {
            $this->avatar->deleteExisting($user->profile_picture_url);

            $user->profile_picture_url = Storage::url($this->avatar->store($request->file('profile_picture')));
        }

        $user->save();

        return redirect()->back()->with('success', 'Profil berhasil diperbarui.');
    }
}
