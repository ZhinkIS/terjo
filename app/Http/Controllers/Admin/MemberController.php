<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateMemberRequest;
use App\Models\User;
use App\Services\AvatarService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;

class MemberController extends Controller
{
    public function __construct(private readonly AvatarService $avatar) {}

    /**
     * Update a member's public profile data.
     */
    public function update(UpdateMemberRequest $request, User $user): RedirectResponse
    {
        Gate::authorize('update', $user);

        $user->fill($request->validated());

        if ($request->hasFile('profile_picture')) {
            $this->avatar->deleteExisting($user->profile_picture_url);

            $user->profile_picture_url = Storage::url($this->avatar->store($request->file('profile_picture')));
        }

        $user->save();

        return redirect()->back()->with('success', 'Data anggota berhasil diperbarui.');
    }

    /**
     * Change a member's role (owner/admin/member/slave).
     */
    public function updateRole(Request $request, User $user): RedirectResponse
    {
        Gate::authorize('updateRole', $user);

        $validated = $request->validate([
            'role' => ['required', 'string', 'in:admin,member,slave'],
        ]);

        $user->update(['role' => $validated['role']]);

        return redirect()->back()->with('success', 'Role berhasil diperbarui.');
    }

    /**
     * Remove a member from the community.
     */
    public function destroy(User $user): RedirectResponse
    {
        Gate::authorize('delete', $user);

        $user->delete();

        return redirect()->back()->with('success', 'Anggota berhasil dikeluarkan.');
    }
}
