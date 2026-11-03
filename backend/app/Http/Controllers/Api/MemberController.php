<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Member;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class MemberController extends Controller
{
    /**
     * Display all members with search and filtering.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Member::query();

        if ($request->filled('search')) {
            $search = $request->input('search');

            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'ilike', "%{$search}%")
                    ->orWhere('last_name', 'ilike', "%{$search}%")
                    ->orWhere('membership_number', 'ilike', "%{$search}%")
                    ->orWhere('phone', 'ilike', "%{$search}%")
                    ->orWhere('email', 'ilike', "%{$search}%");
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }

        return response()->json(
            $query->orderByDesc('created_at')->paginate(15)
        );
    }

    /**
     * Register a new cooperative member.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'gender' => ['nullable', 'string', 'max:50'],
            'date_of_birth' => ['nullable', 'date', 'before:today'],
            'phone' => ['required', 'string', 'max:30'],
            'email' => ['nullable', 'email', 'max:255', Rule::unique('members', 'email')],
            'physical_address' => ['nullable', 'string'],
            'county' => ['nullable', 'string', 'max:255'],
            'membership_date' => ['nullable', 'date'],
        ]);

        do {
            $membershipNumber = 'LEW-' . now()->format('Y') . '-' . Str::upper(Str::random(6));
        } while (Member::where('membership_number', $membershipNumber)->exists());

        $member = Member::create([
            ...$validated,
            'membership_number' => $membershipNumber,
            'membership_date' => $validated['membership_date'] ?? now()->toDateString(),
            'status' => 'active',
        ]);

        return response()->json([
            'message' => 'Member registered successfully.',
            'member' => $member,
        ], 201);
    }

    /**
     * Display one member.
     */
    public function show(Member $member): JsonResponse
    {
        return response()->json([
            'member' => $member,
        ]);
    }

    /**
     * Update member details.
     */
    public function update(Request $request, Member $member): JsonResponse
    {
        $validated = $request->validate([
            'first_name' => ['sometimes', 'required', 'string', 'max:255'],
            'last_name' => ['sometimes', 'required', 'string', 'max:255'],
            'gender' => ['sometimes', 'nullable', 'string', 'max:50'],
            'date_of_birth' => ['sometimes', 'nullable', 'date', 'before:today'],
            'phone' => ['sometimes', 'required', 'string', 'max:30'],
            'email' => [
                'sometimes',
                'nullable',
                'email',
                'max:255',
                Rule::unique('members', 'email')->ignore($member->id),
            ],
            'physical_address' => ['sometimes', 'nullable', 'string'],
            'county' => ['sometimes', 'nullable', 'string', 'max:255'],
            'membership_date' => ['sometimes', 'required', 'date'],
        ]);

        $member->update($validated);

        return response()->json([
            'message' => 'Member updated successfully.',
            'member' => $member->fresh(),
        ]);
    }

    /**
     * Activate or deactivate a member.
     */
    public function updateStatus(Request $request, Member $member): JsonResponse
    {
        $validated = $request->validate([
            'status' => ['required', Rule::in(['active', 'inactive'])],
        ]);

        $member->update([
            'status' => $validated['status'],
        ]);

        return response()->json([
            'message' => 'Member status updated successfully.',
            'member' => $member->fresh(),
        ]);
    }
}