<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    /**
     * Administrator accounts (super administrators only).
     */
    public function index(): JsonResponse
    {
        return response()->json([
            'users' => User::orderBy('name')->get()->map(fn (User $user) => $this->present($user)),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', Rule::unique('users', 'email')],
            'password' => ['required', 'string', 'min:8'],
            'role' => ['required', Rule::in(User::ROLES)],
        ]);

        $user = User::create([...$validated, 'is_active' => true]);

        return response()->json([
            'message' => 'Administrator created successfully.',
            'user' => $this->present($user),
        ], 201);
    }

    public function update(Request $request, User $user): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'email' => ['sometimes', 'required', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user->id)],
            'role' => ['sometimes', 'required', Rule::in(User::ROLES)],
        ]);

        if (isset($validated['role']) && $validated['role'] !== $user->role && $user->id === $request->user()->id) {
            return response()->json(['message' => 'You cannot change your own role.'], 422);
        }

        $user->update($validated);

        // A changed role should take effect immediately
        if ($user->wasChanged('role')) {
            $user->tokens()->delete();
        }

        return response()->json([
            'message' => 'Administrator updated successfully.',
            'user' => $this->present($user->fresh()),
        ]);
    }

    /**
     * Set a new password for another administrator. They are signed out everywhere.
     */
    public function resetPassword(Request $request, User $user): JsonResponse
    {
        if ($user->id === $request->user()->id) {
            return response()->json(['message' => 'Use My Account to change your own password.'], 422);
        }

        $validated = $request->validate([
            'password' => ['required', 'string', 'min:8'],
        ]);

        $user->update(['password' => $validated['password']]);
        $user->tokens()->delete();

        return response()->json(['message' => 'Password reset. They must sign in again.']);
    }

    /**
     * Activate or deactivate an account. Deactivated accounts are signed out and cannot sign in.
     */
    public function updateStatus(Request $request, User $user): JsonResponse
    {
        $validated = $request->validate([
            'is_active' => ['required', 'boolean'],
        ]);

        if ($user->id === $request->user()->id) {
            return response()->json(['message' => 'You cannot deactivate your own account.'], 422);
        }

        $user->update(['is_active' => $validated['is_active']]);

        if (! $validated['is_active']) {
            $user->tokens()->delete();
        }

        return response()->json([
            'message' => $validated['is_active'] ? 'Account activated.' : 'Account deactivated.',
            'user' => $this->present($user->fresh()),
        ]);
    }

    private function present(User $user): array
    {
        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role,
            'is_active' => $user->is_active,
            'created_at' => $user->created_at?->toIso8601String(),
        ];
    }
}
