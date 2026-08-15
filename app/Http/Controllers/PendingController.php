<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PendingController extends Controller
{
    /**
     * Render the pending-approval page. Approved members are sent home
     * instead of being allowed to see the quarantine page again.
     */
    public function index(Request $request): Response|RedirectResponse
    {
        $user = $request->user();

        if ($user instanceof User && $user->isApproved()) {
            return redirect()->route('home');
        }

        return Inertia::render('pending');
    }

    /**
     * Lightweight status probe polled by the pending page so a member is
     * bounced into the community the moment they are approved.
     */
    public function status(Request $request): JsonResponse
    {
        $user = $request->user();

        $status = match (true) {
            $user === null => 'deleted',
            $user->isApproved() => 'approved',
            default => 'pending',
        };

        return response()->json(['status' => $status]);
    }
}
