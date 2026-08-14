<?php

namespace App\Http\Controllers\Admin;

use App\Enums\UserStatus;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;

class RegistrationController extends Controller
{
    /**
     * Approve a pending registration.
     */
    public function approve(User $user): RedirectResponse
    {
        Gate::authorize('update', $user);

        $user->status = UserStatus::Approved;
        $user->save();

        return redirect()->back()->with('success', 'Registrasi berhasil disetujui.');
    }

    /**
     * Reject a pending registration by deleting the account.
     */
    public function reject(User $user): RedirectResponse
    {
        Gate::authorize('delete', $user);

        $user->delete();

        return redirect()->back()->with('success', 'Registrasi ditolak dan akun dihapus.');
    }
}
